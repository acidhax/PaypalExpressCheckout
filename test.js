var express = require('express'), 
http = require('http');

var app = express();
var Paypal = require('./index');

var SetExpressCheckout = Paypal.SetExpressCheckout;
var GetExpressCheckoutDetails = Paypal.GetExpressCheckoutDetails;
var CreateRecurringPaymentsProfile = Paypal.CreateRecurringPaymentsProfile;
var DoExpressCheckoutPayment = Paypal.DoExpressCheckoutPayment;

app.get('/lifetime', function (req, res) {
	var googleId = req.query.googleId;
	if (!googleId) {
		return res.end();
	}
	var obj = {
		type: "SALE",
		amount: 25.00,
		currencyCode: "USD",
		custom: {
			type: "SALE",
			amount: 25.00,
			currencyCode: "USD",
			googleId: googleId
		}
	};
	var newCheckout = new SetExpressCheckout(obj);
	newCheckout.exec(function (err, expressCheckoutResponse) {
		console.log(err, expressCheckoutResponse);
		res.redirect(expressCheckoutResponse.getAuthorizationUrl());
	});
});
app.get('/subscribe', function (req, res) {
	res.send('<html><head></head><body><a href="/subscribe/monthly">Monthly</a><br/><a href="/subscribe/yearly">yearly</a></body></html>')
});
app.get('/subscribe/:period', function (req, res) {
	var googleId = req.query.googleId;
	if (!googleId) {
		return res.end();
	}
	var period = req.params.period;
	var obj = {
		type:"RecurringPayments",
		description: "VideostreamPremium"
	};
	if (period == "monthly") {
		obj.amount = 1.50
		obj.custom = {period: "Month", amount: obj.amount, type: "RecurringPayments", googleId: googleId}
	} else if (period = "yearly") {
		obj.amount = 10.00
		obj.custom = {period: "Year", amount: obj.amount, type: "RecurringPayments", googleId: googleId}
	} else {
		return res.end();
	}
	var newCheckout = new SetExpressCheckout(obj);
	newCheckout.exec(function (err, expressCheckoutResponse) {
		console.log(err, expressCheckoutResponse);
		res.redirect(expressCheckoutResponse.getAuthorizationUrl());
	});
});
app.get('/cancel', function (req, res) {
	console.log(req.headers, req.body, req.query);
	res.end("cancel: " + req.query.token);
});
app.get('/complete', function (req, res) {
	console.log(req.headers, req.body, req.query);
	var checkDetails = new GetExpressCheckoutDetails(req.query.token);
	checkDetails.exec(function (err, paypalRes) {
		if (!err) {
			console.log(err, paypalRes);
			console.info("ACK:", paypalRes.getAck());
			var custom = JSON.parse(paypalRes.get("PAYMENTREQUEST_0_CUSTOM"));
			console.log("CUSTOM", custom);
			var payerId = paypalRes.getPayerId();
			var token = paypalRes.getToken();
			if (paypalRes.getAck() == "Success") {
				res.end('<html><head></head><body><a href="/accept?token='+token+'">Accept</a></body></html>')
			} else {
				res.end('nope');
			}
		}
	});
});

app.get('/accept', function (req, res) {
	// Add to the database.
	var checkDetails = new GetExpressCheckoutDetails(req.query.token);
	checkDetails.exec(function (err, paypalRes) {
		var payerId = paypalRes.getPayerId();
		var token = paypalRes.getToken();
		if (paypalRes.getAck() != "Success") {
			return res.end(paypalRes.obj);
		}
		var custom = JSON.parse(paypalRes.get("PAYMENTREQUEST_0_CUSTOM"));
		console.log(custom);
		var type = custom.type;
		if (type == "RecurringPayments") {
			var recurring = new CreateRecurringPaymentsProfile(token, payerId);
			recurring.setStartDate(new Date());
			recurring.setDescription("VideostreamPremium");
			recurring.setBillingPeriod(custom.period);
			recurring.setBillingFrequency(1);
			recurring.setAmount(custom.amount);
			recurring.exec(function (err, paypalRes) {
				console.log(err, paypalRes);
				if (paypalRes.getAck() == "Success" && paypalRes.getProfileStatus() == "ActiveProfile") {
					// Much fail.
					res.end(JSON.stringify(paypalRes.getObj()));
				} else {
					res.end(JSON.stringify(paypalRes.getObj()));
				}
			});
		} else if (type == "SALE") {
			var amt = paypalRes.get("AMT");
			var currencyCode = paypalRes.get("CURRENCYCODE");
			var checkout = new DoExpressCheckoutPayment(token, payerId, "SALE", amt, currencyCode);
			checkout.exec(function (err, paypalRes) {
				console.log(err, paypalRes);
				if (paypalRes.getAck() == "Success" && paypalRes.get("PAYMENTINFO_0_PAYMENTSTATUS") == "Completed") {
					// Much success.
					res.end(JSON.stringify(paypalRes.getObj()));
				} else {
					// Much fail.
					res.end(JSON.stringify(paypalRes.getObj()));
				}
			});
		}
	});
});
http.createServer(app).listen(15225, function(){
  console.log("Express server listening on port " + 15225);
});
var express = require('express'), 
http = require('http');

var app = express();
var Paypal = require('./index');

var SetExpressCheckout = Paypal.SetExpressCheckout;
var GetExpressCheckoutDetails = Paypal.GetExpressCheckoutDetails;
var CreateRecurringPaymentsProfile = Paypal.CreateRecurringPaymentsProfile;
var DoExpressCheckoutPayment = Paypal.DoExpressCheckoutPayment;
var testingRecurringPayments = false;

app.get('/', function (req, res) {
	var obj;
	if (testingRecurringPayments) {
		obj = {
			type:"RecurringPayments",
			description: "VideostreamPremium",
			amount: 1.50
		};
	} else {
		obj = {
			type: "SALE",
			amount: 25.00,
			currencyCode: "USD"
		}
	}
	var newCheckout = new SetExpressCheckout(obj);
	newCheckout.exec(function (err, expressCheckoutResponse) {
		console.log(err, expressCheckoutResponse);
		res.redirect(expressCheckoutResponse.getAuthorizationUrl());
	});
});
app.get('/lifetime', function (req, res) {
	var obj = {
		type: "SALE",
		amount: 25.00,
		currencyCode: "USD",
		custom: {
			type: "SALE",
			amount: 25.00,
			currencyCode: "USD"
		}
	};
	var newCheckout = new SetExpressCheckout(obj);
	newCheckout.exec(function (err, expressCheckoutResponse) {
		console.log(err, expressCheckoutResponse);
		res.redirect(expressCheckoutResponse.getAuthorizationUrl());
	});
});
app.get('/subscribe/:period', function (req, res) {
	var period = req.params.period;
	var obj = {
		type:"RecurringPayments",
		description: "VideostreamPremium"
	};
	if (period == "monthly") {
		obj.amount = 1.50
		obj.custom = {period: "Month", amount: obj.amount, type: "RecurringPayments"}
	} else if (period = "yearly") {
		obj.amount = 10.00
		obj.custom = {period: "Year", amount: obj.amount, type: "RecurringPayments"}
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
	// res.end("complete: " + req.query.token);
	var checkDetails = new GetExpressCheckoutDetails(req.query.token);
	checkDetails.exec(function (err, paypalRes) {
		if (!err) {
			console.log(err, paypalRes);
			console.info("ACK:", paypalRes.getAck());
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
				if (paypalRes.getAck() == "Success") {
					if (paypalRes.getProfileStatus() == "ActiveProfile") {
						// Much success
						res.end(JSON.stringify(paypalRes.getObj()));
					} else {
						// Much fail.
						res.end(JSON.stringify(paypalRes.getObj()));
					}
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
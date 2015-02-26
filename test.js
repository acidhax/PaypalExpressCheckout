var express = require('express'), 
http = require('http');

var app = express();
var Paypal = require('./index');

var SetExpressCheckout = Paypal.SetExpressCheckout;
var GetExpressCheckoutDetails = Paypal.GetExpressCheckoutDetails;
var CreateRecurringPaymentsProfile = Paypal.CreateRecurringPaymentsProfile;
var DoExpressCheckoutPayment = Paypal.DoExpressCheckoutPayment;
var testingRecurringPayments = true;

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
app.get('/cancel', function (req, res) {
	console.log(req.headers, req.body, req.query);
	res.end("cancel: " + req.query.token);
});
app.get('/complete', function (req, res) {
	console.log(req.headers, req.body, req.query);
	res.end("complete: " + req.query.token);
	var checkDetails = new GetExpressCheckoutDetails(req.query.token);
	checkDetails.exec(function (err, getExpressCheckoutDetailsResponse) {
		if (!err) {
			console.log(err, getExpressCheckoutDetailsResponse);
			var payerId = getExpressCheckoutDetailsResponse.getPayerId();
			var token = getExpressCheckoutDetailsResponse.getToken();
			var type = getExpressCheckoutDetailsResponse.get("PAYMENTREQUEST_0_CUSTOM");
			if (type == "RecurringPayments") {
				var recurring = new CreateRecurringPaymentsProfile(token, payerId);
				recurring.setStartDate(new Date());
				recurring.setDescription("VideostreamPremium");
				recurring.setBillingPeriod("Month");
				recurring.setBillingFrequency(1);
				recurring.setAmount(1.50);
				recurring.exec(function (err, createRecurringPaymentsProfileResponse) {
					console.log(err, createRecurringPaymentsProfileResponse);
				})
			} else if (type == "SALE") {
				var amt = getExpressCheckoutDetailsResponse.get("AMT");
				var currencyCode = getExpressCheckoutDetailsResponse.get("CURRENCYCODE");
				var checkout = new DoExpressCheckoutPayment(token, payerId, "SALE", amt, currencyCode);
				checkout.exec(function (err, doExpressCheckoutPaymentResponse) {
					console.log(err, doExpressCheckoutPaymentResponse);
				});
			}
		}
	});
});
http.createServer(app).listen(15225, function(){
  console.log("Express server listening on port " + 15225);
});
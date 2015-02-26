var PaypalRequestBase = require('./PaypalBase').PaypalRequestBase;
var PaypalResponseBase = require('./PaypalBase').PaypalResponseBase;
var DoExpressCheckoutPayment = function (token, payerId, paymentAction, paymentAmount, currencyCode) {
	PaypalRequestBase.call(this, DoExpressCheckoutPayment.HTTP_TYPE, DoExpressCheckoutPaymentResponse);
	this.add("METHOD", DoExpressCheckoutPayment.METHOD);
	this.add("VERSION", 93);
	this.add("TOKEN", token);
	this.add("PAYERID", payerId);
	this.add("PAYMENTREQUEST_0_PAYMENTACTION", paymentAction);
	this.add("PAYMENTREQUEST_0_AMT", paymentAmount);
	this.add("PAYMENTREQUEST_0_CURRENCYCODE", currencyCode);
}
DoExpressCheckoutPayment.prototype = Object.create(PaypalRequestBase.prototype);
DoExpressCheckoutPayment.METHOD = "DoExpressCheckoutPayment"
DoExpressCheckoutPayment.HTTP_TYPE = "POST";

var DoExpressCheckoutPaymentResponse = function (res) {
	PaypalResponseBase.call(this, res);
};
DoExpressCheckoutPaymentResponse.prototype = Object.create(PaypalResponseBase.prototype);
module.exports = DoExpressCheckoutPayment;
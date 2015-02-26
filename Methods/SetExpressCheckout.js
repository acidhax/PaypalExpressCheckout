var PaypalRequestBase = require('./PaypalBase').PaypalRequestBase;
var PaypalResponseBase = require('./PaypalBase').PaypalResponseBase;
var SetExpressCheckout = function (obj) {
	PaypalRequestBase.call(this, SetExpressCheckout.HTTP_TYPE, SetExpressCheckoutResponse);
	this.response = null;
	this.add("METHOD", SetExpressCheckout.METHOD);
	this.add("VERSION", 86);
	if (obj.type == "RecurringPayments") {
		this.add("PAYMENTREQUEST_0_AMT", obj.amount)
		this.add("L_BILLINGTYPE0", obj.type);
		this.add("L_BILLINGAGREEMENTDESCRIPTION0", obj.description);
	} else {
		this.add("PAYMENTREQUEST_0_PAYMENTACTION", "SALE");
		this.add("PAYMENTREQUEST_0_AMT", obj.amount);
		this.add("PAYMENTREQUEST_0_CURRENCYCODE", obj.currencyCode);

	}
	this.add("PAYMENTREQUEST_0_CUSTOM", obj.type);
	this.add("cancelUrl", this.getCancelUrl());
	this.add("returnUrl", this.getReturnUrl());
};
SetExpressCheckout.prototype = Object.create(PaypalRequestBase.prototype);
SetExpressCheckout.METHOD = "SetExpressCheckout";
SetExpressCheckout.HTTP_TYPE = "POST";
SetExpressCheckout.RESPONSE_OBJ = SetExpressCheckoutResponse;

/*
* The exact same as base class.
* `ACK` and `TOKEN` are the only values returned.
*/
var SetExpressCheckoutResponse = function (res) {
	PaypalResponseBase.call(this, res);
};
SetExpressCheckoutResponse.prototype = Object.create(PaypalResponseBase.prototype);
SetExpressCheckoutResponse.prototype.getAuthorizationUrl = function() {
	return "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token="+this.getToken();
};
module.exports = SetExpressCheckout;
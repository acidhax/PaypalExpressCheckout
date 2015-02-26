var PaypalRequestBase = require('./PaypalBase').PaypalRequestBase;
var PaypalResponseBase = require('./PaypalBase').PaypalResponseBase;
var GetExpressCheckoutDetails = function (token) {
	PaypalRequestBase.call(this, GetExpressCheckoutDetails.HTTP_TYPE, GetExpressCheckoutDetailsResponse);
	this.add("METHOD", GetExpressCheckoutDetails.METHOD);
	this.add("VERSION", 86);
	this.add("TOKEN", token);
};
GetExpressCheckoutDetails.prototype = Object.create(PaypalRequestBase.prototype);
GetExpressCheckoutDetails.METHOD = "GetExpressCheckoutDetails";
GetExpressCheckoutDetails.HTTP_TYPE = "POST";
GetExpressCheckoutDetails.RESPONSE_OBJ = GetExpressCheckoutDetailsResponse;

/*
* Response.
*/
var GetExpressCheckoutDetailsResponse = function (res) {
	PaypalResponseBase.call(this, res);
};
GetExpressCheckoutDetailsResponse.prototype = Object.create(PaypalResponseBase.prototype);
GetExpressCheckoutDetailsResponse.prototype.getStatus = function() {
	return this.obj["BILLINGAGREEMENTACCEPTEDSTATUS"];
};
GetExpressCheckoutDetailsResponse.prototype.getPayerId = function() {
	return this.obj["PAYERID"];
};

module.exports = GetExpressCheckoutDetails;
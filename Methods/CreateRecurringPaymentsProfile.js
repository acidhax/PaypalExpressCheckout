var PaypalRequestBase = require('./PaypalBase').PaypalRequestBase;
var PaypalResponseBase = require('./PaypalBase').PaypalResponseBase;
var CreateRecurringPaymentsProfile = function (token, payerId) {
	PaypalRequestBase.call(this, CreateRecurringPaymentsProfile.HTTP_TYPE, CreateRecurringPaymentsProfileResponse);
	this.add("METHOD", CreateRecurringPaymentsProfile.METHOD);
	this.add("VERSION", 86);
	this.add("TOKEN", token);
	this.add("PAYERID", payerId);
};
CreateRecurringPaymentsProfile.prototype = Object.create(PaypalRequestBase.prototype);
CreateRecurringPaymentsProfile.METHOD = "CreateRecurringPaymentsProfile";
CreateRecurringPaymentsProfile.HTTP_TYPE = "POST";
function ISODateString(d){  
  function pad(n) { return n < 10 ? '0'+n : n }
  return d.getUTCFullYear() + '-'  
       + pad(d.getUTCMonth() +1) + '-'  
       + pad(d.getUTCDate()) + 'T'  
       + pad(d.getUTCHours()) + ':'  
       + pad(d.getUTCMinutes()) + ':'  
       + pad(d.getUTCSeconds()) + 'Z'  
}  

var d = new Date();  
//Billing date start, in UTC/GMT format
CreateRecurringPaymentsProfile.prototype.setStartDate = function(date) {
	this.add("PROFILESTARTDATE", ISODateString(date));
};

// Profile description - same as billing agreement description
CreateRecurringPaymentsProfile.prototype.setDescription = function(desc) {
	this.add("DESC", desc);
};

// Period of time between billings - Month
CreateRecurringPaymentsProfile.prototype.setBillingPeriod = function(period) {
	this.add("BILLINGPERIOD", period);
};

// Frequency of charges
CreateRecurringPaymentsProfile.prototype.setBillingFrequency = function(freq) {
	this.add("BILLINGFREQUENCY", freq);
};

// #The amount the buyer will pay in a payment period
CreateRecurringPaymentsProfile.prototype.setAmount = function(amt) {
	this.add("AMT", amt);
};

// The currency, e.g. US dollars: USD
CreateRecurringPaymentsProfile.prototype.setCurrencyCode = function(code) {
	this.add("CURRENCYCODE", code);
};

// The country code, e.g. US
CreateRecurringPaymentsProfile.prototype.setCountryCode = function(code) {
	this.add("COUNTRYCODE", code);
};

// OPTIONAL
// Maximum failed payments before suspension of the Profile
CreateRecurringPaymentsProfile.prototype.setMaxFailedPayments = function(max) {
	this.add("MAXFAILEDPAYMENTS", max);
};

var CreateRecurringPaymentsProfileResponse = function (res) {
	PaypalResponseBase.call(this, res);
};
CreateRecurringPaymentsProfileResponse.prototype = Object.create(PaypalResponseBase.prototype);
CreateRecurringPaymentsProfileResponse.prototype.getProfileId = function() {
	return this.obj["PROFILEID"];
};

CreateRecurringPaymentsProfileResponse.prototype.getProfileStatus = function() {
	return this.obj["PROFILESTATUS"];
};

module.exports = CreateRecurringPaymentsProfile;
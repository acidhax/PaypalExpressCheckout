var SANDBOX_USERNAME = "mail-facilitator_api1.matbee.com"
var SANDBOX_PASSWORD = "WP73VBEZKFAXZQQX"
var SANDBOX_SIGNATURE = "AqKaP0g.X9uGaj.uMN7pqlRT7xsYAkzicisUVxN6F7IZBr.9tGH7.kCS"

var request = require('request');
var NVP = require('./NVP');
var PaypalRequestBase = function (httpMethod, responseClass) {
	NVP.call(this);
	this.httpMethod = httpMethod;
	console.log("responseClass", arguments);
	this.responseClass = responseClass || PaypalResponseBase;
	this.add("USER", SANDBOX_USERNAME);
	this.add("PWD", SANDBOX_PASSWORD);
	this.add("SIGNATURE", SANDBOX_SIGNATURE);
};
PaypalRequestBase.prototype = Object.create(NVP.prototype);
PaypalRequestBase.CANCEL_URL = "http://127.0.0.1:15225/cancel";
PaypalRequestBase.RETURN_URL = "http://127.0.0.1:15225/complete";
PaypalRequestBase.ENDPOINT_URL = "https://api-3t.sandbox.paypal.com/nvp";
PaypalRequestBase.prototype.setCancelUrl = function(url) {
	this._cancelUrl = url;
};
PaypalRequestBase.prototype.getCancelUrl = function() {
	return this._cancelUrl || PaypalRequestBase.CANCEL_URL;
};
PaypalRequestBase.prototype.setReturnUrl = function(url) {
	this._returnUrl = url;
};
PaypalRequestBase.prototype.getReturnUrl = function() {
	return this._returnUrl || PaypalRequestBase.RETURN_URL;
};
PaypalRequestBase.prototype.setEndpointUrl = function(url) {
	this._endpointUrl = url;
};
PaypalRequestBase.prototype.getEndpointUrl = function() {
	return this._endpointUrl || PaypalRequestBase.ENDPOINT_URL;
};
PaypalRequestBase.prototype.exec = function(cb) {
	var self = this;
	console.info("URL:", this._endpointUrl || PaypalRequestBase.ENDPOINT_URL + "?" + this.toString());
	request.post({
		url: this._endpointUrl || PaypalRequestBase.ENDPOINT_URL,
		body: this.toString()
	}, function (err, res) {
		cb(err, new self.responseClass(res.body));
	});
};

var PaypalResponseBase = function (res) {
	this.response = res;
	this.obj = this.parseAsObject(res);
};
PaypalResponseBase.prototype.getToken = function() {
	return this.obj.TOKEN;
};
PaypalResponseBase.prototype.getAck = function() {
	return this.obj.ACK;
};
PaypalResponseBase.prototype.getObj = function() {
	return this.obj;
};
PaypalResponseBase.prototype.get = function(key) {
	return this.obj[key];
};
PaypalResponseBase.prototype.parseAsObject = function(res) {
	// Parse res.
	try {
		var response = {};
		var each = res.split("&");
		for (var i in each) {
			var item = each[i].split("=");
			var key = item[0];
			var value = decodeURIComponent(item[1]);
			if (key.indexOf("_") > -1) {
				var separated = key.split("_");
				var realKey = separated[0];
				var realKeyIndex = separated[1];
				var realProperty = separated[2];
				if (!response[realKey]) {
					response[realKey] = [];
				}
				if (!response[realKey][realKeyIndex]) {
					response[realKey][realKeyIndex] = {};
				}
				response[realKey][realKeyIndex][realProperty] = value;
			} else {
				response[key] = value;
			}
		}
		return response;
	} catch (ex) {
		// Fail yo.
	}
};
PaypalResponseBase.prototype.findPayments = function(obj) {
	for (var i in this.obj) {
		if (i.indexOf("_") > -1) {
			var separated = i.split("_");
		}
	}
};
module.exports = {
	PaypalRequestBase: PaypalRequestBase,
	PaypalResponseBase: PaypalResponseBase
}
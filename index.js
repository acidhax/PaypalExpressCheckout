var PaypalRequestBase = require('./Methods/PaypalBase');
module.exports = {
	PaypalRequestBase: require('./Methods/PaypalBase'),
	SetExpressCheckout: require('./Methods/SetExpressCheckout'),
	CreateRecurringPaymentsProfile: require('./Methods/CreateRecurringPaymentsProfile'),
	DoExpressCheckoutPayment: require('./Methods/DoExpressCheckoutPayment'),
	GetExpressCheckoutDetails: require('./Methods/GetExpressCheckoutDetails'),
	setCancelUrl: function (url) {
		PaypalRequestBase.CANCEL_URL = url;
	},
	setReturnUrl: function (url) {
		PaypalRequestBase.RETURN_URL = url;
	},
	setEndpointUrl: function (url) {
		PaypalRequestBase.ENDPOINT_URL = url;
	}
}
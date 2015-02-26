var NVP = function () {
	this.kvp = {};
}
NVP.prototype.add = function(key, value) {
	this.kvp[key] = value;
};
NVP.prototype.toString = function() {
	var out = "";
	for (var i in this.kvp) {
		if (out != "") {
			out += "&";
		}
		out+=i+"="+this.kvp[i];
	}
	return out;
};
module.exports = NVP;
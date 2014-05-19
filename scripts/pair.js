function Pair (first , second) {
	this.mFirst = first;
	this.mSecond = second;
}

Pair.prototype.GetFirst = function() {
	return this.mFirst;
};

Pair.prototype.GetSecond = function() {
	return this.mSecond;
}

Pair.prototype.SetFirst = function(first) {
	this.mFirst = first;
};

Pair.prototype.SetSecond = function(second) {
	this.mSecond = second;
};
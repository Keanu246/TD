function Vector2D (x , y) {
	this.mX = x;
	this.mY = y;
	if (this.mX == 0.0 && this.mY == 0.0) {
		this.mAngle = 0.0;
	} else {
		this.mAngle = Math.atan2(this.mX , -1 * this.mY);
	}
}

Vector2D.prototype.SetX = function(x) {
	this.mX = x;
	if (this.mX == 0.0 && this.mY == 0.0) {
		this.mAngle = 0.0;
	} else {
		this.mAngle = Math.atan2(this.mX , -1 * this.mY);
	}
};

Vector2D.prototype.SetY = function(y) {
	this.mY = y;
	if (this.mX == 0.0 && this.mY == 0.0) {
		this.mAngle = 0.0;
	} else {
		this.mAngle = Math.atan2(this.mX , -1 * this.mY);
	}
};

Vector2D.prototype.GetX = function() {
	return this.mX;
};

Vector2D.prototype.GetY = function() {
	return this.mY;
};

Vector2D.prototype.GetAngle = function() {
	return this.mAngle;
}

Vector2D.prototype.GetSecondNorm = function() {
	return Math.sqrt(this.mX * this.mX + this.mY * this.mY);
}

Vector2D.prototype.GetNormalizedVector = function() {
	var normal = this.GetSecondNorm();
	var newVector = new Vector2D(0.0 , 0.0);
	if (normal != 0) {
		newVector.SetX(this.mX / normal);
		newVector.SetY(this.mY / normal);
	}
	return newVector;
}


function Enemy (enemyType , width , height) {
	this.mDirectionX = 0.0;
	this.mDirectionX = 0.0;
	this.mDirectionY = 0.0;
	this.mAngle = 0.0;
	this.mCenterX = 0.0;
	this.mCenterY = 0.0;
	this.mType = enemyType;
	this.mBitmap = new Image();
}

Enemy.prototype.Constructor = Enemy;

Enemy.prototype.SetCenterX = function(x) {
	this.mCenterX = x;
};

Enemy.prototype.SetCenterY = function(y) {
	this.mCenterY = y;
};

Enemy.prototype.GetCenterX = function() {
	return this.mCenterX;
};

Enemy.prototype.GetCenterY = function() {
	return this.mCenterY;
};

Enemy.prototype.GetDirectionX = function() {
	return this.mDirectionX;
};

Enemy.prototype.SetDirectionX = function(speedX) {
	this.mDirectionX = speedX;
	if (this.mDirectionX == 0.0 && this.mDirectionY == 0.0) {
	  this.mAngle = 0.0;
	} else {
	  this.mAngle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
	}
};

Enemy.prototype.GetDirectionY = function() {
	return this.mDirectionY;
};

Enemy.prototype.SetDirectionY = function(speedY) {
   this.mDirectionY = speedY;
   if (this.mDirectionX == 0.0 && this.mDirectionY == 0.0) {
      this.mAngle = 0.0;
   } else {
      this.mAngle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
   }
}

Enemy.prototype.Draw = function(context) {
   	context.translate(this.mCenterX , this.mCenterY); 
   	context.rotate(this.mAngle);
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   	context.rotate(-1 * this.mAngle );
   	context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
};
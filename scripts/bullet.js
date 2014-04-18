var BulletType = {
	Fire : 1,
	Metal : 2,
};

function Bullet(bulletType){

   // Add object properties like this
   this.mX = 0.0;
   this.mY = 0.0;
   this.mSpeedX = 0.0;
   this.mSpeedY = 0.0;
   this.mBulletType = bulletType;
   this.mBitmap = new Image();
   if (bulletType == BulletType.Metal) {
   	this.mBitmap.src = "images/metal-bullet.png";
   	this.mWidth = 8.5;
   	this.mHeight = 30;
   } else if (bulletType == BulletType.Fire) {
   	this.mBitmap.src = "images/fire-bullet.png";
   	this.mWidth = 15;
   	this.mHeight = 30;
   }
}

Bullet.prototype.constructor = Bullet;

Bullet.prototype.SetX = function(x) {
	this.mX = x;
};

Bullet.prototype.SetY = function(y) {
	this.mY = y;
};

Bullet.prototype.GetX = function() {
	return this.mX;
};

Bullet.prototype.GetY = function() {
	return this.mY;
};

Bullet.prototype.GetSpeedX = function() {
	return this.mSpeedX;
};

Bullet.prototype.SetSpeedX = function(speedX) {
	this.mSpeedX = speedX;
};

Bullet.prototype.GetSpeedY = function() {
	return mSpeedY;
};

Bullet.prototype.SetSpeedY = function(speedY) {
	this.mSpeedY = speedY;
}

Bullet.prototype.Draw = function(context){
	var angle = Math.atan2(this.mSpeedY , this.mSpeedX);
	var centerX = this.mX + this.mWidth / 2;
	var centerY = this.mY + this.mHeight / 2; 
	context.drawImage(this.mBitmap,this.mX,this.mY , this.mWidth , this.mHeight);
}


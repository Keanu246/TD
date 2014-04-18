var BulletType = {
	Fire : 1,
	Metal : 2,
};

function Bullet(bulletType){

   // Add object properties like this
   this.mCenterX = 0.0;
   this.mCenterY = 0.0;
   this.mDirectionX = -1.0;
   this.mDirectionY = -1.0;
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

Bullet.prototype.Constructor = Bullet;

Bullet.prototype.SetCenterX = function(x) {
	this.mCenterX = x;
};

Bullet.prototype.SetCenterY = function(y) {
	this.mCenterY = y;
};

Bullet.prototype.GetCenterX = function() {
	return this.mCenterX;
};

Bullet.prototype.GetCenterY = function() {
	return this.mCenterY;
};

Bullet.prototype.GetDirectionX = function() {
	return this.mDirectionX;
};

Bullet.prototype.SetDirectionX = function(speedX) {
	this.mDirectionX = speedX;
};

Bullet.prototype.GetDirectionY = function() {
	return this.mDirectionY;
};

Bullet.prototype.SetDirectionY = function(speedY) {
	this.mDirectionY = speedY;
}

Bullet.prototype.Draw = function(context) {
	var angle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
   context.translate(this.mCenterX , this.mCenterY); 
   context.rotate(angle);
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   context.rotate(-1 * angle );
   context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
}


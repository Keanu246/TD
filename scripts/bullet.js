var BulletType = {
	Fire : 1,
	Metal : 2,
};

function Bullet(bulletType){

   // Add object properties like this
   this.mDirectionX = 0.0;
   this.mDirectionY = 0.0;
   this.mAngle = 0.0;
   this.mCenterX = 0.0;
   this.mCenterY = 0.0;
   this.mBulletType = bulletType;
   this.mBitmap = new Image();
   if (bulletType == BulletType.Metal) {
      this.mBitmap.src = "images/metal-bullet.png";
      this.mWidth = 8.5;
      this.mHeight = 30;
      this.mSpeed = 12.0;
      this.mRange = 17.0;
   } else if (bulletType == BulletType.Fire) {
      this.mBitmap.src = "images/fire-bullet.png";
      this.mWidth = 30;
      this.mHeight = 30;
      this.mSpeed = 10.0;
      this.mRange = 10.0;
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
   if (this.mDirectionX == 0.0 && this.mDirectionY == 0.0) {
      this.mAngle = 0.0;
   } else {
      this.mAngle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
   }
};

Bullet.prototype.GetRange = function() {
   return this.mRange;
}

Bullet.prototype.GetDirectionY = function() {
	return this.mDirectionY;
};

Bullet.prototype.SetDirectionY = function(speedY) {
   this.mDirectionY = speedY;
   if (this.mDirectionX == 0.0 && this.mDirectionY == 0.0) {
      this.mAngle = 0.0;
   } else {
      this.mAngle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
   }
}

Bullet.prototype.Draw = function(context) {
   context.translate(this.mCenterX , this.mCenterY); 
   context.rotate(this.mAngle);
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   context.rotate(-1 * this.mAngle );
   context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
};

Bullet.prototype.Move = function() {
   this.mCenterX += Math.sin(this.mAngle) * this.mSpeed;
   this.mCenterY += -1 * Math.cos(this.mAngle) * this.mSpeed;
};


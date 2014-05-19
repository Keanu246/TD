var BulletType = {
	Fire : 1,
	Metal : 2,
};

function Bullet(bulletType){

   // Add object properties like this
   this.mDirectionVector = new Vector2D(0.0,0.0);
   this.mCenterX = 0.0;
   this.mCenterY = 0.0;
   this.mType = bulletType;
   this.mBitmap = new Image();
   if (bulletType == BulletType.Metal) {
      this.mBitmap.src = "images/metal-bullet.png";
      this.mWidth = 8.5;
      this.mHeight = 30;
      this.mSpeed = 12.0;
      this.mDamage = 5;
   } else if (bulletType == BulletType.Fire) {
      this.mBitmap.src = "images/fire-bullet.png";
      this.mWidth = 30;
      this.mHeight = 30;
      this.mSpeed = 10.0;
      this.mDamage = 2;
   }
   this.mDistanceTravelled = 0.0;
   this.mMaxDistance = 0.0;
}


Bullet.prototype.Constructor = Bullet;

Bullet.prototype.GetType = function() {
   return this.mType;
};

Bullet.prototype.GetWidth = function() {
   return this.mWidth;
};

Bullet.prototype.GetHeight = function() {
   return this.mHeight;
};

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
	return this.mDirectionVector.GetX();
};

Bullet.prototype.SetDirectionX = function(speedX) {
	this.mDirectionVector.SetX(speedX);
};

Bullet.prototype.GetDirectionY = function() {
	return this.mDirectionVector.GetY();
};

Bullet.prototype.SetDirectionY = function(speedY) {
   this.mDirectionVector.SetY(speedY);
};

Bullet.prototype.GetDirectionVector = function() {
   return this.mDirectionVector;
}

Bullet.prototype.GetDamage = function() {
   return this.mDamage;
};

Bullet.prototype.SetSpeed = function(speed) {
   this.mSpeed = speed;
};

Bullet.prototype.GetSpeed = function() {
   return this.mSpeed;
};

Bullet.prototype.GetMaxDistance = function() {
   return this.mMaxDistance;
}

Bullet.prototype.SetMaxDistance = function(distance) {
   this.mMaxDistance = distance;
}

Bullet.prototype.GetDistanceTravelled = function() {
   return this.mDistanceTravelled;
}


Bullet.prototype.Draw = function(context) {
   context.translate(this.mCenterX , this.mCenterY); 
   context.rotate(this.mDirectionVector.GetAngle());
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   context.rotate(-1 * this.mDirectionVector.GetAngle());
   context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
};

Bullet.prototype.Move = function() {
   var normalVector = this.mDirectionVector.GetNormalizedVector();
   if (normalVector.GetSecondNorm() != 0) {
      this.mCenterX += normalVector.GetX() * this.mSpeed;
      this.mCenterY += normalVector.GetY() * this.mSpeed;
   } else {
      this.mCenterY -= this.mSpeed;
   }
   this.mDistanceTravelled += this.mSpeed;
};

Bullet.prototype.CheckCollision = function(object) {
   if (this.mCenterX + this.mWidth / 2 < object.GetCenterX() - object.GetWidth() / 2 || 
      object.GetCenterX() + object.GetWidth() / 2 < this.mCenterX - this.mWidth / 2 ||
      this.mCenterY + this.mHeight / 2 < object.GetCenterY() - object.GetHeight() / 2 ||
      object.GetCenterY() + object.GetHeight() / 2 < this.mCenterY - this.mHeight / 2) {
      return false;
   } else {
      return true;
   }
};

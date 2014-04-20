var TurretType = {
	Basic:1,
	Flamer:2,
};

function Turret (turretType , width , height) {
	this.mCenterX = 0.0;
   	this.mCenterY = 0.0;
   	this.mDirectionX = 0.0;
   	this.mDirectionY = 0.0;
   	this.mType = turretType;
   	this.mWidth = width;
   	this.mHeight = height + 7;
   	this.mBitmap = new Image();
   	if (turretType == TurretType.Basic) {
   		this.mBulletType =	BulletType.Metal; 
   		this.mBitmap.src = "images/basic-turret.png";
   		this.mRange = 10;
   		this.mDamage = 5;
   		this.mAtckSpeed = 500; //milliseconds
   	} else {
   		this.mBulletType =	BulletType.Fire;
   		this.mRange = 6;
   		this.mDamage = 2;
   		this.mAtckSpeed = 100;
   		this.mBitmap.src = "images/basic-turret.png";
   	}
   	this.mLastShotted = 0;
}

Turret.prototype.Constructor = Turret;

Turret.prototype.GetType = function() {
	return this.mType;
};

Turret.prototype.SetCenterX = function(x) {
	this.mCenterX = x;
};

Turret.prototype.SetCenterY = function(y) {
	this.mCenterY = y;
};

Turret.prototype.GetCenterX = function() {
	return this.mCenterX;
};

Turret.prototype.GetCenterY = function() {
	return this.mCenterY;
};

Turret.prototype.GetDirectionX = function() {
	return this.mDirectionX;
};

Turret.prototype.SetDirectionX = function(speedX) {
	this.mDirectionX = speedX;
};

Turret.prototype.GetDirectionY = function() {
	return this.mDirectionY;
};

Turret.prototype.SetDirectionY = function(speedY) {
	this.mDirectionY = speedY;
}

Turret.prototype.Draw = function(context) {
	var angle = 0.0;
	if (this.mDirectionX == 0 && this.mDirectionY == 0) {
		angle = 0.0;
	} else {
		angle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
	}
    context.translate(this.mCenterX , this.mCenterY); 
    context.rotate(angle);
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * (this.mHeight) / 2, this.mWidth , this.mHeight);
    context.rotate(-1 * angle );
    context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
}

Turret.prototype.MakeBullet = function () {
	if (+new Date() - this.mLastShotted <= this.mAtckSpeed) {
		return null;
	}
	var angle = 0.0;
	if (this.mDirectionX == 0 && this.mDirectionY == 0) {
		angle = 0.0;
	} else {
		angle = Math.atan2(this.mDirectionX , -1 * this.mDirectionY);
	}
	distance = this.mHeight / 2;

	var newBullet = new Bullet(this.mBulletType);
	newBullet.SetDirectionX(this.mDirectionX);
	newBullet.SetDirectionY(this.mDirectionY);
	newBullet.SetCenterX(this.mCenterX + distance * Math.sin(angle));
	newBullet.SetCenterY(this.mCenterY + (-1 * distance * Math.cos(angle)));
	this.mLastShotted = +new Date();

	return newBullet;
}
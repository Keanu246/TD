var TurretType = {
	Basic:1,
	Flaming:2,
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
   		this.mRange = 200;
   		this.mDamage = 5;
   		this.mAtckSpeed = 500; //milliseconds
   	} else if (turretType == TurretType.Flaming) {
   		this.mBulletType =	BulletType.Fire;
   		this.mRange = 130;
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

Turret.prototype.IsInsideTurret = function(x , y) {
	var relativeX = this.mCenterX - x;
	var relativeY = this.mCenterY - y;
	return relativeX >= -1 * this.mWidth / 2 && relativeX < this.mHeight / 2 && relativeY >= -1 * this.mHeight / 2 && relativeY < this.mHeight / 2;
}

Turret.prototype.IsInsideRange = function(x , y) {
	var relativeX = this.mCenterX - x;
	var relativeY = this.mCenterY - y;
	var distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
	return distance <= this.mRange;
}

Turret.prototype.DrawDetails = function(context) {

	context.translate(this.mCenterX , this.mCenterY);
	context.fillStyle = "rgba(0, 255, 204, 0.15)";
	context.beginPath();
	context.arc(0,0,this.mRange,0,2*Math.PI);
	context.closePath();
	context.fill();
	context.translate(-1 * this.mCenterX , -1 * this.mCenterY);

	context.translate(0.0 , 0.0);
	context.fillStyle = "rgba(4, 12, 41, 0.8)";
	context.fillRect(0 , 0 , 230 , 150);

	context.translate(10 , 40.0);
	context.font = "30px Helvetica";
	context.fillStyle = "white";

	if (this.mType == TurretType.Flaming) {
		context.fillText("Flaming turret" , 20 , 0);
	} else if (this.mType == TurretType.Basic) {
		context.fillText("Basic turret" , 20 , 0);
	}
	
	context.font = "20px Helvetica";
	context.fillText("Damage : " + this.mDamage , 0 , 40);
	context.fillText("Atack speed : " + (this.mAtckSpeed / 1000) + "s" , 0 , 70);
	context.fillText("Range : " + this.mRange , 0 , 100);

	context.translate(-1 * 10.0 , -1 * 40);

}
var TurretType = {
	Basic:1,
	Flaming:2,
};

function Turret (turretType , width , height) {
	this.mCenterX = 0.0;
   	this.mCenterY = 0.0;
   	this.mFocusedEnemy = 0.0;
   	this.mType = turretType;
   	this.mWidth = width;
   	this.mHeight = height + 7;
   	this.mBitmap = new Image();
   	this.mFocusedEnemy = null;
   	if (turretType == TurretType.Basic) {
   		this.mBulletType =	BulletType.Metal; 
   		this.mBitmap.src = "images/basic-turret.png";
   		this.mRange = 200;
   		this.mAtckSpeed = 300; //milliseconds
   	} else if (turretType == TurretType.Flaming) {
   		this.mBulletType =	BulletType.Fire;
   		this.mRange = 130;
   		this.mAtckSpeed = 30;
   		this.mBitmap.src = "images/basic-turret.png";
   	}
   	this.mLastShotted = 0;
}

Turret.prototype.Constructor = Turret;

Turret.prototype.GetRange = function() {
	return this.mRange;
};

Turret.prototype.GetAtackSpeed = function() {
	return this.mAtckSpeed;
};

Turret.prototype.GetBulletType = function() {
	return this.mBulletType;
};

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

Turret.prototype.GetFocusedEnemy = function() {
	return this.mFocusedEnemy;
};

Turret.prototype.SetFocusedEnemy = function(enemy) {
	this.mFocusedEnemy = enemy;
};

Turret.prototype.Draw = function(context) {
	var directionVector = new Vector2D(0.0 , 0.0);
	if (this.mFocusedEnemy != null) {
		var newBullet = new Bullet(this.mBulletType);
		var distanceToEnemy = Math.sqrt((this.mFocusedEnemy.GetCenterX() - this.mCenterX) * (this.mFocusedEnemy.GetCenterX() - this.mCenterX)+ (this.mFocusedEnemy.GetCenterY() - this.mCenterY) * (this.mFocusedEnemy.GetCenterY() - this.mCenterY));
		var enemyND = this.mFocusedEnemy.GetDirectionVector().GetNormalizedVector();
		var deviation = (this.mFocusedEnemy.GetSpeed() * distanceToEnemy) / (newBullet.GetSpeed() * 1.5);
		directionVector = new Vector2D(this.mFocusedEnemy.GetCenterX() + enemyND.GetX() * deviation - this.mCenterX , this.mFocusedEnemy.GetCenterY() + enemyND.GetY() * deviation - this.mCenterY);
	}
    context.translate(this.mCenterX , this.mCenterY); 
    context.rotate(directionVector.GetAngle());
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * (this.mHeight) / 2, this.mWidth , this.mHeight);
    context.rotate(-1 * directionVector.GetAngle() );
    context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
};

Turret.prototype.MakeBullet = function () {
	// If turret is reloading , or it doesnt have where to shoot , it return null
	if (+new Date() - this.mLastShotted <= this.mAtckSpeed || this.mFocusedEnemy == null) {
		return null;
	}
	var newBullet = new Bullet(this.mBulletType);

	var distanceToEnemy = Math.sqrt((this.mFocusedEnemy.GetCenterX() - this.mCenterX) * (this.mFocusedEnemy.GetCenterX() - this.mCenterX)+ (this.mFocusedEnemy.GetCenterY() - this.mCenterY) * (this.mFocusedEnemy.GetCenterY() - this.mCenterY));
	var distanceToFrontTurret = this.mHeight / 2;

	var directionVector = new Vector2D(0.0 , 0.0);
	if (this.mFocusedEnemy != null) {
		var enemyND = this.mFocusedEnemy.GetDirectionVector().GetNormalizedVector();
		var deviation = (this.mFocusedEnemy.GetSpeed() * distanceToEnemy) / (newBullet.GetSpeed() * 1.5);
		directionVector = new Vector2D(this.mFocusedEnemy.GetCenterX() + enemyND.GetX() * deviation - this.mCenterX , this.mFocusedEnemy.GetCenterY() + enemyND.GetY() * deviation - this.mCenterY).GetNormalizedVector();
	}

	if (distanceToEnemy != 0) {
		newBullet.SetCenterX(this.mCenterX + distanceToFrontTurret * directionVector.GetX());
		newBullet.SetCenterY(this.mCenterY + distanceToFrontTurret * directionVector.GetY());
	} else {
		newBullet.SetCenterX(this.mCenterX);
		newBullet.SetCenterY(this.mCenterY - distanceToFrontTurret);
	}

	newBullet.SetDirectionX(directionVector.GetX());
	newBullet.SetDirectionY(directionVector.GetY());

	newBullet.SetMaxDistance(this.mRange);


	this.mLastShotted = +new Date();

	return newBullet;
};

Turret.prototype.IsInsideTurret = function(x , y) {
	var relativeX = this.mCenterX - x;
	var relativeY = this.mCenterY - y;
	return relativeX >= -1 * this.mWidth / 2 && relativeX < this.mHeight / 2 && relativeY >= -1 * this.mHeight / 2 && relativeY < this.mHeight / 2;
};

Turret.prototype.IsInsideRange = function(x , y) {
	var relativeX = this.mCenterX - x;
	var relativeY = this.mCenterY - y;
	var distance = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
	return distance <= this.mRange;
};

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
	if (this.mType == TurretType.Flaming) {
		context.fillText("Damage : 2 x 1", 0 , 40);
	} else if (this.mType == TurretType.Basic) {
		context.fillText("Damage : 5 x 1", 0 , 40);
	}
	context.fillText("Atack speed : " + (this.mAtckSpeed / 1000) + "s" , 0 , 70);
	context.fillText("Range : " + this.mRange , 0 , 100);

	context.translate(-1 * 10.0 , -1 * 40);

};
var EnemyType = {
	Basic : 1,
};

function Enemy (enemyType , width , height) {
	this.mDirectionX = 0.0;
	this.mDirectionY = 0.0;
	this.mAngle = 0.0;
	this.mCenterX = 0.0;
	this.mCenterY = 0.0;
	this.mWidth = width;
	this.mHeight = height;
	this.mType = enemyType;
	this.mBitmap = new Image();
	if (enemyType == EnemyType.Basic) {
		this.mLife = 40;
		this.mStartLife = this.mLife;
		this.mSpeed = 3.0;
		this.mBitmap.src = "images/basic-enemy.png";
	}
}

Enemy.prototype.Constructor = Enemy;

Enemy.prototype.GetType = function() {
	return this.mType;
};

Enemy.prototype.GetWidth = function() {
	return this.mWidth;
};

Enemy.prototype.GetHeight = function() {
	return this.mHeight;
};

Enemy.prototype.SetLife = function(life) {
	this.mLife = life;
};

Enemy.prototype.GetLife = function() {
	return this.mLife;
};

Enemy.prototype.SetSpeed = function(speed) {
	this.mSpeed = speed;
};

Enemy.prototype.GetSpeed = function() {
	return this.mSpeed;
};

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
};

Enemy.prototype.Draw = function(context) {
   	context.translate(this.mCenterX , this.mCenterY); 
   	context.rotate(this.mAngle);

	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   	
   	context.rotate(-1 * this.mAngle );

   	var percent = this.mLife / this.mStartLife;
   	context.fillStyle = "green";
   	context.strokeStyle = "black";
   	context.lineWidth = 2;
   	context.strokeRect(-1 * this.mWidth / 2 , -1 * this.mHeight / 2  - 12, this.mWidth , 5);
   	context.fillRect(-1 * this.mWidth / 2 , -1 * this.mHeight / 2  - 12, this.mWidth * percent , 5);

   	context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
};

Enemy.prototype.Move = function() {
   var distance = Math.sqrt(this.mDirectionX * this.mDirectionX + this.mDirectionY * this.mDirectionY);
   if (distance != 0) {
	   this.mCenterX += (this.mDirectionX / distance) * this.mSpeed;
	   this.mCenterY += (this.mDirectionY / distance) * this.mSpeed;
   } else {
   	   this.mCenterY -= this.mSpeed;
   }
};

Enemy.prototype.CheckCollision = function(object) {
	if (this.mCenterX + this.mWidth / 2 < object.GetCenterX() - object.GetWidth() / 2 || 
		object.GetCenterX() + object.GetWidth() / 2 < this.mCenterX - this.mWidth / 2 ||
		this.mCenterY + this.mHeight / 2 < object.GetCenterY() - object.GetHeight() / 2 ||
		object.GetCenterY() + object.GetHeight() / 2 < this.mCenterY - this.mHeight / 2) {
		return false;
	} else {
		return true;
	}
};
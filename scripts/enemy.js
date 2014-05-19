var EnemyType = {
	Basic : 1,
	Speeder : 2,
	Fatty : 3,
};

function Enemy (enemyType) {
	this.mDirectionVector = new Vector2D(0.0, 0.0);
	this.mCenterX = 0.0;
	this.mCenterY = 0.0;
	this.mType = enemyType;
	this.mBitmap = new Image();
	if (enemyType == EnemyType.Basic) {
		this.mMoney = 100;
		this.mSpeed = 3.0;
		this.mBitmap.src = "images/basic-enemy.png";
		this.mStartLife = 70;
		this.mLife = 70;
		this.mWidth = 30;
		this.mHeight = 30;
	} else if (enemyType == EnemyType.Speeder) {
		this.mMoney = 120;
		this.mSpeed = 6.0;
		this.mBitmap.src = "images/speeder-enemy.png";
		this.mStartLife = 60;
		this.mLife = 60;
		this.mWidth = 30;
		this.mHeight = 30;
	} else if (enemyType == EnemyType.Fatty) {
		this.mMoney = 130;
		this.mSpeed = 2.0;
		this.mBitmap.src = "images/fatty-enemy.png";
		this.mStartLife = 160;
		this.mLife = 160;
		this.mWidth = 30;
		this.mHeight = 50;
	}
}

Enemy.prototype.Constructor = Enemy;

Enemy.prototype.GetMoney = function() {
	return this.mMoney;
};

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
	return this.mDirectionVector.GetX();
};

Enemy.prototype.SetDirectionX = function(speedX) {
	this.mDirectionVector.SetX(speedX);
};

Enemy.prototype.GetDirectionY = function() {
	return this.mDirectionVector.GetY();
};

Enemy.prototype.SetDirectionY = function(speedY) {
   this.mDirectionVector.SetY(speedY);
};

Enemy.prototype.GetDirectionVector = function() {
	return this.mDirectionVector;
}

Enemy.prototype.Draw = function(context) {
   	context.translate(this.mCenterX , this.mCenterY); 
   	context.rotate(this.mDirectionVector.GetAngle());

	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   	
   	context.rotate(-1 * this.mDirectionVector.GetAngle());

   	var percent = this.mLife / this.mStartLife;
   	context.fillStyle = "green";
   	context.strokeStyle = "black";
   	context.lineWidth = 2;
   	context.strokeRect(-1 * this.mWidth / 2 , -1 * this.mHeight / 2  - 12, this.mWidth , 5);
   	context.fillRect(-1 * this.mWidth / 2 , -1 * this.mHeight / 2  - 12, this.mWidth * percent , 5);

   	context.translate(-1 * this.mCenterX , -1 * this.mCenterY);
};

Enemy.prototype.Move = function() {
   var normalVector = this.mDirectionVector.GetNormalizedVector();
   if (normalVector.GetSecondNorm() != 0) {
      this.mCenterX += normalVector.GetX() * this.mSpeed;
      this.mCenterY += normalVector.GetY() * this.mSpeed;
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
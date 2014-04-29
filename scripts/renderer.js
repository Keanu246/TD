var MAX_MILLISECONDS = 20;

function Renderer(canvas) {
	this.mCanvas = canvas;
	this.mContext = canvas.getContext("2d");
	this.mBullets = [];
	this.mBlocks = [];
	this.mTurrets = [];
	this.mEnemies = [];
	this.mMouseX = 0;
	this.mMouseY = 0;
}

function sleep (milliseconds) {
	if (milliseconds < 0) return;
	var startTime = +new Date();
	var currentTime = null;
	do { 
		currentTime = +new Date(); 
	}
	while(currentTime - startTime < milliseconds);
}

Renderer.prototype.RenderAll = function() {
	var startTime = +new Date();
	this.ManipulateObjects();
	this.Draw();
	var endTime = +new Date();
	var duration = endTime - startTime;
	console.log(duration);
	sleep(MAX_MILLISECONDS - duration);
}

Renderer.prototype.Draw = function() {

	this.mContext.save();
	this.mContext.clearRect(0 , 0 , this.mCanvas.width , this.mCanvas.height);
	for (var index = 0, found = false; index < this.mBlocks.length ; index++) {
		this.mBlocks[index].Draw(this.mContext);
		if (!found && this.mBlocks[index].IsInsideBlock(this.mMouseX , this.mMouseY)) {
			this.mBlocks[index].DrawSelector(this.mContext);
			found = true;
		}
	}

	for (var index = 0; index < this.mBullets.length ; index++) {
		this.mBullets[index].Draw(this.mContext);
	}
	for (var index = 0; index < this.mEnemies.length ; index++) {
		this.mEnemies[index].Draw(this.mContext);
	}
	for (var index = 0, found = false; index < this.mTurrets.length ; index++) {
		this.mTurrets[index].Draw(this.mContext);
		if (!found && this.mTurrets[index].IsInsideTurret(this.mMouseX , this.mMouseY)) {
			this.mTurrets[index].DrawDetails(this.mContext);
			found = true;
		}
	}

	this.mContext.restore();
};

Array.prototype.Swap = function (pos1 , pos2) {
	var x = this[pos1];
	this[pos1] = this[pos2];
	this[pos2] = x;
};

Renderer.prototype.ManipulateObjects = function() {

	var outside = 0;
	for (var bulletIndex = 0; bulletIndex < this.mBullets.length - outside; bulletIndex++) {
		if (!(this.mBullets[bulletIndex].GetCenterX() >= 0 && this.mBullets[bulletIndex].GetCenterX() < this.mCanvas.width && this.mBullets[bulletIndex].GetCenterY() >= 0 && this.mBullets[bulletIndex].GetCenterY() < this.mCanvas.height)){
			
			// Check if the bullet is outside
			this.mBullets.Swap(bulletIndex , this.mBullets.length - outside - 1);
			outside ++;
			bulletIndex --;
			// Swap with the last for fast removal;
		} else {
			// If the bullet is not outside , then we check collision with bullets
			for (var enemyIndex = 0; enemyIndex < this.mEnemies.length; enemyIndex ++) {
				if (this.mEnemies[enemyIndex].CheckCollision(this.mBullets[bulletIndex])) {
					this.mEnemies[enemyIndex].SetLife(this.mEnemies[enemyIndex].GetLife() - this.mBullets[bulletIndex].GetDamage());
					this.mBullets.Swap(bulletIndex , this.mBullets.length - outside - 1);
					outside ++;
					bulletIndex --;

					if (this.mEnemies[enemyIndex].GetLife() <= 0) {
						this.mEnemies.Swap(enemyIndex , this.mEnemies.length - 1);
						this.mEnemies = this.mEnemies.slice(0 , this.mEnemies.length - 1);
					}
					break;
				}
			}
		}

	}

	this.mBullets = this.mBullets.slice(0 , this.mBullets.length - outside);
	// Remove the bullets that go outside or make collision with an enemy

	for (var bulletIndex = 0; bulletIndex < this.mBullets.length ; bulletIndex++) {
		this.mBullets[bulletIndex].Move();
	}
	for (var enemyIndex = 0; enemyIndex < this.mEnemies.length ; enemyIndex++) {
		this.mEnemies[enemyIndex].Move();
	}
	for (var turretIndex = 0; turretIndex < this.mTurrets.length ; turretIndex++) {

		var closestEnemy = null;
		var minDistance = 100000;

		for (var enemyIndex = 0; enemyIndex < this.mEnemies.length; enemyIndex ++) {
			var relX = this.mEnemies[enemyIndex].GetCenterX() - this.mTurrets[turretIndex].GetCenterX();
			var relY = this.mEnemies[enemyIndex].GetCenterY() - this.mTurrets[turretIndex].GetCenterY();
			var distance = Math.sqrt(relX * relX + relY * relY);
			if (distance < minDistance) {
				closestEnemy = this.mEnemies[enemyIndex];
				minDistance = distance;
			}
		}

		if (this.mTurrets[turretIndex].GetFocusedEnemy() == null || !this.mTurrets[turretIndex].IsInsideRange(this.mTurrets[turretIndex].GetFocusedEnemy().GetCenterX() , this.mTurrets[turretIndex].GetFocusedEnemy().GetCenterY()) || this.mTurrets[turretIndex].GetFocusedEnemy().GetLife() <= 0)
		{
			if (closestEnemy != null && this.mTurrets[turretIndex].IsInsideRange(closestEnemy.GetCenterX() , closestEnemy.GetCenterY())) {
				this.mTurrets[turretIndex].SetFocusedEnemy(closestEnemy);
				var bullet = this.mTurrets[turretIndex].MakeBullet();
				if (bullet != null) {
					this.mBullets[this.mBullets.length] = bullet;
				}
			}
		} else {
			var bullet = this.mTurrets[turretIndex].MakeBullet();
			if (bullet != null) {
				this.mBullets[this.mBullets.length] = bullet;
			}
		}
	}
};

Renderer.prototype.SetMousePos = function(x , y) {
	this.mMouseX = x;
	this.mMouseY = y;
};

Renderer.prototype.LoadMap = function(mapName) {
	var contents = Maps[mapName];

	var row = 0, col = 0;

	var tempBlocks = [];

	for (var stringPos = 0; stringPos < contents.length; stringPos++) {
		if (contents[stringPos] != '\n') {
			var block = new Block(contents[stringPos] - '0' , 60 , 60);
			block.SetCenterX(col * 60);
			block.SetCenterY(row * 60);
			tempBlocks[tempBlocks.length] = block;
			col++;
		} else {
			row++;
			col = 0;
		}
	}
	for (var i = 0; i < 10 ; i++) {

		var enem = new Enemy(EnemyType.Basic , 30 , 30);
		enem.SetCenterX(-100.0 + i * 50);
		enem.SetCenterY(400.0);
		enem.SetDirectionX(10);
		enem.SetDirectionY(0);
		enem.SetMaxLife(20);
		this.mEnemies[this.mEnemies.length] = enem;
	}

	this.mBlocks = tempBlocks;
};

Renderer.prototype.AddTurret = function(turretType , x , y) {
	for (var index = 0, found = false; index < this.mBlocks.length && !found; index++) {
		if (this.mBlocks[index].IsInsideBlock(x , y) && this.mBlocks[index].GetType() != BlockType.Dirt) {
			var turret = new Turret(turretType , this.mBlocks[index].GetWidth() , this.mBlocks[index].GetHeight());
			turret.SetCenterX(this.mBlocks[index].GetCenterX());
			turret.SetCenterY(this.mBlocks[index].GetCenterY());
			this.mTurrets[this.mTurrets.length] = turret;
			found = true;
		}
	}
};


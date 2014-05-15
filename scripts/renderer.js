var MAX_MILLISECONDS = 20;
var MAX_ENEMIES = 10;
var frames  = 0;
var lastTime = +new Date();

function Renderer(canvas) {
	this.mCanvas = canvas;
	this.mContext = canvas.getContext("2d");
	this.mBullets = [];
	this.mTurrets = [];
	this.mEnemies = [];
	this.mMap = new Map(canvas.width , canvas.height);
	this.mMoney = 0;
	var that = this;
	this.mRenderInterval = setInterval(function(){
		that.RenderAll();
	} , 10);

	this.mSpawnInterval = setInterval(function(){
		that.SpawnRandomEnemy();
	},500);

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
	sleep(MAX_MILLISECONDS - duration);
	frames++;
	if (+new Date() - lastTime >= 1000) {
		console.log("FPS" , frames);
		lastTime = +new Date();
		frames = 0;
	}

}

Renderer.prototype.Restart = function() {
	this.mBullets = [];
	this.mTurrets = [];
	this.mEnemies = [];
	this.mMoney = 0;
	var that = this;

	this.mSpawnInterval = setInterval(function(){
		that.SpawnRandomEnemy();
	},500);
	$(".canvas_class .restart_class").css("visibility" , "hidden");
}

Renderer.prototype.Draw = function() {

	this.mContext.save();
	this.mContext.clearRect(0 , 0 , this.mCanvas.width , this.mCanvas.height);

	this.mMap.Draw(this.mContext);

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

	this.mContext.font = "20px Helvetica";
	this.mContext.fillStyle = "white";
	this.mContext.fillText("Enemies on map : " + this.mEnemies.length , this.mCanvas.width - 300 , 30);
	this.mContext.fillText("You lose when > " + MAX_ENEMIES + " enemies" , this.mCanvas.width - 300 , 50);
	this.mContext.fillText("Money : " + this.mMoney , this.mCanvas.width - 300 , 70);

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
		} else if (this.mBullets[bulletIndex].GetDistanceTravelled() > this.mBullets[bulletIndex].GetMaxDistance()) {

			this.mBullets.Swap(bulletIndex , this.mBullets.length - outside - 1);
			outside ++;
			bulletIndex --;

		} else {
			// If the bullet is not outside , then we check collision with bullets
			for (var enemyIndex = 0; enemyIndex < this.mEnemies.length; enemyIndex ++) {
				if (this.mEnemies[enemyIndex].CheckCollision(this.mBullets[bulletIndex])) {
					this.mEnemies[enemyIndex].SetLife(this.mEnemies[enemyIndex].GetLife() - this.mBullets[bulletIndex].GetDamage());
					this.mBullets.Swap(bulletIndex , this.mBullets.length - outside - 1);
					outside ++;
					bulletIndex --;

					if (this.mEnemies[enemyIndex].GetLife() <= 0) {
						this.mMoney += this.mEnemies[enemyIndex].GetMoney();
						this.mEnemies.Swap(enemyIndex , this.mEnemies.length - 1);
						this.mEnemies = this.mEnemies.slice(0 , this.mEnemies.length - 1);
					}
					break;
				}
			}
		}
	}

	this.mBullets = this.mBullets.slice(0 , this.mBullets.length - outside);
	// Remove the bullets that go outside or make collision with an enemy or travel more than
	// the max distance

	for (var bulletIndex = 0; bulletIndex < this.mBullets.length ; bulletIndex++) {
		this.mBullets[bulletIndex].Move();
	}

	outside = 0;
	for (var enemyIndex = 0; enemyIndex < this.mEnemies.length - outside ; enemyIndex++) {
		this.mMap.KeepObjectOnPath(this.mEnemies[enemyIndex]);

		if (!(this.mEnemies[enemyIndex].GetCenterX() >= 0 && this.mEnemies[enemyIndex].GetCenterX() < this.mCanvas.width && this.mEnemies[enemyIndex].GetCenterY() >= 0 && this.mEnemies[enemyIndex].GetCenterY() < this.mCanvas.height)){
			this.mMap.MoveObjectToStart(this.mEnemies[enemyIndex]);
		}
	}

	if (this.mEnemies.length > MAX_ENEMIES) {
		$(".canvas_class .restart_class").css("visibility" , "visible");
		this.mTurrets = [];
		this.mBullets = [];
		clearInterval(this.mSpawnInterval);
	}

	for (var enemyIndex = 0; enemyIndex < this.mEnemies.length ; enemyIndex++) {
		this.mEnemies[enemyIndex].Move();
	}

	for (var turretIndex = 0; turretIndex < this.mTurrets.length ; turretIndex++) {

		var closestEnemy = null;
		var minDistance = 1000;

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
	this.mMap.SetMouseX(x);
	this.mMap.SetMouseY(y);
};

Renderer.prototype.LoadMap = function(mapName) {	
	this.mMap.LoadMap(mapName);
};

Renderer.prototype.SpawnRandomEnemy = function() {
	var enemy = new Enemy(Math.floor((Math.random() * 3) + 1));
	this.mMap.MoveObjectToStart(enemy);
	this.mEnemies[this.mEnemies.length] = enemy;
}

Renderer.prototype.AddTurret = function(turretType , x , y) {
	var found = false;
	var blocks = this.mMap.GetBlocks();
	for (var row = 0; row < blocks.length && !found; row++) {
		for (var col = 0; col < blocks[row].length && !found; col++) {
			if (blocks[row][col].IsInsideBlock(x , y) && blocks[row][col].GetType() != BlockType.Dirt) {
				var turret = new Turret(turretType , blocks[row][col].GetWidth() , blocks[row][col].GetHeight());
				turret.SetCenterX(blocks[row][col].GetCenterX());
				turret.SetCenterY(blocks[row][col].GetCenterY());
				this.mTurrets[this.mTurrets.length] = turret;
				found = true;
			}
		}
	}
};


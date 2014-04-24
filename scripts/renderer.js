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
	for (var index = 0, found = false; index < this.mTurrets.length ; index++) {
		this.mTurrets[index].Draw(this.mContext);
		if (!found && this.mTurrets[index].IsInsideTurret(this.mMouseX , this.mMouseY)) {
			this.mTurrets[index].DrawDetails(this.mContext);
			found = true;
		}
	}
	for (var index = 0; index < this.mEnemies.length ; index++) {
		this.mEnemies[index].Draw(this.mContext);
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
	for (var index = 0; index < this.mBullets.length - outside; index++) {
		if (!(this.mBullets[index].GetCenterX() >= 0 && this.mBullets[index].GetCenterX() < this.mCanvas.width && this.mBullets[index].GetCenterY() >= 0 && this.mBullets[index].GetCenterY() < this.mCanvas.height)){
			this.mBullets.Swap(index , this.mBullets.length - outside - 1);
			outside ++;
			index --;
			// Swap with the last for fast removal;
		}
	}

	this.mBullets = this.mBullets.slice(0 , this.mBullets.length - outside);
	// Remove the bullets that go outside

	for (var index = 0; index < this.mBullets.length ; index++) {
		this.mBullets[index].Move();
	}
	for (var index = 0; index < this.mEnemies.length ; index++) {
		this.mEnemies[index].Move();
	}
	for (var index = 0; index < this.mTurrets.length ; index++) {
		if (this.mTurrets[index].IsInsideRange(this.mMouseX , this.mMouseY)) {
			this.mTurrets[index].SetDirectionX(this.mMouseX - this.mTurrets[index].GetCenterX());
			this.mTurrets[index].SetDirectionY(this.mMouseY - this.mTurrets[index].GetCenterY());
			var bullet = this.mTurrets[index].MakeBullet();
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

Renderer.prototype.CheckCollisions = function() {

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


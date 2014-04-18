function Renderer(canvas) {
	this.mCanvas = canvas;
	this.mContext = canvas.getContext("2d");
	this.mBullets = [];
	this.mBlocks = [];
	this.mTurrets = [];
	this.mEnemies = [];
}

Renderer.prototype.Draw = function() {

	this.mContext.clearRect(0 , 0 , this.mCanvas.width , this.mCanvas.height);

	for (var index = 0; index < this.mBlocks.length ; index++) {
		this.mBlocks[index].Draw(this.mContext);
	}
	for (var index = 0; index < this.mBullets.length ; index++) {
		this.mBullets[index].Draw(this.mContext);
	}
	for (var index = 0; index < this.mTurrets.length ; index++) {
		this.mTurrets[index].Draw(this.mContext);
	}
	for (var index = 0; index < this.mEnemies.length ; index++) {
		this.mEnemies[index].Draw(this.mContext);
	}
};

Renderer.prototype.MoveObjects = function() {
	for (var index = 0; index < this.mBullets.length ; index++) {
		this.mBullets[index].SetCenterX(this.mBullets[index].GetCenterX() + this.mBullets[index].GetDirectionX());
		this.mBullets[index].SetCenterY(this.mBullets[index].GetCenterY() + this.mBullets[index].GetDirectionY());
	}
	for (var index = 0; index < this.mEnemies.length ; index++) {
		this.mEnemies[index].SetCenterX(this.mEnemies[index].GetCenterX() + this.mEnemies[index].GetDirectionX());
		this.mEnemies[index].SetCenterY(this.mEnemies[index].GetCenterY() + this.mEnemies[index].GetDirectionY());
	}
}

Renderer.prototype.AddBullet = function(bullet) {
	this.mBullets[this.mBullets.length] = bullet;
};

Renderer.prototype.LoadMap = function(mapFile) {
	var request = new XMLHttpRequest(); 
	request.open("GET","maps/" + mapFile + ".map",false); 
	request.send(); 
	var contents = request.responseText;

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
}
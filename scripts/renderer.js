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

Renderer.prototype.AddBullet = function(bullet) {
	this.mBullets[this.mBullets.length] = bullet;
};
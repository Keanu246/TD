var BlockType = {
	Dirt : 1,
	Road : 2
};

function Block(blockType , width , height){

   // Add object properties like this
   this.mCenterX = 0.0;
   this.mCenterY = 0.0;
   this.mBulletType = blockType;
   this.mBitmap = new Image();
   if (blockType == BlockType.Dirt) {
   	this.mBitmap.src = "images/block-dirt.png";
   } else if (blockType == BlockType.Road) {
   	this.mBitmap.src = "images/block-road.png"
   }
   this.mWidth = width;
   this.mHeight = height;
}

Block.prototype.Constructor = Block;

Block.prototype.SetCenterX = function(x) {
	this.mCenterX = x;
};

Block.prototype.SetCenterY = function(y) {
	this.mCenterY = y;
};

Block.prototype.GetCenterX = function() {
	return this.mCenterX;
};

Block.prototype.GetCenterY = function() {
	return this.mCenterY;
};

Block.prototype.Draw = function(context) {
	context.translate(this.mCenterX , this.mCenterY); 
	context.drawImage(this.mBitmap , -1 * this.mWidth / 2, -1 * this.mHeight / 2, this.mWidth , this.mHeight);
   	context.translate(-1 * this.mCenterX , -1 * this.mCenterY);   
}
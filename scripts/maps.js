var Maps = {
	"easy_map": "x0xxxxxxxxxxxxxxxxxxx\n"+
				"x1x11111111111111111x\n"+
				"x1x1xxxxxxxxxxxxxxx1x\n"+
				"x1x1x1111x11111111x1x\n"+
				"x1x1x1xx1x1xxxxxx1x1x\n"+ 
				"x1x1x1xx1x1xxxxxx1x1x\n"+
				"x1x1x1xx1x1xxxxxx1x1x\n"+
				"x1x1x1xx111xxxxxx1x1x\n"+
				"x1x1x1xxxxxxxxxxx1x1x\n"+
				"x1x1x1111111111xx1x1x\n"+
				"x111xxxxxxxxxx1xx111x\n"+
				"xxxxxxxxxxxxxx2xxxxxx\n",

   "medium_map":"x0xxxxxxxxxxxxxxxxxxx\n"+
		   		"x1xxxxxxxxxxxxxxxxxxx\n"+
				"x1xxxxxxxxxxxxxxxxxxx\n"+
				"x1xxxxxxxx1111xxxxxxx\n"+
				"x1xxxxxxxx1xx1xxxxxxx\n"+ 
				"x1xxxxxxxx1xx1xxxxxxx\n"+
				"x1xxxxxxxx1xx1xxxxxxx\n"+
				"x1x11111111xx1xxxxxxx\n"+
				"x1x1xxxxxxxxx1xxxxxxx\n"+
				"x1x1xxxxxxxxx1xxxxxxx\n"+
				"x111xxxxxxxx11xxxxxxx\n"+
				"xxxxxxxxxxxx2xxxxxxxx\n",

	"hard_map": "x0xxxxxxx111111111112\n"+
		   		"x1xxxxxxx1xxxxxxxxxxx\n"+
				"x1xxxxxxx1xxxxxxxxxxx\n"+
				"x1xxxxxxx1xxxxxxxxxxx\n"+
				"x1xxxx1111xxxxxxxxxxx\n"+ 
				"x1xxxx1xxxxxxxxxxxxxx\n"+
				"x1xxxx1xxxxxxxxxxxxxx\n"+
				"x1x1111xxxxxxxxxxxxxx\n"+
				"x1x1xxxxxxxxxxxxxxxxx\n"+
				"x1x1xxxxxxxxxxxxxxxxx\n"+
				"x111xxxxxxxxxxxxxxxxx\n"+
				"xxxxxxxxxxxxxxxxxxxxx\n",
};

function Map (width , height) {
	this.mBlocks = [];
	this.mPathPoints = [];
	this.mMouseX = 0;
	this.mMouseY = 0;
	this.mStart = null;
	this.mFinish = null;
	this.mBitmap = null;
	this.mWidth = width;
	this.mHeight = height;
	this.mArrowImage = new Image();
	this.mArrowImage.src = "images/arrow.png";
}

Map.prototype.SetMouseX = function(x) {
	this.mMouseX = x;
};

Map.prototype.SetMouseY = function(y) {
	this.mMouseY = y;
};

Map.prototype.Draw = function(context) {		 

	var found = false;
	for (var blockRow = 0; blockRow < this.mBlocks.length; blockRow++) {
		for (var blockCol = 0; blockCol < this.mBlocks[blockRow].length; blockCol++) {

			this.mBlocks[blockRow][blockCol].Draw(context);
			if (!found && this.mBlocks[blockRow][blockCol].IsInsideBlock(this.mMouseX , this.mMouseY)) {
				this.mBlocks[blockRow][blockCol].DrawSelector(context);
				found = true;
			}
		}
	}
	if (this.mStart != null) {
		var position1 = this.mStart;
		var position2 = this.mPathPoints[0];
		var relX = this.mBlocks[position2.GetFirst()][position2.GetSecond()].GetCenterX() - this.mBlocks[position1.GetFirst()][position1.GetSecond()].GetCenterX();
		var relY = this.mBlocks[position2.GetFirst()][position2.GetSecond()].GetCenterY() - this.mBlocks[position1.GetFirst()][position2.GetSecond()].GetCenterY();
		var angle = Math.atan2(relX , -1 * relY);
		context.translate(this.mBlocks[position1.GetFirst()][position1.GetSecond()].GetCenterX() , this.mBlocks[position1.GetFirst()][position1.GetSecond()].GetCenterY());
		context.rotate(angle);
		context.drawImage(this.mArrowImage , -20 , -20 , 40 , 40);
		context.rotate(-1* angle);
		context.translate(-1 * this.mBlocks[position1.GetFirst()][position1.GetSecond()].GetCenterX() , -1 * this.mBlocks[position1.GetFirst()][position1.GetSecond()].GetCenterY());
		
	}
};

Map.prototype.LoadMap = function(mapName) {
	var contents = Maps[mapName];

	var row = 0, col = 0;

	var tempBlocks = [];
	tempBlocks[row] = [];

	var selectMatrix = [];
	selectMatrix[row] = [];

	var start , finish;

	//Create the matrix of the map;

	for (var stringPos = 0; stringPos < contents.length; stringPos++) {
		if (contents[stringPos] != '\n') {
			var block = null;
			if (contents[stringPos] == '0') {
				var block = new Block(BlockType.Dirt , 60 , 60);
				start = new Pair(row , col);
			} else if (contents[stringPos] == '1') {
				var block = new Block(BlockType.Dirt , 60 , 60);
			} else if (contents[stringPos] == '2') {
				var block = new Block(BlockType.Dirt , 60 , 60);
				finish = new Pair(row , col);
			} else {
				var block = new Block(BlockType.Road , 60 , 60);
			}
			block.SetCenterX(col * 60);
			block.SetCenterY(row * 60 + 30);
			tempBlocks[row][col] = block;
			selectMatrix[row][col] = false;
			col++;
		} else {
			row++;
			tempBlocks[row] = [];
			selectMatrix[row] = [];
			col = 0;
		}
	}

	var current = new Pair(start.GetFirst() , start.GetSecond());
	selectMatrix[current.GetFirst()][current.GetSecond()] = true;
	var dx = [-1 , 1 , 0 , 0];
	var dy = [0 , 0 , -1 , 1];
	var pathPoints = [];

	while (current.GetFirst() != finish.GetFirst() || current.GetSecond() != finish.GetSecond()) {
		for (var i = 0; i < 4 ; i++) {
			var temp = new Pair(current.GetFirst() + dx[i] , current.GetSecond() + dy[i]);
			if (temp.GetFirst() >= 0 && temp.GetFirst() < tempBlocks.length && temp.GetSecond() >= 0 && temp.GetSecond() < tempBlocks[temp.GetFirst()].length) {
				if (!selectMatrix[temp.GetFirst()][temp.GetSecond()] && tempBlocks[temp.GetFirst()][temp.GetSecond()].GetType() == BlockType.Dirt) {
					selectMatrix[temp.GetFirst()][temp.GetSecond()] = true;
					pathPoints[pathPoints.length] = temp;
					current = temp;
					break;
				}
			}
		}
	}
	this.mBlocks = tempBlocks;
	this.mFinish = finish;
	this.mStart = start;
	this.mPathPoints = pathPoints;

	console.log("Map : " + mapName + " loaded!");

};

Map.prototype.MoveObjectToStart = function(object) {
	object.SetCenterX(this.mBlocks[this.mStart.GetFirst()][this.mStart.GetSecond()].GetCenterX());
	object.SetCenterY(this.mBlocks[this.mStart.GetFirst()][this.mStart.GetSecond()].GetCenterY());
	object.SetDirectionX(this.mBlocks[this.mPathPoints[0].GetFirst()][this.mPathPoints[0].GetSecond()].GetCenterX() - this.mBlocks[this.mStart.GetFirst()][this.mStart.GetSecond()].GetCenterX());
	object.SetDirectionY(this.mBlocks[this.mPathPoints[0].GetFirst()][this.mPathPoints[0].GetSecond()].GetCenterY() - this.mBlocks[this.mStart.GetFirst()][this.mStart.GetSecond()].GetCenterY());
};

Map.prototype.KeepObjectOnPath = function(object) {
	for (var blockIndex = 0; blockIndex < this.mPathPoints.length - 1 ; blockIndex++) {
		var position = this.mPathPoints[blockIndex];
		var relX = this.mBlocks[position.GetFirst()][position.GetSecond()].GetCenterX() - object.GetCenterX();
		var relY = this.mBlocks[position.GetFirst()][position.GetSecond()].GetCenterY() - object.GetCenterY();
		var distance = Math.sqrt(relX * relX + relY * relY);
		if (distance < 5.0) {
			position = this.mPathPoints[blockIndex + 1];
			object.SetDirectionX(this.mBlocks[position.GetFirst()][position.GetSecond()].GetCenterX() - object.GetCenterX());
			object.SetDirectionY(this.mBlocks[position.GetFirst()][position.GetSecond()].GetCenterY() - object.GetCenterY());
		}
	}	
}

Map.prototype.GetBlocks = function() {
	return this.mBlocks;
}
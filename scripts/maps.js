var Maps = { 
   "easy_map":  "x0xxxxxxxxxxxxxxxxxxx\n"+
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
				"xxxxxxxxxxxx2xxxxxxxx\n"
};

function Map () {
	this.mBlocks = [];
	this.mPathPoints = [];
	this.mMouseX = 0;
	this.mMouseY = 0;
	this.mStart = null;
	this.mFinish = null;
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
			block.SetCenterY(row * 60);
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
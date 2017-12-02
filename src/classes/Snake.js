directions = new Enum("up","left", "down", "right");
controlModes = new Enum("human","AI");
directionChanges = new Enum({"x":0,"y":-1},{"x":-1,"y":0},{"x":0,"y":1},{"x":1,"y":0});

/**
 * check if the user is attempting to change directions
 */
Snake.prototype.checkUpdateDirection = function() {
	if (this.controlMode != controlModes.human) {
		return;
	}
	
	let desiredDir = this.dir;
	if (keyStates["W"]) {
		desiredDir = directions.up;
	}
	else if (keyStates["A"]) {
		desiredDir = directions.left;
	}
	else if (keyStates["S"]) {
		desiredDir = directions.down;
	}
	else if (keyStates["D"]) {
		desiredDir = directions.right;
	}
	//if the desired space is not our neck, accept the desired direction
	let desiredSpace = getAdjacentSpace(this.spaces, desiredDir,this.gridX,this.gridY);
	if (desiredSpace.x != this.neck.x && desiredSpace.y != this.neck.y) {
		this.dir = desiredDir;
	}
}

/**
 * have the AI controlled snake choose the next direction in which to face
 * @returns the direction in which the AI controlled snake wishes to face
 */
Snake.prototype.AIChooseDir = function() {
	let foodPath = calculatePath(this.spaces,{"x":this.gridX,"y":this.gridY},foodPos,compareCoords,getAdjacentSpaces,spaceIsFree,true);
	//if we couldn't find a valid path, simply move forward for now
	if (foodPath.length > 1) {
		return getAdjacentDir({"x":this.gridX,"y":this.gridY}, foodPath[1]);	
	}
	return this.dir;
}

/**
 * move the snake in its current facing direction, collecting any colliding food, and ending the game if it hits its tail
 */
Snake.prototype.update = function() {
	this.checkUpdateDirection();
	this.moveTimer += deltaTime;
	if (this.moveTimer >= this.moveCompleteTime) {
		this.moveTimer -= this.moveCompleteTime;
		this.moveForwards();
	}
}

/**
 * check whether or not the current space at (gridX,griY) is valid
 * @returns whether the current space is valid (true) or not (false)
 */
Snake.prototype.spaceValid = function() {
	//first check that we are within the playfield
	if (this.gridX < 0 || this.gridY < 0 || this.gridX >= gridSize || this.gridY >= gridSize) {
		return false;
	}
	
	//next check whether or not our head is intersecting another part of our body
	return (this.spaces[this.gridX][this.gridY] == -1 || (this.gridX == this.tail.x && this.gridY == this.tail.y));
}

/**
 * check if we have just landed on some food
 */
Snake.prototype.checkEat = function() {
	if (this.gridX == foodPos.x && this.gridY == foodPos.y) {
		++score;
		placeFood();
		return true;
	}
	return false;
}

/**
 * move the snake forwards in the direction in which it is facing
 */
Snake.prototype.moveForwards = function() {
	//move to our new x and y positions
	try {
		var adjacentSpace = getAdjacentSpace(this.spaces,this.dir,this.gridX,this.gridY);
	}
	//if we experience an error when getting the adjacent space, we must have moved off of the grid
	catch(err) {
		endGame();
		return;
	}
	this.gridX = adjacentSpace.x;
	this.gridY = adjacentSpace.y;
	
	if (!this.spaceValid()) {
		endGame();
		return;
	}
	
	//remove our tail unless we just ate something
	if (!this.checkEat()) {
		let oldTail = this.tail;
		this.tail = getAdjacentSpace(this.spaces,this.spaces[this.tail.x][this.tail.y],this.tail.x,this.tail.y);
		this.spaces[oldTail.x][oldTail.y] = -1;
	}
	
	//add a space at our new head
	this.spaces[this.gridX][this.gridY] = this.dir;
	this.neck = this.head;
	this.head = {"x":this.gridX,"y":this.gridY};
	
	//update our neck to point to our final head position
	this.spaces[this.neck.x][this.neck.y] = this.dir;
	
	//choose where we will want to move next if we are the AI
	if (this.controlMode == controlModes.AI) {
		this.dir = this.AIChooseDir();
		
	}
}

/**
 * initialize the snake's location and size to their starting values
 */
Snake.prototype.init = function() {
	this.gridX = 5;
	this.gridY = 8;
	this.size = 4;
	
	this.dir = directions.right;
	//move time (measured in seconds)
	this.moveTimer = 0;
	this.moveCompleteTime = .001;
	
	this.spaces = [];
	for (let i = 0; i < gridSize; ++i) {
		this.spaces[i] = [];
		for (let r = 0; r < gridSize; ++r) {
			this.spaces[i][r] = -1;
		}
	}
	for (let i = 0; i < this.size; this.spaces[this.gridX-i][this.gridY] = directions.right, ++i);
	this.head = {"x":this.gridX,"y":this.gridY};
	this.neck = {"x":this.gridX-1,"y":this.gridY};
	this.tail = {"x":this.gridX-this.size+1,"y":this.gridY};
}


/**
 * Snake class; houses the player-controlled snake, which can move around, eat food, and die
 * @param controlMode: the mode defining whether the snake is controlled by the Player, or by the AI
 */
function Snake(controlMode) {
	this.controlMode = controlMode;
	this.init();
}
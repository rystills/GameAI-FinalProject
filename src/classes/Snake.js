directions = new Enum("up","left", "down", "right");
directionChanges = new Enum([0,-1],[-1,0],[0,1],[1,0]);

/**
 * check if the user is attempting to change directions
 */
Snake.prototype.checkUpdateDirection = function() {
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
	let desiredSpace = getAdjacentSpace(desiredDir,this.gridX,this.gridY);
	if (desiredSpace[0] != this.neck[0] && desiredSpace[1] != this.neck[1]) {
		this.dir = desiredDir;
	}
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
	return (this.spaces[this.gridX][this.gridY] == -1 || (this.gridX == this.tail[0] && this.gridY == this.tail[1]));
}

/**
 * check if we have just landed on some food
 */
Snake.prototype.checkEat = function() {
	if (this.gridX == foodPos[0] && this.gridY == foodPos[1]) {
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
	let adjacentSpace = getAdjacentSpace(this.dir,this.gridX,this.gridY);
	this.gridX = adjacentSpace[0];
	this.gridY = adjacentSpace[1];
	
	if (!this.spaceValid()) {
		endGame();
		return;
	}
	
	//remove one space from our tail and add one at our head
	this.spaces[this.gridX][this.gridY] = this.dir;
	this.neck = this.head;
	this.head = [this.gridX,this.gridY];
	
	//update our neck to point to our final head position
	this.spaces[this.neck[0]][this.neck[1]] = this.dir;
	
	//remove our tail unless we just ate something
	if (!this.checkEat()) {
		let oldTail = this.tail;
		this.tail = getAdjacentSpace(this.spaces[this.tail[0]][this.tail[1]],this.tail[0],this.tail[1]);
		this.spaces[oldTail[0]][oldTail[1]] = -1;
	}
	
}


/**
 * Snake class; houses the player-controlled snake, which can move around, eat food, and die
 * @param gridX: the x coordinate of the snake in the world grid
 * @param gridY: the y coordinate of the snake in the world grid
 */
function Snake(gridX,gridY,size) {
	this.gridX = gridX;
	this.gridY = gridY;
	
	this.dir = directions.up;
	//move time (measured in seconds)
	this.moveTimer = 0;
	this.moveCompleteTime = .1;
	
	this.spaces = [];
	for (let i = 0; i < gridSize; ++i) {
		this.spaces[i] = [];
		for (let r = 0; r < gridSize; ++r) {
			this.spaces[i][r] = -1;
		}
	}
	for (let i = 0; i < size; this.spaces[gridX-i][gridY] = directions.right, ++i);
	this.head = [gridX,gridY];
	this.neck = [gridX-1,gridY];
	this.tail = [gridX-size+1,gridY];
}
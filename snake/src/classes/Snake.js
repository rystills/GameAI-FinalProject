directions = new Enum("up","left", "down", "right");
controlModes = new Enum("human","AI");
directionChanges = new Enum({"x":0,"y":-1},{"x":-1,"y":0},{"x":0,"y":1},{"x":1,"y":0});
algorithms = new Enum("naive","hamiltonian", "naivePerfect", "maxPath");

Snake.prototype.visitedQueue = []

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
	try {
		let desiredSpace = getAdjacentSpace(this.spaces, desiredDir,this.gridX,this.gridY);
		if (desiredSpace.x != this.neck.x && desiredSpace.y != this.neck.y) {
			this.dir = desiredDir;
		}
	}
	//safely ignore out of bounds errors when a human's desired direction takes them off of the grid
	catch(err) {
		this.dir = desiredDir;
	}
}

/**
 * choose the next direction in which to face using a naive perfect algorithm
 */
Snake.prototype.chooseDirNaivePerfect = function() {
	//optimization; if size is <= gridSize, simply use the shortest path to the food
	if (this.size < gridSize) {
		return this.chooseDirNaive();
	}
	//after optimization, path to just shy of topright corner, then path to just shy of topleft corner, to reset the body
	if (this.size == gridSize) {
		if (this.optimizationState == 0) {
			let cornerPath = calculatePath(this.spaces,{"x":this.gridX,"y":this.gridY},{"x":gridSize-2,"y":2},compareCoords,getAdjacentSpaces,spaceIsFree,true);
			if (cornerPath.length > 1) {
				return getAdjacentDir({"x":this.gridX,"y":this.gridY}, cornerPath[1]);
			}
			this.optimizationState += 1;
			return this.chooseDirNaivePerfect();
		}
		if (this.optimizationState == 1) {
			let cornerPath = calculatePath(this.spaces,{"x":this.gridX,"y":this.gridY},{"x":1,"y":2},compareCoords,getAdjacentSpaces,spaceIsFree,true);
			if (cornerPath.length > 1) {
				return getAdjacentDir({"x":this.gridX,"y":this.gridY}, cornerPath[1]);
			}
			this.optimizationState += 1;
			//finally, move down so that we don't get stuck on ourselves
			return directions.down;
		}
	}
	
	//optimization; if we are directly above the food and there is no body part below it, simply move down
	if ((this.optimizationState == -1) || foodPos.x == this.gridX && this.gridY < foodPos.y && this.gridX != gridSize-1 && (foodPos.y == gridSize - 1 || getAdjacentSpace(this.spaces,directions.down,foodPos.x,foodPos.y).type == "free") && (this.gridY == 0)) {
		this.optimizationState = -1;
		//move down until we reach our body
		//if there is not a body part two spaces below us move down
		try {
			if (getAdjacentSpace(this.spaces,directions.down,this.gridX,this.gridY+1).type != "blocked") {
				if (foodPos.x == this.gridX) {
					return directions.down;	
				}
				if (foodPos.x <= this.gridX && foodPos.y < this.gridY) {
					return directions.down;
				}
			}
			
		}
		catch (err) {}
		
		this.optimizationState = 0;
		//move down only until we reach the food
		/*if (getAdjacentSpace(this.spaces,directions.down,this.gridX,this.gridY).type == "food") {
			console.log("wew");
			this.optimizationState = 0;
		}
		return directions.down;*/
	}
	//in the bottom right corner, we move up
	if (this.gridY == gridSize-1 && this.gridX == gridSize-1) {
		return directions.up;
	}
	//if we are on the right side, move up until we hit the top, then move left
	if (this.gridX == gridSize-1) {
		if (this.gridY == 0) {
			return directions.left;
		}
		return directions.up;
	}
	
	//if we are on an even row, move left until we hit the wall, then move down
	if (this.gridY%2 == 0) {
		if (this.gridX == 0) {
			return directions.down;
		}
		return directions.left;
	}
	
	//if we are on an odd row, move right until we hit one shy of the wall unless we are at the bottom of the grid, then move down
	if (this.gridY%2 != 0) {
		if (this.gridX == gridSize - 2 && this.gridY != gridSize-1) {
			return directions.down;
		}
		return directions.right;
	}
	
	//if we hit none of those cases, we must have won
	return this.direction;
}

/**
 * choose the next direction in which to face using the naive algorithm
 */
Snake.prototype.chooseDirNaive = function() {
	let foodPath = calculatePath(this.spaces,{"x":this.gridX,"y":this.gridY},foodPos,compareCoords,getAdjacentSpaces,spaceIsFree,true);
	//if we found a path to the food, go there
	if (foodPath.length > 1) {
		return getAdjacentDir({"x":this.gridX,"y":this.gridY}, foodPath[1]);	
	}
	//no path to food was found; move forward unless it will kill us
	try {
		getAdjacentSpace(this.spaces,this.dir,this.gridX,this.gridY);
		return this.dir;
	}
	//moving forward will kill us, so turn 90 degrees counterclockwise
	catch (err) {
		return (this.dir+1)%4;
	}
		
}

/**
 * choose the next direction by finding the maximum path to the food
 */
Snake.prototype.chooseDirMaxPath = function() {
	let minPath = calculatePath(this.spaces,{"x":this.gridX,"y":this.gridY},foodPos,compareCoords,getAdjacentSpaces,spaceIsFree,true);
	//todo:
	//for each space in the path:
		//try to extend in either other direction (ie. for a right space, try to extend up or down)
	
}

/**
 * choose the next direction in which to face using the hamiltonian algorithm
 */
Snake.prototype.chooseDirHamiltonian = function() {
	if (this.size < 16) {
		return this.chooseDirNaive();
	}

	if (this.visitedQueue.length >= 50) {
		// Grid is 30x30, so 900 tiles
		this.visitedQueue.shift();
	}

	curLoc = this.head.x + "," + this.head.y;

	temp = this.head.x + 1;
	nextRight = temp + "," + this.head.y;

	temp = this.head.y+1
	nextDown = this.head.x + "," + temp;

	temp = this.head.x-1
	nextLeft = this.head.x-1 + "," + this.head.y;

	temp = this.head.y-1
	nextUp = this.head.x + "," + temp;
	
	if (this.visitedQueue.indexOf(curLoc) == -1) {
		// If current location is not in visitedQueue,
		// push it to the queue
		this.visitedQueue.push(curLoc);
	}
	
	// Tries to go right first, then down, then left, then up
	if (this.visitedQueue.indexOf(nextRight) == -1 && this.head.x != 13) {
		return directions.right;
	} else if (this.visitedQueue.indexOf(nextDown) == -1 && this.head.y != 13) {
		return directions.down;
	} else if (this.visitedQueue.indexOf(nextLeft) == -1 && this.head.x != 0) {
		return directions.left;
	} else {
		return directions.up;
	}

	return this.dir;
}

/**
 * have the AI controlled snake choose the next direction in which to face
 * @returns the direction in which the AI controlled snake wishes to face
 */
Snake.prototype.AIChooseDir = function() {
	switch (this.algorithm) {
		case algorithms.naive:
			return this.chooseDirNaive();
			
		case algorithms.hamiltonian:
			return this.chooseDirHamiltonian();
		
		case algorithms.naivePerfect:
			return this.chooseDirNaivePerfect();
			
		case algorithms.maxPath:
			return this.chooseDirMaxPath();
	}
}

/**
 * move the snake in its current facing direction, collecting any colliding food, and ending the game if it hits its tail
 */
Snake.prototype.update = function() {
	this.checkUpdateDirection();
	this.moveTimer += deltaTime;
	while (this.moveTimer >= this.moveCompleteTime) {
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
		++this.size;
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
		this.visitedQueue = []
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
	++steps;
}

/**
 * initialize the snake's location and size to their starting values
 */
Snake.prototype.init = function() {
	this.gridX = 5;
	this.gridY = 1;
	this.size = 4;
	
	this.dir = directions.right;
	//move time (measured in seconds)
	this.moveTimer = 0;
	
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
	
	//optimization state
	this.optimizationState = 0;
}


/**
 * Snake class; houses the player-controlled snake, which can move around, eat food, and die
 * @param controlMode: the mode defining whether the snake is controlled by the Player, or by the AI
 */
function Snake(controlMode) {
	this.controlMode = controlMode;
	this.moveCompleteTime = .01;
	this.algorithm = algorithms.naivePerfect;
	this.init();
}
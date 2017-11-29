directions = new Enum("up","left", "down", "right");
directionChanges = new Enum([0,-1],[-1,0],[0,1],[1,0]);

/**
 * move the snake in its current facing direction, collecting any colliding food, and ending the game if it hits its tail
 */
Snake.prototype.update = function() {
	this.moveTimer += deltaTime;
	if (this.moveTimer >= this.moveCompleteTime) {
		this.moveTimer -= this.moveCompleteTime;
		this.moveForwards();
	}
}

/**
 * move the snake forwards in the direction in which it is facing
 */
Snake.prototype.moveForwards = function() {
	//move to our new x and y positions
	this.gridX += directionChanges[this.dir][0];
	this.gridY += directionChanges[this.dir][1];
	
	//remove one space from our tail and add one at our head
	this.spaces.splice(0,1);
	this.spaces.push([this.gridX,this.gridY]);
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
	this.size = size;
	for (let i = 0; i < size; this.spaces.push([gridX,gridY]), ++i);
}
directions = new Enum("up","left", "right", "down");

/**
 * move the snake in its current facing direction, collecting any colliding food, and ending the game if it hits its tail
 */
Snake.prototype.update = function() {
	
}


/**
 * Snake class; houses the player-controlled snake, which can move around, eat food, and die
 * @param gridX: the x coordinate of the snake in the world grid
 * @param gridY: the y coordinate of the snake in the world grid
 */
function Snake(gridX,gridY,size) {
	this.gridX = gridX;
	this.gridY = gridY;
	calculatePositionFromGrid(this);
	
	this.dir = directions.up;
	this.moveTimer = 0;
}
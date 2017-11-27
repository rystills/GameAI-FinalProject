shapeTypes = new Enum("square","circle", "triangle");
shapeColors = new Enum("blue","green", "red");
colorValues = {"blue":"#0000FF","green":"#00FF00","red":"#FF0000"};
shapePointNumbers = {"square":4,"triangle":3,"circle":69};
	
/**
 * this shape just reached the edge of the screen; remove the shape from the object list and subtract from the player's score
 */
Shape.prototype.reachedScreenEdge = function() {
	score -= 3;
	objects.splice(objects.indexOf(this),1);
}

/**
 * move the shape towards the left edge of the screen, ending the game if it reaches the edge
 */
Shape.prototype.update = function() {
	this.x -= 10*deltaTime * this.speed;
	if (this.x <= 0) {
		this.reachedScreenEdge();
	}
}

/**
 * Shape class; houses a single shape of the desired type and color, located at the specified center coordinates
 * @param type: the desired shape type
 * @param color: the desired shape color
 * @param cx: the center x coordinate of the shape
 * @param cy: the center y coordinate of the shape
 */
function Shape(type, color, cx, cy) {
	this.type = type;
	this.color = color;
	this.x = cx;
	this.y = cy;
	
	this.imgName = shapeTypes[this.type] + shapeColors[this.color];
	this.dir = 0;
	
	//cap the speed from going too high
	this.speed = Math.min(15 + 100*(totalTime/1000), 45);
	this.width = this.height = shapeDim;
}
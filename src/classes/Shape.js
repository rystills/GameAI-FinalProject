shapeTypes = new Enum("square","circle", "triangle");
shapeColors = new Enum("blue","green", "red");
colorValues = {"blue":"#0000FF","green":"#00FF00","red":"#FF0000"};
shapePointNumbers = {"square":4,"triangle":3,"circle":69};
	
Shape.prototype.update = function() {
	this.x -= 100*deltaTime;
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
	
	this.imgName = images[shapeTypes[this.type] + shapeColors[this.color]];
	this.dir = 0;
}
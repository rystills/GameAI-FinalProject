MouseFollower.prototype.changeColor = function() {
	this.color = (this.color == shapeColors.red ? shapeColors.green : (this.color == shapeColors.green ? shapeColors.blue : shapeColors.red));
	this.imgName = shapeTypes[this.type] + shapeColors[this.color];
}

MouseFollower.prototype.changeType = function() {
	this.type = (this.type == shapeTypes.triangle ? shapeTypes.square : (this.type == shapeTypes.square ? shapeTypes.circle : shapeTypes.triangle));
	this.imgName = shapeTypes[this.type] + shapeColors[this.color];
}

/**
 * move the mouse follower to the mouse position, changing type or color on mouse click
 */
MouseFollower.prototype.update = function() {
	//move to the mouse
	this.x = cnv.mousePos.x;
	this.y = cnv.mousePos.y;
	
	//change type or color, if desired
	if (mousePressedRight) {
		this.changeColor();
	}
	if (mousePressedLeft) {
		this.changeType();
	}
	
	//check for collisions with shapes
	for (let i = 0; i < objects.length; ++i) {
		if (objects[i] instanceof Shape) {
			if (collisionCheck(this,objects[i])) {
				if (objects[i].type == this.type && objects[i].color == this.color) {
					objects.splice(i,1);
					++score;
				}	
			}
		}
	}
}

/**
 * MouseFollower class; follows the cursor, allowing the player to grab similarly typed and colored shapes
 */
function MouseFollower() {
	this.type = shapeTypes.triangle;
	this.color = shapeColors.red;
	this.x = this.y = 0;
	
	this.imgName = shapeTypes[this.type] + shapeColors[this.color];
	this.dir = 0;
	this.width = this.height = shapeDim;
}
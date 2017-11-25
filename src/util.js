/**
 * find the index at which to insert item x in list a, assuming a is sorted
 * @param a: the list of elements to search
 * @param x: the item to be inserted into the list
 * @param key: the key to apply to list items when determining the insert location
 * @param leftMost: whether to return the left-most insertion location (true) or the right-most insertion location (false)
 * @param lo: the lower bound of the search space (inclusive)
 * @param hi: the upper bound of the search space (exclusive)
 * @returns some value i such that all e in a[:i] have e <= x, and all e in a[i:] have e > x.
 * @throws bounds error if lo < 0 or high > a.length
 */
function binarySearch(a, x, key, leftMost, lo, hi) {
	if (lo == null) {
		lo = 0;
	}
	else if (lo < 0) {
		throw "ERROR: lo must be non-negative";
	}
		
	if (hi == null) {
		hi = a.length;
	}
	else if (hi > a.length) {
		throw "Error: hi must be <= a.length";
	}
	
	if (leftMost == null) {
		leftMost = false;
	}
	
	if (key != null) {
		x = x[key]; 
	}
	if (leftMost) {
		while (lo < hi) {
			mid = ~~((lo+hi)/2);
			if (key == null) {
				value = a[mid];
			}
			else {
				value = a[mid][key]; 
			}
			if (x <= value) {
				hi = mid;
			}
			else {
				lo = mid+1;
			}
		}
	}
	else {
		while (lo < hi) {
			mid = ~~((lo+hi)/2);
			if (key == null) {
				value = a[mid];
			}
			else {
				value = a[mid][key]; 
			}
			if (x < value) {
				hi = mid;
			}
			else {
				lo = mid+1;
			}
		}
	}
	
	return lo;
}

/**
 * make the input object a child of the specified parent object
 * @param objectName: the name of the child object being given inheritance
 * @param parentName: the name of the parent object
 */
function makeChild(objectName, parentName) {
	eval(objectName + ".prototype = Object.create(" + parentName + ".prototype);" + 
			objectName + ".prototype.constructor = " + objectName + ";");
}

/**
 * add a 'last' method to arrays for simple retrieval of the last element in an array
 */
if (!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    };
};

/**
 * get the angle between two points
 * @param x1: the x coordinate of the first point
 * @param y1: the y coordinate of the first point
 * @param x2: the x coordinate of the second point
 * @param y2: the y coordinate of the second point
 * @param radians: whether the returned angle should be in radians (true) or degrees (false)
 * @returns the angle between the two input points
 */
function getAngle(x1,y1,x2,y2,radians) {
	if (radians == null || radians == false) {
		return Math.atan2((y2-y1),(x2-x1))*180/Math.PI;
	}
	return Math.atan2((y2-y1),(x2-x1));
}

/**
 * get a random integer between min (inclusive) and max (exclusive)
 * @param min: the inclusive minimum integer value
 * @param max: the exclusive maximum integer value
 * @returns the randomly generated integer between min and max
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * draw an image centered around the specified coordinates, with an optional arbitrary rotation
 * @param imageName: the name of the image to draw
 * @param ctx: the context onto which to draw the image
 * @param x: the center x coordinate at which to draw the image
 * @param y: the center x coordinate at which to draw the image
 * @param rot: if specified, the amount in degrees by which to rotate the image
 */
function drawCentered(imageName,ctx,x,y,rot) {
	let img = images[imageName];
	ctx.save();
	//perform the inverse of the object's translation to effectively bring it to the origin
	ctx.translate(x,y);
	if (rot != 0) {
		ctx.rotate(rot*Math.PI/180);
	}
	ctx.drawImage(img, -(img.width/2), -(img.height/2));
	//restore the canvas now that we're done modifying it
	ctx.restore();
}

/**
 * get the distance between two points
 * @param x1: the x coordinate of the first point
 * @param y1: the y coordinate of the first point
 * @param x2: the x coordinate of the second point
 * @param y2: the y coordinate of the second point
 * @returns the distance between the two input points
 */
function getDistance(x1,y1,x2,y2) {
	return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}

/**
 * check for a collision between objects a and b
 * @param a: the first collision object
 * @param b: the second collision object
 * @returns whether there is a collision between the objects (true) or not (false)
 */
function collisionCheck(a,b) {
	return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
    (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
}

/**
 * check for a collision between a point and a rect
 * @param px: the x coordinate of our point
 * @param py: the y coordinate of our point
 * @param obj: the object whose rect we check for contained point
 * @param objectPosIsTopLeft: whether obj's position represents its top-left (true) or its center (false)
 * @returns whether the point (px,py) is contained in obj's rect (true) or not (false)
 */
function pointInRect(px,py,obj, objectPosIsTopLeft) {
	if (objectPosIsTopLeft) {
		return (px > obj.x && px < obj.x + obj.width && py > obj.y && py < obj.y + obj.height);
	}
	return (px > obj.x - obj.width/2 && px < obj.x + obj.width/2
			&& py > obj.y - obj.height/2 && py < obj.y + obj.height/2); 	
	
}

/**
 * update the global deltaTime
 */
function updateTime() {
	let curTime = Date.now();
	//divide by 1,000 to get deltaTime in seconds
    deltaTime = (curTime - prevTime) / 1000;
    //cap deltaTime at ~15 ticks/sec as below this threshhold collisions may not be properly detected
    if (deltaTime > .067) {
    	deltaTime = .067;
    }
    prevTime = curTime;
    totalTime += deltaTime;
}

/**
 * calls initGlobals and begins the main update loop; to be called after resource loading
 */
function startGame() {
	initGlobals();

	//set the game to call the 'update' method on each tick
	_intervalId = setInterval(update, 1000 / fps);
}
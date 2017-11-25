/**
 * update the button's state, activating it in the event of a mouse click
 */
Button.prototype.update = function() {
	//check mouse button status
	//check if mouse is on this button 
	var mousing = pointInRect(this.canvas.mousePos.x,this.canvas.mousePos.y,this,true);
	if (mousing) {
		//if mouse button was just pressed on us, toggle pressed on
		if (mousePressedLeft) {
			this.pressed = true;
		}
		
		//if mouse button was just released on us, trigger a press 
		if (!mouseDownLeft && this.pressed) {
			//run our function, optionally passing in our argument if it has been set
			this.function(this.arg);
		}

	}
	
	this.state = "neutral";
	
	//set state based off of pressed
	if (this.pressed && mousing) {
		this.state = "press";
	}
	else if (mousing) {
		this.state = "hover";
	}

	//if mouse button is not held down, toggle pressed off
	if (!(mouseDownLeft || keyStates[String.fromCharCode(13)])) {
		this.pressed = false;
	}

	//color blend based off of state
	this.blendWhiteness = 180;
	if (this.state == "press") {
		this.blendWhiteness = 105;
	}
	else if (this.state == "hover") {
		this.blendWhiteness = 255;
	}
}

/**
 * simple class representing a button which can be pressed via a mouse click
 * @param x: the x position of the button's center
 * @param y: the y position of the button's center
 * @param cnv: the canvas to which the button belongs
 * @param text: the text string that should be drawn inside the button
 * @param fontSize: the font size of the button text
 * @param clickFunc: the function to be called when the button is triggered
 * @param clickArg: the argument to be passed in to the button's trigger function
 */
function Button(x,y,cnv, text, fontSize, clickFunc,clickArg) {
	//initialize state
	this.state = "neutral";
	//whether or not the mouse button is held on us
	this.pressed = false;
	//how brightly to blend our image (state dependent)
	this.blendWhiteness = 0;
	//button label
	this.text = text;
	//button size
	this.fontSize = fontSize;
	//init position
	this.x = x;
	this.y = y;
	//store which canvas we belong to
	this.canvas = cnv;
	//what function we run when pressed
	this.function = clickFunc;
	//what argument we pass into our click function
	this.arg = clickArg;
	
	//init dimensions using canvas and fontSize
	var context = this.canvas.getContext("2d");
	context.font = this.fontSize + "px Arial";
	//add a 4 pixel border to the text dimensions to make room for button outline + fill
    this.width = context.measureText(this.text).width + 8;
    this.height = this.fontSize + 4;
}
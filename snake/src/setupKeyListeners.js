/**
 * create a list of keystates, maintained by event listeners
 */
function setupKeyListeners() {
	keyStates = [];
	//add keydown and keyup events for all keys
	document.body.addEventListener("keydown", function (e) {
		keyStates[String.fromCharCode(e.keyCode)] = true;
	});
	document.body.addEventListener("keyup", function (e) {
		keyStates[String.fromCharCode(e.keyCode)] = false;
	});
	
	//mouse event listeners (down is triggered every frame, pressed is only triggered on the first frame)
	mouseDownLeft = false;
	mousePressedLeft = false;
	mouseDownRight = false;
	mousePressedRight = false;
	cnv.mousePos = {x:cnv.width/2,y:cnv.height/2};
	uicnv.mousePos = {x:-1,y:-1};
	
	document.body.addEventListener("mousemove", function (e) {
		//store the relative mouse position for our canvas
		cnv.mousePos = getMouseDocument(e,cnv);
		uicnv.mousePos = getMouseDocument(e,uicnv);
	});
	document.body.addEventListener("mousedown", function (e) {
		if (e.button == 0) {
			//left click press detected
			mouseDownLeft = true;
			mousePressedLeft = true;
		}
		else if (e.button == 2) {
			//right click press detected
			mouseDownRight = true;
			mousePressedRight = true;
		}
	});
	document.body.addEventListener("mouseup", function (e) {
		if (e.button == 0) {
			//left click release detected
			mouseDownLeft = false;
		}
		else if (e.button == 2) {
			//right click release detected
			mouseDownRight = false;
		}
	});
}

/**
 * get the position of the mouse in the document
 * @param evt: the currently processing event
 * @param cnv: the canvas to check mouse position against
 * @returns an object containing the x,y coordinates of the mouse
 */
function getMouseDocument(evt,cnv) {
	 let rect = cnv.getBoundingClientRect();
	 return {x: evt.clientX - rect.left, y: evt.clientY - rect.top};	
}

//we can setup the keyListeners on script load as this will typically be performed only once, as early as possible
setupKeyListeners();
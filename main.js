/**
 * clear each canvas to a predetermined fillcolor, preparing it for a fresh render
 */
function clearScreen() {
	//main canvas
	ctx.fillStyle="#add8e6";
	ctx.fillRect(0,0,cnv.width,cnv.height);
	
	//HUD canvas
	uictx.fillStyle="rgb(0,0,0)";
	uictx.fillRect(0,0,uicnv.width,uicnv.height);
}

/**
 * render all objects and HUD elements
 */
function render() {
	//clear all canvases for a fresh render
	clearScreen();
	
	//draw objects centered in order
	for (let i = 0; i < objects.length; ++i) {
		drawCentered(objects[i].imgName,ctx, objects[i].x, objects[i].y,objects[i].dir);
	}
	
	//finally draw the HUD
	drawHUD();
}

/**
 * draw the HUD
 */
function drawHUD() {
	uictx.font = "24px Arial";
	uictx.fillStyle = "#FFFFFF";
	uictx.fillText("Score: " + score, 10,30);
}

/**
 * reduce the shape timer by deltaTime, creating a new shape and resetting the timer if it hits 0
 */
function updateShapeTimer() {
	timeToNextShape -= deltaTime;
	while (timeToNextShape <= 0) {
		let type = shapeTypes[getRandomInt(0,shapeTypes.length)];
		let color = shapeColors[getRandomInt(0,shapeColors.length)];
		let y = getRandomInt(0,cnv.height);
		objects.push(new Shape(type,color,cnv.width/2,y/2));
		
		timeToNextShape += 10 * (1/shapesSpawned);
		++shapesSpawned;
	}
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	
	//update shape spawn timer
	updateShapeTimer();
	
	//update objects
	for (let i = 0; i < objects.length; objects[i].update(), ++i);
	
	//update GUI elements
	for (let i = 0; i < buttons.length; buttons[i].update(), ++i);
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
}


/**
 * add an entry to the image dict for each shape/color combination
 */
function populateShapeImages() {
	let shapeDim = 32;
	let lineThickness = 1;
	
	for (let i = 0; i < shapeTypes.length; ++i) {
		let curShape = shapeTypes[i];
		let curPoints = shapePointNumbers[curShape];
		for (let r = 0; r < shapeColors.length; ++r) {
			let curColor = colorValues[shapeColors[r]];
			
			//prepare a new canvas for this shape
			let shapeCnv = document.createElement("canvas");
			shapeCnv.width = shapeDim;
			shapeCnv.height = shapeDim;
			let shapeCtx = shapeCnv.getContext("2d");
			shapeCtx.strokeStyle = "#000000";
			shapeCtx.lineWidth = 1;
			shapeCtx.beginPath();
			
			//add all of the points for this shape
			let centerX = centerY = shapeDim/2;
			let slice = 2 * Math.PI / curPoints;
			let radius = shapeDim/2-lineThickness;
			for (let k = 0; k < curPoints; ++k) {
				let angle = -Math.PI / (curPoints == 3 ? 2 : 4) + slice * k;
				let newX = (centerX + radius * Math.cos(angle));
				let newY = (centerY + radius * Math.sin(angle));
				shapeCtx.lineTo(newX,newY);
			}
			
			//finalize the shape and add it to the images dict
			shapeCtx.closePath();
			shapeCtx.fillStyle = curColor;
			shapeCtx.fill();
			shapeCtx.stroke();
			images[shapeTypes[i] + shapeColors[r]] = shapeCnv;
		}
	}
}

/**
 * initialize a reference to each of our canvases and contexts
 */
function initCanvases() {
	//create appropriately named references to all of our canvases
	cnv = document.getElementById("cnv");
	ctx = cnv.getContext("2d");
	
	uicnv = document.getElementById("uicnv");
	uictx = uicnv.getContext("2d");
}

/**
 * load the asset loader, which will load all of our required elements in order
 */
function loadAssets() {
	//setup a global, ordered list of asset files to load
	requiredFiles = [
		"src\\util.js","src\\setupKeyListeners.js", //misc functions
		"src\\classes\\Enum.js", "src\\classes\\Button.js", "src\\classes\\Shape.js" //classes
		];
	
	//manually load the asset loader
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = "src\\loadAssets.js";
	script.onload = loadAssets;
	//begin loading the asset loader by appending it to the document head
    document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * initialize all global variables
 */
function initGlobals() {
	//keep a global fps flag for game-speed (although all speeds should use deltaTime)
	fps = 60;
	
	//init global time vars for delta time calculation
	prevTime = Date.now();
	deltaTime = 0;
	totalTime = 0;
	
	//global game objects
	objects = [];
	
	//global list of UI buttons
	buttons = [];
	
	//global counters
	score = 0;
	shapesSpawned = 0;
	timeToNextShape = 0;
	
	populateShapeImages();
}

//disallow right-click context menu as right click functionality is necessary for block removal
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();
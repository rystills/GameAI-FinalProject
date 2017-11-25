/**
 * clear each canvas to a predetermined fillcolor, preparing it for a fresh render
 */
function clearScreen() {
	ctx.fillStyle="rgb(22,19,58)";
	ctx.fillRect(0,0,cnv.width,cnv.height);
}

function render() {
	//clear all canvases for a fresh render
	clearScreen();
	
	//draw the map tiles first
	drawMap();
	
	//draw objects centered in order
	for (var i = 0; i < objects.length; ++i) {
		drawCentered(objects[i].image,objects[i].canvas.getContext("2d"), objects[i].x, objects[i].y,objects[i].dir);
	}
	
	//finally draw the HUD
	drawHUD();
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	
	//update objects
	for (var i = 0; i < objects.length; objects[i].update, ++i);
	
	//update GUI elements
	for (var i = 0; i < buttons.length; buttons[i].update, ++i);
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
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
		"ext\\enums\\enums.js", //external dependencies
		"images\\bluecircle.png", "images\\bluesquare.png", "images\\bluetriangle.png", //blue shape images
		"images\\greencircle.png", "images\\greensquare.png", "images\\greentriangle.png", //green shape images 
		"images\\redcircle.png", "images\\redsquare.png", "images\\redtriangle.png", //red shape images
		"src\\classes\\Button.js" //classes
		];
	
	//manually load the asset loader
	var script = document.createElement('script');
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
	
	//global enums
	shapes = new enums.Enum("square","circle", "triangle");
	colors = new enums.Enum("blue","green", "red");
	
	//global game objects
	objects = [];
	
	//global list of UI buttons
	buttons = [];
}

//disallow right-click context menu as right click functionality is necessary for block removal
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();
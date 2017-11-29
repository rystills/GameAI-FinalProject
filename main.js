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
	
	drawPlayfieldBackground();
	
	drawPlayer();
	
	drawGridlines();
	
	//draw all objects with images specified, centered in order of list indices
	for (let i = 0; i < objects.length; ++i) {
		if (objects[i].imgName) {
			drawCentered(objects[i].imgName,ctx, objects[i].x, objects[i].y,objects[i].dir);	
		}
	}
	
	//finally draw the HUD
	drawHUD();
}

/**
 * draw the playfield to the screen
 */
function drawPlayfieldBackground() {
	//draw the playing field background
	ctx.fillStyle = "#008800";
	ctx.rect(0,0,gridSize*gridScale,gridSize*gridScale);
	ctx.fill();
}

function drawPlayer() {
	//draw the player
	ctx.fillStyle = "#0000FF";
	ctx.beginPath();
	for (let i = 0; i < player.spaces.length; ++i) {
		ctx.rect(player.spaces[i][0]*gridScale,player.spaces[i][1]*gridScale,gridScale,gridScale);
	}
	ctx.closePath();
	ctx.fill();
}

/**
 * draw the gridlines on top of the playfield
 */
function drawGridlines() {
	//draw the gridlines
	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	for (let i = 0; i < gridSize+1; ++i) {
		ctx.moveTo(i*gridScale,0);
		ctx.lineTo(i*gridScale,gridScale*gridSize);
		ctx.moveTo(0,i*gridScale);
		ctx.lineTo(gridScale*gridSize, i*gridScale);
	}
	ctx.closePath();
	ctx.stroke();
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
 * main game loop; update all aspects of the game in-order
 */
function update() {
	if (gameActive) {
		//update the deltaTime
		updateTime();
		
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
	
	//draw game-over text
	else {
		clearScreen();
		ctx.font = "64px Arial";
		ctx.fillStyle = "#FF0000";
		scoreString = "GAME OVER! FINAL SCORE: " + score;
		textWidth = ctx.measureText(scoreString).width;
		ctx.fillText(scoreString,cnv.width/2 - textWidth/2, cnv.height/2 + 24);
	}
}

/**
 * end the game
 */
function endGame() {
	gameActive = false;
}

/**
 * 
 * @param o: the object whose x,y coordinates we wish to update from their gridX,gridY coordinates
 */
function calculatePositionFromGrid(o) {
	o.x = o.gridX * gridScale;
	o.y = o.gridY * gridScale;
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
		"src\\classes\\Enum.js", "src\\classes\\Button.js", "src\\classes\\Snake.js" //classes
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
	
	//global game constants
	gridScale = 20;
	gridSize = 30;
	
	//global game objects
	objects = [];
	
	//global list of UI buttons
	buttons = [];
	
	//global counters
	score = 0;
		
	//create the player character
	player = new Snake(5,8,4);
	objects.push(player);
	
	gameActive = true;
}

//disallow right-click context menu as right click functionality is necessary for block removal
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();
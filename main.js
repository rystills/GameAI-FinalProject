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
	
	drawFood();
	
	drawGridlines();
	
	//draw all objects with images specified, centered in order of list indices
	for (let i = 0; i < objects.length; ++i) {
		if (objects[i].imgName) {
			drawCentered(objects[i].imgName,ctx, objects[i].x, objects[i].y,objects[i].dir);	
		}
	}
	
	//finally draw the HUD
	drawHUD();
	
	
	//draw game-over text post-render
	if (!gameActive) {
		ctx.fillStyle = "rgba(0,0,0,.5)";
		ctx.fillRect(0,0,cnv.width,cnv.height);
		ctx.font = "42px Arial";
		ctx.fillStyle = "#FF0000";
		scoreString = "GAME OVER! FINAL SCORE: " + score;
		textWidth = ctx.measureText(scoreString).width;
		ctx.fillText(scoreString,cnv.width/2 - textWidth/2, cnv.height/2 + 24);
	}
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

/**
 * draw the current location of the food on the grid
 */
function drawFood() {
	ctx.fillStyle = "#FF0000";
	ctx.beginPath();
	ctx.rect(foodPos.x*gridScale,foodPos.y*gridScale,gridScale,gridScale);
	ctx.closePath();
	ctx.fill();
}

/**
 * draw the player's body parts on the grid
 */
function drawPlayer() {
	//draw the player
	ctx.fillStyle = "#AAAAFF";
	ctx.beginPath();
	for (let i = 0; i < player.spaces.length; ++i) {
		for (let r = 0; r < player.spaces[i].length; ++r) {
			if (player.spaces[i][r] != -1) {
				ctx.rect(i*gridScale,r*gridScale,gridScale,gridScale);
			}
		}
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
	//draw buttons
	for (var i = 0; i < buttons.length; ++i) {
		var btnctx = buttons[i].canvas.getContext("2d");
		//fill light blue border color
		btnctx.fillStyle = "rgb(" +  
		Math.round(.15 * buttons[i].blendWhiteness) + ", " + 
		Math.round(buttons[i].blendWhiteness *.75) + ", " + 
		Math.round(.1 * buttons[i].blendWhiteness) + ")";
		btnctx.fillRect(buttons[i].x, buttons[i].y, buttons[i].width,buttons[i].height);
		
		//fill blue inner color
		btnctx.fillStyle = "rgb(" + 
		Math.round(buttons[i].blendWhiteness *.1) + ", " + 
		Math.round(.15 * buttons[i].blendWhiteness) + ", " + 
		Math.round(.75 * buttons[i].blendWhiteness) + ")";
		btnctx.fillRect(buttons[i].x + 2, buttons[i].y + 2, buttons[i].width - 4,buttons[i].height - 4);
		
		//set the font size and color depending on the button's attributes and state
		btnctx.font = buttons[i].fontSize + "px Arial";
		btnctx.fillStyle = "rgb(" + buttons[i].blendWhiteness + ", " + buttons[i].blendWhiteness + ", " + buttons[i].blendWhiteness + ")";
		
		//draw the button label (add slight position offset to account for line spacing)
		btnctx.fillText(buttons[i].text,buttons[i].x + 4, buttons[i].y + buttons[i].height/2 + 8);
	}
	uictx.font = "24px Arial";
	uictx.fillStyle = "#FFFFFF";
	uictx.fillText("Score: " + score, 10,30);
}

/**
 * main game loop; update all aspects of the game in-order
 */
function update() {
	//update the deltaTime
	updateTime();
	
	//update input
	if (keyStates[" "]) {
		restartGame();
	}
	
	if (gameActive) {		
		//update objects
		for (let i = 0; i < objects.length; objects[i].update(), ++i);
	}
	
	//update GUI elements
	for (let i = 0; i < buttons.length; buttons[i].update(), ++i);
	
	//once all updates are out of the way, render the frame
	render();
	
	//toggle off any one-frame event indicators at the end of the update tick
	mousePressedLeft = false;
	mousePressedRight = false;
}

/**
 * restart the game
 */
function restartGame() {
	score = 0;
	player.init();
	placeFood();
	gameActive = true;
}

/**
 * end the game
 */
function endGame() {
	gameActive = false;
}

/**
 * toggle the snake control mode between human and AI
 */
function changeControlMode() {
	player.controlMode = (player.controlMode == controlModes.human ? controlModes.AI : controlModes.human);
	this.text = "Game Mode: " + (player.controlMode == controlModes.human ? "Human" : "AI");
}

/**
 * toggle the snake AI algorithm
 */
function changeSnakeAlgorithm() {
	player.algorithm = (player.algorithm+1)%algorithms.length;
	this.text = "AI Algorithm: " + algorithms[player.algorithm];
}

/**
 * toggle the snake speed between .1, .01, and .001
 */
function changeSnakeSpeed() {
	player.moveCompleteTime = (player.moveCompleteTime == .1 ? .01 : (player.moveCompleteTime == .01 ? .005 : (player.moveCompleteTime == .005 ? .001 :.1)));
	this.text = "Snake Speed: " + 1/player.moveCompleteTime;
}

/**
 * place the food at a random location not currently occupied by the player
 */
function placeFood() {
	//create a list of all valid spaces (spaces that are not currently occupied by the snake)
	let validSpaces = [];
	for (let i = 0; i < gridSize; ++i) {
		for (let r = 0; r < gridSize; ++r) {
			if (player.spaces[i][r] == -1 && !(player.gridX == i && player.gridY == r)) {
				validSpaces.push({"x":i,"y":r});	
			}
		}
	}
	//if there's nowhere left to put the food, the game is over
	if (validSpaces.length == 0) {
		return endGame();
	}
	foodPos = validSpaces[getRandomInt(0,validSpaces.length)];
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
 * get the direction one must face in order to travel from curSpace to destSpace
 * @param curSpace: the starting space
 * @param destSpace: the space at which we wish to look
 * @returns the direction of destSpace from curSpace
 * @throws non-adjacent space error if curSpace is not adjacent to destSpace
 */
function getAdjacentDir(curSpace,destSpace) {
	if (curSpace.x == destSpace.x) {
		if (curSpace.y == destSpace.y + 1) {
			return directions.up;
		}
		if (curSpace.y == destSpace.y - 1) {
			return directions.down;
		}
	}
	if (curSpace.y == destSpace.y) {
		if (curSpace.x == destSpace.x + 1) {
			return directions.left;
		}
		if (curSpace.x == destSpace.x - 1) {
			return directions.right;
		}
	}
	throw "ERROR: getAdjacentDir space '" + curSpace.x + ", " + curSpace.y + "' is not adjacent to space '" + destSpace.x + ", " + destSpace.y + "'";
}

/**
 * get the space adjacent to the specified grid coordinates in the desired direction
 * @param terrain: the terrain to check against
 * @param dir: the direction in which to look for an adjacent space
 * @param gridX: the current grid x coordinate
 * @param gridY: the current grid y coordinate
 * @returns an object containing the x and y value and type of the adjacent space
 * @throws: direction error if dir is not one of the cardinal directions, position error if final x,y is not contained in terrain
 */
function getAdjacentSpace(terrain, dir,gridX,gridY) {
	if (!directions.hasOwnProperty(dir)) {
		throw "ERROR: getAdjacentSpace direction: '" + dir + "' not recognized";
	}
	let newX = gridX + directionChanges[dir].x;
	let newY = gridY + directionChanges[dir].y;
	if (newX >= gridSize || newX < 0 || newY >= gridSize || gridY < 0) {
		throw "ERROR: no block adjacent to position '" + gridX + ", " + "'" + gridY + "' in direction '" + directions[dir] + "' exists in specified terrain";
	}
	return {"x":newX,"y":newY, "type":(foodPos.x == newX && foodPos.y == newY ? "food" : (terrain[gridX][gridY] == -1 ? "free" : "blocked"))};
}

/**
 * get all spaces adjacent to the specified grid coordinates
 * @param terrain: the terrain to check against
 * @param gridX: the current grid x coordinate
 * @param gridY: the current grid y coordinate
 * @returns a list of objects containing the x and y value and type of each adjacent space 
 * @throws: direction error if dir is not one of the cardinal directions 
 */
function getAdjacentSpaces(terrain, gridX,gridY) {
	var newSpaces = [];
	for (var i = 0; i < directions.length; ++i) {
		try {
			newSpaces.push(getAdjacentSpace(terrain, i,gridX,gridY));	
		}
		//continue gracefully if an adjacent block did not exist in the specified direction
		catch(err) {
			continue;
		}
	}
	return newSpaces;
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
		"src\\util.js","src\\setupKeyListeners.js", "src\\pathFinding.js", //misc functions
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
	fps = 9999;
	
	//init global time vars for delta time calculation
	prevTime = Date.now();
	deltaTime = 0;
	totalTime = 0;
	
	//global game constants
	gridScale = 24;
	gridSize = 14;
	
	//global game objects
	objects = [];
	
	//global list of UI buttons
	buttons = [];
	buttons.push(new Button(10,50,uicnv,"Restart Game",24,restartGame));
	buttons.push(new Button(10,100,uicnv,"Game Mode: Human",24,changeControlMode));
	buttons.push(new Button(10,150,uicnv,"AI Algorithm: naivePerfect",24,changeSnakeAlgorithm));
	buttons.push(new Button(10,200,uicnv,"Snake Speed: 1000",24,changeSnakeSpeed));
	
	//global counters
	score = 0;
		
	//create the player character
	player = new Snake(controlModes.human);
	objects.push(player);
	
	placeFood();
	
	gameActive = true;
	
	//toggle all button functions to set them to the desired default state, while retaining the width necessary to fit the largest state string
	buttons[1].function();
	for (let i = 0; i < 3; buttons[3].function(), ++i);
	//buttons[2].function();
}

//disallow right-click context menu as right click functionality is necessary for block removal
document.body.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//initialize a reference to the canvas first, then begin loading the game
initCanvases();
loadAssets();
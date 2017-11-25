/**
 * loads all the needed files, then calls startGame to begin the game
 */
function loadAssets() {		
	assetNum = 0;
	
	//global list of script contents
	scripts = {}
	//global list of images
	images = {}
	
	//quick and dirty way to store local text files as JS objects
	object = null;
	
	loadAsset();
}

/**
 * parse a resource path for the file name, removing the directory structure and extension
 * @param path: the entire path to strip
 * @returns
 */
function parsePath(path) {
	var stripped = path.split("\\");
	return stripped[stripped.length-1].split('.')[0];
}

/**
 * load a single asset, setting onload to move on to the next asset
 */
function loadAsset() {
	//if the global object var contains a string, append it to the global scripts list
	if (object != null) {
		scripts[parsePath(requiredFiles[assetNum-1])] = object;
		object = null;
	}
	//once we've loaded all the objects, we are ready to start the game
	if (assetNum >= requiredFiles.length) {
		return startGame();
	}
	
	//get the element type from its file extension
	var splitName = requiredFiles[assetNum].split(".");
	var extension = splitName[splitName.length-1];
	var elemType = (extension == "js" ? "script" : "IMG")
	
	//create the new element
	var elem = document.createElement(elemType);
	elem.onload = loadAsset;
	elem.src = requiredFiles[assetNum];
	
	//add the new element to the body if its a script
	if (elemType == "script") {
		document.body.appendChild(elem);
	}
	//add the new element to the image dict if its an image
	else if (elemType == "IMG") {
		images[parsePath(requiredFiles[assetNum])] = elem;
	}
	
	++assetNum;
}
/**
 * goal condition function for calculatePath: check whether or not two objects have the same x,y coordinates
 * @param a: the first object to check
 * @param b: the second object to check
 * @returns whether a's coordinates are equivalent to b's coordinates (true) or not (false)
 */
function compareCoords(a,b) {
	return a.x == b.x && a.y == b.y;
}

/**
 * helper function for calculatePath: compare two container objects' coordinates
 * @param other: the other object to check against
 * @returns whether other's x,y coordinates are equivalent to 'this's x,y coordinates
 */
function checkCoords(other) {
	return other.x == this.x && other.y == this.y;
}

/**
 * helper function for calculatePath: calculate the manhattan distance between two spaces
 * @param space1: the first space whose coordinates we wish to check
 * @param space2: the second space whose coordinates we wish to check
 */
function manhattanDistance(space1,space2) {
	return Math.abs(space2.x-space1.x) + Math.abs(space2.y-space1.y);
}

/**
 * helper function for calculatePath: calculate the total cost of the active heuristics when applied to the input space
 * @param desiredSpace: the space whose heuristic cost we wish to calculate
 * @param goalSpace: the space we wish to arrive at
 */
function calculateHeuristics(desiredSpace,goalSpace) {
	//heuristic 1: linear distance
	var weight1 = getDistance(desiredSpace.x,desiredSpace.y, goalSpace.x,goalSpace.y) * heuristic1Weight;
	var weight2 = manhattanDistance(desiredSpace,goalSpace) * heuristic2Weight;
	return weight1 + weight2;
}

/**
 * helper function for calculatePath: composes the final path by tracing through space parents
 * @param startSpace: the starting space for the path
 * @param goalSpace: the goal space for the path
 * @returns an ordered list of spaces which form the final path
 */
function composePath(startSpace, goalSpace) {
	//path is kept global for visual representation
	path = [goalSpace];
	var curSpace = goalSpace;
	//iterate backwards from goalSpace to startSpace, adding each space to the final path list
	while (curSpace != startSpace) {
		curSpace = curSpace.parent;
		path.unshift(curSpace);
	}
	return path;
}

/**
 * calculate the shortest path in a terrain from one space to another, utilizing waypoints to speed up the search
 * @param terrain: the terrain in which to search for a path
 * @param waypoints: the waypoints to assist in our search for a path
 * @param startSpace: the space on which to begin the search
 * @param goalSpace: the desired goal space
 * @returns the shortest path from the start space to the goal space
 */
function calculatePathWaypoints(terrain,waypoints,startSpace,goalSpace) {	
	path = [];
	//if the start space is the goal space, then the path is just that space
	if (startSpace == goalSpace) {
		return [startSpace];
	}
	
	//grab the nearest waypoint to both the start space and the goal space
	startWaypoint = calculatePath(terrain, startSpace, waypoints, containerIsWaypoint, adjacentContainers, containerWalkable, false).last();
	var startClosedSet = closedSet;
	var startPath = path;
	
	goalWaypoint = calculatePath(terrain, goalSpace, waypoints, containerIsWaypoint, adjacentContainers, containerWalkable, false).last();
	
	console.log(startWaypoint);
	//preserve the state of the closedSet and path so we can combine it all at the end for visual display of pathfinding process
	var waypointsClosedSet = closedSet.concat(startClosedSet);
	var waypointsPath = path.concat(startPath);
	
	var finalPath = calculatePath(waypoints, startWaypoint, goalWaypoint, compareCoords, adjacentWaypoints, function() {return true}, true);
	
	//finally, concatenate the closedSet and path once more so we retain the nodes explored during waypoint discovery
	closedSet = closedSet.concat(waypointsClosedSet);
	finalPath = finalPath.concat(waypointsPath);
	
	return finalPath;
}

/**
 * calculate the shortest path in a terrain from one space to another, utilizing only tiles
 * @param terrain: the terrain in which to search for a path
 * @param startSpace: the space on which to begin the search
 * @param goalSpace: the desired goal space
 * @param goalCondition: the condition for reaching the goal
 * @param adjacentSpacesMethod: method to call to retrieve the adjacent spaces
 * @param validityCondition: condition which determines the validity of a space
 * @param useHeuristics: whether to utilize the current global heuristic settings (true) or simply do a bfs (false)
 * @returns the shortest path from the start space to the goal space
 */
function calculatePath(terrain,startSpace,goalSpace, goalCondition, adjacentSpacesMethod, validityCondition, useHeuristics) { 	
	//if the start space is the goal space, then the path is just that space
	if (goalCondition(startSpace,goalSpace)) {
		return [startSpace];
	}
	
	//initialize goal and parent space properties
	startSpace.parent = null;
	startSpace.startDistance = 0;
	
	//initialize open and closed sets for traversal (closed set is kept global for visual representation)
	closedSet = [];
	openSet = [startSpace];
	
	//main iteration: keep popping spaces from the back until we have found a solution or openSet is empty (no path found)
	while (openSet.length > 0) {
		//grab another space from the open set and push it to the closed set
		var currentSpace = openSet.shift();
		closedSet.push(currentSpace);
		
		//gather a list of adjacent spaces
		var adjacentSpaces = adjacentSpacesMethod(terrain,currentSpace.x,currentSpace.y);
		
		//main inner iteration: check each space in adjacentSpaces for validity
		for (var k = 0; k < adjacentSpaces.length; ++k) {	
			var newSpace = adjacentSpaces[k];
			//if the new space is the goal, compose the path back to startSpace
			if (goalCondition(newSpace,goalSpace)) {
				newSpace.parent = currentSpace; //start the path with currentSpace and work our way back
				return composePath(startSpace, newSpace);
			}
			
			//add newSpace to the openSet if it isn't in the closedSet or if the new start distance is lower
			if (validityCondition(terrain, newSpace.x,newSpace.y)) {				
				var newStartDistance = currentSpace.startDistance + 1;

				//if newSpace already exists in either the open set or the closed set, grab it now so we maintain startDistance
				var openSetIndex = openSet.findIndex(checkCoords,newSpace);
				var inOpenSet = openSetIndex!= -1;
				if (inOpenSet) {
					newSpace = openSet[openSetIndex];
				}
				var closedSetIndex = closedSet.findIndex(checkCoords,newSpace);
				var inClosedSet = closedSetIndex != -1;
				if (inClosedSet) {
					newSpace = closedSet[closedSetIndex];
				}
				
				//don't bother with newSpace if it has already been visited unless our new distance from the start space is smaller than its existing startDistance
				if (inClosedSet && (newSpace.startDistance <= newStartDistance)) {
					continue;
				}

				//accept newSpace if newSpace has not yet been visited or its new distance from the start space is less than its existing startDistance
				if ((!inOpenSet) || newSpace.startDistance > newStartDistance) { 
					newSpace.parent = currentSpace;
					newSpace.startDistance = newStartDistance;
					newSpace.totalCost = newSpace.startDistance + (useHeuristics ? calculateHeuristics(newSpace,goalSpace) : 0);
					//remove newSpace from openSet, then add it back via binary search to ensure that its position in the open set is up to date
					if (inOpenSet) {
						openSet.splice(openSetIndex,1);
					}
					openSet.splice(binarySearch(openSet,newSpace,"totalCost",true),0,newSpace);
					//if newSpace is in the closed set, remove it now
					if (inClosedSet) {
						closedSet.splice(closedSetIndex,1);
					}
				}
				
			}
		}
	}
	//no path was found; simply return an empty list
	return [];
}
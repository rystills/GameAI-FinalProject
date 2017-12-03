# GameAI-FinalProject  
JavaScript implementation of Snake, demonstrating AI techniques for playing the game  
  
Controls:  
-Spacebar to restart the game  
-W,A,S,D to control the snake while in player-controlled mode  
  
Play here: https://rystills.github.io/GameAI-FinalProject/  
  
To run locally, open snake/index.html in a browser window  
  
File Summary:  
index.html is responsible for creating and positioning the main and UI canvases, as well as loading main.js.  
main.js handles asset loading, presentation, and the main update loop.  
loadAssets.js handles loading each script and graphic specified in main.js.
util.js provides a number of general-purpose functions that are reusable between projects.  
setupKeyListeners.js takes care of adding event listeners for keyboard and mouse states.  
pathFinding.js contains helper functions for performing a Depth-First Search on the playfield.  
Button.js allows the creation of a graphical button which responds to mouse hover, press, and release.  
Enum.js allows the creation of a simple Enum class for storing states and other hard-coded groups of strings.  
Snake.js handles the creation and updating of the snake, which can be either player controlled or AI controlled.  
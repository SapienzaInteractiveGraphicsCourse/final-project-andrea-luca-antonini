var distanceValue = "000", distanceField, texture;


/*
This function is called when START GAME button is pressed , all the objects of the scene
are showed and the game / animation starts
*/
function init(){
  var scenario = document.getElementById("scenario");
  scenario.style.display = "block";
  distanceField = distanceValue;
  document.addEventListener('keydown', animationManagement, false);
  gameOver = document.getElementById("gameOver");
  stopGame = document.getElementById("stopGame");
  currentLevel = document.getElementById("currentLevel");
  totalPoints = document.getElementById("totalPoints");
  increasePoints = document.getElementById("increasePoints");
  lifePenalty = document.getElementById("lifePenalty");
  document.getElementById("reset").onclick = function(){
    gameVariable.LIFE = 1;
    updateLife();
  };
  initialize();
  configureTextureRocks();
  createScene();
  createLightsAndShadows();
  createDesert();
  createSky();
  createAngryBird();
  createDisk();
  createSphere();
  loop();
}

function animationManagement(event) {
  if(gameOver.style.display != "block") {
    if (event.keyCode == 32) {
      gameVariable.playOn = !gameVariable.playOn;
      if (!gameVariable.playOn)
        stopGame.style.display="block";
      else {
        stopGame.style.display="none";
        loop();
      }
    }
  }
}

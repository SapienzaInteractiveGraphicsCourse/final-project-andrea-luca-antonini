var distanceValue = "000", distanceField, texture;

function configureBurningTexture() {
  var side = 32;
  var amount = Math.pow(side, 2); // you need 4 values for every pixel in side*side plane
  var data = new Uint8Array(amount);
  for (var i = 0; i < amount; i++) {
    data[i] = Math.random()*120;
  }
  texture = new THREE.DataTexture(data, side, side, THREE.LuminanceFormat, THREE.UnsignedByteType);
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
}

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
  configureBurningTexture();
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

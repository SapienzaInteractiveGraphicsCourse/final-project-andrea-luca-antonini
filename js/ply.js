var distanceValue = "000";
var distanceField, texture;

function initialize(){
  Colors = {
    red:0xF25346,
    white:0xFFFFFF,
    yellow:0xF0E68C,
    blue:0x68C3C0,
    pink: 0xFAAFBE,
    black: 0x000000,
    green: 0xF7FF00,
    springGreen: 0x4AA02C,
    dodgerBlue: 0x1589FF
  };

  gameVariables = {
          textureLoaded: true,
          speedFactor: 1,
          speed: 0,
          baseSpeed: 0.00037,
          grassRotation: 0.006,
          skyRotation: 0.006,
          view: 70,
          rr: 0,

          deltaTime: 0,
          distance: 0,
          ratioSpeedDistance: 50,
          near: 1,
          far: 10000,
          farLight: 1000,

          pigInitialHeight: 100,
          pigEndPositionY: 0.5,
          pigEndRotationY: 0.01,
          planeHeight: 80,
          pigSpeed: 0,
          wingRotation: 0.1,

          grassRadius: 660,
          grassLength: 1000,

          foodKeepDistance: 15,
          scoreValue: 5,
          foodSpeed: 0.5,
          foodLastAdd: 0,
          distanceAddFood: 115,

          dangerKeepDistance: 15,
          dangerLastAdd: 0,
          distanceAddDanger: 170,
          score: 0,
          level: 0,
          life: 3,
          play: true,
          isGameOver: false,
          UP: false,
          DOWN: false
         };
}

var scene, camera, renderer, container, ambientLight, hemisphereLight, directionalLight;

var newTime = new Date().getTime();
var oldTime = new Date().getTime();

var HEIGHT, WIDTH;

function configureTextureFood() {
  //texture = new THREE.TextureLoader().load("Textures/acornTexture.png");
  //texture = new THREE.TextureLoader().load("Textures/texture3.jpg");
  texture = new THREE.TextureLoader().load("Textures/texture1.jpg");
  //texture.offset.set(0.7, 0.2);
  texture.wrapS = THREE.RepeatWrapping;
  //texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  //texture.wrapT = THREE.MirroredRepeatWrapping;
}

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  scene = new THREE.Scene();
  gameVariables.rr = WIDTH / HEIGHT;
  camera = new THREE.PerspectiveCamera(
    gameVariables.view,
    gameVariables.rr,
    gameVariables.near,
    gameVariables.far
  );
  camera.position.x = 0;
  camera.position.z = 250;
  camera.position.y = 100;
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  container = document.getElementById('scenario');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLightsAndShadows() {
  ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 1.0);
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(100,200,200);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -300;
  directionalLight.shadow.camera.right = 300;
  directionalLight.shadow.camera.top = 300;
  directionalLight.shadow.camera.bottom = -300;
  directionalLight.shadow.camera.near = gameVariables.near;
  directionalLight.shadow.camera.far = gameVariables.farLight;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(hemisphereLight);
  scene.add(directionalLight);
}

Pig = function(color, transparent, setOpacity){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "pig";
  //Body
  var geomBody = new THREE.SphereGeometry( 60, 70, 20 );
  geomBody.applyMatrix( new THREE.Matrix4().makeScale( 1.2, 0.8, 0.6 ) );
  var matBody = new THREE.MeshPhongMaterial({
    color:color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  var body = new THREE.Mesh(geomBody, matBody);
  body.castShadow = true;
  body.receiveShadow = true;
  this.mesh.add(body);
  //Head
  var geomHead = new THREE.SphereGeometry( 35, 30, 30 );
  var matHead = new THREE.MeshPhongMaterial({
    color:color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.head = new THREE.Mesh(geomHead, matHead);
  this.head.position.set(65,0,0);
  this.head.castShadow = true;
  this.head.receiveShadow = true;
  this.mesh.add(this.head);
  //Snout
  var geomSnout = new THREE.BoxGeometry(30,17,20);
  var matSnout = new THREE.MeshPhongMaterial({
    color:color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.snout = new THREE.Mesh(geomSnout, matSnout);
  this.snout.position.set(99,-13,0);
  this.snout.castShadow = true;
  this.snout.receiveShadow = true;
  this.mesh.add(this.snout);
  geomSnout.vertices[4].y+=9;
  geomSnout.vertices[4].z-=6;
  geomSnout.vertices[5].y+=9;
  geomSnout.vertices[5].z+=6;
  geomSnout.vertices[6].y-=9;
  geomSnout.vertices[6].z-=6;
  //geomSnout.vertices[7].y-=9;
  //geomSnout.vertices[7].z+=6;
  //Eye
  var geomEye = new THREE.SphereGeometry(5,30,30);
  geomEye.applyMatrix( new THREE.Matrix4().makeScale(1.2, 0.8, 0.6));
  var matEye = new THREE.MeshPhongMaterial({
    color: Colors.red,
    flatShading: THREE.FlatShading,
    opacity: setOpacity,
    transparent: transparent
  });
  this.eye = new THREE.Mesh(geomEye, matEye);
  this.eye.position.set(80,10,31);
  this.eye.castShadow = true;
  this.eye.receiveShadow = true;
  this.mesh.add(this.eye);
  //Ear
  var geomEar = new THREE.CylinderGeometry(0, 15, 15, 4, 4);
  var matEar = new THREE.MeshPhongMaterial({
    color: color,
    flatShading: THREE.FlatShading,
    opacity: setOpacity,
    transparent: transparent
  });
  this.ear = new THREE.Mesh(geomEar, matEar);
  this.ear.position.set(60,34,20);
  this.ear.castShadow = true;
  this.ear.receiveShadow = true;
  this.mesh.add(this.ear);
  //Wing dx
  var geomSideDXWing = new THREE.BoxGeometry(60,8,80,1,1,1);
  var matSideDXWing = new THREE.MeshPhongMaterial({
    color:Colors.white,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.sideDXWing = new THREE.Mesh(geomSideDXWing, matSideDXWing);
  this.sideDXWing.position.set(0,0,30);
  this.sideDXWing.castShadow = true;
  this.sideDXWing.receiveShadow = true;
  this.mesh.add(this.sideDXWing);
  geomSideDXWing.vertices[4].y+=5;
  geomSideDXWing.vertices[5].y+=5;
  geomSideDXWing.vertices[5].z+=4;
  geomSideDXWing.vertices[7].z+=4;
  //Wing sx
  var geomSideSXWing = new THREE.BoxGeometry(50,8,50,1,1,1);
  var matSideSXWing = new THREE.MeshPhongMaterial({
    color:Colors.white,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.sideSXWing = new THREE.Mesh(geomSideSXWing, matSideSXWing);
  this.sideSXWing.position.set(0,0,-30);
  this.sideSXWing.castShadow = true;
  this.sideSXWing.receiveShadow = true;
  this.mesh.add(this.sideSXWing);
  geomSideSXWing.vertices[4].y+=5;
  geomSideSXWing.vertices[5].y+=5;
  geomSideSXWing.vertices[5].z-=4;
  geomSideSXWing.vertices[7].z-=4;
  //Tail
  var geomTail = new THREE.BoxGeometry(15,20,5,1,1,1);
  var matTail = new THREE.MeshPhongMaterial({
    color:Colors.pink,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.tail = new THREE.Mesh(geomTail, matTail);
  this.tail.position.set(-65,20,0);
  this.tail.castShadow = true;
  this.tail.receiveShadow = true;
  this.mesh.add(this.tail);
  //Back Leg Dx
  var geomBackLegDX = new THREE.BoxGeometry(20,50,30,1,1,1);
  var matBackLegDX = new THREE.MeshPhongMaterial({
    color: color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.backLegDX = new THREE.Mesh(geomBackLegDX, matBackLegDX);
  this.backLegDX.position.set(-40,-30,0);
  this.backLegDX.castShadow = true;
  this.backLegDX.receiveShadow = true;
  this.mesh.add(this.backLegDX);
  //Back Leg Sx
  var geomBackLegSX = new THREE.BoxGeometry(20,50,-30,1,1,1);
  var matBackLegSX = new THREE.MeshPhongMaterial({
    color: color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.backLegSX = new THREE.Mesh(geomBackLegSX, matBackLegSX);
  this.backLegSX.position.set(-40,-30,0);
  this.backLegSX.castShadow = true;
  this.backLegSX.receiveShadow = true;
  this.mesh.add(this.backLegSX);
  //Front Leg Dx
  var geomFrontLegDX = new THREE.BoxGeometry(20,50,30,1,1,1);
  var matFrontLegDX = new THREE.MeshPhongMaterial({
    color: color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.frontLegDX = new THREE.Mesh(geomFrontLegDX, matFrontLegDX);
  this.frontLegDX.position.set(40,-30,0);
  this.frontLegDX.castShadow = true;
  this.frontLegDX.receiveShadow = true;
  this.mesh.add(this.frontLegDX);
  //Front Leg Sx
  var geomFrontLegSX = new THREE.BoxGeometry(20,50,-30,1,1,1);
  var matFrontLegSX = new THREE.MeshPhongMaterial({
    color: color,
    flatShading:THREE.FlatShading,
    opacity: setOpacity,
    transparent:transparent
  });
  this.frontLegSX = new THREE.Mesh(geomFrontLegSX, matFrontLegSX);
  this.frontLegSX.position.set(-40,-30,0);
  this.frontLegSX.castShadow = true;
  this.frontLegSX.receiveShadow = true;
  this.mesh.add(this.frontLegSX);
}

var Rocket = function() {
  this.mesh = new THREE.Object3D();
  //cockpit
  var cockpitGeo = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1),
  cockpitMat = new THREE.MeshPhongMaterial({
      color:Colors.red,
      flatShading: true,
    }),
  cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
  cockpitGeo.vertices[4].y -= 10;
  cockpitGeo.vertices[4].z += 20;
  cockpitGeo.vertices[5].y -= 10;
  cockpitGeo.vertices[5].z -= 20;
  cockpitGeo.vertices[6].y += 10;
  cockpitGeo.vertices[6].z += 20;
  cockpitGeo.vertices[7].y += 10;
  cockpitGeo.vertices[7].z -= 20;
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  this.mesh.add(cockpit);
  //engine
  var engineGeo = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1),
    engineMat = new THREE.MeshPhongMaterial({
      color:Colors.yellow,
      flatShading: true
    }),
    engine = new THREE.Mesh(engineGeo, engineMat);
  engine.position.x = 40;
  engine.castShadow = true;
  engine.receiveShadow = true;
  this.mesh.add(engine);
  //tail
  var tailGeo = new THREE.BoxGeometry(15, 20, 10, 1, 1, 1),
    tailMat = new THREE.MeshPhongMaterial({
      color:Colors.yellow,
      flatShading: true
    }),
    tail = new THREE.Mesh(tailGeo, tailMat);
  //custom vertices
  tailGeo.vertices[2].y -= 31;
  tailGeo.vertices[3].y -= 31;
  tail.position.set(-37, 25, 0);
  tail.castShadow = true;
  tail.receiveShadow = true;
  this.mesh.add(tail);
  //lowerWing
  var lowerWingGeo = new THREE.BoxGeometry(40, 8, 200, 1, 1, 1),
    lowerWingMat = new THREE.MeshPhongMaterial({
      color:Colors.yellow,
      flatShading: true
    }),
    lowerWing = new THREE.Mesh(lowerWingGeo, lowerWingMat);
  //custom vertices
  lowerWingGeo.vertices[0].z -= 20;
  lowerWingGeo.vertices[1].z += 20;
  lowerWingGeo.vertices[2].z -= 20;
  lowerWingGeo.vertices[3].z += 20;
  lowerWing.position.x = 10;
  lowerWing.castShadow = true;
  lowerWing.receiveShadow = true;
  this.mesh.add(lowerWing);
  //upperWing
  var upperWingGeo = new THREE.BoxGeometry(40, 8, 200, 1, 1, 1),
  upperWingMat = new THREE.MeshPhongMaterial({
    color:Colors.yellow,
    flatShading: true
  }),
  upperWing = new THREE.Mesh(upperWingGeo, upperWingMat);
  upperWingGeo.vertices[0].z -= 20;
  upperWingGeo.vertices[1].z += 20;
  upperWingGeo.vertices[2].z -= 20;
  upperWingGeo.vertices[3].z += 20;
  upperWing.position.y = 35;
  upperWing.position.x = 10;
  upperWing.castShadow = true;
  upperWing.receiveShadow = true;
  this.mesh.add(upperWing);
  //leftSupport
  var leftSupportGeo = new THREE.BoxGeometry(8, 35, 8, 1, 1, 1),
  leftSupportMat = new THREE.MeshPhongMaterial({
    color:Colors.yellow,
    flatShading: true
  }),
  leftSupport = new THREE.Mesh(leftSupportGeo, leftSupportMat);
  leftSupport.position.y = 20;
  leftSupport.position.x = 10;
  leftSupport.position.z = 80;
  leftSupport.castShadow = true;
  leftSupport.receiveShadow = true;
  this.mesh.add(leftSupport);
  //rightSupport
  var rightSupportGeo = new THREE.BoxGeometry(8, 35, 8, 1, 1, 1),
  rightSupportMat = new THREE.MeshPhongMaterial({
    color:Colors.yellow,
    flatShading: true
  }),
  rightSupport = new THREE.Mesh(rightSupportGeo, rightSupportMat);
  rightSupport.position.y = 20;
  rightSupport.position.x = 10;
  rightSupport.position.z = -80;
  rightSupport.castShadow = true;
  rightSupport.receiveShadow = true;
  this.mesh.add(rightSupport);
  //propeller
  var propellerGeo = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1),
  propellerMat = new THREE.MeshPhongMaterial({
    color:Colors.yellow,
    flatShading: true
  });
  this.propeller = new THREE.Mesh(propellerGeo, propellerMat);
  this.propeller.castShadow = true;
  this.propeller.receiveShadow = true;
  //blades
  var bladeGeo = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1),
  bladeMat = new THREE.MeshPhongMaterial({
    color:Colors.yellow,
    flatShading: true
  }),
  blade = new THREE.Mesh(bladeGeo, bladeMat);
  blade.position.set(8, 0, 0);
  blade.castShadow = true;
  blade.receiveShadow = true;
  this.propeller.add(blade);
  this.propeller.position.set(50, 0, 0,);
  this.mesh.add(this.propeller);
}

Sky = function(){
  this.mesh = new THREE.Object3D();
  this.numElem = 12;
  this.rockets = [];
  var stepToAdd = Math.PI*2 / this.numElem;
  for(var i=0; i<this.numElem; i++){
    var c = new Rocket();
    var s = 0.10+Math.random()*0.15;
    this.rockets.push(c);
    var a = stepToAdd*i;
    var h = 800 + Math.random()*300;
    c.mesh.position.z = -300-Math.random()*100;
    c.mesh.rotation.z = a + Math.PI/2;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Grass = function(){
  var geomGrass = new THREE.CylinderGeometry(gameVariables.grassRadius, gameVariables.grassRadius, gameVariables.grassLength, 100, 10);
  geomGrass.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  var matGrass = new THREE.MeshPhongMaterial({
    color:Colors.springGreen,
    flatShading:THREE.FlatShading,
    opacity: 1,
    transparent:false
  });
  this.mesh = new THREE.Mesh(geomGrass, matGrass);
  this.mesh.receiveShadow = true;
}

Danger = function(){
  var geom = new THREE.SphereBufferGeometry(9, 8, 4, 0, 10, 0, 10);
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.dodgerBlue,
    flatShading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

DangerOwner = function (){
  this.mesh = new THREE.Object3D();
  this.dangerInScene = [];
  this.dangerStock = [];
  var danger = new Danger();
  this.dangerStock.push(danger);
}

DangerOwner.prototype.addDanger = function(){
  var danger;
  var dist = gameVariables.grassRadius + gameVariables.pigInitialHeight + (-1 + Math.random() * 2) * (gameVariables.planeHeight-20);
  if (this.dangerStock.length) {
    danger = this.dangerStock.pop();
  }else{
    danger = new Danger();
  }
  this.mesh.add(danger.mesh);
  this.dangerInScene.push(danger);
  danger.angle = - 0.5;
  danger.distance = dist + Math.cos(0.7);
  danger.mesh.position.y = -gameVariables.grassRadius + Math.sin(danger.angle) * danger.distance;
  danger.mesh.position.x = Math.cos(danger.angle) * danger.distance;
}


DangerOwner.prototype.dangerAnimation = function(){
  for (var i=0; i < this.dangerInScene.length; i++){
    var danger = this.dangerInScene[i];
    if (danger.exploding)
      continue;
    danger.angle += gameVariables.speed * gameVariables.deltaTime * gameVariables.foodSpeed;
    if(danger.angle > Math.PI*2)
      danger.angle -= Math.PI*2;
    danger.mesh.position.y = -(gameVariables.grassRadius-100) + Math.sin(danger.angle) * danger.distance;
    danger.mesh.position.x = Math.cos(danger.angle) * (danger.distance * gameVariables.speedFactor);
    danger.mesh.rotation.z += Math.random()*.1;
    danger.mesh.rotation.y += Math.random()*.1;
    var dist = pig.mesh.position.clone().sub(danger.mesh.position.clone()).length();
    if(dist < gameVariables.dangerKeepDistance){
      updateLife();
      this.dangerStock.unshift(this.dangerInScene.splice(i,1)[0]);
      pig.mesh.position.x -= 30;
      this.mesh.remove(danger.mesh);
      ambientLight.intensity = 2;
      if(scene.children[4].name == "pig") {
        var visible = false;
        var opacity = 1.0;
        alarmmsg.style.opacity = opacity;
        alarmmsg.style.display="block";
        var timer = setInterval(function () {
          if (opacity <= 0){
            visible = true;
            alarmmsg.style.display = "none";
            scene.children[4].visible = visible;
            clearInterval(timer);
          }
          scene.children[4].visible = visible;
          visible = !visible;
          alarmmsg.style.opacity = opacity;
          alarmmsg.style.filter = 'alpha(opacity=' + opacity + ")";
          opacity -= 0.03;
        }, 50);
    }
      i--;
    }
  }
}

Food = function(){
  var geom = new THREE.SphereGeometry(9, 12, 8), mat;
  if(gameVariables.textureLoaded)
    mat = new THREE.MeshPhongMaterial( {
      map: texture,
      side: THREE.DoubleSide
    } );
  else
    mat = new THREE.MeshPhongMaterial({
    color:Colors.green,
    flatShading:THREE.FlatShading
  });
  this.mesh = new THREE.Mesh(geom,mat);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

FoodOwner = function (num){
  this.mesh = new THREE.Object3D();
  this.foodInScene = [];
  this.foodStock = [];
  for (var i=0; i<num; i++){
    var food = new Food();
    this.foodStock.push(food);
  }
}

FoodOwner.prototype.addFood = function(){
  var num = Math.floor(Math.random()*5)+2;
  var amp = Math.round(Math.random()*10);
  var dist = gameVariables.grassRadius + gameVariables.pigInitialHeight + (-1 + Math.random() * 2) * (gameVariables.planeHeight-20);
  for (var i=0; i<num; i++){
    var food;
    if (this.foodStock.length) {
      food = this.foodStock.pop();
    }else{
      food = new Food();
    }
    this.mesh.add(food.mesh);
    this.foodInScene.push(food);
    food.distance = dist + Math.cos(i*.5)*amp;
    food.angle = -(i*0.02);
    food.mesh.position.y = -gameVariables.grassRadius + Math.sin(food.angle) * food.distance;
    food.mesh.position.x = Math.cos(food.angle) * food.distance;
  }
}

FoodOwner.prototype.foodAnimation = function(){
  for (var i=0; i<this.foodInScene.length; i++){
    var food = this.foodInScene[i];
    food.angle += gameVariables.speed * gameVariables.deltaTime * gameVariables.foodSpeed;
    if(food.angle > Math.PI*2)
      food.angle -= Math.PI*2;
    food.mesh.position.x = Math.cos(food.angle) * (food.distance * gameVariables.speedFactor);
    food.mesh.position.y = -(gameVariables.grassRadius-100) + Math.sin(food.angle) * food.distance;
    food.mesh.rotation.y += Math.random()*.1;
    food.mesh.rotation.z += Math.random()*.1;
    var dist = pig.mesh.position.clone().sub(food.mesh.position.clone()).length();
    if(dist < gameVariables.foodKeepDistance){
      updateScore();
      if(pointWin.style.display!="block") {
        var opacity = 1.0;
        pointWin.style.display="block";
        var timer = setInterval(function () {
          if (opacity <= 0){
              clearInterval(timer);
              pointWin.style.display = "none";
          }
          pointWin.style.opacity = opacity;
          pointWin.style.filter = 'alpha(opacity=' + opacity + ")";
          opacity -= 0.03;
        }, 50);
      }
      this.foodStock.unshift(this.foodInScene.splice(i,1)[0]);
      this.mesh.remove(food.mesh);
      i--;
    }
  }
}

var grass, pig, sky, foodOwner, dangerOwner, sun;

function createGrass(){
  grass = new Grass();
  grass.mesh.position.y = -580;
  scene.add(grass.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -580;
  scene.add(sky.mesh);
}

function createPig(){
  pig = new Pig(Colors.pink, false, 1.0);
  pig.mesh.scale.set(0.28,0.28,0.28);
  pig.mesh.position.y = gameVariables.pigInitialHeight;
  pig.mesh.position.z = 0;
  scene.add(pig.mesh);
}

function createRocket() {
  rocket = new Rocket();
  rocket.mesh.scale.set(0.25, 0.25, 0.25);
  rocket.mesh.position.y = 100;
  scene.add(rocket.mesh);
}

function createFood(){
  foodOwner = new FoodOwner(100);
  scene.add(foodOwner.mesh)
}

function createDanger(){
  dangerOwner = new DangerOwner(100);
  scene.add(dangerOwner.mesh)
}

function loop(){
  newTime = new Date().getTime();
  gameVariables.deltaTime = newTime - oldTime;
  oldTime = newTime;
  if(gameVariables.play) {
    if (Math.floor(gameVariables.distance) % gameVariables.distanceAddFood == 0 && Math.floor(gameVariables.distance) > gameVariables.foodLastAdd){
      gameVariables.foodLastAdd = Math.floor(gameVariables.distance);
      foodOwner.addFood();
    }
    if (Math.floor(gameVariables.distance) % gameVariables.distanceAddDanger == 0 && Math.floor(gameVariables.distance) > gameVariables.dangerLastAdd){
      gameVariables.dangerLastAdd = Math.floor(gameVariables.distance);
      dangerOwner.addDanger();
    }
    if(gameVariables.life == 0){
      gameVariables.isGameOver = true;
      showGameOver();
    }
    updatePig();
    zoom();
    updateDistance();
    gameVariables.speed = gameVariables.baseSpeed * gameVariables.pigSpeed;
    foodOwner.foodAnimation();
    dangerOwner.dangerAnimation();
    grass.mesh.rotation.z += gameVariables.grassRotation;
    sky.mesh.rotation.z += gameVariables.skyRotation;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
}

function preInit() {
  var scene = document.getElementById("scenario");
  scene.style.display = "none";
  document.getElementById("startButton").onclick = function ()  {
    init();
  };
}

function init(){
  var scene = document.getElementById("scenario");
  var presentation = document.getElementById("presentation");
  presentation.style.display = "none";
  scene.style.display = "block";
  distanceField = distanceValue;
  document.addEventListener('keydown', manageAnimation, false);
  gameOver = document.getElementById("gameOver");
  totalScore = document.getElementById("totalScore");
  currentLevel = document.getElementById("currentLevel");
  pauseGame = document.getElementById("pauseGame");
  alarmMsg = document.getElementById("alarmmsg");
  pointWin = document.getElementById("pointWin");
  document.getElementById("pageReset").onclick = function(){
    window.location.reload();
  };
  document.getElementById("muteAudio").onclick = function(){
    muteAudio();
  };
  document.getElementById("volumeSlider").onchange = function(event){
    volume = parseFloat(event.target.value);
    for(let i = 0; i < tracks.length; i++){
      sounds[i].setVolume(volume);
    }
  }
  document.addEventListener('mousemove', mouseMove, false);
  audioListener = new THREE.AudioListener();
  initialize();
  configureTextureFood();
  createScene();
  createLightsAndShadows();
  createGrass();
  createSky();
  createPig();
  createFood();
  createDanger();
  ambientMusic();
  loop();
}

// Sound variables
var sound, audioListener, audioLoader;
var volume = 0.3;
const tracks = ["https://github.com/SapienzaInteractiveGraphicsCourse/final-project-andrea-luca-antonini/blob/master/Audio/threeLittlePigsRemix.mp3", "https://github.com/SapienzaInteractiveGraphicsCourse/final-project-andrea-luca-antonini/blob/master/Audio/springSounds.mp3"];
var sounds = [];

function ambientMusic() {
  audioLoader = new THREE.AudioLoader();
  for (let i = 0; i < tracks.length; i++) {
    sounds[i] = new THREE.Audio(audioListener);
    audioLoader.load(tracks[i], function(buffer) {
    	sounds[i].setBuffer(buffer);
    	sounds[i].setLoop(true);
    	sounds[i].setVolume(volume);
      if (i == 0) {
        sound = sounds[0];
        sound.play();
      }
    });
  }
}

function muteAudio(){
  if(!sound.isPlaying){
    document.getElementById("muteAudio").innerHTML = "MUTE AUDIO";
    sound.play();
  }
  else{
    document.getElementById("muteAudio").innerHTML = "AUDIO ON";
    sound.pause();
  }
}

function manageAnimation(event) {
  if(gameOver.style.display != "block") {
    if (event.keyCode == 32){
      gameVariables.play = !gameVariables.play;
      if (!gameVariables.play){
        pauseGame.style.display="block";
        sounds[0].pause();
        sounds[1].play();
      }
      else {
        pauseGame.style.display="none";
        sounds[1].pause();
        sounds[0].play();
        loop();
      }
    }
  }
}

function interpolate(min, max, fraction) {
    return (max - min) * fraction + min;
}

/*
function move() {
  if(gameVariables.UP) {
    if(pig.mesh.position.y >= 258)
      gameVariables.UP = false;
    else{
      pig.mesh.position.y += 5;
      pig.mesh.rotation.z = 0.2;
      //pig.backLegDX.rotation.z = interpolate(pig.backLegSX.rotation.z, -0.6, 0.8);
      //pig.backLegSX.rotation.z = interpolate(pig.backLegSX.rotation.z, -0.6, 0.8);
    }
  }
  if(gameVariables.DOWN) {
    if(pig.mesh.position.y <= 100)
      gameVariables.DOWN = false;
    else{
      pig.mesh.position.y -= 5;
      pig.mesh.rotation.z = -0.2;
      //pig.backLegDX.rotation.z = interpolate(pig.backLegDX.rotation.z, 0.6, 1);
      //pig.backLegSX.rotation.z = interpolate(pig.backLegSX.rotation.z, 0.6, 1);
    }
  }
  if(gameVariables.life == 0){
    gameVariables.isGameOver = true;
    showGameOver();
  }
  /*else if(){
    if(pig.backLegDX.rotation.z > 0){
      pig.backLegDX.rotation.z = interpolate(pig.backLegDX.rotation.z, 0, 1);
      pig.backLegSX.rotation.z = interpolate(pig.backLegSX.rotation.z, 0, 1);
    }
    else{
      pig.backLegDX.rotation.z = interpolate(pig.backLegDX.rotation.z, 0, 1);
      pig.backLegSX.rotation.z = interpolate(pig.backLegSX.rotation.z, 0.6, 1);
    }
  }
}*/

document.onkeydown = function(e) {
  if(e.keyCode == 38) {
    gameVariables.UP = true;
  }
  if(e.keyCode == 40) {
    gameVariables.DOWN = true;
  }
}

document.onkeyup = function(e) {
  if(e.keyCode == 38) gameVariables.UP = false;
  if(e.keyCode == 40) gameVariables.DOWN = false;
  if(pig != undefined ) pig.mesh.rotation.z = 0;
}

var mouse = {x:0, y:0};
function mouseMove(event) {
  var xAxis = -1 + (event.clientX / WIDTH) * 2;
  var yAxis = 1 - (event.clientY / HEIGHT) * 2;
  mouse = {x:xAxis, y:yAxis};
}

function move() {
  //Fly margins
  var pigX = fly(mouse.x, -1, 1, -100, 100);
  var pigY = fly(mouse.y, -1, 1, 100, 258);
  //Movements
  pig.mesh.position.y += (pigY - pig.mesh.position.y) * 0.1;
  pig.mesh.rotation.x = (pig.mesh.position.y - pigY) * 0.005;
  pig.mesh.rotation.z = (pigY - pig.mesh.position.y) * 0.01;
}

function fly(mouse, minM, maxM, minR, maxR) {
  var border = Math.max(Math.min(mouse, maxM), minM);
  var middleM = maxM - minM;
  var delay = (border - minM) / middleM;
  var middleR = maxR - minR;
  var result = minR + (delay * middleR);
  return result;
}

function zoom() {
  camera.fov = fly(mouse.x, -1, 1, 50, 90);
  camera.updateProjectionMatrix();
}

function roundToOneValue(v,vmin,vmax,tmin,tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function updateDistance(){
  gameVariables.distance += gameVariables.speed * gameVariables.deltaTime * gameVariables.ratioSpeedDistance;
}

function updatePig(){
  gameVariables.pigSpeed = roundToOneValue(0,-0.6,0.6, 0.9, 2);
  if(pig.sideDXWing.rotation.x > 0.8 || pig.sideDXWing.rotation.x < -0.8)
    gameVariables.wingRotation *= -1;
  pig.sideDXWing.rotation.x += gameVariables.wingRotation;
  pig.sideSXWing.rotation.x += -gameVariables.wingRotation;
  pig.tail.rotation.y += -gameVariables.wingRotation;
  move();
}

function updateScore() {
  if(!gameVariables.isGameOver){
    gameVariables.score += gameVariables.scoreValue;
    var value = document.getElementById("score");
    value.textContent= gameVariables.score;
    if(gameVariables.score % 100 == 0 && gameVariables.score != 0)
      updateLevelandSpeed();
  }
}

function updateLife() {
  if(gameVariables.life > 0) {
    gameVariables.life -= 1;
    var value = document.getElementById("life");
    value.textContent = gameVariables.life;
  }
}

function updateLevelandSpeed() {
  gameVariables.level += 1;
  var value = document.getElementById("level");
  value.textContent = gameVariables.level;
  gameVariables.skyRotation += 0.0006;
  gameVariables.grassRotation += 0.0006;
  gameVariables.speedFactor += 0.26;
}

function showGameOver(){
  gameVariables.play = false;
  var timer = setInterval(function(){
    if (pig.mesh.position.y <= -50){
        gameVariables.play = false;
        clearInterval(timer);
    }
    pig.mesh.position.y -= gameVariables.pigEndPositionY;
    pig.mesh.rotation.y -= gameVariables.pigEndRotationY;
  }, 100);
  if(gameOver.style.display != "block" && totalScore.style.display != "block" && currentLevel.style.display != "block") {
    totalScore.textContent += gameVariables.score;
    currentLevel.textContent += gameVariables.level;
    gameOver.style.display = "block";
    totalScore.style.display = "block";
    currentLevel.style.display = "block";
  }
}

window.addEventListener('load', preInit, false);

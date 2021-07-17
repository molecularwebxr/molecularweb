import * as CANNON from "/lib/cannon-es.js";
import {
  setupPdb,
  clearGroup,
  createSpheres,
  createSticks,
  radiusfactor1,
  radiusfactor2,
} from "./3Dutils.js";

var scene, camera, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
var patternArray, markerRootArray, markerGroupArray;
var sceneGroup, stickGroup, spheresGroup;
var sceneGroup2;
var pdb;

var startAR = document.getElementById("start-ar");
var flipGraphics = document.querySelector("flip-graphics");
var flipVideo = document.querySelector("flip-video");
var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
var reset = document.querySelector("reset-activity");
var tempControls = document.querySelectorAll("temp-control");
var stopTemp = document.querySelector("stop-temp");
var playTemp = document.querySelector("play-temp");
var renderType = document.querySelector("render-type-icon");

var temperature = 0;
var high = 100;
var medium = 50;
var low = 10;
var defaultTemp = 200;
var prevTemp = 0;

var atomMeshes = [];
var atomBodies = [];
var bonds = [];
var constraints = [];
var atoms = 0;

startAR.addEventListener("click", handleClick);
flipGraphics.addEventListener("flipGraphics", handleFlip);
flipVideo.addEventListener("flipCamera", handleFlip);
scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
reset.addEventListener("resetActivity", handleReset);
stopTemp.addEventListener("stopTemp", handleStopTemp);
playTemp.addEventListener("playTemp", handlePlayTemp);
renderType.addEventListener("click", handleRenderType);
window.addEventListener("camera-change", () => {
  handleFlip();
});
tempControls.forEach(function (item) {
  item.addEventListener("updateTemp", handleTempControls);
});

renderType.isActive = true;

var world = new CANNON.World();
world.gravity.set(0, 0, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

initialize();
animate();

function initialize() {
  scene = new THREE.Scene();

  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
  scene.add(ambientLight);

  camera = new THREE.PerspectiveCamera();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0px";
  renderer.domElement.style.left = "0px";
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();
  deltaTime = 0;
  totalTime = 0;

  // setup arToolkitSource
  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });

  function onResize() {
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
  }

  arToolkitSource.init(function onReady() {
    setTimeout(function () {
      onResize();
    }, 1000);
  });

  // handle resize event
  window.addEventListener("resize", function () {
    onResize();
  });

  // create atToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "data/camera_para.dat",
    detectionMode: "mono",
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  // setup markerRoots
  markerRootArray = [];
  markerGroupArray = [];
  patternArray = [
    "letterA",
    "letterB",
    "letterC",
    "letterD",
    "letterF",
    "kanji",
  ];

  let rotationArray = [
    new THREE.Vector3(-Math.PI / 2, 0, 0),
    new THREE.Vector3(0, -Math.PI / 2, Math.PI / 2),
    new THREE.Vector3(Math.PI / 2, 0, Math.PI),
    new THREE.Vector3(-Math.PI / 2, Math.PI / 2, 0),
    new THREE.Vector3(Math.PI, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ];

  for (let i = 0; i < 6; i++) {
    let markerRoot = new THREE.Group();
    markerRootArray.push(markerRoot);
    scene.add(markerRoot);
    let markerControls = new THREEx.ArMarkerControls(
      arToolkitContext,
      markerRoot,
      {
        type: "pattern",
        patternUrl: "data/" + patternArray[i] + ".patt",
      }
    );

    let markerGroup = new THREE.Group();
    markerGroupArray.push(markerGroup);
    markerGroup.position.y = -1.25 / 2;
    markerGroup.rotation.setFromVector3(rotationArray[i]);

    markerRoot.add(markerGroup);
  }

  // setup scene
  sceneGroup = new THREE.Group();
  stickGroup = new THREE.Group();
  spheresGroup = new THREE.Group();

  // a 1x1x1 cube model with scale factor 1.25 fills up the physical cube
  sceneGroup.scale.set(1.25 / 2, 1.25 / 2, 1.25 / 2);

  let pointLight = new THREE.PointLight(0xffffff, 1, 50);
  pointLight.position.set(0.5, 3, 2);

  scene.add(pointLight);
}

function update() {
  // update artoolkit on every frame
  if (arToolkitSource.ready !== false) {
    arToolkitContext.update(arToolkitSource.domElement);
  }

  for (let i = 0; i < 6; i++) {
    if (markerRootArray[i].visible) {
      markerGroupArray[i].add(sceneGroup);
      break;
    }
  }
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  deltaTime = clock.getDelta();
  totalTime += deltaTime;
  world.step(1 / 600);
  updatePhysics();
  update();
  render();
}

function updatePhysics() {
  world.step(1 / 600);

  var velsum_expected = Math.sqrt(temperature) * atoms;

  var velsum = 0;
  var sumax = 0;
  var sumay = 0;
  var sumaz = 0;
  // var sumaxr = 0;
  // var sumayr = 0;
  // var sumazr = 0;

  for (var i = 0; i < atomMeshes.length; i++) {
    sumax = sumax + atomBodies[i].position.x;
    sumay = sumay + atomBodies[i].position.y;
    sumaz = sumaz + atomBodies[i].position.z;
    // sumaxr = sumaxr + world.bodies[i].quaternion.x;
    // sumayr = sumayr + world.bodies[i].quaternion.y;
    // sumazr = sumazr + world.bodies[i].quaternion.z;
  }

  for (var i = 0; i < atomMeshes.length; i++) {
    atomBodies[i].position.x =
      atomBodies[i].position.x - sumax / atomMeshes.length;
    atomBodies[i].position.y =
      atomBodies[i].position.y - sumay / atomMeshes.length;
    atomBodies[i].position.z =
      atomBodies[i].position.z - sumaz / atomMeshes.length;
  }

  for (var i = 0; i < atomMeshes.length; i++) {
    atomMeshes[i].position.copy(atomBodies[i].position);
    atomMeshes[i].quaternion.copy(atomBodies[i].quaternion);

    atomBodies[i].velocity.x =
      atomBodies[i].velocity.x + 10 * Math.random(1) - 5;
    atomBodies[i].velocity.y =
      atomBodies[i].velocity.y + 10 * Math.random(1) - 5;
    atomBodies[i].velocity.z =
      atomBodies[i].velocity.z + 10 * Math.random(1) - 5;

    velsum =
      velsum +
      Math.sqrt(
        Math.pow(atomBodies[i].velocity.x, 2) +
          Math.pow(atomBodies[i].velocity.y, 2) +
          Math.pow(atomBodies[i].velocity.z, 2)
      );
  }

  for (var i = 0; i < atomMeshes.length; i++) {
    atomBodies[i].velocity.x =
      (atomBodies[i].velocity.x / velsum) * velsum_expected;
    atomBodies[i].velocity.y =
      (atomBodies[i].velocity.y / velsum) * velsum_expected;
    atomBodies[i].velocity.z =
      (atomBodies[i].velocity.z / velsum) * velsum_expected;
  }

  bonds.forEach(function (bond) {
    var B = new THREE.Vector3(
      atomMeshes[bond.atomA].position.x,
      atomMeshes[bond.atomA].position.y,
      atomMeshes[bond.atomA].position.z
    );

    var A = new THREE.Vector3(
      atomMeshes[bond.atomA].position.x / 2 +
        atomMeshes[bond.atomB].position.x / 2,
      atomMeshes[bond.atomA].position.y / 2 +
        atomMeshes[bond.atomB].position.y / 2,
      atomMeshes[bond.atomA].position.z / 2 +
        atomMeshes[bond.atomB].position.z / 2
    );

    var C = new THREE.Vector3(
      atomMeshes[bond.atomA].position.x / 2 +
        atomMeshes[bond.atomB].position.x / 2,
      atomMeshes[bond.atomA].position.y / 2 +
        atomMeshes[bond.atomB].position.y / 2,
      atomMeshes[bond.atomA].position.z / 2 +
        atomMeshes[bond.atomB].position.z / 2
    );
    var D = new THREE.Vector3(
      atomMeshes[bond.atomB].position.x,
      atomMeshes[bond.atomB].position.y,
      atomMeshes[bond.atomB].position.z
    );

    var vec = B.clone();
    vec.sub(A);
    var h = vec.length();
    vec.normalize();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
    bond.sticks[0].position.set(0, 0, 0);
    bond.sticks[0].rotation.set(0, 0, 0);
    bond.sticks[0].translateOnAxis(0, h / 2, 0);
    bond.sticks[0].applyQuaternion(quaternion);
    bond.sticks[0].position.set(A.x, A.y, A.z);

    var vec2 = D.clone();
    vec2.sub(C);
    var h2 = vec.length();
    vec2.normalize();
    var quaternion2 = new THREE.Quaternion();
    quaternion2.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec2);
    bond.sticks[1].position.set(0, 0, 0);
    bond.sticks[1].rotation.set(0, 0, 0);
    bond.sticks[1].translateOnAxis(0, h2 / 2, 0);
    bond.sticks[1].applyQuaternion(quaternion2);
    bond.sticks[1].position.set(C.x, C.y, C.z);
  });
}

function loadPdb(rawPdb) {
  pdb = setupPdb(rawPdb);
  atoms = pdb.atoms;

  clearPhysics(atomBodies, constraints);
  clearGroup(stickGroup);
  clearGroup(spheresGroup);

  console.time("VMK");

  [spheresGroup, atomMeshes, atomBodies] = createSpheres(
    pdb,
    renderType.isActive
  );

  atomBodies.forEach(function (sphere) {
    world.addBody(sphere);
  });
  sceneGroup.add(spheresGroup);

  [stickGroup, bonds, constraints] = createSticks(pdb, atomBodies);
  sceneGroup.add(stickGroup);
  constraints.forEach(function (constraint) {
    world.addConstraint(constraint);
  });

  console.timeEnd("VMK");

  if (window.innerWidth >= 768) {
    handleFlip();
  }
}

function clearPhysics(bodies, constraints) {
  // var bodies = world.bodies;
  // var cs = world.constraints;

  for (var i = bodies.length - 1; i >= 0; i--) {
    world.removeBody(bodies[i]);
  }

  for (var i = constraints.length - 1; i >= 0; i--) {
    world.removeConstraint(constraints[i]);
  }
}

function handleClick(e) {
  var pdbInserted = pdbText.value;

  if (pdbInserted.length > 0) {
    loadPdb(pdbInserted);
    handleMenu(e);
    handleTempMenu(e);
  } else {
    console.log("No pdb!");
  }
}

function handleFlip(e) {
  for (var i = 0; i < atomMeshes.length; i++) {
    atomBodies[i].position.x = -atomBodies[i].position.x;
    // world.bodies[i].position.y = - world.bodies[i].position.y;
    // world.bodies[i].position.z = - world.bodies[i].position.z;
  }
}

function handleScale(e) {
  if (e.detail === "up") {
    sceneGroup.scale.multiplyScalar(1.5);
  } else {
    sceneGroup.scale.multiplyScalar(0.6667);
  }
}

function handleReset(e) {
  atomMeshes = [];
  atomBodies = [];
  constraints = [];
  bonds = [];
  atoms = 0;
  temperature = 0;

  clearPhysics(atomBodies, constraints);
  clearGroup(stickGroup);
  clearGroup(spheresGroup);

  sceneGroup.scale.set(1.25 / 2, 1.25 / 2, 1.25 / 2);

  handleMenu();
}

function handleTempControls(e) {
  var type = e.detail.type;
  var size = e.detail.size;

  var tempOffset;

  if (size === "big") {
    tempOffset = high;
  } else if (size === "medium") {
    tempOffset = medium;
  } else {
    tempOffset = low;
  }

  if (type === "increase") {
    temperature = temperature + tempOffset;
  } else {
    var newTemp = temperature - tempOffset;
    temperature = newTemp < 0 ? 0 : newTemp;
  }

  prevTemp = temperature;
}

function handleStopTemp(e) {
  prevTemp = temperature;
  temperature = 0;
}

function handlePlayTemp(e) {
  temperature = prevTemp === 0 ? defaultTemp : prevTemp;
  prevTemp = temperature;
}

function handleRenderType(e) {
  renderType.isActive = !renderType.isActive;

  if (!renderType.isActive) {
    stickGroup.visible = false;

    spheresGroup.children.forEach(function (atom, index) {
      var scale = radiusfactor2 * elementradii[pdb.elements[index]];
      atom.scale.setScalar(scale);
    });
  } else {
    stickGroup.visible = true;

    spheresGroup.children.forEach(function (atom, index) {
      var scale = radiusfactor1 * elementradii[pdb.elements[index]];
      atom.scale.setScalar(scale);
    });
  }
}

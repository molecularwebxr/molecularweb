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
var patternArray2, markerRootArray2, markerGroupArray2;
var sceneGroup, stickGroup;
var sceneGroup2, stickGroup2;
var pdb, pdb2;

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
var atomShapes = [];
var bonds = [];
var constraints = [];
var atoms = 0;

var atomMeshes2 = [];
var atomBodies2 = [];
var atomShapes2 = [];
var bonds2 = [];
var constraints2 = [];
var atoms2 = 0;

var selectedMarker = 1;

var cannonDebugRenderer;

var lastCubeQuaternion = new THREE.Quaternion(0, 0, 0, 1);
var lastCubeQuaternion2 = new THREE.Quaternion(0, 0, 0, 1);

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
window.addEventListener("marker-found", function (e) {
  console.log("Found!")
})

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

  let pointLight = new THREE.PointLight(0xffffff, 1, 50);
  pointLight.position.set(0.5, 3, 2);

  scene.add(pointLight);

  markerRootArray2 = [];
  markerGroupArray2 = [];
  patternArray2 = [
    "letterN",
    "letterJ",
    "letterK",
    "letterP",
    "letterL",
    "letterM",
  ];

  for (let i = 0; i < 6; i++) {
    let markerRoot2 = new THREE.Group();
    markerRootArray2.push(markerRoot2);
    scene.add(markerRoot2);
    let markerControls = new THREEx.ArMarkerControls(
      arToolkitContext,
      markerRoot2,
      {
        type: "pattern",
        patternUrl: "data/" + patternArray2[i] + ".patt",
      }
    );

    let markerGroup2 = new THREE.Group();
    markerGroupArray2.push(markerGroup2);
    markerGroup2.position.y = -1.25 / 2;
    markerGroup2.rotation.setFromVector3(rotationArray[i]);

    markerRoot2.add(markerGroup2);
  }

  sceneGroup2 = new THREE.Group();
  stickGroup2 = new THREE.Group();

  cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);
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

  for (let i = 0; i < 6; i++) {
    if (markerRootArray2[i].visible) {
      markerGroupArray2[i].add(sceneGroup2);
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
  cannonDebugRenderer.update();
  updatePhysics();
  update();
  render();
}

function updatePhysics() {
  var velsum_expected = Math.sqrt(temperature) * atoms;

  var velsum = 0;

  var mediax = 0;
  var mediay = 0;
  var mediaz = 0;

  var mediax2 = 0;
  var mediay2 = 0;
  var mediaz2 = 0;

  for (var i = 0; i < atomBodies.length; i++) {
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

  for (var i = 0; i < atomBodies.length; i++) {
    atomBodies[i].velocity.x =
      (atomBodies[i].velocity.x / velsum) * velsum_expected;
    atomBodies[i].velocity.y =
      (atomBodies[i].velocity.y / velsum) * velsum_expected;
    atomBodies[i].velocity.z =
      (atomBodies[i].velocity.z / velsum) * velsum_expected;
  }

  for (var i = 0; i < atomBodies.length; i++) {
    mediax = mediax + atomBodies[i].position.x;
    mediay = mediay + atomBodies[i].position.y;
    mediaz = mediaz + atomBodies[i].position.z;
  }

  mediax = mediax / atomBodies.length;
  mediay = mediay / atomBodies.length;
  mediaz = mediaz / atomBodies.length;

  var cubePosition = new THREE.Vector3();
  sceneGroup.getWorldPosition(cubePosition);

  var cubeQuaternion = new THREE.Quaternion();
  sceneGroup.getWorldQuaternion(cubeQuaternion);

  for (var i = 0; i < atomBodies.length; i++) {
    atomBodies[i].position.x =
      atomBodies[i].position.x + cubePosition.x - mediax;
    atomBodies[i].position.y =
      atomBodies[i].position.y + cubePosition.y - mediay;
    atomBodies[i].position.z =
      atomBodies[i].position.z + cubePosition.z - mediaz;
  }

  const q = new THREE.Quaternion();
  const inverse1 = new THREE.Quaternion();
  inverse1.copy(lastCubeQuaternion).invert();

  q.multiplyQuaternions(cubeQuaternion, inverse1);

  rotateBodies(
    atomBodies,
    q,
    new CANNON.Vec3(cubePosition.x, cubePosition.y, cubePosition.z)
  );
  
  lastCubeQuaternion.copy(cubeQuaternion);

  for (var i = 0; i < atomMeshes.length; i++) {
    atomMeshes[i].position.x = atomBodies[i].position.x;
    atomMeshes[i].position.y = atomBodies[i].position.y;
    atomMeshes[i].position.z = atomBodies[i].position.z;
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

  // CUBE 2
  velsum = 0;

  for (var i = 0; i < atomMeshes2.length; i++) {
    atomBodies2[i].velocity.x =
      atomBodies2[i].velocity.x + 10 * Math.random(1) - 5;
    atomBodies2[i].velocity.y =
      atomBodies2[i].velocity.y + 10 * Math.random(1) - 5;
    atomBodies2[i].velocity.z =
      atomBodies2[i].velocity.z + 10 * Math.random(1) - 5;

    velsum =
      velsum +
      Math.sqrt(
        Math.pow(atomBodies2[i].velocity.x, 2) +
          Math.pow(atomBodies2[i].velocity.y, 2) +
          Math.pow(atomBodies2[i].velocity.z, 2)
      );
  }

  for (var i = 0; i < atomMeshes2.length; i++) {
    atomBodies2[i].velocity.x =
      (atomBodies2[i].velocity.x / velsum) * velsum_expected;
    atomBodies2[i].velocity.y =
      (atomBodies2[i].velocity.y / velsum) * velsum_expected;
    atomBodies2[i].velocity.z =
      (atomBodies2[i].velocity.z / velsum) * velsum_expected;
  }

  for (var i = 0; i < atomMeshes2.length; i++) {
    mediax2 = mediax2 + atomBodies2[i].position.x;
    mediay2 = mediay2 + atomBodies2[i].position.y;
    mediaz2 = mediaz2 + atomBodies2[i].position.z;
  }

  mediax2 = mediax2 / atomMeshes2.length;
  mediay2 = mediay2 / atomMeshes2.length;
  mediaz2 = mediaz2 / atomMeshes2.length;

  var cubePosition2 = new THREE.Vector3();
  sceneGroup2.getWorldPosition(cubePosition2);

  var cubeQuaternion2 = new THREE.Quaternion();
  sceneGroup2.getWorldQuaternion(cubeQuaternion2);

  for (var i = 0; i < atomBodies2.length; i++) {
    atomBodies2[i].position.x =
      atomBodies2[i].position.x + cubePosition2.x - mediax2;
    atomBodies2[i].position.y =
      atomBodies2[i].position.y + cubePosition2.y - mediay2;
    atomBodies2[i].position.z =
      atomBodies2[i].position.z + cubePosition2.z - mediaz2;
  }

  const q2 = new THREE.Quaternion();
  const inverse2 = new THREE.Quaternion();
  inverse2.copy(lastCubeQuaternion2).invert();

  q2.multiplyQuaternions(cubeQuaternion2, inverse2);

  rotateBodies(
    atomBodies2,
    q2,
    new CANNON.Vec3(cubePosition2.x, cubePosition2.y, cubePosition2.z)
  );
  
  lastCubeQuaternion2.copy(cubeQuaternion2);

  for (var i = 0; i < atomMeshes2.length; i++) {
    atomMeshes2[i].position.x = atomBodies2[i].position.x;
    atomMeshes2[i].position.y = atomBodies2[i].position.y;
    atomMeshes2[i].position.z = atomBodies2[i].position.z;
  }

  bonds2.forEach(function (bond) {
    var B = new THREE.Vector3(
      atomMeshes2[bond.atomA].position.x,
      atomMeshes2[bond.atomA].position.y,
      atomMeshes2[bond.atomA].position.z
    );

    var A = new THREE.Vector3(
      atomMeshes2[bond.atomA].position.x / 2 +
        atomMeshes2[bond.atomB].position.x / 2,
      atomMeshes2[bond.atomA].position.y / 2 +
        atomMeshes2[bond.atomB].position.y / 2,
      atomMeshes2[bond.atomA].position.z / 2 +
        atomMeshes2[bond.atomB].position.z / 2
    );

    var C = new THREE.Vector3(
      atomMeshes2[bond.atomA].position.x / 2 +
        atomMeshes2[bond.atomB].position.x / 2,
      atomMeshes2[bond.atomA].position.y / 2 +
        atomMeshes2[bond.atomB].position.y / 2,
      atomMeshes2[bond.atomA].position.z / 2 +
        atomMeshes2[bond.atomB].position.z / 2
    );
    var D = new THREE.Vector3(
      atomMeshes2[bond.atomB].position.x,
      atomMeshes2[bond.atomB].position.y,
      atomMeshes2[bond.atomB].position.z
    );

    var vec3 = B.clone();
    vec3.sub(A);
    var h3 = vec3.length();
    vec3.normalize();
    var quaternion3 = new THREE.Quaternion();
    quaternion3.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec3);
    bond.sticks[0].position.set(0, 0, 0);
    bond.sticks[0].rotation.set(0, 0, 0);
    bond.sticks[0].translateOnAxis(0, h3 / 2, 0);
    bond.sticks[0].applyQuaternion(quaternion3);
    bond.sticks[0].position.set(A.x, A.y, A.z);

    var vec4 = D.clone();
    vec4.sub(C);
    var h4 = vec3.length();
    vec4.normalize();
    var quaternion4 = new THREE.Quaternion();
    quaternion4.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec4);
    bond.sticks[1].position.set(0, 0, 0);
    bond.sticks[1].rotation.set(0, 0, 0);
    bond.sticks[1].translateOnAxis(0, h4 / 2, 0);
    bond.sticks[1].applyQuaternion(quaternion4);
    bond.sticks[1].position.set(C.x, C.y, C.z);
  });
}

function loadPdb(rawPdb) {
  if (selectedMarker === 1) {
    pdb = setupPdb(rawPdb);
    atoms = pdb.atoms;

    clearPhysics(atomBodies, constraints);
    clearGroup(stickGroup);
    // clearGroup(spheresGroup);

    console.time("VMK");

    [atomShapes, atomMeshes, atomBodies] = createSpheres(
      pdb,
      renderType.isActive
    );

    atomMeshes.forEach(function (sphere) {
      scene.add(sphere);
    });

    atomBodies.forEach(function (sphere) {
      world.addBody(sphere);
    });
    // sceneGroup.add(spheresGroup);

    [stickGroup, bonds, constraints] = createSticks(pdb, atomBodies);
    // sceneGroup.add(stickGroup);
    Object.keys(bonds).forEach(function (bond) {
      scene.add(bonds[bond].sticks[0])
      scene.add(bonds[bond].sticks[1])
    });

    constraints.forEach(function (constraint) {
      world.addConstraint(constraint);
    });

    console.timeEnd("VMK");
    selectedMarker = 2;
  } else {
    pdb2 = setupPdb(rawPdb);
    atoms2 = pdb2.atoms;

    clearPhysics(atomBodies2, constraints2);
    clearGroup(stickGroup2);
    // clearGroup(spheresGroup2);

    console.time("VMK");

    [atomShapes2, atomMeshes2, atomBodies2] = createSpheres(
      pdb2,
      renderType.isActive
    );

    atomMeshes2.forEach(function (sphere) {
      scene.add(sphere);
    });

    atomBodies2.forEach(function (sphere) {
      world.addBody(sphere);
    });
    // sceneGroup2.add(spheresGroup2);

    [stickGroup2, bonds2, constraints2] = createSticks(pdb2, atomBodies2);
    // sceneGroup2.add(stickGroup2);

    Object.keys(bonds2).forEach(function (bond) {
      scene.add(bonds2[bond].sticks[0])
      scene.add(bonds2[bond].sticks[1])
    });

    constraints2.forEach(function (constraint) {
      world.addConstraint(constraint);
    });
    console.timeEnd("VMK");
  }

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
    camera.position.z -= 0.8;
  } else {
    camera.position.z += 0.8;
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
  // clearGroup(spheresGroup);

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
    
    Object.keys(bonds).forEach(function (bond) {
      bonds[bond].sticks[0].visible = false;
      bonds[bond].sticks[1].visible = false;
    });

    Object.keys(bonds2).forEach(function (bond) {
      bonds2[bond].sticks[0].visible = false;
      bonds2[bond].sticks[1].visible = false;
    });

    atomBodies.forEach(function (body, index) {
      body.removeShape(atomShapes[index]);
      atomShapes[index].radius = 2 * elementradii[pdb.elements[index]];
      // body.addShape(atomShapes[index]);
    });

    atomBodies2.forEach(function (body, index) {
      body.removeShape(atomShapes2[index]);
      atomShapes2[index].radius = 2 * elementradii[pdb2.elements[index]];
      // body.addShape(atomShapes2[index]);
    });

    atomMeshes.forEach(function (atom, index) {
      var scale = radiusfactor2 * elementradii[pdb.elements[index]];
      atom.scale.setScalar(scale);
    });

    atomMeshes2.forEach(function (atom, index) {
      var scale = radiusfactor2 * elementradii[pdb2.elements[index]];
      atom.scale.setScalar(scale);
    });

  } else {
    stickGroup.visible = true;

    Object.keys(bonds).forEach(function (bond) {
      bonds[bond].sticks[0].visible = true;
      bonds[bond].sticks[1].visible = true;
    });

    Object.keys(bonds2).forEach(function (bond) {
      bonds2[bond].sticks[0].visible = true;
      bonds2[bond].sticks[1].visible = true;
    });

    atomBodies.forEach(function (body, index) {
      body.removeShape(atomShapes[index]);
      atomShapes[index].radius = 0.5 * elementradii[pdb.elements[index]];
      body.addShape(atomShapes[index]);
    });

    atomBodies2.forEach(function (body, index) {
      body.removeShape(atomShapes2[index]);
      atomShapes2[index].radius = 0.5 * elementradii[pdb2.elements[index]];
      body.addShape(atomShapes2[index]);
    });

    atomMeshes.forEach(function (atom, index) {
      var scale = radiusfactor1 * elementradii[pdb.elements[index]];
      atom.scale.setScalar(scale);
    });

    atomMeshes2.forEach(function (atom, index) {
      var scale = radiusfactor1 * elementradii[pdb2.elements[index]];
      atom.scale.setScalar(scale);
    });
  }
}

function rotateBodies(bodies, angle, pivotPosition) {
  var rotation = new CANNON.Quaternion();
  rotation.x = angle.x;
  rotation.y = angle.y;
  rotation.z = angle.z;
  rotation.w = angle.w;

  var pivot = new CANNON.Vec3();
  pivot.x = pivotPosition.x;
  pivot.y = pivotPosition.y;
  pivot.z = pivotPosition.z;
  // pivot.copy(pivotPosition);

  var rotVector = new CANNON.Vec3();

  bodies.forEach(function (body) {
    // rotate body orientation
    body.quaternion = rotation.mult(body.quaternion);

    // rotate body position in pivot frame and add pivotBody position
    rotation.vmult(body.position.vsub(pivot), rotVector);

    rotVector.vadd(pivot, body.position);
  });
}
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
var sceneGroup;
var sceneGroup2;
var pdb, pdb2;

var startAR = document.getElementById("start-ar");
var copyCoords = document.getElementById("copy-coords");
var snackbar = document.getElementById("snackbar");
var flipVideo = document.querySelector("flip-video");
var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
var reset = document.querySelector("reset-activity");
var tempControls = document.querySelectorAll("temp-control");
var stopTemp = document.querySelector("stop-temp");
var playTemp = document.querySelector("play-temp");
var switchInteractions = document.getElementById("switch-interactions");
var switchBridge = document.getElementById("switch-bridge");
var switchClashes = document.getElementById("switch-clashes");
var marker1 = document.getElementById("marker-1");
var marker2 = document.getElementById("marker-2");
var switchSpheres1 = document.getElementById("switch-spheres-1");
var switchSpheres2 = document.getElementById("switch-spheres-2");
var switchFlip1 = document.getElementById("switch-flip-1");
var switchFlip2 = document.getElementById("switch-flip-2");
var jmeBtn = document.getElementById("jme-btn");
var jmeBtnClose = document.getElementById("jsme-btn-close");
var jmeModal = document.getElementById("jsme-container");
var jmeOverlay = document.getElementById("jme-overlay");
var jmeInput = document.getElementById("jme-input");
var jmeSearch = document.getElementById("jme-search");
var jmeCancel = document.getElementById("jme-cancel");
var jmeContinue = document.getElementById("jme-continue");
var chartContainer = document.getElementById("ani-chart");
var switchAni = document.getElementById("switch-ani");

var baseUrl = "https://cactus.nci.nih.gov/chemical/structure/";
var pdbUrl = "/file?format=pdb&get3d=true";
var jmeUrl = "/file?format=jme";

var plottime = 0;
var temperature = 0;
var high = 50;
var medium = 10;
var low = 5;
var defaultTemp = 100;
var prevTemp = 0;
var minDistance = 2;
var bridgeDist = 1.2;
var distanceConstraint = 0.2;
var constraintForce = 20;
var bridges = [];
var connectors = [];

var atomMeshes = [];
var clashMeshes = [];
var atomBodies = [];
var atomShapes = [];
var bonds = [];
var sticks = [];
var constraints = [];
var interactiveAtoms1;
var interactions1 = [];
var atoms = 0;

var atomMeshes2 = [];
var clashMeshes2 = [];
var atomBodies2 = [];
var atomShapes2 = [];
var bonds2 = [];
var sticks2 = [];
var constraints2 = [];
var interactiveAtoms2;
var interactions2 = [];
var atoms2 = 0;

var selectedMarker = 1;

var isCube1Visible = false;
var isCube2Visible = false;

var isClashingActive = false;
var isInteractionActive = false;
var isBridgeActive = false;
var isAniActive = false;

var cannonDebugRenderer;

var counter = 0;

var lastCubeQuaternion = new THREE.Quaternion(0, 0, 0, 1);
var lastCubeQuaternion2 = new THREE.Quaternion(0, 0, 0, 1);
var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 32, 16);
var sphereMaterial = new THREE.MeshLambertMaterial({ color: "yellow" });
var dummy = new THREE.Object3D();

var P1 = [];
var Q1 = [];

var Qx1 = 0;
var Qy1 = 0;
var Qz1 = 0;

var Px1 = 0;
var Py1 = 0;
var Pz1 = 0;

var P2 = [];
var Q2 = [];

var Qx2 = 0;
var Qy2 = 0;
var Qz2 = 0;

var Px2 = 0;
var Py2 = 0;
var Pz2 = 0;

var debug = true;

startAR.addEventListener("click", handleClick);
copyCoords.addEventListener("click", handleCopyCoords);
flipVideo.addEventListener("flipCamera", handleFlip);
scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
reset.addEventListener("resetActivity", handleReset);
stopTemp.addEventListener("stopTemp", handleStopTemp);
playTemp.addEventListener("playTemp", handlePlayTemp);
switchClashes.addEventListener("change", handleClashesChange);
switchInteractions.addEventListener("change", handleInteractionsChange);
switchBridge.addEventListener("change", handleBridgeChange);
marker1.addEventListener("click", handleMarkerSelection);
marker2.addEventListener("click", handleMarkerSelection);
switchSpheres1.addEventListener("change", handleRenderType);
switchSpheres2.addEventListener("change", handleRenderType);
switchFlip1.addEventListener("change", handleFlip);
switchFlip2.addEventListener("change", handleFlip);
switchAni.addEventListener("change", handleAniChage);
jmeBtn.addEventListener("click", openJme);
jmeBtnClose.addEventListener("click", closeJme);
jmeSearch.addEventListener("click", searchMol);
jmeCancel.addEventListener("click", closeJme);
jmeContinue.addEventListener("click", selectMol);
window.addEventListener("camera-change", () => {
  handleFlip();
});
tempControls.forEach(function (item) {
  item.addEventListener("updateTemp", handleTempControls);
});
window.addEventListener("markerFound", function (e) {
  if (e.detail.id < 6) {
    isCube1Visible = true;
  }
  if (e.detail.id > 5) {
    isCube2Visible = true;
  }
});
window.addEventListener("markerLost", function (e) {
  if (e.detail.id < 6) {
    isCube1Visible = false;
  }
  if (e.detail.id > 5) {
    isCube2Visible = false;
  }
});

var world = new CANNON.World();
world.gravity.set(0, 0, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

var ctx = document.getElementById("chart1").getContext("2d");
var data = {
  labels: [],
  datasets: [
    {
      data: [],
      label: "Energy",
      // backgroundColor: '#F44436',
      borderColor: "#F44436",
      pointBackgroundColor: "#F44436",
    },
  ],
};
var optionsAnimations = {
  animation: false,
  legend: {
    display: false,
  },
  responsive: true,
};
var chart1 = new Chart(ctx, {
  type: "line",
  data: data,
  options: optionsAnimations,
});

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
  renderer.domElement.id = "renderer-canvas";
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

  // cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);
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

  // if (isCube1Visible) {
  //   sticks.forEach(function (bond) {
  //     bond.visible = true;
  //   });

  //   atomMeshes.forEach(function (atom) {
  //     atom.visible = true;
  //   });
  // } else {
  //   sticks.forEach(function (bond) {
  //     bond.visible = false;
  //   });

  //   atomMeshes.forEach(function (atom) {
  //     atom.visible = false;
  //   });
  // }

  // if (isCube2Visible) {
  //   sticks2.forEach(function (bond) {
  //     bond.visible = true;
  //   });

  //   atomMeshes2.forEach(function (atom) {
  //     atom.visible = true;
  //   });
  // } else {
  //   sticks2.forEach(function (bond) {
  //     bond.visible = false;
  //   });

  //   atomMeshes2.forEach(function (atom) {
  //     atom.visible = false;
  //   });
  // }
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  deltaTime = clock.getDelta();
  totalTime += deltaTime;
  world.step(1 / 60);
  // cannonDebugRenderer.update();

  if (atoms > 0 && atoms2 > 0) {
    updateInteractions();
  }

  if (atoms > 0 && isAniActive) {
    updateEnergies();
  }

  updatePhysics();
  update();
  render();
}

function updateInteractions() {
  interactiveAtoms1.hydrogen.forEach(function (hydrogensArr) {
    interactiveAtoms2.oxygen.forEach(function (oxygenArr) {
      handleInteraction(oxygenArr, 2, hydrogensArr);
    });

    interactiveAtoms2.nitrogen.forEach(function (nitrogenArr) {
      handleInteraction(nitrogenArr, 2, hydrogensArr);
    });

    interactiveAtoms2.fluor.forEach(function (fluorArr) {
      handleInteraction(fluorArr, 2, hydrogensArr);
    });

    interactiveAtoms2.sulfur.forEach(function (sulfurArr) {
      handleInteraction(sulfurArr, 2, hydrogensArr);
    });

    interactiveAtoms2.chlorine.forEach(function (chlorineArr) {
      handleInteraction(chlorineArr, 2, hydrogensArr);
    });

    interactiveAtoms2.bromine.forEach(function (bromineArr) {
      handleInteraction(bromineArr, 2, hydrogensArr);
    });

    interactiveAtoms2.iodine.forEach(function (iodineArr) {
      handleInteraction(iodineArr, 2, hydrogensArr);
    });
  });

  interactiveAtoms2.hydrogen.forEach(function (hydrogensArr) {
    interactiveAtoms1.oxygen.forEach(function (oxygenArr) {
      handleInteraction(oxygenArr, 1, hydrogensArr);
    });

    interactiveAtoms1.nitrogen.forEach(function (nitrogenArr) {
      handleInteraction(nitrogenArr, 1, hydrogensArr);
    });

    interactiveAtoms1.fluor.forEach(function (fluorArr) {
      handleInteraction(fluorArr, 1, hydrogensArr);
    });

    interactiveAtoms1.sulfur.forEach(function (sulfurArr) {
      handleInteraction(sulfurArr, 1, hydrogensArr);
    });

    interactiveAtoms1.chlorine.forEach(function (chlorineArr) {
      handleInteraction(chlorineArr, 1, hydrogensArr);
    });

    interactiveAtoms1.bromine.forEach(function (bromineArr) {
      handleInteraction(bromineArr, 1, hydrogensArr);
    });

    interactiveAtoms1.iodine.forEach(function (iodineArr) {
      handleInteraction(iodineArr, 1, hydrogensArr);
    });
  });

  if (!isInteractionActive) {
    interactions1.forEach(function (interaction) {
      interaction.constraint.disable();
    });

    interactions2.forEach(function (interaction) {
      interaction.constraint.disable();
    });
  } else {
    interactions1.forEach(function (interaction) {
      interaction.constraint.enable();
    });

    interactions2.forEach(function (interaction) {
      interaction.constraint.enable();
    });
  }

  updateConnectors();

  updateClashes();
}

function updatePhysics() {
  var velsum_expected = Math.sqrt(temperature) * atoms;

  var velsum = 0;

  for (var i = 0; i < atoms; i++) {
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

  for (var i = 0; i < atoms; i++) {
    atomBodies[i].velocity.x =
      (atomBodies[i].velocity.x / velsum) * velsum_expected;
    atomBodies[i].velocity.y =
      (atomBodies[i].velocity.y / velsum) * velsum_expected;
    atomBodies[i].velocity.z =
      (atomBodies[i].velocity.z / velsum) * velsum_expected;
  }

  var cubePosition = new THREE.Vector3();
  sceneGroup.getWorldPosition(cubePosition);

  var cubeQuaternion = new THREE.Quaternion();
  sceneGroup.getWorldQuaternion(cubeQuaternion);

  if (atomBodies.length > 0) {
    P1 = [];

    atomBodies.forEach(function (body) {
      P1.push([body.position.x, body.position.y, body.position.z]);
    });

    Px1 = 0;
    Py1 = 0;
    Pz1 = 0;

    for (var i = 0; i < atomBodies.length; i++) {
      Px1 = Px1 + atomBodies[i].position.x;
      Py1 = Py1 + atomBodies[i].position.y;
      Pz1 = Pz1 + atomBodies[i].position.z;
    }

    P1.forEach(function (point) {
      point[0] = point[0] - Px1 / atomBodies.length;
      point[1] = point[1] - Py1 / atomBodies.length;
      point[2] = point[2] - Pz1 / atomBodies.length;
    });

    var pMatrix1 = array2mat(P1);
    var qMatrix1 = array2mat(Q1);
    var qMatrixT1 = transposeMatrix(qMatrix1);

    var H1 = mul(qMatrixT1, pMatrix1);
    var svdH1 = svd(H1, "full");

    var d1 = det(mul(svdH1.V, transposeMatrix(svdH1.U)));

    var arrTmp1 = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, Math.sign(d1)],
    ];
    var matTemp = array2mat(arrTmp1);

    var R1 = mul(svdH1.V, mul(matTemp, transposeMatrix(svdH1.U)));
    var newR1 = mul(pMatrix1, R1);

    var newRArr1 = newR1.toArray();

    atomBodies.forEach(function (body, bodyIndex) {
      body.position.x = newRArr1[bodyIndex][0];
      body.position.y = newRArr1[bodyIndex][1];
      body.position.z = newRArr1[bodyIndex][2];
    });

    for (var i = 0; i < atoms; i++) {
      atomBodies[i].position.x = atomBodies[i].position.x + cubePosition.x;
      atomBodies[i].position.y = atomBodies[i].position.y + cubePosition.y;
      atomBodies[i].position.z = atomBodies[i].position.z + cubePosition.z;
    }
  }

  rotateBodies(
    atomBodies,
    cubeQuaternion,
    new CANNON.Vec3(cubePosition.x, cubePosition.y, cubePosition.z)
  );

  lastCubeQuaternion.copy(cubeQuaternion);

  for (var i = 0; i < atoms; i++) {
    atomMeshes[i].position.x = atomBodies[i].position.x;
    atomMeshes[i].position.y = atomBodies[i].position.y;
    atomMeshes[i].position.z = atomBodies[i].position.z;

    clashMeshes[i].position.x = atomBodies[i].position.x;
    clashMeshes[i].position.y = atomBodies[i].position.y;
    clashMeshes[i].position.z = atomBodies[i].position.z;
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

  for (var i = 0; i < atoms2; i++) {
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

  for (var i = 0; i < atoms2; i++) {
    atomBodies2[i].velocity.x =
      (atomBodies2[i].velocity.x / velsum) * velsum_expected;
    atomBodies2[i].velocity.y =
      (atomBodies2[i].velocity.y / velsum) * velsum_expected;
    atomBodies2[i].velocity.z =
      (atomBodies2[i].velocity.z / velsum) * velsum_expected;
  }

  var cubePosition2 = new THREE.Vector3();
  sceneGroup2.getWorldPosition(cubePosition2);

  var cubeQuaternion2 = new THREE.Quaternion();
  sceneGroup2.getWorldQuaternion(cubeQuaternion2);

  if (atomBodies2.length > 0) {
    P2 = [];

    atomBodies2.forEach(function (body) {
      P2.push([body.position.x, body.position.y, body.position.z]);
    });

    Px2 = 0;
    Py2 = 0;
    Pz2 = 0;

    for (var i = 0; i < atomBodies2.length; i++) {
      Px2 = Px2 + atomBodies2[i].position.x;
      Py2 = Py2 + atomBodies2[i].position.y;
      Pz2 = Pz2 + atomBodies2[i].position.z;
    }

    P2.forEach(function (point) {
      point[0] = point[0] - Px2 / atomBodies2.length;
      point[1] = point[1] - Py2 / atomBodies2.length;
      point[2] = point[2] - Pz2 / atomBodies2.length;
    });

    var pMatrix2 = array2mat(P2);
    var qMatrix2 = array2mat(Q2);
    var qMatrixT2 = transposeMatrix(qMatrix2);

    var H2 = mul(qMatrixT2, pMatrix2);
    var svdH2 = svd(H2, "full");

    var d2 = det(mul(svdH2.V, transposeMatrix(svdH2.U)));

    var arrTmp2 = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, Math.sign(d2)],
    ];
    var matTemp = array2mat(arrTmp2);

    var R2 = mul(svdH2.V, mul(matTemp, transposeMatrix(svdH2.U)));
    var newR2 = mul(pMatrix2, R2);

    var newRArr2 = newR2.toArray();

    atomBodies2.forEach(function (body, bodyIndex) {
      body.position.x = newRArr2[bodyIndex][0];
      body.position.y = newRArr2[bodyIndex][1];
      body.position.z = newRArr2[bodyIndex][2];
    });

    for (var i = 0; i < atoms2; i++) {
      atomBodies2[i].position.x = atomBodies2[i].position.x + cubePosition2.x;
      atomBodies2[i].position.y = atomBodies2[i].position.y + cubePosition2.y;
      atomBodies2[i].position.z = atomBodies2[i].position.z + cubePosition2.z;
    }
  }

  rotateBodies(
    atomBodies2,
    cubeQuaternion2,
    new CANNON.Vec3(cubePosition2.x, cubePosition2.y, cubePosition2.z)
  );

  lastCubeQuaternion2.copy(cubeQuaternion2);

  for (var i = 0; i < atoms2; i++) {
    atomMeshes2[i].position.x = atomBodies2[i].position.x;
    atomMeshes2[i].position.y = atomBodies2[i].position.y;
    atomMeshes2[i].position.z = atomBodies2[i].position.z;

    clashMeshes2[i].position.x = atomBodies2[i].position.x;
    clashMeshes2[i].position.y = atomBodies2[i].position.y;
    clashMeshes2[i].position.z = atomBodies2[i].position.z;
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
    resetMarker1();
    resetGeneral();

    pdb = setupPdb(rawPdb);
    atoms = pdb.atoms;

    console.time("VMK");

    [atomShapes, atomMeshes, clashMeshes, atomBodies] = createSpheres(pdb);

    atomMeshes.forEach(function (sphere, index) {
      scene.add(sphere);
      scene.add(clashMeshes[index]);
    });

    atomBodies.forEach(function (sphere) {
      world.addBody(sphere);
    });

    [sticks, bonds, interactiveAtoms1, constraints] = createSticks(
      pdb,
      atomBodies
    );

    sticks.forEach(function (stick) {
      scene.add(stick);
    });

    constraints.forEach(function (constraint) {
      world.addConstraint(constraint);
    });

    console.timeEnd("VMK");
    if (window.innerWidth >= 768) {
      atomBodies.forEach(function (body) {
        body.position.x = -body.position.x;
      });
    }
    selectedMarker = 2;
    marker1.classList.remove("selected");
    marker2.classList.add("selected");

    switchFlip1.disabled = false;
    switchSpheres1.disabled = false;

    resetQ1();
  } else {
    resetMarker2();
    resetGeneral();

    pdb2 = setupPdb(rawPdb);
    atoms2 = pdb2.atoms;

    console.time("VMK");

    [atomShapes2, atomMeshes2, clashMeshes2, atomBodies2] = createSpheres(pdb2);

    atomMeshes2.forEach(function (sphere, index) {
      scene.add(sphere);
      scene.add(clashMeshes2[index]);
    });

    atomBodies2.forEach(function (sphere) {
      world.addBody(sphere);
    });

    [sticks2, bonds2, interactiveAtoms2, constraints2] = createSticks(
      pdb2,
      atomBodies2
    );

    sticks2.forEach(function (stick) {
      scene.add(stick);
    });

    constraints2.forEach(function (constraint) {
      world.addConstraint(constraint);
    });
    console.timeEnd("VMK");
    if (window.innerWidth >= 768) {
      atomBodies2.forEach(function (body) {
        body.position.x = -body.position.x;
      });
    }
    selectedMarker = 1;
    marker2.classList.remove("selected");
    marker1.classList.add("selected");

    switchFlip2.disabled = false;
    switchSpheres2.disabled = false;

    resetQ2();
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
    if (atoms > 0 && atoms2 > 0) {
      handleMenu(e);
      handleTempMenu(e);
    }
  } else {
    console.log("No pdb!");
  }
}

function handleFlip(e) {
  if (e.target.id === "switch-flip-1") {
    atomBodies.forEach(function (body) {
      body.position.x = -body.position.x;
    });

    resetQ1();

    return;
  }

  if (e.target.id === "switch-flip-2") {
    atomBodies2.forEach(function (body) {
      body.position.x = -body.position.x;
    });

    resetQ2();

    return;
  }

  atomBodies.forEach(function (body) {
    body.position.x = -body.position.x;
  });

  atomBodies2.forEach(function (body) {
    body.position.x = -body.position.x;
  });

  resetQ1();
  resetQ2();
}

function handleScale(e) {
  if (e.detail === "up") {
    camera.position.z -= 0.8;
  } else {
    camera.position.z += 0.8;
  }
}

function handleReset(e) {
  resetMarker1();
  resetMarker2();

  resetGeneral();

  var cs = world.constraints;

  for (var i = cs.length - 1; i >= 0; i--) {
    world.removeConstraint(cs[i]);
  }

  selectedMarker = 1;

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
  var markerSelected;
  if (e.target.id === "switch-spheres-1") {
    markerSelected = 1;
  } else {
    markerSelected = 2;
  }

  var isChecked = e.target.checked;

  if (markerSelected === 1) {
    if (isChecked) {
      sticks.forEach(function (bond) {
        bond.visible = false;
      });
      atomMeshes.forEach(function (atom, index) {
        var scale = radiusfactor2 * elementradii[pdb.elements[index]];
        atom.scale.setScalar(scale);
      });
    } else {
      sticks.forEach(function (bond) {
        bond.visible = true;
      });
      atomMeshes.forEach(function (atom, index) {
        var scale = radiusfactor1 * elementradii[pdb.elements[index]];
        atom.scale.setScalar(scale);
      });
    }
  } else {
    if (isChecked) {
      sticks2.forEach(function (bond) {
        bond.visible = false;
      });
      atomMeshes2.forEach(function (atom, index) {
        var scale = radiusfactor2 * elementradii[pdb2.elements[index]];
        atom.scale.setScalar(scale);
      });
    } else {
      sticks2.forEach(function (bond) {
        bond.visible = true;
      });
      atomMeshes2.forEach(function (atom, index) {
        var scale = radiusfactor1 * elementradii[pdb2.elements[index]];
        atom.scale.setScalar(scale);
      });
    }
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
  // if(!atomBodies[0].position.x) console.log("Rotate NAN")
}

function createInteraction(cubeIndex, interactionKey, bridgeKey, bodyA, bodyB) {
  var interactionsArr = cubeIndex === 1 ? interactions1 : interactions2;
  var constraint = new CANNON.DistanceConstraint(
    bodyA,
    bodyB,
    distanceConstraint,
    constraintForce
  );

  world.addConstraint(constraint);

  interactionsArr.push({
    key: interactionKey,
    constraint,
  });
  bridges.push(bridgeKey);
}

function removeInteraction(cubeIndex, interactionIndex, bridgeKey) {
  var interactionsArr = cubeIndex === 1 ? interactions1 : interactions2;
  var thisInteraction = interactionsArr[interactionIndex];

  world.removeConstraint(thisInteraction.constraint);

  var bridgeIndex = bridges.findIndex(function (bridge) {
    return bridge === bridgeKey;
  });
  bridges.splice(bridgeIndex, 1);

  interactionsArr.splice(interactionIndex, 1);
}

function addConnector(meshA, meshB, bridgeKey) {
  var mesh = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 9);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  scene.add(mesh);
  connectors.push({ meshA, meshB, mesh, key: bridgeKey });
}

function removeConnector(bridgeKey) {
  var connectorIndex = connectors.findIndex(function (connector) {
    return connector.key === bridgeKey;
  });

  connectors[connectorIndex].mesh.dispose();
  scene.remove(connectors[connectorIndex].mesh);
  connectors.splice(connectorIndex, 1);
}

function updateConnectors() {
  if (!isBridgeActive) {
    connectors.forEach(function (connector) {
      connector.mesh.dispose();
      scene.remove(connector.mesh);
    });
    connectors = [];
    return;
  }

  connectors.forEach(function (connector) {
    for (let index = 1; index < 10; index++) {
      var p0 = new THREE.Vector3();
      var p1 = new THREE.Vector3();
      var pf = new THREE.Vector3();

      p0.setFromMatrixPosition(connector.meshA.matrixWorld);
      p1.setFromMatrixPosition(connector.meshB.matrixWorld);
      pf.lerpVectors(p0, p1, index / 10);

      dummy.position.copy(pf);
      dummy.updateMatrix();
      connector.mesh.setMatrixAt(index, dummy.matrix);
    }
    connector.mesh.instanceMatrix.needsUpdate = true;
  });
}

function updateClashes() {
  if (!isClashingActive) {
    clashMeshes.forEach(function (mesh) {
      mesh.visible = false;
    });

    clashMeshes2.forEach(function (mesh) {
      mesh.visible = false;
    });

    return;
  }

  for (let i = 0; i < atoms; i++) {
    var atomPosition = atomMeshes[i].position;
    var isAtom1Clashing = false;
    for (let j = 0; j < atoms2; j++) {
      var atomPosition2 = atomMeshes2[j].position;

      var distance = Math.sqrt(
        Math.pow(atomPosition.x - atomPosition2.x, 2) +
          Math.pow(atomPosition.y - atomPosition2.y, 2) +
          Math.pow(atomPosition.z - atomPosition2.z, 2)
      );

      var cutOff =
        elementradii[pdb.elements[i]] + elementradii[pdb2.elements[j]];

      if (distance < cutOff * 1.2) {
        var isAtom1Clashing = true;
        break;
      }
    }
    clashMeshes[i].visible = isAtom1Clashing;
  }

  for (let i = 0; i < atoms2; i++) {
    var atomPosition = atomMeshes2[i].position;
    var isAtom2Clashing = false;
    for (let j = 0; j < atoms; j++) {
      var atomPosition2 = atomMeshes[j].position;

      var distance = Math.sqrt(
        Math.pow(atomPosition.x - atomPosition2.x, 2) +
          Math.pow(atomPosition.y - atomPosition2.y, 2) +
          Math.pow(atomPosition.z - atomPosition2.z, 2)
      );

      var cutOff =
        elementradii[pdb2.elements[i]] + elementradii[pdb.elements[j]];

      if (distance < cutOff * 1.2) {
        var isAtom2Clashing = true;
        break;
      }
    }
    clashMeshes2[i].visible = isAtom2Clashing;
  }
}

// This function handle the interaction of an element with H
// elementArr is the array of interacive atoms of a certain element
// cubeNumber corresponds to the cube where elementArr belongs
// otherCube, otherMoleculeMeshes and otherMoleculeBodies corresponds to the other cube
function handleInteraction(elementArr, cubeNumber, hydrogensArr) {
  var element = elementArr[0];

  var thisMoleculeMeshes = cubeNumber === 1 ? atomMeshes : atomMeshes2;
  var otherMoleculeMeshes = cubeNumber === 2 ? atomMeshes : atomMeshes2;

  var thisMoleculeBodies = cubeNumber === 1 ? atomBodies : atomBodies2;
  var otherMoleculeBodies = cubeNumber === 2 ? atomBodies : atomBodies2;

  var elementPosition = thisMoleculeMeshes[element].position;

  var hydrogen = hydrogensArr[0];
  var hydrogenPosition = otherMoleculeMeshes[hydrogen].position;

  var interactions = cubeNumber === 1 ? interactions2 : interactions1;
  var otherCube = cubeNumber === 1 ? 2 : 1;

  var interactionKey = `${hydrogen}-${element}`;

  // If the element exists returns index of the interaction
  // If not, returns -1
  var interactionIndex = interactions.findIndex(function (interaction) {
    return interaction.key === interactionKey;
  });
  var interactionExists = interactionIndex !== -1;

  var bridgeKey = [...hydrogensArr, ...elementArr].sort().join("");
  var isThereABridge = bridges.includes(bridgeKey);
  var connectorExists = connectors.some(function (connector) {
    return connector.key === bridgeKey;
  });

  var distance = Math.sqrt(
    Math.pow(hydrogenPosition.x - elementPosition.x, 2) +
      Math.pow(hydrogenPosition.y - elementPosition.y, 2) +
      Math.pow(hydrogenPosition.z - elementPosition.z, 2)
  );

  // Should we add/remove the interaction?
  if (distance < minDistance) {
    // Atoms are close but there's no constraint
    if (!interactionExists && !isThereABridge) {
      createInteraction(
        otherCube,
        interactionKey,
        bridgeKey,
        otherMoleculeBodies[hydrogen],
        thisMoleculeBodies[element]
      );
    }
  } else if (interactionExists) {
    removeInteraction(otherCube, interactionIndex, bridgeKey);
  }

  // Should we add/remove the connector
  if (distance < bridgeDist && !connectorExists && interactionExists) {
    addConnector(
      otherMoleculeMeshes[hydrogen],
      thisMoleculeMeshes[element],
      bridgeKey
    );
  }
  if (distance > bridgeDist && connectorExists && interactionExists) {
    removeConnector(bridgeKey);
  }
}

function handleClashesChange(e) {
  isClashingActive = switchClashes.checked;
}

function handleInteractionsChange(e) {
  isInteractionActive = switchInteractions.checked;
}

function handleAniChage(e) {
  isAniActive = switchAni.checked;

  if (!isAniActive) {
    chartContainer.classList.add("hide");
  } else {
    chartContainer.classList.remove("hide");
  }
}

function handleBridgeChange(e) {
  isBridgeActive = switchBridge.checked;
}

function handleMarkerSelection(e) {
  if (e.target.parentElement.id === "marker-1") {
    selectedMarker = 1;
    marker2.classList.remove("selected");
    marker1.classList.add("selected");
  } else {
    selectedMarker = 2;
    marker1.classList.remove("selected");
    marker2.classList.add("selected");
  }
}

function resetMarker1() {
  clearPhysics(atomBodies, constraints);

  atomMeshes.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  clashMeshes.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  sticks.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  atomMeshes = [];
  atomBodies = [];
  atomShapes = [];
  bonds = [];
  constraints = [];
  interactiveAtoms1 = {};
  interactions1 = [];
  atoms = 0;
}

function resetMarker2() {
  clearPhysics(atomBodies2, constraints2);

  atomMeshes2.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  clashMeshes2.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  sticks2.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  atomMeshes2 = [];
  atomBodies2 = [];
  atomShapes2 = [];
  bonds2 = [];
  constraints2 = [];
  interactiveAtoms2 = {};
  interactions2 = [];
  atoms2 = 0;
}

function resetGeneral() {
  connectors.forEach(function (connector) {
    connector.mesh.dispose();
    scene.remove(connector.mesh);
  });
  connectors = [];
  bridges = [];

  temperature = 0;
}

function updateEnergies() {
  counter += 1;

  if (counter === 30) {
    var coordinates2 = [];
    var species2 = [];

    var coordinates1 = atomBodies.map(function (atom) {
      return [
        Math.round(atom.position.x * 100) / 100,
        Math.round(atom.position.y * 100) / 100,
        Math.round(atom.position.z * 100) / 100,
      ];
    });

    var species1 = pdb.elements.map(function (element) {
      if (element === 118) {
        return 1;
      } else if (element === 119) {
        return 6;
      } else if (element === 120) {
        return 7;
      } else if (element === 121) {
        return 8;
      } else {
        return element + 1;
      }
    });

    if (atoms2 > 0) {
      var coordinates2 = atomBodies2.map(function (atom) {
        return [
          Math.round(atom.position.x * 100) / 100,
          Math.round(atom.position.y * 100) / 100,
          Math.round(atom.position.z * 100) / 100,
        ];
      });

      var species2 = pdb2.elements.map(function (element) {
        if (element === 118) {
          return 1;
        } else if (element === 119) {
          return 6;
        } else if (element === 120) {
          return 7;
        } else if (element === 121) {
          return 8;
        } else {
          return element + 1;
        }
      });
    }

    var coordinates = [...coordinates1, ...coordinates2];
    var species = [...species1, ...species2];

    var data1 = {
      coordinates: [coordinates],
      species: [species],
    };

    fetch(" https://molecularweb.epfl.ch/backend2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    })
      .then((response) => response.json())
      .then((ani) => {
        var fuerzas = ani.forces;
        var maxforce = 0;
        for (var i = 0; i < fuerzas.length; i++) {
          if (Math.abs(fuerzas[i][0] > maxforce)) {
            maxforce = Math.abs(fuerzas[i][0]);
          }
          if (Math.abs(fuerzas[i][1] > maxforce)) {
            maxforce = Math.abs(fuerzas[i][1]);
          }
          if (Math.abs(fuerzas[i][2] > maxforce)) {
            maxforce = Math.abs(fuerzas[i][2]);
          }
        }
        //console.log(maxforce)
        if (maxforce < 0.05) {
          var length = data.labels.length;
          if (length >= 30) {
            data.datasets[0].data.shift();
            data.labels.shift();
          }

          plottime++;
          if (plottime > 30) {
            plottime = 0;
          }
          data.labels.push(plottime);
          data.datasets[0].data.push(
            Math.round(ani.energy * 627.509 * 10) / 10
          );

          chart1.update();
        } else {
          temperature = temperature / 2;
          if (temperature < 5 && temperature > 0) temperature = 5;
        }
      });

    counter = 0;
  }
}

function openJme(e) {
  jmeModal.classList.remove("out");
  jmeModal.classList.add("in");
  jmeOverlay.classList.add("active");
}

function closeJme(e) {
  jmeModal.classList.remove("in");
  jmeOverlay.classList.remove("active");
  jmeModal.classList.add("out");
}

function searchMol(e) {
  var string = jmeInput.value;

  if (string.length > 3) {
    jmeSearch.textContent = "Loading...";

    fetch(baseUrl + string + jmeUrl)
      .then((response) => {
        if (response.status === 500) {
          throw new Error("error");
        } else {
          return response.text();
        }
      })
      .then((data) => {
        jsmeApplet.readMolecule(data);
        jmeSearch.disabled = false;
        jmeSearch.textContent = "Search database";
      })
      .catch(function (error) {
        swal(
          "Something went wrong",
          "We could not find your molecule, please try again.",
          "error"
        );
        jmeSearch.disabled = false;
        jmeSearch.textContent = "Search database";
      });
  }
}

function selectMol(e) {
  var data = document.JME.smiles();
  jmeContinue.disabled = true;
  fetch(baseUrl + data + pdbUrl)
    .then((response) => response.text())
    .then((data) => {
      jmeContinue.disabled = false;
      pdbText.value = data;
      closeJme();
    });
}

//  MATRIX OPERATIONS

function multiply(a, b) {
  var aNumRows = a.length,
    aNumCols = a[0].length,
    bNumRows = b.length,
    bNumCols = b[0].length,
    m = new Array(aNumRows); // initialize array of rows
  for (var r = 0; r < aNumRows; ++r) {
    m[r] = new Array(bNumCols); // initialize the current row
    for (var c = 0; c < bNumCols; ++c) {
      m[r][c] = 0; // initialize the current cell
      for (var i = 0; i < aNumCols; ++i) {
        m[r][c] += a[r][i] * b[i][c];
      }
    }
  }
  return m;
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

function resetQ1() {
  Q1 = [];

  atomBodies.forEach(function (body) {
    Q1.push([body.position.x, body.position.y, body.position.z]);
  });

  for (var i = 0; i < atomBodies.length; i++) {
    Qx1 = Qx1 + atomBodies[i].position.x;
    Qy1 = Qy1 + atomBodies[i].position.y;
    Qz1 = Qz1 + atomBodies[i].position.z;
  }

  Qx1 = Qx1 / atomBodies.length;
  Qy1 = Qy1 / atomBodies.length;
  Qz1 = Qz1 / atomBodies.length;

  Q1.forEach(function (point) {
    point[0] = point[0] - Qx1;
    point[1] = point[1] - Qy1;
    point[2] = point[2] - Qz1;
  });
}

function resetQ2() {
  Q2 = [];

  atomBodies2.forEach(function (body) {
    Q2.push([body.position.x, body.position.y, body.position.z]);
  });

  for (var i = 0; i < atomBodies2.length; i++) {
    Qx2 = Qx2 + atomBodies2[i].position.x;
    Qy2 = Qy2 + atomBodies2[i].position.y;
    Qz2 = Qz2 + atomBodies2[i].position.z;
  }

  Qx2 = Qx2 / atomBodies2.length;
  Qy2 = Qy2 / atomBodies2.length;
  Qz2 = Qz2 / atomBodies2.length;

  Q2.forEach(function (point) {
    point[0] = point[0] - Qx2;
    point[1] = point[1] - Qy2;
    point[2] = point[2] - Qz2;
  });
}

function handleCopyCoords() {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  var txt = ""; 
  var num = 0;

  atomBodies.forEach(function (body, index) {
    num++;
    var myIndex = 1;
    var tmpx = body.position.x;
    var tmpy = body.position.y;
    var tmpz = body.position.z;
    var myElement = pdb.elements[index]
    txt = txt + "ATOM " + " ".repeat(6-num.toString().length) + num + "  " + " ".repeat(2-elementNames[myElement].length) + elementNames[myElement] +"  RES" + " ".repeat(6-myIndex.toString().length)+ myIndex + "    " + " ".repeat(8-tmpx.toFixed(3).toString().length) + tmpx.toFixed(3).toString() + " ".repeat(8-tmpy.toFixed(3).toString().length) + tmpy.toFixed(3).toString() + " ".repeat(8-tmpz.toFixed(3).toString().length) + tmpz.toFixed(3).toString() + "  1.00  0.00          " + " ".repeat(2-elementNames[myElement].length) + elementNames[myElement] + "\n"
  })

  atomBodies2.forEach(function (body, index) {
    num++;
    var myIndex = 2;
    var tmpx = body.position.x;
    var tmpy = body.position.y;
    var tmpz = body.position.z;
    var myElement = pdb2.elements[index]
    txt = txt + "ATOM " + " ".repeat(6-num.toString().length) + num + "  " + " ".repeat(2-elementNames[myElement].length) + elementNames[myElement] +"  RES" + " ".repeat(6-myIndex.toString().length)+ myIndex + "    " + " ".repeat(8-tmpx.toFixed(3).toString().length) + tmpx.toFixed(3).toString() + " ".repeat(8-tmpy.toFixed(3).toString().length) + tmpy.toFixed(3).toString() + " ".repeat(8-tmpz.toFixed(3).toString().length) + tmpz.toFixed(3).toString() + "  1.00  0.00          " + " ".repeat(2-elementNames[myElement].length) + elementNames[myElement] + "\n"
  })
 
  dummy.value = txt;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
  snackbar.classList.add("show")
  // After 3 seconds, remove the show class
  setTimeout(function(){
    snackbar.classList.remove("show")
  }, 3000);
}

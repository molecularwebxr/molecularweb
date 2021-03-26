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
var flipGraphics = document.querySelector("flip-graphics");
var flipVideo = document.querySelector("flip-video");
var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
var reset = document.querySelector("reset-activity");
var tempControls = document.querySelectorAll("temp-control");
var stopTemp = document.querySelector("stop-temp");
var playTemp = document.querySelector("play-temp");
var renderType = document.querySelector("render-type-icon");

var temperature = 5;
var high = 100;
var medium = 50;
var low = 10;
var defaultTemp = 200;
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
var hydrogens1 = [];
var oxygens1 = [];
var nitrogens1 = [];
var interactions1 = [];
var atoms = 0;

var atomMeshes2 = [];
var clashMeshes2 = [];
var atomBodies2 = [];
var atomShapes2 = [];
var bonds2 = [];
var sticks2 = [];
var constraints2 = [];
var hydrogens2 = [];
var oxygens2 = [];
var nitrogens2 = [];
var interactions2 = [];
var atoms2 = 0;

var selectedMarker = 1;

var isCube1Visible = false;
var isCube2Visible = false;

var cannonDebugRenderer;

var lastCubeQuaternion = new THREE.Quaternion(0, 0, 0, 1);
var lastCubeQuaternion2 = new THREE.Quaternion(0, 0, 0, 1);
var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 32, 16);
var sphereMaterial = new THREE.MeshLambertMaterial({ color: "yellow" });
var dummy = new THREE.Object3D();

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
  world.step(1 / 600);
  // cannonDebugRenderer.update();
  updateInteractions();
  updatePhysics();
  update();
  render();
}

function updateInteractions() {
  hydrogens1.forEach(function (hydrogensArr) {
    var hydrogen = hydrogensArr[0];
    var hydrogenPosition = atomMeshes[hydrogen].position;

    oxygens2.forEach(function (oxygenArr) {
      var oxygen = oxygenArr[0];
      var oxygenPosition = atomMeshes2[oxygen].position;

      var interactionKey = `${hydrogen}-${oxygen}`;

      // If the element exists returns index of the interaction
      // If not, returns -1
      var interactionIndex = interactions1.findIndex(function (interaction) {
        return interaction.key === interactionKey;
      });
      var interactionExists = interactionIndex !== -1;

      var bridgeKey = [...hydrogensArr, ...oxygenArr].sort().join("");
      var isThereABridge = bridges.includes(bridgeKey);
      var connectorExists = connectors.some(function (connector) {
        return connector.key === bridgeKey
      });

      var distance = Math.sqrt(
        Math.pow(hydrogenPosition.x - oxygenPosition.x, 2) +
          Math.pow(hydrogenPosition.y - oxygenPosition.y, 2) +
          Math.pow(hydrogenPosition.z - oxygenPosition.z, 2)
      );

      if (distance < minDistance) {

        // Atoms are close but there's no constraint
        if (!interactionExists && !isThereABridge) {
          createInteraction(1, interactionKey, bridgeKey, atomBodies[hydrogen], atomBodies2[oxygen]);
          console.log("add " + distance);
        }

      } else if (interactionExists) {
        removeInteraction(1, interactionIndex, bridgeKey);
        console.log("remove " + distance);
      }

      // Should we add/remove the connector
      if ((distance < bridgeDist) && !connectorExists && interactionExists) {
        addConnector(atomMeshes[hydrogen], atomMeshes2[oxygen], bridgeKey);
      }
      if ((distance > bridgeDist) && connectorExists && interactionExists) {
        removeConnector(bridgeKey);
      }
    });

    nitrogens2.forEach(function (nitrogenArr) {
      var nitrogen = nitrogenArr[0];
      var nitrogenPosition = atomMeshes2[nitrogen].position;

      var interactionKey = `${hydrogen}-${nitrogen}`;

      // If the element exists returns index of the interaction
      // If not, returns -1
      var interactionIndex = interactions1.findIndex(function (interaction) {
        return interaction.key === interactionKey;
      });
      var interactionExists = interactionIndex !== -1;

      var bridgeKey = [...hydrogensArr, ...nitrogenArr].sort().join("");
      var isThereABridge = bridges.includes(bridgeKey);
      var connectorExists = connectors.some(function (connector) {
        return connector.key === bridgeKey
      });

      var distance = Math.sqrt(
        Math.pow(hydrogenPosition.x - nitrogenPosition.x, 2) +
          Math.pow(hydrogenPosition.y - nitrogenPosition.y, 2) +
          Math.pow(hydrogenPosition.z - nitrogenPosition.z, 2)
      );

      if (distance < minDistance) {

        // Atoms are close but there's no constraint
        if (!interactionExists && !isThereABridge) {
          createInteraction(1, interactionKey, bridgeKey, atomBodies[hydrogen], atomBodies2[nitrogen]);
          console.log("add " + distance);
        }

      } else if (interactionExists) {
        removeInteraction(1, interactionIndex, bridgeKey);
        console.log("remove " + distance);
      }

      // Should we add/remove the connector
      if ((distance < bridgeDist) && !connectorExists && interactionExists) {
        addConnector(atomMeshes[hydrogen], atomMeshes2[nitrogen], bridgeKey);
      }
      if ((distance > bridgeDist) && connectorExists && interactionExists) {
        removeConnector(bridgeKey);
      }
    });
  });

  hydrogens2.forEach(function (hydrogensArr) {
    var hydrogen = hydrogensArr[0];
    var hydrogenPosition = atomMeshes2[hydrogen].position;

    oxygens1.forEach(function (oxygenArr) {
      var oxygen = oxygenArr[0];
      var oxygenPosition = atomMeshes[oxygen].position;
      var interactionKey = `${hydrogen}-${oxygen}`;

      // If the element exists returns index of the interaction
      // If not, returns -1
      var interactionIndex = interactions2.findIndex(function (interaction) {
        return interaction.key === interactionKey;
      });
      var interactionExists = interactionIndex !== -1;

      var bridgeKey = [...hydrogensArr, ...oxygenArr].sort().join("");
      var isThereABridge = bridges.includes(bridgeKey);
      var connectorExists = connectors.some(function (connector) {
        return connector.key === bridgeKey
      });

      var distance = Math.sqrt(
        Math.pow(hydrogenPosition.x - oxygenPosition.x, 2) +
          Math.pow(hydrogenPosition.y - oxygenPosition.y, 2) +
          Math.pow(hydrogenPosition.z - oxygenPosition.z, 2)
      );

      if (distance < minDistance) {

        // Atoms are close but there's no constraint
        if (!interactionExists && !isThereABridge) {
          createInteraction(2, interactionKey, bridgeKey, atomBodies2[hydrogen], atomBodies[oxygen]);
          console.log("add " + distance);
        }

      } else if (interactionExists) {
        removeInteraction(2, interactionIndex, bridgeKey);
        console.log("remove " + distance);
      }

      // Should we add/remove the connector
      if ((distance < bridgeDist) && !connectorExists && interactionExists) {
        addConnector(atomMeshes2[hydrogen], atomMeshes[oxygen], bridgeKey);
      }
      if ((distance > bridgeDist) && connectorExists && interactionExists) {
        removeConnector(bridgeKey);
      }
    });

    nitrogens1.forEach(function (nitrogenArr) {
      var nitrogen = nitrogenArr[0];
      var nitrogenPosition = atomMeshes[nitrogen].position;
      var interactionKey = `${hydrogen}-${nitrogen}`;

      // If the element exists returns index of the interaction
      // If not, returns -1
      var interactionIndex = interactions2.findIndex(function (interaction) {
        return interaction.key === interactionKey;
      });
      var interactionExists = interactionIndex !== -1;

      var bridgeKey = [...hydrogensArr, ...nitrogenArr].sort().join("");
      var isThereABridge = bridges.includes(bridgeKey);
      var connectorExists = connectors.some(function (connector) {
        return connector.key === bridgeKey
      });

      var distance = Math.sqrt(
        Math.pow(hydrogenPosition.x - nitrogenPosition.x, 2) +
          Math.pow(hydrogenPosition.y - nitrogenPosition.y, 2) +
          Math.pow(hydrogenPosition.z - nitrogenPosition.z, 2)
      );

      if (distance < minDistance) {

        // Atoms are close but there's no constraint
        if (!interactionExists && !isThereABridge) {
          createInteraction(2, interactionKey, bridgeKey, atomBodies2[hydrogen], atomBodies[nitrogen]);
          console.log("add " + distance);
        }

      } else if (interactionExists) {
        removeInteraction(2, interactionIndex, bridgeKey);
        console.log("remove " + distance);
      }

      // Should we add/remove the connector
      if ((distance < bridgeDist) && !connectorExists && interactionExists) {
        addConnector(atomMeshes2[hydrogen], atomMeshes[nitrogen], bridgeKey);
      }
      if ((distance > bridgeDist) && connectorExists && interactionExists) {
        removeConnector(bridgeKey);
      }
    });
  });

  updateConnectors();
  updateClashes();
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

  if (isCube1Visible) {
    for (var i = 0; i < atoms; i++) {
      mediax = mediax + atomBodies[i].position.x;
      mediay = mediay + atomBodies[i].position.y;
      mediaz = mediaz + atomBodies[i].position.z;
    }
  
    mediax = mediax / atoms;
    mediay = mediay / atoms;
    mediaz = mediaz / atoms;

    for (var i = 0; i < atoms; i++) {
      atomBodies[i].position.x =
        atomBodies[i].position.x + cubePosition.x - mediax;
      atomBodies[i].position.y =
        atomBodies[i].position.y + cubePosition.y - mediay;
      atomBodies[i].position.z =
        atomBodies[i].position.z + cubePosition.z - mediaz;
    }
  }

  var q = new THREE.Quaternion();
  var inverse1 = new THREE.Quaternion();
  inverse1.copy(lastCubeQuaternion).invert();

  q.multiplyQuaternions(cubeQuaternion, inverse1);

  rotateBodies(
    atomBodies,
    q,
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

  if (isCube2Visible) {
    for (var i = 0; i < atoms2; i++) {
      mediax2 = mediax2 + atomBodies2[i].position.x;
      mediay2 = mediay2 + atomBodies2[i].position.y;
      mediaz2 = mediaz2 + atomBodies2[i].position.z;
    }
  
    mediax2 = mediax2 / atoms2;
    mediay2 = mediay2 / atoms2;
    mediaz2 = mediaz2 / atoms2;
  
    for (var i = 0; i < atoms2; i++) {
      atomBodies2[i].position.x =
        atomBodies2[i].position.x + cubePosition2.x - mediax2;
      atomBodies2[i].position.y =
        atomBodies2[i].position.y + cubePosition2.y - mediay2;
      atomBodies2[i].position.z =
        atomBodies2[i].position.z + cubePosition2.z - mediaz2;
    }
  }

  var q2 = new THREE.Quaternion();
  var inverse2 = new THREE.Quaternion();
  inverse2.copy(lastCubeQuaternion2).invert();

  q2.multiplyQuaternions(cubeQuaternion2, inverse2);

  rotateBodies(
    atomBodies2,
    q2,
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
    pdb = setupPdb(rawPdb);
    atoms = pdb.atoms;

    clearPhysics(atomBodies, constraints);

    console.time("VMK");

    [atomShapes, atomMeshes, clashMeshes, atomBodies] = createSpheres(
      pdb,
      renderType.isActive
    );

    atomMeshes.forEach(function (sphere, index) {
      scene.add(sphere);
      scene.add(clashMeshes[index]);
    });

    atomBodies.forEach(function (sphere) {
      world.addBody(sphere);
    });

    [
      sticks,
      bonds,
      oxygens1,
      nitrogens1,
      hydrogens1,
      constraints,
    ] = createSticks(pdb, atomBodies);
    console.log(hydrogens1);

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
  } else {
    pdb2 = setupPdb(rawPdb);
    atoms2 = pdb2.atoms;

    clearPhysics(atomBodies2, constraints2);

    console.time("VMK");

    [atomShapes2, atomMeshes2, clashMeshes2, atomBodies2] = createSpheres(
      pdb2,
      renderType.isActive
    );

    atomMeshes2.forEach(function (sphere, index) {
      scene.add(sphere);
      scene.add(clashMeshes2[index]);
    });

    atomBodies2.forEach(function (sphere) {
      world.addBody(sphere);
    });

    [
      sticks2,
      bonds2,
      oxygens2,
      nitrogens2,
      hydrogens2,
      constraints2,
    ] = createSticks(pdb2, atomBodies2);

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
  atomBodies.forEach(function (body) {
    body.position.x = -body.position.x;
  });

  atomBodies2.forEach(function (body) {
    body.position.x = -body.position.x;
  });
}

function handleScale(e) {
  if (e.detail === "up") {
    camera.position.z -= 0.8;
  } else {
    camera.position.z += 0.8;
  }
}

function handleReset(e) {
  clearPhysics(atomBodies, constraints);
  clearPhysics(atomBodies2, constraints2);

  atomMeshes.forEach(function (mesh) {
    scene.remove(mesh);
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) mesh.material.dispose();
    if (mesh.texture) mesh.texture.dispose();
  });

  atomMeshes2.forEach(function (mesh) {
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

  sticks2.forEach(function (mesh) {
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
  hydrogens1 = [];
  oxygens1 = [];
  nitrogens1 = [];
  interactions1 = [];
  atoms = 0;

  atomMeshes2 = [];
  atomBodies2 = [];
  atomShapes2 = [];
  bonds2 = [];
  constraints2 = [];
  hydrogens2 = [];
  oxygens2 = [];
  nitrogens2 = [];
  interactions2 = [];
  atoms2 = 0;

  temperature = 0;
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
  renderType.isActive = !renderType.isActive;

  if (!renderType.isActive) {
    sticks.forEach(function (bond) {
      bond.visible = false;
    });

    sticks2.forEach(function (bond) {
      bond.visible = false;
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
    sticks.forEach(function (bond) {
      bond.visible = true;
    });

    sticks2.forEach(function (bond) {
      bond.visible = true;
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
  var mesh = new THREE.InstancedMesh(
    sphereGeometry,
    sphereMaterial,
    9
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  scene.add(mesh);
  connectors.push({meshA, meshB, mesh, key: bridgeKey});
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
    connector.mesh.instanceMatrix.needsUpdate = true
  });
}

function updateClashes() {
  for (let i = 0; i < atoms; i++) {
    var atomPosition = atomMeshes[i].position;
    var isAtom1Clashing = false;
    for (let j = 0; j < atoms2; j++) {
      var atomPosition2 = atomMeshes2[j].position;
      var isAtom2Clashing = false;

      var distance = Math.sqrt(
        Math.pow(atomPosition.x - atomPosition2.x, 2) +
          Math.pow(atomPosition.y - atomPosition2.y, 2) +
          Math.pow(atomPosition.z - atomPosition2.z, 2)
      );

      if (distance < 2) {
        var isAtom1Clashing = true;
        var isAtom2Clashing = true;
      }
      clashMeshes2[j].visible = isAtom2Clashing;
    }
    clashMeshes[i].visible = isAtom1Clashing;
  }
}
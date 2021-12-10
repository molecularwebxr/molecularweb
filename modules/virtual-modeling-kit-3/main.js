import * as CANNON from "/lib/cannon-es.js";
import {
  setupPdb,
  createSpheres,
  createSticks,
  radiusfactor1,
  radiusfactor2,
  getAngle,
} from "./3Dutils.js";
import { OrbitControls } from "/lib/utils/OrbitControls.js";

var scene, camera, renderer;
var arToolkitSource, arToolkitContext;
var patternArray, markerRootArray, markerGroupArray;
var patternArray2, markerRootArray2, markerGroupArray2;
var sceneGroup;
var sceneGroup2;
var controls;
var planeMesh; 

var pdbs = [];

var addMolecule = document.getElementById("add-molecule");
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
var switchSpheres1 = document.getElementById("switch-spheres-1");
var switchGravity = document.getElementById("switch-gravity");
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
var gravity = 0;
var MAX_GRAVITY = -50;
var STEP  = 1 / 60;
var angleLimit = 140;
var bridges = [];
var connectors = [];
var constraints = [];
var counter  = 0;

var isClashingActive = false;
var isInteractionActive = false;
var isBridgeActive = false;
var isAniActive = false;

// var cannonDebugRenderer;

var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 32, 16);
var sphereMaterial = new THREE.MeshLambertMaterial({ color: "yellow" });
var dummy = new THREE.Object3D();

addMolecule.addEventListener("click", handleClick);
copyCoords.addEventListener("click", handleCopyCoords);
scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
reset.addEventListener("resetActivity", handleReset);
stopTemp.addEventListener("stopTemp", handleStopTemp);
playTemp.addEventListener("playTemp", handlePlayTemp);
switchClashes.addEventListener("change", handleClashesChange);
switchInteractions.addEventListener("change", handleInteractionsChange);
switchBridge.addEventListener("change", handleBridgeChange);
switchSpheres1.addEventListener("change", handleRenderType);
switchGravity.addEventListener("change", handleGravityChange);
jmeBtn.addEventListener("click", openJme);
jmeBtnClose.addEventListener("click", closeJme);
jmeSearch.addEventListener("click", searchMol);
jmeCancel.addEventListener("click", closeJme);
jmeContinue.addEventListener("click", selectMol);
switchAni.addEventListener("change", handleAniChage);
tempControls.forEach(function (item) {
  item.addEventListener("updateTemp", handleTempControls);
});

var world = new CANNON.World({
  gravity: new CANNON.Vec3(0, gravity, 0)
});

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
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.75, -7);
  controls.enableDamping = true;

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
  sceneGroup.scale.set(1.25 / 2, 1.25 / 2, 1.25 / 2);
  sceneGroup2 = new THREE.Group();
  sceneGroup2.scale.set(1.25 / 2, 1.25 / 2, 1.25 / 2);

  // Lights

  var pointLight1 = new THREE.PointLight(0xffffff, 1, 50);
  pointLight1.position.set(0.5, 3, 2);
  var pointLight2 = new THREE.PointLight(0xffffff, 1, 50);
  pointLight2.position.set(0.5, 3, -18);
  scene.add(pointLight1, pointLight2);

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

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

  // cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

  // Plane -x
  var planeShapeXmin = new CANNON.Plane();
  var planeXmin = new CANNON.Body({ mass: 0 });
  planeXmin.addShape(planeShapeXmin);
  planeXmin.quaternion.setFromEuler(0, Math.PI / 2, 0);
  planeXmin.position.set(-10, 0, -9);
  world.addBody(planeXmin);

  // Plane +x
  var planeShapeXmax = new CANNON.Plane();
  var planeXmax = new CANNON.Body({ mass: 0 });
  planeXmax.addShape(planeShapeXmax);
  planeXmax.quaternion.setFromEuler(0, -Math.PI / 2, 0);
  planeXmax.position.set(10, 0, -9);
  world.addBody(planeXmax);

  // Plane -z
  var planeShapeZmin = new CANNON.Plane();
  var planeZmin = new CANNON.Body({ mass: 0 });
  planeZmin.addShape(planeShapeZmin);
  planeZmin.quaternion.setFromEuler(0, -Math.PI, 0);
  planeZmin.position.set(0, 0, 0);
  world.addBody(planeZmin);

  // Plane +z
  var planeShapeZmax = new CANNON.Plane();
  var planeZmax = new CANNON.Body({ mass: 0 });
  planeZmax.addShape(planeShapeZmax);
  planeZmax.quaternion.setFromEuler(0, 0, 0);
  planeZmax.position.set(0, 0, -24);
  world.addBody(planeZmax);

  // Plane -y
  var planeShapeYmin = new CANNON.Plane();
  var planeYmin = new CANNON.Body({ mass: 0 });
  planeYmin.addShape(planeShapeYmin);
  planeYmin.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  planeYmin.position.set(0, -20, -9);
  world.addBody(planeYmin);

  var planeGeometry = new THREE.BoxGeometry(20, 0.5, 24, 5, 1, 5);
  var planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true,
  });
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.position.set(0, -20, -10);
  planeMesh.visible = false;
  scene.add(planeMesh);

  // Plane +y
  var planeShapeYmax = new CANNON.Plane();
  var planeYmax = new CANNON.Body({ mass: 0 });
  planeYmax.addShape(planeShapeYmax);
  planeYmax.quaternion.setFromEuler(Math.PI / 2, 0, 0);
  planeYmax.position.set(0, 20, -9);
  world.addBody(planeYmax);
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
  controls.update();
  requestAnimationFrame(animate);
  world.step(STEP);
  // cannonDebugRenderer.update();

  updateInteractions();

  updatePhysics();

  if(pdbs.length > 0 && isAniActive) {
    updateEnergies();
  }

  update();
  render();
}

function updateInteractions() {
  pdbs.forEach(function (pdb, index1, pdbsArray) {
    pdb.interactiveAtoms.hydrogen.forEach(function (hydrogensArr) {
      pdbsArray.forEach(function (otherPdb, index2) {
        // if (index1 === index2) {
        //   return;
        // }

        otherPdb.interactiveAtoms.oxygen.forEach(function (oxygenArr) {
          handleInteraction(oxygenArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.nitrogen.forEach(function (nitrogenArr) {
          handleInteraction(nitrogenArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.fluor.forEach(function (fluorArr) {
          handleInteraction(fluorArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.sulfur.forEach(function (sulfurArr) {
          handleInteraction(sulfurArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.chlorine.forEach(function (chlorineArr) {
          handleInteraction(chlorineArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.bromine.forEach(function (bromineArr) {
          handleInteraction(bromineArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.iodine.forEach(function (iodineArr) {
          handleInteraction(iodineArr, hydrogensArr, index2, index1);
        });
      });
    });
  });


  if (!isInteractionActive) {
    pdbs.forEach(function (pdb) {
      pdb.interactions.forEach(function (interaction) {
        interaction.constraint.disable();
      });
    });
  } else {
    pdbs.forEach(function (pdb) {
      pdb.interactions.forEach(function (interaction) {
        interaction.constraint.enable();
      });
    });
  }

  updateConnectors();

  updateClashes();
}

function updatePhysics() {
  pdbs.forEach(function (pdb) {
    var velsum = 0;
    var mediax = 0;
    var mediay = 0;
    var mediaz = 0;
    var velsum_expected = Math.sqrt(temperature) * pdb.atoms;

    // if(!switchGravity.checked) {
      for (var i = 0; i < pdb.atoms; i++) {
        pdb.atomBodies[i].velocity.x =
          pdb.atomBodies[i].velocity.x + 10 * Math.random(1) - 5;
        pdb.atomBodies[i].velocity.y =
          pdb.atomBodies[i].velocity.y + 10 * Math.random(1) - 5;
        pdb.atomBodies[i].velocity.z =
          pdb.atomBodies[i].velocity.z + 10 * Math.random(1) - 5;
  
        velsum =
          velsum +
          Math.sqrt(
            Math.pow(pdb.atomBodies[i].velocity.x, 2) +
              Math.pow(pdb.atomBodies[i].velocity.y, 2) +
              Math.pow(pdb.atomBodies[i].velocity.z, 2)
          );
      }
  
      for (var i = 0; i < pdb.atoms; i++) {
        pdb.atomBodies[i].velocity.x =
          (pdb.atomBodies[i].velocity.x / velsum) * velsum_expected;
        pdb.atomBodies[i].velocity.y =
          (pdb.atomBodies[i].velocity.y / velsum) * velsum_expected;
        pdb.atomBodies[i].velocity.z =
          (pdb.atomBodies[i].velocity.z / velsum) * velsum_expected;
      }
    // }


    for (var i = 0; i < pdb.atoms; i++) {
      pdb.atomMeshes[i].position.x = pdb.atomBodies[i].position.x;
      pdb.atomMeshes[i].position.y = pdb.atomBodies[i].position.y;
      pdb.atomMeshes[i].position.z = pdb.atomBodies[i].position.z;

      pdb.clashMeshes[i].position.x = pdb.atomBodies[i].position.x;
      pdb.clashMeshes[i].position.y = pdb.atomBodies[i].position.y;
      pdb.clashMeshes[i].position.z = pdb.atomBodies[i].position.z;
    }

    pdb.bonds.forEach(function (bond) {
      var B = new THREE.Vector3(
        pdb.atomMeshes[bond.atomA].position.x,
        pdb.atomMeshes[bond.atomA].position.y,
        pdb.atomMeshes[bond.atomA].position.z
      );

      var A = new THREE.Vector3(
        pdb.atomMeshes[bond.atomA].position.x / 2 +
          pdb.atomMeshes[bond.atomB].position.x / 2,
        pdb.atomMeshes[bond.atomA].position.y / 2 +
          pdb.atomMeshes[bond.atomB].position.y / 2,
        pdb.atomMeshes[bond.atomA].position.z / 2 +
          pdb.atomMeshes[bond.atomB].position.z / 2
      );

      var C = new THREE.Vector3(
        pdb.atomMeshes[bond.atomA].position.x / 2 +
          pdb.atomMeshes[bond.atomB].position.x / 2,
        pdb.atomMeshes[bond.atomA].position.y / 2 +
          pdb.atomMeshes[bond.atomB].position.y / 2,
        pdb.atomMeshes[bond.atomA].position.z / 2 +
          pdb.atomMeshes[bond.atomB].position.z / 2
      );
      var D = new THREE.Vector3(
        pdb.atomMeshes[bond.atomB].position.x,
        pdb.atomMeshes[bond.atomB].position.y,
        pdb.atomMeshes[bond.atomB].position.z
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
  });
}

function loadPdb(rawPdb) {
  var newPdb = setupPdb(rawPdb);

  console.time("VMK");

  [
    newPdb.atomShapes,
    newPdb.atomMeshes,
    newPdb.clashMeshes,
    newPdb.atomBodies,
  ] = createSpheres(newPdb);

  newPdb.atomMeshes.forEach(function (sphere, index) {
    scene.add(sphere);
    scene.add(newPdb.clashMeshes[index]);
  });

  newPdb.atomBodies.forEach(function (sphere) {
    world.addBody(sphere);
  });

  [newPdb.sticks, newPdb.bonds, newPdb.interactiveAtoms, newPdb.constraints] =
    createSticks(newPdb, newPdb.atomBodies);

  newPdb.sticks.forEach(function (stick) {
    scene.add(stick);
  });

  newPdb.constraints.forEach(function (constraint) {
    world.addConstraint(constraint);
  });

  console.timeEnd("VMK");
  if (window.innerWidth >= 768) {
    newPdb.atomBodies.forEach(function (body) {
      body.position.x = -body.position.x;
    });
  }

  pdbs.push(newPdb);
  switchSpheres1.disabled = false;
  handleRenderType();
}

function clearPhysics() {
  var cs = world.constraints;

  for (var i = cs.length - 1; i >= 0; i--) {
    world.removeConstraint(constraints[i]);
  }
}

function handleClick(e) {
  var pdbInserted = pdbText.value;

  if (pdbInserted.length > 0) {
    loadPdb(pdbInserted);
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

  clearPhysics();

  connectors.forEach(function (connector) {
    connector.mesh.dispose();
    scene.remove(connector.mesh);
  });


  pdbs.forEach(function (pdb, index) {
    pdb.atomMeshes.forEach(function (mesh, atomIndex) {
      mesh.geometry.dispose();
      mesh.material.dispose();
      scene.remove(mesh);
      world.removeBody(pdb.atomBodies[atomIndex]);
    });

    pdb.sticks.forEach(function (bond) {
      bond.geometry.dispose();
      bond.material.dispose();
      scene.remove(bond);
    });

    pdb.clashMeshes.forEach(function (mesh) {
      mesh.geometry.dispose();
      mesh.material.dispose();
      scene.remove(mesh);
    });
  });

  connectors = [];
  bridges = [];
  temperature = 0;
  pdbs = [];

  switchSpheres1.disabled = true;

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
  var isChecked = switchSpheres1.checked;

  if (isChecked) {
    pdbs.forEach(function (pdb) {
      pdb.sticks.forEach(function (bond) {
        bond.visible = false;
      });
      pdb.atomMeshes.forEach(function (atom, index) {
        var scale = radiusfactor2 * elementradii[pdb.elements[index]];
        atom.scale.setScalar(scale);
      });
    });
  } else {
    pdbs.forEach(function (pdb) {
      pdb.sticks.forEach(function (bond) {
        bond.visible = true;
      });
      pdb.atomMeshes.forEach(function (atom, index) {
        var scale = radiusfactor1 * elementradii[pdb.elements[index]];
        atom.scale.setScalar(scale);
      });
    });
  }
}

function createInteraction(hIndex, interactionKey, bridgeKey, bodyA, bodyB) {
  var interactionsArr = pdbs[hIndex].interactions;
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

function removeInteraction(hIndex, interactionIndex, bridgeKey) {
  var interactionsArr = pdbs[hIndex].interactions;
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
    pdbs.forEach(function (pdb) {
      pdb.clashMeshes.forEach(function (mesh) {
        mesh.visible = false;
      });
    });
    return;
  }

  pdbs.forEach(function (pdb, pdbIndex) {
    pdb.atomMeshes.forEach(function (atomMesh, index1) {
      var atomPosition = atomMesh.position;
      var element1 = pdb.elements[index1];
      var isAtomClashing = false;
      pdbs.forEach(function (otherPdb, otherPdbIndex) {
        otherPdb.atomMeshes.forEach(function (otherMesh, index2) {
          if (pdbIndex === otherPdbIndex) {
            return;
          }
          var atomPosition2 = otherMesh.position;
          var element2 = otherPdb.elements[index2];

          var distance = Math.sqrt(
            Math.pow(atomPosition.x - atomPosition2.x, 2) +
              Math.pow(atomPosition.y - atomPosition2.y, 2) +
              Math.pow(atomPosition.z - atomPosition2.z, 2)
          );
          var cutOff = elementradii[element1] + elementradii[element2];

          if (distance < cutOff * 1.2) {
            isAtomClashing = true;
            return;
          }
        });
      });
      pdb.clashMeshes[index1].visible = isAtomClashing;
    });
  });
}

// This function handle the interaction of an element with H
// elementArr is the array of interacive atoms of a certain element
// elementIndex is the index of the molecule where this element belog in PDBS array
// hydrogenIndex is the index of the molecule where H belongs in PDBS array
function handleInteraction(elementArr, hydrogensArr, elementIndex, hIndex) {
  var element = elementArr[0];

  var thisMoleculeMeshes = pdbs[elementIndex].atomMeshes;
  var otherMoleculeMeshes = pdbs[hIndex].atomMeshes;

  var thisMoleculeBodies = pdbs[elementIndex].atomBodies;
  var otherMoleculeBodies = pdbs[hIndex].atomBodies;

  var elementPosition = thisMoleculeMeshes[element].position;

  var hydrogen = hydrogensArr[0];
  var hydrogenPosition = otherMoleculeMeshes[hydrogen].position;
  // This is the element bonded to H 
  var bondedElement = hydrogensArr[1];
  var bondedElementPosition = otherMoleculeMeshes[bondedElement].position;

  var interactions = pdbs[hIndex].interactions;

  // var interactions = cubeNumber === 1 ? interactions2 : interactions1;
  // var otherCube = cubeNumber === 1 ? 2 : 1;

  var interactionKey = `${hIndex}-${hydrogen}-${elementIndex}-${element}`;

  // // If the element exists returns index of the interaction
  // // If not, returns -1
  var interactionIndex = interactions.findIndex(function (interaction) {
    return interaction.key === interactionKey;
  });
  var interactionExists = interactionIndex !== -1;

  var bridgeKey = [...hydrogensArr, ...elementArr, hIndex, elementIndex].sort().join("-"); //tengo que agregar los keys de las moleculas!!
  var isThereABridge = bridges.includes(bridgeKey);
  var connectorExists = connectors.some(function (connector) {
    return connector.key === bridgeKey;
  });


  var distance = Math.sqrt(
    Math.pow(hydrogenPosition.x - elementPosition.x, 2) +
      Math.pow(hydrogenPosition.y - elementPosition.y, 2) +
      Math.pow(hydrogenPosition.z - elementPosition.z, 2)
  );

  var angle = getAngle(elementPosition, hydrogenPosition, bondedElementPosition);

  // Should we add/remove the interaction?
  if (distance < minDistance && angle > angleLimit) {
    // Atoms are close but there's no constraint
    if (!interactionExists && !isThereABridge) {
      // console.log("Create interaction " + interactionKey + " Angle: " + angle);
      createInteraction(
        hIndex,
        interactionKey,
        bridgeKey,
        otherMoleculeBodies[hydrogen],
        thisMoleculeBodies[element]
      );
    }
  } else if (interactionExists && angle < (angleLimit - 10)) {
    // console.log("Remove interaction " + interactionKey + " Angle: " + angle)
    removeInteraction(hIndex, interactionIndex, bridgeKey);
  }

  // Should we add/remove the connector
  if (distance < bridgeDist && !connectorExists && interactionExists && angle > angleLimit) {
    // console.log("H bond at " + angle)
    addConnector(
      otherMoleculeMeshes[hydrogen],
      thisMoleculeMeshes[element],
      bridgeKey
    );
  } else if ((distance > bridgeDist || angle < (angleLimit - 10)) && connectorExists && interactionExists) {
    removeConnector(bridgeKey);
  }
}

function handleClashesChange(e) {
  isClashingActive = switchClashes.checked;
}

function handleInteractionsChange(e) {
  isInteractionActive = switchInteractions.checked;
}

function handleBridgeChange(e) {
  isBridgeActive = switchBridge.checked;
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
    jmeSearch.disabled = true;
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
        swal("Something went wrong", "We could not find your molecule, please try again.", "error");
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

function handleGravityChange(e) {
  var isChecked = switchGravity.checked;
  if(isChecked) {
    gravity = MAX_GRAVITY;
    planeMesh.visible = true;
  } else {
    gravity = 0;
    planeMesh.visible = false;
  }

  updateGravity();
}

function updateGravity() {
  world.gravity = new CANNON.Vec3(0, gravity, 0)
}

function handleAniChage(e) {
  isAniActive = switchAni.checked;

  if (!isAniActive) {
    chartContainer.classList.add("hide");
  } else {
    chartContainer.classList.remove("hide");
  }
}

function updateEnergies() {
  counter += 1;

  if (counter === 30) {
    var coordinates = [];
    var species = [];

    pdbs.forEach(function (pdb) {
      var coordinates1 = pdb.atomBodies.map(function (atom) {
        return [
          Math.round(atom.position.x * 100) / 100,
          Math.round(atom.position.y * 100) / 100,
          Math.round(atom.position.z * 100) / 100,
        ];
      });
      coordinates = [...coordinates, ...coordinates1];

      var species1 = pdb.elements.map(function (element) {
        if (element === 118) {
          return 1;
        } else if(element === 119) {
          return 6;
        } else if(element === 120) {
          return 7;
        } else if(element === 121) {
          return 8;
        } else {
          return element + 1;
        }
      });

      species = [...species, ...species1];
    });

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
          if(temperature < 5 && temperature > 0) temperature = 5;
        }
      });

    counter = 0;
  }
}

function handleCopyCoords() {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  var txt = ""; 
  var num = 0;
  pdbs.forEach(function (pdb, index) {
    var myIndex = index + 1;
    for (var i = 0; i < pdb.atoms; i++) {
      num++
      var tmpx = pdb.atomBodies[i].position.x;
      var tmpy = pdb.atomBodies[i].position.y;
      var tmpz = pdb.atomBodies[i].position.z;
      var myElement = pdb.elements[i]
      txt = txt + "ATOM " + " ".repeat(6-num.toString().length) + num + "  " + " ".repeat(2-elementNames[myElement].length) + elementNames[myElement] +"  RES" + " ".repeat(6-myIndex.toString().length)+ myIndex + "    " + " ".repeat(8-tmpx.toFixed(3).toString().length) + tmpx.toFixed(3).toString() + " ".repeat(8-tmpy.toFixed(3).toString().length) + tmpy.toFixed(3).toString() + " ".repeat(8-tmpz.toFixed(3).toString().length) + tmpz.toFixed(3).toString() + "  1.00  0.00          " + " ".repeat(2-elementNames[myElement].length) + elementNames[myElement] + "\n"
    }
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

import * as CANNON from "/lib/cannon-es.js";
import {
  setupPdb,
  clearGroup,
  createSpheres,
  createSticks,
  radiusfactor1,
  radiusfactor2,
} from "./3Dutils.js";
import { OrbitControls } from "/lib/utils/OrbitControls.js";

var scene, camera, renderer;
var arToolkitSource, arToolkitContext;
var patternArray, markerRootArray, markerGroupArray;
var patternArray2, markerRootArray2, markerGroupArray2;
var sceneGroup;
var sceneGroup2;
var pdb, pdb2;
var controls;

var pdbs = [];

var addMolecule = document.getElementById("add-molecule");
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
var jmeBtn = document.getElementById("jme-btn");
var jmeBtnClose = document.getElementById("jsme-btn-close");
var jmeModal = document.getElementById("jsme-container");
var jmeOverlay = document.getElementById("jme-overlay");
var jmeInput = document.getElementById("jme-input");
var jmeSearch = document.getElementById("jme-search");
var jmeCancel = document.getElementById("jme-cancel");
var jmeContinue = document.getElementById("jme-continue");

var baseUrl = "https://cactus.nci.nih.gov/chemical/structure/";
var pdbUrl = "/file?format=pdb&get3d=true";
var jmeUrl = "/file?format=jme";

var temperature = 0;
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

var isCube1Visible = false;
var isCube2Visible = false;

var isClashingActive = false;
var isInteractionActive = false;
var isBridgeActive = false;

var cannonDebugRenderer;

var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 32, 16);
var sphereMaterial = new THREE.MeshLambertMaterial({ color: "yellow" });
var sphereMaterial2 = new THREE.MeshLambertMaterial({ color: "green" });
var dummy = new THREE.Object3D();

var spheres = [];
var constraintKeys = [];

addMolecule.addEventListener("click", handleClick);
flipVideo.addEventListener("flipCamera", handleFlip);
scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
reset.addEventListener("resetActivity", handleReset);
stopTemp.addEventListener("stopTemp", handleStopTemp);
playTemp.addEventListener("playTemp", handlePlayTemp);
switchClashes.addEventListener("change", handleClashesChange);
switchInteractions.addEventListener("change", handleInteractionsChange);
switchBridge.addEventListener("change", handleBridgeChange);
switchSpheres1.addEventListener("change", handleRenderType);
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
  console.log(constraintKeys);
  console.log("ID: ", e.detail.id);
  if (e.detail.id < 6) {
    isCube1Visible = false;
    // spheres.forEach(function (sphere, index) {
    //   if (index <= 1) {
    //     if (sphere.constraint !== null) {
    //       world.removeConstraint(sphere.constraint.cannonConstraint);
    //       sphere.constraint.mesh.dispose();
    //       scene.remove(sphere.constraint.mesh);
    //       var keyIndex = constraintKeys.findIndex(function (key) {
    //         return key === sphere.constraint.key;
    //       });
    //       console.log(keyIndex)
    //       constraintKeys.splice(keyIndex, 1);
    //       sphere.constraint = null;
    //     }
    //   }
    // });
  }
  if (e.detail.id > 5) {
    isCube2Visible = false;
    spheres.forEach(function (sphere, index) {
      // if (index > 1) {
      //   if (sphere.constraint !== null) {
      //     world.removeConstraint(sphere.constraint.cannonConstraint);
      //     sphere.constraint.mesh.dispose();
      //     scene.remove(sphere.constraint.mesh);
      //     var keyIndex = constraintKeys.findIndex(function (key) {
      //       return key === sphere.constraint.key;
      //     });
      //     constraintKeys.splice(keyIndex, 1);
      //     sphere.constraint = null;
      //   }
      // }
    });
  }
  console.log(constraintKeys);
});

var world = new CANNON.World({
  gravity: new CANNON.Vec3(0, 0, 0)
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

  var sphereGeometry = new THREE.SphereBufferGeometry(0.5, 32, 16);
  var sphereNormalMaterial = new THREE.MeshNormalMaterial();
  var sphereShape = new CANNON.Sphere(0.25);

  var sphere1 = new THREE.Mesh(sphereGeometry, sphereNormalMaterial);
  sphere1.position.set(-0.7, 0, 0);
  var sphereBody1 = new CANNON.Body({
    mass: 0,
    shape: sphereShape,
  });

  sceneGroup.add(sphere1);
  sphereBody1.position.copy(sphere1.position);
  world.addBody(sphereBody1);
  spheres.push({
    mesh: sphere1,
    body: sphereBody1,
    constraint: null,
  });

  var sphere2 = new THREE.Mesh(sphereGeometry, sphereNormalMaterial);
  sphere2.position.set(0.7, 0, 0);
  var sphereBody2 = new CANNON.Body({
    mass: 0,
    shape: sphereShape,
  });

  sceneGroup.add(sphere2);
  sphereBody2.position.copy(sphere2.position);
  world.addBody(sphereBody2);
  spheres.push({
    mesh: sphere2,
    body: sphereBody2,
    constraint: null,
  });

  var sphere3 = new THREE.Mesh(sphereGeometry, sphereNormalMaterial);
  sphere3.position.set(-0.7, 0, 0);
  var sphereBody3 = new CANNON.Body({
    mass: 0,
    shape: sphereShape,
  });

  sceneGroup2.add(sphere3);
  sphereBody3.position.copy(sphere3.position);
  world.addBody(sphereBody3);
  spheres.push({
    mesh: sphere3,
    body: sphereBody3,
    constraint: null,
  });

  var sphere4 = new THREE.Mesh(sphereGeometry, sphereNormalMaterial);
  sphere4.position.set(0.7, 0, 0);
  var sphereBody4 = new CANNON.Body({
    mass: 0,
    shape: sphereShape,
  });

  sceneGroup2.add(sphere4);
  sphereBody4.position.copy(sphere4.position);
  world.addBody(sphereBody4);
  spheres.push({
    mesh: sphere4,
    body: sphereBody4,
    constraint: null,
  });

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

  cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);

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
  world.step(1 / 600);
  cannonDebugRenderer.update();

  updateInteractions();

  updatePhysics();
  update();
  render();
}

function updateInteractions() {
  pdbs.forEach(function (pdb, index1, pdbsArray) {
    pdb.interactiveAtoms.hydrogen.forEach(function (hydrogensArr) {
      pdbsArray.forEach(function (otherPdb, index2) {
        if (index1 === index2) {
          return;
        }

        otherPdb.interactiveAtoms.oxygen.forEach(function (oxygenArr) {
          handleInteraction(oxygenArr, hydrogensArr, index2, index1);
        });

        otherPdb.interactiveAtoms.nitrogen.forEach(function (nitrogenArr) {
          handleInteraction(nitrogenArr, hydrogensArr, index2, index1);
        });
      });
    });
  });

  // interactiveAtoms1.hydrogen.forEach(function (hydrogensArr) {
  //   interactiveAtoms2.oxygen.forEach(function (oxygenArr) {
  //     handleInteraction(oxygenArr, 2, hydrogensArr);
  //   });

  //   interactiveAtoms2.nitrogen.forEach(function (nitrogenArr) {
  //     handleInteraction(nitrogenArr, 2, hydrogensArr);
  //   });

  //   interactiveAtoms2.fluor.forEach(function (fluorArr) {
  //     handleInteraction(fluorArr, 2, hydrogensArr);
  //   });

  //   interactiveAtoms2.sulfur.forEach(function (sulfurArr) {
  //     handleInteraction(sulfurArr, 2, hydrogensArr);
  //   });

  //   interactiveAtoms2.chlorine.forEach(function (chlorineArr) {
  //     handleInteraction(chlorineArr, 2, hydrogensArr);
  //   });

  //   interactiveAtoms2.bromine.forEach(function (bromineArr) {
  //     handleInteraction(bromineArr, 2, hydrogensArr);
  //   });

  //   interactiveAtoms2.iodine.forEach(function (iodineArr) {
  //     handleInteraction(iodineArr, 2, hydrogensArr);
  //   });
  // });

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

  updateCubeControls();
}

function updateCubeControls() {
  var spherePos = new THREE.Vector3();

  if (!isCube1Visible && !isCube2Visible) {
    return;
  }

  spheres.forEach(function (sphere, sphereIndex) {
    if (!isCube1Visible && sphereIndex <= 1) return;
    if (!isCube2Visible && sphereIndex > 1) return;

    sphere.mesh.getWorldPosition(spherePos);
    sphere.body.position.copy(spherePos);

    var constraintExists = sphere.constraint !== null;

    if (constraintExists) {
      // var keys = sphere.constraint.key.split("-");
      // var pdb = keys[0];
      // var atom = keys[1];
      // var distance = Math.sqrt(
      //   Math.pow(spherePos.x - pdbs[pdb].atomMeshes[atom].position.x, 2) +
      //     Math.pow(spherePos.y - pdbs[pdb].atomMeshes[atom].position.y, 2) +
      //     Math.pow(spherePos.z - pdbs[pdb].atomMeshes[atom].position.z, 2)
      // );
      // if (distance > 2 || distance < 0) {
      //   world.removeConstraint(sphere.constraint.cannonConstraint);
      //   sphere.constraint.mesh.dispose();
      //   scene.remove(sphere.constraint.mesh);
      //   var keyIndex = constraintKeys.findIndex(function (key) {
      //     return key === sphere.constraint.key;
      //   });
      //   constraintKeys.splice(keyIndex, 1);
      //   sphere.constraint = null;
      // } else {
        for (let index = 1; index < 10; index++) {
          var p0 = new THREE.Vector3();
          var p1 = new THREE.Vector3();
          var pf = new THREE.Vector3();
          p0.setFromMatrixPosition(sphere.constraint.meshA.matrixWorld);
          p1.setFromMatrixPosition(sphere.constraint.meshB.matrixWorld);
          pf.lerpVectors(p0, p1, index / 10);
          dummy.position.copy(pf);
          dummy.updateMatrix();
          sphere.constraint.mesh.setMatrixAt(index, dummy.matrix);
        }
        sphere.constraint.mesh.instanceMatrix.needsUpdate = true;
      // }
    } else {
      pdbs.forEach(function (pdb, pdbIndex) {
        pdb.atomMeshes.forEach(function (atom, atomIndex) {
          var constraintKey = `${pdbIndex}-${atomIndex}`;
          var keyExists = constraintKeys.includes(constraintKey);

          if (keyExists) {
            return;
          }

          var distance = Math.sqrt(
            Math.pow(spherePos.x - atom.position.x, 2) +
              Math.pow(spherePos.y - atom.position.y, 2) +
              Math.pow(spherePos.z - atom.position.z, 2)
          );

          if (distance < 1.5 && distance > 0 && sphere.constraint == null) {
            var mesh = new THREE.InstancedMesh(
              sphereGeometry,
              sphereMaterial2,
              9
            );
            mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame

            // var constraint = new CANNON.DistanceConstraint(
            //   pdb.atomBodies[atomIndex],
            //   sphere.body,
            //   undefined,
            //   10000
            // );

            var spring = new CANNON.Spring(
              pdb.atomBodies[atomIndex],
              sphere.body,
              {
                restLength: 0,
                stiffness: 50,
                damping: 1,
              }
            );

            world.addEventListener('postStep', (event) => {
              console.log("steppp")
              spring.applyForce()
            })

            scene.add(mesh);
            // world.addConstraint(constraint);
            constraintKeys.push(constraintKey);
            sphere.constraint = {
              meshA: sphere.mesh,
              meshB: atom,
              mesh,
              cannonConstraint: spring,
              key: constraintKey,
            };
          }
        });
      });
    }
  });
}

function updatePhysics() {
  pdbs.forEach(function (pdb) {
    var velsum = 0;
    var mediax = 0;
    var mediay = 0;
    var mediaz = 0;
    var velsum_expected = Math.sqrt(temperature) * pdb.atoms;

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
    return;
  }

  if (e.target.id === "switch-flip-2") {
    atomBodies2.forEach(function (body) {
      body.position.x = -body.position.x;
    });
    return;
  }

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
  var isChecked = e.target.checked;

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

  var interactions = pdbs[hIndex].interactions;

  // var interactions = cubeNumber === 1 ? interactions2 : interactions1;
  // var otherCube = cubeNumber === 1 ? 2 : 1;

  var interactionKey = `${hydrogen}-${element}`;

  // // If the element exists returns index of the interaction
  // // If not, returns -1
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
        hIndex,
        interactionKey,
        bridgeKey,
        otherMoleculeBodies[hydrogen],
        thisMoleculeBodies[element]
      );
    }
  } else if (interactionExists) {
    removeInteraction(hIndex, interactionIndex, bridgeKey);
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

function handleBridgeChange(e) {
  isBridgeActive = switchBridge.checked;
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

    fetch(baseUrl + string + jmeUrl)
      .then((response) => response.text())
      .then((data) => {
        jsmeApplet.readMolecule(data);
        jmeSearch.disabled = false;
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

import * as THREE from "/lib/three.module.js";
import { GLTFLoader } from "./utils/GLTFLoader.js";
import { DRACOLoader } from "./utils/DRACOLoader.js";

var scene, camera, renderer;
var arToolkitSource, arToolkitContext;
var patternArray, markerRootArray, markerGroupArray;
var sceneGroup;

var flipGraphics = document.querySelector("flip-graphics");
var flipVideo = document.querySelector("flip-video");
var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
var reset = document.querySelector("reset-activity");

flipGraphics.addEventListener("flipGraphics", handleFlip);
flipVideo.addEventListener("flipCamera", handleCameraFlip);
scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
reset.addEventListener("resetActivity", handleReset);
window.addEventListener("camera-change", () => {
  handleFlip();
});

initialize();
animate();

function initialize() {
  scene = new THREE.Scene();

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
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
    cameraParametersUrl: "/modules/virtual-modeling-kit/data/camera_para.dat",
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
        patternUrl:
          "/modules/virtual-modeling-kit/data/" + patternArray[i] + ".patt",
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

  // a 1x1x1 cube model with scale factor 1.25 fills up the physical cube
  sceneGroup.scale.set(1.25 / 2, 1.25 / 2, 1.25 / 2);

  var loader = new GLTFLoader().setPath("./");
  var dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/lib/draco/");
  loader.setDRACOLoader(dracoLoader);

  loader.load("modelDraco.glb", function (glb) {
    sceneGroup.add(glb.scene);
    render();
  });

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
  update();
  render();
}

function handleFlip(e) {
  sceneGroup.scale.x *= -1;
}

function handleScale(e) {
  if (e.detail === "up") {
    sceneGroup.scale.multiplyScalar(1.5);
  } else {
    sceneGroup.scale.multiplyScalar(0.6667);
  }
}

function handleReset(e) {
  sceneGroup.scale.set(1, 1, 1);
}

function handleCameraFlip() {
  var video = document.getElementsByTagName("video")[0];
  var canvas = document.querySelector("canvas");
  video.classList.toggle("flip");
  canvas.classList.toggle("flip");
}

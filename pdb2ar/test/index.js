import * as THREE from "/lib/three.module.js";
import { OrbitControls } from "/lib/utils/OrbitControls.js";
import { VRButton } from "/lib/webxr/VRButton.js";
import { XRControllerModelFactory } from "/lib/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "/lib/webxr/XRHandModelFactory.js";
import { BoxLineGeometry } from "/lib/utils/BoxLineGeometry.js";
import { GLTFLoader } from "/lib/utils/GLTFLoader.js";
import { DRACOLoader } from "/lib/utils/DRACOLoader.js";

let container;
let camera, scene, renderer;
let hand1, hand2;
let controller1, controller2;
let controllerGrip1, controllerGrip2;

let room;

const tmpVector1 = new THREE.Vector3();

const material = new THREE.MeshLambertMaterial({ color: "red" });
const atomGeometry = new THREE.SphereBufferGeometry(0.02, 16, 16);

let controls;

let object;

init();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x444444);

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera.position.set(0, 1.6, 3);
  controls = new OrbitControls(camera, container);
  controls.target.set(0, 1.6, 0);
  controls.enableDamping = true;
  controls.update();

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(6, 6);
  const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x156289 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  
    // Room
  room = new THREE.LineSegments(
    new BoxLineGeometry(6, 6, 6, 10, 10, 10),
    new THREE.LineBasicMaterial({ color: 0x808080 })
  );
  room.geometry.translate(0, 3, 0);
  scene.add(room);

  // Lights
  const hemisphereLight = new THREE.HemisphereLight(0x808080, 0x606060);
  scene.add(hemisphereLight);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 6, 0);
  light.castShadow = true;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.camera.right = 2;
  light.shadow.camera.left = -2;
  light.shadow.mapSize.set(2048, 2048);
  scene.add(light);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;

  container.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  // Controllers
  controller1 = renderer.xr.getController(0);
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();
  const handModelFactory = new XRHandModelFactory();

  // Hand1
  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  scene.add(controllerGrip1);

  hand1 = renderer.xr.getHand(0);
  hand1.addEventListener("pinchstart", onPinchStart);
  hand1.addEventListener("pinchend", onPinchEnd);
  hand1.add(handModelFactory.createHandModel(hand1, "mesh"));
  scene.add(hand1);

  // Hand2
  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  scene.add(controllerGrip2);

  hand2 = renderer.xr.getHand(1);
  hand2.addEventListener("pinchstart", onPinchStart);
  hand2.addEventListener("pinchend", onPinchEnd);
  hand2.add(handModelFactory.createHandModel(hand2, "mesh"));
  scene.add(hand2);

  const sphere = new THREE.Mesh(atomGeometry, material);
  sphere.position.set(0, 1.4, -0.5);
  //sphere.geometry.computeBoundingBox();
  //scene.add(sphere);

  window.addEventListener("resize", onWindowResize);

  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.4.3/");
  loader.setDRACOLoader(dracoLoader);

  loader.load(
    "https://cdn.glitch.me/17bb60ae-af43-49cc-b695-875b21ab0b82%2Fdna.gltf?v=1636364482351",
    function(glb) {
      glb.scene.scale.set(0.3, 0.3, 0.3);
      glb.scene.position.set(0, 1.4, -0.5);
      object = glb.scene;
      scene.add(object);
      
      animate();
    }
  );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  controls.update();

  renderer.render(scene, camera);
}

function collideObject(indexTip) {
  const indexPos = indexTip.getWorldPosition(tmpVector1);
  const myBox = new THREE.Box3().setFromObject(object);

  if (myBox.containsPoint(indexPos)) {
    return object;
  }
  return null;
}

function onPinchEnd(event) {
  const controller = event.target;

  scene.attach(object);
}

function onPinchStart(event) {
  const controller = event.target;
  const indexTip = controller.joints["index-finger-tip"];
  const object = collideObject(indexTip);
  if (object) {
    indexTip.attach(object);
  }
}

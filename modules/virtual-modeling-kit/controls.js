var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
// var flipGraphics = document.querySelector("flip-graphics");

// function handleFlip(e) {
//   sceneGroup.scale.x = -sceneGroup.scale.x;
//   // sceneGroup.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
// }

function handleScale(e) {
  if(e.detail === "up") {
    sceneGroup.scale.multiplyScalar(1.5);
  } else {
    sceneGroup.scale.multiplyScalar(0.6667);
  }
}

scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
// flipGraphics.addEventListener("flipGraphics", handleFlip);

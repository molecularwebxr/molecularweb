var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");

function handleScale(e) {
  if(e.detail === "up") {
    sceneGroup.scale.multiplyScalar(1.5);
  } else {
    sceneGroup.scale.multiplyScalar(0.6667);
  }
}

scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);

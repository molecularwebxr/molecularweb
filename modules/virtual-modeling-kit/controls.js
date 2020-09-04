var high = 100;
var medium = 50;
var low = 10;

var prevTemp = 0;

var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
var tempControls = document.querySelectorAll("temp-control");
var stopTemp = document.querySelector("stop-temp");
var playTemp = document.querySelector("play-temp");
var tempMenu = document.querySelector("enable-temp-controls");
var zoomMenu = document.querySelector("zoom-icon");
var tempMenuContainer = document.getElementById("temp-container");
var zoomMenuContainer = document.getElementById("zoom-container");
var renderType = document.querySelector("render-type-icon");

tempMenu.isActive = false;
renderType.isActive = true;
zoomMenu.isActive = false;

var flipGraphics = document.querySelector("flip-graphics");

function handleFlip(e) {
  for (i = 0; i < atomsarray.length; i++) {
    world.bodies[i].position.x = -world.bodies[i].position.x;
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
  temperature = prevTemp === 0 ? 300 : prevTemp;
  prevTemp = temperature;
}

function handleTempMenu(e) {
  tempMenuContainer.classList.toggle("hide");
  tempMenu.isActive = !tempMenu.isActive;
  if (mkMenu.isActive) {
    mkMenu.isActive = false;
    menuContainer.classList.add("hide");
  }
  if (zoomMenu.isActive) {
    zoomMenu.isActive = false;
    zoomMenuContainer.classList.add("hide");
  }
}

function handleZoomMenu(e) {
  zoomMenuContainer.classList.toggle("hide");
  zoomMenu.isActive = !zoomMenu.isActive;
  if (mkMenu.isActive) {
    mkMenu.isActive = false;
    menuContainer.classList.add("hide");
  }
  if (tempMenu.isActive) {
    tempMenu.isActive = false;
    tempMenuContainer.classList.add("hide");
  }
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

// scaleUp.addEventListener("scaleGraphics", handleScale);
// scaleDown.addEventListener("scaleGraphics", handleScale);
stopTemp.addEventListener("stopTemp", handleStopTemp);
playTemp.addEventListener("playTemp", handlePlayTemp);
tempMenu.addEventListener("click", handleTempMenu);
zoomMenu.addEventListener("click", handleZoomMenu);
renderType.addEventListener("click", handleRenderType);
flipGraphics.addEventListener("flipGraphics", handleFlip);

tempControls.forEach(function (item) {
  item.addEventListener("updateTemp", handleTempControls);
});

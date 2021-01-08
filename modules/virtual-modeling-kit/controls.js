var scaleUp = document.getElementById("scale-up");
var scaleDown = document.getElementById("scale-down");
var tempControls = document.querySelectorAll("temp-control");
var stopTemp = document.querySelector("stop-temp");
var playTemp = document.querySelector("play-temp");
var reset = document.querySelector("reset-activity");
var tempMenu = document.querySelector("enable-temp-controls");
var zoomMenu = document.querySelector("zoom-icon");
var camMenu = document.querySelector("camera-icon");
var swapCam = document.querySelector("swap-camera");
var tempMenuContainer = document.getElementById("temp-container");
var zoomMenuContainer = document.getElementById("zoom-container");
var camMenuContainer = document.getElementById("cam-container");
var renderType = document.querySelector("render-type-icon");
var flipGraphics = document.querySelector("flip-graphics");

var high = 100;
var medium = 50;
var low = 10;

var prevTemp = 0;

var devices = [];
var selectedCamera = "env";

tempMenu.isActive = false;
renderType.isActive = true;
zoomMenu.isActive = false;
camMenu.isActive = false;

function handleError(error) {
  console.log("Something went wrong: ", error.message, error.name);
}

function getDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    if (deviceInfo.kind === "videoinput") {
      var id = deviceInfo.deviceId;
      if (!devices.includes(id)) {
        devices.push(id);
      }
    }
  }

  if (this.devices.length > 1) {
    swapCam.classList.remove("hide");
    swapCam.addEventListener("click", switchCam);
    
    menuContainer.classList.add("multiple-cams");
    tempMenuContainer.classList.add("multiple-cams");
    zoomMenuContainer.classList.add("multiple-cams");
  }
}

function switchCam(e) {
  var constraints;

  if (selectedCamera === "env") {
    constraints = {
      audio: false,
      video: {
        facingMode: "user",
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
    };
    selectedCamera = "user";
  } else {
    constraints = {
      audio: false,
      video: {
        facingMode: "environment",
        width: {
          ideal: 640,
        },
        height: {
          ideal: 480,
        },
      },
    };
    selectedCamera = "env";
  }
  console.log("Contraints selected. Attempting to change camera...");

  var domElement = document.querySelector("video");

  var oldStream = domElement.srcObject;
  oldStream.getTracks().forEach(function (track) {
    track.stop();
    console.log("Current stream stopped");
  });

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      domElement.srcObject = stream;

      var event = new CustomEvent("camera-init", { stream: stream });
      window.dispatchEvent(event);
      console.log("Event dispatched. Changing camera.");

      document.body.addEventListener("click", function () {
        domElement.play();
      });
    })
    .catch(handleError);
}

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
  if (camMenu.isActive) {
    camMenu.isActive = false;
    camMenuContainer.classList.add("hide");
  }
}

function handleCamMenu(e) {
  camMenuContainer.classList.toggle("hide");
  camMenu.isActive = !camMenu.isActive;
  if (mkMenu.isActive) {
    mkMenu.isActive = false;
    menuContainer.classList.add("hide");
  }
  if (tempMenu.isActive) {
    tempMenu.isActive = false;
    tempMenuContainer.classList.add("hide");
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
  if (camMenu.isActive) {
    camMenu.isActive = false;
    camMenuContainer.classList.add("hide");
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

function handleReset(e) {
  atomsarray = [];
  bondsarray = [];
  spheresarray = [];
  bondfirstatom = [];
  bondlength = [];
  atoms = 0;
  temperature = 0;

  clearPhysics();
  clearGroup(stickGroup);
  clearGroup(spheresGroup);

  sceneGroup.scale.set(1.25 / 2, 1.25 / 2, 1.25 / 2);

  handleMenu()
}

scaleUp.addEventListener("scaleGraphics", handleScale);
scaleDown.addEventListener("scaleGraphics", handleScale);
stopTemp.addEventListener("stopTemp", handleStopTemp);
playTemp.addEventListener("playTemp", handlePlayTemp);
tempMenu.addEventListener("click", handleTempMenu);
zoomMenu.addEventListener("click", handleZoomMenu);
camMenu.addEventListener("click", handleCamMenu);
renderType.addEventListener("click", handleRenderType);
flipGraphics.addEventListener("flipGraphics", handleFlip);
reset.addEventListener("resetActivity", handleReset);

tempControls.forEach(function (item) {
  item.addEventListener("updateTemp", handleTempControls);
});

navigator.mediaDevices.enumerateDevices().then(getDevices).catch(handleError);

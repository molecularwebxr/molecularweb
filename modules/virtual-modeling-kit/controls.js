var tempMenu = document.querySelector("enable-temp-controls");
var zoomMenu = document.querySelector("zoom-icon");
var camMenu = document.querySelector("camera-icon");
var swapCam = document.querySelector("swap-camera");
var tempMenuContainer = document.getElementById("temp-container");
var zoomMenuContainer = document.getElementById("zoom-container");
var camMenuContainer = document.getElementById("cam-container");
var flipVideoButton = document.querySelector("flip-video");

var devices = [];
var selectedCamera = "env";

tempMenu.isActive = false;
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
    
    camMenuContainer.classList.add("multiple-cams");
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

      // Flipping video and dispatching change event
      var video = document.getElementsByTagName("video")[0];
      var canvasEl = document.querySelector("canvas");
      video.classList.toggle("flip");
      canvasEl.classList.toggle("flip");
      var changeEvent = new CustomEvent("camera-change");
      window.dispatchEvent(changeEvent);

      document.body.addEventListener("click", function () {
        domElement.play();
      });
    })
    .catch(handleError);
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

function handleCameraFlip() {
  var video = document.getElementsByTagName("video")[0];
  var canvas = document.querySelector("canvas");
  video.classList.toggle("flip");
  canvas.classList.toggle("flip");
}

tempMenu.addEventListener("click", handleTempMenu);
zoomMenu.addEventListener("click", handleZoomMenu);
camMenu.addEventListener("click", handleCamMenu);
flipVideoButton.addEventListener("flipCamera", handleCameraFlip);

navigator.mediaDevices.enumerateDevices().then(getDevices).catch(handleError);

AFRAME.registerComponent("switch-camera", {
  init: function () {
    this.handleError = this.handleError.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.devices = [];
    this.selectedCamera = "env";

    navigator.mediaDevices
      .enumerateDevices()
      .then(this.getDevices)
      .catch(this.handleError);
  },
  getDevices: function (deviceInfos) {
    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === "videoinput") {
        var id = deviceInfo.deviceId;
        if (!this.devices.includes(id)) {
          this.devices.push(id);
        }
      }
    }
    if (this.devices.length > 1) {
      this.createBtn();
    }
  },
  handleClick: function (e) {
    var constraints;

    if (this.selectedCamera === "env") {
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
      this.selectedCamera = "user";
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
      this.selectedCamera = "env";
    }
    console.log("Contraints selected. Attempting to change camera...");

    var domElement = document.querySelector("#arjs-video");

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
      .catch(this.handleError);
  },
  handleError: function (error) {
    console.log("Something went wrong: ", error.message, error.name);
  },
  createBtn: function () {
    var containerElement = document.createElement("swap-camera");
    // containerElement.setAttribute("id", "#arjs-select-camera-container");
    // containerElement.setAttribute(
    //   "style",
    //   "position: absolute; bottom: 5px; right: 0; background-color: rgba(111, 45, 189, 0.7); padding: 8px 16px; border-radius: 4px;"
    // );
    document.body.appendChild(containerElement);

    // var selectCameraButton = document.createElement("button");
    // selectCameraButton.innerText = "Switch";
    // selectCameraButton.setAttribute(
    //   "style",
    //   "font-family: 'Roboto'; padding: 4px 8px; width: 100px; border: none; outline: none; border-radius: 4px; background-color: rgb(10, 255, 198); color: rgb(111, 45, 189); font-weight: bold; cursor: pointer;"
    // );

    // containerElement.appendChild(selectCameraButton);

    containerElement.addEventListener("click", this.handleClick);
  },
});

AFRAME.registerComponent("rotate-molecules", {
  init: function () {
    this.handleRotation = this.handleRotation.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.rotationHandler1 = document.querySelector("#rotation-marker-1");
    this.rotationHandler2 = document.querySelector("#rotation-marker-2");
    var resetActivityButton = document.querySelector("reset-activity");

    this.marker1A = document.querySelector("#marker1A");
    this.marker1B = document.querySelector("#marker1B");
    this.marker2A = document.querySelector("#marker2A");
    this.marker2B = document.querySelector("#marker2B");

    this.rotationHandler1.addEventListener("rotateGraphics", this.handleRotation);
    this.rotationHandler2.addEventListener("rotateGraphics", this.handleRotation);
    resetActivityButton.addEventListener("resetActivity", this.handleReset);
  },

  handleRotation: function (e) {
    var details = e.detail;
    var degrees = THREE.Math.degToRad(parseInt(details.value));

    if (details.marker === "1") {
      if (details.axis === "x") {
        this.marker1A.object3D.rotation.x = degrees;
        this.marker1B.object3D.rotation.x = degrees + Math.PI;
      } else if (details.axis === "y") {
        this.marker1A.object3D.rotation.y = degrees;
        this.marker1B.object3D.rotation.y = -degrees + Math.PI;
      } else {
        this.marker1A.object3D.rotation.z = degrees;
        this.marker1B.object3D.rotation.z = degrees;
      }
    } else {
      if (details.axis === "x") {
        this.marker2A.object3D.rotation.x = degrees;
        this.marker2B.object3D.rotation.x = degrees + Math.PI;
      } else if (details.axis === "y") {
        this.marker2A.object3D.rotation.y = degrees;
        this.marker2B.object3D.rotation.y = -degrees + Math.PI;
      } else {
        this.marker2A.object3D.rotation.z = degrees;
        this.marker2B.object3D.rotation.z = degrees;
      }
    }
  },

  handleReset: function (e) {
    this.marker1A.object3D.rotation.set(
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(0)
    );
    
    this.marker1B.object3D.rotation.set(
      THREE.Math.degToRad(180),
      THREE.Math.degToRad(180),
      THREE.Math.degToRad(0)
    );

    this.marker2A.object3D.rotation.set(
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(0),
      THREE.Math.degToRad(0)
    );

    this.marker2B.object3D.rotation.set(
      THREE.Math.degToRad(180),
      THREE.Math.degToRad(180),
      THREE.Math.degToRad(0)
    );

    this.rotationHandler1.reset();
    this.rotationHandler2.reset();
  },
});

AFRAME.registerComponent("rotate-molecules", {
  init: function () {
    this.handleRotation = this.handleRotation.bind(this);

    var rotationHandler1 = document.querySelector("#rotation-marker-1");
    var rotationHandler2 = document.querySelector("#rotation-marker-2");

    this.marker1A = document.querySelector("#marker1A");
    this.marker1B = document.querySelector("#marker1B");
    this.marker2A = document.querySelector("#marker2A");
    this.marker2B = document.querySelector("#marker2B");

    rotationHandler1.addEventListener("rotateGraphics", this.handleRotation);
    rotationHandler2.addEventListener("rotateGraphics", this.handleRotation);
  },

  handleRotation: function (e) {
    var details = e.detail;
    var degrees = THREE.Math.degToRad(parseInt(details.value));

    if (details.marker === "1") {
      if (details.axis === "x") {
        this.marker1A.object3D.rotation.x = degrees;
        this.marker1B.object3D.rotation.x = degrees + Math.PI;
      } else {
        this.marker1A.object3D.rotation.y = degrees;
        this.marker1B.object3D.rotation.y = - degrees + Math.PI;
      }
    } else {
      if (details.axis === "x") {
        this.marker2A.object3D.rotation.x = degrees;
        this.marker2B.object3D.rotation.x = degrees + Math.PI;
      } else {
        this.marker2A.object3D.rotation.y = degrees;
        this.marker2B.object3D.rotation.y = - degrees + Math.PI;
      }
    }
  },
});

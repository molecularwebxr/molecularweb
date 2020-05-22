AFRAME.registerComponent("listen-to-scale", {
  init: function () {
    this.scale = this.scale.bind(this);
    this.scaleFactor = 2;

    const scaleUpButton = document.getElementById("scale-up");
    const scaleDownButton = document.getElementById("scale-down");

    scaleUpButton.addEventListener("scaleGraphics", this.scale);
    scaleDownButton.addEventListener("scaleGraphics", this.scale);
  },

  scale: function (e) {
    if (e.detail === "up") {
      this.scaleFactor *= 1.5;
    } else {
      this.scaleFactor *= 0.6667;
    }

    this.el.object3D.scale.x = this.scaleFactor;
    this.el.object3D.scale.y = this.scaleFactor;
    this.el.object3D.scale.z = this.scaleFactor;
  },
});

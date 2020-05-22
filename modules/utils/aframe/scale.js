AFRAME.registerComponent("listen-to-scale", {
  init: function () {
    this.scale = this.scale.bind(this);
    const scaleUpButton = document.getElementById("scale-up");
    const scaleDownButton = document.getElementById("scale-down");
    scaleUpButton.addEventListener("scaleGraphics", this.scale);
    scaleDownButton.addEventListener("scaleGraphics", this.scale);
  },

  scale: function (e) {
    // this.el.object3D.scale.x = -this.el.object3D.scale.x
    console.log(e.detail);
  },
});

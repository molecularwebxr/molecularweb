AFRAME.registerComponent("listen-to-scale", {
  init: function () {
    this.scale = this.scale.bind(this);
    const scaleGraphicsButton = document.querySelector("scale-graphics");
    scaleGraphicsButton.addEventListener("scaleGraphics", this.scale);
  },

  scale: function (e) {
    // this.el.object3D.scale.x = -this.el.object3D.scale.x
    console.log(e.detail);
  },
});

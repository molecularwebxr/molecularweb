AFRAME.registerComponent("listen-to-flip", {
  init: function () {
    this.flip = this.flip.bind(this);
    const flipGraphicsButton = document.querySelector("flip-graphics");
    flipGraphicsButton.addEventListener("flipGraphics", this.flip);
  },

  flip: function () {
    this.el.object3D.scale.x = -this.el.object3D.scale.x
  },
});

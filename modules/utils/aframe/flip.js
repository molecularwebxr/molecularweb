AFRAME.registerComponent("listen-to-flip", {
  init: function () {
    this.flip = this.flip.bind(this);
    var flipGraphicsButton = document.querySelector("flip-graphics");
    var flipVideoButton = document.querySelector("flip-video");

    flipGraphicsButton.addEventListener("flipGraphics", this.flip);
    flipVideoButton.addEventListener("flipCamera", this.flip);
    window.addEventListener("camera-change", () => {
      this.flip();
    });

    if (window.innerWidth >= 768) {
      this.flip();
    }
  },

  flip: function () {
    this.el.object3D.scale.x = -this.el.object3D.scale.x;
  },
});

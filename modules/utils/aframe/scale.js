AFRAME.registerComponent("listen-to-scale", {
  init: function () {
    this.scale = this.scale.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.scaleFactor = 1;

    var scaleUpButton = document.getElementById("scale-up");
    var scaleDownButton = document.getElementById("scale-down");
    var resetActivityButton = document.querySelector("reset-activity");

    scaleUpButton.addEventListener("scaleGraphics", this.scale);
    scaleDownButton.addEventListener("scaleGraphics", this.scale);
    resetActivityButton.addEventListener("resetActivity", this.handleReset);
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

  handleReset: function(e) {
    this.scaleFactor = 1;
    this.el.object3D.scale.set(1, 1, 1);
  }
});

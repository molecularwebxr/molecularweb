/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    factor: { default: 5 },
    min: { default: 0.3 },
    max: { default: 8 }
  },

  init: function() {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.addEventListener("twofingermove", this.handleScale);

    this.el.sceneEl.addEventListener("markerFound", e => {
      this.isVisible = true;
    });

    this.el.sceneEl.addEventListener("markerLost", e => {
      this.isVisible = false;
    });
  },

  remove: function() {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function(event) {
    if (this.isVisible) {
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.factor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.factor;
    }
  },

  handleScale: function(event) {
    if (this.isVisible) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.min),
        this.data.max
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;

      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;

      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  }
});

/* global AFRAME, THREE */

AFRAME.registerComponent("gesture-handler", {
  schema: {
    enabled: { default: false },
    rotationFactor: { default: 5 },
    minScale: { default: 0.3 },
    maxScale: { default: 8 },
    linkedMarker:{ default: "" }
  },

  init: function() {
    this.handleScale = this.handleScale.bind(this);
    this.handleRotation = this.handleRotation.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.linkedMarker = document.querySelector(this.data.linkedMarker);
    var resetActivityButton = document.querySelector("reset-activity");

    this.isVisible = false;
    this.initialScale = this.el.object3D.scale.clone();
    this.scaleFactor = 1;

    resetActivityButton.addEventListener("resetActivity", this.handleReset);

    this.el.sceneEl.addEventListener("markerFound", e => {
      var markerChildren = e.target.childNodes;
      var isThisMarkerFound =  [...markerChildren].some(element => element.id === this.el.id);
      if (isThisMarkerFound) {
        this.isVisible = true;
      }
    });

    this.el.sceneEl.addEventListener("markerLost", e => {
      var markerChildren = e.target.childNodes;
      var isThisMarkerLost =  [...markerChildren].some(element => element.id === this.el.id);
      if(isThisMarkerLost) {
        this.isVisible = false;
      }
    });
  },

  update: function() {
    if(this.data.enabled) {
      this.el.sceneEl.addEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.addEventListener("twofingermove", this.handleScale);
    } else {
      this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
      this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
    }
  },

  remove: function() {
    this.el.sceneEl.removeEventListener("onefingermove", this.handleRotation);
    this.el.sceneEl.removeEventListener("twofingermove", this.handleScale);
  },

  handleRotation: function(event) {
    if (this.isVisible) {
      this.el.object3D.rotation.y +=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.el.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;

      this.linkedMarker.object3D.rotation.y -=
        event.detail.positionChange.x * this.data.rotationFactor;
      this.linkedMarker.object3D.rotation.x +=
        event.detail.positionChange.y * this.data.rotationFactor;
    }
  },

  handleScale: function(event) {
    if (this.isVisible) {
      this.scaleFactor *=
        1 + event.detail.spreadChange / event.detail.startSpread;

      this.scaleFactor = Math.min(
        Math.max(this.scaleFactor, this.data.minScale),
        this.data.maxScale
      );

      this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
      
      this.linkedMarker.object3D.scale.x = this.scaleFactor * this.initialScale.x;
      this.linkedMarker.object3D.scale.y = this.scaleFactor * this.initialScale.y;
      this.linkedMarker.object3D.scale.z = this.scaleFactor * this.initialScale.z;
    }
  },

  handleReset: function (e) {
    if(this.el.id === "marker1A" || this.el.id === "marker1B") {
      this.el.object3D.rotation.set(
        THREE.Math.degToRad(0),
        THREE.Math.degToRad(0),
        THREE.Math.degToRad(0)
      );
    } else {
      this.el.object3D.rotation.set(
        THREE.Math.degToRad(180),
        THREE.Math.degToRad(180),
        THREE.Math.degToRad(0)
      );

    }

    this.scaleFactor = 1;
    this.el.object3D.scale.set(1, 1, 1);
  },
});

/* global AFRAME, THREE */

AFRAME.registerComponent("interactive-molecules", {
  init: function () {
    // Get elements from the scene

    // Marker - Side A & Side B
    this.marker1A = this.el.sceneEl.querySelector("#watA");
    this.marker1B = this.el.sceneEl.querySelector("#watB");

    // 3D elements
    this.fixedFullProt = this.el.sceneEl.querySelector("#fixed-fullprot");
    this.fixedPept1 = this.el.sceneEl.querySelector("#fixed-pept1");
    this.fixedPept2 = this.el.sceneEl.querySelector("#fixed-pept2");
    this.markerFullProt = this.el.sceneEl.querySelector("#marker-fullprotA");
    this.markerPept1 = this.el.sceneEl.querySelector("#marker-pept1A");
    this.markerPept2 = this.el.sceneEl.querySelector("#marker-pept2A");
    this.markerFullProt = this.el.sceneEl.querySelector("#marker-fullprotB");
    this.markerPept1 = this.el.sceneEl.querySelector("#marker-pept1B");
    this.markerPept2 = this.el.sceneEl.querySelector("#marker-pept2B");

    // Global parameters: Targets, positions and quaternions
    // first piece
    this.p0 = [1.24, -0.32, -10.0];
    this.r0 = [0.7, 0.0, 0.0, 0.71];

    // second piece
    this.p1 = [-1.56, -0.28, -10.0];
    this.r1 = [0.7, 0.0, 0.0, 0.71];

    // tolerances
    this.tol_r = 0.58;
    this.tol_d = 0.58;

    // define starting target position
    this.tp = this.p0;
    this.tr = this.r0;
    this.stage = 0;

    // Interval for running tick function - in ms
    this.interval = 200;

    // Here we check which markers are visible for further usage
    this.visibleMarkers = [];

    this.el.sceneEl.addEventListener("markerFound", (e) => {
      const markerFound = e.target.id;
      onMarkerFound(markerFound);
    });
    this.el.sceneEl.addEventListener("markerLost", (e) => {
      const markerLost = e.target.id;
      onMarkerLost(markerLost);
    });

    const onMarkerFound = (markerFound) => {
      this.visibleMarkers = this.visibleMarkers.concat(markerFound);
    };

    const onMarkerLost = (markerLost) => {
      this.visibleMarkers = this.visibleMarkers.filter(
        (marker) => marker !== markerLost
      );
    };

    // Add listener that triggers reset function
    this.reset = this.reset.bind(this);
    const resetActivityButton = document.querySelector("reset-activity");
    resetActivityButton.addEventListener("resetActivity", this.reset);
  },

  tick: function (t) {
    // Run on an interval.
    if (t - this.time < this.interval) {
      return;
    }
    this.time = t;

    // Don't do anything if find wrong marker setup or if there are not enough markers
    // e. g. 3 or more markers at the same time or both sides of a single molecule
    const areMarkersValid =
      this.visibleMarkers.includes("watA") ||
      this.visibleMarkers.includes("watB");

    const areEnoughMarkers = this.visibleMarkers.length >= 1;

    if (!areMarkersValid || !areEnoughMarkers) {
      return;
    }

    var markerSide = this.visibleMarkers.includes("watA") ? "A" : "B";

    var marker = markerSide === "A" ? this.marker1A : this.marker1B;

    marker3DObject = marker.object3D;
    // get positon of marker
    var mp = marker3DObject.position.toArray();
    var mr = marker3DObject.quaternion.toArray();

    console.log(mp, mr);
    
  },

  reset: function () {
    // Add here the code to reset molecules to their initial state.
    // Only reset molecule state. Rotation & scale will be restored on their own components
    console.log("Reset molecules");
  },
});

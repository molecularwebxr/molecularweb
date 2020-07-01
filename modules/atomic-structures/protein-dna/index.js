/* global AFRAME, THREE */

AFRAME.registerComponent("connector", {
  schema: {
    src: { type: "selector" },
    dest: { type: "selector" },
    alpha: { type: "number", default: 0.5 },
  },

  init: function () {
    this.p0 = new THREE.Vector3();
    this.p1 = new THREE.Vector3();
    this.pf = new THREE.Vector3();
  },

  tick: function () {
    var obj0 = this.data.src.object3D;
    var obj1 = this.data.dest.object3D;
    this.p0.setFromMatrixPosition(obj0.matrixWorld);
    this.p1.setFromMatrixPosition(obj1.matrixWorld);
    this.pf.lerpVectors(this.p0, this.p1, this.data.alpha);
    this.el.setAttribute("position", this.pf);

    var dist = norm(this.p0.toArray(), this.p1.toArray(), 3);
    var opacity =
      1.0 - Math.max(Math.min((dist - 1.0) / (3.0 - 1.0), 1.0), 0.0);

    this.el.setAttribute("opacity", opacity);

    var color = interpolateLinearly(opacity, winter);
    var r = Math.floor(255 * color[0]);
    var g = Math.floor(255 * color[1]);
    var b = Math.floor(255 * color[2]);

    this.el.setAttribute("color", "rgb(" + r + "," + g + "," + b + ")");
  },
});

AFRAME.registerComponent("interactive-molecules", {
  init: function () {
    // Get elements from the scene

    // Prot - Side A & Side B
    this.protA = this.el.sceneEl.querySelector("#protA");
    this.protB = this.el.sceneEl.querySelector("#protB");

    // DNA - Side A & Side B
    this.dnaA = this.el.sceneEl.querySelector("#dnaA");
    this.dnaB = this.el.sceneEl.querySelector("#dnaB");

    // Prot-DNA - Side A & Side B
    this.protDnaA = this.el.sceneEl.querySelector("#prot-dnaA");
    this.protDnaB = this.el.sceneEl.querySelector("#prot-dnaB");

    // Spheres - Side A & Side B
    this.sp0A = this.el.sceneEl.querySelector("#sp0A");
    this.sp1A = this.el.sceneEl.querySelector("#sp1A");
    this.sp2A = this.el.sceneEl.querySelector("#sp2A");
    this.sd0A = this.el.sceneEl.querySelector("#sd0A");
    this.sd1A = this.el.sceneEl.querySelector("#sd1A");
    this.sd2A = this.el.sceneEl.querySelector("#sd2A");
    this.sp0B = this.el.sceneEl.querySelector("#sp0B");
    this.sp1B = this.el.sceneEl.querySelector("#sp1B");
    this.sp2B = this.el.sceneEl.querySelector("#sp2B");
    this.sd0B = this.el.sceneEl.querySelector("#sd0B");
    this.sd1B = this.el.sceneEl.querySelector("#sd1B");
    this.sd2B = this.el.sceneEl.querySelector("#sd2B");

    // Bridges & Connectors
    this.bridge1 = this.el.sceneEl.querySelector("#bridge-1");
    this.connectors1 = this.bridge1.querySelectorAll("*");
    this.bridge2 = this.el.sceneEl.querySelector("#bridge-2");
    this.connectors2 = this.bridge2.querySelectorAll("*");
    this.bridge3 = this.el.sceneEl.querySelector("#bridge-3");
    this.connectors3 = this.bridge3.querySelectorAll("*");

    // Create Position vectors for further usage
    this.p_sp0A = new THREE.Vector3();
    this.p_sp1A = new THREE.Vector3();
    this.p_sp2A = new THREE.Vector3();
    this.p_sd0A = new THREE.Vector3();
    this.p_sd1A = new THREE.Vector3();
    this.p_sd2A = new THREE.Vector3();
    this.p_sp0B = new THREE.Vector3();
    this.p_sp1B = new THREE.Vector3();
    this.p_sp2B = new THREE.Vector3();
    this.p_sd0B = new THREE.Vector3();
    this.p_sd1B = new THREE.Vector3();
    this.p_sd2B = new THREE.Vector3();

    // tolerance parameter
    this.tol_d = 1.3;

    // Are objects docked?
    this.docked = false;

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

    // Are objects docked? return if so
    if (this.docked) {
      return;
    }

    // Don't do anything if find wrong marker setup or if there are not enough markers
    // e. g. 3 or more markers at the same time or both sides of a single molecule
    const areMarkersInvalid =
      (this.visibleMarkers.includes("prot-A") &&
        this.visibleMarkers.includes("prot-B")) ||
      (this.visibleMarkers.includes("dna-A") &&
        this.visibleMarkers.includes("dna-B"));

    const areEnoughMarkers = this.visibleMarkers.length === 2;

    if (areMarkersInvalid || !areEnoughMarkers) {
      this.bridge1.setAttribute("visible", false);
      this.bridge2.setAttribute("visible", false);
      this.bridge3.setAttribute("visible", false);
      return;
    }

    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.p_sp0A.setFromMatrixPosition(this.sp0A.object3D.matrixWorld);
    this.p_sp1A.setFromMatrixPosition(this.sp1A.object3D.matrixWorld);
    this.p_sp2A.setFromMatrixPosition(this.sp2A.object3D.matrixWorld);
    this.p_sd0A.setFromMatrixPosition(this.sd0A.object3D.matrixWorld);
    this.p_sd1A.setFromMatrixPosition(this.sd1A.object3D.matrixWorld);
    this.p_sd2A.setFromMatrixPosition(this.sd2A.object3D.matrixWorld);
    this.p_sp0B.setFromMatrixPosition(this.sp0B.object3D.matrixWorld);
    this.p_sp1B.setFromMatrixPosition(this.sp1B.object3D.matrixWorld);
    this.p_sp2B.setFromMatrixPosition(this.sp2B.object3D.matrixWorld);
    this.p_sd0B.setFromMatrixPosition(this.sd0B.object3D.matrixWorld);
    this.p_sd1B.setFromMatrixPosition(this.sd1B.object3D.matrixWorld);
    this.p_sd2B.setFromMatrixPosition(this.sd2B.object3D.matrixWorld);

    // Store a reference of all elements in arrays for easier handling
    var protA = [this.p_sp0A, this.p_sp1A, this.p_sp2A];
    var protB = [this.p_sp0B, this.p_sp1B, this.p_sp2B];

    var dnaA = [this.p_sd0A, this.p_sd1A, this.p_sd2A];
    var dnaB = [this.p_sd0B, this.p_sd1B, this.p_sd2B];

    // Which side of each molecule is visible? Select corresponding positions
    var protSide = this.visibleMarkers.includes("prot-A") ? "A" : "B";
    var dnaSide = this.visibleMarkers.includes("dna-A") ? "A" : "B";

    var protPositions = protSide === "A" ? protA : protB;
    var dnaPositions = dnaSide === "A" ? dnaA : dnaB;

    var d0 = norm(protPositions[0].toArray(), dnaPositions[0].toArray(), 3);
    var d1 = norm(protPositions[1].toArray(), dnaPositions[1].toArray(), 3);
    var d2 = norm(protPositions[2].toArray(), dnaPositions[2].toArray(), 3);

    // Set connectors src & dest according to visible markers
    [...this.connectors1].forEach((connector, index) => {
      connector.setAttribute(
        "connector",
        `src: #sp0${protSide}; dest: #sd0${dnaSide}; alpha: ` + (index + 1) / 10
      );
    });

    [...this.connectors2].forEach((connector, index) => {
      connector.setAttribute(
        "connector",
        `src: #sp1${protSide}; dest: #sd1${dnaSide}; alpha: ` + (index + 1) / 10
      );
    });

    [...this.connectors3].forEach((connector, index) => {
      connector.setAttribute(
        "connector",
        `src: #sp2${protSide}; dest: #sd2${dnaSide}; alpha: ` + (index + 1) / 10
      );
    });

    // Should dock molecules?
    if (
      d0 < this.tol_d &&
      d1 < this.tol_d &&
      d2 < this.tol_d &&
      d0 + d1 + d2 > 1e-5
    ) {
      // hide marker objects
      this.protA.setAttribute("visible", false);
      this.protB.setAttribute("visible", false);
      this.dnaA.setAttribute("visible", false);
      this.dnaB.setAttribute("visible", false);

      // hide bonds
      this.bridge1.setAttribute("visible", false);
      this.bridge2.setAttribute("visible", false);
      this.bridge3.setAttribute("visible", false);

      // show complete object
      this.protDnaA.setAttribute("visible", true);
      this.protDnaB.setAttribute("visible", true);

      this.docked = true;
    } else {
      this.bridge1.setAttribute("visible", true);
      this.bridge2.setAttribute("visible", true);
      this.bridge3.setAttribute("visible", true);
    }
  },

  reset: function () {
    this.docked = false;

    this.protA.setAttribute("visible", true);
    this.protB.setAttribute("visible", true);
    this.dnaA.setAttribute("visible", true);
    this.dnaB.setAttribute("visible", true);

    this.protDnaA.setAttribute("visible", false);
    this.protDnaB.setAttribute("visible", false);
  },
});

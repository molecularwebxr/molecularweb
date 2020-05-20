/* global AFRAME, THREE */

// Ths component handles interactivity between molecules
AFRAME.registerComponent("interactive-molecules", {
  init: function () {
    // Get elements from the scene

    // Lysine - Side A & Side B
    this.lys6A = this.el.sceneEl.querySelector("#lys6A");
    this.lys15A = this.el.sceneEl.querySelector("#lys15A");
    this.lys16A = this.el.sceneEl.querySelector("#lys16A");
    this.lys17A = this.el.sceneEl.querySelector("#lys17A");
    this.lys6B = this.el.sceneEl.querySelector("#lys6B");
    this.lys15B = this.el.sceneEl.querySelector("#lys15B");
    this.lys16B = this.el.sceneEl.querySelector("#lys16B");
    this.lys17B = this.el.sceneEl.querySelector("#lys17B");

    // Glutamate - Side A & Side B
    this.glu5A = this.el.sceneEl.querySelector("#glu5A");
    this.glu6A = this.el.sceneEl.querySelector("#glu6A");
    this.glu11A = this.el.sceneEl.querySelector("#glu11A");
    this.glu12A = this.el.sceneEl.querySelector("#glu12A");
    this.glu5B = this.el.sceneEl.querySelector("#glu5B");
    this.glu6B = this.el.sceneEl.querySelector("#glu6B");
    this.glu11B = this.el.sceneEl.querySelector("#glu11B");
    this.glu12B = this.el.sceneEl.querySelector("#glu12B");

    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");

    // Create Position vectors for further usage
    this.lys6APosition = new THREE.Vector3();
    this.lys15APosition = new THREE.Vector3();
    this.lys16APosition = new THREE.Vector3();
    this.lys17APosition = new THREE.Vector3();
    this.glu5APosition = new THREE.Vector3();
    this.glu6APosition = new THREE.Vector3();
    this.glu11APosition = new THREE.Vector3();
    this.glu12APosition = new THREE.Vector3();
    this.lys6BPosition = new THREE.Vector3();
    this.lys15BPosition = new THREE.Vector3();
    this.lys16BPosition = new THREE.Vector3();
    this.lys17BPosition = new THREE.Vector3();
    this.glu5BPosition = new THREE.Vector3();
    this.glu6BPosition = new THREE.Vector3();
    this.glu11BPosition = new THREE.Vector3();
    this.glu12BPosition = new THREE.Vector3();

    this.lys_prot = 1; // or 0 when neutral
    this.glu_prot = 0; // or 1 when protonated at O1 or 2 when protonated at O2

    this.interval = 200; // Interval for running tick function - in ms

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
    const areMarkersInvalid =
      (this.visibleMarkers.includes("lysA") &&
        this.visibleMarkers.includes("lysB")) ||
      (this.visibleMarkers.includes("gluA") &&
        this.visibleMarkers.includes("gluB"));

    const areEnoughMarkers = this.visibleMarkers.length === 2;

    if (areMarkersInvalid || !areEnoughMarkers) {
      this.bridge.setAttribute("visible", false);
      return;
    }

    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.lys6APosition.setFromMatrixPosition(this.lys6A.object3D.matrixWorld);
    this.lys15APosition.setFromMatrixPosition(this.lys15A.object3D.matrixWorld);
    this.lys16APosition.setFromMatrixPosition(this.lys16A.object3D.matrixWorld);
    this.lys17APosition.setFromMatrixPosition(this.lys17A.object3D.matrixWorld);

    this.lys6BPosition.setFromMatrixPosition(this.lys6B.object3D.matrixWorld);
    this.lys15BPosition.setFromMatrixPosition(this.lys15B.object3D.matrixWorld);
    this.lys16BPosition.setFromMatrixPosition(this.lys16B.object3D.matrixWorld);
    this.lys17BPosition.setFromMatrixPosition(this.lys17B.object3D.matrixWorld);

    this.glu5APosition.setFromMatrixPosition(this.glu5A.object3D.matrixWorld);
    this.glu6APosition.setFromMatrixPosition(this.glu6A.object3D.matrixWorld);
    this.glu11APosition.setFromMatrixPosition(this.glu11A.object3D.matrixWorld);
    this.glu12APosition.setFromMatrixPosition(this.glu12A.object3D.matrixWorld);

    this.glu5BPosition.setFromMatrixPosition(this.glu5B.object3D.matrixWorld);
    this.glu6BPosition.setFromMatrixPosition(this.glu6B.object3D.matrixWorld);
    this.glu11BPosition.setFromMatrixPosition(this.glu11B.object3D.matrixWorld);
    this.glu12BPosition.setFromMatrixPosition(this.glu12B.object3D.matrixWorld);

    // Storing a reference of all elements in arrays for easier handling
    const lysineA = [this.lys15A, this.lys16A, this.lys17A];
    const lysineB = [this.lys15B, this.lys16B, this.lys17B];

    const glutamateA = [this.glu11A, this.glu12A];
    const glutamateB = [this.glu11B, this.glu12B];

    // Storing a reference of all positions in arrays for easier handling
    const lysineAPositions = [
      this.lys15APosition,
      this.lys16APosition,
      this.lys17APosition,
    ];
    const lysineBPositions = [
      this.lys15BPosition,
      this.lys16BPosition,
      this.lys17BPosition,
    ];

    const glutamateAPositions = [this.glu11APosition, this.glu12APosition];
    const glutamateBPositions = [this.glu11BPosition, this.glu12BPosition];

    // Which side of each molecule is visible? Select corresponding positions & elements
    const lysineSide = this.visibleMarkers.includes("lysA") ? "A" : "B";
    const glutamateSide = this.visibleMarkers.includes("gluA") ? "A" : "B";

    const lysinePositions =
      lysineSide === "A" ? lysineAPositions : lysineBPositions;
    const glutamatePositions =
      glutamateSide === "A" ? glutamateAPositions : glutamateBPositions;

    const lysine = lysineSide === "A" ? lysineA : lysineB;
    const glutamate = glutamateSide === "A" ? glutamateA : glutamateB;

    // Calc distances
    let closestDistance = 10000000;
    let closestLysine;
    let closestGlutamate;

    lysinePositions.forEach((lysineItem, lysineIndex) => {
      glutamatePositions.forEach((glutamateItem, glutamateIndex) => {
        const distance =
          2 *
          Math.sqrt(
            Math.pow(glutamateItem.x - lysineItem.x, 2) +
              Math.pow(glutamateItem.y - lysineItem.y, 2) +
              Math.pow(glutamateItem.z - lysineItem.z, 2)
          );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestLysine = lysineIndex;
          closestGlutamate = glutamateIndex;
        }
      });
    });

    // What shoud be bridge's direction?
    if (this.lys_prot == 1) {
      [...this.connectors].forEach((connector, index) => {
        // If closestGlutamate is glu11, its corrsponding oxygen is glu6
        // If closestGlutamate is glu12, its corrsponding oxygen is glu5
        const correspondingOxygen = closestGlutamate === 0 ? "glu6" : "glu5";
        connector.setAttribute(
          "connector",
          `src: #lys${
            closestLysine + 15
          }${lysineSide}; dest: #${correspondingOxygen}${glutamateSide}; alpha: ` +
            index / 10
        );
      });
    } else if (this.glu_prot == 1) {
      [...this.connectors].forEach((connector, index) => {
        connector.setAttribute(
          "connector",
          `src: #lys6${lysineSide}; dest: #glu11${glutamateSide}; alpha: ` +
            index / 10
        );
      });
    } else if (this.glu_prot == 2) {
      [...this.connectors].forEach((connector, index) => {
        connector.setAttribute(
          "connector",
          `src: #lys6${lysineSide}; dest: #glu12${glutamateSide}; alpha: ` +
            index / 10
        );
      });
    }

    // Which element are closer? should we display bridge?
    const isClosestLysineVisible = lysine[closestLysine].getAttribute(
      "visible"
    );
    const isClosestGlutamateVisible = glutamate[closestGlutamate].getAttribute(
      "visible"
    );

    if (closestDistance < 2) {
      this.bridge.setAttribute("visible", true);
      if (
        closestGlutamate === 0 &&
        (this.glu_prot == 0 || this.glu_prot == 1)
      ) {
        if (Math.random() < 0.2) {
          if (
            isClosestGlutamateVisible &&
            !isClosestLysineVisible &&
            this.lys_prot === 0
          ) {
            lysineA[closestLysine].setAttribute("visible", true);
            lysineB[closestLysine].setAttribute("visible", true);
            this.glu11A.setAttribute("visible", false);
            this.glu11B.setAttribute("visible", false);
            this.glu_prot = 0;
            this.lys_prot = 1;
          }
        } else {
          if (
            !isClosestGlutamateVisible &&
            isClosestLysineVisible &&
            this.lys_prot === 1
          ) {
            lysineA[closestLysine].setAttribute("visible", false);
            lysineB[closestLysine].setAttribute("visible", false);
            this.glu11A.setAttribute("visible", true);
            this.glu11B.setAttribute("visible", true);
            this.glu_prot = 1;
            this.lys_prot = 0;
          }
        }
      } else if (
        closestGlutamate === 1 &&
        (this.glu_prot == 0 || this.glu_prot == 2)
      ) {
        if (Math.random() < 0.2) {
          if (
            isClosestGlutamateVisible &&
            !isClosestLysineVisible &&
            this.lys_prot === 0
          ) {
            lysineA[closestLysine].setAttribute("visible", true);
            lysineB[closestLysine].setAttribute("visible", true);
            this.glu12A.setAttribute("visible", false);
            this.glu12B.setAttribute("visible", false);
            this.glu_prot = 0;
            this.lys_prot = 1;
          }
        } else {
          if (
            !isClosestGlutamateVisible &&
            isClosestLysineVisible &&
            this.lys_prot === 1
          ) {
            lysineA[closestLysine].setAttribute("visible", false);
            lysineB[closestLysine].setAttribute("visible", false);
            this.glu12A.setAttribute("visible", true);
            this.glu12B.setAttribute("visible", true);
            this.glu_prot = 2;
            this.lys_prot = 0;
          }
        }
      }
    } else {
      this.bridge.setAttribute("visible", false);
    }
  },

  reset: function () {
    // Reset Glutamate
    this.glu11A.setAttribute("visible", false);
    this.glu11B.setAttribute("visible", false);
    this.glu12A.setAttribute("visible", false);
    this.glu12B.setAttribute("visible", false);

    // Reset Lysine
    this.lys17A.setAttribute("visible", true);
    this.lys17B.setAttribute("visible", true);
    this.lys16A.setAttribute("visible", true);
    this.lys16B.setAttribute("visible", true);
    this.lys15A.setAttribute("visible", true);
    this.lys15B.setAttribute("visible", true);

    this.lys_prot = 1; 
    this.glu_prot = 0;
  }
});

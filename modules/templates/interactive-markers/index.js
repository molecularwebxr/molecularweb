/* global AFRAME, THREE */

AFRAME.registerComponent("interactive-molecules", {
  init: function () {
    // Get elements from the scene

    // Water - Side A & Side B
    this.wat1A = this.el.sceneEl.querySelector("#wat1A");
    this.wat1B = this.el.sceneEl.querySelector("#wat1B");

    // Second water (vat) - Side A & Side B
    this.vat1A = this.el.sceneEl.querySelector("#vat1A");
    this.vat1B = this.el.sceneEl.querySelector("#vat1B");

    // Bridge
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");

    // Create Position vectors for further use
    this.wat1APosition = new THREE.Vector3();
    this.wat1BPosition = new THREE.Vector3();

    this.vat1APosition = new THREE.Vector3();
    this.vat1BPosition = new THREE.Vector3();

    // Not used in this sample. This vars are here as reminder of placing them here.
    this.protoWat = 2;
    this.protoVat = 2;

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
    const areMarkersInvalid =
      (this.visibleMarkers.includes("watA") &&
        this.visibleMarkers.includes("watB")) ||
      (this.visibleMarkers.includes("vatA") &&
        this.visibleMarkers.includes("vatB"));

    const areEnoughMarkers = this.visibleMarkers.length === 2;

    if (areMarkersInvalid || !areEnoughMarkers) {
      this.bridge.setAttribute("visible", false);
      return;
    }

    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.wat1APosition.setFromMatrixPosition(this.wat1A.object3D.matrixWorld);
    this.wat1BPosition.setFromMatrixPosition(this.wat1B.object3D.matrixWorld);
    this.vat1APosition.setFromMatrixPosition(this.vat1A.object3D.matrixWorld);
    this.vat1BPosition.setFromMatrixPosition(this.vat1B.object3D.matrixWorld);

    // Store a reference of all elements in arrays for easier handling
    const waterA = [this.wat1A];
    const waterB = [this.wat1B];

    const vaterA = [this.vat1A];
    const vaterB = [this.vat1B];

    // Store a reference of all positions in arrays for easier handling
    const waterAPositions = [this.wat1APosition];
    const waterBPositions = [this.wat1BPosition];
    const vaterAPositions = [this.vat1APosition];
    const vaterBPositions = [this.vat1BPosition];

    // Which side of each molecule is visible? Select corresponding positions & elements
    const waterSide = this.visibleMarkers.includes("watA") ? "A" : "B";
    const vaterSide = this.visibleMarkers.includes("vatA") ? "A" : "B";

    const waterPositions =
      waterSide === "A" ? waterAPositions : waterBPositions;
    const vaterPositions =
      vaterSide === "A" ? vaterAPositions : vaterBPositions;

    const water = waterSide === "A" ? waterA : waterB;
    const vater = vaterSide === "A" ? vaterA : vaterB;

    let closestDistance = 10000000;
    let closestWater;
    let closestVater;

    // Calc distances
    waterPositions.forEach((waterItem, waterIndex) => {
      vaterPositions.forEach((vaterItem, vaterIndex) => {
        const distance =
          2 *
          Math.sqrt(
            Math.pow(vaterItem.x - waterItem.x, 2) +
              Math.pow(vaterItem.y - waterItem.y, 2) +
              Math.pow(vaterItem.z - waterItem.z, 2)
          );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestWater = waterIndex;
          closestVater = vaterIndex;
        }
      });
    });

    // Not used here but may be useful to know if the closest molecules are visible or not
    const isClosestWaterVisible = water[closestWater].getAttribute("visible");
    const isClosestVaterVisible = vater[closestVater].getAttribute("visible");

    // Here should be the logic to apply to molecules according to its distance and visibility
    // Just showing the bridge as example
    // For examples of this logic take a look at acids & bases activities
    if (closestDistance < 5.5) {
      this.bridge.setAttribute("visible", true);
      [...this.connectors].forEach((connector, index) => {
        connector.setAttribute(
          "connector",
          `src: #vat${closestVater + 1}${vaterSide}; dest: #wat${
            closestWater + 1
          }${waterSide}; alpha: ` +
            index / 10
        );
      });
    } else {
      this.bridge.setAttribute("visible", false);
    }
  },

  reset: function () {
    // Add here the code to reset molecules to their initial state.
    // Only reset molecule state. Rotation & scale will be restored on their own components
    console.log("Reset molecules");
  },
});

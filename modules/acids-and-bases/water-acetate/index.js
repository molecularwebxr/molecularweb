/* global AFRAME, THREE */

AFRAME.registerComponent("interactive-molecules", {
  init: function() {
    // Get elements from the scene

    // Water Side A & Side B
    this.wat2A = this.el.sceneEl.querySelector("#wat2A");
    this.wat3A = this.el.sceneEl.querySelector("#wat3A");
    this.wat4A = this.el.sceneEl.querySelector("#wat4A");
    this.wat5A = this.el.sceneEl.querySelector("#wat5A");
    this.watorb2A = this.el.sceneEl.querySelector("#watorb2A");
    this.watorb3A = this.el.sceneEl.querySelector("#watorb3A");
    this.watorb4A = this.el.sceneEl.querySelector("#watorb4A");
    this.watorb5A = this.el.sceneEl.querySelector("#watorb5A");
    this.wat2B = this.el.sceneEl.querySelector("#wat2B");
    this.wat3B = this.el.sceneEl.querySelector("#wat3B");
    this.wat4B = this.el.sceneEl.querySelector("#wat4B");
    this.wat5B = this.el.sceneEl.querySelector("#wat5B");
    this.watorb2B = this.el.sceneEl.querySelector("#watorb2B");
    this.watorb3B = this.el.sceneEl.querySelector("#watorb3B");
    this.watorb4B = this.el.sceneEl.querySelector("#watorb4B");
    this.watorb5B = this.el.sceneEl.querySelector("#watorb5B");

    // Acetate Side A & Side B
    this.ace7A = this.el.sceneEl.querySelector("#ace7A");
    this.ace8A = this.el.sceneEl.querySelector("#ace8A");
    this.aceorb7A = this.el.sceneEl.querySelector("#aceorb7A");
    this.aceorb8A = this.el.sceneEl.querySelector("#aceorb8A");
    this.ace7B = this.el.sceneEl.querySelector("#ace7B");
    this.ace8B = this.el.sceneEl.querySelector("#ace8B");
    this.aceorb7B = this.el.sceneEl.querySelector("#aceorb7B");
    this.aceorb8B = this.el.sceneEl.querySelector("#aceorb8B");

    // Bridge
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");

    // Create Position vectors for further usage
    this.wat2APosition = new THREE.Vector3();
    this.wat3APosition = new THREE.Vector3();
    this.wat4APosition = new THREE.Vector3();
    this.wat5APosition = new THREE.Vector3();
    this.ace7APosition = new THREE.Vector3();
    this.ace8APosition = new THREE.Vector3();
    this.wat2BPosition = new THREE.Vector3();
    this.wat3BPosition = new THREE.Vector3();
    this.wat4BPosition = new THREE.Vector3();
    this.wat5BPosition = new THREE.Vector3();
    this.ace7BPosition = new THREE.Vector3();
    this.ace8BPosition = new THREE.Vector3();

    this.protoWat = 2; 
    this.protoAce = 1; 

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

  tick: function(t) {
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
      (this.visibleMarkers.includes("aceA") &&
        this.visibleMarkers.includes("aceB"));
    
    const areEnoughMarkers = this.visibleMarkers.length === 2;

    if (areMarkersInvalid || !areEnoughMarkers) {
      this.bridge.setAttribute("visible", false);
      return;
    }

    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.wat2APosition.setFromMatrixPosition(this.wat2A.object3D.matrixWorld);
    this.wat3APosition.setFromMatrixPosition(this.wat3A.object3D.matrixWorld);
    this.wat4APosition.setFromMatrixPosition(this.wat4A.object3D.matrixWorld);
    this.wat5APosition.setFromMatrixPosition(this.wat5A.object3D.matrixWorld);

    this.wat2BPosition.setFromMatrixPosition(this.wat2B.object3D.matrixWorld);
    this.wat3BPosition.setFromMatrixPosition(this.wat3B.object3D.matrixWorld);
    this.wat4BPosition.setFromMatrixPosition(this.wat4B.object3D.matrixWorld);
    this.wat5BPosition.setFromMatrixPosition(this.wat5B.object3D.matrixWorld);

    this.ace7APosition.setFromMatrixPosition(this.ace7A.object3D.matrixWorld);
    this.ace8APosition.setFromMatrixPosition(this.ace8A.object3D.matrixWorld);

    this.ace7BPosition.setFromMatrixPosition(this.ace7B.object3D.matrixWorld);
    this.ace8BPosition.setFromMatrixPosition(this.ace8B.object3D.matrixWorld);

    // Storing a reference of all elements in arrays for easier handling
    const waterA = [this.wat2A, this.wat3A, this.wat4A, this.wat5A];
    const waterOrbitalsA = [
      this.watorb2A,
      this.watorb3A,
      this.watorb4A,
      this.watorb5A
    ];

    const waterB = [this.wat2B, this.wat3B, this.wat4B, this.wat5B];
    const waterOrbitalsB = [
      this.watorb2B,
      this.watorb3B,
      this.watorb4B,
      this.watorb5B
    ];

    const acetateA = [this.ace7A, this.ace8A];
    const acetateOrbitalsA = [this.aceorb7A, this.aceorb8A];

    const acetateB = [this.ace7B, this.ace8B];
    const acetateOrbitalsB = [this.aceorb7B, this.aceorb8B];

    // Storing a reference of all positions in arrays for easier handling
    const waterAPositions = [this.wat2APosition, this.wat3APosition, this.wat4APosition, this.wat5APosition];
    const waterBPositions = [this.wat2BPosition, this.wat3BPosition, this.wat4BPosition, this.wat5BPosition];
    
    const acetateAPositions = [this.ace7APosition, this.ace8APosition];
    const acetateBPositions = [this.ace7BPosition, this.ace8BPosition];

    // Which side of each molecule is visible? Select corresponding positions & elements
    const waterSide = this.visibleMarkers.includes("watA") ? "A" : "B";
    const acetateSide = this.visibleMarkers.includes("aceA") ? "A" : "B";

    const waterPositions = waterSide === "A" ? waterAPositions : waterBPositions;
    const acetatePositions = acetateSide === "A" ? acetateAPositions : acetateBPositions;

    const water = waterSide === "A" ? waterA : waterB;
    const acetate = acetateSide === "A" ? acetateA : acetateB;

    let closestDistance = 10000000;
    let closestWater;
    let closestAcetate;

    // Calc distances
    waterPositions.forEach((waterItem, waterIndex) => {
      acetatePositions.forEach((acetateItem, acetateIndex) => {
        const distance =
          2 *
          Math.sqrt(
            Math.pow(acetateItem.x - waterItem.x, 2) +
              Math.pow(acetateItem.y - waterItem.y, 2) +
              Math.pow(acetateItem.z - waterItem.z, 2)
          );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestWater = waterIndex;
          closestAcetate = acetateIndex;
        }
      });
    });

    const isClosestWaterVisible = water[closestWater].getAttribute("visible");
    const isClosestAcetateVisible = acetate[closestAcetate].getAttribute("visible");

    if (closestDistance < 3.5) {
      if (
        (isClosestWaterVisible && !isClosestAcetateVisible) ||
        (!isClosestWaterVisible && isClosestAcetateVisible)
      ) {
        // Make bridge visible and set its src/dest
        this.bridge.setAttribute("visible", true);
        [...this.connectors].forEach((connector, index) => {
          connector.setAttribute(
            "connector",
            `src: #ace${closestAcetate + 7}${acetateSide}; dest: #wat${closestWater + 2}${waterSide}; alpha: ` + index / 10
          );
        });

        if (closestDistance < 3 && Math.random() < 0.7) {
          if (
            isClosestWaterVisible &&
            !isClosestAcetateVisible & (this.protoWat === 3)
          ) {
            // Transfers from water to ace
            waterA[closestWater].setAttribute("visible", false);
            waterB[closestWater].setAttribute("visible", false);
            acetateA[closestAcetate].setAttribute("visible", true);
            acetateB[closestAcetate].setAttribute("visible", true);
            waterOrbitalsA[closestWater].setAttribute("visible", true);
            waterOrbitalsB[closestWater].setAttribute("visible", true);
            acetateOrbitalsA[closestAcetate].setAttribute("visible", false);
            acetateOrbitalsB[closestAcetate].setAttribute("visible", false);
            this.protoWat = 2;
            this.protoAce = 1;
          } else if (
            !isClosestWaterVisible &&
            isClosestAcetateVisible & (this.protoWat === 2)
          ) {
            // Transfers from ace to water
            waterA[closestWater].setAttribute("visible", true);
            waterB[closestWater].setAttribute("visible", true);
            acetateA[closestAcetate].setAttribute("visible", false);
            acetateB[closestAcetate].setAttribute("visible", false);
            waterOrbitalsA[closestWater].setAttribute("visible", false);
            waterOrbitalsB[closestWater].setAttribute("visible", false);
            acetateOrbitalsA[closestAcetate].setAttribute("visible", true);
            acetateOrbitalsB[closestAcetate].setAttribute("visible", true);
            this.protoWat = 3;
            this.protoAce = 0;
          }
        }
      }
    } else {
      this.bridge.setAttribute("visible", false);
    }
  },

  reset: function() {
    this.protoWat = 2; 
    this.protoAce = 1;

    this.wat2A.setAttribute("visible", false);
    this.wat2B.setAttribute("visible", false);

    this.wat3A.setAttribute("visible", true);
    this.wat3B.setAttribute("visible", true);

    this.wat4A.setAttribute("visible", false);
    this.wat4B.setAttribute("visible", false);

    this.wat5A.setAttribute("visible", true);
    this.wat5B.setAttribute("visible", true);

    this.watorb2A.setAttribute("visible", true);
    this.watorb2B.setAttribute("visible", true);

    this.watorb3A.setAttribute("visible", false);
    this.watorb3B.setAttribute("visible", false);

    this.watorb4A.setAttribute("visible", true);
    this.watorb4B.setAttribute("visible", true);

    this.watorb5A.setAttribute("visible", false);
    this.watorb5B.setAttribute("visible", false);

    this.ace7A.setAttribute("visible", true);
    this.ace7B.setAttribute("visible", true);

    this.ace8A.setAttribute("visible", false);
    this.ace8B.setAttribute("visible", false);

    this.aceorb7A.setAttribute("visible", false);
    this.aceorb7B.setAttribute("visible", false);

    this.aceorb8A.setAttribute("visible", true);
    this.aceorb8B.setAttribute("visible", true);

  }
});

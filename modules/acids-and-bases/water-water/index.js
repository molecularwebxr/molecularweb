/* global AFRAME, THREE */

AFRAME.registerComponent("interactive-molecules", {
  init: function () {
    // Get elements from the scene

    // Water - Side A & Side B
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

    // Second water (vat) - Side A & Side B
    this.vat2A = this.el.sceneEl.querySelector("#vat2A");
    this.vat3A = this.el.sceneEl.querySelector("#vat3A");
    this.vat4A = this.el.sceneEl.querySelector("#vat4A");
    this.vat5A = this.el.sceneEl.querySelector("#vat5A");
    this.vatorb2A = this.el.sceneEl.querySelector("#vatorb2A");
    this.vatorb3A = this.el.sceneEl.querySelector("#vatorb3A");
    this.vatorb4A = this.el.sceneEl.querySelector("#vatorb4A");
    this.vatorb5A = this.el.sceneEl.querySelector("#vatorb5A");
    this.vat2B = this.el.sceneEl.querySelector("#vat2B");
    this.vat3B = this.el.sceneEl.querySelector("#vat3B");
    this.vat4B = this.el.sceneEl.querySelector("#vat4B");
    this.vat5B = this.el.sceneEl.querySelector("#vat5B");
    this.vatorb2B = this.el.sceneEl.querySelector("#vatorb2B");
    this.vatorb3B = this.el.sceneEl.querySelector("#vatorb3B");
    this.vatorb4B = this.el.sceneEl.querySelector("#vatorb4B");
    this.vatorb5B = this.el.sceneEl.querySelector("#vatorb5B");

    // Bridge
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");

    // Create Position vectors for further use
    this.wat2APosition = new THREE.Vector3();
    this.wat3APosition = new THREE.Vector3();
    this.wat4APosition = new THREE.Vector3();
    this.wat5APosition = new THREE.Vector3();
    this.vat2APosition = new THREE.Vector3();
    this.vat3APosition = new THREE.Vector3();
    this.vat4APosition = new THREE.Vector3();
    this.vat5APosition = new THREE.Vector3();
    this.wat2BPosition = new THREE.Vector3();
    this.wat3BPosition = new THREE.Vector3();
    this.wat4BPosition = new THREE.Vector3();
    this.wat5BPosition = new THREE.Vector3();
    this.vat2BPosition = new THREE.Vector3();
    this.vat3BPosition = new THREE.Vector3();
    this.vat4BPosition = new THREE.Vector3();
    this.vat5BPosition = new THREE.Vector3();

    this.protoWat = 2; //cada una empieza con 2 y puede ganar o perder un H
    this.protoVat = 2;

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
    this.wat2APosition.setFromMatrixPosition(this.wat2A.object3D.matrixWorld);
    this.wat3APosition.setFromMatrixPosition(this.wat3A.object3D.matrixWorld);
    this.wat4APosition.setFromMatrixPosition(this.wat4A.object3D.matrixWorld);
    this.wat5APosition.setFromMatrixPosition(this.wat5A.object3D.matrixWorld);

    this.wat2BPosition.setFromMatrixPosition(this.wat2B.object3D.matrixWorld);
    this.wat3BPosition.setFromMatrixPosition(this.wat3B.object3D.matrixWorld);
    this.wat4BPosition.setFromMatrixPosition(this.wat4B.object3D.matrixWorld);
    this.wat5BPosition.setFromMatrixPosition(this.wat5B.object3D.matrixWorld);

    this.vat2APosition.setFromMatrixPosition(this.vat2A.object3D.matrixWorld);
    this.vat3APosition.setFromMatrixPosition(this.vat3A.object3D.matrixWorld);
    this.vat4APosition.setFromMatrixPosition(this.vat4A.object3D.matrixWorld);
    this.vat5APosition.setFromMatrixPosition(this.vat5A.object3D.matrixWorld);

    this.vat2BPosition.setFromMatrixPosition(this.vat2B.object3D.matrixWorld);
    this.vat3BPosition.setFromMatrixPosition(this.vat3B.object3D.matrixWorld);
    this.vat4BPosition.setFromMatrixPosition(this.vat4B.object3D.matrixWorld);
    this.vat5BPosition.setFromMatrixPosition(this.vat5B.object3D.matrixWorld);

    // Storing a reference of all elements in arrays for easier handling
    const waterA = [this.wat2A, this.wat3A, this.wat4A, this.wat5A];
    const waterB = [this.wat2B, this.wat3B, this.wat4B, this.wat5B];
    const waterOrbitalsA = [
      this.watorb2A,
      this.watorb3A,
      this.watorb4A,
      this.watorb5A,
    ];
    const waterOrbitalsB = [
      this.watorb2B,
      this.watorb3B,
      this.watorb4B,
      this.watorb5B,
    ];

    const vaterA = [this.vat2A, this.vat3A, this.vat4A, this.vat5A];
    const vaterB = [this.vat2B, this.vat3B, this.vat4B, this.vat5B];
    const vaterOrbitalsA = [
      this.vatorb2A,
      this.vatorb3A,
      this.vatorb4A,
      this.vatorb5A,
    ];
    const vaterOrbitalsB = [
      this.vatorb2B,
      this.vatorb3B,
      this.vatorb4B,
      this.vatorb5B,
    ];

    // Storing a reference of all positions in arrays for easier handling
    const waterAPositions = [
      this.wat2APosition,
      this.wat3APosition,
      this.wat4APosition,
      this.wat5APosition,
    ];
    const waterBPositions = [
      this.wat2BPosition,
      this.wat3BPosition,
      this.wat4BPosition,
      this.wat5BPosition,
    ];
    const vaterAPositions = [
      this.vat2APosition,
      this.vat3APosition,
      this.vat4APosition,
      this.vat5APosition,
    ];
    const vaterBPositions = [
      this.vat2BPosition,
      this.vat3BPosition,
      this.vat4BPosition,
      this.vat5BPosition,
    ];

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

    const isClosestWaterVisible = water[closestWater].getAttribute("visible");
    const isClosestVaterVisible = vater[closestVater].getAttribute("visible");

    if (closestDistance < 3.5) {
      if (
        (isClosestWaterVisible && !isClosestVaterVisible) ||
        (!isClosestWaterVisible && isClosestVaterVisible)
      ) {
        // Make bridge visible and set its src/dest
        this.bridge.setAttribute("visible", true);
        [...this.connectors].forEach((connector, index) => {
          connector.setAttribute(
            "connector",
            `src: #vat${closestVater + 2}${vaterSide}; dest: #wat${
              closestWater + 2
            }${waterSide}; alpha: ` +
              index / 10
          );
        });

        if (closestDistance < 3 && Math.random() < 0.7) {
          if (
            isClosestWaterVisible &&
            !isClosestVaterVisible & (this.protoWat === 3)
          ) {
            // Transfers from water H3O to vater OH giving H2O and H2O
            waterA[closestWater].setAttribute("visible", false);
            waterB[closestWater].setAttribute("visible", false);
            vaterA[closestVater].setAttribute("visible", true);
            vaterB[closestVater].setAttribute("visible", true);
            waterOrbitalsA[closestWater].setAttribute("visible", true);
            waterOrbitalsB[closestWater].setAttribute("visible", true);
            vaterOrbitalsA[closestVater].setAttribute("visible", false);
            vaterOrbitalsB[closestVater].setAttribute("visible", false);
            this.protoWat = 2;
            this.protoVat = 2;
          } else if (
            isClosestWaterVisible &&
            !isClosestVaterVisible & (this.protoWat === 2)
          ) {
            // Transfers from water H2O to vater H2O giving OH and H3O
            waterA[closestWater].setAttribute("visible", false);
            waterB[closestWater].setAttribute("visible", false);
            vaterA[closestVater].setAttribute("visible", true);
            vaterB[closestVater].setAttribute("visible", true);
            waterOrbitalsA[closestWater].setAttribute("visible", true);
            waterOrbitalsB[closestWater].setAttribute("visible", true);
            vaterOrbitalsA[closestVater].setAttribute("visible", false);
            vaterOrbitalsB[closestVater].setAttribute("visible", false);
            this.protoWat = 1;
            this.protoVat = 3;
          } else if (
            !isClosestWaterVisible &&
            isClosestVaterVisible & (this.protoWat === 2)
          ) {
            // Transfers from vater H2O to water H2O giving OH and H3O
            waterA[closestWater].setAttribute("visible", true);
            waterB[closestWater].setAttribute("visible", true);
            vaterA[closestVater].setAttribute("visible", false);
            vaterB[closestVater].setAttribute("visible", false);
            waterOrbitalsA[closestWater].setAttribute("visible", false);
            waterOrbitalsB[closestWater].setAttribute("visible", false);
            vaterOrbitalsA[closestVater].setAttribute("visible", true);
            vaterOrbitalsB[closestVater].setAttribute("visible", true);
            this.protoWat = 3;
            this.protoVat = 1;
          } else if (
            !isClosestWaterVisible &&
            isClosestVaterVisible & (this.protoWat === 1)
          ) {
            // Transfers from vater H3O to water HO giving H2O and H2O
            waterA[closestWater].setAttribute("visible", true);
            waterB[closestWater].setAttribute("visible", true);
            vaterA[closestVater].setAttribute("visible", false);
            vaterB[closestVater].setAttribute("visible", false);
            waterOrbitalsA[closestWater].setAttribute("visible", false);
            waterOrbitalsB[closestWater].setAttribute("visible", false);
            vaterOrbitalsA[closestVater].setAttribute("visible", true);
            vaterOrbitalsB[closestVater].setAttribute("visible", true);
            this.protoWat = 2;
            this.protoVat = 2;
          }
        }
      }
    } else {
      this.bridge.setAttribute("visible", false);
    }
  },

  reset: function () {
    this.protoWat = 2;
    this.protoVat = 2;

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

    this.vat2A.setAttribute("visible", false);
    this.vat2B.setAttribute("visible", false);

    this.vat3A.setAttribute("visible", true);
    this.vat3B.setAttribute("visible", true);

    this.vat4A.setAttribute("visible", false);
    this.vat4B.setAttribute("visible", false);

    this.vat5A.setAttribute("visible", true);
    this.vat5B.setAttribute("visible", true);

    this.vatorb2A.setAttribute("visible", true);
    this.vatorb2B.setAttribute("visible", true);

    this.vatorb3A.setAttribute("visible", false);
    this.vatorb3B.setAttribute("visible", false);

    this.vatorb4A.setAttribute("visible", true);
    this.vatorb4B.setAttribute("visible", true);

    this.vatorb5A.setAttribute("visible", false);
    this.vatorb5B.setAttribute("visible", false);
  },
});

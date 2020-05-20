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

    // Ammonium - Side A & Side B
    this.amo2A = this.el.sceneEl.querySelector("#amo2A");
    this.amo3A = this.el.sceneEl.querySelector("#amo3A");
    this.amo4A = this.el.sceneEl.querySelector("#amo4A");
    this.amo5A = this.el.sceneEl.querySelector("#amo5A");
    this.amoorb2A = this.el.sceneEl.querySelector("#amoorb2A");
    this.amoorb3A = this.el.sceneEl.querySelector("#amoorb3A");
    this.amoorb4A = this.el.sceneEl.querySelector("#amoorb4A");
    this.amoorb5A = this.el.sceneEl.querySelector("#amoorb5A");
    this.amo2B = this.el.sceneEl.querySelector("#amo2B");
    this.amo3B = this.el.sceneEl.querySelector("#amo3B");
    this.amo4B = this.el.sceneEl.querySelector("#amo4B");
    this.amo5B = this.el.sceneEl.querySelector("#amo5B");
    this.amoorb2B = this.el.sceneEl.querySelector("#amoorb2B");
    this.amoorb3B = this.el.sceneEl.querySelector("#amoorb3B");
    this.amoorb4B = this.el.sceneEl.querySelector("#amoorb4B");
    this.amoorb5B = this.el.sceneEl.querySelector("#amoorb5B");

    // Bridge
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");

    // Create Position vectors for further usage
    this.wat2APosition = new THREE.Vector3();
    this.wat3APosition = new THREE.Vector3();
    this.wat4APosition = new THREE.Vector3();
    this.wat5APosition = new THREE.Vector3();
    this.amo2APosition = new THREE.Vector3();
    this.amo3APosition = new THREE.Vector3();
    this.amo4APosition = new THREE.Vector3();
    this.amo5APosition = new THREE.Vector3();
    this.wat2BPosition = new THREE.Vector3();
    this.wat3BPosition = new THREE.Vector3();
    this.wat4BPosition = new THREE.Vector3();
    this.wat5BPosition = new THREE.Vector3();
    this.amo2BPosition = new THREE.Vector3();
    this.amo3BPosition = new THREE.Vector3();
    this.amo4BPosition = new THREE.Vector3();
    this.amo5BPosition = new THREE.Vector3();

    this.protoWat = 2; //agua comienza con 2 Hs unidos en su forma neutral; durante el programa puede perder 1 ganando carga negativa y pasando protowat a valer 1
    this.protoAmo = 3; //amonio comienza con 3 Hs unidos en su forma neutral; durante el programa puede ganar 1 ganando carga positiva y pasando protoamo a valer 4

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
      (this.visibleMarkers.includes("amoA") &&
        this.visibleMarkers.includes("amoB"));

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

    this.amo2APosition.setFromMatrixPosition(this.amo2A.object3D.matrixWorld);
    this.amo3APosition.setFromMatrixPosition(this.amo3A.object3D.matrixWorld);
    this.amo4APosition.setFromMatrixPosition(this.amo4A.object3D.matrixWorld);
    this.amo5APosition.setFromMatrixPosition(this.amo5A.object3D.matrixWorld);

    this.amo2BPosition.setFromMatrixPosition(this.amo2B.object3D.matrixWorld);
    this.amo3BPosition.setFromMatrixPosition(this.amo3B.object3D.matrixWorld);
    this.amo4BPosition.setFromMatrixPosition(this.amo4B.object3D.matrixWorld);
    this.amo5BPosition.setFromMatrixPosition(this.amo5B.object3D.matrixWorld);

    // Storing a reference of all elements in arrays for easier handling
    const waterA = [this.wat2A, this.wat3A, this.wat4A, this.wat5A];
    const waterOrbitalsA = [
      this.watorb2A,
      this.watorb3A,
      this.watorb4A,
      this.watorb5A,
    ];
    const waterB = [this.wat2B, this.wat3B, this.wat4B, this.wat5B];
    const waterOrbitalsB = [
      this.watorb2B,
      this.watorb3B,
      this.watorb4B,
      this.watorb5B,
    ];

    const ammoniumA = [this.amo2A, this.amo3A, this.amo4A, this.amo5A];
    const ammoniumOrbitalsA = [
      this.amoorb2A,
      this.amoorb3A,
      this.amoorb4A,
      this.amoorb5A,
    ];
    const ammoniumB = [this.amo2B, this.amo3B, this.amo4B, this.amo5B];
    const ammoniumOrbitalsB = [
      this.amoorb2B,
      this.amoorb3B,
      this.amoorb4B,
      this.amoorb5B,
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

    const ammoniumAPositions = [
      this.amo2APosition,
      this.amo3APosition,
      this.amo4APosition,
      this.amo5APosition,
    ];
    const ammoniumBPositions = [
      this.amo2BPosition,
      this.amo3BPosition,
      this.amo4BPosition,
      this.amo5BPosition,
    ];

    // Which side of each molecule is visible? Select corresponding positions & elements
    const waterSide = this.visibleMarkers.includes("watA") ? "A" : "B";
    const ammoniumSide = this.visibleMarkers.includes("amoA") ? "A" : "B";

    const waterPositions =
      waterSide === "A" ? waterAPositions : waterBPositions;
    const ammoniumPositions =
      ammoniumSide === "A" ? ammoniumAPositions : ammoniumBPositions;

    const water = waterSide === "A" ? waterA : waterB;
    const ammonium = ammoniumSide === "A" ? ammoniumA : ammoniumB;

    let closestDistance = 10000000;
    let closestWater;
    let closestAmmonium;

    // Calc distances
    waterPositions.forEach((waterItem, waterIndex) => {
      ammoniumPositions.forEach((ammoniumItem, ammoniumIndex) => {
        const distance =
          2 *
          Math.sqrt(
            Math.pow(ammoniumItem.x - waterItem.x, 2) +
              Math.pow(ammoniumItem.y - waterItem.y, 2) +
              Math.pow(ammoniumItem.z - waterItem.z, 2)
          );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestWater = waterIndex;
          closestAmmonium = ammoniumIndex;
        }
      });
    });

    const isClosestWaterVisible = water[closestWater].getAttribute("visible");
    const isClosestAmmoniumVisible = ammonium[closestAmmonium].getAttribute(
      "visible"
    );

    if (closestDistance < 3.5) {
      if (
        (isClosestWaterVisible && !isClosestAmmoniumVisible) ||
        (!isClosestWaterVisible && isClosestAmmoniumVisible)
      ) {
        // Make bridge visible and set its src/dest
        this.bridge.setAttribute("visible", true);
        [...this.connectors].forEach((connector, index) => {
          connector.setAttribute(
            "connector",
            `src: #amo${closestAmmonium + 2}${ammoniumSide}; dest: #wat${
              closestWater + 2
            }${waterSide}; alpha: ` +
              index / 10
          );
        });

        if (closestDistance < 3 && Math.random() < 0.7) {
          if (
            isClosestWaterVisible &&
            !isClosestAmmoniumVisible & (this.protoWat === 2)
          ) {
            // Transfers from water to ammo
            waterA[closestWater].setAttribute("visible", false);
            waterB[closestWater].setAttribute("visible", false);
            ammoniumA[closestAmmonium].setAttribute("visible", true);
            ammoniumB[closestAmmonium].setAttribute("visible", true);
            waterOrbitalsA[closestWater].setAttribute("visible", true);
            waterOrbitalsB[closestWater].setAttribute("visible", true);
            ammoniumOrbitalsA[closestAmmonium].setAttribute("visible", false);
            ammoniumOrbitalsB[closestAmmonium].setAttribute("visible", false);
            this.protoWat = 1;
            this.protoAmo = 4;
          } else if (
            !isClosestWaterVisible &&
            isClosestAmmoniumVisible & (this.protoWat === 1)
          ) {
            // Transfers from ammo to water
            waterA[closestWater].setAttribute("visible", true);
            waterB[closestWater].setAttribute("visible", true);
            ammoniumA[closestAmmonium].setAttribute("visible", false);
            ammoniumB[closestAmmonium].setAttribute("visible", false);
            waterOrbitalsA[closestWater].setAttribute("visible", false);
            waterOrbitalsB[closestWater].setAttribute("visible", false);
            ammoniumOrbitalsA[closestAmmonium].setAttribute("visible", true);
            ammoniumOrbitalsB[closestAmmonium].setAttribute("visible", true);
            this.protoWat = 2;
            this.protoAmo = 3;
          }
        }
      }
    } else {
      this.bridge.setAttribute("visible", false);
    }
  },

  reset: function () {
    this.protoWat = 2;
    this.protoAmo = 3;

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

    this.amo2A.setAttribute("visible", true);
    this.amo2B.setAttribute("visible", true);

    this.amo3A.setAttribute("visible", true);
    this.amo3B.setAttribute("visible", true);

    this.amo4A.setAttribute("visible", false);
    this.amo4B.setAttribute("visible", false);

    this.amo5A.setAttribute("visible", true);
    this.amo5B.setAttribute("visible", true);

    this.amoorb2A.setAttribute("visible", false);
    this.amoorb2B.setAttribute("visible", false);

    this.amoorb3A.setAttribute("visible", false);
    this.amoorb3B.setAttribute("visible", false);

    this.amoorb4A.setAttribute("visible", true);
    this.amoorb4B.setAttribute("visible", true);

    this.amoorb5A.setAttribute("visible", false);
    this.amoorb5B.setAttribute("visible", false);
  },
});

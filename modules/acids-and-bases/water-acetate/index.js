/* global AFRAME, THREE */

AFRAME.registerComponent("update-stuff", {
  init: function() {
    // Get elements from the scene
    // Water
    this.wat2 = this.el.sceneEl.querySelector("#wat2");
    this.wat3 = this.el.sceneEl.querySelector("#wat3");
    this.wat4 = this.el.sceneEl.querySelector("#wat4");
    this.wat5 = this.el.sceneEl.querySelector("#wat5");
    this.watorb2 = this.el.sceneEl.querySelector("#watorb2");
    this.watorb3 = this.el.sceneEl.querySelector("#watorb3");
    this.watorb4 = this.el.sceneEl.querySelector("#watorb4");
    this.watorb5 = this.el.sceneEl.querySelector("#watorb5");

    // Acetate
    this.ace7 = this.el.sceneEl.querySelector("#ace7");
    this.ace8 = this.el.sceneEl.querySelector("#ace8");
    this.aceorb7 = this.el.sceneEl.querySelector("#aceorb7");
    this.aceorb8 = this.el.sceneEl.querySelector("#aceorb8");

    // Bridge
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");

    // Create Position vectors for further usage
    this.wat2Position = new THREE.Vector3();
    this.wat3Position = new THREE.Vector3();
    this.wat4Position = new THREE.Vector3();
    this.wat5Position = new THREE.Vector3();
    this.ace7Position = new THREE.Vector3();
    this.ace8Position = new THREE.Vector3();

    this.protoWat = 2; //agua comienza con 2 Hs unidos en su forma neutral; durante el programa puede ganar 1 ganando carga positiva y pasando protowat a valer 3
    this.protoAce = 1; //amonio comienza con 3 Hs unidos en su forma neutral; durante el programa puede perder 1 ganando carga negativa y pasando protoamo a valer 0

    this.interval = 200; // Interval for running tick function - in ms
  },

  tick: function(t) {
    // Run on an interval.
    if (t - this.time < this.interval) {
      return;
    }
    this.time = t;

    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.wat2Position.setFromMatrixPosition(this.wat2.object3D.matrixWorld);
    this.wat3Position.setFromMatrixPosition(this.wat3.object3D.matrixWorld);
    this.wat4Position.setFromMatrixPosition(this.wat4.object3D.matrixWorld);
    this.wat5Position.setFromMatrixPosition(this.wat5.object3D.matrixWorld);
    this.ace7Position.setFromMatrixPosition(this.ace7.object3D.matrixWorld);
    this.ace8Position.setFromMatrixPosition(this.ace8.object3D.matrixWorld);

    // Storing a reference of all elements in arrays for easier handling
    const water = [this.wat2, this.wat3, this.wat4, this.wat5];
    const waterOrbitals = [
      this.watorb2,
      this.watorb3,
      this.watorb4,
      this.watorb5
    ];
    const acetate = [this.ace7, this.ace8];
    const acetateOrbitals = [this.aceorb7, this.aceorb8];

    // Storing a reference of all positions in arrays for easier handling
    const waterPositions = [
      this.wat2Position,
      this.wat3Position,
      this.wat4Position,
      this.wat5Position
    ];
    const acetatePositions = [this.ace7Position, this.ace8Position];

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
    const isClosestAcetateVisible = acetate[closestAcetate].getAttribute(
      "visible"
    );

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
            `src: #ace${closestAcetate + 7}; dest: #wat${closestWater +
              2}; alpha: ` +
              index / 10
          );
        });

        if (closestDistance < 3 && Math.random() < 0.7) {
          if (
            isClosestWaterVisible &&
            !isClosestAcetateVisible & (this.protoWat === 3)
          ) {
            // Transfers from water to ace
            water[closestWater].setAttribute("visible", false);
            acetate[closestAcetate].setAttribute("visible", true);
            waterOrbitals[closestWater].setAttribute("visible", true);
            acetateOrbitals[closestAcetate].setAttribute("visible", false);
            this.protoWat = 2;
            this.protoAce = 1;
          } else if (
            !isClosestWaterVisible &&
            isClosestAcetateVisible & (this.protoWat === 2)
          ) {
            // Transfers from ace to water
            water[closestWater].setAttribute("visible", true);
            acetate[closestAcetate].setAttribute("visible", false);
            waterOrbitals[closestWater].setAttribute("visible", false);
            acetateOrbitals[closestAcetate].setAttribute("visible", true);
            this.protoWat = 3;
            this.protoAce = 0;
          }
        }
      }
    } else {
      this.bridge.setAttribute("visible", false);
    }
  }
});

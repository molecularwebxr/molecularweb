/* global AFRAME, THREE */

AFRAME.registerComponent("update-stuff", {
  init: function() {
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
    // this.bridge = this.el.sceneEl.querySelector("#bridge");
    // this.connectors = this.bridge.querySelectorAll("*");
    
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
    
    this.interval = 200 // Interval for running tick function - in ms

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
  },
  
  tick: function(t) {
    
    // Run on an interval.
    if (t - this.time < this.interval) { return; };
    this.time = t;

    console.log(this.visibleMarkers);
    
    // this.el.sceneEl.object3D.updateMatrixWorld();

    // //  Get positions
    // this.wat2Position.setFromMatrixPosition(this.wat2.object3D.matrixWorld);
    // this.wat3Position.setFromMatrixPosition(this.wat3.object3D.matrixWorld);
    // this.wat4Position.setFromMatrixPosition(this.wat4.object3D.matrixWorld);
    // this.wat5Position.setFromMatrixPosition(this.wat5.object3D.matrixWorld);
    // this.amo2Position.setFromMatrixPosition(this.amo2.object3D.matrixWorld);
    // this.amo3Position.setFromMatrixPosition(this.amo3.object3D.matrixWorld);
    // this.amo4Position.setFromMatrixPosition(this.amo4.object3D.matrixWorld);
    // this.amo5Position.setFromMatrixPosition(this.amo5.object3D.matrixWorld);

    // // Storing a reference of all elements in arrays for easier handling
    // const water = [this.wat2, this.wat3, this.wat4, this.wat5];
    // const waterOrbitals = [this.watorb2, this.watorb3, this.watorb4, this.watorb5];
    // const ammonium = [this.amo2, this.amo3, this.amo4, this.amo5];
    // const ammoniumOrbitals = [this.amoorb2, this.amoorb3, this.amoorb4, this.amoorb5];
    
    // // Storing a reference of all positions in arrays for easier handling
    // const waterPositions = [this.wat2Position, this.wat3Position, this.wat4Position, this.wat5Position];
    // const ammoniumPositions = [this.amo2Position, this.amo3Position, this.amo4Position, this.amo5Position];
    
    // let closestDistance = 10000000;
    // let closestWater;
    // let closestAmmonium;
    
    // // Calc distances
    // waterPositions.forEach((waterItem, waterIndex) => {
    //   ammoniumPositions.forEach((ammoniumItem, ammoniumIndex) => {
    //     const distance = 2 * Math.sqrt(Math.pow(ammoniumItem.x-waterItem.x,2) + Math.pow(ammoniumItem.y-waterItem.y,2) + Math.pow(ammoniumItem.z-waterItem.z,2));
    //     if(distance < closestDistance) {
    //       closestDistance = distance;
    //       closestWater = waterIndex;
    //       closestAmmonium = ammoniumIndex;
    //     }
    //   });
    // });
    
    // const isClosestWaterVisible = water[closestWater].getAttribute('visible');
    // const isClosestAmmoniumVisible = ammonium[closestAmmonium].getAttribute('visible');
    
    // if(closestDistance < 3.5) {
    //   if(isClosestWaterVisible && !isClosestAmmoniumVisible || !isClosestWaterVisible && isClosestAmmoniumVisible) {
    //     // Make bridge visible and set its src/dest
    //      this.bridge.setAttribute("visible", true);
    //      [...this.connectors].forEach((connector, index) => {
    //       connector.setAttribute(
    //         "connector",
    //         `src: #amo${closestAmmonium + 2}; dest: #wat${closestWater + 2}; alpha: ` + index / 10,
    //       );
    //     });
        
    //     if (closestDistance<3 && Math.random() < 0.7) {
    //       if(isClosestWaterVisible && !isClosestAmmoniumVisible & this.protoWat === 2) {
    //         // Transfers from water to ammo
    //         water[closestWater].setAttribute('visible', false);
    //         ammonium[closestAmmonium].setAttribute('visible', true);
    //         waterOrbitals[closestWater].setAttribute('visible', true);
    //         ammoniumOrbitals[closestAmmonium].setAttribute('visible', false);
    //         this.protoWat = 1;
    //         this.protoAmo = 4;
    //       } else if(!isClosestWaterVisible && isClosestAmmoniumVisible & this.protoWat === 1) {
    //           // Transfers from ammo to water
    //           water[closestWater].setAttribute('visible', true);
    //           ammonium[closestAmmonium].setAttribute('visible', false);
    //           waterOrbitals[closestWater].setAttribute('visible', false);
    //           ammoniumOrbitals[closestAmmonium].setAttribute('visible', true);
    //           this.protoWat = 2;
    //           this.protoAmo = 3;
    //         }
    //     }
    //   }
    // } else {
    //   this.bridge.setAttribute("visible", false);
    // }
 }
});

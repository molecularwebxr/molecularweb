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
    
    // Second water (vat)
    this.vat2 = this.el.sceneEl.querySelector("#vat2");
    this.vat3 = this.el.sceneEl.querySelector("#vat3");
    this.vat4 = this.el.sceneEl.querySelector("#vat4");
    this.vat5 = this.el.sceneEl.querySelector("#vat5");
    this.vatorb2 = this.el.sceneEl.querySelector("#vatorb2");
    this.vatorb3 = this.el.sceneEl.querySelector("#vatorb3");
    this.vatorb4 = this.el.sceneEl.querySelector("#vatorb4");
    this.vatorb5 = this.el.sceneEl.querySelector("#vatorb5");
    
    // Bridge
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");
    
    // Create Position vectors for further use
    this.wat2Position = new THREE.Vector3();
    this.wat3Position = new THREE.Vector3();
    this.wat4Position = new THREE.Vector3();
    this.wat5Position = new THREE.Vector3();
    
    this.vat2Position = new THREE.Vector3();
    this.vat3Position = new THREE.Vector3();
    this.vat4Position = new THREE.Vector3();
    this.vat5Position = new THREE.Vector3();

    this.protoWat = 2; //cada una empieza con 2 y puede ganar o perder un H
    this.protoVat = 2;

    this.interval = 200 // Interval for running tick function - in ms
  },
  
  tick: function(t) {
    
    // Run on an interval.
    if (t - this.time < this.interval) { return; };
    this.time = t;
    
    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.wat2Position.setFromMatrixPosition(this.wat2.object3D.matrixWorld);
    this.wat3Position.setFromMatrixPosition(this.wat3.object3D.matrixWorld);
    this.wat4Position.setFromMatrixPosition(this.wat4.object3D.matrixWorld);
    this.wat5Position.setFromMatrixPosition(this.wat5.object3D.matrixWorld);

    this.vat2Position.setFromMatrixPosition(this.vat2.object3D.matrixWorld);
    this.vat3Position.setFromMatrixPosition(this.vat3.object3D.matrixWorld);
    this.vat4Position.setFromMatrixPosition(this.vat4.object3D.matrixWorld);
    this.vat5Position.setFromMatrixPosition(this.vat5.object3D.matrixWorld);

    // Storing a reference of all elements in arrays for easier handling
    const water = [this.wat2, this.wat3, this.wat4, this.wat5];
    const waterOrbitals = [this.watorb2, this.watorb3, this.watorb4, this.watorb5];
    const vater = [this.vat2, this.vat3, this.vat4, this.vat5];
    const vaterOrbitals = [this.vatorb2, this.vatorb3, this.vatorb4, this.vatorb5];
    
    // Storing a reference of all positions in arrays for easier handling
    const waterPositions = [this.wat2Position, this.wat3Position, this.wat4Position, this.wat5Position];
    const vaterPositions = [this.vat2Position, this.vat3Position, this.vat4Position, this.vat5Position];
    
    let closestDistance = 10000000;
    let closestWater;
    let closestVater;
    
    // Calc distances
    waterPositions.forEach((waterItem, waterIndex) => {
      vaterPositions.forEach((vaterItem, vaterIndex) => {
        const distance = 2 * Math.sqrt(Math.pow(vaterItem.x-waterItem.x,2) + Math.pow(vaterItem.y-waterItem.y,2) + Math.pow(vaterItem.z-waterItem.z,2));
        if(distance < closestDistance) {
          closestDistance = distance;
          closestWater = waterIndex;
          closestVater = vaterIndex;
        }
      });
    });
    
    const isClosestWaterVisible = water[closestWater].getAttribute('visible');
    const isClosestVaterVisible = vater[closestVater].getAttribute('visible');

    
    if(closestDistance < 3.5) {
      if(isClosestWaterVisible && !isClosestVaterVisible || !isClosestWaterVisible && isClosestVaterVisible) {
        // Make bridge visible and set its src/dest
         this.bridge.setAttribute("visible", true);
         [...this.connectors].forEach((connector, index) => {
          connector.setAttribute(
            "connector",
            `src: #vat${closestVater + 2}; dest: #wat${closestWater + 2}; alpha: ` + index / 10,
          );
        });
        
        if (closestDistance<3 && Math.random() < 0.7) {
            if(isClosestWaterVisible && !isClosestVaterVisible & this.protoWat === 3) {
              // Transfers from water H3O to vater OH giving H2O and H2O
              water[closestWater].setAttribute('visible', false);
              vater[closestVater].setAttribute('visible', true);
              waterOrbitals[closestWater].setAttribute('visible', true);
              vaterOrbitals[closestVater].setAttribute('visible', false);
              this.protoWat = 2;
              this.protoVat = 2;
            } else if(isClosestWaterVisible && !isClosestVaterVisible & this.protoWat === 2) {
              // Transfers from water H2O to vater H2O giving OH and H3O
              water[closestWater].setAttribute('visible', false);
              vater[closestVater].setAttribute('visible', true);
              waterOrbitals[closestWater].setAttribute('visible', true);
              vaterOrbitals[closestVater].setAttribute('visible', false);
              this.protoWat = 1;
              this.protoVat = 3;
        	} else if(!isClosestWaterVisible && isClosestVaterVisible & this.protoWat === 2) {
              // Transfers from vater H2O to water H2O giving OH and H3O
              water[closestWater].setAttribute('visible', true);
              vater[closestVater].setAttribute('visible', false);
              waterOrbitals[closestWater].setAttribute('visible', false);
              vaterOrbitals[closestVater].setAttribute('visible', true);
              this.protoWat = 3;
              this.protoVat = 1;
        	} else if(!isClosestWaterVisible && isClosestVaterVisible & this.protoWat === 1) {
              // Transfers from vater H3O to water HO giving H2O and H2O
              water[closestWater].setAttribute('visible', true);
              vater[closestVater].setAttribute('visible', false);
              waterOrbitals[closestWater].setAttribute('visible', false);
              vaterOrbitals[closestVater].setAttribute('visible', true);
              this.protoWat = 2;
              this.protoVat = 2;
            }
        }
      }
    } else {
      this.bridge.setAttribute("visible", false);
    }
 }
});
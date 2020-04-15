/* global AFRAME, THREE */

AFRAME.registerComponent("update-stuff", {
  init: function() {
    // Get elements from the scene    
    this.lys6 = this.el.sceneEl.querySelector("#lys6");
    this.lys15 = this.el.sceneEl.querySelector("#lys15");
    this.lys16 = this.el.sceneEl.querySelector("#lys16");
    this.lys17 = this.el.sceneEl.querySelector("#lys17");
    
    this.glu5 = this.el.sceneEl.querySelector("#glu5");
    this.glu6 = this.el.sceneEl.querySelector("#glu6");
    this.glu11 = this.el.sceneEl.querySelector("#glu11");
    this.glu12 = this.el.sceneEl.querySelector("#glu12");
    
    this.bridge = this.el.sceneEl.querySelector("#bridge");
    this.connectors = this.bridge.querySelectorAll("*");
    
    // Create Position vectors for further usage
    this.lys6Position = new THREE.Vector3();
    this.lys15Position = new THREE.Vector3();
    this.lys16Position = new THREE.Vector3();
    this.lys17Position = new THREE.Vector3();
    this.glu5Position = new THREE.Vector3();
    this.glu6Position = new THREE.Vector3();
    this.glu11Position = new THREE.Vector3();
    this.glu12Position = new THREE.Vector3();

    this.lys_prot = 1; // or 0 when neutral
    this.glu_prot = 0; // or 1 when protonated at O1 or 2 when protonated at O2
    
    this.interval = 200; // Interval for running tick function - in ms
  },
  
  tick: function(t) {
    
    // Run on an interval.
    if (t - this.time < this.interval) { return; };
    this.time = t;
    
    this.el.sceneEl.object3D.updateMatrixWorld();

    //  Get positions
    this.lys6Position.setFromMatrixPosition(this.lys6.object3D.matrixWorld);
    this.lys15Position.setFromMatrixPosition(this.lys15.object3D.matrixWorld);
    this.lys16Position.setFromMatrixPosition(this.lys16.object3D.matrixWorld);
    this.lys17Position.setFromMatrixPosition(this.lys17.object3D.matrixWorld);
    this.glu5Position.setFromMatrixPosition(this.glu5.object3D.matrixWorld);
    this.glu6Position.setFromMatrixPosition(this.glu6.object3D.matrixWorld);
    this.glu11Position.setFromMatrixPosition(this.glu11.object3D.matrixWorld);
    this.glu12Position.setFromMatrixPosition(this.glu12.object3D.matrixWorld);
    
    // Storing a reference of all elements in arrays for easier handling
    const lysine = [this.lys15, this.lys16, this.lys17];
    const glutamate = [this.glu11, this.glu12];
    
    // Storing a reference of all positions in arrays for easier handling
    const lysinePositions = [this.lys15Position, this.lys16Position, this.lys17Position];
    const glutamatePositions = [this.glu11Position, this.glu12Position];
    
    let closestDistance = 10000000;
    let closestLysine;
    let closestGlutamate;

    // Calc distances
    lysinePositions.forEach((lysineItem, lysineIndex) => {
      glutamatePositions.forEach((glutamateItem, glutamateIndex) => {
        const distance = 2 * Math.sqrt(Math.pow(glutamateItem.x-lysineItem.x,2) + Math.pow(glutamateItem.y-lysineItem.y,2) + Math.pow(glutamateItem.z-lysineItem.z,2));
        if(distance < closestDistance) {
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
          `src: #lys${closestLysine + 15}; dest: #${correspondingOxygen}; alpha: ` + index / 10,
        );
      });
    } else if (this.glu_prot == 1) {
      [...this.connectors].forEach((connector, index) => {
        connector.setAttribute(
          "connector",
          "src: #lys6; dest: #glu11; alpha: " + index / 10
        );
      });
    } else if (this.glu_prot == 2) {
      [...this.connectors].forEach((connector, index) => {
        connector.setAttribute(
          "connector",
          "src: #lys6; dest: #glu12; alpha: " + index / 10
        );
      });
    }
    
    // Which element are closer? should we display bridge? 
    const isClosestLysineVisible = lysine[closestLysine].getAttribute('visible');
    const isClosestGlutamateVisible = glutamate[closestGlutamate].getAttribute('visible');
    
    if(closestDistance < 2) {
      this.bridge.setAttribute("visible", true);
      if (closestGlutamate === 0 && (this.glu_prot == 0 || this.glu_prot == 1)) {
        if (Math.random() < 0.2) {
          if(isClosestGlutamateVisible && !isClosestLysineVisible && this.lys_prot === 0) {
            lysine[closestLysine].setAttribute('visible', true);
            this.glu11.setAttribute("visible", false);
            this.glu_prot = 0;
            this.lys_prot = 1;
          }
        } else {
          if(!isClosestGlutamateVisible && isClosestLysineVisible && this.lys_prot === 1) {
            lysine[closestLysine].setAttribute('visible', false);
            this.glu11.setAttribute("visible", true);
            this.glu_prot = 1;
            this.lys_prot = 0;
          }
        }
      } else if (closestGlutamate === 1 && (this.glu_prot == 0 || this.glu_prot == 2)) {
        if (Math.random() < 0.2) {
          if(isClosestGlutamateVisible && !isClosestLysineVisible && this.lys_prot === 0) {
            lysine[closestLysine].setAttribute('visible', true);
            this.glu12.setAttribute("visible", false);
            this.glu_prot = 0;
            this.lys_prot = 1;
          }
        } else {
          if(!isClosestGlutamateVisible && isClosestLysineVisible && this.lys_prot === 1) {
            lysine[closestLysine].setAttribute('visible', false);
            this.glu12.setAttribute("visible", true);
            this.glu_prot = 2;
            this.lys_prot = 0;
          }
        }
      }    
    } else {
      this.bridge.setAttribute("visible", false);
    }
  }
});

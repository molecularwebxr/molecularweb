AFRAME.registerComponent("connector", {
  schema: {
    src: { type: "selector" },
    dest: { type: "selector" },
    alpha: { type: "number", default: 0.5 }
  },

  init: function() {
    this.p0 = new THREE.Vector3();
    this.p1 = new THREE.Vector3();
    this.pf = new THREE.Vector3();
  },
  
  tick: function() {
    var obj0 = this.data.src.object3D;
    var obj1 = this.data.dest.object3D;
    this.p0.setFromMatrixPosition(obj0.matrixWorld);
    this.p1.setFromMatrixPosition(obj1.matrixWorld);
    this.pf.lerpVectors(this.p0, this.p1, this.data.alpha);
    this.el.setAttribute("position", this.pf);
  },
  
});

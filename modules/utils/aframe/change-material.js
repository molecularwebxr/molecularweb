AFRAME.registerComponent('change-material', {
  init: function () {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    var mesh = this.el.getObject3D('mesh');

    if (!mesh) { return; }

    mesh.traverse(function (node) {
      if (node.isMesh) {
        var newMaterial = new THREE.MeshStandardMaterial({
          color: 0xff85ce,
        })
        node.material = newMaterial;
        node.material.needsUpdate = true;
      }
    });
  }
});
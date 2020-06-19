AFRAME.registerComponent("gltf-material", {
  schema: {
    opacity: { default: 1.0 },
    color: { default: "green" },
  },
  init: function () {
    this.el.addEventListener("model-loaded", this.update.bind(this));
  },
  update: function () {
    var mesh = this.el.getObject3D("mesh");
    var data = this.data;
    var color = new THREE.Color(data.color);
    if (!mesh) {
      return;
    }
    mesh.traverse(function (node) {
      if (node.isMesh) {
        node.material.opacity = data.opacity;
        node.material.transparent = data.opacity < 1.0;
        node.material.needsUpdate = true;
        node.material.color = color;
      }
    });
  },
});

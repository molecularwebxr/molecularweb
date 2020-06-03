AFRAME.registerComponent('loader', {
  init: function () {
    const loader = document.querySelector("loader-component");
    loader.display = false;
  }
});
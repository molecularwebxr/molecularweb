const modelViewer = document.querySelector("model-viewer");

window.switchSrc = (clickedEl, name) => {
  const model = "./assets/models/" + name + ".glb";
  const poster = "./assets/posters/" + name + ".png";
  modelViewer.src = model;
  modelViewer.poster = poster;
  const slides = document.querySelectorAll(".slide");
  slides.forEach(element => {
    element.classList.remove("selected");
  });
  clickedEl.classList.add("selected");
};

document
  .querySelector(".slider")
  .addEventListener("beforexrselect", ev => {
    // Keep slider interactions from affecting the XR scene.
    ev.preventDefault();
  });
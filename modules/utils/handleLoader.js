const scene = document.querySelector("a-scene");
const loader = document.querySelector("loader-component");

function handleSceneLoad(e) {
  loader.setAttribute("display", "false");
}

scene.addEventListener("loaded", handleSceneLoad);
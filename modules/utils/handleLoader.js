const scene = document.querySelector("a-scene");
const loader = document.querySelector("loader-component");

loader.display = true;

function handleSceneLoad(e) {
  loader.display = false;
}

scene.addEventListener("loaded", handleSceneLoad);
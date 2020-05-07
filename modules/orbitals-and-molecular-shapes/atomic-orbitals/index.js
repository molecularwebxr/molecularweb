const marker1Select = document.getElementById("select-marker-1");
const marker2Select = document.getElementById("select-marker-2");

const marker1AModel = document.getElementById("marker-1A-mol");
const marker1BModel = document.getElementById("marker-1B-mol");

const marker2AModel = document.getElementById("marker-2A-mol");
const marker2BModel = document.getElementById("marker-2B-mol");

marker1Select.selectedIndex = 0;
marker2Select.selectedIndex = 0;

function handleSelection(e) {
  e.preventDefault();
  const markerSelected = e.target.id;
  const index = marker1Select.selectedIndex;
  let assetIndex;

  if (index < 25) {
    assetIndex = index + 1;
  } else if (index < 45) {
    assetIndex = index + 2;
  } else {
    assetIndex = index + 3;
  }

  if (markerSelected === "select-marker-1") {
    marker1AModel.removeAttribute("gltf-model");
    marker1BModel.removeAttribute("gltf-model");
    marker1AModel.removeAttribute("obj-model");
    marker1BModel.removeAttribute("obj-model");
    if (index < 45) {
      marker1AModel.setAttribute("gltf-model", "#orb" + assetIndex);
      marker1AModel.setAttribute("model-opacity", 0.5);
      marker1BModel.setAttribute("gltf-model", "#orb" + assetIndex);
      marker1BModel.setAttribute("model-opacity", 0.5);
    } else {
      marker1AModel.setAttribute(
        "obj-model",
        "obj:#orb" + assetIndex + "obj; mtl: #orb" + assetIndex + "mtl"
      );
      marker1AModel.setAttribute("model-opacity", 1);
      marker1BModel.setAttribute(
        "obj-model",
        "obj:#orb" + assetIndex + "obj; mtl: #orb" + assetIndex + "mtl"
      );
      marker1BModel.setAttribute("model-opacity", 1);
    }
  }
}

marker1Select.addEventListener("change", handleSelection);
marker2Select.addEventListener("change", handleSelection);

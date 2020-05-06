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
  console.log(marker1Select.selectedIndex);
  const markerSelected = e.target.id;
  if (markerSelected === "select-marker-1") {
    marker1AModel.removeAttribute("gltf-model");
    marker1BModel.removeAttribute("gltf-model");
    marker1AModel.removeAttribute("obj-model");
    marker1BModel.removeAttribute("obj-model");
    if (marker1Select.selectedIndex < 47) {
      marker1AModel.setAttribute(
        "gltf-model",
        "#orb" + marker1Select.selectedIndex
      );
      marker1AModel.setAttribute("model-opacity", 0.5);
      marker1BModel.setAttribute(
        "gltf-model",
        "#orb" + marker1Select.selectedIndex
      );
      marker1BModel.setAttribute("model-opacity", 0.5);
    } else {
      marker1AModel.setAttribute(
        "obj-model",
        "obj:#orb" +
          marker1Select.selectedIndex +
          "obj; mtl: #orb" +
          marker1Select.selectedIndex +
          "mtl"
      );
      marker1AModel.setAttribute("model-opacity", 1);
      marker1BModel.setAttribute(
        "obj-model",
        "obj:#orb" +
          marker1Select.selectedIndex +
          "obj; mtl: #orb" +
          marker1Select.selectedIndex +
          "mtl"
      );
      marker1BModel.setAttribute("model-opacity", 1);
    }
  }
}

marker1Select.addEventListener("change", handleSelection);
marker2Select.addEventListener("change", handleSelection);

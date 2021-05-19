var marker1Select = document.getElementById("select-marker-1");
var marker2Select = document.getElementById("select-marker-2");
var markers = [marker1Select, marker2Select];

var marker1AModel = document.getElementById("marker-1A-mol");
var marker1BModel = document.getElementById("marker-1B-mol");

var marker1AOrb = document.getElementById("marker-1A-orb");
var marker1BOrb = document.getElementById("marker-1B-orb");

var marker2AModel = document.getElementById("marker-2A-mol");
var marker2BModel = document.getElementById("marker-2B-mol");

var marker2AOrb = document.getElementById("marker-2A-orb");
var marker2BOrb = document.getElementById("marker-2B-orb");

var btnMarker1 = document.getElementById("btn-1");
var btnMarker2 = document.getElementById("btn-2");

var resetActivityButton = document.querySelector("reset-activity");

var marker1Opacity = false;
var marker2Opacity = false;

var modelsMarker1 = [marker1AModel, marker1BModel];
var modelsMarker2 = [marker2AModel, marker2BModel];

marker1Select.selectedIndex = 0;
marker2Select.selectedIndex = 0;

function handleReset(e) {
  marker1Select.selectedIndex = 0;
  marker2Select.selectedIndex = 0;
  btnMarker1.classList.remove("active");
  btnMarker2.classList.remove("active");
  marker1Opacity = false;
  marker2Opacity = false;

  marker1AModel.removeAttribute("gltf-model");
  marker1BModel.removeAttribute("gltf-model");
  marker1AModel.removeAttribute("obj-model");
  marker1AModel.removeAttribute("obj-model");

  marker2AModel.removeAttribute("gltf-model");
  marker2BModel.removeAttribute("gltf-model");
  marker2BModel.removeAttribute("gltf-model");
  marker2AModel.removeAttribute("obj-model");
  marker2AModel.removeAttribute("obj-model");

  marker1AOrb.removeAttribute("gltf-model");
  marker2AOrb.removeAttribute("gltf-model");
  marker1BOrb.removeAttribute("gltf-model");
  marker2BOrb.removeAttribute("gltf-model");

  marker1AOrb.setAttribute("visible", false);
  marker1BOrb.setAttribute("visible", false);
  marker2AOrb.setAttribute("visible", false);
  marker2BOrb.setAttribute("visible", false);

  marker1AModel.setAttribute("visible", true);
  marker1BModel.setAttribute("visible", true);
  marker2AModel.setAttribute("visible", true);
  marker2BModel.setAttribute("visible", true);

  marker1AModel.setAttribute("gltf-model", "#orb1");
  marker1BModel.setAttribute("gltf-model", "#orb1");
  marker2AModel.setAttribute("gltf-model", "#orb1");
  marker2BModel.setAttribute("gltf-model", "#orb1");

  marker1AModel.setAttribute("model-opacity", 1);
  marker1BModel.setAttribute("model-opacity", 1);
  marker2AModel.setAttribute("model-opacity", 1);
  marker2BModel.setAttribute("model-opacity", 1);
  marker1AOrb.setAttribute("model-opacity", 1);
  marker1BOrb.setAttribute("model-opacity", 1);
  marker2AOrb.setAttribute("model-opacity", 1);
  marker2BOrb.setAttribute("model-opacity", 1);
}

function handleSelection(e) {
  e.preventDefault();

  var markerSelected =
    e.target.id === "select-marker-1" ? markers[0] : markers[1];
  var modelsSelected =
    e.target.id === "select-marker-1" ? modelsMarker1 : modelsMarker2;
  var index = markerSelected.selectedIndex;

  let assetIndex;
  if (index < 25) {
    assetIndex = index + 1;
  } else if (index < 50) {
    assetIndex = index + 2;
  } else {
    assetIndex = index + 3;
  }

  modelsSelected[0].removeAttribute("gltf-model");
  modelsSelected[0].removeAttribute("obj-model");
  modelsSelected[1].removeAttribute("gltf-model");
  modelsSelected[1].removeAttribute("obj-model");

  if (index < 50) {
    if (index > 24 && index < 30) {
      modelsSelected[0].setAttribute("visible", false);
      modelsSelected[1].setAttribute("visible", false);

      if (e.target.id === "select-marker-1") {
        marker1AOrb.removeAttribute("gltf-model");
        marker1BOrb.removeAttribute("gltf-model");
        marker1AOrb.setAttribute("visible", true);
        marker1BOrb.setAttribute("visible", true);

        marker1AOrb.setAttribute("gltf-model", "#orb" + assetIndex);
        marker1BOrb.setAttribute("gltf-model", "#orb" + assetIndex);
      } else {
        marker2AOrb.setAttribute("visible", true);
        marker2BOrb.setAttribute("visible", true);
        marker2AOrb.removeAttribute("gltf-model");
        marker2BOrb.removeAttribute("gltf-model");

        marker2AOrb.setAttribute("gltf-model", "#orb" + assetIndex);
        marker2BOrb.setAttribute("gltf-model", "#orb" + assetIndex);
      }
    } else {
      if (e.target.id === "select-marker-1") {
        marker1AOrb.setAttribute("visible", false);
        marker1BOrb.setAttribute("visible", false);
      } else {
        marker2AOrb.setAttribute("visible", false);
        marker2BOrb.setAttribute("visible", false);
      }
      modelsSelected[0].setAttribute("visible", true);
      modelsSelected[1].setAttribute("visible", true);
      modelsSelected[0].setAttribute("gltf-model", "#orb" + assetIndex);
      modelsSelected[1].setAttribute("gltf-model", "#orb" + assetIndex);

      if (e.target.id === "select-marker-1") {
        if (marker1Opacity) {
          marker1AModel.setAttribute("model-opacity", 0.5);
          marker1BModel.setAttribute("model-opacity", 0.5);
          marker1AOrb.setAttribute("model-opacity", 0.8);
          marker1BOrb.setAttribute("model-opacity", 0.8);
        } else {
          marker1AModel.setAttribute("model-opacity", 1);
          marker1BModel.setAttribute("model-opacity", 1);
          marker1AOrb.setAttribute("model-opacity", 1);
          marker1BOrb.setAttribute("model-opacity", 1);
        }
      } else {
        if (marker2Opacity) {
          marker2AModel.setAttribute("model-opacity", 0.5);
          marker2BModel.setAttribute("model-opacity", 0.5);
          marker2AOrb.setAttribute("model-opacity", 0.8);
          marker2BOrb.setAttribute("model-opacity", 0.8);
        } else {
          marker2AModel.setAttribute("model-opacity", 1);
          marker2BModel.setAttribute("model-opacity", 1);
          marker2AOrb.setAttribute("model-opacity", 1);
          marker2BOrb.setAttribute("model-opacity", 1);
        }
      }
    }
  } else {
    modelsSelected[0].setAttribute("visible", true);
    modelsSelected[1].setAttribute("visible", true);
    modelsSelected[0].setAttribute(
      "obj-model",
      "obj:#orb" + assetIndex + "obj; mtl: #orb" + assetIndex + "mtl"
    );
    modelsSelected[0].setAttribute("model-opacity", 1);
    modelsSelected[1].setAttribute(
      "obj-model",
      "obj:#orb" + assetIndex + "obj; mtl: #orb" + assetIndex + "mtl"
    );
    modelsSelected[1].setAttribute("model-opacity", 1);
  }
}

function handleTransparency(e) {
  if (e.target.id === "btn-1") {
    btnMarker1.classList.toggle("active");
    marker1Opacity = !marker1Opacity;

    if (marker1Opacity) {
      marker1AModel.setAttribute("model-opacity", 0.5);
      marker1BModel.setAttribute("model-opacity", 0.5);
      marker1AOrb.setAttribute("model-opacity", 0.8);
      marker1BOrb.setAttribute("model-opacity", 0.8);
    } else {
      marker1AModel.setAttribute("model-opacity", 1);
      marker1BModel.setAttribute("model-opacity", 1);
      marker1AOrb.setAttribute("model-opacity", 1);
      marker1BOrb.setAttribute("model-opacity", 1);
    }
  } else {
    btnMarker2.classList.toggle("active");
    marker2Opacity = !marker2Opacity;

    if (marker2Opacity) {
      marker2AModel.setAttribute("model-opacity", 0.5);
      marker2BModel.setAttribute("model-opacity", 0.5);
      marker2AOrb.setAttribute("model-opacity", 0.8);
      marker2BOrb.setAttribute("model-opacity", 0.8);
    } else {
      marker2AModel.setAttribute("model-opacity", 1);
      marker2BModel.setAttribute("model-opacity", 1);
      marker2AOrb.setAttribute("model-opacity", 1);
      marker2BOrb.setAttribute("model-opacity", 1);
    }
  }
}

marker1Select.addEventListener("change", handleSelection);
marker2Select.addEventListener("change", handleSelection);
btnMarker1.addEventListener("click", handleTransparency);
btnMarker2.addEventListener("click", handleTransparency);
resetActivityButton.addEventListener("resetActivity", handleReset);

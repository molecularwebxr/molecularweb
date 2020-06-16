// Get select elements for each marker and store them in an array for easier selection and handling
var marker1Select = document.getElementById("select-marker-1");
var marker2Select = document.getElementById("select-marker-2");
var markers = [marker1Select, marker2Select];

// Get 3D elements from each marker
var marker1AModel = document.getElementById("marker-1A-mol");
var marker1BModel = document.getElementById("marker-1B-mol");

var marker2AModel = document.getElementById("marker-2A-mol");
var marker2BModel = document.getElementById("marker-2B-mol");

var resetActivityButton = document.querySelector("reset-activity");

// Store models in arrays for easier handling
var modelsMarker1 = [marker1AModel, marker1BModel];
var modelsMarker2 = [marker2AModel, marker2BModel];

// Select first option by default
marker1Select.selectedIndex = 0;
marker2Select.selectedIndex = 0;

// Reset both markers to default state
function handleReset(e) {
  marker1Select.selectedIndex = 0;
  marker2Select.selectedIndex = 0;

  // There's a bug on A-frame. We need to remove the
  // attribute and add it again in order see the model change
  marker1AModel.removeAttribute("gltf-model");
  marker1BModel.removeAttribute("gltf-model");

  marker2AModel.removeAttribute("gltf-model");
  marker2BModel.removeAttribute("gltf-model");

  marker1AModel.setAttribute("gltf-model", "#orb1");
  marker1BModel.setAttribute("gltf-model", "#orb1");
  marker2AModel.setAttribute("gltf-model", "#orb1");
  marker2BModel.setAttribute("gltf-model", "#orb1");

  marker1AModel.setAttribute("model-opacity", 0.5);
  marker1BModel.setAttribute("model-opacity", 0.5);
  marker2AModel.setAttribute("model-opacity", 0.5);
  marker2BModel.setAttribute("model-opacity", 0.5);
}

function handleSelection(e) {
  e.preventDefault();

  // Which marker was selected? Get its models & its marker elements
  var markerSelected =
    e.target.id === "select-marker-1" ? markers[0] : markers[1];
  var modelsSelected =
    e.target.id === "select-marker-1" ? modelsMarker1 : modelsMarker2;
  var index = markerSelected.selectedIndex;

  // Select index starts with 0 and IDs starts with 1
  // Be careful if using multiple option groups
  var assetIndex = index + 1;

  // There's a bug on A-frame. We need to remove the
  // attribute and add it again in order see the model change
  modelsSelected[0].removeAttribute("gltf-model");
  modelsSelected[1].removeAttribute("gltf-model");

  // Select the asset that corresponds to the option selected
  modelsSelected[0].setAttribute("gltf-model", "#orb" + assetIndex);
  modelsSelected[0].setAttribute("model-opacity", 0.5);
  modelsSelected[1].setAttribute("gltf-model", "#orb" + assetIndex);
  modelsSelected[1].setAttribute("model-opacity", 0.5);
}

marker1Select.addEventListener("change", handleSelection);
marker2Select.addEventListener("change", handleSelection);
resetActivityButton.addEventListener("resetActivity", handleReset);

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
var mvButton = document.querySelector("mv-anchor");

// Store models in arrays for easier handling
var modelsMarker1 = [marker1AModel, marker1BModel];
var modelsMarker2 = [marker2AModel, marker2BModel];

// Select first option by default
marker1Select.selectedIndex = 0;
marker2Select.selectedIndex = 0;

function handleModelViewer(e) {
  var marker1Element = marker1Select.selectedIndex + 1;
  var marker2Element = marker2Select.selectedIndex + 1;

  var marker1Src = document.getElementById(`mol${marker1Element}`).attributes.src.value;
  var marker2Src = document.getElementById(`mol${marker2Element}`).attributes.src.value;
  
  var src1 = marker1Src.slice(9, -5);
  var src2 = marker2Src.slice(9, -5);

  var baseUrl = "/modules/atomic-structures/example-structures/example-structures3d.html"

  location.href = `${baseUrl}?src1=${src1}&src2=${src2}`
}

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

  marker1AModel.setAttribute("gltf-model", "#mol1");
  marker1BModel.setAttribute("gltf-model", "#mol1");
  marker2AModel.setAttribute("gltf-model", "#mol1");
  marker2BModel.setAttribute("gltf-model", "#mol1");
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
  modelsSelected[0].setAttribute("gltf-model", "#mol" + assetIndex);
  modelsSelected[1].setAttribute("gltf-model", "#mol" + assetIndex);
}

marker1Select.addEventListener("change", handleSelection);
marker2Select.addEventListener("change", handleSelection);
resetActivityButton.addEventListener("resetActivity", handleReset);
mvButton.addEventListener("click", handleModelViewer);

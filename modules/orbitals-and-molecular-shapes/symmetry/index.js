// Get select elements
var molecule1Select = document.getElementById("select-molecule-1");
var molecule2Select = document.getElementById("select-molecule-2");

var orbital1Select = document.getElementById("select-orbital-1");
var orbital2Select = document.getElementById("select-orbital-2");

var orbitalNames = [
  [
    "C2",
    "Plano 1",
    "Plano 2",
  ]
];

// Get 3D elements from each marker
var marker1AMolecule = document.querySelector("#mrk1Amol");
var marker1BMolecule = document.querySelector("#mrk1Bmol");
var marker1AOrbBlue = document.querySelector("#mrk1Aoma");
var marker1BOrbBlue = document.querySelector("#mrk1Boma");

var marker2AMolecule = document.querySelector("#mrk2Amol");
var marker2BMolecule = document.querySelector("#mrk2Bmol");
var marker2AOrbBlue = document.querySelector("#mrk2Aoma");
var marker2BOrbBlue = document.querySelector("#mrk2Boma");

var resetActivityButton = document.querySelector("reset-activity");

// Store models in arrays for easier handling
var moleculesMarker1 = [marker1AMolecule, marker1BMolecule];
var blueOrbitalsMarker1 = [marker1AOrbBlue, marker1BOrbBlue];

var moleculesMarker2 = [marker2AMolecule, marker2BMolecule];
var blueOrbitalsMarker2 = [marker2AOrbBlue, marker2BOrbBlue];

// Select first option by default
molecule1Select.selectedIndex = 0;
molecule2Select.selectedIndex = 0;
orbital1Select.selectedIndex = 0;
orbital2Select.selectedIndex = 0;

// Reset both markers to default state
function handleReset(e) {
  molecule1Select.selectedIndex = 0;
  molecule2Select.selectedIndex = 0;
  orbital1Select.selectedIndex = 0;
  orbital2Select.selectedIndex = 0;

  moleculesMarker1.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mol1");
  });

  moleculesMarker2.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mol1");
  });

  blueOrbitalsMarker1.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mo1_1");
  });

  blueOrbitalsMarker2.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mo1_1");
  });


}

function handleMoleculeSelection(e) {
  e.preventDefault();

  var moleculeSelected;
  var blueOrbitalSelected;
  var orbitalSelector;
  var selectedIndex = e.target.selectedIndex;
  var molIndex = selectedIndex + 1;
  var orbitals = orbitalNames[selectedIndex];

  // Which marker was selected? Get its molecules & orbitals
  if (e.target.id === "select-molecule-1") {
    moleculeSelected = moleculesMarker1;
    blueOrbitalSelected = blueOrbitalsMarker1;
    orbitalSelector = orbital1Select;
  } else {
    moleculeSelected = moleculesMarker2;
    blueOrbitalSelected = blueOrbitalsMarker2;
    orbitalSelector = orbital2Select;
  }

  // There's a bug on A-frame. We need to remove the
  // attribute and add it again in order see the model change
  moleculeSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });
  blueOrbitalSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });

  // Set molecule selected and default orbitals
  moleculeSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mol" + molIndex);
  });
  blueOrbitalSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mo" + molIndex + "_1");
  });

  // Add orbital options to orbital selector
  orbitalSelector.options.length = 0;
  orbitals.forEach(function (item) {
    var option = document.createElement("option");
    option.text = item;
    orbitalSelector.add(option);
  });
}

function handleOrbitalSelection(e) {
  var selectedIndex = e.target.selectedIndex + 1;
  var blueOrbitalSelected;
  var molIndex;

  if (e.target.id === "select-orbital-1") {
    blueOrbitalSelected = blueOrbitalsMarker1;
    molIndex = molecule1Select.selectedIndex + 1;
  } else {
    blueOrbitalSelected = blueOrbitalsMarker2;
    molIndex = molecule2Select.selectedIndex + 1;
  }

  blueOrbitalSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });

  blueOrbitalSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mo" + molIndex + "_" + selectedIndex);
  });

}

molecule1Select.addEventListener("change", handleMoleculeSelection);
molecule2Select.addEventListener("change", handleMoleculeSelection);
orbital1Select.addEventListener("change", handleOrbitalSelection);
orbital2Select.addEventListener("change", handleOrbitalSelection);
resetActivityButton.addEventListener("resetActivity", handleReset);

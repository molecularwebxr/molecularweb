// Get select elements
var molecule1Select = document.getElementById("select-molecule-1");
var molecule2Select = document.getElementById("select-molecule-2");

var orbital1Select = document.getElementById("select-orbital-1");
var orbital2Select = document.getElementById("select-orbital-2");

var orbitalNames = [
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
    "Orbital 11",
    "Orbital 12",
    "Orbital 13",
    "Orbital 14",
    "Orbital 15",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
    "Orbital 11",
    "Orbital 12",
    "Orbital 13",
    "Orbital 14",
    "Orbital 15",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
  ],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
    "Orbital 11",
    "Orbital 12",
    "Orbital 13",
    "Orbital 14",
    "Orbital 15",
  ],
  ["HOMO", "LUMO"],
  [
    "Orbital 1",
    "Orbital 2",
    "Orbital 3",
    "Orbital 4",
    "Orbital 5",
    "Orbital 6",
    "Orbital 7",
    "Orbital 8",
    "Orbital 9",
    "Orbital 10",
    "Orbital 11",
    "Orbital 12",
    "Orbital 13",
    "Orbital 14",
    "Orbital 15",
    "Orbital 16",
    "Orbital 17",
    "Orbital 18",
    "Orbital 19",
  ],
];

// Get 3D elements from each marker
var marker1AMolecule = document.querySelector("#mrk1Amol");
var marker1BMolecule = document.querySelector("#mrk1Bmol");
var marker1AOrbRed = document.querySelector("#mrk1Aomr");
var marker1AOrbBlue = document.querySelector("#mrk1Aoma");
var marker1BOrbRed = document.querySelector("#mrk1Bomr");
var marker1BOrbBlue = document.querySelector("#mrk1Boma");

var marker2AMolecule = document.querySelector("#mrk2Amol");
var marker2BMolecule = document.querySelector("#mrk2Bmol");
var marker2AOrbRed = document.querySelector("#mrk2Aomr");
var marker2AOrbBlue = document.querySelector("#mrk2Aoma");
var marker2BOrbRed = document.querySelector("#mrk2Bomr");
var marker2BOrbBlue = document.querySelector("#mrk2Boma");

var resetActivityButton = document.querySelector("reset-activity");

// Store models in arrays for easier handling
var moleculesMarker1 = [marker1AMolecule, marker1BMolecule];
var redOrbitalsMarker1 = [marker1AOrbRed, marker1BOrbRed];
var blueOrbitalsMarker1 = [marker1AOrbBlue, marker1BOrbBlue];

var moleculesMarker2 = [marker2AMolecule, marker2BMolecule];
var redOrbitalsMarker2 = [marker2AOrbRed, marker2BOrbRed];
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

  redOrbitalsMarker1.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mo1_1r");
  });

  redOrbitalsMarker2.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mo1_1r");
  });

  blueOrbitalsMarker1.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mo1_1a");
  });

  blueOrbitalsMarker2.forEach(function (item) {
    item.removeAttribute("gltf-model");
    item.setAttribute("gltf-model", "#mo1_1a");
  });


}

function handleMoleculeSelection(e) {
  e.preventDefault();

  var moleculeSelected;
  var redOrbitalSelected;
  var blueOrbitalSelected;
  var orbitalSelector;
  var selectedIndex = e.target.selectedIndex;
  var molIndex = selectedIndex + 1;
  var orbitals = orbitalNames[selectedIndex];

  // Which marker was selected? Get its molecules & orbitals
  if (e.target.id === "select-molecule-1") {
    moleculeSelected = moleculesMarker1;
    redOrbitalSelected = redOrbitalsMarker1;
    blueOrbitalSelected = blueOrbitalsMarker1;
    orbitalSelector = orbital1Select;
  } else {
    moleculeSelected = moleculesMarker2;
    redOrbitalSelected = redOrbitalsMarker2;
    blueOrbitalSelected = blueOrbitalsMarker2;
    orbitalSelector = orbital2Select;
  }

  // There's a bug on A-frame. We need to remove the
  // attribute and add it again in order see the model change
  moleculeSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });
  redOrbitalSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });
  blueOrbitalSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });

  // Set molecule selected and default orbitals
  moleculeSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mol" + molIndex);
  });
  redOrbitalSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mo" + molIndex + "_1r");
  });
  blueOrbitalSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mo" + molIndex + "_1a");
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
  var redOrbitalSelected;
  var blueOrbitalSelected;
  var molIndex;

  if (e.target.id === "select-orbital-1") {
    redOrbitalSelected = redOrbitalsMarker1;
    blueOrbitalSelected = blueOrbitalsMarker1;
    molIndex = molecule1Select.selectedIndex + 1;
  } else {
    redOrbitalSelected = redOrbitalsMarker2;
    blueOrbitalSelected = blueOrbitalsMarker2;
    molIndex = molecule2Select.selectedIndex + 1;
  }

  redOrbitalSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });
  blueOrbitalSelected.forEach(function (item) {
    item.removeAttribute("gltf-model");
  });

  redOrbitalSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mo" + molIndex + "_" + selectedIndex + "r");
  });
  blueOrbitalSelected.forEach(function (item) {
    item.setAttribute("gltf-model", "#mo" + molIndex + "_" + selectedIndex + "a");
  });

}

molecule1Select.addEventListener("change", handleMoleculeSelection);
molecule2Select.addEventListener("change", handleMoleculeSelection);
orbital1Select.addEventListener("change", handleOrbitalSelection);
orbital2Select.addEventListener("change", handleOrbitalSelection);
resetActivityButton.addEventListener("resetActivity", handleReset);

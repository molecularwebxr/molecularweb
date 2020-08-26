var selectMenu = document.getElementById("select-pdb");
var pdbText = document.getElementById("pdb-text");
var pdbInput = document.getElementById("pdb-input");
var mkMenu = document.querySelector("enable-mk-menu");
var menuContainer = document.getElementById("mk-menu");
var closeMenu = document.getElementById("close-menu");

var requestURL = "/modules/virtual-modeling-kit/PDB.json";
var request = new XMLHttpRequest();
var pdbs;

// Modeling kit menu is active by default
mkMenu.isActive = true;

// Get PDB JSON
request.open("GET", requestURL);
request.responseType = "json";
request.send();

request.onload = function () {
  pdbs = request.response;
  populateMenu(pdbs);
};

// Set select options after getting PDBs from JSON
function populateMenu(pdbs) {
  var examples = Object.keys(pdbs);
  examples.forEach(function (item, index) {
    var optionItem = document.createElement("option");
    optionItem.textContent = item;
    optionItem.value = item;
    selectMenu.appendChild(optionItem);
  });
}

// Set PDB on text area after selection
function handleChange(e) {
  var selectedPdb = pdbs[selectMenu.value];
  pdbText.value = selectedPdb;
}

// Handle file upload and set text area if ok
function handleUpload(e) {
  var input = e.target;
  var reader = new FileReader();

  reader.onload = function () {
    pdbText.value = reader.result;
  };

  reader.readAsText(input.files[0]);
}

// Handle MK Menu
function handleMenu(e) {
  menuContainer.classList.toggle("hide");
  mkMenu.isActive = !mkMenu.isActive;
  if (tempMenu.isActive) {
    tempMenu.isActive = false;
    tempMenuContainer.classList.add("hide");
  }
}

selectMenu.addEventListener("change", handleChange);
pdbInput.addEventListener("change", handleUpload);
mkMenu.addEventListener("click", handleMenu);
closeMenu.addEventListener("click", handleMenu);

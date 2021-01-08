var selectMenu = document.getElementById("select-pdb");
var pdbText = document.getElementById("pdb-text");
var pdbInput = document.getElementById("pdb-input");
var mkMenu = document.querySelector("enable-mk-menu");
var menuContainer = document.getElementById("mk-menu");
var closeMenu = document.getElementById("close-menu");
var uploadLabel = document.getElementById("upload-label");

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
  var categories = Object.keys(pdbs);
  categories.forEach(function (category, index) {
    var optionGroup = document.createElement("optgroup");
    optionGroup.label = category;
    var examples = Object.keys(pdbs[category]);
    examples.forEach(function (item, index) {
      var optionItem = document.createElement("option");
      optionItem.textContent = item;
      optionItem.value = item;
      optionItem.classList.add("option");
      optionGroup.appendChild(optionItem);
    });
    selectMenu.appendChild(optionGroup);
  })
}

// Set PDB on text area after selection
function handleChange(e) {
  var selectedPdb = selectMenu.options[selectMenu.selectedIndex];
  var selectedGroup = selectedPdb.parentElement.label;
  var rawPdb = pdbs[selectedGroup][selectedPdb.value]
  pdbText.value = rawPdb;
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
  if (zoomMenu.isActive) {
    zoomMenu.isActive = false;
    zoomMenuContainer.classList.add("hide");
  }
  if (camMenu.isActive) {
    camMenu.isActive = false;
    camMenuContainer.classList.add("hide");
  }
}

selectMenu.addEventListener("change", handleChange);
pdbInput.addEventListener("change", handleUpload);
mkMenu.addEventListener("click", handleMenu);
closeMenu.addEventListener("click", handleMenu);
uploadLabel.addEventListener("click", function (e) {
  pdbInput.click();
})

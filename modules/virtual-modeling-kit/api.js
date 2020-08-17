var selectMenu = document.getElementById("select-pdb");
var pdbText = document.getElementById("pdb-text");
var pdbInput = document.getElementById("pdb-input");
var requestURL = "/modules/virtual-modeling-kit/PDB.json";
var request = new XMLHttpRequest();
var pdbs;

request.open("GET", requestURL);
request.responseType = "json";
request.send();

request.onload = function () {
  pdbs = request.response;
  populateMenu(pdbs);
};

function populateMenu(pdbs) {
  var examples = Object.keys(pdbs);
  examples.forEach(function (item, index) {
    var optionItem = document.createElement("option");
    optionItem.textContent = item;
    optionItem.value = item;
    selectMenu.appendChild(optionItem);
  });
}

function handleChange(e) {
  var selectedPdb = pdbs[selectMenu.value];
  pdbText.value = selectedPdb;
}

function handleUpload(e) {
  var input = e.target;
  var reader = new FileReader();

  reader.onload = function () {
    pdbText.value = reader.result;
  };

  reader.readAsText(input.files[0]);
}

selectMenu.addEventListener("change", handleChange);
pdbInput.addEventListener("change", handleUpload);

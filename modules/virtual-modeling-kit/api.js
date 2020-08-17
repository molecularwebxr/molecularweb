var selectMenu = document.getElementById("select-pdb");
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
  examples.forEach(function(item, index) {
    var optionItem = document.createElement('option');
    optionItem.textContent = item;
    optionItem.value = item;
    selectMenu.appendChild(optionItem);
  })
}

function handleChange(e) {
  var selectedPdb = pdbs[selectMenu.value];
  pdbText.value = selectedPdb;
}

selectMenu.addEventListener("change", handleChange);

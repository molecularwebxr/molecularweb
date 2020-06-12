var orbitals = document.getElementById("orbitals");
var bonds = document.getElementById("bonds");
var molecules = document.getElementById("molecules");
var assemblies = document.getElementById("assemblies");
var modeling = document.getElementById("modeling");

function handleExpasion (event) {
  event.currentTarget.classList.toggle("expanded");
}

orbitals.addEventListener("click", handleExpasion);
bonds.addEventListener("click", handleExpasion);
molecules.addEventListener("click", handleExpasion);
assemblies.addEventListener("click", handleExpasion);
modeling.addEventListener("click", handleExpasion);

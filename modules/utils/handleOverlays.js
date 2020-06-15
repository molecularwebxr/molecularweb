var instructionsOverlay = document.getElementById("instructions");
var instructionsButton = document.querySelector("toggle-instructions");

var menuOverlay = document.getElementById("menu");
var menuButton = document.querySelector("toggle-menu");

var descriptionOverlay = document.getElementById("description");
var descriptionButton = document.querySelector("toggle-description");

function hideInstructionsOverlay() {
  instructionsOverlay.toggle();
}

function hideDescriptionOverlay() {
  descriptionOverlay.toggle();
}

function hideMenuOverlay() {
  menuOverlay.toggle();
}

instructionsButton.addEventListener("toggleInstructions", hideInstructionsOverlay);
descriptionButton.addEventListener("toggleDescription", hideDescriptionOverlay);
menuButton.addEventListener("toggleMenu", hideMenuOverlay);
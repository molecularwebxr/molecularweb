var instructionsOverlay = document.getElementById("instructions");
var instructionsButton = document.querySelector("toggle-instructions");

var menuOverlay = document.getElementById("menu");
var menuButton = document.querySelector("toggle-menu");

var descriptionOverlay = document.getElementById("description");
var descriptionButton = document.querySelector("toggle-description");

var zoomMenu = document.querySelector("zoom-icon");
var zoomMenuContainer = document.getElementById("zoom-container");

function hideInstructionsOverlay() {
  instructionsOverlay.toggle();
}

function hideDescriptionOverlay() {
  descriptionOverlay.toggle();
}

function hideMenuOverlay() {
  menuOverlay.toggle();
}

function handleZoomMenu(e) {
  zoomMenuContainer.classList.toggle("hide");
  zoomMenu.isActive = !zoomMenu.isActive;
}

instructionsButton.addEventListener("toggleInstructions", hideInstructionsOverlay);
descriptionButton.addEventListener("toggleDescription", hideDescriptionOverlay);
menuButton.addEventListener("toggleMenu", hideMenuOverlay);
zoomMenu.addEventListener("click", handleZoomMenu);
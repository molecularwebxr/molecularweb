var instructionsOverlay = document.getElementById("instructions");
var instructionsButton = document.querySelector("toggle-instructions");

var menuOverlay = document.getElementById("menu");
var menuButton = document.querySelector("toggle-menu");

var zoomMenu = document.querySelector("zoom-icon");
var zoomMenuContainer = document.getElementById("zoom-container");

var camMenu = document.querySelector("camera-icon");
var camMenuContainer = document.getElementById("cam-container");

function hideInstructionsOverlay() {
  instructionsOverlay.toggle();
}

function hideMenuOverlay() {
  menuOverlay.toggle();
}

function handleZoomMenu(e) {
  zoomMenuContainer.classList.toggle("hide");
  zoomMenu.isActive = !zoomMenu.isActive;

  if (camMenu.isActive) {
    camMenu.isActive = false;
    camMenuContainer.classList.add("hide");
  }
}

function handleCamMenu(e) {
  camMenuContainer.classList.toggle("hide");
  camMenu.isActive = !camMenu.isActive;

  if (zoomMenu.isActive) {
    zoomMenu.isActive = false;
    zoomMenuContainer.classList.add("hide");
  }
}

instructionsButton.addEventListener("toggleInstructions", hideInstructionsOverlay);
menuButton.addEventListener("toggleMenu", hideMenuOverlay);

if(window.location.pathname !== "/modules/virtual-modeling-kit/" && window.location.pathname !== "/modules/virtual-modeling-kit-2/") {
  zoomMenu.addEventListener("click", handleZoomMenu);
  camMenu.addEventListener("click", handleCamMenu);
}
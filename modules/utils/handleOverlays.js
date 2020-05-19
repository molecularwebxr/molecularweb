const instructionsOverlay = document.getElementById("instructions");
const instructionsButton = document.querySelector("toggle-instructions");

const descriptionOverlay = document.getElementById("description");
const descriptionButton = document.querySelector("toggle-description");

function hideInstructionsOverlay() {
  instructionsOverlay.toggle();
}

function hideDescriptionOverlay() {
  descriptionOverlay.toggle();
}

instructionsButton.addEventListener("toggleInstructions", hideInstructionsOverlay);
descriptionButton.addEventListener("toggleDescription", hideDescriptionOverlay);
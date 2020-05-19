const instructionsOverlay = document.querySelector("activity-instructions");
const instructionsButton = document.querySelector("toggle-instructions");

function hideInstructionsOverlay() {
  instructionsOverlay.toggle();
}

instructionsButton.addEventListener("toggleInstructions", hideInstructionsOverlay);
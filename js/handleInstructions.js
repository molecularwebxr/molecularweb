var instructionsModal = document.querySelector("app-instructions");
var header = document.querySelector("app-header");

instructionsModal.isActive = true;

header.addEventListener("displayInstructions", function () {
  instructionsModal.isActive = true;
})
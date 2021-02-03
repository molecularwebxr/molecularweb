var instructionsModal = document.querySelector("app-instructions");
var header = document.querySelector("app-header");
// var obExpiresIn = 60000;
var obExpiresIn = 2629800000; // One month

function handleClose(e) {
  var expire = new Date(Date.now() + obExpiresIn);
  document.cookie = "onboarding=displayed; expires=" + expire + ";";
}

var hasUserSeenOnboarding = document.cookie.split(";").some(function (item) {
  return item.trim().indexOf("onboarding=") == 0;
});

if (!hasUserSeenOnboarding) {
  instructionsModal.isActive = true;
}

header.addEventListener("displayInstructions", function () {
  instructionsModal.isActive = true;
});

instructionsModal.addEventListener("closedInstructions", handleClose);



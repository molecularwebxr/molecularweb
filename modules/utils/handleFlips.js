var canvas = document.querySelector("canvas");
var flipVideoButton = document.querySelector("flip-video");

function handleCameraFlip() {
  var video = document.getElementsByTagName("video")[0];
  video.classList.toggle("flip");
  canvas.classList.toggle("flip");
}

flipVideoButton.addEventListener("flipCamera", handleCameraFlip);
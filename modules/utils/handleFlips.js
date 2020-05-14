const canvas = document.querySelector("canvas");
const flipVideoButton = document.querySelector("flip-video");

function handleCameraFlip() {
  const video = document.getElementsByTagName("video")[0];
  video.classList.toggle("flip");
  canvas.classList.toggle("flip");
}

flipVideoButton.addEventListener("flipCamera", handleCameraFlip);
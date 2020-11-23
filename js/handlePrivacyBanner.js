var acceptBtn = document.getElementById("accept-privacy");
var banner = document.getElementById("privacy");
// var expiresIn = 60000;
var expiresIn = 2629800000; // One month

function handleAccept(e) {
  banner.classList.add("hidden");
  var expire = new Date(Date.now() + expiresIn);
  document.cookie = "policy=accepted; expires=" + expire + ";";
}

var hasUserAccepted = document.cookie.split(";").some(function (item) {
  return item.trim().indexOf("policy=") == 0;
});

if (!hasUserAccepted) {
  banner.classList.remove("hidden");
  acceptBtn.addEventListener("click", handleAccept);
}

const marker1A = document.querySelector("#marker1A");
const marker1B = document.querySelector("#marker1B");
const marker2A = document.querySelector("#marker2A");
const marker2B = document.querySelector("#marker2B");
const marker1Handler = document.getElementById("marker1");
const marker2Handler = document.getElementById("marker2");

let isMarker1Enabled = false;
let isMarker2Enabled = false;
marker1Handler.isActive = false;
marker2Handler.isActive = false;

function handleGestureState(event) {
  const markerSelected = event.target.id;

  if (markerSelected === "marker1") {
    isMarker1Enabled = !isMarker1Enabled;
    marker1Handler.isActive = isMarker1Enabled;
    if (isMarker2Enabled) {
      isMarker2Enabled = false;
      marker2Handler.isActive = false;
    }
  }

  if (markerSelected === "marker2") {
    isMarker2Enabled = !isMarker2Enabled;
    marker2Handler.isActive = isMarker2Enabled;
    if (isMarker2Enabled) {
      isMarker1Enabled = false;
      marker1Handler.isActive = false;
    }
  }

  if (isMarker1Enabled) {
    console.log("hi")
    marker1A.setAttribute("gesture-handler", { factor: 5 });
    marker1B.setAttribute("gesture-handler", { factor: 5 });
    marker2A.removeAttribute("gesture-handler");
    marker2B.removeAttribute("gesture-handler");
  }

  if (isMarker2Enabled) {
    marker1A.removeAttribute("gesture-handler", {});
    marker1B.removeAttribute("gesture-handler", {});
    marker2A.setAttribute("gesture-handler", { factor: 5 });
    marker2B.setAttribute("gesture-handler", { factor: 5 });
  }
}

marker1Handler.addEventListener("click", handleGestureState);
marker2Handler.addEventListener("click", handleGestureState);

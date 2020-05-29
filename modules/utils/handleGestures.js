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

    if (isMarker1Enabled) {
      enableMarker1();
    } else {
      disableMarker1();
    }

    if (isMarker2Enabled) {
      isMarker2Enabled = false;
      marker2Handler.isActive = false;
      disableMarker2();
    }
  }

  if (markerSelected === "marker2") {
    isMarker2Enabled = !isMarker2Enabled;
    marker2Handler.isActive = isMarker2Enabled;

    if (isMarker2Enabled) {
      enableMarker2();
    } else {
      disableMarker2();
    }


    if (isMarker2Enabled) {
      isMarker1Enabled = false;
      marker1Handler.isActive = false;
      disableMarker1();
    }
  }
}

function disableMarker1() {
  marker1A.setAttribute("gesture-handler", { enabled: false });
  marker1B.setAttribute("gesture-handler", { enabled: false });
}

function enableMarker1() {
  marker1A.setAttribute("gesture-handler", { enabled: true });
  marker1B.setAttribute("gesture-handler", { enabled: true });
}

function disableMarker2() {
  marker2A.setAttribute("gesture-handler", { enabled: false });
  marker2B.setAttribute("gesture-handler", { enabled: false });
}

function enableMarker2() {
  marker2A.setAttribute("gesture-handler", { enabled: true });
  marker2B.setAttribute("gesture-handler", { enabled: true });
}

marker1Handler.addEventListener("click", handleGestureState);
marker2Handler.addEventListener("click", handleGestureState);

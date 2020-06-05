var marker1A = document.querySelector("#marker1A");
var marker1B = document.querySelector("#marker1B");
var marker2A = document.querySelector("#marker2A");
var marker2B = document.querySelector("#marker2B");
var marker1Handler = document.getElementById("marker1");
var marker2Handler = document.getElementById("marker2");

var isMarker1Enabled = false;
var isMarker2Enabled = false;
marker1Handler.isActive = false;
marker2Handler.isActive = false;

var hasTouchScreen = false;

if ("maxTouchPoints" in navigator) { 
    hasTouchScreen = navigator.maxTouchPoints > 0;
} else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0; 
} else {
    var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
        hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
    } else {
        // Only as a last resort, fall back to user agent sniffing
        var UA = navigator.userAgent;
        hasTouchScreen = (
            /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
            /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
    }
}

if (hasTouchScreen) {
  marker1Handler.addEventListener("click", handleGestureState);
  marker2Handler.addEventListener("click", handleGestureState);
} else {
  marker1Handler.classList.add("hide");
  marker2Handler.classList.add("hide");
  // TO DO: Remove this once scale controls are in place
  document.getElementById("scale-down").classList.remove("icon-margin");
}

function handleGestureState(event) {
  var markerSelected = event.target.id;

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

var marker1A = document.querySelector("#marker1A");
var marker1B = document.querySelector("#marker1B");
var marker2A = document.querySelector("#marker2A");
var marker2B = document.querySelector("#marker2B");
var marker1Handler = document.getElementById("marker1");
var marker2Handler = document.getElementById("marker2");
var markerControl1 = document.getElementById("rotation-marker-1");
var markerControl2 = document.getElementById("rotation-marker-2");
var markerOptions1 = document.getElementById("marker-options-1");
var markerOptions2 = document.getElementById("marker-options-2");
var markerImage1 = document.getElementById("marker-image-1");
var markerImage2 = document.getElementById("marker-image-2");

var isMarker1Enabled = false;
var isMarker2Enabled = false;
var isMarker1OptionsEnabled = false;
var isMarker2OptionsEnabled = false;
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
  // Enable listeners on marker images for triggering marker's menu
  markerImage1.addEventListener("click", handleMarkerSelection);
  markerImage2.addEventListener("click", handleMarkerSelection);
  
  // handle gesture listeners/controls
  marker1Handler.addEventListener("click", handleGestureState);
  marker2Handler.addEventListener("click", handleGestureState);

  // Hide manual rotation controls
  markerControl1.classList.add("hide");
  markerControl2.classList.add("hide");

  // Hide marker options by default
  markerOptions1.classList.add("touch");
  markerOptions2.classList.add("touch");

  // Some styles depends on touch capabilities
  markerImage2.classList.remove("left-margin");
  markerImage2.classList.add("right-margin");

} else {
  // Hide gesture controls
  marker1Handler.classList.add("hide");
  marker2Handler.classList.add("hide");
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

function handleMarkerSelection(e) {
  var markerSelected = e.target.id;

  if (markerSelected === "marker-image-1") {
    markerOptions1.classList.toggle("active");
    markerOptions2.classList.remove("active");
  } else {
    markerOptions1.classList.remove("active");
    markerOptions2.classList.toggle("active");
  }
}

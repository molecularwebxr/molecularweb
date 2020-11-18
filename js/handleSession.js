// var maxSessionExpiration = 7200000; // 2hs
var maxSessionExpiration = 60000; // 1 min
var timer = 20000; // 3s

function checkForSurveyCookie() {
  return document.cookie.split(";").some(function (item) {
     return item.trim().indexOf("survey=") == 0;
   });
 }

function resetSurveyCookie() {
  var isSurveyCookie = checkForSurveyCookie();
  if (isSurveyCookie) {
    document.cookie = "survey=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } 
}

function hasUserAnswered() {
  var isSurveyCookie = checkForSurveyCookie();
  let surveyValue;
  if (isSurveyCookie) {
    surveyValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("survey"))
      .split("=")[1];
  }

  if (surveyValue === "answered") {
    return true
  }

  return false;

}

function startTimer(time) {
  setTimeout(function() {
    var userAnswered = hasUserAnswered();
    if (!userAnswered) {
      console.log("Ask for feedback!");
      return;
    }
    console.log("Timer complete but user already answered")
  }, time);
}

// Is there an active session?
var isActiveSession = document.cookie.split(";").some(function (item) {
  return item.trim().indexOf("session=") == 0;
});

if (!isActiveSession) {
  // If there's no active session, let's create one, reset survey cookie (if exists) and start timer.
  console.log("No active session found. Timer set to 20s");
  resetSurveyCookie();
  var sessionExpire = new Date(Date.now() + maxSessionExpiration);
  document.cookie = `session=${Date.now()}; expires=${sessionExpire};`;
  startTimer(timer);
} else {
  // If there's an active session, let's check if user already answered the survey
  var userAnswered = hasUserAnswered();
  
  if(!userAnswered) {  
    var sessionValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session"))
      .split("=")[1];
  
    var sessionTime = parseInt(sessionValue, 10);
    var activeSessionTimer = new Date(sessionTime + timer) - Date.now();

    var sessionTimer  = activeSessionTimer > 0 ? activeSessionTimer : timer;
    
    console.log("Active session found. Timer set to " + (sessionTimer/1000).toFixed(1) + "s");
  
    startTimer(sessionTimer);
  } else {
    console.log("Active session found. User already answered. No timer triggered.")
  }
}

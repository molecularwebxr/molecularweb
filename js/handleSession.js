// var maxSessionExpiration = 7200000; // 2hs
var maxSessionExpiration = 60000; // 1 min
var timer = 20000; // 3s

function startTimer(time) {
  console.log(time)
  setTimeout(() => {
    console.log("Ask for feedback!");
  }, time);
}

// Is there an active session?
var isActiveSession = document.cookie.split(";").some(function (item) {
  return item.trim().indexOf("session=") == 0;
});

if (!isActiveSession) {
  // If there's no active session, let's create one and start timer.
  console.log("No active session found. Timer set to 20s");
  var sessionExpire = new Date(Date.now() + maxSessionExpiration);
  document.cookie = `session=${Date.now()}; expires=${sessionExpire};`;
  startTimer(timer);
  
} else {
  // If there's an active session, let's check if user already answered/dismissed the survey
  var hasUserAnsweredOrDismissed = document.cookie.split(";").some(function (item) {
    return item.trim().indexOf("survey=") == 0;
  });

  let surveyValue = "";

  if (hasUserAnsweredOrDismissed) {
    surveyValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("survey"))
      .split("=")[1];
  }

   
  if(surveyValue !== "answered") {  
    var sessionValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session"))
      .split("=")[1];
  
    var sessionTime = parseInt(sessionValue, 10);
    var activeSessionTimer = new Date(sessionTime + timer) - Date.now();
    
    console.log("Active session found. Timer set to " + (sessionTimer/1000).toFixed(1) + "s");
  
    var sessionTimer  = activeSessionTimer > 0 ? activeSessionTimer : timer;
  
    startTimer(sessionTimer);
  }
}

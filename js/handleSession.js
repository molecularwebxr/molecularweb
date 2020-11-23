var feedbackPrompt = document.querySelector("feedback-prompt");

var maxSessionExpiration = 7200000; // 2hs
var timer = 180000; // 3m 

/******************  Session utils *************************/
function checkForSurveyCookie() {
  return document.cookie.split(";").some(function (item) {
    return item.trim().indexOf("survey=") == 0;
  });
}

// Clear survey cookie
function resetSurveyCookie() {
  var isSurveyCookie = checkForSurveyCookie();
  if (isSurveyCookie) {
    document.cookie = "survey=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

// Is there an active session?
function checkForSessionCookie() {
  return document.cookie.split(";").some(function (item) {
    return item.trim().indexOf("session=") == 0;
  });
}

// If there's an active session return its data, otherwise return data for a new one
function getSessionData() {
  var isActiveSession = checkForSessionCookie();
  var sessionStart;
  var sessionEnd = new Date(Date.now() + maxSessionExpiration);
  var sessionTime = Date.now();

  if (isActiveSession) {
    var sessionData = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session"));
  
    var sessionStart = sessionData
      .split("=")
      .find((row) => row.startsWith("start"))
      .split(":")[1]
      .replace("end", "");
  
    var sessionEnd = sessionData
      .split("=")
      .find((row) => row.startsWith("start"))
      .split("end:")[1]

      
    var sessionTime = parseInt(sessionStart, 10);    
  }

  return {
    start: sessionTime,
    end: sessionEnd,
  };
}

// Update session data
function updateSessionCookie() {
  var session = getSessionData();
  document.cookie = `session=start:${Date.now()}end:${session.end}; expires=${session.end}; path=/; secure`;
}

// Check if user has already answered the survey
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
    return true;
  }

  return false;
}

// Start the timer!
function startTimer(time) {
  setTimeout(function () {
    var userAnswered = hasUserAnswered();

    if (!userAnswered && feedbackPrompt) {
      feedbackPrompt.display();
      return;
    }

    if (!feedbackPrompt && !userAnswered) {
      console.log(`Updating session data. Timer set to ${timer/1000}s again`);
      updateSessionCookie();
      startTimer(timer);
      return;
    }

    console.log("Timer complete but user already answered");
  }, time);
}

/******************  Session Logic, run once user loads any page *************************/
// Is there an active session?
var isActiveSession = checkForSessionCookie();

if (!isActiveSession) {
  // If there's no active session, let's create one, reset survey cookie (if exists) and start timer.
  console.log(`No active session found. Timer set to ${timer/1000}s`);
  resetSurveyCookie();
  var sessionExpire = new Date(Date.now() + maxSessionExpiration);
  document.cookie = `session=start:${Date.now()}end:${sessionExpire}; expires=${sessionExpire}; path=/; secure`;
  startTimer(timer);
} else {
  // If there's an active session, let's check if user already answered the survey
  var userAnswered = hasUserAnswered();

  if (!userAnswered) {
    var session = getSessionData();

    var activeSessionTimer = new Date(session.start + timer) - Date.now();

    var sessionTimer = activeSessionTimer > 0 ? activeSessionTimer : (timer + activeSessionTimer);

    console.log(activeSessionTimer)

    console.log("Active session found. Timer set to " + (sessionTimer / 1000).toFixed(1) + "s" );

    startTimer(sessionTimer);
  } else {
    console.log("Active session found. User already answered. No timer triggered.");
  }
}

if (feedbackPrompt) {
  feedbackPrompt.addEventListener("dismiss-survey", function (e) {
    console.log(`Updating session data. Timer set to ${timer/1000}s again`);
    updateSessionCookie();
    startTimer(timer)
  });
}

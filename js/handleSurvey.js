var form = document.getElementById("survey-form");
var educatorsProfile = document.getElementById("profile-option-1");
var studentsProfile = document.getElementById("profile-option-2");
var educatorQuestions = document.querySelectorAll(".educators");
var studentQuestions = document.querySelectorAll(".students");

educatorQuestions.forEach(function(item) {
  item.classList.add("hidden");
});

studentQuestions.forEach(function(item) {
  item.classList.remove("hidden");
});

function handleSubmit(e) {
  e.preventDefault();
  var formData = e.target;

  console.log(formData.profile.value);
}

function handleProfileChange(event) {
  if(event.target.value === "educator"){
    educatorQuestions.forEach(function(item) {
      item.classList.remove("hidden");
    });

    studentQuestions.forEach(function(item) {
      item.classList.add("hidden");
    });
  } else {
    educatorQuestions.forEach(function(item) {
      item.classList.add("hidden");
    });

    studentQuestions.forEach(function(item) {
      item.classList.remove("hidden");
    });
  }
}

form.addEventListener("submit", handleSubmit);
educatorsProfile.addEventListener("change", handleProfileChange);
studentsProfile.addEventListener("change", handleProfileChange);
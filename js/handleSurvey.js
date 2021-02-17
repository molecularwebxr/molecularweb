var form = document.getElementById("survey-form");
var submitBtn = document.getElementById("submit");
var educatorsProfile = document.getElementById("profile-option-1");
var studentsProfile = document.getElementById("profile-option-2");
var educatorQuestions = document.querySelectorAll(".educators");
var studentQuestions = document.querySelectorAll(".students");

educatorQuestions.forEach(function (item) {
  item.classList.add("hidden");
});

studentQuestions.forEach(function (item) {
  item.classList.remove("hidden");
});

function handleSubmit(e) {
  e.preventDefault();
  var formData = e.target;

  var data = prepareData(formData);
  submitBtn.disabled = true;

  fetch("https://molecularweb.epfl.ch/backend/api/surveys/report", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      submitBtn.disabled = false;
      document.cookie = `survey=answered; expires=7200000; path=/; secure`;
      window.location.href = "/index.html?state=success"
    })
    .catch(function (error) {
      submitBtn.disabled = false;
      swal("Something went wrong", "Please, try again", "error");
    });
}

function handleProfileChange(event) {
  if (event.target.value === "educator") {
    educatorQuestions.forEach(function (item) {
      item.classList.remove("hidden");
    });

    studentQuestions.forEach(function (item) {
      item.classList.add("hidden");
    });
  } else {
    educatorQuestions.forEach(function (item) {
      item.classList.add("hidden");
    });

    studentQuestions.forEach(function (item) {
      item.classList.remove("hidden");
    });
  }

  handleSelection(event);
}

function handleSelection(event) {
  var parentLabel = event.target.parentElement;
  var question = parentLabel.parentElement;
  var inputs = question.querySelectorAll("label.answer > input[type=radio]");
  inputs.forEach(function (item) {
    if (item.checked) {
      item.parentElement.classList.add("is-selected");
    } else {
      item.parentElement.classList.remove("is-selected");
    }
  });
}

form.addEventListener("submit", handleSubmit);
educatorsProfile.addEventListener("change", handleProfileChange);
studentsProfile.addEventListener("change", handleProfileChange);

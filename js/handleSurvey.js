var form = document.getElementById("survey-form");

function handleSubmit(e) {
  e.preventDefault();
  var formData = e.target;

  console.log(formData.profile.value);
}

form.addEventListener("submit", handleSubmit);
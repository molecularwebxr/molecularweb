function prepareData(form) {
  var data;
  if (form.profile.value === "educator") {
    data = {
      profile: form.profile.value,
      usedARBefore: form.arBefore.value,
      easyUse: form.easyUse.value,
      studentsNumber: form.studentsNumber.value,
      studentsInterest: form.studentsInterest.value,
      studentsUnderstanding: form.studentsUnderstanding.value,
      suggestions: form.suggestions.value,
      location: form.location.value,
      email: form.email.value,
    }
  }  else {
    data = {
      profile: form.profile.value,
      usedARBefore: form.arBefore.value,
      easyUse: form.easyUse.value,
      understand: form.understand.value,
      interestInChemistry: form.interestInChemistry.value,
      interestInTech: form.interestInTech.value,
      place: form.place.value,
      suggestions: form.suggestions.value,
      location: form.location.value,
      age: form.age.value,
    }
  }

  return data;
}
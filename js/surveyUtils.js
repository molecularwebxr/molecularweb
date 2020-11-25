function prepareData(form) {
  var data;
  if (form.profile.value === "educator") {
    data = {
      profile: form.profile.value,
      date: new Date(Date.now()),
      usedARBefore: form.arBefore.value,
      easyUse: form.easyUse.value,
      suggestions: form.suggestions.value
        .replaceAll("\t", " ")
        .replaceAll("\n", ";"),
      location: form.location.value,
      studentsNumber: form.studentsNumber.value,
      studentsInterest: form.studentsInterest.value,
      studentsUnderstanding: form.studentsUnderstanding.value,
      email: form.email.value,
    };
  } else {
    data = {
      profile: form.profile.value,
      date: new Date(Date.now()),
      usedARBefore: form.arBefore.value,
      easyUse: form.easyUse.value,
      suggestions: form.suggestions.value
        .replaceAll("\t", " ")
        .replaceAll("\n", ";"),
      location: form.location.value,
      understand: form.understand.value,
      interestInChemistry: form.interestInChemistry.value,
      interestInTech: form.interestInTech.value,
      place: form.place.value,
      age: form.age.value,
    };
  }

  return data;
}

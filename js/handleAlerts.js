var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

var state = urlParams.get("state");

if (state === "success") {
  swal({
    title: "Thanks for your feedback!",
    text: "🙂",
    icon: "success",
    button: {
      text: "Ok",
    },
  });
}

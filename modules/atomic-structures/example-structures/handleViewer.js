var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

var src1 = urlParams.get("src1");
var src2 = urlParams.get("src2");

console.log(src1)
console.log(src2)
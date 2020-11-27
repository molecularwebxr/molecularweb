var mv1 = document.getElementById("mv-1");
var mv2 = document.getElementById("mv-2");
var title1 = document.getElementById("title-1");
var title2 = document.getElementById("title-2");
var description1 = document.getElementById("description-1");
var description2 = document.getElementById("description-2");

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);

var src1 = urlParams.get("src1");
var src2 = urlParams.get("src2");

mv1.src = `./models/${src1}.gltf`;
title1.setAttribute("data-i18n", `macromolecules.example.${src1}.title`)
description1.setAttribute("data-i18n", `macromolecules.example.${src1}.description`)

mv2.src = `./models/${src2}.gltf`;
title2.setAttribute("data-i18n", `macromolecules.example.${src2}.title`)
description2.setAttribute("data-i18n", `macromolecules.example.${src2}.description`)

var bar1 = document.getElementById("bar1");
var bar2 = document.getElementById("bar2");
var bar3 = document.getElementById("bar3");
var hamburger = document.getElementById("hamburger");
var mobileMenu  = document.getElementById("mobile-menu");
var overlay  = document.getElementById("overlay");
var orbitals = document.getElementById("orbitals");
var bonds = document.getElementById("bonds");
var molecules = document.getElementById("molecules");
var assemblies = document.getElementById("assemblies");
var modeling = document.getElementById("modeling");

var menuActive = false;

var handleExpasion = (event) => {
  event.currentTarget.classList.toggle("expanded");
}

hamburger.addEventListener("click", (event) => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  overlay.classList.toggle("active");
  if (menuActive) {
    bar1.style.animation = "bar1out .5s forwards";
    bar2.style.animation = "bar2out .5s forwards";
    bar3.style.animation = "bar3out .5s forwards";
    menuActive = false;
  } else {
    menuActive = true;
    bar1.style.animation = "bar1in .5s forwards";
    bar2.style.animation = "bar2in .5s forwards";
    bar3.style.animation = "bar3in .5s forwards";
  }
});

orbitals.addEventListener("click", handleExpasion);
bonds.addEventListener("click", handleExpasion);
molecules.addEventListener("click", handleExpasion);
assemblies.addEventListener("click", handleExpasion);
modeling.addEventListener("click", handleExpasion);

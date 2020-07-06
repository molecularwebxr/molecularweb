// Get button elements for each marker 
var cartoonButton1 = document.getElementById("cartoon-1");
var sticksButton1 = document.getElementById("sticks-1");
var bondsButton1 = document.getElementById("bonds-1");

var cartoonButton2 = document.getElementById("cartoon-2");
var sticksButton2 = document.getElementById("sticks-2");
var bondsButton2 = document.getElementById("bonds-2");

// Get 3D elements from each marker
var cartoon1A = document.querySelector("#cartoon1A");
var sticks1A = document.querySelector("#sticks1A");
var bonds1A = document.querySelector("#bonds1A");
var cartoon1B = document.querySelector("#cartoon1B");
var sticks1B = document.querySelector("#sticks1B");
var bonds1B = document.querySelector("#bonds1B");

var cartoon2A = document.querySelector("#cartoon2A");
var sticks2A = document.querySelector("#sticks2A");
var bonds2A = document.querySelector("#bonds2A");
var cartoon2B = document.querySelector("#cartoon2B");
var sticks2B = document.querySelector("#sticks2B");
var bonds2B = document.querySelector("#bonds2B");

var cartoon1 = [cartoon1A, cartoon1B];
var sticks1 = [sticks1A, sticks1B];
var bonds1 = [bonds1A, bonds1B];

var cartoon2 = [cartoon2A, cartoon2B];
var sticks2 = [sticks2A, sticks2B];
var bonds2 = [bonds2A, bonds2B];

var resetActivityButton = document.querySelector("reset-activity");


// Reset both markers to default state
function handleReset(e) {
  cartoonButton1.classList.add("active");
  sticksButton1.classList.add("active");
  bondsButton1.classList.add("active");
  cartoonButton2.classList.add("active");
  sticksButton2.classList.add("active");
  bondsButton2.classList.add("active");

  bonds1A.setAttribute("visible", true);
  bonds1B.setAttribute("visible", true);
  sticks1A.setAttribute("visible", true);
  sticks1B.setAttribute("visible", true);
  cartoon1A.setAttribute("visible", true);
  cartoon1B.setAttribute("visible", true);

  bonds2A.setAttribute("visible", true);
  bonds2B.setAttribute("visible", true);
  sticks2A.setAttribute("visible", true);
  sticks2B.setAttribute("visible", true);
  cartoon2A.setAttribute("visible", true);
  cartoon2B.setAttribute("visible", true);
}

function handleSelection(e) {
  e.preventDefault();
  var id = e.target.id;
  var marker = id.substring(id.length - 1);
  var selection = id.substring(0, id.length - 2);

  var isCartoonVisible, isSticksVisible, isBondsVisible;

  if (marker === "1") {
    isCartoonVisible = cartoon1A.getAttribute("visible");
    isSticksVisible = sticks1A.getAttribute("visible");
    isBondsVisible = bonds1A.getAttribute("visible");

    if (selection === "sticks") {
      if (isSticksVisible) {
        bonds1A.setAttribute("visible", false);
        bonds1B.setAttribute("visible", false);
        bondsButton1.classList.remove("active")
      }
      sticks1A.setAttribute("visible", !isSticksVisible);
      sticks1B.setAttribute("visible", !isSticksVisible);
      sticksButton1.classList.toggle("active");
    } else if(selection === "cartoon") {
      cartoon1A.setAttribute("visible", !isCartoonVisible);
      cartoon1B.setAttribute("visible", !isCartoonVisible);
      cartoonButton1.classList.toggle("active");
    } else {
      if (!isSticksVisible) {
        bonds1A.setAttribute("visible", false);
        bonds1B.setAttribute("visible", false);
        bondsButton1.classList.remove("active");
      } else {
        bonds1A.setAttribute("visible", !isBondsVisible);
        bonds1B.setAttribute("visible", !isBondsVisible);
        bondsButton1.classList.toggle("active");
      }
    }
  } else {
    isCartoonVisible = cartoon2A.getAttribute("visible");
    isSticksVisible = sticks2A.getAttribute("visible");
    isBondsVisible = bonds2A.getAttribute("visible");

    if (selection === "sticks") {
      if (isSticksVisible) {
        bonds2A.setAttribute("visible", false);
        bonds2B.setAttribute("visible", false);
        bondsButton2.classList.remove("active")
      }
      sticks2A.setAttribute("visible", !isSticksVisible);
      sticks2B.setAttribute("visible", !isSticksVisible);
      sticksButton2.classList.toggle("active");
    } else if(selection === "cartoon") {
      cartoon2A.setAttribute("visible", !isCartoonVisible);
      cartoon2B.setAttribute("visible", !isCartoonVisible);
      cartoonButton2.classList.toggle("active");
    } else {
      if (!isSticksVisible) {
        bonds2A.setAttribute("visible", false);
        bonds2B.setAttribute("visible", false);
        bondsButton2.classList.remove("active");
      } else {
        bonds2A.setAttribute("visible", !isBondsVisible);
        bonds2B.setAttribute("visible", !isBondsVisible);
        bondsButton2.classList.toggle("active");
      }
    }
  }
  
}

cartoonButton1.addEventListener("click", handleSelection);
sticksButton1.addEventListener("click", handleSelection);
bondsButton1.addEventListener("click", handleSelection);
cartoonButton2.addEventListener("click", handleSelection);
sticksButton2.addEventListener("click", handleSelection);
bondsButton2.addEventListener("click", handleSelection);
resetActivityButton.addEventListener("resetActivity", handleReset);

var blackScreenButton = document.querySelector("black-screen");
var blackScreenModel = document.getElementById("black-screen");
var blackScreen = 0;
var whiteScreenButton = document.querySelector("white-screen");
var whiteScreenModel = document.getElementById("white-screen");
var whiteScreen = 0;

function resetBackground(e) {
    whiteScreen = blackScreen = 0;
    blackScreenModel.setAttribute("opacity", 0);
    whiteScreenModel.setAttribute("opacity", 0);
}

function toggleBackgroundblack(e) {
    blackScreen = !blackScreen;
    if(whiteScreen)
    {
        whiteScreenModel.setAttribute("opacity", 0);
        whiteScreen=0;
    } 
    blackScreenModel.setAttribute("opacity", (blackScreen ? 1 : 0));
}

function toggleBackgroundwhite(e)
{
    whiteScreen = !whiteScreen;
    if(blackScreen)
    {
        blackScreenModel.setAttribute("opacity", 0);
        blackScreen=0;
    } 
    whiteScreenModel.setAttribute("opacity", (whiteScreen ? 1 : 0));
}

blackScreenButton.addEventListener("black-screen", toggleBackgroundblack);
whiteScreenButton.addEventListener("white-screen", toggleBackgroundwhite);
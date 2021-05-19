function jsmeOnLoad() {
  // glutathione
  var startingStructure =
    "6 5 C 1.4 0.475 C 2.27 0.975 C 3.14 0.475 C 4 0.975 O 0.537 0.975 H 0 0.665 1 2 1 2 3 1 3 4 1 1 5 1 5 6 1";

  jsmeApplet = new JSApplet.JSME("appletContainer", "100%", "100%", {
    //optional parameters
    options: "query,hydrogens,fullScreenIcon",
    jme: startingStructure, // JME mol format
  });
  document.JME = jsmeApplet;
}
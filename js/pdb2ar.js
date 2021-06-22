var detectBtn = document.getElementById("detect-btn");
var pdbText = document.getElementById("pdb-text");
var switchWater = document.getElementById("switch-water");
var proteinTitle = document.getElementById("protein-title");
var proteinGrid = document.getElementById("protein-grid");
var ligandTitle = document.getElementById("ligand-title");
var ligandGrid = document.getElementById("ligand-grid");
var vdmBtn = document.getElementById("vmd-btn");
var submitSection = document.getElementById("submit-section");
var tclText = document.getElementById("tcl-text");
var submitBtn = document.getElementById("submit-btn");
var titleInput = document.getElementById("pdb-title");
var emailInput = document.getElementById("pdb-email");
var instructionsText = document.getElementById("instructions");

var chains = [];
var chainstrings = [];
var chaintypes = [];

var ligandchains = [];
var ligandresnames = [];
var ligandresnos = [];
var ligandComments = [];

var tclString = "";

var isWaterChecked = true;

function readPdb(e) {
  var pdbString = pdbText.value;

  if (pdbString.length === 0) {
    return;
  }

  var lines = pdbString.split("\n");

  var atoms = lines.filter(function (line, index) {
    return line.substring(0, 4) === "ATOM" || line.substring(0, 6) === "HETATM"
  });

  atoms.forEach(function (atom, index) {
    var thisChain = atom.substring(21, 22).trim().toUpperCase();
    var chainIsThere = -1;
    var thisRes = atom.substring(17, 20).trim().toUpperCase();
    var thisResNo = parseInt(atom.substring(23, 26).trim().toUpperCase());
    var thisEl = atom.substring(76, 78).trim().toUpperCase();
    var thisElNum = atom.substring(7, 11).trim();
    var pdbIndex = index;

    for (j = 0; j < chains.length; j++) {
      if (thisChain === chains[j]) {
        chainIsThere = j;
        break;
      }
    }
    if (chainIsThere > -1) {
      chainstrings[chainIsThere] = chainstrings[chainIsThere] + "\n" + atom;
    } else {
      chains.push(thisChain);
      chainstrings.push(atom);
      if ("ALA|CYS|ASP|GLU|PHE|GLY|HIS|ILE|LYS|LEU|MET|ASN|PRO|GLN|ARG|SER|THR|VAL|TRP|TYR|MSE|HSE|HSD|HID|HIE".match(thisRes)) {
        chaintypes.push("protein");
      } else if ("DA|DC|DG|DT|A|C|G|U".match(thisRes)) {
        chaintypes.push("nucleic");
      } else {
        chaintypes.push("other");
      }
    }

    if (!"ALA|CYS|ASP|GLU|PHE|GLY|HIS|ILE|LYS|LEU|MET|ASN|PRO|GLN|ARG|SER|THR|VAL|TRP|TYR|MSE|HSE|HSD|HID|HIE|DA|DC|DG|DT|A|C|G|U|".match(thisRes)){
      if (thisRes === "WAT" || thisRes === "HOH" || thisRes === "TIP") {
        if (!isWaterChecked) {
          ligandchains.push(thisChain);
          ligandresnames.push(thisRes);
          ligandresnos.push(thisResNo);
          ligandComments.push(" ");
        }
      } else {
        var isChainAdded = ligandchains.includes(thisChain);
        var isResAdded = ligandresnames.includes(thisRes);
        var isResNoAdded = ligandresnos.includes(thisResNo);

        if (!(isChainAdded && isResAdded && isResNoAdded)) {
          ligandchains.push(thisChain);
          ligandresnames.push(thisRes);
          ligandresnos.push(thisResNo);
          ligandComments.push({
            display: false,
            element: "",
            number: "",
            index: ""
          });
        }
      }
    }

    if (thisEl !== "C" && thisEl !== "H" && thisEl !== "O" && thisEl !== "N" && thisEl !== "S" && thisEl !== "P") {
      ligandchains.push(thisChain);
      ligandresnames.push(thisRes);
      ligandresnos.push(thisResNo);
      ligandComments.push({
        display: true,
        element: thisEl,
        number: thisElNum,
        index: pdbIndex
      });
    }
  })


  if (isWaterChecked) {
    ligandchains.push(" ");
    ligandresnames.push("HOH");
    ligandresnos.push(" ");
    ligandComments.push({
      display: false,
      element: "",
      number: "",
      index: ""
    });

    ligandchains.push(" ");
    ligandresnames.push("WAT");
    ligandresnos.push(" ");
    ligandComments.push({
      display: false,
      element: "",
      number: "",
      index: ""
    });

    ligandchains.push(" ");
    ligandresnames.push("TIP");
    ligandresnos.push(" ");
    ligandComments.push({
      display: false,
      element: "",
      number: "",
      index: ""
    });
  }

  ligandGrid.classList.remove("hidden");
  ligandTitle.classList.remove("hidden");
  proteinTitle.classList.remove("hidden");
  proteinGrid.classList.remove("hidden");
  vdmBtn.classList.remove("hidden");

  chains.forEach(function (chain, index) {
    var rowString = /* html */ `
    <!-- Grid row -->
    <div class="grid-element">
      <p class="grid-text">${chain}</p>
    </div>
    <div class="grid-element">
      <p class="grid-text">${chaintypes[index]}</p>
    </div>
    <div class="grid-element">
      <select id="proteinRow-${index}" class="selector">
        ${includeOptions1}
      </select>
    </div>
    <div class="grid-element">
      <select id="proteinRowColor-${index}" class="selector">
        ${colorOptions}
      </select>
    </div>
    `;
    proteinGrid.insertAdjacentHTML("beforeend", rowString);
  });

  ligandchains.forEach(function (ligandChain, index) {
    var commentString = `${ligandComments[index].element} atom ${ligandComments[index].number}`
    var rowString = /* html */ `
    <!-- Grid row -->
    <div class="grid-element">
      <p class="grid-text">${ligandChain}</p>
    </div>
    <div class="grid-element">
      <p class="grid-text">${ligandresnames[index]}</p>
    </div>
    <div class="grid-element">
      <p class="grid-text">${ligandresnos[index]}</p>
    </div>
    <div class="grid-element">
      <select id="ligandRow-${index}" class="selector">
        ${includeOptions2}
      </select>
    </div>
    <div class="grid-element">
      <select id="ligandRowColor-${index}" class="selector">
        ${colorOptions}
      </select>
    </div>
    <div class="grid-element">
      <p class="grid-text">${ligandComments[index].display ? commentString : " "}</p>
    </div>
    `;
    ligandGrid.insertAdjacentHTML("beforeend", rowString);
  });
}

function handleWaterCheck(e) {
  isWaterChecked = switchWater.checked;
}

function buildVmd(e) {
  tclString = baseTcl;
  var nout = 0;

  chains.forEach(function (chain, index) {
    var value = document.getElementById("proteinRow-" + index).value;
    var color = document.getElementById("proteinRowColor-" + index).value;

    if (value === "No") {
      return;
    }

    tclString += "mol modselect " + nout + " 0 chain " + chain + "\n";

    if (value === "NewCartoon (cartoons)") {
      tclString += "mol modstyle " + nout + " 0 NewCartoon 0.300000 10.000000 4.100000 0\n";
    }

    if (value === "Licorice (sticks)") {
      tclString += "mol modstyle " + nout + " 0 Licorice 0.300000 12.000000 12.000000\n";
    }

    if (value === "VDW (spheres)" || value === "Surf (surface)") {
      tclString += "mol modstyle " + nout + " 0 VDW 1.000000 12.000000\n";
    }

    if (value === "Tube") {
      tclString += "mol modstyle " + nout + " 0 Tube 0.300000 12.000000\n";
    }

    if (value === "CPK") {
      tclString += "mol modstyle " + nout + " 0 CPK 1.000000 0.300000 12.000000 12.000000\n";
    }
    tclString += "mol modcolor " + nout + " 0 " + color + "\n";
    tclString += "\nmol addrep 0\n";
    nout++;
  });

  ligandchains.forEach(function (ligandChain, index) {
    var value = document.getElementById("ligandRow-" + index).value;
    var color = document.getElementById("ligandRowColor-" + index).value;

    if (value === "No") {
      return;
    }

    if (ligandComments[index].display) {
      tclString += "mol modselect " + nout + " 0 chain " + ligandChain + " and index " + ligandComments[index].index + "\n";
    } else {
      tclString += "mol modselect " + nout + " 0 chain " + ligandChain + " and resname " + ligandresnames[index] + " and resid " + ligandresnos[index] + "\n";
    }

    if (value === "Licorice (sticks)") {
      tclString += "mol modstyle " + nout + " 0 Licorice 0.300000 12.000000 12.000000\n";
    }

    if (value === "VDW (spheres)" || value === "Surf (surface)") {
      tclString += "mol modstyle " + nout + " 0 VDW 1.000000 12.000000\n";
    }

    if (value === "CPK") {
      tclString += "mol modstyle " + nout + " 0 CPK 1.000000 0.300000 12.000000 12.000000\n";
    }

    tclString += "mol modcolor " + nout + " 0 " + color + "\n";
    tclString += "\nmol addrep 0\n";
    nout++;

  });

  tclString += endTcl;

  tclText.classList.remove("hidden");
  submitSection.classList.remove("hidden");
  submitBtn.classList.remove("hidden");
  instructionsText.classList.remove("hidden");

  tclText.value = tclString;
}

function handleSubmit(e) {
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading...";
  var title = titleInput.value;
  var email = emailInput.value;

  const isEmailFine = isEmailValid(email);

  if (title.length <= 0 || !isEmailFine) {
    return;
  }

  var data = {
    pdb: pdbText.value,
    tcl: tclText.value,
    title,
    email,
  };

  fetch("https://molecularweb.epfl.ch/backend/api/pdb2ar/pdb", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      swal({
        title: "Perfect!",
        text: "We have received your data. Your project is being created, once it's done we'll send you an email :)",
        icon: "success",
        button: {
          text: "Ok",
        },
      });
    })
    .catch(function (error) {
      swal("Something went wrong", "Please, try again", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    });
}

detectBtn.addEventListener("click", readPdb);
switchWater.addEventListener("change", handleWaterCheck);
vdmBtn.addEventListener("click", buildVmd);
submitBtn.addEventListener("click", handleSubmit);

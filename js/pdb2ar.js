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
var searchInput = document.getElementById("pdb-search");
var searchBtn = document.getElementById("search-btn");
var uploadBtn = document.getElementById("upload-btn");
var buildFromPdb = document.getElementById("build-pdb");
var buildFromObj = document.getElementById("build-obj");
var pdbOptions = document.getElementById("pdb-options");
var pdbInstructions = document.getElementById("pdb-instructions");
var objInstructions = document.getElementById("obj-instructions");
var detectSection = document.getElementById("detect-section");
var searchSection = document.getElementById("search-section");
var welcomeSection = document.getElementById("welcome");
var uploadPDB = document.getElementById("upload-pdb-btn");
var backBtn = document.getElementById("back-btn");
var pdbInput = document.getElementById("pdb-input");
var fileDetails = document.getElementById("file-details");
var errorMsg = document.getElementById("error");
var disclaimers = document.getElementById("disclaimers");
var policy1 = document.getElementById("switch-policy-1");
var policy2 = document.getElementById("switch-policy-2");

var chains = [];
var chainstrings = [];
var chaintypes = [];

var ligandchains = [];
var ligandresnames = [];
var ligandresnos = [];
var ligandComments = [];

var tclString = "";

var isWaterChecked = true;

var mode = "";

function readPdb(e) {
  var pdbString = pdbText.value;

  if (pdbString.length === 0) {
    return;
  }

  chains = [];
  chainstrings = [];
  chaintypes = [];

  ligandchains = [];
  ligandresnames = [];
  ligandresnos = [];
  ligandComments = [];

  const gridEls = document.querySelectorAll("div.grid-element");

  [...gridEls].forEach(function (element) {
    element.remove();
  });

  var lines = pdbString.split("\n");

  var atoms = lines.filter(function (line, index) {
    return line.substring(0, 4) === "ATOM" || line.substring(0, 6) === "HETATM";
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
      chains.push(thisChain);
      chainstrings.push(atom);
      chainstrings.push(atom);
      if (
        "ALA|CYS|ASP|GLU|PHE|GLY|HIS|ILE|LYS|LEU|MET|ASN|PRO|GLN|ARG|SER|THR|VAL|TRP|TYR|MSE|HSE|HSD|HID|HIE".match(
          thisRes
        )
      ) {
        chaintypes.push("protein");
        chaintypes.push("protein");
      } else if ("DA|DC|DG|DT|A|C|G|U".match(thisRes)) {
        chaintypes.push("nucleic");
        chaintypes.push("nucleic");
      } else {
        chaintypes.push("other");
        chaintypes.push("other");
      }
    }

    if (
      !"ALA|CYS|ASP|GLU|PHE|GLY|HIS|ILE|LYS|LEU|MET|ASN|PRO|GLN|ARG|SER|THR|VAL|TRP|TYR|MSE|HSE|HSD|HID|HIE|DA|DC|DG|DT|A|C|G|U|".match(
        thisRes
      )
    ) {
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
            index: "",
          });
        }
      }
    }

    if (
      thisEl !== "C" &&
      thisEl !== "H" &&
      thisEl !== "O" &&
      thisEl !== "N" &&
      thisEl !== "S" &&
      thisEl !== "P"
    ) {
      ligandchains.push(thisChain);
      ligandresnames.push(thisRes);
      ligandresnos.push(thisResNo);
      ligandComments.push({
        display: true,
        element: thisEl,
        number: thisElNum,
        index: pdbIndex,
      });
    }
  });

  if (isWaterChecked) {
    ligandchains.push(" ");
    ligandresnames.push("HOH");
    ligandresnos.push(" ");
    ligandComments.push({
      display: false,
      element: "",
      number: "",
      index: "",
    });

    ligandchains.push(" ");
    ligandresnames.push("WAT");
    ligandresnos.push(" ");
    ligandComments.push({
      display: false,
      element: "",
      number: "",
      index: "",
    });

    ligandchains.push(" ");
    ligandresnames.push("TIP");
    ligandresnos.push(" ");
    ligandComments.push({
      display: false,
      element: "",
      number: "",
      index: "",
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
    var commentString = `${ligandComments[index].element} #${ligandComments[index].number}`;
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
      <p class="grid-text">${
        ligandComments[index].display ? commentString : " "
      }</p>
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

    tclString +=
      "mol modselect " + nout + " 0 chain " + chain + " and not water" + "\n";

    if (value === "NewCartoon (cartoons)") {
      tclString +=
        "mol modstyle " +
        nout +
        " 0 NewCartoon 0.300000 10.000000 4.100000 0\n";
    }

    if (value === "Licorice (sticks)") {
      tclString +=
        "mol modstyle " + nout + " 0 Licorice 0.300000 12.000000 12.000000\n";
    }

    if (value === "VDW (spheres)" || value === "Surf (surface)") {
      tclString += "mol modstyle " + nout + " 0 VDW 0.800000 12.000000\n";
    }

    if (value === "Tube") {
      tclString += "mol modstyle " + nout + " 0 Tube 0.300000 12.000000\n";
    }

    if (value === "CPK") {
      tclString +=
        "mol modstyle " +
        nout +
        " 0 CPK 1.000000 0.300000 12.000000 12.000000\n";
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
      tclString +=
        "mol modselect " +
        nout +
        " 0 chain " +
        ligandChain +
        " and index " +
        ligandComments[index].index +
        "\n";
    } else {
      tclString +=
        "mol modselect " +
        nout +
        " 0 chain " +
        ligandChain +
        " and resname " +
        ligandresnames[index] +
        " and resid " +
        ligandresnos[index] +
        "\n";
    }

    if (value === "Licorice (sticks)") {
      tclString +=
        "mol modstyle " + nout + " 0 Licorice 0.300000 12.000000 12.000000\n";
    }

    if (value === "VDW (spheres)" || value === "Surf (surface)") {
      tclString += "mol modstyle " + nout + " 0 VDW 0.800000 12.000000\n";
    }

    if (value === "CPK") {
      tclString +=
        "mol modstyle " +
        nout +
        " 0 CPK 1.000000 0.300000 12.000000 12.000000\n";
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
  disclaimers.classList.remove("hidden");

  tclText.value = tclString;
}

function handleSubmit(e) {
  var title = titleInput.value;
  var email = emailInput.value;

  const isEmailFine = isEmailValid(email);

  if (title.length <= 0 && !isEmailFine) {
    swal(
      "Something went wrong",
      "Please add a title to your project and a valid email for us to send you the result",
      "error"
    );
    return;
  }

  if (title.length <= 0) {
    swal(
      "Something went wrong",
      "Please, add a title to your project",
      "error"
    );
    return;
  }

  if (!isEmailFine) {
    swal(
      "Something went wrong",
      "Please add a valid email for us to send you the result",
      "error"
    );
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Loading...";

  if (mode === "PDB") {
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
  } else if (mode === "OBJ") {
    var data = new FormData();
    data.append("models", pdbInput.files[0]);
    data.append("models", pdbInput.files[1]);
    data.append("title", title);
    data.append("email", email);

    fetch("https://molecularweb.epfl.ch/backend/api/pdb2ar/obj", {
      method: "POST",
      body: data,
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
}

function handleUploadPDB(e) {
  var reader = new FileReader();
  reader.onload = () => {
    pdbText.value = reader.result;
  };
  reader.readAsText(e.target.files[0]);
};

function handleSearch(e) {
  var value = searchInput.value;

  if (value.length !== 4) {
    return;
  }

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  fetch(`https://files.rcsb.org/view/${value}.pdb`)
    .then((response) => {
      if (response.status === 404) {
        throw new Error("error");
      } else {
        return response.text();
      }
    })
    .then(function (data) {
      pdbText.value = data;
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    })
    .catch(function (error) {
      swal("Something went wrong", "Please, try again", "error");
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    });
}

function handlePdbSelection(e) {
  mode = "PDB";
  pdbOptions.classList.add("hidden");
  welcomeSection.classList.add("hidden");
  pdbText.classList.remove("hidden");
  detectSection.classList.remove("hidden");
  searchSection.classList.remove("hidden");
  pdbInstructions.classList.remove("hidden");
  backBtn.classList.remove("hidden");
}

function handleObjSelection(e) {
  mode = "OBJ";
  pdbOptions.classList.add("hidden");
  welcomeSection.classList.add("hidden");
  objInstructions.classList.remove("hidden");
  uploadBtn.classList.remove("hidden");
  backBtn.classList.remove("hidden");
}

function handleBack(e) {
  mode = "";
  pdbOptions.classList.remove("hidden");
  welcomeSection.classList.remove("hidden");

  objInstructions.classList.add("hidden");
  uploadBtn.classList.add("hidden");
  backBtn.classList.add("hidden");
  submitSection.classList.add("hidden");
  submitBtn.classList.add("hidden");
  instructionsText.classList.add("hidden");
  fileDetails.classList.add("hidden");
  errorMsg.classList.add("hidden");
  pdbInput.value = "";

  var label1 = document.getElementById("file-1");
  var label2 = document.getElementById("file-2");

  if (label1) {
    label1.remove();
  }

  if (label2) {
    label2.remove();
  }

  pdbText.classList.add("hidden");
  detectSection.classList.add("hidden");
  searchSection.classList.add("hidden");
  pdbInstructions.classList.add("hidden");
  backBtn.classList.add("hidden");

  chains = [];
  chainstrings = [];
  chaintypes = [];

  ligandchains = [];
  ligandresnames = [];
  ligandresnos = [];
  ligandComments = [];

  const gridEls = document.querySelectorAll("div.grid-element");

  [...gridEls].forEach(function (element) {
    element.remove();
  });

  ligandGrid.classList.add("hidden");
  ligandTitle.classList.add("hidden");
  proteinTitle.classList.add("hidden");
  proteinGrid.classList.add("hidden");
  vdmBtn.classList.add("hidden");
  tclText.classList.add("hidden");
}

function checkFiles(input) {
  // 2 files
  if (!(input.files.length === 2)) {
    return false;
  }

  var file1 = input.files[0];
  var file2 = input.files[1];

  // .obj and .mtl
  var extension1 = file1.name.slice(-4).toLowerCase();
  var extension2 = file2.name.slice(-4).toLowerCase();
  var extensions = [extension1, extension2];

  if (!(extensions.includes(".mtl") && extensions.includes(".obj"))) {
    return false;
  }

  // Names must be the same
  var name1 = file1.name.slice(0, -4);
  var name2 = file2.name.slice(0, -4);

  if (name1 !== name2) {
    return false;
  }

  // Files size < 700mb
  var size1 = file1.size;
  var size2 = file2.size;

  if (size1 + size2 >= 700000000) {
    return false;
  }

  return true;
}

function handleUpload(e) {
  var input = e.target;
  var areFilesValid = checkFiles(input);

  var reader = new FileReader();

  if (areFilesValid) {
    reader.readAsText(input.files[0]);
  } else {
    errorMsg.classList.remove("hidden");
  }

  // Is this file from VMD?
  reader.onload = function () {
    var rawFile = reader.result;
    var isFromVMD = rawFile.includes("export by VMD");

    if (isFromVMD) {
      fileDetails.classList.remove("hidden");
      errorMsg.classList.add("hidden");
      var textString1 = /* html */ `
      <p id="file-1" class="normal-text file-detail"> - ${input.files[0].name}</p>
      `;
      var textString2 = /* html */ `
      <p id="file-2" class="normal-text file-detail"> - ${input.files[1].name}</p>
      `;
      fileDetails.insertAdjacentHTML("beforeend", textString1);
      fileDetails.insertAdjacentHTML("beforeend", textString2);
      submitSection.classList.remove("hidden");
      submitBtn.classList.remove("hidden");
      instructionsText.classList.remove("hidden");
    } else {
      errorMsg.classList.remove("hidden");
    }
  };
}

function handlePolicyChange(e) {
  submitBtn.disabled = !e.target.checked;
}

detectBtn.addEventListener("click", readPdb);
switchWater.addEventListener("change", handleWaterCheck);
vdmBtn.addEventListener("click", buildVmd);
submitBtn.addEventListener("click", handleSubmit);
searchBtn.addEventListener("click", handleSearch);
uploadPDB.addEventListener("change", handleUploadPDB);
buildFromObj.addEventListener("click", handleObjSelection);
buildFromPdb.addEventListener("click", handlePdbSelection);
pdbInput.addEventListener("change", handleUpload);
backBtn.addEventListener("click", handleBack);
policy1.addEventListener("change", handlePolicyChange);

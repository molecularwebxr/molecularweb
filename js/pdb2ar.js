var detectBtn = document.getElementById("detect-btn");
var pdbText = document.getElementById("pdb-text");
var switchWater = document.getElementById("switch-water");
var proteinTitle = document.getElementById("protein-title");
var proteinGrid = document.getElementById("protein-grid");
var ligandTitle = document.getElementById("ligand-title");
var ligandGrid = document.getElementById("ligand-grid");
var vdmBtn = document.getElementById("vmd-btn");

var chains = [];
var chainstrings = [];
var chaintypes = [];

var ligandchains = [];
var ligandresnames = [];
var ligandresnos = [];

var tclString = "";

var isWaterChecked = true;

function readPdb(e) {
  var pdbString = pdbText.value;

  if (pdbString.length === 0) {
    return;
  }

  var lines = pdbString.split("\n");

  for (i = 0; i < lines.length; i++) {
    if (
      lines[i].substring(0, 4) == "ATOM" ||
      lines[i].substring(0, 6) == "HETATM"
    ) {
      var thischain = lines[i].substring(21, 22).trim().toUpperCase();
      var chainisthere = -1;
      for (j = 0; j < chains.length; j++) {
        if (thischain === chains[j]) {
          chainisthere = j;
          break;
        }
      }
      if (chainisthere > -1) {
        chainstrings[chainisthere] =
          chainstrings[chainisthere] + "\n" + lines[i];
      } else {
        chains.push(thischain);
        chainstrings.push(lines[i]);
        if (
          "ALA|CYS|ASP|GLU|PHE|GLY|HIS|ILE|LYS|LEU|MET|ASN|PRO|GLN|ARG|SER|THR|VAL|TRP|TYR".match(
            lines[i].substring(17, 20).trim().toUpperCase()
          )
        ) {
          chaintypes.push("protein");
        } else if (
          "DA|DC|DG|DT|A|C|G|U".match(
            lines[i].substring(17, 20).trim().toUpperCase()
          )
        ) {
          chaintypes.push("nucleic");
        } else {
          chaintypes.push("other");
        }
      }

      if (
        !"ALA|CYS|ASP|GLU|PHE|GLY|HIS|ILE|LYS|LEU|MET|ASN|PRO|GLN|ARG|SER|THR|VAL|TRP|TYR|DA|DC|DG|DT|A|C|G|U|HSE|HSD|HID|HIE".match(
          lines[i].substring(17, 20).trim().toUpperCase()
        )
      ) {
        if (
          lines[i].substring(17, 20).trim().toUpperCase() == "WAT" ||
          lines[i].substring(17, 20).trim().toUpperCase() == "HOH" ||
          lines[i].substring(17, 20).trim().toUpperCase() == "TIP"
        ) {
          if (!isWaterChecked) {
            ligandchains.push(thischain);
            ligandresnames.push(
              lines[i].substring(17, 20).trim().toUpperCase()
            );
            ligandresnos.push(
              parseInt(lines[i].substring(23, 26).trim().toUpperCase())
            );
          }
        } else {
          //modificar esto para que si la chain y el resno ya estan, no se agreguen de nuevo!
          ligandchains.push(thischain);
          ligandresnames.push(lines[i].substring(17, 20).trim().toUpperCase());
          ligandresnos.push(
            parseInt(lines[i].substring(23, 26).trim().toUpperCase())
          );
        }
      }
    }
  }

  if (isWaterChecked) {
    ligandchains.push(" ");
    ligandresnames.push("HOH");
    ligandresnos.push(" ");
    ligandchains.push(" ");
    ligandresnames.push("WAT");
    ligandresnos.push(" ");
    ligandchains.push(" ");
    ligandresnames.push("TIP");
    ligandresnos.push(" ");
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

    if (value === "NewCartoon (cartoons)") {
      tclString += "mol modselect " + nout + " 0 chain " + chain + "\n";
      tclString += "mol modstyle " + nout + " 0 NewCartoon 0.300000 10.000000 4.100000 0\n";
      tclString += "mol modcolor " + nout + " 0 " + color + "\n";
      tclString += "\nmol addrep 0\n";
      nout++;
    }

    if (value === "Licorice (sticks)") {
      tclString += "mol modselect " + nout + " 0 chain " + chain + "\n";
      tclString += "mol modstyle " + nout + " 0 Licorice 0.300000 12.000000 12.000000\n";
      tclString += "mol modcolor " + nout + " 0 " + color + "\n";
      tclString += "\nmol addrep 0\n";
      nout++;
    }

    if (value === "VDW (spheres)") {
      tclString += "mol modselect " + nout + " 0 chain " + chain + "\n";
      tclString += "mol modstyle " + nout + " 0 VDW 1.000000 12.000000\n";
      tclString += "mol modcolor " + nout + " 0 " + color + "\n";
      tclString += "\nmol addrep 0\n";
      nout++;
    }

    if (value === "Surf (surface)") {
      tclString += "mol modselect " + nout + " 0 chain " + chain + " and resname \n";
      tclString += "mol modstyle " + nout + " 0 Surf 1.400000 0.000000\n";
      tclString += "mol modcolor " + nout + " 0 " + color + "\n";
      tclString += "\nmol addrep 0\n";
      nout++;
    }
  });

  ligandchains.forEach(function (ligandChain, index) {
    var value = document.getElementById("ligandRow-" + index).value;
    var color = document.getElementById("ligandRowColor-" + index).value;

    if (value == "Licorice (sticks)") {
      tclString += "mol modselect " + nout + " 0 chain " + ligandChain + " and resname " + ligandresnames[index] + " and resid " + ligandresnos[index] + "\n"
      tclString += "mol modstyle " + nout + " 0 Licorice 0.300000 12.000000 12.000000\n"
      tclString += "mol modcolor " + nout + " 0 " + color + "\n"
      tclString += "\nmol addrep 0\n"
      nout++
    }
	if (value == "VDW (spheres)") {
      tclString += "mol modselect " + nout + " 0 chain " + ligandChain + " and resname " + ligandresnames[index] + " and resid " + ligandresnos[index] + "\n"
      tclString += "mol modstyle " + nout + " 0 VDW 1.000000 12.000000\n"
      tclString += "mol modcolor " + nout + " 0 " + color + "\n"
      tclString += "\nmol addrep 0\n"
      nout++
    }
	if (value == "Surf (surface)") {
      tclString += "mol modselect " + nout + " 0 chain " + ligandChain + " and resname " + ligandresnames[index] + " and resid " + ligandresnos[index] + "\n"
      tclString += "mol modstyle " + nout + " 0 Surf 1.400000 0.000000\n"
      tclString += "mol modcolor " + nout + " 0 " + color + "\n"
      tclString += "\nmol addrep 0\n"
      nout++
    }
  });

  console.log(tclString);
}

detectBtn.addEventListener("click", readPdb);
switchWater.addEventListener("change", handleWaterCheck);
vdmBtn.addEventListener("click", buildVmd);

var detectBtn = document.getElementById("detect-btn");
var pdbText = document.getElementById("pdb-text");
var switchWater = document.getElementById("switch-water");

var chains = [];
var chainstrings = [];
var chaintypes = [];

var ligandchains = [];
var ligandresnames = [];
var ligandresnos = [];

var isWaterChecked = true;

function readPdb(e) {
  var pdbString = pdbText.value;

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

  console.log(chains);
  console.log(chaintypes);
  console.log(chainstrings);

  console.log(ligandchains);
  console.log(ligandresnames);
  console.log(ligandresnos);
}

function handleWaterCheck(e) {
  isWaterChecked = switchWater.checked;
}

detectBtn.addEventListener("click", readPdb);
switchWater.addEventListener("change", handleWaterCheck);

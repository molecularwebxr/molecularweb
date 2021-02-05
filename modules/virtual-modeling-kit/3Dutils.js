var atomsarray = [];
var bondsarray = [];
var spheresarray = [];
var bondfirstatom = [];
var bondlength = [];
var atoms = 0;
var radiusfactor1 = 0.35;
var radiusfactor2 = 1.4;
var bonds = {};
var allBonds = {};

var SIMPLE = 0.12;
var DOUBLE = 0.2;
var TRIPLE = 0.25;

var sphereGeometry = new THREE.SphereBufferGeometry(1, 32, 16);

/******************  3D utils *************************/

// This function checks if one two elements are N, C or O
function checkNCO(elementA, elementB) {
  return (
    (elementA == 5 || elementA == 6 || elementA == 7) &&
    (elementB == 5 || elementB == 6 || elementB == 7)
  );
}

// This function returns 1.2 * (A + B)^2
// A and B are element radius
function radiiSum(elementA, elementB) {
  return 1.2 * Math.pow(elementA + elementB, 2);
}

// This function creates a 3D cylinder from A to B
function cylindricalSegment(A, B, radius, material) {
  var vec = B.clone();
  vec.sub(A);
  var h = vec.length();
  vec.normalize();
  var quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
  var geometry = new THREE.CylinderBufferGeometry(radius, radius, h, 32);
  geometry.translate(0, h / 2, 0);
  var cylinder = new THREE.Mesh(geometry, material);
  cylinder.applyQuaternion(quaternion);
  cylinder.position.set(A.x, A.y, A.z);
  return cylinder;
}

// This function receives raw PDB string and returns atoms & cordinates
function setupPdb(rawPdb) {
  var pdb = {
    xCoords: [],
    yCoords: [],
    zCoords: [],
    resnos: [],
    elements: [],
    atoms: 0,
    xAvg: 0,
    yAvg: 0,
    zAvg: 0,
  };

  var lines = rawPdb.split("\n");

  // Read all lines, when a line starts with ATOM or HETATM
  // then it encodes an atom whose properties are read
  for (i = 0; i < lines.length; i++) {
    if (
      lines[i].substring(0, 4) == "ATOM" ||
      lines[i].substring(0, 6) == "HETATM"
    ) {
      pdb.xCoords.push(parseFloat(lines[i].substring(30, 38)));
      pdb.yCoords.push(parseFloat(lines[i].substring(38, 46)));
      pdb.zCoords.push(parseFloat(lines[i].substring(46, 54)));
      pdb.resnos.push(parseFloat(lines[i].substring(22, 26)));
      pdb.xAvg = pdb.xAvg + pdb.xCoords[pdb.atoms];
      pdb.yAvg = pdb.yAvg + pdb.yCoords[pdb.atoms];
      pdb.zAvg = pdb.zAvg + pdb.zCoords[pdb.atoms];
      var element = lines[i].substring(76, 79).trim().toUpperCase();
      for (j = 0; j < elementNames.length; j++) {
        if (element == elementNames[j]) {
          pdb.elements[pdb.atoms] = j;
          break;
        }
      }
      pdb.atoms++;
    }
  }

  //need the average x, y and z values to center the molecule at 0,0,0
  pdb.xAvg = pdb.xAvg / pdb.atoms;
  pdb.yAvg = pdb.yAvg / pdb.atoms;
  pdb.zAvg = pdb.zAvg / pdb.atoms;

  return pdb;
}

// This function calculate bonds between atoms
// Returns only atoms to draw
function getBonds(pdb) {
  var bonds = {};
  for (i = 0; i < pdb.atoms; i++) {
    var currentAtomI = `atom${i + 1}`;

    var distsqr;
    var bondedAtoms = [];

    for (j = i + 1; j < pdb.atoms; j++) {
      var currentAtomJ = `atom${j + 1}`;

      //get distance squared
      distsqr =
        Math.pow(pdb.xCoords[i] - pdb.xCoords[j], 2) +
        Math.pow(pdb.yCoords[i] - pdb.yCoords[j], 2) +
        Math.pow(pdb.zCoords[i] - pdb.zCoords[j], 2);

      //if distance squared is less than 1.2 x the sum of the radii squared, add a bond
      var radSum = radiiSum(
        elementradii[pdb.elements[i]],
        elementradii[pdb.elements[j]]
      );

      if (distsqr < radSum) {
        bondedAtoms.push(currentAtomJ);
      }
    }
    bonds[currentAtomI] = bondedAtoms;
  }
  return bonds;
}

function createSticks(pdb) {
  bonds = getBonds(pdb);

  var bondKeys = Object.keys(bonds);

  // Here we make a Deep clone of bonds object so we have
  // all bonds for each atom, not only the ones we will draw
  // otherwise we will draw the twice
  allBonds = JSON.parse(JSON.stringify(bonds));

  bondKeys.forEach(function (atom) {
    allBonds[atom].forEach(function (bondedAtom) {
      if (!allBonds[bondedAtom].includes(atom)) {
        allBonds[bondedAtom].push(atom);
      }
    });
  });

  bondKeys.forEach(function (atom, atomIndex) {
    //point1 is the first atom (i), point3 is the second atom (j)
    //point2 is at the center in-between atoms i and j
    //then the first half of the bond is from sphere 1 to 2 and the
    //second half of the bond is from point2 to point3

    var point1 = new THREE.Vector3(
      -(pdb.xCoords[atomIndex] - pdb.xAvg),
      pdb.yCoords[atomIndex] - pdb.yAvg,
      pdb.zCoords[atomIndex] - pdb.zAvg
    );

    bonds[atom].forEach(function (bondedAtom) {
      var bondedAtomIndex = bondKeys.indexOf(bondedAtom);

      var point2 = new THREE.Vector3(
        -(
          pdb.xCoords[bondedAtomIndex] / 2 +
          pdb.xCoords[atomIndex] / 2 -
          pdb.xAvg
        ),
        pdb.yCoords[bondedAtomIndex] / 2 +
          pdb.yCoords[atomIndex] / 2 -
          pdb.yAvg,
        pdb.zCoords[bondedAtomIndex] / 2 + pdb.zCoords[atomIndex] / 2 - pdb.zAvg
      );

      var point3 = new THREE.Vector3(
        -(pdb.xCoords[bondedAtomIndex] - pdb.xAvg),
        pdb.yCoords[bondedAtomIndex] - pdb.yAvg,
        pdb.zCoords[bondedAtomIndex] - pdb.zAvg
      );

      var radius = SIMPLE;
      var atom1Bonds = allBonds[atom].length;
      var atom2Bonds = allBonds[bondedAtom].length;

      /******************  Bonde rules for C *************************/
      if (
        pdb.elements[atomIndex] === 5 &&
        pdb.elements[bondedAtomIndex] === 5
      ) {
        if (atom1Bonds === 4 && atom2Bonds === 4) {
          radius = SIMPLE;
        }

        if (atom1Bonds === 3 && atom2Bonds === 3) {
          radius = DOUBLE;
        }

        if (atom1Bonds === 2 && atom2Bonds === 2) {
          radius = TRIPLE;
        }
      }

      /******************  Bonde rules for O *************************/

      // One of both atoms is O and have 1 bonded atom (TERMINAL) => DOUBLE
      // Otherwise is simple
      if (
        (pdb.elements[atomIndex] === 7 && atom1Bonds === 1) ||
        (pdb.elements[bondedAtomIndex] === 7 && atom2Bonds === 1)
      ) {
        radius = DOUBLE;
      } 

      /******************  Bonde rules for N *************************/

      // One atom is N and have 4 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 4) ||
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 4)
      ) {
        radius = SIMPLE;
      }

      // One atom is N with 3 bonded atoms
      // The other atom is C with 4 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 3) &&
        (pdb.elements[bondedAtomIndex] === 5 && atom2Bonds === 4) ||
        (pdb.elements[atomIndex] === 5 && atom1Bonds === 4) &&
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 3)
      ) {
        radius = SIMPLE;
      }

      // One atom is N with 3 bonded atoms
      // The other atom is O with 2 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 3) &&
        (pdb.elements[bondedAtomIndex] === 7 && atom2Bonds === 2) ||
        (pdb.elements[atomIndex] === 7 && atom1Bonds === 2) &&
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 3)
      ) {
        radius = SIMPLE;
      }

      // One atom is N with 3 bonded atoms
      // The other atom is C with 3 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 3) &&
        (pdb.elements[bondedAtomIndex] === 5 && atom2Bonds === 3) ||
        (pdb.elements[atomIndex] === 5 && atom1Bonds === 3) &&
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 3)
      ) {
        radius = DOUBLE;
      }

      // One atom is N with 2 bonded atoms
      // The other atom is C with 3 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 2) &&
        (pdb.elements[bondedAtomIndex] === 5 && atom2Bonds === 3) ||
        (pdb.elements[atomIndex] === 5 && atom1Bonds === 3) &&
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 2)
      ) {
        radius = DOUBLE;
      }

      // One atom is N and have 1 bonded atom (TERMINAL) => TRIPLE
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 1) ||
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 1)
      ) {
        radius = TRIPLE;
      }

      // Both atoms are N with two bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 && atom1Bonds === 2) &&
        (pdb.elements[bondedAtomIndex] === 6 && atom2Bonds === 2)
      ) {
        radius = DOUBLE;
      }

      // One of both atoms is H and have 1 bonded atom (TERMINAL) => SIMPLE
      // Otherwise is simple
      if (
        (pdb.elements[atomIndex] === 0 && atom1Bonds === 1) ||
        (pdb.elements[bondedAtomIndex] === 0 && atom2Bonds === 1)
      ) {
        radius = SIMPLE;
      } 


      var bond1 = cylindricalSegment(
        point2,
        point1,
        radius,
        new THREE.MeshLambertMaterial({
          color: elementColors[pdb.elements[atomIndex]],
        })
      );
      var bond2 = cylindricalSegment(
        point2,
        point3,
        radius,
        new THREE.MeshLambertMaterial({
          color: elementColors[pdb.elements[bondedAtomIndex]],
        })
      );
      stickGroup.add(bond1);
      stickGroup.add(bond2);
      bondsarray.push(bond1);
      bondsarray.push(bond2);
      bondfirstatom.push(atomIndex);
      bondfirstatom.push(bondedAtomIndex);
    });
  });

  //if both atoms are C, N or O then we have to check whether they are forming a double bond
  // var areNCO = checkNCO(pdb.elements[i], pdb.elements[j]);

  // if (areNCO) {
  // }

  // console.log(bonds);
  sceneGroup.add(stickGroup);
}

function createSpheres(pdb) {
  //this loop will create the spheres to display the atoms at the defined radius
  //and the actual physical cannon spheres
  var radiusFactor = renderType.isActive ? radiusfactor1 : radiusfactor2;
  for (i = 0; i < pdb.atoms; i++) {
    var sphereRadius = radiusFactor * elementradii[pdb.elements[i]];
    var sphereMesh = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshLambertMaterial({ color: elementColors[pdb.elements[i]] })
    );

    sphereMesh.scale.setScalar(sphereRadius);

    sphereMesh.position.x = (pdb.xCoords[i] - pdb.xAvg);
    sphereMesh.position.y = pdb.yCoords[i] - pdb.yAvg;
    sphereMesh.position.z = pdb.zCoords[i] - pdb.zAvg;
    spheresGroup.add(sphereMesh); //added the sphere representation for atom i
    atomsarray.push(sphereMesh);

    var sphereShape = new CANNON.Sphere(0.5 * elementradii[pdb.elements[i]]); // Step 1
    var sphereBody = new CANNON.Body({
      mass: elementmasses[pdb.elements[i]],
      shape: sphereShape,
    }); // Step 2
    sphereBody.position.set(
      sphereMesh.position.x,
      sphereMesh.position.y,
      sphereMesh.position.z
    );
    sphereBody.velocity.x = 0; //10*Math.random(1)-5  //a small random number will give some initial velocity
    sphereBody.velocity.y = 0; //10*Math.random(1)-5
    sphereBody.velocity.z = 0; //10*Math.random(1)-5
    spheresarray.push(sphereBody);
    world.add(sphereBody); //added the sphere to the world
  }
  sceneGroup.add(spheresGroup);
}

function clearGroup(group) {
  var length = group.children.length;

  for (var i = length - 1; i >= 0; i--) {
    if (group.children[i].geometry) group.children[i].geometry.dispose();
    if (group.children[i].material) group.children[i].material.dispose();
    if (group.children[i].texture) group.children[i].texture.dispose();
    group.remove(group.children[i]);
  }
}

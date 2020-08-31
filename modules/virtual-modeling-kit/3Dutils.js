var atomsarray = [];
var bondsarray = [];
var spheresarray = [];
var bondfirstatom = [];
var bondlength = [];
var atoms = 0;
var radiusfactor1 = 0.35;
var radiusfactor2 = 1.4;

var sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

function cylindricalSegment(A, B, radius, material) {
  var vec = B.clone();
  vec.sub(A);
  var h = vec.length();
  vec.normalize();
  var quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
  var geometry = new THREE.CylinderGeometry(radius, radius, h, 32);
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
      for (j = 0; j < elementNames.length; j++) {
        if (
          lines[i].substring(76, 79).trim().toUpperCase() == elementNames[j]
        ) {
          pdb.elements[pdb.atoms] = j;
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

function createSticks(pdb) {
  for (i = 0; i < pdb.atoms; i++) {
    var distsqr;
    //create a vec3 representing atom i
    var point1 = new THREE.Vector3(
      -(pdb.xCoords[i] - pdb.xAvg),
      pdb.yCoords[i] - pdb.yAvg,
      pdb.zCoords[i] - pdb.zAvg
    );

    for (
      j = i + 1;
      j < pdb.atoms;
      j++ //iterate through all other atoms looking for bonded atoms
    ) {
      //get distance squared
      distsqr =
        Math.pow(pdb.xCoords[i] - pdb.xCoords[j], 2) +
        Math.pow(pdb.yCoords[i] - pdb.yCoords[j], 2) +
        Math.pow(pdb.zCoords[i] - pdb.zCoords[j], 2);
      //if distance squared is less than 1.2 x the sum of the radii squared, add a bond
      if (
        distsqr <
        1.2 *
          Math.pow(
            elementradii[pdb.elements[i]] + elementradii[pdb.elements[j]],
            2
          )
      ) {
        var point2 = new THREE.Vector3(
          -(pdb.xCoords[j] / 2 + pdb.xCoords[i] / 2 - pdb.xAvg),
          pdb.yCoords[j] / 2 + pdb.yCoords[i] / 2 - pdb.yAvg,
          pdb.zCoords[j] / 2 + pdb.zCoords[i] / 2 - pdb.zAvg
        );

        var point3 = new THREE.Vector3(
          -(pdb.xCoords[j] - pdb.xAvg),
          pdb.yCoords[j] - pdb.yAvg,
          pdb.zCoords[j] - pdb.zAvg
        );

        //point1 was the first atom (i), now point3 is the second atom (j)
        //point2 is at the center in-between atoms i and j
        //then the first half of the bond is from sphere 1 to 2 and the
        //second half of the bond is from point2 to point3
        var radius = 0.12;
        var angle1 = 109;
        var angle2 = 109;
        var nboundto1 = 0;
        var nboundto2 = 0;

        //if both atoms are C, N or O then we have to check whether they are forming a double bond
        //to know this we check if they have at least one 120 degree angle around
        if (
          (pdb.elements[i] == 1 ||
            pdb.elements[i] == 2 ||
            pdb.elements[i] == 3) &&
          (pdb.elements[j] == 1 || pdb.elements[j] == 2 || pdb.elements[j] == 3)
        ) {
          for (
            k = 0;
            k < pdb.atoms;
            k++ //iterate through all other atoms looking for a second atom bonded to i or to j
          ) {
            if (k != i && k != j) {
              //get distance squared for pair i-k
              distsqr =
                Math.pow(pdb.xCoords[i] - pdb.xCoords[k], 2) +
                Math.pow(pdb.yCoords[i] - pdb.yCoords[k], 2) +
                Math.pow(pdb.zCoords[i] - pdb.zCoords[k], 2);
              //if distance squared is less than 1.2 x the sum of the radii squared, add a bond
              if (
                distsqr <
                1.2 *
                  Math.pow(
                    elementradii[pdb.elements[i]] +
                      elementradii[pdb.elements[k]],
                    2
                  )
              ) {
                var AB = Math.sqrt(
                  Math.pow(pdb.xCoords[i] - pdb.xCoords[j], 2) +
                    Math.pow(pdb.yCoords[i] - pdb.yCoords[j], 2) +
                    Math.pow(pdb.zCoords[i] - pdb.zCoords[j], 2)
                );
                var BC = Math.sqrt(
                  Math.pow(pdb.xCoords[k] - pdb.xCoords[i], 2) +
                    Math.pow(pdb.yCoords[k] - pdb.yCoords[i], 2) +
                    Math.pow(pdb.zCoords[k] - pdb.zCoords[i], 2)
                );
                var AC = Math.sqrt(
                  Math.pow(pdb.xCoords[k] - pdb.xCoords[j], 2) +
                    Math.pow(pdb.yCoords[k] - pdb.yCoords[j], 2) +
                    Math.pow(pdb.zCoords[k] - pdb.zCoords[j], 2)
                );
                var angle1 =
                  (180 / 3.141592654) *
                  Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
                //alert(i + '  ' + j + '  ' + k + '       ' + angle)
                nboundto1++;
              }
              //get distance squared for pair j-k
              distsqr =
                Math.pow(pdb.xCoords[j] - pdb.xCoords[k], 2) +
                Math.pow(pdb.yCoords[j] - pdb.yCoords[k], 2) +
                Math.pow(pdb.zCoords[j] - pdb.zCoords[k], 2);
              //if distance squared is less than 1.2 x the sum of the radii squared, add a bond
              if (
                distsqr <
                1.2 *
                  Math.pow(
                    elementradii[pdb.elements[j]] +
                      elementradii[pdb.elements[k]],
                    2
                  )
              ) {
                var AB = Math.sqrt(
                  Math.pow(pdb.xCoords[j] - pdb.xCoords[i], 2) +
                    Math.pow(pdb.yCoords[j] - pdb.yCoords[i], 2) +
                    Math.pow(pdb.zCoords[j] - pdb.zCoords[i], 2)
                );
                var BC = Math.sqrt(
                  Math.pow(pdb.xCoords[k] - pdb.xCoords[j], 2) +
                    Math.pow(pdb.yCoords[k] - pdb.yCoords[j], 2) +
                    Math.pow(pdb.zCoords[k] - pdb.zCoords[j], 2)
                );
                var AC = Math.sqrt(
                  Math.pow(pdb.xCoords[k] - pdb.xCoords[i], 2) +
                    Math.pow(pdb.yCoords[k] - pdb.yCoords[i], 2) +
                    Math.pow(pdb.zCoords[k] - pdb.zCoords[i], 2)
                );
                var angle2 =
                  (180 / 3.141592654) *
                  Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
                nboundto2++;
              }
            }
          }
        }
        //if both angles are close to 120 degrees then this is a double bond
        //and we draw it thicker  THIS VISUALIZATION SHOULD BE IMPROVED !
        if (Math.abs(angle1 - 120) < 4 && Math.abs(angle2 - 120) < 4) {
          var radius = 0.25;
        }
        if (
          Math.abs(angle1 - 120) < 4 &&
          nboundto2 < 2 &&
          pdb.elements[j] == 3
        ) {
          var radius = 0.25;
        }
        if (
          Math.abs(angle2 - 120) < 4 &&
          nboundto1 < 2 &&
          pdb.elements[j] == 3
        ) {
          var radius = 0.25;
        }

        //we last draw the bond, which is split in two parts each coloured as the closest atom
        var bond1 = cylindricalSegment(
          point2,
          point1,
          radius,
          new THREE.MeshLambertMaterial({
            color: elementColors[pdb.elements[i]],
          })
        ); // , opacity: 1, transparent: false, side: THREE.DoubleSide, depthWrite: false} ))
        var bond2 = cylindricalSegment(
          point2,
          point3,
          radius,
          new THREE.MeshLambertMaterial({
            color: elementColors[pdb.elements[j]],
          })
        ); // , opacity: 1, transparent: false, side: THREE.DoubleSide, depthWrite: false} ))
        stickGroup.add(bond1);
        stickGroup.add(bond2);
        bondsarray.push(bond1);
        bondsarray.push(bond2);
        bondfirstatom.push(i);
        bondfirstatom.push(j);
      }
    }
  }
  sceneGroup.add(stickGroup);
}

function createSpheres(pdb) {
  //this loop will create the spheres to display the atoms at the defined radius
  //and the actual physical cannon spheres
  var radiusFactor = renderType.value === "spheres" ? radiusfactor2 : radiusfactor1;
  for (i = 0; i < pdb.atoms; i++) {
    var sphereRadius = radiusFactor * elementradii[pdb.elements[i]];
    var sphereMesh = new THREE.Mesh(
      sphereGeometry,
      //new THREE.MeshLambertMaterial({ color: elementcolors[elements[i]] , opacity: 1, transparent: false, side: THREE.DoubleSide, depthWrite: false})
      new THREE.MeshLambertMaterial({ color: elementColors[pdb.elements[i]] })
    );

    sphereMesh.scale.setScalar(sphereRadius);

    sphereMesh.position.x = -(pdb.xCoords[i] - pdb.xAvg);
    sphereMesh.position.y = pdb.yCoords[i] - pdb.yAvg;
    sphereMesh.position.z = pdb.zCoords[i] - pdb.zAvg;
    spheresGroup.add(sphereMesh); //added the sphere representation for atom i
    atomsarray.push(sphereMesh);

    var sphereShape = new CANNON.Sphere(0.5 * elementradii[pdb.elements[i]]); // Step 1
    var sphereBody = new CANNON.Body({ mass: 5, shape: sphereShape }); // Step 2
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

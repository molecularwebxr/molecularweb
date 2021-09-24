import * as CANNON from "/lib/cannon-es.js";

var SIMPLE = 0.12;
var DOUBLE = 0.2;
var TRIPLE = 0.25;

var CONSTRAINT_1 = 1000;
var CONSTRAINT_2 = 10;
var CONSTRAINT_3 = 1000000000000;

var radiusfactor1 = 0.35;
var radiusfactor2 = 1.1;

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
    bonds: {},
    allBonds: {},
    atoms: 0,
    xAvg: 0,
    yAvg: 0,
    zAvg: 0,
  };

  var lines = rawPdb.split("\n");

  // Read all lines, when a line starts with ATOM or HETATM
  // then it encodes an atom whose properties are read
  for (var i = 0; i < lines.length; i++) {
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
      var element = lines[i]
        .substring(75, 79)
        .trim()
        .replace("+", "")
        .replace("-", "")
        .toUpperCase();
      for (var j = 0; j < elementNames.length; j++) {
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

  var bonds = getBonds(pdb);

  // Here we make a Deep clone of bonds object so we have
  // all bonds for each atom, not only the ones we will draw
  // otherwise we will draw them twice
  var allBonds = JSON.parse(JSON.stringify(bonds));

  pdb.bonds = bonds;
  pdb.allBonds = allBonds;

  var bondKeys = Object.keys(pdb.bonds);

  bondKeys.forEach(function (atom) {
    pdb.allBonds[atom].forEach(function (bondedAtom) {
      if (!pdb.allBonds[bondedAtom].includes(atom)) {
        pdb.allBonds[bondedAtom].push(atom);
      }
    });
  });

  return pdb;
}

// This function calculate bonds between atoms
// Returns only atoms to draw
function getBonds(pdb) {
  var bonds = {};
  for (var i = 0; i < pdb.atoms; i++) {
    var currentAtomI = `atom${i + 1}`;

    var distsqr;
    var bondedAtoms = [];

    for (var j = i + 1; j < pdb.atoms; j++) {
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

function createSticks(pdb, bodies) {
  var bondKeys = Object.keys(pdb.bonds);
  var sticks = [];
  var bonds = [];
  var constraints = [];
  var atomPairs = [];
  var doubleBondAtomPairs = [];
  var hydrogen = [];
  var oxygen = [];
  var nitrogen = [];
  var fluor = [];
  var sulfur = [];
  var chlorine = [];
  var bromine = [];
  var iodine = [];

  bondKeys.forEach(function (atom, atomIndex) {
    //point1 is the first atom (i), point3 is the second atom (j)
    //point2 is at the center in-between atoms i and j
    //then the first half of the bond is from sphere 1 to 2 and the
    //second half of the bond is from point2 to point3

    // Is it an Hydrogen with interactions?
    // If is H, check in allBonds if it's bonded to any element of interest
    if (pdb.elements[atomIndex] === 0) {
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (
          pdb.elements[bondedAtomIndex] === 6 ||
          pdb.elements[bondedAtomIndex] === 7 ||
          pdb.elements[bondedAtomIndex] === 8 ||
          pdb.elements[bondedAtomIndex] === 15 ||
          pdb.elements[bondedAtomIndex] === 16 ||
          pdb.elements[bondedAtomIndex] === 34 ||
          pdb.elements[bondedAtomIndex] === 52
        ) {
          hydrogen.push([atomIndex, bondedAtomIndex]);
        }
      });
    }

    // Is it Oxygen?
    if (pdb.elements[atomIndex] === 7) {
      var bondedHydrogens = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedHydrogens.push(bondedAtomIndex);
        }
      });
      oxygen.push([atomIndex, ...bondedHydrogens]);
    }

    // Is it Nitrogen?
    if (pdb.elements[atomIndex] === 6) {
      var bondedNitrogens = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedNitrogens.push(bondedAtomIndex);
        }
      });
      nitrogen.push([atomIndex, ...bondedNitrogens]);
    }

    // Is it Fluor?
    if (pdb.elements[atomIndex] === 8) {
      var bondedFluors = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedFluors.push(bondedAtomIndex);
        }
      });
      fluor.push([atomIndex, ...bondedFluors]);
    }

    // Is it Sulfur?
    if (pdb.elements[atomIndex] === 15) {
      var bondedSulfurs = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedSulfurs.push(bondedAtomIndex);
        }
      });
      sulfur.push([atomIndex, ...bondedSulfurs]);
    }

    // Is it Chlorine?
    if (pdb.elements[atomIndex] === 16) {
      var bondedChlorines = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedChlorines.push(bondedAtomIndex);
        }
      });
      chlorine.push([atomIndex, ...bondedChlorines]);
    }

    // Is it Bromine?
    if (pdb.elements[atomIndex] === 34) {
      var bondedBromines = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedBromines.push(bondedAtomIndex);
        }
      });
      bromine.push([atomIndex, ...bondedBromines]);
    }

    // Is it Iodine?
    if (pdb.elements[atomIndex] === 52) {
      var bondedIodine = [];
      pdb.allBonds[atom].forEach(function (bondedAtom) {
        var bondedAtomIndex = bondKeys.indexOf(bondedAtom);
        if (pdb.elements[bondedAtomIndex] === 0) {
          bondedIodine.push(bondedAtomIndex);
        }
      });
      iodine.push([atomIndex, ...bondedIodine]);
    }

    var point1 = new THREE.Vector3(
      -(pdb.xCoords[atomIndex] - pdb.xAvg),
      pdb.yCoords[atomIndex] - pdb.yAvg,
      pdb.zCoords[atomIndex] - pdb.zAvg
    );

    pdb.bonds[atom].forEach(function (bondedAtom) {
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
      var atom1Bonds = pdb.allBonds[atom].length;
      var atom2Bonds = pdb.allBonds[bondedAtom].length;

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
        (pdb.elements[atomIndex] === 6 &&
          atom1Bonds === 3 &&
          pdb.elements[bondedAtomIndex] === 5 &&
          atom2Bonds === 4) ||
        (pdb.elements[atomIndex] === 5 &&
          atom1Bonds === 4 &&
          pdb.elements[bondedAtomIndex] === 6 &&
          atom2Bonds === 3)
      ) {
        radius = SIMPLE;
      }

      // One atom is N with 3 bonded atoms
      // The other atom is O with 2 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 &&
          atom1Bonds === 3 &&
          pdb.elements[bondedAtomIndex] === 7 &&
          atom2Bonds === 2) ||
        (pdb.elements[atomIndex] === 7 &&
          atom1Bonds === 2 &&
          pdb.elements[bondedAtomIndex] === 6 &&
          atom2Bonds === 3)
      ) {
        radius = SIMPLE;
      }

      // One atom is N with 3 bonded atoms
      // The other atom is C with 3 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 &&
          atom1Bonds === 3 &&
          pdb.elements[bondedAtomIndex] === 5 &&
          atom2Bonds === 3) ||
        (pdb.elements[atomIndex] === 5 &&
          atom1Bonds === 3 &&
          pdb.elements[bondedAtomIndex] === 6 &&
          atom2Bonds === 3)
      ) {
        radius = DOUBLE;
      }

      // One atom is N with 2 bonded atoms
      // The other atom is C with 3 bonded atoms
      if (
        (pdb.elements[atomIndex] === 6 &&
          atom1Bonds === 2 &&
          pdb.elements[bondedAtomIndex] === 5 &&
          atom2Bonds === 3) ||
        (pdb.elements[atomIndex] === 5 &&
          atom1Bonds === 3 &&
          pdb.elements[bondedAtomIndex] === 6 &&
          atom2Bonds === 2)
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
        pdb.elements[atomIndex] === 6 &&
        atom1Bonds === 2 &&
        pdb.elements[bondedAtomIndex] === 6 &&
        atom2Bonds === 2
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

      // This is the default contraint between bonded atoms
      var c = new CANNON.DistanceConstraint(
        bodies[atomIndex],
        bodies[bondedAtomIndex],
        undefined,
        CONSTRAINT_1
      );

      constraints.push(c);

      // Create default pairs of atoms for further constraint building
      for (var i = 0; i < atom1Bonds; i++) {
        if (pdb.allBonds[atom][i] !== bondedAtom) {
          var myAtom = pdb.allBonds[atom][i];
          var c = [bondKeys.indexOf(myAtom), bondedAtomIndex].sort();
          atomPairs.push(c);
        }
      }

      for (var i = 0; i < atom2Bonds; i++) {
        if (pdb.allBonds[bondedAtom][i] !== atom) {
          var myAtom = pdb.allBonds[bondedAtom][i];
          var c = [bondKeys.indexOf(myAtom), atomIndex].sort();
          atomPairs.push(c);
        }
      }

      if (radius === DOUBLE && atom1Bonds > 1 && atom2Bonds > 1) {
        for (var i = 0; i < atom1Bonds; i++) {
          var currentAtomI = pdb.allBonds[atom][i];
          if (currentAtomI !== bondedAtom) {
            for (var j = 0; j < atom2Bonds; j++) {
              var currentAtomJ = pdb.allBonds[bondedAtom][j];
              if (currentAtomJ !== atom) {
                var c = [
                  bondKeys.indexOf(currentAtomI),
                  bondKeys.indexOf(currentAtomJ),
                ].sort();
                doubleBondAtomPairs.push(c);
              }
            }
          }
        }
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

      sticks.push(bond1);
      sticks.push(bond2);

      bonds.push({
        atomA: atomIndex,
        atomB: bondedAtomIndex,
        sticks: [bond1, bond2],
      });
    });
  });

  // Convert atom pairs to strings for easily removing duplicates
  var stringArray = atomPairs.map(JSON.stringify);
  var uniqueStringArray = new Set(stringArray);
  var uniqueConstraints = Array.from(uniqueStringArray, JSON.parse);

  var defaultConstraints = [];

  uniqueConstraints.forEach(function (atomPair) {
    var forceFactor = 1;

    if (pdb.elements[atomPair[0]] === 0 || pdb.elements[atomPair[1]] === 0) {
      forceFactor = 100;
    }

    var constraint = new CANNON.DistanceConstraint(
      bodies[atomPair[0]],
      bodies[atomPair[1]],
      undefined,
      CONSTRAINT_2 * forceFactor
    );
    defaultConstraints.push(constraint);
  });

  // Convert atom pairs from double bonds to strings for removing duplicates
  var strings = doubleBondAtomPairs.map(JSON.stringify);
  var uniqueStrings = new Set(strings);
  var uniqueConsts = Array.from(uniqueStrings, JSON.parse);

  var constraintsFromDoubleBonds = [];

  uniqueConsts.forEach(function (atomPair) {
    var constraint = new CANNON.DistanceConstraint(
      bodies[atomPair[0]],
      bodies[atomPair[1]],
      undefined,
      CONSTRAINT_3
    );
    constraintsFromDoubleBonds.push(constraint);
  });

  var interactiveAtoms = {
    oxygen,
    nitrogen,
    hydrogen,
    fluor,
    sulfur,
    chlorine,
    bromine,
    iodine,
  };

  return [
    sticks,
    bonds,
    interactiveAtoms,
    [...constraints, ...defaultConstraints, ...constraintsFromDoubleBonds],
  ];
}

function createSpheres(pdb) {
  //this loop will create the spheres to display the atoms at the defined radius
  //and the actual physical cannon spheres
  var shapes = [];
  var meshes = [];
  var meshes2 = [];
  var bodies = [];

  var radiusFactor = radiusfactor1;

  for (var i = 0; i < pdb.atoms; i++) {
    var sphereRadius = radiusFactor * elementradii[pdb.elements[i]];
    var sphereMesh = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshLambertMaterial({ color: elementColors[pdb.elements[i]] })
    );

    sphereMesh.scale.setScalar(sphereRadius);

    sphereMesh.position.x = pdb.xCoords[i] - pdb.xAvg;
    sphereMesh.position.y = pdb.yCoords[i] - pdb.yAvg;
    sphereMesh.position.z = pdb.zCoords[i] - pdb.zAvg;
    meshes.push(sphereMesh);

    var clashMesh = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshLambertMaterial({
        color: elementColors[pdb.elements[i]],
        transparent: true,
        opacity: 0.5,
      })
    );
    clashMesh.visible = false;
    clashMesh.scale.setScalar(
      elementradii[pdb.elements[i]] * radiusfactor2 * 1.1
    );
    meshes2.push(clashMesh);

    var sphereShape = new CANNON.Sphere(0.8 * elementradii[pdb.elements[i]]);
    var sphereBody = new CANNON.Body({
      mass: elementmasses[pdb.elements[i]],
      shape: sphereShape,
    });
    sphereBody.position.set(
      sphereMesh.position.x,
      sphereMesh.position.y,
      sphereMesh.position.z
    );
    sphereBody.velocity.x = 0;
    sphereBody.velocity.y = 0;
    sphereBody.velocity.z = 0;
    bodies.push(sphereBody);
    shapes.push(sphereShape);
  }
  return [shapes, meshes, meshes2, bodies];
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

// Debug renderer

THREE.CannonDebugRenderer = function (scene, world, options) {
  options = options || {};

  this.scene = scene;
  this.world = world;

  this._meshes = [];

  this._material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  this._sphereGeometry = new THREE.SphereGeometry(1);
  this._boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  this._planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
  this._cylinderGeometry = new THREE.CylinderGeometry(1, 1, 10, 10);
};

THREE.CannonDebugRenderer.prototype = {
  tmpVec0: new CANNON.Vec3(),
  tmpVec1: new CANNON.Vec3(),
  tmpVec2: new CANNON.Vec3(),
  tmpQuat0: new CANNON.Vec3(),

  update: function () {
    var bodies = this.world.bodies;
    var meshes = this._meshes;
    var shapeWorldPosition = this.tmpVec0;
    var shapeWorldQuaternion = this.tmpQuat0;

    var meshIndex = 0;

    for (var i = 0; i !== bodies.length; i++) {
      var body = bodies[i];

      for (var j = 0; j !== body.shapes.length; j++) {
        var shape = body.shapes[j];

        this._updateMesh(meshIndex, body, shape);

        var mesh = meshes[meshIndex];

        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition);

          // Get world quaternion
          body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion);

          // Copy to meshes
          mesh.position.copy(shapeWorldPosition);
          mesh.quaternion.copy(shapeWorldQuaternion);
        }

        meshIndex++;
      }
    }

    for (var i = meshIndex; i < meshes.length; i++) {
      var mesh = meshes[i];
      if (mesh) {
        this.scene.remove(mesh);
      }
    }

    meshes.length = meshIndex;
  },

  _updateMesh: function (index, body, shape) {
    var mesh = this._meshes[index];
    if (!this._typeMatch(mesh, shape)) {
      if (mesh) {
        this.scene.remove(mesh);
      }
      mesh = this._meshes[index] = this._createMesh(shape);
    }
    this._scaleMesh(mesh, shape);
  },

  _typeMatch: function (mesh, shape) {
    if (!mesh) {
      return false;
    }
    var geo = mesh.geometry;
    return (
      (geo instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
      (geo instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
      (geo instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
      (geo.id === shape.geometryId &&
        shape instanceof CANNON.ConvexPolyhedron) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.Trimesh) ||
      (geo.id === shape.geometryId && shape instanceof CANNON.Heightfield)
    );
  },

  _createMesh: function (shape) {
    var mesh;
    var material = this._material;

    switch (shape.type) {
      case CANNON.Shape.types.SPHERE:
        mesh = new THREE.Mesh(this._sphereGeometry, material);
        break;

      case CANNON.Shape.types.BOX:
        mesh = new THREE.Mesh(this._boxGeometry, material);
        break;

      case CANNON.Shape.types.PLANE:
        mesh = new THREE.Mesh(this._planeGeometry, material);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        // Create mesh
        var geo = new THREE.Geometry();

        // Add vertices
        for (var i = 0; i < shape.vertices.length; i++) {
          var v = shape.vertices[i];
          geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
        }

        for (var i = 0; i < shape.faces.length; i++) {
          var face = shape.faces[i];

          // add triangles
          var a = face[0];
          for (var j = 1; j < face.length - 1; j++) {
            var b = face[j];
            var c = face[j + 1];
            geo.faces.push(new THREE.Face3(a, b, c));
          }
        }
        geo.computeBoundingSphere();
        geo.computeFaceNormals();

        mesh = new THREE.Mesh(geo, material);
        shape.geometryId = geo.id;
        break;

      case CANNON.Shape.types.TRIMESH:
        var geometry = new THREE.Geometry();
        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var i = 0; i < shape.indices.length / 3; i++) {
          shape.getTriangleVertices(i, v0, v1, v2);
          geometry.vertices.push(
            new THREE.Vector3(v0.x, v0.y, v0.z),
            new THREE.Vector3(v1.x, v1.y, v1.z),
            new THREE.Vector3(v2.x, v2.y, v2.z)
          );
          var j = geometry.vertices.length - 3;
          geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, material);
        shape.geometryId = geometry.id;
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        var geometry = new THREE.Geometry();

        var v0 = this.tmpVec0;
        var v1 = this.tmpVec1;
        var v2 = this.tmpVec2;
        for (var xi = 0; xi < shape.data.length - 1; xi++) {
          for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
            for (var k = 0; k < 2; k++) {
              shape.getConvexTrianglePillar(xi, yi, k === 0);
              v0.copy(shape.pillarConvex.vertices[0]);
              v1.copy(shape.pillarConvex.vertices[1]);
              v2.copy(shape.pillarConvex.vertices[2]);
              v0.vadd(shape.pillarOffset, v0);
              v1.vadd(shape.pillarOffset, v1);
              v2.vadd(shape.pillarOffset, v2);
              geometry.vertices.push(
                new THREE.Vector3(v0.x, v0.y, v0.z),
                new THREE.Vector3(v1.x, v1.y, v1.z),
                new THREE.Vector3(v2.x, v2.y, v2.z)
              );
              var i = geometry.vertices.length - 3;
              geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
            }
          }
        }
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        mesh = new THREE.Mesh(geometry, material);
        shape.geometryId = geometry.id;
        break;
    }

    if (mesh) {
      this.scene.add(mesh);
    }

    return mesh;
  },

  _scaleMesh: function (mesh, shape) {
    switch (shape.type) {
      case CANNON.Shape.types.SPHERE:
        var radius = shape.radius;
        mesh.scale.set(radius, radius, radius);
        break;

      case CANNON.Shape.types.BOX:
        mesh.scale.copy(shape.halfExtents);
        mesh.scale.multiplyScalar(2);
        break;

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        mesh.scale.set(1, 1, 1);
        break;

      case CANNON.Shape.types.TRIMESH:
        mesh.scale.copy(shape.scale);
        break;

      case CANNON.Shape.types.HEIGHTFIELD:
        mesh.scale.set(1, 1, 1);
        break;
    }
  },
};

export {
  clearGroup,
  createSpheres,
  createSticks,
  setupPdb,
  checkNCO,
  radiusfactor1,
  radiusfactor2,
};

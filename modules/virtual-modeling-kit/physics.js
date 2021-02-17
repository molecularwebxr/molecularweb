function setupConstraints(pdb) {
  //this loop will search, build and return the cannon constraints
  var constraints = [];
  for (i = 0; i < pdb.atoms; i++) {
    for (j = 0; j < pdb.atoms; j++) {
      if (i != j) {
        distsqr =
          Math.pow(pdb.xCoords[i] - pdb.xCoords[j], 2) +
          Math.pow(pdb.yCoords[i] - pdb.yCoords[j], 2) +
          Math.pow(pdb.zCoords[i] - pdb.zCoords[j], 2);
        if (
          distsqr <
          1.2 *
            Math.pow(
              elementradii[pdb.elements[i]] + elementradii[pdb.elements[j]],
              2
            )
        ) {
          var c = new CANNON.DistanceConstraint(
            spheresarray[i],
            spheresarray[j],
            Math.sqrt(distsqr),
            1e3
          );
          constraints.push(c);
          for (k = 0; k < pdb.atoms; k++) {
            distsqr =
              Math.pow(pdb.xCoords[k] - pdb.xCoords[j], 2) +
              Math.pow(pdb.yCoords[k] - pdb.yCoords[j], 2) +
              Math.pow(pdb.zCoords[k] - pdb.zCoords[j], 2);
            if (
              distsqr <
              1.2 *
                Math.pow(
                  elementradii[pdb.elements[k]] + elementradii[pdb.elements[j]],
                  2
                )
            ) {
              distsqr_ik =
                Math.pow(pdb.xCoords[k] - pdb.xCoords[i], 2) +
                Math.pow(pdb.yCoords[k] - pdb.yCoords[i], 2) +
                Math.pow(pdb.zCoords[k] - pdb.zCoords[i], 2);
              var c = new CANNON.DistanceConstraint(
                spheresarray[i],
                spheresarray[k],
                Math.sqrt(distsqr_ik),
                10
              );
              constraints.push(c);
            }
          }
        }

        //if both atoms are C, N or O then we have to check whether they are forming a double bond
        //and if yes then add 1-4 constraints that will keep the place fixed
        //to know this we check if they have at least one 120 degree angle around
        var areNCO = checkNCO(pdb.elements[i], pdb.elements[j]);

        if (areNCO) {
          //iterate through all other atoms looking for a second atom bonded to i
          for (k = 0; k < pdb.atoms; k++) {
            var angle1 = 109;
            var angle2 = 109;
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
                if (Math.abs(angle1 - 120) < 4) {
                  for (
                    l = k + 1;
                    l < pdb.atoms;
                    l++ //iterate through all other atoms looking for a second atom bonded to j
                  ) {
                    //get distance squared for pair j-k
                    distsqr =
                      Math.pow(pdb.xCoords[j] - pdb.xCoords[l], 2) +
                      Math.pow(pdb.yCoords[j] - pdb.yCoords[l], 2) +
                      Math.pow(pdb.zCoords[j] - pdb.zCoords[l], 2);
                    //if distance squared is less than 1.2 x the sum of the radii squared, add a bond
                    if (
                      distsqr <
                      1.2 *
                        Math.pow(
                          elementradii[pdb.elements[j]] +
                            elementradii[pdb.elements[l]],
                          2
                        )
                    ) {
                      var AB = Math.sqrt(
                        Math.pow(pdb.xCoords[j] - pdb.xCoords[i], 2) +
                          Math.pow(pdb.yCoords[j] - pdb.yCoords[i], 2) +
                          Math.pow(pdb.zCoords[j] - pdb.zCoords[i], 2)
                      );
                      var BC = Math.sqrt(
                        Math.pow(pdb.xCoords[l] - pdb.xCoords[j], 2) +
                          Math.pow(pdb.yCoords[l] - pdb.yCoords[j], 2) +
                          Math.pow(pdb.zCoords[l] - pdb.zCoords[j], 2)
                      );
                      var AC = Math.sqrt(
                        Math.pow(pdb.xCoords[l] - pdb.xCoords[i], 2) +
                          Math.pow(pdb.yCoords[l] - pdb.yCoords[i], 2) +
                          Math.pow(pdb.zCoords[l] - pdb.zCoords[i], 2)
                      );
                      var angle2 =
                        (180 / 3.141592654) *
                        Math.acos(
                          (BC * BC + AB * AB - AC * AC) / (2 * BC * AB)
                        );
                      if (Math.abs(angle2 - 120) < 4) {
                        distsqr_12 =
                          Math.pow(pdb.xCoords[k] - pdb.xCoords[l], 2) +
                          Math.pow(pdb.yCoords[k] - pdb.yCoords[l], 2) +
                          Math.pow(pdb.zCoords[k] - pdb.zCoords[l], 2);
                        var c = new CANNON.DistanceConstraint(
                          spheresarray[k],
                          spheresarray[l],
                          Math.sqrt(distsqr_12),
                          100
                        );
                        constraints.push(c);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return constraints;
}

function updatePhysics() {
  world.step(1 / 600);
  
  var velsum_expected = Math.sqrt(temperature) * atoms;

  var velsum = 0;
  var sumax = 0;
  var sumay = 0;
  var sumaz = 0;
  // var sumaxr = 0;
  // var sumayr = 0;
  // var sumazr = 0;

  for (i = 0; i < atomMeshes.length; i++) {
    sumax = sumax + world.bodies[i].position.x;
    sumay = sumay + world.bodies[i].position.y;
    sumaz = sumaz + world.bodies[i].position.z;
    // sumaxr = sumaxr + world.bodies[i].quaternion.x;
    // sumayr = sumayr + world.bodies[i].quaternion.y;
    // sumazr = sumazr + world.bodies[i].quaternion.z;
  }

  for (i = 0; i < atomMeshes.length; i++) {
    world.bodies[i].position.x =
      world.bodies[i].position.x - sumax / atomMeshes.length;
    world.bodies[i].position.y =
      world.bodies[i].position.y - sumay / atomMeshes.length;
    world.bodies[i].position.z =
      world.bodies[i].position.z - sumaz / atomMeshes.length;
  }

  for (i = 0; i < atomMeshes.length; i++) {
    atomMeshes[i].position.copy(atomBodies[i].position);
    atomMeshes[i].quaternion.copy(atomBodies[i].quaternion);

    atomBodies[i].velocity.x =
      atomBodies[i].velocity.x + 10 * Math.random(1) - 5;
    atomBodies[i].velocity.y =
      atomBodies[i].velocity.y + 10 * Math.random(1) - 5;
    atomBodies[i].velocity.z =
      atomBodies[i].velocity.z + 10 * Math.random(1) - 5;

    velsum =
      velsum +
      Math.sqrt(
        Math.pow(atomBodies[i].velocity.x, 2) +
          Math.pow(atomBodies[i].velocity.y, 2) +
          Math.pow(atomBodies[i].velocity.z, 2)
      );
  }
  
  for (i = 0; i < atomMeshes.length; i++) {
    atomBodies[i].velocity.x =
      (atomBodies[i].velocity.x / velsum) * velsum_expected;
    atomBodies[i].velocity.y =
      (atomBodies[i].velocity.y / velsum) * velsum_expected;
    atomBodies[i].velocity.z =
      (atomBodies[i].velocity.z / velsum) * velsum_expected;
  }

  bonds.forEach(function (bond) {
    var B = new THREE.Vector3(
      atomMeshes[bond.atomA].position.x,
      atomMeshes[bond.atomA].position.y,
      atomMeshes[bond.atomA].position.z
    );

    var A = new THREE.Vector3(
      atomMeshes[bond.atomA].position.x / 2 +
        atomMeshes[bond.atomB].position.x / 2,
      atomMeshes[bond.atomA].position.y / 2 +
        atomMeshes[bond.atomB].position.y / 2,
      atomMeshes[bond.atomA].position.z / 2 +
        atomMeshes[bond.atomB].position.z / 2
    );

    var C = new THREE.Vector3(
       atomMeshes[bond.atomA].position.x / 2 +
        atomMeshes[bond.atomB].position.x / 2,
       atomMeshes[bond.atomA].position.y / 2 +
        atomMeshes[bond.atomB].position.y / 2,
       atomMeshes[bond.atomA].position.z / 2 +
        atomMeshes[bond.atomB].position.z / 2
    );
    var D = new THREE.Vector3(
      atomMeshes[bond.atomB].position.x,
      atomMeshes[bond.atomB].position.y,
      atomMeshes[bond.atomB].position.z
    );

    var vec = B.clone();
    vec.sub(A);
    var h = vec.length();
    vec.normalize();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
    bond.sticks[0].position.set(0, 0, 0);
    bond.sticks[0].rotation.set(0, 0, 0);
    bond.sticks[0].translateOnAxis(0, h / 2, 0);
    bond.sticks[0].applyQuaternion(quaternion);
    bond.sticks[0].position.set(A.x, A.y, A.z);

    var vec2 = D.clone();
    vec2.sub(C);
    var h2 = vec.length();
    vec2.normalize();
    var quaternion2 = new THREE.Quaternion();
    quaternion2.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec2);
    bond.sticks[1].position.set(0, 0, 0);
    bond.sticks[1].rotation.set(0, 0, 0);
    bond.sticks[1].translateOnAxis(0, h2 / 2, 0);
    bond.sticks[1].applyQuaternion(quaternion2);
    bond.sticks[1].position.set(C.x, C.y, C.z);
  });
}

function clearPhysics() {
  var bodies = world.bodies;
  var cs = world.constraints;

  for (var i = bodies.length - 1; i >= 0; i--) {
    world.removeBody(bodies[i]);
  }

  for (var i = cs.length - 1; i >= 0; i--) {
    world.removeConstraint(cs[i]);
  }
}

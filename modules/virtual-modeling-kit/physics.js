var world = new CANNON.World();
world.gravity.set(0, 0, 0);
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

var temperature = 0;

function setupConstraints(pdb) {
  //this loop will search and build the cannon constraints
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
          world.addConstraint(c);
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
              world.addConstraint(c);
            }
          }
        }
        //if both atoms are C, N or O then we have to check whether they are forming a double bond
        //and if yes then add 1-4 constraints that will keep the place fixed
        //to know this we check if they have at least one 120 degree angle around
        if (
          (pdb.elements[i] == 5 ||
            pdb.elements[i] == 6 ||
            pdb.elements[i] == 7) &&
          (pdb.elements[j] == 5 || pdb.elements[j] == 6 || pdb.elements[j] == 7)
        ) {
          for (
            k = 0;
            k < pdb.atoms;
            k++ //iterate through all other atoms looking for a second atom bonded to i
          ) {
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
                        //alert(k + "   " + l)
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
                        world.addConstraint(c);
                        //alert(Math.sqrt(distsqr_12))
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
}

function updatePhysics() {
  // Step the physics world
  world.step(1 / 600);
  // Copy coordinates from Cannon.js to Three.js
  // And update temperatures
  var velsum_expected = Math.sqrt(temperature) * atoms;
  //var velsum_expected = temperature;
  var velsum = 0;
  var sumax = 0;
  var sumay = 0;
  var sumaz = 0;
  var sumaxr = 0;
  var sumayr = 0;
  var sumazr = 0;

  for (i = 0; i < atomsarray.length; i++) {
    sumax = sumax + world.bodies[i].position.x;
    sumay = sumay + world.bodies[i].position.y;
    sumaz = sumaz + world.bodies[i].position.z;
    sumaxr = sumaxr + world.bodies[i].quaternion.x;
    sumayr = sumayr + world.bodies[i].quaternion.y;
    sumazr = sumazr + world.bodies[i].quaternion.z;
  }

  for (i = 0; i < atomsarray.length; i++) {
    world.bodies[i].position.x =
      world.bodies[i].position.x - sumax / atomsarray.length;
    world.bodies[i].position.y =
      world.bodies[i].position.y - sumay / atomsarray.length;
    world.bodies[i].position.z =
      world.bodies[i].position.z - sumaz / atomsarray.length;
  }

  for (i = 0; i < atomsarray.length; i++) {
    atomsarray[i].position.copy(world.bodies[i].position);
    atomsarray[i].quaternion.copy(world.bodies[i].quaternion);

    spheresarray[i].velocity.x =
      spheresarray[i].velocity.x + 10 * Math.random(1) - 5;
    spheresarray[i].velocity.y =
      spheresarray[i].velocity.y + 10 * Math.random(1) - 5;
    spheresarray[i].velocity.z =
      spheresarray[i].velocity.z + 10 * Math.random(1) - 5;
    velsum =
      velsum +
      Math.sqrt(
        Math.pow(spheresarray[i].velocity.x, 2) +
          Math.pow(spheresarray[i].velocity.y, 2) +
          Math.pow(spheresarray[i].velocity.z, 2)
      );
  }
  for (i = 0; i < atomsarray.length; i++) {
    spheresarray[i].velocity.x =
      (spheresarray[i].velocity.x / velsum) * velsum_expected;
    spheresarray[i].velocity.y =
      (spheresarray[i].velocity.y / velsum) * velsum_expected;
    spheresarray[i].velocity.z =
      (spheresarray[i].velocity.z / velsum) * velsum_expected;
  }

  for (i = 0; i < bondsarray.length; i = i + 2) {
    var B = new THREE.Vector3(
      atomsarray[bondfirstatom[i]].position.x,
      atomsarray[bondfirstatom[i]].position.y,
      atomsarray[bondfirstatom[i]].position.z
    );
    var A = new THREE.Vector3(
      atomsarray[bondfirstatom[i]].position.x / 2 +
        atomsarray[bondfirstatom[i + 1]].position.x / 2,
      atomsarray[bondfirstatom[i]].position.y / 2 +
        atomsarray[bondfirstatom[i + 1]].position.y / 2,
      atomsarray[bondfirstatom[i]].position.z / 2 +
        atomsarray[bondfirstatom[i + 1]].position.z / 2
    );
    var vec = B.clone();
    vec.sub(A);
    var h = vec.length();
    vec.normalize();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
    bondsarray[i].position.set(0, 0, 0);
    bondsarray[i].rotation.set(0, 0, 0);
    bondsarray[i].translateOnAxis(0, h / 2, 0);
    bondsarray[i].applyQuaternion(quaternion);
    bondsarray[i].position.set(A.x, A.y, A.z);

    var A = new THREE.Vector3(
      atomsarray[bondfirstatom[i]].position.x / 2 +
        atomsarray[bondfirstatom[i + 1]].position.x / 2,
      atomsarray[bondfirstatom[i]].position.y / 2 +
        atomsarray[bondfirstatom[i + 1]].position.y / 2,
      atomsarray[bondfirstatom[i]].position.z / 2 +
        atomsarray[bondfirstatom[i + 1]].position.z / 2
    );
    var B = new THREE.Vector3(
      atomsarray[bondfirstatom[i + 1]].position.x,
      atomsarray[bondfirstatom[i + 1]].position.y,
      atomsarray[bondfirstatom[i + 1]].position.z
    );
    var vec = B.clone();
    vec.sub(A);
    var h = vec.length();
    vec.normalize();
    var quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vec);
    bondsarray[i + 1].position.set(0, 0, 0);
    bondsarray[i + 1].rotation.set(0, 0, 0);
    bondsarray[i + 1].translateOnAxis(0, h / 2, 0);
    bondsarray[i + 1].applyQuaternion(quaternion);
    bondsarray[i + 1].position.set(A.x, A.y, A.z);
  }
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

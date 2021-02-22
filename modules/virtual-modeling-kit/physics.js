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

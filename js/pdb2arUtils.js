var includeOptions1 = /* html */ `
  <option>No</option>
  <option>Licorice (sticks)</option>
  <option>NewCartoon (cartoons)</option>
  <option>VDW (spheres)</option>
  <option>Surf (surface)</option>
  <option>Tube</option>
  <option>CPK</option>
  `;

var includeOptions2 = /* html */ `
  <option>No</option>
  <option>Licorice (sticks)</option>
  <option>VDW (spheres)</option>
  <option>Surf (surface)</option>
  <option>CPK</option>
  `;

var colorOptions = /* html */ `
  <option value="Name">Name</option>
  <option value="ResType">ResType</option>
  <option value="Chain">Chain</option>
  <option value="Structure">Secondary Structure</option>
  <option value="Beta">Beta</option>
  <option value="Charge">Charge</option>
  <option value="ColorID 0">Blue</option>
  <option value="ColorID 1">Red</option>
  <option value="ColorID 2">Gray</option>
  <option value="ColorID 3">Orange</option>
  <option value="ColorID 4">Yellow</option>
  <option value="ColorID 5">Tan</option>
  <option value="ColorID 6">Silver</option>
  <option value="ColorID 7">Green</option>
  <option value="ColorID 8">White</option>
  <option value="ColorID 9">Pink</option>
  <option value="ColorID 10">Cyan</option>
  <option value="ColorID 11">Purple</option>
  <option value="ColorID 12">Lime</option>
  <option value="ColorID 13">Mauve</option>
  <option value="ColorID 14">Ochre</option>
  <option value="ColorID 15">Iceblue</option>
  <option value="ColorID 16">Black</option>
`;
var baseTcl = "display projection Orthographic\naxes location Off\ndisplay resetview\nmol new {**location**} type {pdb} first 0 last -1 step 1 waitfor 1\n\n";
var endTcl = "render Wavefront {**3dmodel**} true\nexit";

function isEmailValid(email) {
  if (/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    .test(email)) {
    return true;
  }
  return false;
}

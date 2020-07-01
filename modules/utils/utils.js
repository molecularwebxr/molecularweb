// helper functions
function norm(p1,p2,n) {
  var d = 0.0;
  for(var i=0; i<n; i++) {
      d = d + Math.pow(p1[i] - p2[i], 2);
  }
  return Math.sqrt(d);
}


function enforceBounds(x) {
    if (x < 0) {
        return 0;
    } else if (x > 1){
        return 1;
    } else {
        return x;
    }
}


function interpolateLinearly(x, values) {
    // Split values into four lists
    var x_values = [];
    var r_values = [];
    var g_values = [];
    var b_values = [];
    for (i in values) {
        x_values.push(values[i][0]);
        r_values.push(values[i][1][0]);
        g_values.push(values[i][1][1]);
        b_values.push(values[i][1][2]);
    }
    var i = 1;
    while (x_values[i] < x) {
        i = i+1;
    }
    i = i-1;
    var width = Math.abs(x_values[i] - x_values[i+1]);
    var scaling_factor = (x - x_values[i]) / width;
    // Get the new color values though interpolation
    var r = r_values[i] + scaling_factor * (r_values[i+1] - r_values[i])
    var g = g_values[i] + scaling_factor * (g_values[i+1] - g_values[i])
    var b = b_values[i] + scaling_factor * (b_values[i+1] - b_values[i])
    return [enforceBounds(r), enforceBounds(g), enforceBounds(b)];
}

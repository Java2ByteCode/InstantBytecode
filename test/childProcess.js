var spawn = require('child_process').spawn;
var fs = require('fs');

child = spawn("dir", {
    stdio: [
      0, // use parents stdin for child
      'pipe', // pipe child's stdout to parent
      fs.openSync("err.out", "w") // direct child's stderr to a file
    ]
});
const { exec } = require("child_process");

const executePy = (filepath) => {
  console.log(filepath);
  // console.log(outPath, filepath);
  return new Promise((resolve, reject) => {
    let z = `python ${filepath}`;
    console.log(z);
    exec(z, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
        return;
      }

      if (stderr) {
        reject(stderr);
        return;
      }

      resolve(stdout);
    });
  });
};

module.exports = { executePy };

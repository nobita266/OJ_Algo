const { rejects } = require("assert");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeCpp = (filepath, inputPath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);
  // console.log(outPath, filepath);
  return new Promise((resolve, reject) => {
    let z = `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputPath}`;
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

module.exports = { executeCpp };

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractsPath = path.resolve(__dirname, "contracts")
const sourceFiles = fs.readdirSync(contractsPath);
// console.log(sourceFiles);

let input = {
  language: 'Solidity',
  sources: {},
  // sources: {
  //     'Campaign.sol' : {
  //         content: source
  //     }
  // },
  settings: {
      outputSelection: {
          '*': {
              '*': [ '*' ]
          }
      }
  }
}; 

for (const sourceName of sourceFiles) {
  const sourcePath = path.resolve(contractsPath, sourceName);
  // console.log(`sourcePath: ${sourcePath}`);
  const source = fs.readFileSync(sourcePath, "utf8");
  // console.log(source);
  input.sources[sourceName] = {
    content: source
  }
}

// console.log(input);  
  
const output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(output);
const sources = output['contracts'];
// console.log(sources);
  
for (let source in sources) {
  const contract = sources[source]
  for (let name in contract) {
    const contractPath = path.resolve(buildPath, name + ".json");
    console.log(`building ${contractPath} ...`);
    fs.outputJsonSync(
      contractPath,
      contract[name]['evm']
    );
  }
}

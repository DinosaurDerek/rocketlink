// This script generates a JavaScript module that exports the ABI of the PriceMonitor contract
const fs = require("fs");
const path = require("path");

const artifactPath = path.resolve(
  __dirname,
  "../artifacts/contracts/PriceMonitor.sol/PriceMonitor.json"
);
const outDir = path.resolve(__dirname, "../src/abi");
const outFile = path.resolve(outDir, "PriceMonitor.js");

const json = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
const abi = JSON.stringify(json.abi, null, 2);

fs.mkdirSync(outDir, { recursive: true });

const content = `// Auto-generated — do not edit
export const PriceMonitorAbi = ${abi};
`;
fs.writeFileSync(outFile, content);
console.log(`✅ Wrote ${outFile}`);

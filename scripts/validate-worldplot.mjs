import fs from "node:fs";
import Ajv from "ajv";

const schema = JSON.parse(fs.readFileSync("worldPlot.schema.json", "utf8"));
const data = JSON.parse(fs.readFileSync("worldPlot.json", "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

if (!validate(data)) {
  console.error("❌ worldPlot.json failed schema validation:");
  for (const err of validate.errors ?? []) {
    console.error(`- ${err.instancePath || "(root)"} ${err.message}`);
  }
  process.exit(1);
}

console.log("✅ worldPlot.json is schema-valid.");

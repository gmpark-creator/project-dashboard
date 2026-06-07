import assert from "node:assert/strict";
import { readJsonObject } from "../app/api/json-body";

async function read(body?: BodyInit | null) {
  return readJsonObject(new Request("http://cutpilot.local/api/test", { method: "POST", body }));
}

async function main() {
  assert.deepEqual(await read(), {}, "empty request bodies should be accepted as an empty object");
  assert.deepEqual(await read("   "), {}, "blank request bodies should be accepted as an empty object");
  assert.deepEqual(await read('{"idea":"launch"}'), { idea: "launch" }, "object JSON bodies should be parsed");
  assert.equal(await read("[1,2,3]"), null, "array JSON bodies should be rejected");
  assert.equal(await read('"launch"'), null, "primitive JSON bodies should be rejected");
  assert.equal(await read('{"idea":'), null, "malformed JSON bodies should be rejected");

  console.log("api-json-body.test OK");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

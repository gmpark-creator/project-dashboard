import assert from "node:assert/strict";
import { POST as createProject } from "../app/api/projects/route";
import { isExportSpec } from "../app/api/export-spec";
import { readJsonObject } from "../app/api/json-body";

async function read(body?: BodyInit | null) {
  return readJsonObject(new Request("http://cutpilot.local/api/test", { method: "POST", body }));
}

function request(body?: BodyInit | null) {
  return new Request("http://cutpilot.local/api/projects", { method: "POST", body });
}

async function main() {
  assert.deepEqual(await read(), {}, "empty request bodies should be accepted as an empty object");
  assert.deepEqual(await read("   "), {}, "blank request bodies should be accepted as an empty object");
  assert.deepEqual(await read('{"idea":"launch"}'), { idea: "launch" }, "object JSON bodies should be parsed");
  assert.equal(await read("[1,2,3]"), null, "array JSON bodies should be rejected");
  assert.equal(await read('"launch"'), null, "primitive JSON bodies should be rejected");
  assert.equal(await read('{"idea":'), null, "malformed JSON bodies should be rejected");
  assert.equal(
    isExportSpec({ resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in", extra: true }),
    false,
    "export specs should reject contract-external keys"
  );
  const routeResponse = await createProject(request("[1,2,3]"));
  assert.equal(routeResponse.status, 400, "request body routes should reject non-object JSON bodies");
  const routeBody = (await routeResponse.json()) as { code?: string; retryable?: boolean; fallbackSuggested?: boolean };
  assert.equal(routeBody.code, "BAD_REQUEST", "invalid route JSON bodies should return BAD_REQUEST");
  assert.equal(routeBody.retryable, false, "invalid route JSON bodies should not be retryable");
  assert.equal(routeBody.fallbackSuggested, false, "invalid route JSON bodies should not suggest fallback");

  console.log("api-json-body.test OK");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

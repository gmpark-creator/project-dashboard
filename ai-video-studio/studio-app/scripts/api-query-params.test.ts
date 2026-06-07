import assert from "node:assert/strict";
import { DELETE as deleteAsset } from "../app/api/projects/[projectId]/assets/[assetId]/route";
import { resetMockState } from "../src/server/mock-service";

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

async function main() {
  process.env.CUTPILOT_MOCK_PERSIST = "0";
  resetMockState();

  const response = await deleteAsset(
    new Request("http://cutpilot.local/api/projects/prj_missing/assets/img_missing?force=maybe", { method: "DELETE" }),
    context({ projectId: "prj_missing", assetId: "img_missing" })
  );
  assert.equal(response.status, 400, "invalid boolean query values should be rejected before service handling");
  const body = (await response.json()) as { code?: string };
  assert.equal(body.code, "BAD_REQUEST", "invalid boolean query values should return BAD_REQUEST");

  console.log("api-query-params.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

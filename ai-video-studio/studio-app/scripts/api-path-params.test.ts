import assert from "node:assert/strict";
import { GET as getJob } from "../app/api/jobs/[jobId]/route";
import { GET as getProjectBundle } from "../app/api/projects/[projectId]/route";
import { DELETE as deleteAsset } from "../app/api/projects/[projectId]/assets/[assetId]/route";
import { POST as selectTake } from "../app/api/shots/[shotId]/select-take/route";
import { POST as completeWorkerLease } from "../app/api/system/worker-leases/[leaseId]/complete/route";
import { resetMockState } from "../src/server/mock-service";

function request(method: string, body?: unknown) {
  return new Request("http://cutpilot.local/api/test", {
    method,
    body: typeof body === "undefined" ? undefined : JSON.stringify(body)
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

async function expectBadPath(response: Response, label: string) {
  assert.equal(response.status, 400, label);
  const body = (await response.json()) as { code?: string };
  assert.equal(body.code, "BAD_REQUEST", `${label} should return BAD_REQUEST`);
}

async function main() {
  process.env.CUTPILOT_MOCK_PERSIST = "0";
  resetMockState();

  await expectBadPath(await getProjectBundle(request("GET"), context({ projectId: "bad_project" })), "project id should be pattern-validated");
  await expectBadPath(await getJob(request("GET"), context({ jobId: "job_bad" })), "job id should be pattern-validated");
  await expectBadPath(
    await deleteAsset(request("DELETE"), context({ projectId: "prj_valid", assetId: "bad_asset" })),
    "asset id should be pattern-validated"
  );
  await expectBadPath(
    await selectTake(request("POST", { takeId: "tak_valid" }), context({ shotId: "shot_bad" })),
    "shot id should be pattern-validated"
  );
  await expectBadPath(
    await completeWorkerLease(request("POST", { token: "lease-token", status: "succeeded" }), context({ leaseId: "lease_bad" })),
    "worker lease id should be pattern-validated"
  );

  console.log("api-path-params.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import assert from "node:assert/strict";
import { POST as tickJobs } from "../app/api/jobs/tick/route";
import type { JobQueueSnapshot } from "../src/domain/types";
import { createProject, generateShot, getProjectBundle, resetMockState } from "../src/server/mock-service";

async function main() {
  const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  try {
    process.env.CUTPILOT_MOCK_PERSIST = "0";
    delete process.env.CUTPILOT_RUNTIME_MODE;
    resetMockState();
    const project = createProject({ idea: "Advance a queued job for the tick route", intent: "shorts" });
    const bundle = getProjectBundle(project.id);
    assert.ok(bundle, "project bundle should exist before route tick");
    const shot = bundle.shots[0];
    const queued = generateShot(shot.id, { takeCount: 1 });

    const response = tickJobs();
    assert.equal(response.status, 200, "tick route should return 200");
    const body = (await response.json()) as JobQueueSnapshot & { projects?: unknown[] };
    assert.equal(typeof body.generatedAt, "string", "tick route should return a queue snapshot timestamp");
    assert.equal(body.summary.total >= 1, true, "tick route should include active queued work");
    assert.ok(body.jobs.some((job) => job.id === queued.jobs[0].id), "tick route should include the queued generation job");
    assert.equal("projects" in body, false, "tick route should not leak the full internal StudioState");

    process.env.CUTPILOT_RUNTIME_MODE = "production";
    const productionResponse = tickJobs();
    assert.equal(productionResponse.status, 503, "tick route should fail closed in production mode");
    assert.equal((await productionResponse.json()).code, "MOCK_TICK_UNAVAILABLE", "production tick failures should use a stable code");
  } finally {
    resetMockState();
    if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
    else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
  }

  console.log("api-tick-route.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

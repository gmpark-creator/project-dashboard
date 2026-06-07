import assert from "node:assert/strict";
import { POST as tickJobs } from "../app/api/jobs/tick/route";
import type { JobQueueSnapshot } from "../src/domain/types";
import { createProject, generateShot, getProjectBundle, resetMockState } from "../src/server/mock-service";

async function main() {
  process.env.CUTPILOT_MOCK_PERSIST = "0";
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

  console.log("api-tick-route.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

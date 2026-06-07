import assert from "node:assert/strict";
import { createImageJob, createProject, forceDueJobs, getProjectBundle, resetMockState, tickJobs } from "../src/server/mock-service";

async function main() {
  const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  try {
    process.env.CUTPILOT_MOCK_PERSIST = "0";
    delete process.env.CUTPILOT_RUNTIME_MODE;
    resetMockState();

    const project = createProject({
      title: "Production auto tick boundary",
      idea: "A due image job should not auto-complete in production read paths",
      intent: "product_ad"
    });
    const imageJob = createImageJob({
      projectId: project.id,
      prompt: "Production no auto tick image",
      purpose: "product",
      role: "product",
      aspect: "9:16",
      count: 1
    }).job;
    forceDueJobs("imageJobs");

    process.env.CUTPILOT_RUNTIME_MODE = "production";
    const productionBundle = getProjectBundle(project.id);
    assert.ok(productionBundle, "production read path should still return the project bundle");
    const productionJob = productionBundle.imageJobs.find((job) => job.id === imageJob.id);
    assert.equal(productionJob?.status, "queued", "production read paths should not auto-complete due mock image jobs");
    assert.equal(productionBundle.imageAssets.length, 0, "production read paths should not create mock image artifacts");
    tickJobs();
    const afterProductionTick = getProjectBundle(project.id);
    assert.equal(
      afterProductionTick?.imageJobs.find((job) => job.id === imageJob.id)?.status,
      "queued",
      "direct production tickJobs should be a no-op"
    );

    delete process.env.CUTPILOT_RUNTIME_MODE;
    tickJobs();
    const mockBundle = getProjectBundle(project.id);
    assert.equal(mockBundle?.imageJobs.find((job) => job.id === imageJob.id)?.status, "done", "mock mode should still auto-complete due image jobs");
    assert.equal(mockBundle?.imageAssets.length, 1, "mock mode should still create generated image assets");
  } finally {
    resetMockState();
    if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
    else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
  }

  console.log("production-auto-tick-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

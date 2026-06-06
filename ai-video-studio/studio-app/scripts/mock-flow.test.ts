import assert from "node:assert/strict";
import {
  createProject,
  forceDueJobs,
  generateAll,
  getProjectBundle,
  regenerate,
  resetMockState,
  selectTake,
  startRender,
  tickJobs,
  upgradeTake
} from "../src/server/mock-service";

resetMockState();

const project = createProject({
  title: "테스트 쇼츠",
  idea: "딸기라떼 쇼츠",
  intent: "shorts"
});

let bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist");
assert.equal(bundle.shots.length, 10, "mock storyboard should create 10 shots");

generateAll(project.id, { tier: "fast" });
forceDueJobs("generationJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after generation");

const failedShots = bundle.shots.filter((shot) => shot.status === "failed");
assert.equal(failedShots.length, 2, "mock generation should inject exactly 2 failed shots");

const failedShot = failedShots[0];
const beforeTakes = bundle.takes.filter((take) => take.shotId === failedShot.id).length;
regenerate(failedShot.id, { scope: "segment" });
forceDueJobs("generationJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after regenerate");
const afterTakes = bundle.takes.filter((take) => take.shotId === failedShot.id).length;
assert.ok(afterTakes > beforeTakes, "regenerate should preserve old takes and add new takes");

const doneTake = bundle.takes.find((take) => take.shotId === failedShot.id && take.status === "done");
assert.ok(doneTake, "regenerated shot should have a done take");
selectTake(failedShot.id, doneTake.id);

upgradeTake(doneTake.id, { mode: "final_regenerate" });
forceDueJobs("generationJobs");
tickJobs();

startRender(project.id, [
  { resolution: "1080p", cut: "6s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "15s", aspect: "9:16", caption: "burn-in" },
  { resolution: "1080p", cut: "30s", aspect: "9:16", caption: "burn-in" }
]);
forceDueJobs("renderJobs");
tickJobs();

bundle = getProjectBundle(project.id);
assert.ok(bundle, "bundle should exist after render");
assert.equal(bundle.renderJobs.length, 3, "render should create 3 jobs");
assert.ok(bundle.renderJobs.every((job) => job.status === "done"), "render jobs should complete when forced due");

console.log("mock-flow.test OK", {
  shots: bundle.shots.length,
  failed: failedShots.length,
  takes: bundle.takes.length,
  renderJobs: bundle.renderJobs.length
});

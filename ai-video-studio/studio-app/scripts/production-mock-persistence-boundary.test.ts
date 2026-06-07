import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createProject, getProjectBundle, reloadMockStateFromDisk, resetMockState } from "../src/server/mock-service";
import { getRuntimeReadiness } from "../src/server/readiness";

const stateFile = join(process.cwd(), "data", "cutpilot-mock-state.json");

async function main() {
  const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  const originalStateFile = existsSync(stateFile) ? readFileSync(stateFile, "utf8") : null;
  try {
    rmSync(stateFile, { force: true });
    process.env.CUTPILOT_MOCK_PERSIST = "1";
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    resetMockState();

    const productionProject = createProject({
      title: "Production persistence boundary",
      idea: "Production mode must not write file-backed mock state",
      intent: "product_ad"
    });
    assert.equal(existsSync(stateFile), false, "production mode should not write file-backed mock state");
    const productionReadiness = getRuntimeReadiness();
    assert.ok(
      productionReadiness.checks.some(
        (check) => check.id === "mock_persistence" && check.status === "pass" && check.detail.includes("disabled in production")
      ),
      "production readiness should state that file-backed mock persistence is disabled"
    );
    reloadMockStateFromDisk();
    assert.equal(getProjectBundle(productionProject.id), null, "production reload should not recover mock state from disk");

    delete process.env.CUTPILOT_RUNTIME_MODE;
    resetMockState();
    const mockProject = createProject({
      title: "Mock persistence boundary",
      idea: "Mock mode should still persist file-backed state",
      intent: "product_ad"
    });
    assert.equal(existsSync(stateFile), true, "mock mode should still write file-backed mock state when persistence is enabled");
    reloadMockStateFromDisk();
    assert.ok(getProjectBundle(mockProject.id), "mock mode should still reload file-backed mock state");
  } finally {
    resetMockState();
    rmSync(stateFile, { force: true });
    if (originalStateFile !== null) {
      mkdirSync(dirname(stateFile), { recursive: true });
      writeFileSync(stateFile, originalStateFile, "utf8");
    }
    if (typeof originalPersist === "undefined") delete process.env.CUTPILOT_MOCK_PERSIST;
    else process.env.CUTPILOT_MOCK_PERSIST = originalPersist;
    if (typeof originalRuntimeMode === "undefined") delete process.env.CUTPILOT_RUNTIME_MODE;
    else process.env.CUTPILOT_RUNTIME_MODE = originalRuntimeMode;
  }

  console.log("production-mock-persistence-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { createProject, getProjectBundle, reloadMockStateFromDisk, resetMockState } from "../src/server/mock-service";
import { fileBackedMockStateStore, mockStateFilePath, shouldPersistMockState } from "../src/server/mock-state-store";

const stateFile = mockStateFilePath();

async function main() {
  const originalPersist = process.env.CUTPILOT_MOCK_PERSIST;
  const originalRuntimeMode = process.env.CUTPILOT_RUNTIME_MODE;
  const originalStateFile = existsSync(stateFile) ? readFileSync(stateFile, "utf8") : null;
  try {
    assert.equal(typeof fileBackedMockStateStore.loadPersisted, "function", "mock state store should expose persisted loading");
    assert.equal(typeof fileBackedMockStateStore.persist, "function", "mock state store should expose persisted saving");
    assert.equal(typeof fileBackedMockStateStore.readMemory, "function", "mock state store should expose memory reads");
    assert.equal(typeof fileBackedMockStateStore.writeMemory, "function", "mock state store should expose memory writes");

    rmSync(stateFile, { force: true });
    process.env.CUTPILOT_MOCK_PERSIST = "1";
    process.env.CUTPILOT_RUNTIME_MODE = "production";
    assert.equal(shouldPersistMockState(), false, "production mode should disable file-backed mock persistence");

    resetMockState();
    const productionProject = createProject({
      title: "Production store boundary",
      idea: "Production mode must not persist through the mock state store",
      intent: "product_ad"
    });
    assert.equal(existsSync(stateFile), false, "production mode should not write the file-backed mock state store");
    reloadMockStateFromDisk();
    assert.equal(getProjectBundle(productionProject.id), null, "production reload should not recover mock state from the store");

    delete process.env.CUTPILOT_RUNTIME_MODE;
    process.env.CUTPILOT_MOCK_PERSIST = "0";
    assert.equal(shouldPersistMockState(), false, "CUTPILOT_MOCK_PERSIST=0 should disable mock persistence outside production");

    process.env.CUTPILOT_MOCK_PERSIST = "1";
    assert.equal(shouldPersistMockState(), true, "mock mode should allow file-backed persistence when enabled");
    resetMockState();
    const mockProject = createProject({
      title: "Mock store boundary",
      idea: "Mock mode should still persist through the store port",
      intent: "product_ad"
    });
    assert.equal(existsSync(stateFile), true, "mock mode should write the file-backed mock state store");
    reloadMockStateFromDisk();
    assert.ok(getProjectBundle(mockProject.id), "mock mode should reload persisted state through the store port");
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

  console.log("mock-state-store-boundary.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

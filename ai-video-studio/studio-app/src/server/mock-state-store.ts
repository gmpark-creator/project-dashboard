import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { StudioState } from "../domain/types";

const globalStore = globalThis as typeof globalThis & {
  __aiVideoStudioMockState?: StudioState;
};

export interface MockStateStore {
  readMemory(): StudioState | undefined;
  writeMemory(nextState: StudioState | undefined): void;
  loadPersisted(): StudioState | null;
  persist(nextState: StudioState): void;
}

export function shouldPersistMockState() {
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") return false;
  return process.env.CUTPILOT_MOCK_PERSIST !== "0";
}

export function mockStateFilePath() {
  return join(/*turbopackIgnore: true*/ process.cwd(), "data", "cutpilot-mock-state.json");
}

function loadMockStateFromDisk(): StudioState | null {
  if (!shouldPersistMockState()) return null;
  const filePath = mockStateFilePath();
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as StudioState;
  } catch {
    return null;
  }
}

function persistMockStateToDisk(nextState: StudioState) {
  if (!shouldPersistMockState()) return;
  const filePath = mockStateFilePath();
  mkdirSync(dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.${process.pid}.tmp`;
  writeFileSync(tempPath, JSON.stringify(nextState, null, 2), "utf8");
  renameSync(tempPath, filePath);
}

export const fileBackedMockStateStore: MockStateStore = {
  readMemory() {
    return globalStore.__aiVideoStudioMockState;
  },
  writeMemory(nextState) {
    if (typeof nextState === "undefined") {
      delete globalStore.__aiVideoStudioMockState;
      return;
    }
    globalStore.__aiVideoStudioMockState = nextState;
  },
  loadPersisted() {
    return loadMockStateFromDisk();
  },
  persist(nextState) {
    persistMockStateToDisk(nextState);
  }
};

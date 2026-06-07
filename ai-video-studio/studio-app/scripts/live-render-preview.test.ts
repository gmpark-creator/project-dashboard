import assert from "node:assert/strict";
import { buildLiveRenderPreview } from "../src/server/live-render-preview";
import type { ProjectBundle } from "../src/domain/types";

const projectId = "prj_live_preview";
const shotId = "shot_live_preview";
const takeId = "take_live_preview";
const assetId = "img_live_preview";

const bundle: ProjectBundle = {
  project: {
    id: projectId,
    title: "Live preview",
    idea: "Validate render preview",
    intent: "product_ad",
    status: "reviewing",
    aspect: "9:16",
    targetDurationSec: 15,
    progress: { shotsDone: 1, shotsTotal: 1 },
    characters: [],
    thumbUrl: null,
    defaultRenderJobId: null,
    credits: { spent: 18, estimateRemaining: 48 },
    createdAt: "2026-06-07T11:45:00.000Z",
    updatedAt: "2026-06-07T11:45:00.000Z"
  },
  scenes: [{ id: "scn_live_preview", projectId, order: 0, title: "Scene", setting: "Studio", timeOfDay: "day" }],
  shots: [
    {
      id: shotId,
      projectId,
      sceneId: "scn_live_preview",
      order: 0,
      title: "Shot",
      durationSec: 6,
      saec: { subject: "Product", action: "spins", environment: "studio", camera: "push", framing: "close", lighting: "soft", style: "clean", negative: "" },
      requirements: {
        tier: "fast",
        aspect: "9:16",
        imageToVideo: true,
        needsLipsyncAudio: false,
        motionHeavy: false,
        characterLock: false,
        characterId: null,
        region: "global"
      },
      status: "selected",
      selectedTakeId: takeId,
      qualityFlags: [],
      referenceImageIds: [assetId],
      directionSpec: { camera: "push", composition: "center", lighting: "soft", motion: "slow", style: "clean", avoid: [], notes: "" }
    }
  ],
  takes: [
    {
      id: takeId,
      shotId,
      projectId,
      label: "Take 1",
      status: "done",
      videoUrl: "https://assets.cutpilot.local/take.mp4",
      posterUrl: "https://assets.cutpilot.local/poster.jpg",
      durationSec: 6,
      tier: "fast",
      engineUsed: null,
      metrics: { overall: 0.9 },
      createdAt: "2026-06-07T11:45:00.000Z"
    }
  ],
  generationJobs: [],
  renderJobs: [],
  imageAssets: [
    {
      id: assetId,
      projectId,
      kind: "image",
      role: "product",
      source: "upload",
      label: "Reference",
      prompt: "",
      url: "https://assets.cutpilot.local/ref.png",
      thumbUrl: "https://assets.cutpilot.local/ref-thumb.jpg",
      aspect: "9:16",
      width: 1080,
      height: 1920,
      rights: { status: "needs_review", note: "confirm license" },
      createdAt: "2026-06-07T11:45:00.000Z",
      updatedAt: "2026-06-07T11:45:00.000Z"
    }
  ],
  imageJobs: [],
  referenceBoard: {
    projectId,
    productImages: [assetId],
    characterImages: [],
    locationImages: [],
    styleImages: [],
    keyframes: [],
    thumbnails: [],
    logos: [],
    backgrounds: [],
    usages: []
  },
  editState: {
    projectId,
    captions: { enabled: true, mode: "burn-in", source: "script-first" },
    bgm: { enabled: false, track: "", ducking: true },
    voiceover: { enabled: false, voice: "Voice A", source: "licensed_tts" },
    transitions: "soft",
    commands: []
  },
  credits: { balance: 40, spent: 18, reserved: 0 },
  creditTransactions: [],
  mediaArtifacts: [],
  renderSourceHash: "sha256:live-preview"
};

const spec = { resolution: "720p", cut: "6s", aspect: "9:16", caption: "none" } as const;
const preview = buildLiveRenderPreview(bundle, spec);

assert.equal(preview.projectId, projectId, "live render preview should preserve project id");
assert.equal(preview.sourceHash, bundle.renderSourceHash, "live render preview should use the bundle source hash");
assert.equal(preview.renderPlan.shots.length, 1, "live render preview should include selected takes");
assert.equal(preview.renderPlan.totalDurationSec, 6, "live render preview should total selected take duration");
assert.equal(preview.renderPlan.missingShotIds.length, 0, "live render preview should not mark selected shots missing");
assert.equal(preview.rightsReview.required, true, "live render preview should require review for needs_review references");
assert.equal(preview.rightsReview.items[0].assetId, assetId, "live render preview should include reviewed asset ids");
assert.equal(preview.estimate.credits, 48, "live render preview should use start render credit estimate");
assert.equal(preview.estimate.affordable, false, "live render preview should account for available credits");
assert.equal(preview.estimate.shortfallCredits, 8, "live render preview should report credit shortfall");

console.log("live-render-preview.test OK");

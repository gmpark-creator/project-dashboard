import { randomUUID } from "node:crypto";
import { INTENT_TEMPLATES } from "../domain/templates";
import { TYPICAL_PROJECT_CREDIT_BUDGET } from "../domain/cost-policy";
import type { Aspect, AssetUsage, EditState, Intent, Project, ReferenceBoard, Scene, Shot, Tier } from "../domain/types";

export type LiveProjectCreateInput = {
  title?: string;
  idea: string;
  intent: Intent;
  advanced?: {
    aspect?: Aspect;
    durationSec?: number;
    tier?: Tier;
  };
};

export type LiveProjectCreateRecords = {
  creditAccountId: string;
  project: Project;
  scenes: Scene[];
  shots: Shot[];
  referenceBoard: ReferenceBoard;
  editState: EditState;
};

function now() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomUUID().slice(0, 8)}`;
}

function defaultDirectionSpec(): Shot["directionSpec"] {
  return {
    camera: "smooth push-in",
    composition: "clear subject-centered composition",
    lighting: "clean natural lighting",
    motion: "controlled natural movement",
    style: "polished commercial video",
    avoid: ["shaky camera", "flicker", "distorted text", "unclear subject"],
    notes: ""
  };
}

export function buildLiveDefaultEditState(projectId: string): EditState {
  return {
    projectId,
    captions: { enabled: true, mode: "burn-in", source: "script-first" },
    bgm: { enabled: true, track: "licensed track", ducking: true },
    voiceover: { enabled: false, voice: "Voice A", source: "licensed_tts" },
    transitions: "soft",
    commands: []
  };
}

export function buildLiveDefaultReferenceBoard(projectId: string): ReferenceBoard {
  return {
    projectId,
    productImages: [],
    characterImages: [],
    locationImages: [],
    styleImages: [],
    keyframes: [],
    thumbnails: [],
    logos: [],
    backgrounds: [],
    usages: [] as AssetUsage[]
  };
}

function buildLiveStoryboard(project: Pick<Project, "id" | "title" | "intent" | "aspect"> & { tier: Tier }, idea: string) {
  const sceneSpecs = [
    ["Opening", "A fast, clear introduction to the subject"],
    ["Detail", "The main product or message value"],
    ["Use Case", "The subject in a practical context"],
    ["Close", "The final call-to-action moment"]
  ] as const;
  const shotNames = [
    "Opening frame",
    "Atmosphere setup",
    "Subject close-up",
    "Primary action",
    "Detail insert",
    "Audience reaction",
    "Transition shot",
    "Benefit emphasis",
    "Final proposal",
    "End card"
  ];

  const scenes: Scene[] = sceneSpecs.map(([title, setting], order) => ({
    id: uid("scn"),
    projectId: project.id,
    order,
    title,
    setting,
    timeOfDay: order === 0 ? "day" : "auto"
  }));

  const shots: Shot[] = shotNames.map((title, order) => {
    const scene = scenes[Math.min(Math.floor(order / 3), scenes.length - 1)];
    return {
      id: uid("sht"),
      sceneId: scene.id,
      projectId: project.id,
      order,
      title,
      durationSec: order === 0 ? 2 : 3,
      saec: {
        subject: idea || project.title,
        action: title,
        environment: scene.setting,
        camera: order % 2 === 0 ? "smooth push-in" : "stable tracking shot",
        framing: order % 3 === 0 ? "wide" : "close-up",
        lighting: "clean natural lighting",
        style: `${INTENT_TEMPLATES[project.intent].label} video style`,
        negative: "shaky camera, flicker, distorted text, unclear subject"
      },
      requirements: {
        tier: project.tier,
        aspect: project.aspect,
        imageToVideo: false,
        needsLipsyncAudio: false,
        motionHeavy: project.intent === "product_ad" || project.intent === "real_estate",
        characterLock: project.intent === "education" || project.intent === "brand",
        characterId: null,
        region: "US"
      },
      status: "pending",
      selectedTakeId: null,
      qualityFlags: [],
      referenceImageIds: [],
      directionSpec: defaultDirectionSpec()
    };
  });

  return { scenes, shots };
}

export function buildLiveProjectCreateRecords(input: LiveProjectCreateInput): LiveProjectCreateRecords {
  const idea = input.idea.trim();
  const title = input.title?.trim();
  if (!idea) throw new Error("Project idea is required.");
  const template = INTENT_TEMPLATES[input.intent];
  const timestamp = now();
  const projectId = uid("prj");
  const creditAccountId = uid("acct");
  const project: Project = {
    id: projectId,
    title: title || idea.slice(0, 20),
    idea,
    intent: input.intent,
    status: "storyboarded",
    aspect: input.advanced?.aspect || template.defaults.aspect,
    targetDurationSec: input.advanced?.durationSec || template.defaults.durationSec,
    progress: { shotsDone: 0, shotsTotal: 0 },
    characters: [],
    thumbUrl: null,
    defaultRenderJobId: null,
    credits: { spent: 0, estimateRemaining: TYPICAL_PROJECT_CREDIT_BUDGET },
    createdAt: timestamp,
    updatedAt: timestamp
  };
  const storyboard = buildLiveStoryboard({ ...project, tier: input.advanced?.tier || template.defaults.tier }, idea);
  project.progress = { shotsDone: 0, shotsTotal: storyboard.shots.length };
  return {
    creditAccountId,
    project,
    scenes: storyboard.scenes,
    shots: storyboard.shots,
    referenceBoard: buildLiveDefaultReferenceBoard(project.id),
    editState: buildLiveDefaultEditState(project.id)
  };
}

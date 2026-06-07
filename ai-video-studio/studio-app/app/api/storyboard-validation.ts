import type { Aspect, DirectionSpec, Saec, Scene, Shot, ShotRequirements, Tier } from "@/domain/types";
import { isJsonObject } from "./json-body";

type ScenePatch = Partial<Pick<Scene, "order" | "title" | "setting" | "timeOfDay">> & { id: string };
type ShotPatch = Partial<Pick<Shot, "order" | "sceneId" | "title" | "durationSec">> & {
  id: string;
  saec?: Partial<Saec>;
  requirements?: Partial<ShotRequirements>;
  directionSpec?: Partial<DirectionSpec>;
};

export type StoryboardUpdatePatch = {
  scenes?: ScenePatch[];
  shots?: ShotPatch[];
};

const sceneKeys = new Set(["id", "order", "title", "setting", "timeOfDay"]);
const shotKeys = new Set(["id", "order", "sceneId", "title", "durationSec", "saec", "requirements", "directionSpec"]);
const saecKeys = new Set([
  "subject",
  "action",
  "environment",
  "camera",
  "framing",
  "lighting",
  "style",
  "negative"
]);
const directionKeys = new Set(["camera", "composition", "lighting", "motion", "style", "avoid", "notes"]);
const requirementKeys = new Set([
  "tier",
  "aspect",
  "resolution",
  "imageToVideo",
  "needsLipsyncAudio",
  "motionHeavy",
  "characterLock",
  "characterId",
  "region"
]);
const validTiers = new Set<Tier>(["fast", "economy", "final"]);
const validAspects = new Set<Aspect>(["9:16", "16:9", "1:1", "4:5"]);
const validResolutions = new Set(["540p", "720p", "1080p", "4k"]);

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isNonNegativeInteger(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isStringPatch(value: unknown, allowed: Set<string>) {
  if (!isJsonObject(value) || !hasOnlyKeys(value, allowed)) return false;
  return Object.values(value).every((item) => typeof item === "string");
}

function isDirectionPatch(value: unknown): value is Partial<DirectionSpec> {
  if (!isJsonObject(value) || !hasOnlyKeys(value, directionKeys)) return false;
  for (const [key, item] of Object.entries(value)) {
    if (key === "avoid") {
      if (!Array.isArray(item) || !item.every((entry) => typeof entry === "string")) return false;
    } else if (typeof item !== "string") {
      return false;
    }
  }
  return true;
}

function isRequirementsPatch(value: unknown): value is Partial<ShotRequirements> {
  if (!isJsonObject(value) || !hasOnlyKeys(value, requirementKeys)) return false;
  if (typeof value.tier !== "undefined" && (typeof value.tier !== "string" || !validTiers.has(value.tier as Tier))) {
    return false;
  }
  if (typeof value.aspect !== "undefined" && (typeof value.aspect !== "string" || !validAspects.has(value.aspect as Aspect))) {
    return false;
  }
  if (
    typeof value.resolution !== "undefined" &&
    (typeof value.resolution !== "string" || !validResolutions.has(value.resolution))
  ) {
    return false;
  }
  for (const key of ["imageToVideo", "needsLipsyncAudio", "motionHeavy", "characterLock"]) {
    if (typeof value[key] !== "undefined" && typeof value[key] !== "boolean") return false;
  }
  if (typeof value.characterId !== "undefined" && value.characterId !== null && typeof value.characterId !== "string") return false;
  return typeof value.region === "undefined" || typeof value.region === "string";
}

function isScenePatch(value: unknown): value is ScenePatch {
  if (!isJsonObject(value) || !hasOnlyKeys(value, sceneKeys)) return false;
  if (typeof value.id !== "string" || !value.id.startsWith("scn_")) return false;
  if (typeof value.order !== "undefined" && !isNonNegativeInteger(value.order)) return false;
  for (const key of ["title", "setting", "timeOfDay"]) {
    if (typeof value[key] !== "undefined" && typeof value[key] !== "string") return false;
  }
  return true;
}

function isShotPatch(value: unknown): value is ShotPatch {
  if (!isJsonObject(value) || !hasOnlyKeys(value, shotKeys)) return false;
  if (typeof value.id !== "string" || !value.id.startsWith("sht_")) return false;
  if (typeof value.sceneId !== "undefined" && (typeof value.sceneId !== "string" || !value.sceneId.startsWith("scn_"))) {
    return false;
  }
  if (typeof value.order !== "undefined" && !isNonNegativeInteger(value.order)) return false;
  if (typeof value.title !== "undefined" && typeof value.title !== "string") return false;
  if (
    typeof value.durationSec !== "undefined" &&
    (typeof value.durationSec !== "number" || !Number.isFinite(value.durationSec) || value.durationSec < 1 || value.durationSec > 16)
  ) {
    return false;
  }
  if (typeof value.saec !== "undefined" && !isStringPatch(value.saec, saecKeys)) return false;
  if (typeof value.requirements !== "undefined" && !isRequirementsPatch(value.requirements)) return false;
  if (typeof value.directionSpec !== "undefined" && !isDirectionPatch(value.directionSpec)) return false;
  return true;
}

export function isStoryboardUpdatePatch(value: Record<string, unknown>): value is StoryboardUpdatePatch {
  if (!hasOnlyKeys(value, new Set(["scenes", "shots"]))) return false;
  if (typeof value.scenes !== "undefined" && (!Array.isArray(value.scenes) || !value.scenes.every(isScenePatch))) {
    return false;
  }
  if (typeof value.shots !== "undefined" && (!Array.isArray(value.shots) || !value.shots.every(isShotPatch))) {
    return false;
  }
  return true;
}

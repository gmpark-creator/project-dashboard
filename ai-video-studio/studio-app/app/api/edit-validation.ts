import type { EditState } from "@/domain/types";
import { isJsonObject } from "./json-body";

const captionModes = new Set<EditState["captions"]["mode"]>(["burn-in", "srt", "both"]);
const captionSources = new Set<EditState["captions"]["source"]>(["script-first", "stt"]);
const voiceSources = new Set<EditState["voiceover"]["source"]>(["licensed_tts", "user_upload"]);
const transitions = new Set<EditState["transitions"]>(["none", "soft"]);

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>) {
  return Object.keys(value).every((key) => allowed.has(key));
}

function isCaptions(value: unknown): value is EditState["captions"] {
  if (!isJsonObject(value) || !hasOnlyKeys(value, new Set(["enabled", "mode", "source"]))) return false;
  return (
    typeof value.enabled === "boolean" &&
    typeof value.mode === "string" &&
    captionModes.has(value.mode as EditState["captions"]["mode"]) &&
    typeof value.source === "string" &&
    captionSources.has(value.source as EditState["captions"]["source"])
  );
}

function isBgm(value: unknown): value is EditState["bgm"] {
  if (!isJsonObject(value) || !hasOnlyKeys(value, new Set(["enabled", "track", "ducking"]))) return false;
  return typeof value.enabled === "boolean" && typeof value.track === "string" && typeof value.ducking === "boolean";
}

function isVoiceover(value: unknown): value is EditState["voiceover"] {
  if (!isJsonObject(value) || !hasOnlyKeys(value, new Set(["enabled", "voice", "source"]))) return false;
  return (
    typeof value.enabled === "boolean" &&
    typeof value.voice === "string" &&
    typeof value.source === "string" &&
    voiceSources.has(value.source as EditState["voiceover"]["source"])
  );
}

export function isEditAudioPatch(
  value: Record<string, unknown>
): value is Partial<Pick<EditState, "captions" | "bgm" | "voiceover" | "transitions">> {
  if (!hasOnlyKeys(value, new Set(["captions", "bgm", "voiceover", "transitions"]))) return false;
  if (typeof value.captions !== "undefined" && !isCaptions(value.captions)) return false;
  if (typeof value.bgm !== "undefined" && !isBgm(value.bgm)) return false;
  if (typeof value.voiceover !== "undefined" && !isVoiceover(value.voiceover)) return false;
  if (
    typeof value.transitions !== "undefined" &&
    (typeof value.transitions !== "string" || !transitions.has(value.transitions as EditState["transitions"]))
  ) {
    return false;
  }
  return true;
}

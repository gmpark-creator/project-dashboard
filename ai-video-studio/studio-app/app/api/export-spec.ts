import type { Aspect, ExportSpec } from "@/domain/types";
import { isJsonObject } from "./json-body";

const validResolutions = new Set<ExportSpec["resolution"]>(["720p", "1080p", "4k"]);
const validCuts = new Set<ExportSpec["cut"]>(["6s", "15s", "30s", "full"]);
const validAspects = new Set<Aspect>(["9:16", "16:9", "1:1", "4:5"]);
const validCaptions = new Set<ExportSpec["caption"]>(["none", "burn-in", "srt", "both"]);

export function isExportSpec(value: unknown): value is ExportSpec {
  if (!isJsonObject(value)) return false;
  return (
    typeof value.resolution === "string" &&
    validResolutions.has(value.resolution as ExportSpec["resolution"]) &&
    typeof value.cut === "string" &&
    validCuts.has(value.cut as ExportSpec["cut"]) &&
    typeof value.aspect === "string" &&
    validAspects.has(value.aspect as Aspect) &&
    typeof value.caption === "string" &&
    validCaptions.has(value.caption as ExportSpec["caption"])
  );
}

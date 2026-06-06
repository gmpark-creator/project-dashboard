import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GenerationPromptPackage, ProviderRouteTarget, ProviderRoutingDecision, Shot, Tier } from "../domain/types";

type RoutingRule = {
  id: string;
  when: Partial<Record<"needsLipsyncAudio" | "imageToVideo" | "motionHeavy", boolean> & { tier: Tier }>;
  use: ProviderRouteTarget[];
};

type ProviderModel = {
  id: string;
  input?: string[];
  aspectRatios?: string[];
  resolutions?: string[];
  durationSec?: number[];
  supportsAudio?: boolean | string;
};

type RoutingConfig = {
  hideEngineFromUser: boolean;
  fallbackOnError: boolean;
  defaultTakePolicy: Record<Tier, { splitAcrossProviders: boolean | string }>;
  rules: RoutingRule[];
};

type CapabilitiesConfig = {
  providers: Array<{ provider: string; models: ProviderModel[] }>;
};

function readConfig<T>(fileName: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), "..", "codex", "config", fileName), "utf8")) as T;
}

const routing = readConfig<RoutingConfig>("routing.config.json");
const capabilities = readConfig<CapabilitiesConfig>("provider-capabilities.json");

function findModel(target: ProviderRouteTarget) {
  const provider = capabilities.providers.find((item) => item.provider === target.provider);
  return provider?.models.find((model) => model.id === target.model) || null;
}

function ruleMatches(rule: RoutingRule, shot: Shot) {
  const requirements = shot.requirements;
  return Object.entries(rule.when).every(([key, expected]) => {
    if (key === "tier") return requirements.tier === expected;
    if (key === "needsLipsyncAudio") return requirements.needsLipsyncAudio === expected;
    if (key === "imageToVideo") return requirements.imageToVideo === expected;
    if (key === "motionHeavy") return requirements.motionHeavy === expected;
    return false;
  });
}

function canAcceptInput(model: ProviderModel, promptPackage: GenerationPromptPackage) {
  const inputs = model.input || ["text"];
  if (!promptPackage.requirements.imageToVideo) return inputs.includes("text");
  return inputs.some((input) => input === "image" || input === "image_keyframe" || input === "first_last_frames");
}

function rejectionReason(model: ProviderModel | null, shot: Shot, promptPackage: GenerationPromptPackage) {
  if (!model) return "unknown_model";
  if (!canAcceptInput(model, promptPackage)) return "input_type";
  if (model.aspectRatios && !model.aspectRatios.includes(shot.requirements.aspect)) return "aspect_ratio";
  if (shot.requirements.resolution && model.resolutions && !model.resolutions.includes(shot.requirements.resolution)) return "resolution";
  if (model.durationSec && Math.max(...model.durationSec) < shot.durationSec) return "duration";
  if (shot.requirements.needsLipsyncAudio && model.supportsAudio === false) return "audio_capability";
  return null;
}

function eligibleTargets(rule: RoutingRule, shot: Shot, promptPackage: GenerationPromptPackage) {
  const candidates: ProviderRouteTarget[] = [];
  const rejected: ProviderRoutingDecision["rejected"] = [];
  for (const target of rule.use) {
    const model = findModel(target);
    const reason = rejectionReason(model, shot, promptPackage);
    if (reason) {
      rejected.push({ ...target, reason });
    } else {
      candidates.push(target);
    }
  }
  return { candidates, rejected };
}

function fallbackRuleForTier(tier: Tier) {
  return routing.rules.find((rule) => rule.when.tier === tier) || routing.rules[routing.rules.length - 1];
}

export function chooseProviderRoute(shot: Shot, promptPackage: GenerationPromptPackage, splitTakeIndex: number): ProviderRoutingDecision {
  const matchedRule = routing.rules.find((rule) => ruleMatches(rule, shot)) || fallbackRuleForTier(shot.requirements.tier);
  const { candidates, rejected } = eligibleTargets(matchedRule, shot, promptPackage);
  const fallbackTarget = { provider: "mock", model: "fallback" };
  const usableCandidates = candidates.length ? candidates : [fallbackTarget];
  const splitPolicy = routing.defaultTakePolicy[shot.requirements.tier]?.splitAcrossProviders;
  const selected =
    splitPolicy && usableCandidates.length > 1
      ? usableCandidates[splitTakeIndex % usableCandidates.length]
      : usableCandidates[0];

  return {
    ruleId: matchedRule.id,
    selected,
    candidates: usableCandidates,
    rejected,
    splitTakeIndex,
    fallbackEnabled: routing.fallbackOnError,
    hiddenFromUser: routing.hideEngineFromUser
  };
}

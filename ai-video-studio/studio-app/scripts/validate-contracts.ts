import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "..");
const codexDir = join(root, "codex");

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

type Capabilities = {
  providers: Array<{
    provider: string;
    models: Array<{ id: string; input?: string[]; routingTags?: string[] }>;
  }>;
};

type Routing = {
  rules: Array<{
    id: string;
    use: Array<{ provider: string; model: string }>;
  }>;
};

const capabilities = readJson<Capabilities>(join(codexDir, "config", "provider-capabilities.json"));
const routing = readJson<Routing>(join(codexDir, "config", "routing.config.json"));
const domainSchema = readJson<{ $defs: Record<string, unknown> }>(join(codexDir, "schemas", "domain.schema.json"));
const openApi = readJson<{ paths: Record<string, { get?: { operationId?: string }; post?: { operationId?: string }; patch?: { operationId?: string }; delete?: { operationId?: string } }> }>(
  join(codexDir, "api", "openapi.json")
);

const knownModels = new Set<string>();
for (const provider of capabilities.providers) {
  for (const model of provider.models) {
    knownModels.add(`${provider.provider}:${model.id}`);
  }
}

for (const rule of routing.rules) {
  for (const target of rule.use) {
    assert.ok(
      knownModels.has(`${target.provider}:${target.model}`),
      `routing rule ${rule.id} references unknown model ${target.provider}:${target.model}`
    );
  }
}

for (const defName of [
  "ImageAsset",
  "ImageJob",
  "AssetUsageMode",
  "DirectionSpec",
  "GenerationPromptPackage",
  "ProviderRoutingDecision",
  "RenderPlan",
  "RenderRightsReview",
  "AssetDeleteResult"
]) {
  assert.ok(domainSchema.$defs[defName], `domain schema missing ${defName}`);
}

const requiredOperations = new Set([
  "listImageAssets",
  "registerExternalImage",
  "createImageJob",
  "attachImageToShot",
  "detachImageFromShot",
  "deleteImageAsset",
  "updateShotDirection",
  "generateShot"
]);
const operationIds = new Set<string>();
for (const path of Object.values(openApi.paths)) {
  for (const method of [path.get, path.post, path.patch, path.delete]) {
    if (method?.operationId) operationIds.add(method.operationId);
  }
}
for (const operation of requiredOperations) {
  assert.ok(operationIds.has(operation), `openapi missing operation ${operation}`);
}

const templateDir = join(codexDir, "config", "templates");
const templateFiles = readdirSync(templateDir).filter((name) => name.endsWith(".json"));
assert.equal(templateFiles.length, 6, "expected 6 intent templates");

const expectedIntents = new Set(["shorts", "product_ad", "app_intro", "real_estate", "education", "brand"]);
for (const file of templateFiles) {
  const template = readJson<{ intent: string; defaults: { aspect: string; tier: string } }>(join(templateDir, file));
  assert.ok(expectedIntents.has(template.intent), `unknown template intent ${template.intent}`);
  assert.ok(["9:16", "16:9", "1:1", "4:5"].includes(template.defaults.aspect), `invalid aspect in ${file}`);
  assert.ok(["fast", "economy", "final"].includes(template.defaults.tier), `invalid tier in ${file}`);
}

console.log("validate-contracts OK", {
  providers: capabilities.providers.length,
  routingRules: routing.rules.length,
  templates: templateFiles.length,
  visualMakerOps: requiredOperations.size
});

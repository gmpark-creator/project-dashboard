import assert from "node:assert/strict";
import { POST as createImageJob } from "../app/api/projects/[projectId]/image-jobs/route";
import { createProject, getMutableMockState, resetMockState, saveMockState } from "../src/server/mock-service";

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/test", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

function context<T extends Record<string, string>>(params: T) {
  return { params: Promise.resolve(params) };
}

async function main() {
  process.env.CUTPILOT_MOCK_PERSIST = "0";
  resetMockState();
  const project = createProject({ idea: "Launch a compact product teaser", intent: "product_ad" });
  const state = getMutableMockState();
  state.credits.balance = 0;
  saveMockState(state);

  const response = await createImageJob(
    request({ prompt: "hero product render", purpose: "product", role: "product", aspect: project.aspect, count: 1 }),
    context({ projectId: project.id })
  );
  assert.equal(response.status, 402, "insufficient credits should return 402");
  const body = (await response.json()) as { code?: string; userMessage?: string };
  assert.equal(body.code, "INSUFFICIENT_CREDITS", "credit failures should keep the normalized code");
  assert.equal(body.userMessage, "Not enough available credits.", "credit failures should expose a readable user message");

  console.log("api-credit-error.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

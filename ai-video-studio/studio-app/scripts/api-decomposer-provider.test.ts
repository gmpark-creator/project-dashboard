import assert from "node:assert/strict";
import { POST as decompose } from "../app/api/storyboard/decompose/route";

function request(body: unknown) {
  return new Request("http://cutpilot.local/api/storyboard/decompose", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

async function json(response: Response) {
  return response.json() as Promise<{ code?: string; scenes?: unknown[]; shots?: unknown[] }>;
}

async function main() {
  const originalProvider = process.env.DECOMPOSER_PROVIDER;

  delete process.env.DECOMPOSER_PROVIDER;
  const mockResponse = await decompose(request({ idea: "Preview a launch storyboard", intent: "product_ad" }));
  assert.equal(mockResponse.status, 200, "mock story decomposer should remain the default");
  const mockBody = await json(mockResponse);
  assert.equal(mockBody.scenes?.length, 4, "mock story decomposer should return scenes");
  assert.equal(mockBody.shots?.length, 10, "mock story decomposer should return shots");

  process.env.DECOMPOSER_PROVIDER = "openai";
  const unavailableResponse = await decompose(request({ idea: "Preview a live storyboard", intent: "product_ad" }));
  assert.equal(unavailableResponse.status, 503, "unimplemented live story decomposer providers should fail closed");
  assert.equal((await json(unavailableResponse)).code, "DECOMPOSER_UNAVAILABLE", "unavailable story decomposer should return a stable error code");

  process.env.DECOMPOSER_PROVIDER = "unsupported";
  const invalidProviderResponse = await decompose(request({ idea: "Preview an invalid provider", intent: "product_ad" }));
  assert.equal(invalidProviderResponse.status, 503, "invalid story decomposer providers should fail closed");

  if (typeof originalProvider === "undefined") delete process.env.DECOMPOSER_PROVIDER;
  else process.env.DECOMPOSER_PROVIDER = originalProvider;

  console.log("api-decomposer-provider.test OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

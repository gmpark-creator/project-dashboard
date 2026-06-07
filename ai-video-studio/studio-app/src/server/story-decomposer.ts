import type { Intent } from "../domain/types";
import { decomposeIdea } from "./mock-service";
import { configuredStoryDecomposerProvider, isStoryDecomposerProvider } from "./story-decomposer-config";

export type StoryDecomposerInput = {
  projectId?: string;
  idea: string;
  intent: Intent;
};

export class StoryDecomposerUnavailableError extends Error {
  provider: string;

  constructor(provider: string) {
    super(`Story decomposer provider ${provider} is not available`);
    this.name = "StoryDecomposerUnavailableError";
    this.provider = provider;
  }
}

export function decomposeStoryboard(input: StoryDecomposerInput) {
  const provider = configuredStoryDecomposerProvider();
  if (provider === "mock") return decomposeIdea(input);
  if (isStoryDecomposerProvider(provider)) throw new StoryDecomposerUnavailableError(provider);
  throw new StoryDecomposerUnavailableError(provider || "unknown");
}

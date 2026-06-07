export const storyDecomposerProviders = ["mock", "openai", "anthropic"] as const;
export type StoryDecomposerProvider = (typeof storyDecomposerProviders)[number];

export function configuredStoryDecomposerProvider() {
  return process.env.DECOMPOSER_PROVIDER?.trim().toLowerCase() || "mock";
}

export function isStoryDecomposerProvider(provider: string): provider is StoryDecomposerProvider {
  return storyDecomposerProviders.includes(provider as StoryDecomposerProvider);
}

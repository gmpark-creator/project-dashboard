import { INTENT_TEMPLATES } from "../domain/templates";
import { chooseProviderRoute } from "./provider-routing";
import type {
  Aspect,
  AssetDeleteResult,
  AssetUsage,
  AssetUsageMode,
  EditState,
  ExportSpec,
  GenerationJob,
  GenerationPromptPackage,
  ImageAsset,
  ImageAssetRole,
  ImageJob,
  ImageMakerPurpose,
  ImageVariant,
  Intent,
  JobStatus,
  Project,
  ProjectBundle,
  ProviderRoutingDecision,
  ReferenceBoard,
  RenderJob,
  RenderPlan,
  RenderPreview,
  RenderRightsReview,
  Scene,
  Shot,
  StudioState,
  Take,
  Tier
} from "../domain/types";

const globalStore = globalThis as typeof globalThis & {
  __aiVideoStudioMockState?: StudioState;
};

function now() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function blankState(): StudioState {
  return {
    version: 1,
    credits: { balance: 1240, spent: 0, reserved: 0 },
    projects: [],
    scenes: [],
    shots: [],
    takes: [],
    generationJobs: [],
    renderJobs: [],
    imageAssets: [],
    imageJobs: [],
    referenceBoards: {},
    editState: {},
    updatedAt: now()
  };
}

function normalizeState(current: StudioState): StudioState {
  const next = current as StudioState & Partial<Pick<StudioState, "imageAssets" | "imageJobs" | "referenceBoards">>;
  if (!Array.isArray(next.imageAssets)) next.imageAssets = [];
  if (!Array.isArray(next.imageJobs)) next.imageJobs = [];
  if (!next.referenceBoards) next.referenceBoards = {};

  for (const project of next.projects) {
    if (!next.referenceBoards[project.id]) {
      next.referenceBoards[project.id] = defaultReferenceBoard(project.id);
    }
  }

  for (const shot of next.shots) {
    if (!Array.isArray(shot.referenceImageIds)) shot.referenceImageIds = [];
    if (!shot.directionSpec) shot.directionSpec = defaultDirectionSpec();
  }

  for (const job of next.generationJobs) {
    const mutableJob = job as GenerationJob & Partial<GenerationJob>;
    const shot = next.shots.find((item) => item.id === job.shotId);
    if (shot && !mutableJob.promptPackage) mutableJob.promptPackage = buildGenerationPromptPackage(next as StudioState, shot);
    if (shot && mutableJob.promptPackage && !mutableJob.routing) {
      mutableJob.routing = chooseProviderRoute(shot, mutableJob.promptPackage, 0);
    }
  }

  for (const job of next.renderJobs) {
    if (!job.rightsReview) job.rightsReview = defaultRenderRightsReview();
    if (!job.renderPlan) job.renderPlan = buildRenderPlan(next as StudioState, job.projectId, job.spec);
  }

  return next as StudioState;
}

function state(): StudioState {
  if (!globalStore.__aiVideoStudioMockState) {
    globalStore.__aiVideoStudioMockState = blankState();
  }
  globalStore.__aiVideoStudioMockState = normalizeState(globalStore.__aiVideoStudioMockState);
  return globalStore.__aiVideoStudioMockState;
}

function write(nextState = state()) {
  nextState.updatedAt = now();
  globalStore.__aiVideoStudioMockState = nextState;
  return nextState;
}

export function resetMockState() {
  globalStore.__aiVideoStudioMockState = blankState();
  return state();
}

export function getMockState() {
  return tickJobs();
}

function defaultEditState(projectId: string): EditState {
  return {
    projectId,
    captions: { enabled: true, mode: "burn-in", source: "script-first" },
    bgm: { enabled: true, track: "라이선스 확인 사운드", ducking: true },
    voiceover: { enabled: false, voice: "보이스 A", source: "licensed_tts" },
    transitions: "soft",
    commands: []
  };
}

function defaultDirectionSpec() {
  return {
    camera: "부드러운 푸시인",
    composition: "핵심 대상이 선명하게 보이는 안정적인 구도",
    lighting: "깨끗하고 자연스러운 조명",
    motion: "과하지 않은 자연스러운 움직임",
    style: "프로젝트 목적에 맞는 선명한 영상 톤",
    avoid: ["흔들림", "플리커", "텍스트 왜곡", "불필요한 손"],
    notes: ""
  };
}

function defaultReferenceBoard(projectId: string): ReferenceBoard {
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

function defaultRenderRightsReview(): RenderRightsReview {
  return {
    required: false,
    assetIds: [],
    items: []
  };
}

function projectProgress(current: StudioState, projectId: string) {
  const shots = current.shots.filter((shot) => shot.projectId === projectId);
  const shotsDone = shots.filter((shot) => shot.selectedTakeId || shot.status === "reviewing" || shot.status === "selected").length;
  return { shotsDone, shotsTotal: shots.length };
}

function refreshProject(current: StudioState, projectId: string) {
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) return;
  const shots = current.shots.filter((shot) => shot.projectId === projectId);
  const hasRunning = shots.some((shot) => shot.status === "generating");
  const hasReview = shots.some((shot) => shot.status === "reviewing" || shot.status === "failed");
  const selectedCount = shots.filter((shot) => shot.selectedTakeId).length;
  project.progress = projectProgress(current, projectId);
  project.status = hasRunning ? "generating" : hasReview ? "reviewing" : selectedCount ? "edited" : "storyboarded";
  project.updatedAt = now();
  project.credits.spent = current.credits.spent;
  project.credits.estimateRemaining = Math.max(0, 180 - current.credits.spent);
}

function buildStoryboard(project: Pick<Project, "id" | "title" | "intent" | "aspect">, idea: string) {
  const sceneSpecs = [
    ["오프닝", "핵심 장면을 빠르게 보여주는 시작"],
    ["디테일", "제품이나 메시지의 강점"],
    ["사용 장면", "실제로 쓰이는 순간"],
    ["마무리", "행동 유도와 최종 컷"]
  ] as const;
  const shotNames = [
    "첫 화면 훅",
    "분위기 확립",
    "핵심 대상 클로즈업",
    "주요 동작",
    "디테일 인서트",
    "사용자 반응",
    "전환 컷",
    "장점 강조",
    "최종 제안",
    "엔드카드"
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
        camera: order % 2 === 0 ? "부드러운 푸시인" : "안정적인 트래킹",
        framing: order % 3 === 0 ? "와이드" : "클로즈업",
        lighting: "깨끗하고 자연스러운 조명",
        style: `${INTENT_TEMPLATES[project.intent].label}에 맞는 선명한 영상 톤`,
        negative: "흔들림, 플리커, 모핑, 텍스트 왜곡"
      },
      requirements: {
        tier: "fast",
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

export function createProject(input: { title?: string; idea: string; intent: Intent; advanced?: { aspect?: Aspect; durationSec?: number; tier?: Tier } }) {
  const current = state();
  const idea = input.idea.trim();
  const title = input.title?.trim();
  if (!idea) throw new Error("아이디어를 입력해 주세요.");
  const template = INTENT_TEMPLATES[input.intent];
  const project: Project = {
    id: uid("prj"),
    title: title || idea.slice(0, 20),
    idea,
    intent: input.intent,
    status: "storyboarded",
    aspect: input.advanced?.aspect || template.defaults.aspect,
    targetDurationSec: input.advanced?.durationSec || template.defaults.durationSec,
    progress: { shotsDone: 0, shotsTotal: 0 },
    characters: [],
    thumbUrl: null,
    credits: { spent: current.credits.spent, estimateRemaining: 180 },
    createdAt: now(),
    updatedAt: now()
  };
  const storyboard = buildStoryboard(project, idea);
  project.progress = { shotsDone: 0, shotsTotal: storyboard.shots.length };
  current.projects.unshift(project);
  current.scenes.push(...storyboard.scenes);
  current.shots.push(...storyboard.shots);
  current.editState[project.id] = defaultEditState(project.id);
  current.referenceBoards[project.id] = defaultReferenceBoard(project.id);
  write(current);
  return project;
}

export function decomposeIdea(input: { projectId?: string; idea: string; intent: Intent }) {
  const template = INTENT_TEMPLATES[input.intent];
  return buildStoryboard(
    {
      id: input.projectId || "prj_preview",
      title: input.idea.slice(0, 20) || "스토리보드 미리보기",
      intent: input.intent,
      aspect: template.defaults.aspect
    },
    input.idea
  );
}

export function listProjects() {
  const current = tickJobs();
  current.projects.forEach((project) => refreshProject(current, project.id));
  write(current);
  return current.projects;
}

export function getProjectBundle(projectId?: string): ProjectBundle | null {
  const current = tickJobs();
  const project = projectId ? current.projects.find((item) => item.id === projectId) : current.projects[0];
  if (!project) return null;
  if (!current.referenceBoards[project.id]) current.referenceBoards[project.id] = defaultReferenceBoard(project.id);
  refreshProject(current, project.id);
  write(current);
  return {
    project,
    scenes: current.scenes.filter((scene) => scene.projectId === project.id).sort((a, b) => a.order - b.order),
    shots: current.shots.filter((shot) => shot.projectId === project.id).sort((a, b) => a.order - b.order),
    takes: current.takes.filter((take) => take.projectId === project.id),
    generationJobs: current.generationJobs.filter((job) => job.projectId === project.id),
    renderJobs: current.renderJobs.filter((job) => job.projectId === project.id),
    imageAssets: current.imageAssets.filter((asset) => asset.projectId === project.id),
    imageJobs: current.imageJobs.filter((job) => job.projectId === project.id),
    referenceBoard: current.referenceBoards[project.id],
    editState: current.editState[project.id] || defaultEditState(project.id),
    credits: current.credits
  };
}

export function estimateCost(action: string, params?: { takeCount?: number }) {
  const table: Record<string, number> = {
    generateShot: 18,
    generateAll: 96,
    regenerate: 12,
    generateImages: 24,
    registerExternalImage: 0,
    upgradeTake: 22,
    startRender: 48
  };
  return {
    credits: Math.ceil((table[action] || 10) * (params?.takeCount || 1)),
    etaSec: action === "startRender" ? 90 : 25
  };
}

function imageSize(aspect: Aspect) {
  return (
    {
      "9:16": { width: 1080, height: 1920 },
      "16:9": { width: 1920, height: 1080 },
      "1:1": { width: 1536, height: 1536 },
      "4:5": { width: 1280, height: 1600 }
    } satisfies Record<Aspect, { width: number; height: number }>
  )[aspect];
}

function boardBucket(role: ImageAssetRole): keyof ReturnType<typeof defaultReferenceBoard> | null {
  return (
    {
      product: "productImages",
      character: "characterImages",
      location: "locationImages",
      style: "styleImages",
      keyframe: "keyframes",
      thumbnail: "thumbnails",
      logo: "logos",
      background: "backgrounds"
    } satisfies Record<ImageAssetRole, keyof ReturnType<typeof defaultReferenceBoard>>
  )[role];
}

function addAssetToBoard(current: StudioState, asset: ImageAsset, usage?: Omit<AssetUsage, "createdAt">) {
  const board = current.referenceBoards[asset.projectId] || defaultReferenceBoard(asset.projectId);
  current.referenceBoards[asset.projectId] = board;
  const bucket = boardBucket(asset.role);
  if (bucket && Array.isArray(board[bucket]) && !(board[bucket] as string[]).includes(asset.id)) {
    (board[bucket] as string[]).push(asset.id);
  }
  if (usage && !board.usages.some((item) => item.assetId === usage.assetId && item.targetId === usage.targetId && item.mode === usage.mode)) {
    board.usages.push({ ...usage, createdAt: now() });
  }
}

const boardImageBuckets = [
  "productImages",
  "characterImages",
  "locationImages",
  "styleImages",
  "keyframes",
  "thumbnails",
  "logos",
  "backgrounds"
] as const;

function removeAssetFromBoard(board: ReturnType<typeof defaultReferenceBoard>, assetId: string) {
  for (const bucket of boardImageBuckets) {
    board[bucket] = board[bucket].filter((id) => id !== assetId);
  }
  board.usages = board.usages.filter((usage) => usage.assetId !== assetId);
}

function assetUsages(current: StudioState, projectId: string, assetId: string) {
  const board = current.referenceBoards[projectId];
  return board ? board.usages.filter((usage) => usage.assetId === assetId) : [];
}

function shotUsages(current: StudioState, shot: Shot) {
  const board = current.referenceBoards[shot.projectId];
  if (!board) return [];
  const seen = new Set<string>();
  return board.usages.filter((usage) => {
    const key = `${usage.assetId}:${usage.mode}:${usage.target}:${usage.targetId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return usage.target === "shot" && usage.targetId === shot.id && shot.referenceImageIds.includes(usage.assetId);
  });
}

function ensureCharacterFromAsset(current: StudioState, shot: Shot, asset: ImageAsset) {
  const project = current.projects.find((item) => item.id === shot.projectId);
  if (!project) return;
  const existing = project.characters.find((character) => character.refImageUrls.includes(asset.url));
  if (existing) {
    shot.requirements.characterId = existing.id;
    return;
  }
  const character = {
    id: uid("chr"),
    label: asset.label || "참조 인물",
    refImageUrls: [asset.url]
  };
  project.characters.push(character);
  shot.requirements.characterId = character.id;
}

function applyReferenceRequirements(current: StudioState, shot: Shot) {
  const usages = shotUsages(current, shot);
  const frameUsages = usages.filter((usage) => usage.mode === "first_frame" || usage.mode === "last_frame");
  const characterUsages = usages.filter((usage) => usage.mode === "character_reference");
  const project = current.projects.find((item) => item.id === shot.projectId);
  const baselineCharacterLock = project?.intent === "education" || project?.intent === "brand";

  shot.requirements.imageToVideo = frameUsages.length > 0;
  if (characterUsages.length) {
    const asset = current.imageAssets.find((item) => item.id === characterUsages[0].assetId);
    shot.requirements.characterLock = true;
    if (asset) ensureCharacterFromAsset(current, shot, asset);
  } else if (!baselineCharacterLock) {
    shot.requirements.characterLock = false;
    shot.requirements.characterId = null;
  }
}

function detachAssetFromShot(current: StudioState, shot: Shot, assetId: string) {
  shot.referenceImageIds = shot.referenceImageIds.filter((id) => id !== assetId);
  const board = current.referenceBoards[shot.projectId];
  if (board) {
    board.usages = board.usages.filter((usage) => !(usage.target === "shot" && usage.targetId === shot.id && usage.assetId === assetId));
  }
  applyReferenceRequirements(current, shot);
}

function buildGenerationPromptPackage(current: StudioState, shot: Shot): GenerationPromptPackage {
  const usages = shotUsages(current, shot);
  const references = usages
    .map((usage) => {
      const asset = current.imageAssets.find((item) => item.id === usage.assetId);
      if (!asset) return null;
      return {
        assetId: asset.id,
        role: usage.role,
        mode: usage.mode,
        url: asset.url,
        rightsStatus: asset.rights.status
      };
    })
    .filter((reference): reference is NonNullable<typeof reference> => Boolean(reference));

  const idsByMode = (mode: AssetUsageMode) => references.filter((reference) => reference.mode === mode).map((reference) => reference.assetId);

  return {
    projectId: shot.projectId,
    shotId: shot.id,
    saec: { ...shot.saec },
    directionSpec: {
      ...shot.directionSpec,
      avoid: [...shot.directionSpec.avoid]
    },
    requirements: { ...shot.requirements },
    references,
    routingHints: {
      startFrameAssetId: idsByMode("first_frame")[0] || null,
      lastFrameAssetId: idsByMode("last_frame")[0] || null,
      styleReferenceAssetIds: idsByMode("style_reference"),
      characterReferenceAssetIds: idsByMode("character_reference"),
      productReferenceAssetIds: idsByMode("product_reference"),
      backgroundReferenceAssetIds: idsByMode("background_reference"),
      rightsReviewRequired: references.some((reference) => reference.rightsStatus === "needs_review")
    }
  };
}

function makeImageAsset(
  current: StudioState,
  input: {
    projectId: string;
    role: ImageAssetRole;
    source: ImageAsset["source"];
    label: string;
    prompt: string;
    url?: string;
    aspect: Aspect;
    rights: ImageAsset["rights"];
  }
) {
  const size = imageSize(input.aspect);
  const asset: ImageAsset = {
    id: uid("img"),
    projectId: input.projectId,
    kind: "image",
    role: input.role,
    source: input.source,
    label: input.label,
    prompt: input.prompt,
    url: input.url || `mock://image/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.png`,
    thumbUrl: `mock://thumb/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.jpg`,
    aspect: input.aspect,
    width: size.width,
    height: size.height,
    rights: input.rights,
    createdAt: now(),
    updatedAt: now()
  };
  current.imageAssets.unshift(asset);
  addAssetToBoard(current, asset);
  return asset;
}

export function listImageAssets(projectId: string) {
  return tickJobs().imageAssets.filter((asset) => asset.projectId === projectId);
}

export function createImageJob(input: {
  projectId: string;
  prompt: string;
  purpose: ImageMakerPurpose;
  role: ImageAssetRole;
  aspect: Aspect;
  style?: string;
  count?: number;
}) {
  const current = state();
  const project = current.projects.find((item) => item.id === input.projectId);
  const prompt = input.prompt.trim();
  if (!project) throw new Error("Project not found");
  if (!prompt) throw new Error("이미지 아이디어를 입력해 주세요.");
  const count = Math.max(1, Math.min(input.count || 4, 4));
  const variants: ImageVariant[] = Array.from({ length: count }, (_, index) => ({
    id: uid("ivar"),
    assetId: null,
    label: `${String.fromCharCode(65 + index)}안`,
    status: "queued",
    url: null,
    thumbUrl: null,
    scoreLabel: index === 0 ? "추천" : index === 1 ? "안정적" : "확인 필요"
  }));
  const job: ImageJob = {
    id: uid("ijob"),
    projectId: project.id,
    status: "queued",
    progress: 0,
    etaSec: 8,
    stage: "queued",
    prompt,
    purpose: input.purpose,
    role: input.role,
    aspect: input.aspect,
    style: input.style?.trim() || "깨끗한 상업용 비주얼",
    count,
    variants,
    dueAt: Date.now() + 3600,
    createdAt: now(),
    updatedAt: now(),
    error: null
  };
  current.imageJobs.unshift(job);
  current.credits.reserved += count * 4;
  write(current);
  return { job };
}

export function registerExternalImage(input: {
  projectId: string;
  label: string;
  role: ImageAssetRole;
  url: string;
  aspect?: Aspect;
  prompt?: string;
  rightsConfirmed?: boolean;
}) {
  const current = state();
  const project = current.projects.find((item) => item.id === input.projectId);
  const label = input.label.trim();
  const url = input.url.trim();
  if (!project) throw new Error("Project not found");
  if (!label || !url) throw new Error("이미지 이름과 URL이 필요합니다.");
  const asset = makeImageAsset(current, {
    projectId: project.id,
    role: input.role,
    source: "external",
    label,
    prompt: input.prompt?.trim() || "외부에서 가져온 이미지",
    url,
    aspect: input.aspect || project.aspect,
    rights: {
      status: input.rightsConfirmed ? "user_confirmed" : "needs_review",
      note: input.rightsConfirmed ? "사용자가 이미지 사용 권리를 확인했습니다." : "사용 전 이미지 권리와 인물 동의를 확인해야 합니다."
    }
  });
  write(current);
  return asset;
}

export function attachImageToShot(shotId: string, input: { assetId: string; mode: AssetUsage["mode"] }) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  const asset = current.imageAssets.find((item) => item.id === input.assetId);
  if (!shot || !asset || shot.projectId !== asset.projectId) throw new Error("Shot or image asset not found");
  if (!shot.referenceImageIds.includes(asset.id)) shot.referenceImageIds.push(asset.id);
  addAssetToBoard(current, asset, {
    assetId: asset.id,
    role: asset.role,
    target: "shot",
    targetId: shot.id,
    mode: input.mode
  });
  applyReferenceRequirements(current, shot);
  write(current);
  return shot;
}

export function detachImageFromShot(shotId: string, assetId: string) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  const asset = current.imageAssets.find((item) => item.id === assetId);
  if (!shot || !asset || shot.projectId !== asset.projectId) throw new Error("Shot or image asset not found");
  detachAssetFromShot(current, shot, asset.id);
  write(current);
  return shot;
}

export function deleteImageAsset(projectId: string, assetId: string, options: { force?: boolean } = {}): AssetDeleteResult {
  const current = state();
  const asset = current.imageAssets.find((item) => item.id === assetId && item.projectId === projectId);
  if (!asset) throw new Error("Image asset not found");
  const usages = assetUsages(current, projectId, assetId);
  if (usages.length && !options.force) {
    return {
      deleted: false,
      assetId,
      blockedByUsage: true,
      usageCount: usages.length,
      remainingAssets: current.imageAssets.filter((item) => item.projectId === projectId).length
    };
  }

  for (const shot of current.shots.filter((item) => item.projectId === projectId && item.referenceImageIds.includes(assetId))) {
    detachAssetFromShot(current, shot, assetId);
  }
  const board = current.referenceBoards[projectId];
  if (board) removeAssetFromBoard(board, assetId);
  current.imageJobs = current.imageJobs.map((job) => ({
    ...job,
    variants: job.variants.map((variant) => (variant.assetId === assetId ? { ...variant, assetId: null } : variant))
  }));
  current.imageAssets = current.imageAssets.filter((item) => item.id !== assetId);
  write(current);
  return {
    deleted: true,
    assetId,
    blockedByUsage: false,
    usageCount: usages.length,
    remainingAssets: current.imageAssets.filter((item) => item.projectId === projectId).length
  };
}

export function updateShotDirection(shotId: string, patch: Partial<Shot["directionSpec"]>) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  if (!shot) throw new Error("Shot not found");
  shot.directionSpec = {
    ...shot.directionSpec,
    ...patch,
    avoid: patch.avoid ? patch.avoid.map((item) => item.trim()).filter(Boolean) : shot.directionSpec.avoid
  };
  write(current);
  return shot;
}

function makeTake(current: StudioState, shot: Shot, tier: Tier, index: number, engineUsed: string | null, status: JobStatus = "queued") {
  const take: Take = {
    id: uid("tak"),
    shotId: shot.id,
    projectId: shot.projectId,
    label: `${String.fromCharCode(65 + index)}안`,
    status,
    videoUrl: null,
    posterUrl: null,
    durationSec: shot.durationSec,
    tier,
    engineUsed,
    metrics: {},
    createdAt: now()
  };
  current.takes.push(take);
  return take;
}

function makeGenerationJob(
  current: StudioState,
  shot: Shot,
  take: Take,
  shouldFail: boolean,
  promptPackage: GenerationPromptPackage,
  routing: ProviderRoutingDecision
) {
  const job: GenerationJob = {
    id: uid("gen"),
    shotId: shot.id,
    takeId: take.id,
    projectId: shot.projectId,
    status: "queued",
    progress: 0,
    etaSec: 6,
    stage: "queued",
    shouldFail,
    dueAt: Date.now() + 2500 + (shot.order % 4) * 650,
    createdAt: now(),
    updatedAt: now(),
    error: null,
    promptPackage,
    routing
  };
  current.generationJobs.push(job);
  return job;
}

function completeTake(take: Take, shot: Shot) {
  take.status = "done";
  take.videoUrl = `mock://video/${take.id}.mp4`;
  take.posterUrl = `mock://poster/${take.id}.jpg`;
  const motion = shot.order === 4 || shot.order === 8 ? 2 : 4 + ((shot.order + take.label.length) % 2);
  take.metrics = {
    fidelity: 4,
    consistency: shot.requirements.characterLock ? 4 : 5,
    motion,
    transition: 4,
    audio: shot.requirements.needsLipsyncAudio ? 3 : 4,
    completeness: 4,
    overall: Number(((4 + motion + 4 + 4) / 4).toFixed(1))
  };
}

function failTake(take: Take) {
  take.status = "failed";
  take.videoUrl = null;
  take.posterUrl = null;
  take.metrics = {};
}

export function generateShot(shotId: string, options: { tier?: Tier; takeCount?: number } = {}) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  if (!shot) throw new Error("Shot not found");
  const existingAttempts = current.generationJobs.filter((job) => job.shotId === shotId).length;
  const takeCount = Math.max(1, Math.min(options.takeCount || 3, 3));
  const tier = options.tier || shot.requirements.tier || "fast";
  const shouldFailShot = existingAttempts === 0 && (shot.order === 4 || shot.order === 8);
  const takes: Take[] = [];
  const jobs: GenerationJob[] = [];

  applyReferenceRequirements(current, shot);
  shot.status = "generating";
  shot.requirements.tier = tier;
  shot.qualityFlags = [];

  for (let index = 0; index < takeCount; index += 1) {
    const promptPackage = buildGenerationPromptPackage(current, shot);
    const routing = chooseProviderRoute(shot, promptPackage, index);
    const take = makeTake(current, shot, tier, index, `${routing.selected.provider}:${routing.selected.model}`);
    const job = makeGenerationJob(current, shot, take, shouldFailShot, promptPackage, routing);
    takes.push(take);
    jobs.push(job);
  }
  current.credits.reserved += takeCount * 6;
  refreshProject(current, shot.projectId);
  write(current);
  return { takes, jobs };
}

export function generateAll(projectId: string, options: { tier?: Tier } = {}) {
  const queued: GenerationJob[] = [];
  const shots = state().shots.filter((shot) => shot.projectId === projectId);
  for (const shot of shots) {
    if (shot.status === "pending" || shot.status === "failed") {
      queued.push(...generateShot(shot.id, { tier: options.tier || "fast", takeCount: 3 }).jobs);
    }
  }
  return { jobs: queued };
}

export function selectTake(shotId: string, takeId: string) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  const take = current.takes.find((item) => item.id === takeId);
  if (!shot || !take || take.status !== "done") throw new Error("Selectable take not found");
  shot.selectedTakeId = take.id;
  shot.status = "selected";
  refreshProject(current, shot.projectId);
  write(current);
  return shot;
}

export function regenerate(shotId: string, options: { scope: "shot" | "segment"; tweaks?: string }) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  if (!shot) throw new Error("Shot not found");
  shot.qualityFlags = [
    {
      axis: "completeness",
      score: 3,
      hint:
        options.scope === "segment"
          ? "가능한 가장 좁은 범위로 다시 시도합니다. 이전 후보는 보존됩니다."
          : "이 컷만 다시 생성합니다. 이전 후보는 보존됩니다."
    }
  ];
  write(current);
  return generateShot(shotId, { tier: shot.requirements.tier, takeCount: 2 });
}

export function upgradeTake(takeId: string, options: { mode?: "final_regenerate" | "enhance" | "render_upscale" } = {}) {
  const current = state();
  const source = current.takes.find((item) => item.id === takeId);
  if (!source || source.status !== "done") throw new Error("Done take not found");
  const shot = current.shots.find((item) => item.id === source.shotId);
  if (!shot) throw new Error("Source shot not found");
  applyReferenceRequirements(current, shot);
  shot.requirements.tier = "final";
  const promptPackage = buildGenerationPromptPackage(current, shot);
  const routing = chooseProviderRoute(shot, promptPackage, 0);
  const take = makeTake(current, shot, "final", current.takes.filter((item) => item.shotId === shot.id).length, `${routing.selected.provider}:${routing.selected.model}`);
  take.label = "게시용";
  take.upgradeSourceTakeId = source.id;
  take.upgradeMode = options.mode || "final_regenerate";
  const job = makeGenerationJob(current, shot, take, false, promptPackage, routing);
  shot.status = "generating";
  current.credits.reserved += 22;
  refreshProject(current, shot.projectId);
  write(current);
  return { take, job };
}

export function applyEdit(projectId: string, command?: string) {
  const current = state();
  const edit = current.editState[projectId] || defaultEditState(projectId);
  if (command) edit.commands.push({ command, createdAt: now() });
  current.editState[projectId] = edit;
  const project = current.projects.find((item) => item.id === projectId);
  if (project) project.status = "edited";
  write(current);
  return edit;
}

export function setAudio(projectId: string, patch: Partial<EditState>) {
  const current = state();
  current.editState[projectId] = { ...(current.editState[projectId] || defaultEditState(projectId)), ...patch };
  write(current);
  return current.editState[projectId];
}

function bestDoneTake(current: StudioState, shot: Shot) {
  return current.takes
    .filter((take) => take.shotId === shot.id && take.status === "done")
    .sort((a, b) => (b.metrics.overall || 0) - (a.metrics.overall || 0))[0] || null;
}

function selectedOrBestTake(current: StudioState, shot: Shot) {
  return current.takes.find((take) => take.id === shot.selectedTakeId && take.shotId === shot.id) || bestDoneTake(current, shot);
}

function buildRenderRightsReview(current: StudioState, projectId: string): RenderRightsReview {
  const selectedShots = current.shots.filter((shot) => shot.projectId === projectId && selectedOrBestTake(current, shot));
  const items = new Map<string, RenderRightsReview["items"][number]>();
  for (const shot of selectedShots) {
    for (const assetId of shot.referenceImageIds) {
      const asset = current.imageAssets.find((item) => item.id === assetId && item.projectId === projectId);
      if (!asset || asset.rights.status !== "needs_review") continue;
      const item = items.get(asset.id) || {
        assetId: asset.id,
        label: asset.label,
        role: asset.role,
        rightsStatus: asset.rights.status,
        note: asset.rights.note,
        targetShotIds: []
      };
      if (!item.targetShotIds.includes(shot.id)) item.targetShotIds.push(shot.id);
      items.set(asset.id, item);
    }
  }
  const list = [...items.values()];
  return {
    required: list.length > 0,
    assetIds: list.map((item) => item.assetId),
    items: list
  };
}

function cloneEditState(edit: EditState): EditState {
  return {
    projectId: edit.projectId,
    captions: { ...edit.captions },
    bgm: { ...edit.bgm },
    voiceover: { ...edit.voiceover },
    transitions: edit.transitions,
    commands: edit.commands.map((command) => ({ ...command }))
  };
}

function buildRenderPlan(current: StudioState, projectId: string, spec: ExportSpec): RenderPlan {
  const shots = current.shots.filter((shot) => shot.projectId === projectId).sort((a, b) => a.order - b.order);
  const planShots: RenderPlan["shots"] = [];
  const missingShotIds: string[] = [];
  for (const shot of shots) {
    const take = selectedOrBestTake(current, shot);
    if (!take) {
      missingShotIds.push(shot.id);
      continue;
    }
    planShots.push({
      shotId: shot.id,
      takeId: take.id,
      order: shot.order,
      title: shot.title,
      durationSec: take.durationSec,
      videoUrl: take.videoUrl,
      posterUrl: take.posterUrl,
      tier: take.tier
    });
  }
  return {
    projectId,
    spec,
    totalDurationSec: planShots.reduce((total, shot) => total + shot.durationSec, 0),
    missingShotIds,
    shots: planShots,
    edit: cloneEditState(current.editState[projectId] || defaultEditState(projectId))
  };
}

export function previewRender(projectId: string, spec: ExportSpec): RenderPreview {
  const current = tickJobs();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");
  return {
    projectId,
    spec,
    rightsReview: buildRenderRightsReview(current, projectId),
    renderPlan: buildRenderPlan(current, projectId, spec),
    estimate: estimateCost("startRender")
  };
}

export function startRender(projectId: string, specs: ExportSpec[]) {
  const current = state();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");
  const activeSpecs = new Set(
    current.renderJobs
      .filter((job) => job.projectId === projectId && (job.status === "queued" || job.status === "running"))
      .map((job) => `${job.spec.resolution}:${job.spec.cut}:${job.spec.aspect}:${job.spec.caption}`)
  );
  const nextSpecs = specs.filter((spec) => !activeSpecs.has(`${spec.resolution}:${spec.cut}:${spec.aspect}:${spec.caption}`));
  if (!nextSpecs.length) throw new Error("이미 같은 내보내기 작업이 진행 중입니다.");
  const shots = current.shots.filter((shot) => shot.projectId === projectId);
  for (const shot of shots) {
    if (!shot.selectedTakeId) {
      const best = bestDoneTake(current, shot);
      if (best) shot.selectedTakeId = best.id;
    }
  }
  const rightsReview = buildRenderRightsReview(current, projectId);
  const renderPlans = new Map(nextSpecs.map((spec) => [`${spec.resolution}:${spec.cut}:${spec.aspect}:${spec.caption}`, buildRenderPlan(current, projectId, spec)]));
  const jobs: RenderJob[] = nextSpecs.map((spec, index) => ({
    id: uid("rnd"),
    projectId,
    spec,
    stage: "assemble",
    progress: 0,
    status: "queued",
    outputUrl: null,
    shareUrl: null,
    etaSec: 90 - index * 14,
    dueAt: Date.now() + 4200 + index * 1200,
    createdAt: now(),
    updatedAt: now(),
    error: null,
    rightsReview,
    renderPlan: renderPlans.get(`${spec.resolution}:${spec.cut}:${spec.aspect}:${spec.caption}`) || buildRenderPlan(current, projectId, spec)
  }));
  current.renderJobs.push(...jobs);
  project.status = "rendering";
  current.credits.reserved += jobs.length * 16;
  write(current);
  return { jobs };
}

export function forceDueJobs(kind: "generationJobs" | "renderJobs" | "imageJobs") {
  const current = state();
  for (const job of current[kind]) {
    if (job.status !== "done" && job.status !== "failed") {
      job.dueAt = Date.now() - 1;
    }
  }
  write(current);
}

export function tickJobs() {
  const current = state();
  const timestamp = Date.now();

  for (const job of current.imageJobs) {
    if (job.status === "done" || job.status === "failed" || job.status === "cancelled") continue;
    const elapsed = Math.max(0, timestamp - (job.dueAt - 3600));
    job.progress = Math.min(0.96, elapsed / 3600);
    job.status = job.progress > 0.12 ? "running" : "queued";
    job.stage = job.progress > 0.64 ? "saving" : job.progress > 0.28 ? "generating" : job.progress > 0.12 ? "prompting" : "queued";
    job.etaSec = Math.max(0, Math.ceil((job.dueAt - timestamp) / 1000));
    job.updatedAt = now();
    job.variants = job.variants.map((variant) => ({
      ...variant,
      status: job.status,
      url: variant.url || (job.progress > 0.42 ? `mock://image-preview/${variant.id}.png` : null),
      thumbUrl: variant.thumbUrl || (job.progress > 0.42 ? `mock://image-preview/${variant.id}.jpg` : null)
    }));

    if (timestamp >= job.dueAt) {
      job.status = "done";
      job.progress = 1;
      job.stage = "done";
      job.etaSec = 0;
      job.variants = job.variants.map((variant, index) => {
        if (variant.assetId) return { ...variant, status: "done" };
        const asset = makeImageAsset(current, {
          projectId: job.projectId,
          role: job.role,
          source: "image_maker",
          label: `${job.purpose} ${variant.label}`,
          prompt: `${job.prompt} / ${job.style}`,
          aspect: job.aspect,
          rights: {
            status: "generated",
            note: "Image Maker에서 생성된 이미지입니다."
          }
        });
        return {
          ...variant,
          assetId: asset.id,
          status: "done",
          url: asset.url,
          thumbUrl: asset.thumbUrl,
          scoreLabel: index === 0 ? "추천" : variant.scoreLabel
        };
      });
      current.credits.reserved = Math.max(0, current.credits.reserved - job.count * 4);
      current.credits.spent += job.count * 4;
    }
  }

  for (const job of current.generationJobs) {
    if (job.status === "done" || job.status === "failed" || job.status === "cancelled") continue;
    const elapsed = Math.max(0, timestamp - (job.dueAt - 3200));
    job.progress = Math.min(0.96, elapsed / 3200);
    job.status = job.progress > 0.15 ? "running" : "queued";
    job.stage = job.status === "running" ? "provider_generation" : "queued";
    job.etaSec = Math.max(0, Math.ceil((job.dueAt - timestamp) / 1000));
    job.updatedAt = now();

    if (timestamp >= job.dueAt) {
      const take = current.takes.find((item) => item.id === job.takeId);
      const shot = current.shots.find((item) => item.id === job.shotId);
      if (job.shouldFail) {
        job.status = "failed";
        job.progress = 1;
        job.stage = "failed";
        job.error = {
          code: "MOCK_PROVIDER_FAILED",
          userMessage: "이 컷은 다른 방식으로 다시 시도할 수 있습니다.",
          retryable: true,
          fallbackSuggested: true
        };
        if (take) failTake(take);
        if (shot) {
          shot.status = "failed";
          shot.qualityFlags = [
            {
              axis: "motion",
              score: 2,
              hint: "생성 실패. 이 컷만 다시 시도해도 이전 후보와 다른 컷은 보존됩니다."
            }
          ];
        }
      } else {
        job.status = "done";
        job.progress = 1;
        job.stage = "done";
        if (take && shot) completeTake(take, shot);
        if (shot) {
          const doneTakes = current.takes.filter((item) => item.shotId === shot.id && item.status === "done");
          shot.status = "reviewing";
          if (!shot.selectedTakeId && doneTakes.length) {
            shot.selectedTakeId = doneTakes.sort((a, b) => (b.metrics.overall || 0) - (a.metrics.overall || 0))[0].id;
          }
          if (shot.order === 4 || shot.order === 8) {
            shot.qualityFlags = [
              {
                axis: "motion",
                score: 2,
                hint: "모션 흔들림이 의심됩니다. 이 컷만 다시 시도할 수 있습니다."
              }
            ];
          }
        }
        current.credits.reserved = Math.max(0, current.credits.reserved - 6);
        current.credits.spent += 6;
      }
      if (shot) refreshProject(current, shot.projectId);
    }
  }

  for (const job of current.renderJobs) {
    if (job.status === "done" || job.status === "failed" || job.status === "cancelled") continue;
    const elapsed = Math.max(0, timestamp - (job.dueAt - 5000));
    job.progress = Math.min(0.96, elapsed / 5000);
    job.status = job.progress > 0.12 ? "running" : "queued";
    job.stage = job.progress > 0.72 ? "encode" : job.progress > 0.48 ? "caption_burn" : job.progress > 0.28 ? "audio_mix" : "assemble";
    job.etaSec = Math.max(0, Math.ceil((job.dueAt - timestamp) / 1000));
    job.updatedAt = now();

    if (timestamp >= job.dueAt) {
      job.status = "done";
      job.progress = 1;
      job.stage = "done";
      job.outputUrl = `mock://render/${job.id}.mp4`;
      job.shareUrl = `mock://share/${job.id}`;
      current.credits.reserved = Math.max(0, current.credits.reserved - 16);
      current.credits.spent += 16;
      const project = current.projects.find((item) => item.id === job.projectId);
      if (project && current.renderJobs.filter((item) => item.projectId === project.id).every((item) => item.status === "done")) {
        project.status = "done";
        project.thumbUrl = `mock://poster/${job.id}.jpg`;
      }
    }
  }

  write(current);
  return current;
}

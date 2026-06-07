import { createHash } from "node:crypto";
import { INTENT_TEMPLATES } from "../domain/templates";
import { fileBackedMockStateStore } from "./mock-state-store";
import { chooseProviderRoute } from "./provider-routing";
import type {
  Aspect,
  AssetDeleteResult,
  AssetUsage,
  AssetUsageMode,
  CancelJobResult,
  CostEstimate,
  CreditTransaction,
  EditState,
  ErrorResponse,
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
  MediaArtifact,
  Project,
  ProjectBundle,
  ProviderAttempt,
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
  Tier,
  WorkerLease,
  WorkerLeaseCompletionInput
} from "../domain/types";

function now() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

const PLAYABLE_MOCK_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const MARGIN_POLICY_VERSION = "sandbox-v1";

export class CreditReservationError extends Error {
  estimate: CostEstimate;

  constructor(credits: number, availableCredits: number) {
    super("INSUFFICIENT_CREDITS");
    this.name = "CreditReservationError";
    this.estimate = {
      credits,
      etaSec: 0,
      availableCredits,
      affordable: false,
      shortfallCredits: Math.max(0, credits - availableCredits)
    };
  }
}

export function isCreditReservationError(error: unknown): error is CreditReservationError {
  return error instanceof CreditReservationError;
}

function mockVideoUrl(id: string) {
  return `${PLAYABLE_MOCK_VIDEO_URL}#${encodeURIComponent(id)}`;
}

function mockShareUrl(id: string) {
  return `https://cutpilot.local/share/${encodeURIComponent(id)}`;
}

function svgText(input: string) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function mockPosterUrl(id: string, label: string) {
  const hue = [...id].reduce((total, char) => total + char.charCodeAt(0), 0) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="hsl(${hue},70%,26%)"/><stop offset="1" stop-color="hsl(${(hue + 80) % 360},70%,44%)"/></linearGradient></defs><rect width="1080" height="1920" fill="url(#g)"/><circle cx="810" cy="420" r="220" fill="rgba(255,255,255,.14)"/><rect x="104" y="1230" width="872" height="264" rx="36" fill="rgba(0,0,0,.34)"/><text x="140" y="1340" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="white">Cutpilot preview</text><text x="140" y="1438" font-family="Arial, sans-serif" font-size="34" fill="rgba(255,255,255,.82)">${svgText(label)}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function blankState(): StudioState {
  return {
    version: 1,
    credits: { balance: 1240, spent: 0, reserved: 0 },
    creditTransactions: [],
    mediaArtifacts: [],
    storageCleanupRecords: [],
    projects: [],
    scenes: [],
    shots: [],
    takes: [],
    generationJobs: [],
    renderJobs: [],
    imageAssets: [],
    imageJobs: [],
    workerLeases: [],
    workerRetryRecords: [],
    referenceBoards: {},
    editState: {},
    updatedAt: now()
  };
}

function makeProviderAttempt(target: ProviderRoutingDecision["selected"], startedAt = now()): ProviderAttempt {
  return {
    id: uid("pat"),
    provider: target.provider,
    model: target.model,
    requestId: null,
    status: "queued",
    startedAt,
    completedAt: null,
    latencyMs: null,
    errorCode: null,
    retryable: false,
    fallbackSuggested: false
  };
}

function primaryProviderAttempt(job: GenerationJob) {
  if (!job.providerAttempts.length) {
    job.providerAttempts.push(makeProviderAttempt(job.routing.selected, job.createdAt));
  }
  return job.providerAttempts[0];
}

function markProviderAttemptPolling(job: GenerationJob) {
  const attempt = primaryProviderAttempt(job);
  if (!attempt.requestId) attempt.requestId = `mock_${job.id}`;
  if (attempt.status === "queued" || attempt.status === "submitted") {
    attempt.status = job.status === "running" ? "polling" : "submitted";
  }
}

function finishProviderAttempt(job: GenerationJob, status: "succeeded" | "failed", error: ErrorResponse | null = null, completedAt = Date.now()) {
  const attempt = primaryProviderAttempt(job);
  if (!attempt.requestId) attempt.requestId = `mock_${job.id}`;
  attempt.status = status;
  attempt.completedAt = new Date(completedAt).toISOString();
  attempt.latencyMs = Math.max(0, completedAt - new Date(attempt.startedAt).getTime());
  attempt.errorCode = error?.code || null;
  attempt.retryable = Boolean(error?.retryable);
  attempt.fallbackSuggested = Boolean(error?.fallbackSuggested);
}

function cancelProviderAttempt(job: GenerationJob, completedAt = Date.now()) {
  const attempt = primaryProviderAttempt(job);
  if (!attempt.requestId) attempt.requestId = `mock_${job.id}`;
  attempt.status = "cancelled";
  attempt.completedAt = new Date(completedAt).toISOString();
  attempt.latencyMs = Math.max(0, completedAt - new Date(attempt.startedAt).getTime());
  attempt.errorCode = "JOB_CANCELLED";
  attempt.retryable = false;
  attempt.fallbackSuggested = false;
}

function cancelledError(): ErrorResponse {
  return {
    code: "JOB_CANCELLED",
    userMessage: "작업이 취소되었습니다.",
    retryable: false,
    fallbackSuggested: false
  };
}

function isActiveJob(status: JobStatus) {
  return status === "queued" || status === "running";
}

function artifactStorageKey(input: Pick<MediaArtifact, "projectId" | "ownerType" | "ownerId" | "role">) {
  return `projects/${input.projectId}/${input.ownerType}/${input.ownerId}/${input.role}`;
}

function recordMediaArtifact(
  current: StudioState,
  input: Omit<MediaArtifact, "id" | "storageKey" | "createdAt">
) {
  const existing = current.mediaArtifacts.find(
    (artifact) => artifact.ownerType === input.ownerType && artifact.ownerId === input.ownerId && artifact.role === input.role
  );
  if (existing) {
    existing.url = input.url;
    existing.sourceJobId = input.sourceJobId || existing.sourceJobId;
    existing.contentType = input.contentType;
    existing.bytes = input.bytes;
    existing.status = input.status;
    return existing;
  }
  const artifact: MediaArtifact = {
    id: uid("art"),
    ...input,
    storageKey: artifactStorageKey(input),
    createdAt: now()
  };
  current.mediaArtifacts.push(artifact);
  return artifact;
}

function recordImageAssetArtifacts(current: StudioState, asset: ImageAsset, sourceJobId: string | null = null) {
  const status = asset.source === "external" ? "external" : "stored";
  recordMediaArtifact(current, {
    projectId: asset.projectId,
    ownerType: "imageAsset",
    ownerId: asset.id,
    sourceJobId,
    kind: "image",
    role: "image_asset",
    url: asset.url,
    contentType: "image/png",
    bytes: null,
    status
  });
  recordMediaArtifact(current, {
    projectId: asset.projectId,
    ownerType: "imageAsset",
    ownerId: asset.id,
    sourceJobId,
    kind: "image",
    role: "image_thumbnail",
    url: asset.thumbUrl,
    contentType: "image/jpeg",
    bytes: null,
    status: "stored"
  });
}

function recordTakeArtifacts(current: StudioState, take: Take, sourceJobId: string) {
  if (take.videoUrl) {
    recordMediaArtifact(current, {
      projectId: take.projectId,
      ownerType: "take",
      ownerId: take.id,
      sourceJobId,
      kind: "video",
      role: "take_video",
      url: take.videoUrl,
      contentType: "video/mp4",
      bytes: null,
      status: "stored"
    });
  }
  if (take.posterUrl) {
    recordMediaArtifact(current, {
      projectId: take.projectId,
      ownerType: "take",
      ownerId: take.id,
      sourceJobId,
      kind: "image",
      role: "take_poster",
      url: take.posterUrl,
      contentType: "image/svg+xml",
      bytes: null,
      status: "stored"
    });
  }
}

function recordRenderArtifact(current: StudioState, job: RenderJob) {
  if (!job.outputUrl) return;
  recordMediaArtifact(current, {
    projectId: job.projectId,
    ownerType: "renderJob",
    ownerId: job.id,
    sourceJobId: job.id,
    kind: "video",
    role: "render_output",
    url: job.outputUrl,
    contentType: "video/mp4",
    bytes: null,
    status: "stored"
  });
}

function backfillMediaArtifacts(current: StudioState) {
  for (const asset of current.imageAssets) recordImageAssetArtifacts(current, asset);
  for (const take of current.takes) {
    if (take.status === "done") {
      const sourceJob = current.generationJobs.find((job) => job.takeId === take.id);
      recordTakeArtifacts(current, take, sourceJob?.id || take.id);
    }
  }
  for (const job of current.renderJobs) {
    if (job.status === "done") recordRenderArtifact(current, job);
  }
}

function normalizeState(current: StudioState): StudioState {
  const next = current as StudioState &
    Partial<
      Pick<
        StudioState,
        "creditTransactions" | "mediaArtifacts" | "storageCleanupRecords" | "imageAssets" | "imageJobs" | "workerLeases" | "workerRetryRecords" | "referenceBoards"
      >
    >;
  if (!Array.isArray(next.creditTransactions)) next.creditTransactions = [];
  if (!Array.isArray(next.mediaArtifacts)) next.mediaArtifacts = [];
  if (!Array.isArray(next.storageCleanupRecords)) next.storageCleanupRecords = [];
  if (!Array.isArray(next.imageAssets)) next.imageAssets = [];
  if (!Array.isArray(next.imageJobs)) next.imageJobs = [];
  if (!Array.isArray(next.workerLeases)) next.workerLeases = [];
  if (!Array.isArray(next.workerRetryRecords)) next.workerRetryRecords = [];
  if (!next.referenceBoards) next.referenceBoards = {};

  for (const transaction of next.creditTransactions) {
    const mutableTransaction = transaction as CreditTransaction & Partial<Pick<CreditTransaction, "providerCostUsd" | "marginPolicyVersion">>;
    if (typeof mutableTransaction.providerCostUsd === "undefined") {
      mutableTransaction.providerCostUsd = mockProviderCostUsd(transaction.kind, transaction.credits);
    }
    if (!mutableTransaction.marginPolicyVersion) mutableTransaction.marginPolicyVersion = MARGIN_POLICY_VERSION;
  }

  for (const project of next.projects) {
    const mutableProject = project as Project & { defaultRenderJobId: string | null | undefined };
    if (typeof mutableProject.defaultRenderJobId === "undefined") mutableProject.defaultRenderJobId = null;
    if (mutableProject.defaultRenderJobId && !next.renderJobs.some((job) => job.id === mutableProject.defaultRenderJobId && job.projectId === project.id)) {
      mutableProject.defaultRenderJobId = null;
    }
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
    if (typeof mutableJob.retryOfJobId === "undefined") mutableJob.retryOfJobId = null;
    if (shot && !mutableJob.promptPackage) mutableJob.promptPackage = buildGenerationPromptPackage(next as StudioState, shot);
    if (shot && mutableJob.promptPackage && typeof mutableJob.promptPackage.durationSec !== "number") {
      mutableJob.promptPackage.durationSec = shot.durationSec;
    }
    if (shot && mutableJob.promptPackage && !mutableJob.routing) {
      mutableJob.routing = chooseProviderRoute(shot, mutableJob.promptPackage, 0);
    }
    if (!Array.isArray(mutableJob.providerAttempts)) {
      mutableJob.providerAttempts = mutableJob.routing ? [makeProviderAttempt(mutableJob.routing.selected, job.createdAt)] : [];
    }
    if (mutableJob.routing) {
      const attempt = primaryProviderAttempt(mutableJob as GenerationJob);
      if (job.status === "done" && attempt.status !== "succeeded") finishProviderAttempt(job, "succeeded", null, new Date(job.updatedAt).getTime());
      if (job.status === "failed" && attempt.status !== "failed") finishProviderAttempt(job, "failed", job.error, new Date(job.updatedAt).getTime());
    }
  }

  for (const job of next.imageJobs) {
    const mutableJob = job as ImageJob & Partial<ImageJob>;
    if (typeof mutableJob.retryOfJobId === "undefined") mutableJob.retryOfJobId = null;
  }

  for (const job of next.renderJobs) {
    const mutableJob = job as RenderJob & Partial<RenderJob>;
    if (typeof mutableJob.retryOfJobId === "undefined") mutableJob.retryOfJobId = null;
    if (!mutableJob.rightsReview) mutableJob.rightsReview = defaultRenderRightsReview();
    if (!mutableJob.renderPlan || !(mutableJob.renderPlan as Partial<RenderPlan>).sourceHash) mutableJob.renderPlan = buildRenderPlan(next as StudioState, job.projectId, job.spec);
  }

  backfillMediaArtifacts(next as StudioState);
  return next as StudioState;
}

function state(): StudioState {
  let current = fileBackedMockStateStore.readMemory();
  if (!current) {
    current = fileBackedMockStateStore.loadPersisted() || blankState();
  }
  current = normalizeState(current);
  fileBackedMockStateStore.writeMemory(current);
  return current;
}

function write(nextState = state()) {
  nextState.updatedAt = now();
  fileBackedMockStateStore.writeMemory(nextState);
  fileBackedMockStateStore.persist(nextState);
  return nextState;
}

export function resetMockState() {
  const nextState = blankState();
  fileBackedMockStateStore.writeMemory(nextState);
  return write(nextState);
}

export function reloadMockStateFromDisk() {
  fileBackedMockStateStore.writeMemory(undefined);
  return state();
}

export function getMockState() {
  return tickJobs();
}

export function getMutableMockState() {
  return state();
}

export function saveMockState(nextState = state()) {
  return write(nextState);
}

function availableCredits(current: StudioState) {
  return Math.max(0, current.credits.balance - current.credits.spent - current.credits.reserved);
}

function assertCanReserveCredits(current: StudioState, credits: number) {
  const available = availableCredits(current);
  if (available < credits) throw new CreditReservationError(credits, available);
}

function mockProviderCostUsd(kind: CreditTransaction["kind"], credits: number) {
  if (kind !== "capture") return null;
  return Number((credits * 0.035).toFixed(2));
}

function addCreditTransaction(
  current: StudioState,
  input: Omit<CreditTransaction, "id" | "providerCostUsd" | "marginPolicyVersion" | "balanceAfter" | "createdAt">
) {
  const transaction: CreditTransaction = {
    id: uid("ctx"),
    ...input,
    providerCostUsd: mockProviderCostUsd(input.kind, input.credits),
    marginPolicyVersion: MARGIN_POLICY_VERSION,
    balanceAfter: {
      spent: current.credits.spent,
      reserved: current.credits.reserved,
      available: availableCredits(current)
    },
    createdAt: now()
  };
  current.creditTransactions.push(transaction);
  return transaction;
}

function reserveCredits(current: StudioState, input: { projectId: string; jobId: string | null; action: CreditTransaction["action"]; credits: number; note: string }) {
  assertCanReserveCredits(current, input.credits);
  current.credits.reserved += input.credits;
  return addCreditTransaction(current, { ...input, kind: "reserve" });
}

function captureReservedCredits(current: StudioState, input: { projectId: string; jobId: string | null; action: CreditTransaction["action"]; credits: number; note: string }) {
  current.credits.reserved = Math.max(0, current.credits.reserved - input.credits);
  current.credits.spent += input.credits;
  return addCreditTransaction(current, { ...input, kind: "capture" });
}

function refundReservedCredits(current: StudioState, input: { projectId: string; jobId: string | null; action: CreditTransaction["action"]; credits: number; note: string }) {
  current.credits.reserved = Math.max(0, current.credits.reserved - input.credits);
  return addCreditTransaction(current, { ...input, kind: "refund" });
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

function buildStoryboard(project: Pick<Project, "id" | "title" | "intent" | "aspect"> & { tier: Tier }, idea: string) {
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
        tier: project.tier,
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
    defaultRenderJobId: null,
    credits: { spent: current.credits.spent, estimateRemaining: 180 },
    createdAt: now(),
    updatedAt: now()
  };
  const storyboard = buildStoryboard({ ...project, tier: input.advanced?.tier || template.defaults.tier }, idea);
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
      aspect: template.defaults.aspect,
      tier: template.defaults.tier
    },
    input.idea
  );
}

type StoryboardScenePatch = Partial<Scene> & { id?: string };
type StoryboardShotPatch = Omit<Partial<Shot>, "saec" | "requirements" | "directionSpec"> & {
  id?: string;
  saec?: Partial<Shot["saec"]>;
  requirements?: Partial<Shot["requirements"]>;
  directionSpec?: Partial<Shot["directionSpec"]>;
};

export function updateStoryboard(projectId: string, input: { scenes?: StoryboardScenePatch[]; shots?: StoryboardShotPatch[] }): ProjectBundle | null {
  const current = state();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");

  for (const patch of input.scenes || []) {
    if (!patch.id) continue;
    const scene = current.scenes.find((item) => item.id === patch.id && item.projectId === projectId);
    if (!scene) continue;
    if (typeof patch.order === "number") scene.order = patch.order;
    if (typeof patch.title === "string" && patch.title.trim()) scene.title = patch.title.trim();
    if (typeof patch.setting === "string") scene.setting = patch.setting;
    if (typeof patch.timeOfDay === "string") scene.timeOfDay = patch.timeOfDay;
  }

  for (const patch of input.shots || []) {
    if (!patch.id) continue;
    const shot = current.shots.find((item) => item.id === patch.id && item.projectId === projectId);
    if (!shot) continue;
    const before = JSON.stringify({
      sceneId: shot.sceneId,
      order: shot.order,
      title: shot.title,
      durationSec: shot.durationSec,
      saec: shot.saec,
      requirements: shot.requirements,
      directionSpec: shot.directionSpec
    });

    if (typeof patch.order === "number") shot.order = patch.order;
    if (typeof patch.sceneId === "string" && current.scenes.some((scene) => scene.id === patch.sceneId && scene.projectId === projectId)) shot.sceneId = patch.sceneId;
    if (typeof patch.title === "string" && patch.title.trim()) shot.title = patch.title.trim();
    if (typeof patch.durationSec === "number") shot.durationSec = Math.max(1, Math.min(16, patch.durationSec));
    if (patch.saec) shot.saec = { ...shot.saec, ...patch.saec };
    if (patch.requirements) shot.requirements = { ...shot.requirements, ...patch.requirements };
    if (patch.directionSpec) {
      shot.directionSpec = {
        ...shot.directionSpec,
        ...patch.directionSpec,
        avoid: patch.directionSpec.avoid ? patch.directionSpec.avoid.map((item) => item.trim()).filter(Boolean) : shot.directionSpec.avoid
      };
    }

    const after = JSON.stringify({
      sceneId: shot.sceneId,
      order: shot.order,
      title: shot.title,
      durationSec: shot.durationSec,
      saec: shot.saec,
      requirements: shot.requirements,
      directionSpec: shot.directionSpec
    });
    if (before !== after) {
      shot.selectedTakeId = null;
      shot.qualityFlags = [];
      if (shot.status === "selected" || shot.status === "reviewing" || shot.status === "failed") shot.status = "pending";
    }
  }

  refreshProject(current, projectId);
  write(current);
  return getProjectBundle(projectId);
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
    credits: current.credits,
    creditTransactions: current.creditTransactions.filter((transaction) => transaction.projectId === project.id),
    mediaArtifacts: current.mediaArtifacts.filter((artifact) => artifact.projectId === project.id),
    renderSourceHash: buildRenderSourceHash(current, project.id)
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
  const credits = Math.ceil((table[action] || 10) * (params?.takeCount || 1));
  const available = availableCredits(state());
  return {
    credits,
    etaSec: action === "startRender" ? 90 : 25,
    availableCredits: available,
    affordable: available >= credits,
    shortfallCredits: Math.max(0, credits - available)
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
    durationSec: shot.durationSec,
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
    thumbUrl?: string;
    aspect: Aspect;
    rights: ImageAsset["rights"];
    sourceJobId?: string | null;
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
    thumbUrl: input.thumbUrl || `mock://thumb/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}.jpg`,
    aspect: input.aspect,
    width: size.width,
    height: size.height,
    rights: input.rights,
    createdAt: now(),
    updatedAt: now()
  };
  current.imageAssets.unshift(asset);
  addAssetToBoard(current, asset);
  recordImageAssetArtifacts(current, asset, input.sourceJobId || null);
  return asset;
}

export function listImageAssets(projectId: string) {
  const current = tickJobs();
  if (!current.projects.some((project) => project.id === projectId)) throw new Error("Project not found");
  return current.imageAssets.filter((asset) => asset.projectId === projectId);
}

export function createImageJob(input: {
  projectId: string;
  prompt: string;
  purpose: ImageMakerPurpose;
  role: ImageAssetRole;
  aspect: Aspect;
  style?: string;
  count?: number;
  retryOfJobId?: string | null;
}) {
  const current = state();
  const project = current.projects.find((item) => item.id === input.projectId);
  const prompt = input.prompt.trim();
  if (!project) throw new Error("Project not found");
  if (!prompt) throw new Error("이미지 아이디어를 입력해 주세요.");
  const count = Math.max(1, Math.min(input.count || 4, 4));
  assertCanReserveCredits(current, count * 4);
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
    retryOfJobId: input.retryOfJobId || null,
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
  reserveCredits(current, { projectId: project.id, jobId: job.id, action: "generateImages", credits: count * 4, note: "Image Maker variants reserved" });
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
  current.mediaArtifacts = current.mediaArtifacts.filter((artifact) => !(artifact.ownerType === "imageAsset" && artifact.ownerId === assetId));
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
  routing: ProviderRoutingDecision,
  retryOfJobId: string | null = null
) {
  const createdAt = now();
  const job: GenerationJob = {
    id: uid("gen"),
    shotId: shot.id,
    takeId: take.id,
    projectId: shot.projectId,
    retryOfJobId,
    status: "queued",
    progress: 0,
    etaSec: 6,
    stage: "queued",
    shouldFail,
    dueAt: Date.now() + 2500 + (shot.order % 4) * 650,
    createdAt,
    updatedAt: createdAt,
    error: null,
    promptPackage,
    routing,
    providerAttempts: [makeProviderAttempt(routing.selected, createdAt)]
  };
  current.generationJobs.push(job);
  return job;
}

function completeTake(current: StudioState, take: Take, shot: Shot, sourceJobId: string, output?: WorkerLeaseCompletionInput["outputs"]) {
  take.status = "done";
  take.videoUrl = output?.videoUrl || mockVideoUrl(take.id);
  take.posterUrl = output?.posterUrl || mockPosterUrl(take.id, `Shot ${shot.order + 1} option ${take.label}`);
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
  recordTakeArtifacts(current, take, sourceJobId);
}

function failTake(take: Take) {
  take.status = "failed";
  take.videoUrl = null;
  take.posterUrl = null;
  take.metrics = {};
}

export function generateShot(shotId: string, options: { tier?: Tier; takeCount?: number; retryOfJobId?: string | null } = {}) {
  const current = state();
  const shot = current.shots.find((item) => item.id === shotId);
  if (!shot) throw new Error("Shot not found");
  const existingAttempts = current.generationJobs.filter((job) => job.shotId === shotId).length;
  const takeCount = Math.max(1, Math.min(options.takeCount || 3, 3));
  const tier = options.tier || shot.requirements.tier || "fast";
  const shouldFailShot = existingAttempts === 0 && (shot.order === 4 || shot.order === 8);
  const takes: Take[] = [];
  const jobs: GenerationJob[] = [];

  assertCanReserveCredits(current, takeCount * 6);
  applyReferenceRequirements(current, shot);
  shot.status = "generating";
  shot.requirements.tier = tier;
  shot.qualityFlags = [];

  for (let index = 0; index < takeCount; index += 1) {
    const promptPackage = buildGenerationPromptPackage(current, shot);
    const routing = chooseProviderRoute(shot, promptPackage, index);
    const take = makeTake(current, shot, tier, index, `${routing.selected.provider}:${routing.selected.model}`);
    const job = makeGenerationJob(current, shot, take, shouldFailShot, promptPackage, routing, options.retryOfJobId || null);
    takes.push(take);
    jobs.push(job);
    reserveCredits(current, { projectId: shot.projectId, jobId: job.id, action: "generateShot", credits: 6, note: "Video take generation reserved" });
  }
  refreshProject(current, shot.projectId);
  write(current);
  return { takes, jobs };
}

export function generateAll(projectId: string, options: { tier?: Tier } = {}) {
  const queued: GenerationJob[] = [];
  const current = state();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");
  const shots = current.shots.filter((shot) => shot.projectId === projectId);
  const targetShots = shots.filter((shot) => shot.status === "pending" || shot.status === "failed");
  assertCanReserveCredits(current, targetShots.length * 18);
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
  assertCanReserveCredits(current, 12);
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
  assertCanReserveCredits(current, 22);
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
  reserveCredits(current, { projectId: shot.projectId, jobId: job.id, action: "upgradeTake", credits: 22, note: "Publishing quality upgrade reserved" });
  refreshProject(current, shot.projectId);
  write(current);
  return { take, job };
}

export function applyEdit(projectId: string, command?: string) {
  const current = state();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");
  const edit = current.editState[projectId] || defaultEditState(projectId);
  if (command) edit.commands.push({ command, createdAt: now() });
  current.editState[projectId] = edit;
  project.status = "edited";
  write(current);
  return edit;
}

export function setAudio(projectId: string, patch: Partial<EditState>) {
  const current = state();
  if (!current.projects.some((project) => project.id === projectId)) throw new Error("Project not found");
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

function buildRenderSourceHash(current: StudioState, projectId: string) {
  const shots = current.shots.filter((shot) => shot.projectId === projectId).sort((a, b) => a.order - b.order);
  const payload = {
    projectId,
    shots: shots.map((shot) => {
      const take = selectedOrBestTake(current, shot);
      const referenceImageIds = [...shot.referenceImageIds].sort();
      return {
        id: shot.id,
        sceneId: shot.sceneId,
        order: shot.order,
        title: shot.title,
        durationSec: shot.durationSec,
        status: shot.status,
        effectiveTake: take
          ? {
              id: take.id,
              status: take.status,
              videoUrl: take.videoUrl,
              posterUrl: take.posterUrl,
              durationSec: take.durationSec,
              tier: take.tier,
              metrics: take.metrics,
              upgradeSourceTakeId: take.upgradeSourceTakeId || null,
              upgradeMode: take.upgradeMode || null
            }
          : null,
        references: referenceImageIds.map((assetId) => {
          const asset = current.imageAssets.find((item) => item.id === assetId && item.projectId === projectId);
          return asset
            ? {
                assetId: asset.id,
                label: asset.label,
                role: asset.role,
                rightsStatus: asset.rights.status,
                rightsNote: asset.rights.note
              }
            : { assetId, missing: true };
        })
      };
    }),
    edit: cloneEditState(current.editState[projectId] || defaultEditState(projectId))
  };
  return `sha256:${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
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
    sourceHash: buildRenderSourceHash(current, projectId),
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
  const renderPlan = buildRenderPlan(current, projectId, spec);
  return {
    projectId,
    spec,
    sourceHash: renderPlan.sourceHash,
    rightsReview: buildRenderRightsReview(current, projectId),
    renderPlan,
    estimate: estimateCost("startRender")
  };
}

export function startRender(projectId: string, specs: ExportSpec[], options: { retryOfJobId?: string | null } = {}) {
  const current = state();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");
  const activeSpecs = new Set(
    current.renderJobs
      .filter((job) => job.projectId === projectId && (job.status === "queued" || job.status === "running"))
      .map((job) => `${job.spec.resolution}:${job.spec.cut}:${job.spec.aspect}:${job.spec.caption}`)
  );
  const nextSpecs = specs.filter((spec) => !activeSpecs.has(`${spec.resolution}:${spec.cut}:${spec.aspect}:${spec.caption}`));
  if (!nextSpecs.length) throw new Error("Render job already active");
  assertCanReserveCredits(current, nextSpecs.length * 16);
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
    retryOfJobId: options.retryOfJobId || null,
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
  for (const job of jobs) {
    reserveCredits(current, { projectId, jobId: job.id, action: "startRender", credits: 16, note: `${job.spec.cut} render reserved` });
  }
  write(current);
  return { jobs };
}

export function setDefaultRender(projectId: string, renderJobId: string): ProjectBundle | null {
  const current = state();
  const project = current.projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found");
  const job = current.renderJobs.find((item) => item.id === renderJobId && item.projectId === projectId);
  if (!job) throw new Error("Render job not found");
  if (job.status !== "done") throw new Error("Only completed renders can be the default version");
  project.defaultRenderJobId = job.id;
  project.thumbUrl = mockPosterUrl(job.id, `${job.spec.cut} render`);
  write(current);
  return getProjectBundle(projectId);
}

export function getJob(jobId: string): GenerationJob | ImageJob | RenderJob | null {
  const current = state();
  return (
    current.generationJobs.find((job) => job.id === jobId) ||
    current.imageJobs.find((job) => job.id === jobId) ||
    current.renderJobs.find((job) => job.id === jobId) ||
    null
  );
}

export function cancelJob(jobId: string): CancelJobResult {
  const current = state();
  const timestamp = Date.now();
  const cancelled = cancelledError();

  const generationJob = current.generationJobs.find((job) => job.id === jobId);
  if (generationJob) {
    if (!isActiveJob(generationJob.status)) {
      return {
        jobId,
        kind: "generationJob",
        projectId: generationJob.projectId,
        cancelled: false,
        status: generationJob.status,
        refundedCredits: 0,
        reason: "job is not active"
      };
    }
    const take = current.takes.find((item) => item.id === generationJob.takeId);
    const action: CreditTransaction["action"] = take?.upgradeSourceTakeId ? "upgradeTake" : "generateShot";
    const credits = take?.upgradeSourceTakeId ? 22 : 6;
    generationJob.status = "cancelled";
    generationJob.progress = 1;
    generationJob.stage = "cancelled";
    generationJob.etaSec = 0;
    generationJob.error = cancelled;
    generationJob.updatedAt = now();
    cancelProviderAttempt(generationJob, timestamp);
    if (take) {
      take.status = "cancelled";
      take.videoUrl = null;
      take.posterUrl = null;
      take.metrics = {};
    }
    refundReservedCredits(current, { projectId: generationJob.projectId, jobId, action, credits, note: "Generation job cancelled and reserved credits refunded" });
    refreshProject(current, generationJob.projectId);
    write(current);
    return { jobId, kind: "generationJob", projectId: generationJob.projectId, cancelled: true, status: "cancelled", refundedCredits: credits, reason: "cancelled" };
  }

  const imageJob = current.imageJobs.find((job) => job.id === jobId);
  if (imageJob) {
    if (!isActiveJob(imageJob.status)) {
      return { jobId, kind: "imageJob", projectId: imageJob.projectId, cancelled: false, status: imageJob.status, refundedCredits: 0, reason: "job is not active" };
    }
    imageJob.status = "cancelled";
    imageJob.progress = 1;
    imageJob.etaSec = 0;
    imageJob.error = cancelled;
    imageJob.updatedAt = now();
    imageJob.variants = imageJob.variants.map((variant) => ({ ...variant, status: "cancelled" }));
    const credits = imageJob.count * 4;
    refundReservedCredits(current, { projectId: imageJob.projectId, jobId, action: "generateImages", credits, note: "Image job cancelled and reserved credits refunded" });
    write(current);
    return { jobId, kind: "imageJob", projectId: imageJob.projectId, cancelled: true, status: "cancelled", refundedCredits: credits, reason: "cancelled" };
  }

  const renderJob = current.renderJobs.find((job) => job.id === jobId);
  if (renderJob) {
    if (!isActiveJob(renderJob.status)) {
      return { jobId, kind: "renderJob", projectId: renderJob.projectId, cancelled: false, status: renderJob.status, refundedCredits: 0, reason: "job is not active" };
    }
    renderJob.status = "cancelled";
    renderJob.progress = 1;
    renderJob.etaSec = 0;
    renderJob.error = cancelled;
    renderJob.updatedAt = now();
    const credits = 16;
    refundReservedCredits(current, { projectId: renderJob.projectId, jobId, action: "startRender", credits, note: "Render job cancelled and reserved credits refunded" });
    const project = current.projects.find((item) => item.id === renderJob.projectId);
    const hasActiveRender = current.renderJobs.some((job) => job.projectId === renderJob.projectId && isActiveJob(job.status));
    if (project && project.status === "rendering" && !hasActiveRender) project.status = "edited";
    write(current);
    return { jobId, kind: "renderJob", projectId: renderJob.projectId, cancelled: true, status: "cancelled", refundedCredits: credits, reason: "cancelled" };
  }

  return { jobId, kind: null, projectId: null, cancelled: false, status: null, refundedCredits: 0, reason: "job not found" };
}

function workerError(input: WorkerLeaseCompletionInput, fallbackCode: string, fallbackMessage: string): ErrorResponse {
  return {
    code: input.error?.code?.trim() || fallbackCode,
    userMessage: input.error?.userMessage?.trim() || fallbackMessage,
    retryable: Boolean(input.error?.retryable ?? true),
    fallbackSuggested: Boolean(input.error?.fallbackSuggested ?? true)
  };
}

function completeImageWorkerJob(current: StudioState, job: ImageJob, output?: WorkerLeaseCompletionInput["outputs"]) {
  job.status = "done";
  job.progress = 1;
  job.stage = "done";
  job.etaSec = 0;
  job.error = null;
  job.updatedAt = now();
  job.variants = job.variants.map((variant, index) => {
    if (variant.assetId) return { ...variant, status: "done" };
    const outputVariant = output?.imageVariants?.find((item) => item.variantId === variant.id) || output?.imageVariants?.[index];
    const asset = makeImageAsset(current, {
      projectId: job.projectId,
      role: job.role,
      source: "image_maker",
      label: `${job.purpose} ${variant.label}`,
      prompt: `${job.prompt} / ${job.style}`,
      url: outputVariant?.imageUrl,
      thumbUrl: outputVariant?.thumbUrl,
      aspect: job.aspect,
      sourceJobId: job.id,
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
  captureReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "generateImages", credits: job.count * 4, note: "Image Maker variants completed by worker" });
}

function failImageWorkerJob(current: StudioState, job: ImageJob, error: ErrorResponse) {
  job.status = "failed";
  job.progress = 1;
  job.stage = "failed";
  job.etaSec = 0;
  job.error = error;
  job.updatedAt = now();
  job.variants = job.variants.map((variant) => ({ ...variant, status: "failed" }));
  refundReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "generateImages", credits: job.count * 4, note: "Image Maker variants failed by worker and were refunded" });
}

function completeGenerationWorkerJob(current: StudioState, job: GenerationJob, timestamp = Date.now(), output?: WorkerLeaseCompletionInput["outputs"]) {
  const take = current.takes.find((item) => item.id === job.takeId);
  const shot = current.shots.find((item) => item.id === job.shotId);
  job.status = "done";
  job.progress = 1;
  job.stage = "done";
  job.etaSec = 0;
  job.error = null;
  job.updatedAt = now();
  finishProviderAttempt(job, "succeeded", null, timestamp);
  if (take && shot) completeTake(current, take, shot, job.id, output);
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
    refreshProject(current, shot.projectId);
  }
  const credits = take?.upgradeSourceTakeId ? 22 : 6;
  captureReservedCredits(current, {
    projectId: job.projectId,
    jobId: job.id,
    action: take?.upgradeSourceTakeId ? "upgradeTake" : "generateShot",
    credits,
    note: take?.upgradeSourceTakeId ? "Publishing quality upgrade completed by worker" : "Video take generation completed by worker"
  });
}

function failGenerationWorkerJob(current: StudioState, job: GenerationJob, error: ErrorResponse, timestamp = Date.now()) {
  const take = current.takes.find((item) => item.id === job.takeId);
  const shot = current.shots.find((item) => item.id === job.shotId);
  job.status = "failed";
  job.progress = 1;
  job.stage = "failed";
  job.etaSec = 0;
  job.error = error;
  job.updatedAt = now();
  finishProviderAttempt(job, "failed", error, timestamp);
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
    refreshProject(current, shot.projectId);
  }
  const credits = take?.upgradeSourceTakeId ? 22 : 6;
  refundReservedCredits(current, {
    projectId: job.projectId,
    jobId: job.id,
    action: take?.upgradeSourceTakeId ? "upgradeTake" : "generateShot",
    credits,
    note: take?.upgradeSourceTakeId ? "Publishing quality upgrade failed by worker and was refunded" : "Video take generation failed by worker and was refunded"
  });
}

function completeRenderWorkerJob(current: StudioState, job: RenderJob, output?: WorkerLeaseCompletionInput["outputs"]) {
  job.status = "done";
  job.progress = 1;
  job.stage = "done";
  job.etaSec = 0;
  job.error = null;
  job.updatedAt = now();
  job.outputUrl = output?.renderOutputUrl || output?.videoUrl || mockVideoUrl(job.id);
  job.shareUrl = output?.shareUrl || mockShareUrl(job.id);
  recordRenderArtifact(current, job);
  captureReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "startRender", credits: 16, note: `${job.spec.cut} render completed by worker` });
  const project = current.projects.find((item) => item.id === job.projectId);
  if (project && !project.defaultRenderJobId) project.defaultRenderJobId = job.id;
  if (project && current.renderJobs.filter((item) => item.projectId === project.id).every((item) => item.status === "done")) {
    project.status = "done";
    const defaultJob = current.renderJobs.find((item) => item.id === project.defaultRenderJobId && item.projectId === project.id) || job;
    project.thumbUrl = mockPosterUrl(defaultJob.id, `${defaultJob.spec.cut} render`);
  }
}

function failRenderWorkerJob(current: StudioState, job: RenderJob, error: ErrorResponse) {
  job.status = "failed";
  job.progress = 1;
  job.etaSec = 0;
  job.error = error;
  job.updatedAt = now();
  refundReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "startRender", credits: 16, note: `${job.spec.cut} render failed by worker and was refunded` });
  const project = current.projects.find((item) => item.id === job.projectId);
  const hasActiveRender = current.renderJobs.some((item) => item.projectId === job.projectId && isActiveJob(item.status));
  if (project && project.status === "rendering" && !hasActiveRender) project.status = "edited";
}

export function completeLeasedWorkerJob(current: StudioState, lease: WorkerLease, input: WorkerLeaseCompletionInput): "completed" | "job_not_active" | "unsupported_status" {
  if (input.status !== "succeeded" && input.status !== "failed") return "unsupported_status";
  const timestamp = Date.now();
  if (lease.kind === "image_generation") {
    const job = current.imageJobs.find((item) => item.id === lease.jobId);
    if (!job || !isActiveJob(job.status)) return "job_not_active";
    if (input.status === "succeeded") completeImageWorkerJob(current, job, input.outputs);
    else failImageWorkerJob(current, job, workerError(input, "IMAGE_WORKER_FAILED", "이미지 생성 작업이 실패했습니다."));
    return "completed";
  }
  if (lease.kind === "provider_generation") {
    const job = current.generationJobs.find((item) => item.id === lease.jobId);
    if (!job || !isActiveJob(job.status)) return "job_not_active";
    if (input.status === "succeeded") completeGenerationWorkerJob(current, job, timestamp, input.outputs);
    else failGenerationWorkerJob(current, job, workerError(input, "PROVIDER_WORKER_FAILED", "영상 생성 작업이 실패했습니다."), timestamp);
    return "completed";
  }
  if (lease.kind === "render") {
    const job = current.renderJobs.find((item) => item.id === lease.jobId);
    if (!job || !isActiveJob(job.status)) return "job_not_active";
    if (input.status === "succeeded") completeRenderWorkerJob(current, job, input.outputs);
    else failRenderWorkerJob(current, job, workerError(input, "RENDER_WORKER_FAILED", "렌더 작업이 실패했습니다."));
    return "completed";
  }
  return "unsupported_status";
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
  if (process.env.CUTPILOT_RUNTIME_MODE === "production") return current;
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
          sourceJobId: job.id,
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
      captureReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "generateImages", credits: job.count * 4, note: "Image Maker variants completed" });
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
    markProviderAttemptPolling(job);

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
        finishProviderAttempt(job, "failed", job.error, timestamp);
        if (take) failTake(take);
        refundReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "generateShot", credits: 6, note: "Video take generation failed and was refunded" });
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
        finishProviderAttempt(job, "succeeded", null, timestamp);
        if (take && shot) completeTake(current, take, shot, job.id);
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
        const credits = take?.upgradeSourceTakeId ? 22 : 6;
        captureReservedCredits(current, {
          projectId: job.projectId,
          jobId: job.id,
          action: take?.upgradeSourceTakeId ? "upgradeTake" : "generateShot",
          credits,
          note: take?.upgradeSourceTakeId ? "Publishing quality upgrade completed" : "Video take generation completed"
        });
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
      job.outputUrl = mockVideoUrl(job.id);
      job.shareUrl = mockShareUrl(job.id);
      recordRenderArtifact(current, job);
      captureReservedCredits(current, { projectId: job.projectId, jobId: job.id, action: "startRender", credits: 16, note: `${job.spec.cut} render completed` });
      const project = current.projects.find((item) => item.id === job.projectId);
      if (project && !project.defaultRenderJobId) project.defaultRenderJobId = job.id;
      if (project && current.renderJobs.filter((item) => item.projectId === project.id).every((item) => item.status === "done")) {
        project.status = "done";
        const defaultJob = current.renderJobs.find((item) => item.id === project.defaultRenderJobId && item.projectId === project.id) || job;
        project.thumbUrl = mockPosterUrl(defaultJob.id, `${defaultJob.spec.cut} render`);
      }
    }
  }

  write(current);
  return current;
}

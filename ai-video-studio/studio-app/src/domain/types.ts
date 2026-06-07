export type Intent = "shorts" | "product_ad" | "app_intro" | "real_estate" | "education" | "brand";
export type Tier = "fast" | "economy" | "final";
export type Aspect = "9:16" | "16:9" | "1:1" | "4:5";
export type ProjectStatus = "draft" | "storyboarded" | "generating" | "reviewing" | "edited" | "rendering" | "done" | "failed";
export type ShotStatus = "pending" | "generating" | "reviewing" | "selected" | "failed";
export type JobStatus = "queued" | "running" | "done" | "failed" | "cancelled";
export type AssetKind = "image" | "video" | "audio" | "brand";
export type ImageAssetRole = "product" | "character" | "location" | "style" | "keyframe" | "thumbnail" | "logo" | "background";
export type AssetSource = "image_maker" | "upload" | "external";
export type ImageMakerPurpose = "photoreal" | "product" | "character" | "background" | "style" | "poster" | "thumbnail" | "transparent";
export type AssetUsageMode = "first_frame" | "last_frame" | "style_reference" | "character_reference" | "product_reference" | "background_reference";

export type Saec = {
  subject: string;
  action: string;
  environment: string;
  camera: string;
  framing: string;
  lighting: string;
  style: string;
  negative: string;
};

export type ShotRequirements = {
  tier: Tier;
  aspect: Aspect;
  resolution?: "540p" | "720p" | "1080p" | "4k";
  imageToVideo: boolean;
  needsLipsyncAudio: boolean;
  motionHeavy: boolean;
  characterLock: boolean;
  characterId: string | null;
  region: string;
};

export type QualityFlag = {
  axis: "fidelity" | "consistency" | "motion" | "transition" | "audio" | "completeness";
  score: number;
  hint: string;
};

export type Project = {
  id: string;
  title: string;
  idea: string;
  intent: Intent;
  status: ProjectStatus;
  aspect: Aspect;
  targetDurationSec: number;
  progress: { shotsDone: number; shotsTotal: number };
  characters: Array<{ id: string; label: string; refImageUrls: string[] }>;
  thumbUrl: string | null;
  defaultRenderJobId: string | null;
  credits: { spent: number; estimateRemaining: number };
  createdAt: string;
  updatedAt: string;
};

export type Scene = {
  id: string;
  projectId: string;
  order: number;
  title: string;
  setting: string;
  timeOfDay: string;
};

export type Shot = {
  id: string;
  projectId: string;
  sceneId: string;
  order: number;
  title: string;
  durationSec: number;
  saec: Saec;
  requirements: ShotRequirements;
  status: ShotStatus;
  selectedTakeId: string | null;
  qualityFlags: QualityFlag[];
  referenceImageIds: string[];
  directionSpec: DirectionSpec;
};

export type TakeMetrics = Partial<Record<"fidelity" | "consistency" | "motion" | "transition" | "audio" | "completeness" | "overall", number>>;

export type Take = {
  id: string;
  shotId: string;
  projectId: string;
  label: string;
  status: JobStatus;
  videoUrl: string | null;
  posterUrl: string | null;
  durationSec: number;
  tier: Tier;
  engineUsed: string | null;
  metrics: TakeMetrics;
  createdAt: string;
  upgradeSourceTakeId?: string;
  upgradeMode?: "final_regenerate" | "enhance" | "render_upscale";
};

export type ProviderAttemptStatus = "queued" | "submitted" | "polling" | "succeeded" | "failed" | "cancelled";

export type ProviderAttempt = {
  id: string;
  provider: string;
  model: string;
  requestId: string | null;
  status: ProviderAttemptStatus;
  startedAt: string;
  completedAt: string | null;
  latencyMs: number | null;
  errorCode: string | null;
  retryable: boolean;
  fallbackSuggested: boolean;
};

export type GenerationJob = {
  id: string;
  shotId: string;
  takeId: string;
  projectId: string;
  retryOfJobId: string | null;
  status: JobStatus;
  progress: number;
  etaSec: number | null;
  stage: string;
  shouldFail: boolean;
  dueAt: number;
  createdAt: string;
  updatedAt: string;
  error: ErrorResponse | null;
  promptPackage: GenerationPromptPackage;
  routing: ProviderRoutingDecision;
  providerAttempts: ProviderAttempt[];
};

export type ExportSpec = {
  resolution: "720p" | "1080p" | "4k";
  cut: "6s" | "15s" | "30s" | "full";
  aspect: Aspect;
  caption: "none" | "burn-in" | "srt" | "both";
};

export type RenderJob = {
  id: string;
  projectId: string;
  retryOfJobId: string | null;
  spec: ExportSpec;
  stage: "assemble" | "audio_mix" | "caption_burn" | "encode" | "upscale" | "done";
  progress: number;
  status: JobStatus;
  outputUrl: string | null;
  shareUrl: string | null;
  etaSec: number | null;
  dueAt: number;
  createdAt: string;
  updatedAt: string;
  error: ErrorResponse | null;
  rightsReview: RenderRightsReview;
  renderPlan: RenderPlan;
};

export type RenderPreview = {
  projectId: string;
  spec: ExportSpec;
  sourceHash: string;
  rightsReview: RenderRightsReview;
  renderPlan: RenderPlan;
  estimate: {
    credits: number;
    etaSec: number;
  };
};

export type RenderPlan = {
  projectId: string;
  spec: ExportSpec;
  sourceHash: string;
  totalDurationSec: number;
  missingShotIds: string[];
  shots: Array<{
    shotId: string;
    takeId: string;
    order: number;
    title: string;
    durationSec: number;
    videoUrl: string | null;
    posterUrl: string | null;
    tier: Tier;
  }>;
  edit: EditState;
};

export type RenderWorkerInvocation = {
  jobId: string;
  projectId: string;
  sourceHash: string;
  spec: ExportSpec;
  inputs: Array<{
    shotId: string;
    takeId: string;
    order: number;
    title: string;
    durationSec: number;
    videoUrl: string;
    posterUrl: string | null;
  }>;
  missingShotIds: string[];
  edit: EditState;
  output: {
    role: "render_output";
    container: "mp4";
    storageKey: string;
    shareUrlRequired: boolean;
  };
  policy: {
    missingShotPolicy: "skip_with_notice";
    burnCaptions: boolean;
    emitSrt: boolean;
    audioMix: boolean;
    voiceover: boolean;
    transitions: EditState["transitions"];
  };
};

export type RenderRightsReview = {
  required: boolean;
  assetIds: string[];
  items: Array<{
    assetId: string;
    label: string;
    role: ImageAssetRole;
    rightsStatus: ImageAsset["rights"]["status"];
    note: string;
    targetShotIds: string[];
  }>;
};

export type DirectionSpec = {
  camera: string;
  composition: string;
  lighting: string;
  motion: string;
  style: string;
  avoid: string[];
  notes: string;
};

export type ImageAsset = {
  id: string;
  projectId: string;
  kind: "image";
  role: ImageAssetRole;
  source: AssetSource;
  label: string;
  prompt: string;
  url: string;
  thumbUrl: string;
  aspect: Aspect;
  width: number;
  height: number;
  rights: {
    status: "user_confirmed" | "generated" | "needs_review";
    note: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ImageVariant = {
  id: string;
  assetId: string | null;
  label: string;
  status: JobStatus;
  url: string | null;
  thumbUrl: string | null;
  scoreLabel: "추천" | "안정적" | "확인 필요";
};

export type ImageJob = {
  id: string;
  projectId: string;
  retryOfJobId: string | null;
  status: JobStatus;
  progress: number;
  etaSec: number | null;
  stage: "queued" | "prompting" | "generating" | "saving" | "done" | "failed";
  prompt: string;
  purpose: ImageMakerPurpose;
  role: ImageAssetRole;
  aspect: Aspect;
  style: string;
  count: number;
  variants: ImageVariant[];
  dueAt: number;
  createdAt: string;
  updatedAt: string;
  error: ErrorResponse | null;
};

export type ImageWorkerInvocation = {
  jobId: string;
  projectId: string;
  request: {
    prompt: string;
    purpose: ImageMakerPurpose;
    role: ImageAssetRole;
    aspect: Aspect;
    style: string;
    count: number;
  };
  outputs: Array<{
    variantId: string;
    label: string;
    scoreLabel: ImageVariant["scoreLabel"];
    imageStorageKey: string;
    thumbnailStorageKey: string;
  }>;
  policy: {
    rightsStatus: "generated";
    registerAsAssets: boolean;
    storageIngestRequired: boolean;
  };
  responseContract: {
    expectedKind: "image";
    outputRole: "image_asset";
    thumbnailRole: "image_thumbnail";
    ingest: "copy_to_storage";
    progress: "async_polling";
  };
};

export type AssetUsage = {
  assetId: string;
  role: ImageAssetRole;
  target: "project" | "shot";
  targetId: string;
  mode: AssetUsageMode;
  createdAt: string;
};

export type AssetDeleteResult = {
  deleted: boolean;
  assetId: string;
  blockedByUsage: boolean;
  usageCount: number;
  remainingAssets: number;
};

export type GenerationReference = {
  assetId: string;
  role: ImageAssetRole;
  mode: AssetUsageMode;
  url: string;
  rightsStatus: ImageAsset["rights"]["status"];
};

export type GenerationPromptPackage = {
  projectId: string;
  shotId: string;
  durationSec: number;
  saec: Saec;
  directionSpec: DirectionSpec;
  requirements: ShotRequirements;
  references: GenerationReference[];
  routingHints: {
    startFrameAssetId: string | null;
    lastFrameAssetId: string | null;
    styleReferenceAssetIds: string[];
    characterReferenceAssetIds: string[];
    productReferenceAssetIds: string[];
    backgroundReferenceAssetIds: string[];
    rightsReviewRequired: boolean;
  };
};

export type ProviderRouteTarget = {
  provider: string;
  model: string;
};

export type ProviderHealthStatus = "healthy" | "degraded" | "down";

export type ProviderHealthTarget = {
  provider: string;
  model: string;
  status: ProviderHealthStatus;
  reason: string | null;
  checkedAt: string | null;
  input: string[];
  supportsAudio: boolean | string | null;
};

export type ProviderHealthSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    down: number;
  };
  targets: ProviderHealthTarget[];
};

export type ProviderRoutingDecision = {
  ruleId: string;
  selected: ProviderRouteTarget;
  candidates: ProviderRouteTarget[];
  rejected: Array<ProviderRouteTarget & { reason: string }>;
  splitTakeIndex: number;
  fallbackEnabled: boolean;
  hiddenFromUser: boolean;
};

export type ProviderInvocationInputKind = "text" | "image" | "first_last_frames";

export type ProviderInvocation = {
  jobId: string;
  takeId: string;
  projectId: string;
  shotId: string;
  provider: string;
  model: string;
  routingRuleId: string;
  inputKind: ProviderInvocationInputKind;
  request: {
    prompt: string;
    negativePrompt: string;
    aspect: Aspect;
    durationSec: number;
    tier: Tier;
    references: GenerationReference[];
    startFrameUrl: string | null;
    lastFrameUrl: string | null;
  };
  policy: {
    hiddenFromUser: boolean;
    fallbackEnabled: boolean;
    rightsReviewRequired: boolean;
    storageIngestRequired: boolean;
  };
  responseContract: {
    expectedKind: "video";
    outputRole: "take_video";
    ingest: "copy_to_storage";
    progress: "async_polling";
  };
};

export type ReferenceBoard = {
  projectId: string;
  productImages: string[];
  characterImages: string[];
  locationImages: string[];
  styleImages: string[];
  keyframes: string[];
  thumbnails: string[];
  logos: string[];
  backgrounds: string[];
  usages: AssetUsage[];
};

export type EditState = {
  projectId: string;
  captions: { enabled: boolean; mode: "burn-in" | "srt" | "both"; source: "script-first" | "stt" };
  bgm: { enabled: boolean; track: string; ducking: boolean };
  voiceover: { enabled: boolean; voice: string; source: "licensed_tts" | "user_upload" };
  transitions: "none" | "soft";
  commands: Array<{ command: string; createdAt: string }>;
};

export type ErrorResponse = {
  code: string;
  userMessage: string;
  retryable: boolean;
  fallbackSuggested: boolean;
};

export type CreditTransaction = {
  id: string;
  projectId: string;
  jobId: string | null;
  kind: "reserve" | "capture" | "refund";
  action: "generateImages" | "generateShot" | "upgradeTake" | "startRender";
  credits: number;
  balanceAfter: {
    spent: number;
    reserved: number;
    available: number;
  };
  note: string;
  createdAt: string;
};

export type MediaArtifact = {
  id: string;
  projectId: string;
  ownerType: "imageAsset" | "take" | "renderJob";
  ownerId: string;
  sourceJobId: string | null;
  kind: AssetKind;
  role: "image_asset" | "image_thumbnail" | "take_video" | "take_poster" | "render_output";
  url: string;
  storageKey: string;
  contentType: string;
  bytes: number | null;
  status: "stored" | "external";
  createdAt: string;
};

export type MediaArtifactCleanup = "retain" | "review_external" | "orphaned";

export type MediaArtifactInventoryItem = {
  artifact: MediaArtifact;
  projectTitle: string;
  ownerExists: boolean;
  referenced: boolean;
  referenceCount: number;
  cleanup: MediaArtifactCleanup;
};

export type MediaArtifactInventory = {
  generatedAt: string;
  summary: {
    total: number;
    stored: number;
    external: number;
    images: number;
    videos: number;
    knownBytes: number;
    unknownBytes: number;
    orphaned: number;
    reviewExternal: number;
  };
  artifacts: MediaArtifactInventoryItem[];
};

export type StorageCleanupAction = "retain" | "review_external" | "delete_object";

export type StorageCleanupPlanItem = {
  artifact: MediaArtifact;
  cleanup: MediaArtifactCleanup;
  action: StorageCleanupAction;
  storageKey: string;
  ownerExists: boolean;
  referenced: boolean;
  referenceCount: number;
  safeToDelete: boolean;
  reason: string;
};

export type StorageCleanupPlan = {
  generatedAt: string;
  summary: {
    total: number;
    retain: number;
    reviewExternal: number;
    deleteCandidates: number;
    knownReclaimableBytes: number;
    unknownReclaimableItems: number;
  };
  items: StorageCleanupPlanItem[];
};

export type StorageCleanupExecutionRecord = {
  id: string;
  artifactId: string;
  projectId: string;
  storageKey: string;
  action: "delete_object";
  status: "deleted";
  bytes: number | null;
  reason: string;
  createdAt: string;
};

export type StorageCleanupExecutionResult = {
  executedAt: string;
  limit: number | null;
  summary: {
    candidates: number;
    deleted: number;
    skipped: number;
    recordsCreated: number;
    knownReclaimedBytes: number;
    unknownReclaimedItems: number;
  };
  records: StorageCleanupExecutionRecord[];
};

export type StorageCleanupExecutionSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    deleted: number;
    knownReclaimedBytes: number;
    unknownReclaimedItems: number;
  };
  records: StorageCleanupExecutionRecord[];
};

export type CancelJobResult = {
  jobId: string;
  kind: "generationJob" | "renderJob" | "imageJob" | null;
  projectId: string | null;
  cancelled: boolean;
  status: JobStatus | null;
  refundedCredits: number;
  reason: string;
};

export type QueueJobKind = "generation" | "image" | "render";
export type WorkerDispatchKind = "provider_generation" | "image_generation" | "render";

export type QueueJobSnapshot = {
  id: string;
  projectId: string;
  kind: QueueJobKind;
  status: JobStatus;
  stage: string;
  progress: number;
  etaSec: number | null;
  queuedAt: string;
  updatedAt: string;
  dueAt: number;
  cancelable: boolean;
};

export type JobQueueSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    queued: number;
    running: number;
    done: number;
    failed: number;
    cancelled: number;
    active: number;
    overdue: number;
    cancelable: number;
    nextDueAt: number | null;
  };
  jobs: QueueJobSnapshot[];
};

export type WorkerDispatchItem = {
  dispatchKey: string;
  kind: WorkerDispatchKind;
  jobId: string;
  projectId: string;
  status: "queued" | "running";
  stage: string;
  etaSec: number | null;
  queuedAt: string;
  updatedAt: string;
  dueAt: number;
  priority: number;
  cancelable: boolean;
  invocation: ProviderInvocation | ImageWorkerInvocation | RenderWorkerInvocation;
};

export type WorkerDispatchSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    providerGeneration: number;
    imageGeneration: number;
    render: number;
    queued: number;
    running: number;
    overdue: number;
    nextDueAt: number | null;
  };
  items: WorkerDispatchItem[];
};

export type WorkerLeaseStatus = "active" | "released" | "expired";

export type WorkerLease = {
  id: string;
  token: string;
  dispatchKey: string;
  kind: WorkerDispatchKind;
  jobId: string;
  projectId: string;
  workerId: string;
  status: WorkerLeaseStatus;
  leasedAt: string;
  expiresAt: string;
  releasedAt: string | null;
};

export type WorkerLeaseRequest = {
  workerId: string;
  kind?: WorkerDispatchKind | "any";
  ttlSec?: number;
};

export type WorkerLeaseResult = {
  lease: WorkerLease | null;
  item: WorkerDispatchItem | null;
  reason: "leased" | "no_available_work";
};

export type WorkerLeaseReleaseResult = {
  leaseId: string;
  released: boolean;
  status: WorkerLeaseStatus | null;
  reason: "released" | "not_found" | "token_mismatch" | "not_active";
};

export type WorkerLeaseRenewResult = {
  leaseId: string;
  renewed: boolean;
  lease: WorkerLease | null;
  status: WorkerLeaseStatus | null;
  reason: "renewed" | "not_found" | "token_mismatch" | "not_active";
};

export type WorkerLeaseCompletionInput = {
  token: string;
  status: "succeeded" | "failed";
  error?: Partial<ErrorResponse>;
};

export type WorkerLeaseCompletionResult = {
  leaseId: string;
  completed: boolean;
  lease: WorkerLease | null;
  receipt: WorkerCompletionReceipt | null;
  reason: "completed" | "not_found" | "token_mismatch" | "not_active" | "job_not_active" | "unsupported_status";
};

export type WorkerLeaseSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    active: number;
    released: number;
    expired: number;
  };
  leases: WorkerLease[];
};

export type WorkerCompletionStatus = "succeeded" | "failed" | "cancelled";

export type WorkerCompletionReceipt = {
  completionKey: string;
  kind: WorkerDispatchKind;
  jobId: string;
  projectId: string;
  status: WorkerCompletionStatus;
  completedAt: string;
  error: ErrorResponse | null;
  artifacts: MediaArtifact[];
  creditTransactions: CreditTransaction[];
  summary: {
    artifactCount: number;
    storedArtifacts: number;
    externalArtifacts: number;
    capturedCredits: number;
    refundedCredits: number;
  };
};

export type WorkerCompletionSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    succeeded: number;
    failed: number;
    cancelled: number;
    artifactCount: number;
    capturedCredits: number;
    refundedCredits: number;
  };
  receipts: WorkerCompletionReceipt[];
};

export type WorkerRetryAction = "retry_provider_generation" | "retry_image_generation" | "retry_render" | "hold";

export type WorkerRetryPlanItem = {
  receipt: WorkerCompletionReceipt;
  action: WorkerRetryAction;
  retryable: boolean;
  fallbackSuggested: boolean;
  reason: string;
};

export type WorkerRetryPlan = {
  generatedAt: string;
  summary: {
    totalFailed: number;
    retryable: number;
    hold: number;
    providerGeneration: number;
    imageGeneration: number;
    render: number;
  };
  items: WorkerRetryPlanItem[];
};

export type WorkerRetryRecord = {
  id: string;
  sourceJobId: string;
  action: WorkerRetryAction;
  replacementJobId: string;
  replacementKind: QueueJobKind;
  createdAt: string;
  updatedAt: string;
};

export type WorkerRetryExecutionResult = {
  sourceJobId: string;
  executed: boolean;
  action: WorkerRetryAction | null;
  replacement: QueueJobSnapshot | null;
  retryRecord: WorkerRetryRecord | null;
  reason: "executed" | "already_executed" | "not_found" | "not_retryable" | "unsupported_action" | "retry_failed" | "replacement_missing";
};

export type WorkerRetryExecutionSnapshotItem = {
  record: WorkerRetryRecord;
  sourceReceipt: WorkerCompletionReceipt | null;
  replacement: QueueJobSnapshot | null;
  replacementMissing: boolean;
};

export type WorkerRetryExecutionSnapshot = {
  generatedAt: string;
  summary: {
    total: number;
    providerGeneration: number;
    imageGeneration: number;
    render: number;
    withReplacement: number;
    missingReplacement: number;
  };
  items: WorkerRetryExecutionSnapshotItem[];
};

export type RuntimeReadiness = {
  mode: "mock" | "production";
  generatedAt: string;
  ready: boolean;
  missingEnv: string[];
  checks: Array<{
    id: string;
    label: string;
    status: "pass" | "warn" | "fail";
    detail: string;
  }>;
};

export type JobStatusCounts = Record<JobStatus, number>;

export type SystemMetrics = {
  generatedAt: string;
  projects: {
    total: number;
    active: number;
    done: number;
    failed: number;
  };
  jobs: {
    generation: JobStatusCounts;
    image: JobStatusCounts;
    render: JobStatusCounts;
  };
  credits: {
    balance: number;
    spent: number;
    reserved: number;
    available: number;
    captured: number;
    refunded: number;
  };
  providerAttempts: {
    total: number;
    succeeded: number;
    failed: number;
    cancelled: number;
    retryableFailures: number;
    fallbackSuggested: number;
    avgLatencyMs: number | null;
  };
  mediaArtifacts: {
    total: number;
    images: number;
    videos: number;
    external: number;
  };
};

export type StudioState = {
  version: number;
  credits: { balance: number; spent: number; reserved: number };
  creditTransactions: CreditTransaction[];
  mediaArtifacts: MediaArtifact[];
  storageCleanupRecords: StorageCleanupExecutionRecord[];
  projects: Project[];
  scenes: Scene[];
  shots: Shot[];
  takes: Take[];
  generationJobs: GenerationJob[];
  renderJobs: RenderJob[];
  imageAssets: ImageAsset[];
  imageJobs: ImageJob[];
  workerLeases: WorkerLease[];
  workerRetryRecords: WorkerRetryRecord[];
  referenceBoards: Record<string, ReferenceBoard>;
  editState: Record<string, EditState>;
  updatedAt: string;
};

export type ProjectBundle = {
  project: Project;
  scenes: Scene[];
  shots: Shot[];
  takes: Take[];
  generationJobs: GenerationJob[];
  renderJobs: RenderJob[];
  imageAssets: ImageAsset[];
  imageJobs: ImageJob[];
  referenceBoard: ReferenceBoard;
  editState: EditState;
  credits: StudioState["credits"];
  creditTransactions: CreditTransaction[];
  mediaArtifacts: MediaArtifact[];
  renderSourceHash: string;
};

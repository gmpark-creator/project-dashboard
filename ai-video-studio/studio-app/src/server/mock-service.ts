import { INTENT_TEMPLATES } from "../domain/templates";
import type {
  Aspect,
  EditState,
  ExportSpec,
  GenerationJob,
  Intent,
  JobStatus,
  Project,
  ProjectBundle,
  RenderJob,
  Scene,
  Shot,
  StudioState,
  Take,
  Tier
} from "../domain/types";

const INTERNAL_ENGINES = ["mock.fast.primary", "mock.fast.alt", "mock.final.primary", "mock.fallback"] as const;

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
    editState: {},
    updatedAt: now()
  };
}

function state(): StudioState {
  if (!globalStore.__aiVideoStudioMockState) {
    globalStore.__aiVideoStudioMockState = blankState();
  }
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
      qualityFlags: []
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
  refreshProject(current, project.id);
  write(current);
  return {
    project,
    scenes: current.scenes.filter((scene) => scene.projectId === project.id).sort((a, b) => a.order - b.order),
    shots: current.shots.filter((shot) => shot.projectId === project.id).sort((a, b) => a.order - b.order),
    takes: current.takes.filter((take) => take.projectId === project.id),
    generationJobs: current.generationJobs.filter((job) => job.projectId === project.id),
    renderJobs: current.renderJobs.filter((job) => job.projectId === project.id),
    editState: current.editState[project.id] || defaultEditState(project.id),
    credits: current.credits
  };
}

export function estimateCost(action: string, params?: { takeCount?: number }) {
  const table: Record<string, number> = {
    generateShot: 18,
    generateAll: 96,
    regenerate: 12,
    upgradeTake: 22,
    startRender: 48
  };
  return {
    credits: Math.ceil((table[action] || 10) * (params?.takeCount || 1)),
    etaSec: action === "startRender" ? 90 : 25
  };
}

function makeTake(current: StudioState, shot: Shot, tier: Tier, index: number, status: JobStatus = "queued") {
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
    engineUsed: INTERNAL_ENGINES[(shot.order + index) % INTERNAL_ENGINES.length],
    metrics: {},
    createdAt: now()
  };
  current.takes.push(take);
  return take;
}

function makeGenerationJob(current: StudioState, shot: Shot, take: Take, shouldFail: boolean) {
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
    error: null
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

  shot.status = "generating";
  shot.requirements.tier = tier;
  shot.qualityFlags = [];

  for (let index = 0; index < takeCount; index += 1) {
    const take = makeTake(current, shot, tier, index);
    const job = makeGenerationJob(current, shot, take, shouldFailShot);
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
  const take = makeTake(current, shot, "final", current.takes.filter((item) => item.shotId === shot.id).length);
  take.label = "게시용";
  take.upgradeSourceTakeId = source.id;
  take.upgradeMode = options.mode || "final_regenerate";
  const job = makeGenerationJob(current, shot, take, false);
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
      const best = current.takes
        .filter((take) => take.shotId === shot.id && take.status === "done")
        .sort((a, b) => (b.metrics.overall || 0) - (a.metrics.overall || 0))[0];
      if (best) shot.selectedTakeId = best.id;
    }
  }
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
    error: null
  }));
  current.renderJobs.push(...jobs);
  project.status = "rendering";
  current.credits.reserved += jobs.length * 16;
  write(current);
  return { jobs };
}

export function forceDueJobs(kind: "generationJobs" | "renderJobs") {
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

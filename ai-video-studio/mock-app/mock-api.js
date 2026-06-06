(function () {
  const STORAGE_KEY = "cutpilot_mock_state_v1";
  const INTERNAL_ENGINES = [
    "mock.fast.primary",
    "mock.fast.alt",
    "mock.final.primary",
    "mock.fallback"
  ];

  const INTENTS = {
    shorts: { label: "쇼츠", aspect: "9:16", duration: 15 },
    product_ad: { label: "제품 광고", aspect: "9:16", duration: 30 },
    app_intro: { label: "앱 소개", aspect: "16:9", duration: 60 },
    real_estate: { label: "공간 소개", aspect: "16:9", duration: 90 },
    education: { label: "교육", aspect: "16:9", duration: 60 },
    brand: { label: "브랜드 캠페인", aspect: "16:9", duration: 60 }
  };

  function now() {
    return new Date().toISOString();
  }

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function readState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    try {
      return JSON.parse(raw);
    } catch {
      return seedState();
    }
  }

  function writeState(state) {
    state.updatedAt = now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function seedState() {
    const state = {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return seedState();
  }

  function buildStoryboard(project, idea) {
    const sceneSpecs = [
      ["오프닝", "핵심 장면을 빠르게 보여주는 시작"],
      ["디테일", "제품이나 메시지의 강점"],
      ["사용 장면", "실제로 쓰이는 순간"],
      ["마무리", "행동 유도와 최종 컷"]
    ];
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
    const scenes = sceneSpecs.map((spec, index) => ({
      id: uid("scn"),
      projectId: project.id,
      order: index,
      title: spec[0],
      setting: spec[1],
      timeOfDay: index === 0 ? "day" : "auto"
    }));
    const shots = shotNames.map((name, index) => {
      const scene = scenes[Math.min(Math.floor(index / 3), scenes.length - 1)];
      return {
        id: uid("sht"),
        sceneId: scene.id,
        projectId: project.id,
        order: index,
        durationSec: index === 0 ? 2 : 3,
        title: name,
        saec: {
          subject: idea || project.title,
          action: name,
          environment: scene.setting,
          camera: index % 2 === 0 ? "부드러운 푸시인" : "안정적인 트래킹",
          framing: index % 3 === 0 ? "와이드" : "클로즈업",
          lighting: "깨끗하고 자연스러운 조명",
          style: `${INTENTS[project.intent].label}에 맞는 선명한 영상 톤`,
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

  function projectProgress(state, projectId) {
    const shots = state.shots.filter((shot) => shot.projectId === projectId);
    const done = shots.filter((shot) => shot.selectedTakeId || shot.status === "reviewing" || shot.status === "selected").length;
    return { shotsDone: done, shotsTotal: shots.length };
  }

  function refreshProject(state, projectId) {
    const project = state.projects.find((item) => item.id === projectId);
    if (!project) return;
    const shots = state.shots.filter((shot) => shot.projectId === projectId);
    const hasRunning = shots.some((shot) => shot.status === "generating");
    const hasReview = shots.some((shot) => shot.status === "reviewing" || shot.status === "failed");
    const selectedCount = shots.filter((shot) => shot.selectedTakeId).length;
    project.progress = projectProgress(state, projectId);
    project.status = hasRunning ? "generating" : hasReview ? "reviewing" : selectedCount ? "edited" : "storyboarded";
    project.updatedAt = now();
    project.credits.spent = state.credits.spent;
    project.credits.estimateRemaining = Math.max(0, 180 - state.credits.spent);
  }

  function makeTake(state, shot, tier, index, forcedStatus) {
    const take = {
      id: uid("tak"),
      shotId: shot.id,
      projectId: shot.projectId,
      label: `${String.fromCharCode(65 + index)}안`,
      status: forcedStatus || "queued",
      videoUrl: null,
      posterUrl: null,
      durationSec: shot.durationSec,
      tier,
      engineUsed: INTERNAL_ENGINES[(shot.order + index) % INTERNAL_ENGINES.length],
      metrics: {},
      createdAt: now()
    };
    state.takes.push(take);
    return take;
  }

  function makeGenerationJob(state, shot, take, shouldFail) {
    const job = {
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
    state.generationJobs.push(job);
    return job;
  }

  function completeTake(state, take, shot) {
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

  function failTake(take) {
    take.status = "failed";
    take.videoUrl = null;
    take.posterUrl = null;
    take.metrics = { overall: 1 };
  }

  async function createProject(input) {
    await delay(120);
    const state = readState();
    const intent = input.intent || "shorts";
    const preset = INTENTS[intent];
    const project = {
      id: uid("prj"),
      title: input.title || input.idea.slice(0, 20) || "새 영상",
      idea: input.idea || "",
      intent,
      status: "storyboarded",
      aspect: input.advanced?.aspect || preset.aspect,
      targetDurationSec: input.advanced?.durationSec || preset.duration,
      progress: { shotsDone: 0, shotsTotal: 0 },
      characters: [],
      thumbUrl: null,
      credits: { spent: state.credits.spent, estimateRemaining: 180 },
      createdAt: now(),
      updatedAt: now()
    };
    const storyboard = buildStoryboard(project, input.idea || "");
    project.progress = { shotsDone: 0, shotsTotal: storyboard.shots.length };
    state.projects.unshift(project);
    state.scenes.push(...storyboard.scenes);
    state.shots.push(...storyboard.shots);
    state.editState[project.id] = defaultEditState(project.id);
    writeState(state);
    return project;
  }

  async function decomposeIdea(input) {
    await delay(120);
    const project = {
      id: input.projectId || "prj_preview",
      title: input.idea.slice(0, 20) || "스토리보드 미리보기",
      intent: input.intent || "shorts",
      aspect: INTENTS[input.intent || "shorts"].aspect
    };
    return buildStoryboard(project, input.idea || "");
  }

  function defaultEditState(projectId) {
    return {
      projectId,
      captions: { enabled: true, mode: "burn-in", source: "script-first" },
      bgm: { enabled: true, track: "라이선스 확인 사운드", ducking: true },
      voiceover: { enabled: false, voice: "보이스 A", source: "licensed_tts" },
      transitions: "soft",
      commands: []
    };
  }

  async function estimateCost(action, params) {
    await delay(60);
    const table = {
      generateShot: 18,
      generateAll: 96,
      regenerate: 12,
      upgradeTake: 22,
      startRender: 48
    };
    const multiplier = params?.takeCount || 1;
    return {
      credits: Math.ceil((table[action] || 10) * multiplier),
      etaSec: action === "startRender" ? 90 : 25
    };
  }

  async function generateShot(shotId, options = {}) {
    await delay(120);
    const state = readState();
    const shot = state.shots.find((item) => item.id === shotId);
    if (!shot) throw new Error("Shot not found");
    const existingAttempts = state.generationJobs.filter((job) => job.shotId === shotId).length;
    const takeCount = Math.max(1, Math.min(options.takeCount || 3, 3));
    const tier = options.tier || shot.requirements.tier || "fast";
    shot.status = "generating";
    shot.requirements.tier = tier;
    shot.qualityFlags = [];
    const shouldFailShot = existingAttempts === 0 && (shot.order === 4 || shot.order === 8);
    const takes = [];
    const jobs = [];
    for (let index = 0; index < takeCount; index += 1) {
      const take = makeTake(state, shot, tier, index);
      const job = makeGenerationJob(state, shot, take, shouldFailShot);
      takes.push(take);
      jobs.push(job);
    }
    state.credits.reserved += takeCount * 6;
    refreshProject(state, shot.projectId);
    writeState(state);
    return { takes, jobs };
  }

  async function generateAll(projectId, options = {}) {
    await delay(160);
    const state = readState();
    const shots = state.shots.filter((shot) => shot.projectId === projectId);
    writeState(state);
    const queued = [];
    for (const shot of shots) {
      if (shot.status === "pending" || shot.status === "failed") {
        const result = await generateShot(shot.id, { tier: options.tier || "fast", takeCount: 3 });
        queued.push(...result.jobs);
      }
    }
    return { jobs: queued };
  }

  async function selectTake(shotId, takeId) {
    await delay(80);
    const state = readState();
    const shot = state.shots.find((item) => item.id === shotId);
    const take = state.takes.find((item) => item.id === takeId);
    if (!shot || !take || take.status !== "done") throw new Error("Selectable take not found");
    shot.selectedTakeId = takeId;
    shot.status = "selected";
    refreshProject(state, shot.projectId);
    writeState(state);
    return shot;
  }

  async function regenerate(shotId, options = {}) {
    await delay(100);
    const state = readState();
    const shot = state.shots.find((item) => item.id === shotId);
    if (!shot) throw new Error("Shot not found");
    shot.qualityFlags = [{
      axis: "completeness",
      score: 3,
      hint: options.scope === "segment"
        ? "가능한 가장 좁은 범위로 다시 시도합니다. 이전 후보는 보존됩니다."
        : "이 컷만 다시 생성합니다. 이전 후보는 보존됩니다."
    }];
    writeState(state);
    return generateShot(shotId, { tier: shot.requirements.tier, takeCount: 2 });
  }

  async function upgradeTake(takeId, options = {}) {
    await delay(120);
    const state = readState();
    const source = state.takes.find((item) => item.id === takeId);
    if (!source || source.status !== "done") throw new Error("Done take not found");
    const shot = state.shots.find((item) => item.id === source.shotId);
    const take = makeTake(state, shot, "final", state.takes.filter((item) => item.shotId === shot.id).length);
    take.label = "게시용";
    take.upgradeSourceTakeId = source.id;
    take.upgradeMode = options.mode || "final_regenerate";
    const job = makeGenerationJob(state, shot, take, false);
    shot.status = "generating";
    state.credits.reserved += 22;
    refreshProject(state, shot.projectId);
    writeState(state);
    return { take, job };
  }

  async function applyEdit(projectId, command) {
    await delay(100);
    const state = readState();
    const edit = state.editState[projectId] || defaultEditState(projectId);
    if (command) edit.commands.push({ command, createdAt: now() });
    state.editState[projectId] = edit;
    const project = state.projects.find((item) => item.id === projectId);
    if (project) project.status = "edited";
    writeState(state);
    return edit;
  }

  async function setAudio(projectId, patch) {
    await delay(80);
    const state = readState();
    const edit = state.editState[projectId] || defaultEditState(projectId);
    state.editState[projectId] = Object.assign(edit, patch);
    writeState(state);
    return state.editState[projectId];
  }

  async function startRender(projectId, specs) {
    await delay(120);
    const state = readState();
    const project = state.projects.find((item) => item.id === projectId);
    if (!project) throw new Error("Project not found");
    const shots = state.shots.filter((shot) => shot.projectId === projectId);
    for (const shot of shots) {
      if (!shot.selectedTakeId) {
        const best = state.takes
          .filter((take) => take.shotId === shot.id && take.status === "done")
          .sort((a, b) => (b.metrics?.overall || 0) - (a.metrics?.overall || 0))[0];
        if (best) shot.selectedTakeId = best.id;
      }
    }
    const jobs = specs.map((spec, index) => ({
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
    state.renderJobs.push(...jobs);
    project.status = "rendering";
    state.credits.reserved += 48;
    writeState(state);
    return { jobs };
  }

  function tickJobs() {
    const state = readState();
    const t = Date.now();
    let dirty = false;

    for (const job of state.generationJobs) {
      if (job.status === "done" || job.status === "failed" || job.status === "cancelled") continue;
      dirty = true;
      const elapsed = Math.max(0, t - (job.dueAt - 3200));
      job.progress = Math.min(.96, elapsed / 3200);
      job.status = job.progress > .15 ? "running" : "queued";
      job.stage = job.status === "running" ? "provider_generation" : "queued";
      job.etaSec = Math.max(0, Math.ceil((job.dueAt - t) / 1000));
      job.updatedAt = now();
      if (t >= job.dueAt) {
        const take = state.takes.find((item) => item.id === job.takeId);
        const shot = state.shots.find((item) => item.id === job.shotId);
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
            shot.qualityFlags = [{
              axis: "motion",
              score: 2,
              hint: "생성 실패. 이 컷만 다시 시도해도 이전 후보와 다른 컷은 보존됩니다."
            }];
          }
        } else {
          job.status = "done";
          job.progress = 1;
          job.stage = "done";
          if (take && shot) completeTake(state, take, shot);
          if (shot) {
            const doneTakes = state.takes.filter((item) => item.shotId === shot.id && item.status === "done");
            shot.status = "reviewing";
            if (!shot.selectedTakeId && doneTakes.length) {
              shot.selectedTakeId = doneTakes.sort((a, b) => (b.metrics?.overall || 0) - (a.metrics?.overall || 0))[0].id;
            }
            if (shot.order === 4 || shot.order === 8) {
              shot.qualityFlags = [{
                axis: "motion",
                score: 2,
                hint: "모션 흔들림이 의심됩니다. 이 컷만 다시 시도할 수 있습니다."
              }];
            }
          }
          state.credits.reserved = Math.max(0, state.credits.reserved - 6);
          state.credits.spent += 6;
        }
        if (shot) refreshProject(state, shot.projectId);
      }
    }

    for (const job of state.renderJobs) {
      if (job.status === "done" || job.status === "failed" || job.status === "cancelled") continue;
      dirty = true;
      const elapsed = Math.max(0, t - (job.dueAt - 5000));
      job.progress = Math.min(.96, elapsed / 5000);
      job.status = job.progress > .12 ? "running" : "queued";
      job.stage = job.progress > .72 ? "encode" : job.progress > .48 ? "caption_burn" : job.progress > .28 ? "audio_mix" : "assemble";
      job.etaSec = Math.max(0, Math.ceil((job.dueAt - t) / 1000));
      job.updatedAt = now();
      if (t >= job.dueAt) {
        job.status = "done";
        job.progress = 1;
        job.stage = "done";
        job.outputUrl = `mock://render/${job.id}.mp4`;
        job.shareUrl = `mock://share/${job.id}`;
        state.credits.reserved = Math.max(0, state.credits.reserved - 16);
        state.credits.spent += 16;
        const project = state.projects.find((item) => item.id === job.projectId);
        if (project && state.renderJobs.filter((item) => item.projectId === job.projectId).every((item) => item.status === "done")) {
          project.status = "done";
          project.thumbUrl = `mock://poster/${job.id}.jpg`;
        }
      }
    }

    if (dirty) writeState(state);
    return readState();
  }

  function listProjects() {
    const state = readState();
    return state.projects.map((project) => {
      refreshProject(state, project.id);
      return project;
    });
  }

  function getProjectBundle(projectId) {
    const state = readState();
    const project = state.projects.find((item) => item.id === projectId) || state.projects[0] || null;
    if (!project) return null;
    refreshProject(state, project.id);
    writeState(state);
    return {
      project,
      scenes: state.scenes.filter((scene) => scene.projectId === project.id).sort((a, b) => a.order - b.order),
      shots: state.shots.filter((shot) => shot.projectId === project.id).sort((a, b) => a.order - b.order),
      takes: state.takes.filter((take) => take.projectId === project.id),
      generationJobs: state.generationJobs.filter((job) => job.projectId === project.id),
      renderJobs: state.renderJobs.filter((job) => job.projectId === project.id),
      editState: state.editState[project.id] || defaultEditState(project.id),
      credits: state.credits
    };
  }

  window.CutpilotMockApi = {
    INTENTS,
    reset,
    readState,
    listProjects,
    getProjectBundle,
    createProject,
    decomposeIdea,
    estimateCost,
    generateShot,
    generateAll,
    selectTake,
    regenerate,
    upgradeTake,
    applyEdit,
    setAudio,
    startRender,
    tickJobs
  };
}());

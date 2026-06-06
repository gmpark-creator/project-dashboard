(function () {
  const api = window.CutpilotMockApi;
  const view = document.getElementById("view");
  const nav = document.getElementById("nav");
  const pageTitle = document.getElementById("pageTitle");
  const pageSubtitle = document.getElementById("pageSubtitle");
  const creditBalance = document.getElementById("creditBalance");
  const toast = document.getElementById("toast");

  const ui = {
    view: "dashboard",
    selectedProjectId: null,
    selectedShotId: null,
    intent: "shorts"
  };

  const titles = {
    dashboard: ["프로젝트", "진행 중인 영상과 완료된 렌더를 확인합니다"],
    new: ["새 영상", "아이디어와 목적만 정하면 스토리보드를 만듭니다"],
    storyboard: ["스토리보드", "장면과 컷을 확인하고 전체 생성을 시작합니다"],
    compare: ["비교 선택", "컷별 후보를 보고 선택하거나 해당 컷만 다시 시도합니다"],
    edit: ["다듬기", "자막, 사운드, 보이스, 전환을 mock 편집 상태로 저장합니다"],
    export: ["내보내기", "선택된 컷을 여러 길이의 렌더 잡으로 보냅니다"]
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.hidden = true;
    }, 3600);
  }

  function setView(next) {
    ui.view = next;
    nav.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", button.dataset.view === next);
    });
    pageTitle.textContent = titles[next][0];
    pageSubtitle.textContent = titles[next][1];
    render();
  }

  function currentBundle() {
    const projects = api.listProjects();
    if (!ui.selectedProjectId && projects[0]) ui.selectedProjectId = projects[0].id;
    return ui.selectedProjectId ? api.getProjectBundle(ui.selectedProjectId) : null;
  }

  function statusLabel(status) {
    const labels = {
      draft: "초안",
      storyboarded: "스토리보드",
      generating: "생성중",
      reviewing: "검토중",
      edited: "다듬기",
      rendering: "렌더중",
      done: "완료",
      failed: "실패",
      pending: "대기",
      selected: "선택됨",
      queued: "대기",
      running: "진행중"
    };
    return labels[status] || status;
  }

  function tierLabel(tier) {
    return tier === "final" ? "게시용 품질" : tier === "economy" ? "저비용" : "빠른 미리보기";
  }

  function selectedShot(bundle) {
    if (!bundle?.shots.length) return null;
    let shot = bundle.shots.find((item) => item.id === ui.selectedShotId);
    if (!shot) {
      shot = bundle.shots.find((item) => item.status === "failed") || bundle.shots[0];
      ui.selectedShotId = shot.id;
    }
    return shot;
  }

  function progressWidth(project) {
    if (!project.progress.shotsTotal) return 0;
    return Math.round((project.progress.shotsDone / project.progress.shotsTotal) * 100);
  }

  function renderDashboard() {
    const projects = api.listProjects();
    if (!projects.length) {
      return `
        <div class="empty-state">
          <div>
            <h2>아직 영상 프로젝트가 없습니다</h2>
            <p>새 영상을 만들면 mock backend가 스토리보드와 잡 상태를 생성합니다.</p>
            <button type="button" class="primary" data-view="new">새 영상 만들기</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="section-head">
        <div>
          <h2>이어서 작업하기</h2>
          <p>정적 페이지 안에서 Project, Shot, Take, Job 상태가 localStorage에 저장됩니다.</p>
        </div>
        <button type="button" class="primary" data-view="new">새 영상 만들기</button>
      </div>
      <div class="grid project-grid">
        ${projects.map((project) => `
          <article class="project-card">
            <button type="button" data-action="open-project" data-project-id="${project.id}">
              <div class="poster"><span>${escapeHtml(project.aspect)} · ${escapeHtml(statusLabel(project.status))}</span></div>
              <div class="card-body">
                <div class="card-title">
                  <span>${escapeHtml(project.title)}</span>
                  <span class="badge ${project.status === "done" ? "ok" : project.status === "failed" ? "warn" : "fast"}">${escapeHtml(statusLabel(project.status))}</span>
                </div>
                <div class="meta-row">
                  <span>${escapeHtml(api.INTENTS[project.intent].label)}</span>
                  <span>${project.progress.shotsDone}/${project.progress.shotsTotal}컷</span>
                  <span>${project.credits.spent}⚡ 사용</span>
                </div>
                <div class="progress" style="margin-top: 12px"><i style="width:${progressWidth(project)}%"></i></div>
              </div>
            </button>
          </article>
        `).join("")}
      </div>
      <div class="panel" style="margin-top:18px">
        <h2>R1 QA 상태</h2>
        <p class="hint">사용자 화면에는 내부 엔진 이름을 렌더하지 않습니다. 실패 컷은 개별 카드만 막히고, 다른 컷은 계속 진행됩니다.</p>
        <div class="grid qa-grid" style="margin-top:12px">
          <div class="qa-item"><strong>모델명 UI 누출</strong><small id="qaLeakText">렌더 텍스트 기준 0건이어야 함</small></div>
          <div class="qa-item"><strong>부분 실패 격리</strong><small>기본 10컷 중 2컷은 첫 생성에서 실패하도록 mock 주입</small></div>
          <div class="qa-item"><strong>이전 Take 보존</strong><small>재시도/승급은 기존 후보를 삭제하지 않고 새 후보만 추가</small></div>
          <div class="qa-item"><strong>비용 표시</strong><small>생성, 재시도, 승급, 렌더 액션에 ⚡ 비용 표시</small></div>
        </div>
      </div>
    `;
  }

  function renderNew() {
    return `
      <form class="panel" data-form="create-project">
        <h2>무엇을 만들까요?</h2>
        <p class="hint">모델명이나 세부 파라미터 없이 목적과 아이디어만 보냅니다.</p>
        <div class="grid" style="margin-top:16px">
          <label>
            아이디어
            <textarea name="idea">신메뉴 딸기라떼를 소개하는 15초 세로 쇼츠. 밝고 산뜻하며 첫 2초에 시선을 잡아야 한다.</textarea>
          </label>
          <label>
            제목
            <input name="title" value="딸기라떼 쇼츠">
          </label>
        </div>
        <h2 style="margin-top:18px">목적 선택</h2>
        <div class="grid intent-grid" style="margin-top:10px">
          ${Object.entries(api.INTENTS).map(([key, intent]) => `
            <button type="button" class="intent-option ${key === ui.intent ? "active" : ""}" data-action="pick-intent" data-intent="${key}">
              <strong>${escapeHtml(intent.label)}</strong>
              <span>${escapeHtml(intent.aspect)} · ${intent.duration}s 기본</span>
            </button>
          `).join("")}
        </div>
        <div class="button-row" style="margin-top:18px">
          <button type="submit" class="primary">스토리보드 만들기</button>
          <button type="button" class="ghost" data-view="dashboard">취소</button>
        </div>
      </form>
    `;
  }

  function renderStoryboard(bundle) {
    if (!bundle) return renderNoProject();
    const { project, scenes, shots } = bundle;
    return `
      <div class="section-head">
        <div>
          <h2>${escapeHtml(project.title)} · 스토리보드</h2>
          <p>${scenes.length}씬 · ${shots.length}컷 · ${project.targetDurationSec}s 목표</p>
        </div>
        <div class="button-row">
          <button type="button" class="secondary" data-action="estimate" data-cost-action="generateAll">예상 비용 확인</button>
          <button type="button" class="primary" data-action="generate-all">전체 생성 <span class="cost">96⚡</span></button>
        </div>
      </div>
      ${scenes.map((scene) => {
        const sceneShots = shots.filter((shot) => shot.sceneId === scene.id);
        return `
          <section class="scene-block">
            <div class="scene-title">
              <strong>${escapeHtml(scene.title)}</strong>
              <span class="badge">${escapeHtml(sceneShots.length)}컷</span>
            </div>
            <div class="grid shot-grid">
              ${sceneShots.map((shot) => `
                <article class="shot-card">
                  <div class="shot-thumb">${escapeHtml(shot.saec.framing)} · ${shot.durationSec}s</div>
                  <div class="card-title">
                    <span>${escapeHtml(shot.title)}</span>
                    <span class="badge ${shot.status === "failed" ? "warn" : shot.status === "selected" ? "ok" : "fast"}">${escapeHtml(statusLabel(shot.status))}</span>
                  </div>
                  <div class="meta-row">
                    <span>${escapeHtml(tierLabel(shot.requirements.tier))}</span>
                    <span>${shot.requirements.motionHeavy ? "모션 중점" : "일반"}</span>
                    ${shot.requirements.characterLock ? "<span>일관성 잠금</span>" : ""}
                  </div>
                  <p class="hint">${escapeHtml(shot.saec.action)}</p>
                </article>
              `).join("")}
            </div>
          </section>
        `;
      }).join("")}
    `;
  }

  function renderCompare(bundle) {
    if (!bundle) return renderNoProject();
    const shot = selectedShot(bundle);
    const takes = bundle.takes.filter((take) => take.shotId === shot.id);
    return `
      <div class="grid layout-two">
        <aside class="panel">
          <h2>컷 목록</h2>
          <p class="hint">${bundle.project.progress.shotsDone}/${bundle.project.progress.shotsTotal}컷 검토 가능</p>
          <div class="shot-list" style="margin-top:12px">
            ${bundle.shots.map((item) => `
              <button type="button" class="${item.id === shot.id ? "active" : ""}" data-action="select-shot" data-shot-id="${item.id}">
                <span>${item.order + 1}. ${escapeHtml(item.title)}</span>
                <span class="badge ${item.status === "failed" ? "warn" : item.selectedTakeId ? "ok" : "fast"}">${escapeHtml(statusLabel(item.status))}</span>
              </button>
            `).join("")}
          </div>
        </aside>
        <section class="panel">
          <div class="section-head">
            <div>
              <h2>컷 ${shot.order + 1} · ${escapeHtml(shot.title)}</h2>
              <p>${escapeHtml(shot.saec.subject)} · ${escapeHtml(shot.saec.action)}</p>
            </div>
            <span class="badge ${shot.status === "failed" ? "warn" : "fast"}">${escapeHtml(statusLabel(shot.status))}</span>
          </div>
          ${takes.length ? `
            <div class="grid take-grid">
              ${takes.map((take) => renderTakeCard(shot, take)).join("")}
            </div>
          ` : `
            <div class="empty-state">
              <div>
                <strong>아직 후보가 없습니다</strong>
                <p>이 컷만 생성해서 후보를 볼 수 있습니다.</p>
              </div>
            </div>
          `}
          ${shot.qualityFlags.length ? `
            <div class="notice">${escapeHtml(shot.qualityFlags[0].hint)}</div>
          ` : ""}
          <div class="button-row" style="margin-top:14px">
            <button type="button" class="secondary" data-action="generate-shot" data-shot-id="${shot.id}">이 컷 생성 <span class="cost">18⚡</span></button>
            <button type="button" class="secondary" data-action="regenerate-shot" data-shot-id="${shot.id}" data-scope="shot">이 컷만 다시 <span class="cost">12⚡</span></button>
            <button type="button" class="secondary" data-action="regenerate-shot" data-shot-id="${shot.id}" data-scope="segment">가능한 좁은 범위로 다시</button>
            ${shot.selectedTakeId ? `<button type="button" class="primary" data-action="upgrade-take" data-take-id="${shot.selectedTakeId}">게시용 품질로 다듬기 <span class="cost">22⚡</span></button>` : ""}
            <button type="button" class="ghost" data-view="edit">다듬기로 이동</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderTakeCard(shot, take) {
    const selected = shot.selectedTakeId === take.id;
    const status = take.status;
    const progressClass = status === "failed" ? "failed" : selected ? "selected" : "";
    return `
      <article class="take-card ${progressClass}">
        <button type="button" data-action="select-take" data-shot-id="${shot.id}" data-take-id="${take.id}" ${status !== "done" ? "disabled" : ""}>
          <div class="video-poster">
            <span>${escapeHtml(take.label)} · ${escapeHtml(statusLabel(status))}</span>
          </div>
          <div class="take-footer">
            <strong>${escapeHtml(take.label)}</strong>
            <span class="badge ${status === "done" ? selected ? "ok" : "fast" : status === "failed" ? "warn" : "fast"}">
              ${status === "done" ? selected ? "선택됨" : "이걸로" : status === "failed" ? "실패" : "생성중"}
            </span>
          </div>
          <div class="card-body" style="padding-top:0">
            <div class="progress"><i style="width:${status === "done" || status === "failed" ? 100 : 48}%"></i></div>
            <div class="meta-row">
              <span>${escapeHtml(tierLabel(take.tier))}</span>
              <span>품질 ${take.metrics?.overall || "-"}</span>
            </div>
          </div>
        </button>
      </article>
    `;
  }

  function renderEdit(bundle) {
    if (!bundle) return renderNoProject();
    const edit = bundle.editState;
    const selected = bundle.shots.filter((shot) => shot.selectedTakeId).length;
    return `
      <div class="grid layout-edit">
        <div class="panel">
          <div class="edit-player">
            <div>
              <strong>${selected}컷 연결 미리보기</strong>
              <p class="hint">실제 렌더는 내보내기에서 생성됩니다.</p>
            </div>
          </div>
        </div>
        <section class="panel">
          <div class="section-head">
            <div>
              <h2>다듬기</h2>
              <p>자막과 사운드는 라이선스 확인된 소스만 사용한다는 전제로 저장됩니다.</p>
            </div>
            <button type="button" class="primary" data-view="export">내보내기</button>
          </div>
          <form data-form="apply-edit">
            <label>
              대화형 편집 명령
              <input name="command" placeholder="예) 마지막 컷에 CTA를 2초 더 길게 보여줘">
            </label>
            <div class="button-row" style="margin-top:12px">
              <button type="submit" class="secondary">편집 상태 저장</button>
              <button type="button" class="ghost" data-action="toggle-captions">${edit.captions.enabled ? "자막 끄기" : "자막 켜기"}</button>
              <button type="button" class="ghost" data-action="toggle-bgm">${edit.bgm.enabled ? "BGM 끄기" : "BGM 켜기"}</button>
              <button type="button" class="ghost" data-action="toggle-voice">${edit.voiceover.enabled ? "보이스 끄기" : "보이스 켜기"}</button>
            </div>
          </form>
          <div class="notice">
            라이선스 확인된 사운드만 기본 제공됩니다. 사용자 업로드 파일은 사용자가 권리를 확인해야 합니다.
          </div>
          <div class="timeline">
            <div class="timeline-row">
              <span>컷</span>
              ${bundle.shots.slice(0, 8).map((shot) => `<span class="clip">${shot.order + 1}</span>`).join("")}
            </div>
            <div class="timeline-row"><span>BGM</span><span class="audio-strip"></span></div>
            <div class="timeline-row"><span>자막</span><span class="audio-strip"></span></div>
          </div>
          <div class="grid qa-grid" style="margin-top:14px">
            <div class="qa-item"><strong>자막</strong><small>${edit.captions.enabled ? "번인 기본, script-first" : "비활성"}</small></div>
            <div class="qa-item"><strong>BGM</strong><small>${edit.bgm.enabled ? edit.bgm.track : "비활성"}</small></div>
            <div class="qa-item"><strong>보이스</strong><small>${edit.voiceover.enabled ? edit.voiceover.voice : "비활성"}</small></div>
          </div>
        </section>
      </div>
    `;
  }

  function renderExport(bundle) {
    if (!bundle) return renderNoProject();
    return `
      <div class="grid layout-export">
        <section class="panel">
          <h2>내보내기 형식</h2>
          <p class="hint">4K는 기본 보장 기능이 아니라 내보내기/업스케일 옵션입니다.</p>
          <form data-form="start-render" style="margin-top:16px">
            <label>
              해상도
              <select name="resolution">
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="4k">4K 내보내기 옵션</option>
              </select>
            </label>
            <label style="margin-top:12px">
              자막
              <select name="caption">
                <option value="burn-in">번인</option>
                <option value="srt">SRT 별도</option>
                <option value="both">둘 다</option>
              </select>
            </label>
            <div class="button-row" style="margin-top:16px">
              <button type="submit" class="primary">렌더 시작 <span class="cost">48⚡</span></button>
              <button type="button" class="ghost" data-action="estimate" data-cost-action="startRender">비용 확인</button>
            </div>
          </form>
        </section>
        <section class="panel">
          <h2>렌더 잡</h2>
          <div class="render-list" style="margin-top:12px">
            ${bundle.renderJobs.length ? bundle.renderJobs.map((job) => `
              <div class="render-row">
                <strong>${escapeHtml(job.spec.resolution)} · ${escapeHtml(job.spec.cut)}</strong>
                <div>
                  <div class="progress"><i style="width:${Math.round(job.progress * 100)}%"></i></div>
                  <div class="meta-row"><span>${escapeHtml(statusLabel(job.status))}</span><span>${escapeHtml(job.stage)}</span><span>${job.etaSec ?? 0}s</span></div>
                </div>
                ${job.status === "done" ? `<span class="badge ok">다운로드 준비</span>` : `<span class="badge fast">진행</span>`}
              </div>
            `).join("") : `
              <div class="empty-state"><div><strong>아직 렌더 잡이 없습니다</strong><p>렌더를 시작하면 6s, 15s, 30s 세 잡이 병렬 생성됩니다.</p></div></div>
            `}
          </div>
        </section>
      </div>
    `;
  }

  function renderNoProject() {
    return `
      <div class="empty-state">
        <div>
          <h2>선택된 프로젝트가 없습니다</h2>
          <button type="button" class="primary" data-view="new">새 영상 만들기</button>
        </div>
      </div>
    `;
  }

  function render() {
    api.tickJobs();
    const state = api.readState();
    creditBalance.textContent = `${Math.max(0, state.credits.balance - state.credits.reserved)} ⚡`;
    const bundle = currentBundle();
    if (ui.view === "dashboard") view.innerHTML = renderDashboard();
    if (ui.view === "new") view.innerHTML = renderNew();
    if (ui.view === "storyboard") view.innerHTML = renderStoryboard(bundle);
    if (ui.view === "compare") view.innerHTML = renderCompare(bundle);
    if (ui.view === "edit") view.innerHTML = renderEdit(bundle);
    if (ui.view === "export") view.innerHTML = renderExport(bundle);
  }

  async function handleAction(target) {
    const action = target.dataset.action;
    if (!action) return;
    const bundle = currentBundle();
    try {
      if (action === "reset-demo") {
        api.reset();
        ui.selectedProjectId = null;
        ui.selectedShotId = null;
        setView("dashboard");
        showToast("데모 상태를 초기화했습니다.");
      }
      if (action === "open-project") {
        ui.selectedProjectId = target.dataset.projectId;
        ui.selectedShotId = null;
        setView("storyboard");
      }
      if (action === "pick-intent") {
        ui.intent = target.dataset.intent;
        render();
      }
      if (action === "estimate") {
        const estimate = await api.estimateCost(target.dataset.costAction, { takeCount: 1 });
        showToast(`예상 비용 ${estimate.credits}⚡, 예상 시간 ${estimate.etaSec}초입니다.`);
      }
      if (action === "generate-all" && bundle) {
        await api.generateAll(bundle.project.id, { tier: "fast" });
        setView("compare");
        showToast("전체 컷 생성을 시작했습니다. 실패 컷은 개별 카드로 표시됩니다.");
      }
      if (action === "select-shot") {
        ui.selectedShotId = target.dataset.shotId;
        render();
      }
      if (action === "generate-shot") {
        await api.generateShot(target.dataset.shotId, { tier: "fast", takeCount: 3 });
        showToast("이 컷 생성 잡을 큐에 넣었습니다.");
        render();
      }
      if (action === "regenerate-shot") {
        await api.regenerate(target.dataset.shotId, { scope: target.dataset.scope });
        showToast("이전 후보를 보존하고 새 후보를 생성합니다.");
        render();
      }
      if (action === "select-take") {
        await api.selectTake(target.dataset.shotId, target.dataset.takeId);
        showToast("선택한 후보를 이 컷의 기준으로 저장했습니다.");
        render();
      }
      if (action === "upgrade-take") {
        await api.upgradeTake(target.dataset.takeId, { mode: "final_regenerate" });
        showToast("게시용 품질로 다시 다듬는 잡을 시작했습니다.");
        render();
      }
      if (action === "toggle-captions" && bundle) {
        await api.setAudio(bundle.project.id, { captions: { ...bundle.editState.captions, enabled: !bundle.editState.captions.enabled } });
        render();
      }
      if (action === "toggle-bgm" && bundle) {
        await api.setAudio(bundle.project.id, { bgm: { ...bundle.editState.bgm, enabled: !bundle.editState.bgm.enabled } });
        render();
      }
      if (action === "toggle-voice" && bundle) {
        await api.setAudio(bundle.project.id, { voiceover: { ...bundle.editState.voiceover, enabled: !bundle.editState.voiceover.enabled } });
        render();
      }
    } catch (error) {
      showToast(error.message || "작업 중 오류가 발생했습니다.");
    }
  }

  async function handleSubmit(form) {
    if (form.dataset.form === "create-project") {
      const data = new FormData(form);
      const project = await api.createProject({
        title: data.get("title"),
        idea: data.get("idea"),
        intent: ui.intent
      });
      ui.selectedProjectId = project.id;
      ui.selectedShotId = null;
      setView("storyboard");
      showToast("스토리보드를 만들었습니다.");
    }
    if (form.dataset.form === "apply-edit") {
      const bundle = currentBundle();
      const data = new FormData(form);
      await api.applyEdit(bundle.project.id, data.get("command"));
      showToast("편집 명령을 저장했습니다.");
      render();
    }
    if (form.dataset.form === "start-render") {
      const bundle = currentBundle();
      const data = new FormData(form);
      const baseSpec = {
        resolution: data.get("resolution"),
        aspect: bundle.project.aspect,
        caption: data.get("caption")
      };
      await api.startRender(bundle.project.id, [
        { ...baseSpec, cut: "6s" },
        { ...baseSpec, cut: "15s" },
        { ...baseSpec, cut: "30s" }
      ]);
      showToast("렌더 잡 3개를 시작했습니다.");
      render();
    }
  }

  nav.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-view]");
    if (button) setView(button.dataset.view);
  });

  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest("button[data-view]");
    if (viewButton && !viewButton.closest("#nav")) {
      setView(viewButton.dataset.view);
      return;
    }
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) handleAction(actionButton);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    handleSubmit(form);
  });

  setInterval(render, 1200);
  render();
}());

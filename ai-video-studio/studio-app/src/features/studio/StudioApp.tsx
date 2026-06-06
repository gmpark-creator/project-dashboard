"use client";

import { useEffect, useMemo, useState } from "react";
import { INTENT_TEMPLATES } from "@/domain/templates";
import type { Intent, Project, ProjectBundle, Shot, Take } from "@/domain/types";
import { studioApi } from "./api";

type View = "dashboard" | "new" | "storyboard" | "compare" | "edit" | "export";

const titles: Record<View, [string, string]> = {
  dashboard: ["프로젝트", "진행 중인 영상과 완료된 렌더를 확인합니다"],
  new: ["새 영상", "아이디어와 목적만 정하면 스토리보드를 만듭니다"],
  storyboard: ["스토리보드", "장면과 컷을 확인하고 전체 생성을 시작합니다"],
  compare: ["비교 선택", "컷별 후보를 보고 선택하거나 해당 컷만 다시 시도합니다"],
  edit: ["다듬기", "자막, 사운드, 보이스, 전환을 저장합니다"],
  export: ["내보내기", "선택된 컷을 여러 길이의 렌더 잡으로 보냅니다"]
};

function statusLabel(status: string) {
  return (
    {
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
    }[status] || status
  );
}

function tierLabel(tier: string) {
  return tier === "final" ? "게시용 품질" : tier === "economy" ? "저비용" : "빠른 미리보기";
}

function progress(project: Project) {
  if (!project.progress.shotsTotal) return 0;
  return Math.round((project.progress.shotsDone / project.progress.shotsTotal) * 100);
}

export function StudioApp() {
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [bundle, setBundle] = useState<ProjectBundle | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [intent, setIntent] = useState<Intent>("shorts");
  const [toast, setToast] = useState("");

  const selectedShot = useMemo(() => {
    if (!bundle?.shots.length) return null;
    return bundle.shots.find((shot) => shot.id === selectedShotId) || bundle.shots.find((shot) => shot.status === "failed") || bundle.shots[0];
  }, [bundle, selectedShotId]);

  async function refresh(projectId = selectedProjectId) {
    const list = await studioApi.listProjects();
    setProjects(list.projects);
    const id = projectId || list.projects[0]?.id || null;
    if (!id) {
      setBundle(null);
      return;
    }
    setSelectedProjectId(id);
    setBundle(await studioApi.getBundle(id));
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    refresh().catch((error) => notify(error.message));
    const id = window.setInterval(async () => {
      await studioApi.tick();
      await refresh();
    }, 1200);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      await action();
      notify(message);
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "작업 중 오류가 발생했습니다.");
    }
  }

  const creditBalance = bundle ? Math.max(0, bundle.credits.balance - bundle.credits.reserved) : 1240;

  return (
    <div className="shell">
      {toast ? <div className="toast">{toast}</div> : null}
      <aside className="rail">
        <div className="brand">
          <span className="mark">CP</span>
          <span>
            <strong>Cutpilot</strong>
            <small>Next mock app</small>
          </span>
        </div>
        <nav className="nav" aria-label="제작 흐름">
          {(Object.keys(titles) as View[]).map((key) => (
            <button key={key} type="button" className={view === key ? "active" : ""} onClick={() => setView(key)}>
              {titles[key][0]}
            </button>
          ))}
        </nav>
        <div className="rail-footer">
          <div className="credit-box">
            <span>크레딧</span>
            <strong>{creditBalance} ⚡</strong>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{titles[view][0]}</h1>
            <p>{titles[view][1]}</p>
          </div>
          <span className="hint">자동 저장됨</span>
        </header>
        <section className="view">
          {view === "dashboard" ? (
            <Dashboard
              projects={projects}
              onNew={() => setView("new")}
              onOpen={async (projectId) => {
                setSelectedProjectId(projectId);
                setSelectedShotId(null);
                setBundle(await studioApi.getBundle(projectId));
                setView("storyboard");
              }}
            />
          ) : null}
          {view === "new" ? (
            <NewProject
              intent={intent}
              setIntent={setIntent}
              onCreate={(input) =>
                run(async () => {
                  const project = await studioApi.createProject(input);
                  setSelectedProjectId(project.id);
                  setSelectedShotId(null);
                  setBundle(await studioApi.getBundle(project.id));
                  setView("storyboard");
                }, "스토리보드를 만들었습니다.")
              }
            />
          ) : null}
          {view === "storyboard" ? (
            <Storyboard
              bundle={bundle}
              onGenerate={() => bundle && run(() => studioApi.generateAll(bundle.project.id), "전체 컷 생성을 시작했습니다.")}
              onCompare={() => setView("compare")}
            />
          ) : null}
          {view === "compare" ? (
            <Compare
              bundle={bundle}
              selectedShot={selectedShot}
              selectedShotId={selectedShotId}
              setSelectedShotId={setSelectedShotId}
              onGenerate={(shotId) => run(() => studioApi.generateShot(shotId), "이 컷 생성 잡을 시작했습니다.")}
              onRegenerate={(shotId, scope) => run(() => studioApi.regenerate(shotId, scope), "이전 후보를 보존하고 새 후보를 생성합니다.")}
              onSelect={(shotId, takeId) => run(() => studioApi.selectTake(shotId, takeId), "선택한 후보를 저장했습니다.")}
              onUpgrade={(takeId) => run(() => studioApi.upgradeTake(takeId), "게시용 품질로 다시 다듬는 잡을 시작했습니다.")}
              onEdit={() => setView("edit")}
            />
          ) : null}
          {view === "edit" ? <Edit bundle={bundle} onExport={() => setView("export")} /> : null}
          {view === "export" ? (
            <ExportView
              bundle={bundle}
              onRender={(resolution) =>
                bundle &&
                run(
                  () =>
                    studioApi.startRender(bundle.project.id, [
                      { resolution, cut: "6s", aspect: bundle.project.aspect, caption: "burn-in" },
                      { resolution, cut: "15s", aspect: bundle.project.aspect, caption: "burn-in" },
                      { resolution, cut: "30s", aspect: bundle.project.aspect, caption: "burn-in" }
                    ]),
                  "렌더 잡 3개를 시작했습니다."
                )
              }
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}

function Dashboard({ projects, onNew, onOpen }: { projects: Project[]; onNew: () => void; onOpen: (projectId: string) => void }) {
  if (!projects.length) {
    return (
      <div className="empty">
        <div>
          <h2>아직 영상 프로젝트가 없습니다</h2>
          <p>새 영상을 만들면 mock API가 스토리보드와 잡 상태를 생성합니다.</p>
          <button type="button" className="primary" onClick={onNew}>
            새 영상 만들기
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="head">
        <div>
          <h2>이어서 작업하기</h2>
          <p className="hint">Next API route와 mock service가 상태를 관리합니다.</p>
        </div>
        <button type="button" className="primary" onClick={onNew}>
          새 영상 만들기
        </button>
      </div>
      <div className="grid projects">
        {projects.map((project) => (
          <article className="card" key={project.id}>
            <button type="button" onClick={() => onOpen(project.id)}>
              <div className="poster">{project.aspect}</div>
              <div className="body">
                <strong>{project.title}</strong>
                <div className="meta">
                  <span className={`badge ${project.status === "done" ? "ok" : project.status === "failed" ? "warn" : "fast"}`}>{statusLabel(project.status)}</span>
                  <span>{INTENT_TEMPLATES[project.intent].label}</span>
                  <span>
                    {project.progress.shotsDone}/{project.progress.shotsTotal}컷
                  </span>
                </div>
                <div className="progress" style={{ marginTop: 12 }}>
                  <i style={{ width: `${progress(project)}%` }} />
                </div>
              </div>
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function NewProject({
  intent,
  setIntent,
  onCreate
}: {
  intent: Intent;
  setIntent: (intent: Intent) => void;
  onCreate: (input: { title: string; idea: string; intent: Intent }) => void;
}) {
  const [title, setTitle] = useState("딸기라떼 쇼츠");
  const [idea, setIdea] = useState("신메뉴 딸기라떼를 소개하는 15초 세로 쇼츠. 밝고 산뜻하며 첫 2초에 시선을 잡아야 한다.");
  return (
    <div className="panel">
      <h2>무엇을 만들까요?</h2>
      <p className="hint">모델명이나 세부 파라미터 없이 목적과 아이디어만 보냅니다.</p>
      <div className="grid" style={{ marginTop: 16 }}>
        <label>
          아이디어
          <textarea value={idea} onChange={(event) => setIdea(event.target.value)} />
        </label>
        <label>
          제목
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
      </div>
      <h2 style={{ marginTop: 18 }}>목적 선택</h2>
      <div className="grid intent-grid" style={{ marginTop: 10 }}>
        {Object.values(INTENT_TEMPLATES).map((template) => (
          <button key={template.intent} type="button" className={`intent ${intent === template.intent ? "active" : ""}`} onClick={() => setIntent(template.intent)}>
            <strong>{template.label}</strong>
            <span className="hint">
              {template.defaults.aspect} · {template.defaults.durationSec}s 기본
            </span>
          </button>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="primary" onClick={() => onCreate({ title, idea, intent })}>
          스토리보드 만들기
        </button>
      </div>
    </div>
  );
}

function Storyboard({ bundle, onGenerate, onCompare }: { bundle: ProjectBundle | null; onGenerate: () => void; onCompare: () => void }) {
  if (!bundle) return <NoProject />;
  return (
    <>
      <div className="head">
        <div>
          <h2>{bundle.project.title} · 스토리보드</h2>
          <p className="hint">
            {bundle.scenes.length}씬 · {bundle.shots.length}컷 · {bundle.project.targetDurationSec}s 목표
          </p>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button type="button" className="primary" onClick={onGenerate}>
            전체 생성 <span className="cost">96⚡</span>
          </button>
          <button type="button" className="secondary" onClick={onCompare}>
            비교 화면
          </button>
        </div>
      </div>
      {bundle.scenes.map((scene) => (
        <section className="scene" key={scene.id}>
          <div className="head">
            <strong>{scene.title}</strong>
            <span className="badge">{bundle.shots.filter((shot) => shot.sceneId === scene.id).length}컷</span>
          </div>
          <div className="grid shot-grid">
            {bundle.shots
              .filter((shot) => shot.sceneId === scene.id)
              .map((shot) => (
                <article className="panel shot" key={shot.id}>
                  <div className="shot-thumb">{shot.saec.framing}</div>
                  <strong>{shot.title}</strong>
                  <div className="meta">
                    <span className={`badge ${shot.status === "failed" ? "warn" : shot.selectedTakeId ? "ok" : "fast"}`}>{statusLabel(shot.status)}</span>
                    <span>{tierLabel(shot.requirements.tier)}</span>
                  </div>
                  <p className="hint">{shot.saec.action}</p>
                </article>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}

function Compare({
  bundle,
  selectedShot,
  selectedShotId,
  setSelectedShotId,
  onGenerate,
  onRegenerate,
  onSelect,
  onUpgrade,
  onEdit
}: {
  bundle: ProjectBundle | null;
  selectedShot: Shot | null;
  selectedShotId: string | null;
  setSelectedShotId: (shotId: string) => void;
  onGenerate: (shotId: string) => void;
  onRegenerate: (shotId: string, scope: "shot" | "segment") => void;
  onSelect: (shotId: string, takeId: string) => void;
  onUpgrade: (takeId: string) => void;
  onEdit: () => void;
}) {
  if (!bundle || !selectedShot) return <NoProject />;
  const takes = bundle.takes.filter((take) => take.shotId === selectedShot.id);
  return (
    <div className="grid two">
      <aside className="panel">
        <h2>컷 목록</h2>
        <div className="shot-list" style={{ marginTop: 12 }}>
          {bundle.shots.map((shot) => (
            <button key={shot.id} type="button" className={shot.id === selectedShotId ? "active" : ""} onClick={() => setSelectedShotId(shot.id)}>
              <span>
                {shot.order + 1}. {shot.title}
              </span>
              <span className={`badge ${shot.status === "failed" ? "warn" : shot.selectedTakeId ? "ok" : "fast"}`}>{statusLabel(shot.status)}</span>
            </button>
          ))}
        </div>
      </aside>
      <section className="panel">
        <div className="head">
          <div>
            <h2>컷 {selectedShot.order + 1} · {selectedShot.title}</h2>
            <p className="hint">{selectedShot.saec.action}</p>
          </div>
          <span className={`badge ${selectedShot.status === "failed" ? "warn" : "fast"}`}>{statusLabel(selectedShot.status)}</span>
        </div>
        <div className="grid take-grid">
          {takes.map((take) => (
            <TakeCard key={take.id} shot={selectedShot} take={take} onSelect={onSelect} />
          ))}
        </div>
        {!takes.length ? <div className="empty">아직 후보가 없습니다. 이 컷만 생성해 후보를 볼 수 있습니다.</div> : null}
        {selectedShot.qualityFlags[0] ? <div className="notice">{selectedShot.qualityFlags[0].hint}</div> : null}
        <div className="actions">
          <button type="button" className="secondary" onClick={() => onGenerate(selectedShot.id)}>
            이 컷 생성 <span className="cost">18⚡</span>
          </button>
          <button type="button" className="secondary" onClick={() => onRegenerate(selectedShot.id, "shot")}>
            이 컷만 다시 <span className="cost">12⚡</span>
          </button>
          <button type="button" className="secondary" onClick={() => onRegenerate(selectedShot.id, "segment")}>
            가능한 좁은 범위로 다시
          </button>
          {selectedShot.selectedTakeId ? (
            <button type="button" className="primary" onClick={() => onUpgrade(selectedShot.selectedTakeId as string)}>
              게시용 품질로 다듬기 <span className="cost">22⚡</span>
            </button>
          ) : null}
          <button type="button" className="ghost" onClick={onEdit}>
            다듬기
          </button>
        </div>
      </section>
    </div>
  );
}

function TakeCard({ shot, take, onSelect }: { shot: Shot; take: Take; onSelect: (shotId: string, takeId: string) => void }) {
  const selected = shot.selectedTakeId === take.id;
  return (
    <article className={`take ${selected ? "selected" : ""} ${take.status === "failed" ? "failed" : ""}`}>
      <button type="button" disabled={take.status !== "done"} onClick={() => onSelect(shot.id, take.id)}>
        <div className="video">{take.label}</div>
        <div className="take-footer">
          <strong>{take.label}</strong>
          <span className={`badge ${take.status === "failed" ? "warn" : selected ? "ok" : "fast"}`}>{take.status === "done" ? (selected ? "선택됨" : "이걸로") : statusLabel(take.status)}</span>
        </div>
        <div className="body" style={{ paddingTop: 0 }}>
          <div className="progress">
            <i style={{ width: take.status === "done" || take.status === "failed" ? "100%" : "48%" }} />
          </div>
          <div className="meta">
            <span>{tierLabel(take.tier)}</span>
            <span>품질 {take.metrics.overall || "-"}</span>
          </div>
        </div>
      </button>
    </article>
  );
}

function Edit({ bundle, onExport }: { bundle: ProjectBundle | null; onExport: () => void }) {
  if (!bundle) return <NoProject />;
  const selectedCount = bundle.shots.filter((shot) => shot.selectedTakeId).length;
  return (
    <div className="grid edit-grid">
      <div className="panel">
        <div className="player">
          <div>
            <strong>{selectedCount}컷 연결 미리보기</strong>
            <p className="hint">실제 렌더는 내보내기에서 생성됩니다.</p>
          </div>
        </div>
      </div>
      <section className="panel">
        <div className="head">
          <div>
            <h2>다듬기</h2>
            <p className="hint">자막과 사운드는 라이선스 확인된 소스만 사용한다는 전제로 저장됩니다.</p>
          </div>
          <button type="button" className="primary" onClick={onExport}>
            내보내기
          </button>
        </div>
        <label>
          대화형 편집 명령
          <input placeholder="예) 마지막 컷에 CTA를 2초 더 길게 보여줘" />
        </label>
        <div className="notice">라이선스 확인된 사운드만 기본 제공됩니다. 사용자 업로드 파일은 사용자가 권리를 확인해야 합니다.</div>
      </section>
    </div>
  );
}

function ExportView({ bundle, onRender }: { bundle: ProjectBundle | null; onRender: (resolution: "720p" | "1080p" | "4k") => void }) {
  const [resolution, setResolution] = useState<"720p" | "1080p" | "4k">("1080p");
  if (!bundle) return <NoProject />;
  return (
    <div className="grid export-grid">
      <section className="panel">
        <h2>내보내기 형식</h2>
        <p className="hint">4K는 기본 보장 기능이 아니라 내보내기/업스케일 옵션입니다.</p>
        <label style={{ marginTop: 16 }}>
          해상도
          <select value={resolution} onChange={(event) => setResolution(event.target.value as "720p" | "1080p" | "4k")}>
            <option value="1080p">1080p</option>
            <option value="720p">720p</option>
            <option value="4k">4K 내보내기 옵션</option>
          </select>
        </label>
        <div className="actions">
          <button type="button" className="primary" onClick={() => onRender(resolution)}>
            렌더 시작 <span className="cost">48⚡</span>
          </button>
        </div>
      </section>
      <section className="panel">
        <h2>렌더 잡</h2>
        <div className="grid" style={{ marginTop: 12 }}>
          {bundle.renderJobs.map((job) => (
            <div className="row-card render-row" key={job.id}>
              <strong>
                {job.spec.resolution} · {job.spec.cut}
              </strong>
              <div style={{ flex: 1 }}>
                <div className="progress">
                  <i style={{ width: `${Math.round(job.progress * 100)}%` }} />
                </div>
                <div className="meta">
                  <span>{statusLabel(job.status)}</span>
                  <span>{job.stage}</span>
                </div>
              </div>
              <span className={`badge ${job.status === "done" ? "ok" : "fast"}`}>{job.status === "done" ? "다운로드 준비" : "진행"}</span>
            </div>
          ))}
          {!bundle.renderJobs.length ? <div className="empty">아직 렌더 잡이 없습니다.</div> : null}
        </div>
      </section>
    </div>
  );
}

function NoProject() {
  return <div className="empty">선택된 프로젝트가 없습니다.</div>;
}

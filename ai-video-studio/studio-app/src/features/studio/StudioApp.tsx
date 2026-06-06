"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INTENT_TEMPLATES } from "@/domain/templates";
import type { AssetUsage, DirectionSpec, ImageAsset, ImageAssetRole, ImageMakerPurpose, Intent, Project, ProjectBundle, RenderJob, Shot, Take } from "@/domain/types";
import { studioApi } from "./api";

type View = "dashboard" | "images" | "assets" | "new" | "storyboard" | "compare" | "edit" | "export";

const titles: Record<View, [string, string]> = {
  dashboard: ["프로젝트", "진행 중인 비주얼 프로젝트와 완료된 렌더를 확인합니다"],
  images: ["Image Maker", "영상 재료가 될 제품, 인물, 배경, 스타일 이미지를 만듭니다"],
  assets: ["Asset Library", "생성 이미지와 외부 이미지를 분류하고 영상 컷에 연결합니다"],
  new: ["Video Maker", "아이디어와 목적만 정하면 스토리보드를 만듭니다"],
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
      reviewing: "선택 필요",
      edited: "다듬기 완료",
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

const roleLabels: Record<ImageAssetRole, string> = {
  product: "제품",
  character: "인물/캐릭터",
  location: "장소",
  style: "스타일",
  keyframe: "첫 프레임",
  thumbnail: "썸네일",
  logo: "로고",
  background: "배경"
};

const purposeLabels: Record<ImageMakerPurpose, string> = {
  photoreal: "사진급 실사",
  product: "제품 이미지",
  character: "인물/캐릭터",
  background: "배경",
  style: "스타일",
  poster: "포스터/글자",
  thumbnail: "썸네일",
  transparent: "투명 이미지"
};

// 용도(purpose)별 기본 보관 분류(role). 사용자가 직접 바꾸지 않으면 용도에 맞춰 자동 지정.
const purposeToRole: Record<ImageMakerPurpose, ImageAssetRole> = {
  photoreal: "product",
  product: "product",
  character: "character",
  background: "background",
  style: "style",
  poster: "logo",
  thumbnail: "thumbnail",
  transparent: "product"
};

type ScoreLabel = "추천" | "안정적" | "확인 필요";

function scoreBadgeClass(score: ScoreLabel) {
  return score === "추천" ? "ok" : score === "안정적" ? "fast" : "warn";
}

function imageJobStageLabel(stage: string) {
  return (
    {
      queued: "대기 중",
      prompting: "요구사항 정리 중",
      generating: "이미지 만드는 중",
      saving: "Asset Library에 저장 중",
      done: "완료",
      failed: "실패"
    }[stage] || stage
  );
}

function shotStatusLabel(shot: Shot) {
  if (shot.selectedTakeId) return "선택됨";
  return statusLabel(shot.status);
}

function qualityLabel(take: Take) {
  if (take.status === "failed") return "다시 시도 필요";
  if (take.status !== "done") return "확인 중";
  const score = take.metrics.overall || 0;
  if (score >= 4.5) return "추천";
  if (score >= 4) return "안정적";
  if (score >= 3) return "확인 필요";
  return "재시도 권장";
}

function formatSeconds(sec: number) {
  const rounded = Math.round(sec);
  if (rounded < 60) return `${rounded}초`;
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return seconds ? `${minutes}분 ${seconds}초` : `${minutes}분`;
}

function renderStageLabel(job: RenderJob) {
  if (job.status === "queued") return "대기 중";
  if (job.status === "failed") return "내보내기 실패";
  if (job.status === "done") return "";
  const stages: Record<RenderJob["stage"], string> = {
    assemble: "컷 합치는 중",
    audio_mix: "소리 입히는 중",
    caption_burn: "자막 입히는 중",
    encode: "마무리 인코딩 중",
    upscale: "고해상도 처리 중",
    done: ""
  };
  return stages[job.stage] || "진행 중";
}

function progress(project: Project) {
  if (!project.progress.shotsTotal) return 0;
  return Math.round((project.progress.shotsDone / project.progress.shotsTotal) * 100);
}

function nextViewForBundle(nextBundle: ProjectBundle) {
  if (nextBundle.project.status === "rendering" || nextBundle.project.status === "done" || nextBundle.renderJobs.length) return "export";
  const selectedCount = nextBundle.shots.filter((shot) => shot.selectedTakeId).length;
  if (selectedCount && selectedCount === nextBundle.shots.length) return "edit";
  if (nextBundle.takes.length || nextBundle.shots.some((shot) => shot.status === "failed" || shot.status === "reviewing" || shot.status === "generating")) return "compare";
  return "storyboard";
}

export function StudioApp() {
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [bundle, setBundle] = useState<ProjectBundle | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [intent, setIntent] = useState<Intent>("shorts");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);

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

  function clearToast() {
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    setToast("");
  }

  function notify(message: string) {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => {
      setToast("");
      toastTimer.current = null;
    }, 2600);
  }

  function goToView(nextView: View) {
    clearToast();
    setView(nextView);
  }

  useEffect(() => {
    refresh().catch((error) => notify(error.message));
    const id = window.setInterval(async () => {
      await studioApi.tick();
      await refresh();
    }, 1200);
    return () => {
      window.clearInterval(id);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const projectTitle = bundle?.project.title ? ` · ${bundle.project.title}` : "";
    document.title = `${titles[view][0]}${projectTitle} | Cutpilot`;
  }, [bundle?.project.title, view]);

  async function run(action: () => Promise<unknown>, message: string) {
    try {
      await action();
      notify(message);
      await refresh();
    } catch (error) {
      notify(error instanceof Error ? error.message : "작업 중 오류가 발생했습니다.");
    }
  }

  function targetShotId() {
    return selectedShot?.id || bundle?.shots[0]?.id || null;
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
            <small>AI 영상 제작 스튜디오</small>
          </span>
        </div>
        <nav className="nav" aria-label="제작 흐름">
          {(Object.keys(titles) as View[]).map((key) => (
            <button key={key} type="button" className={view === key ? "active" : ""} onClick={() => goToView(key)}>
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
          <div className="topbar-actions">
            <span className="credit-pill">{creditBalance} ⚡</span>
            <span className="hint">자동 저장됨</span>
          </div>
        </header>
        <section className="view">
          {view === "dashboard" ? (
            <Dashboard
              projects={projects}
              onNew={() => goToView("new")}
              onImages={() => goToView("images")}
              onOpen={async (projectId) => {
                setSelectedProjectId(projectId);
                setSelectedShotId(null);
                const nextBundle = await studioApi.getBundle(projectId);
                setBundle(nextBundle);
                if (nextBundle) {
                  setSelectedShotId(nextBundle.shots.find((shot) => shot.status === "failed")?.id || nextBundle.shots[0]?.id || null);
                  goToView(nextViewForBundle(nextBundle));
                }
              }}
            />
          ) : null}
          {view === "images" ? (
            <ImageMaker
              bundle={bundle}
              onGenerate={(input) => bundle && run(() => studioApi.createImageJob(bundle.project.id, input), "이미지 후보 생성을 시작했습니다.")}
              onUseAsset={(assetId, mode) => {
                const shotId = targetShotId();
                if (!shotId) {
                  notify("먼저 영상 프로젝트를 만들면 이미지를 컷 참조로 연결할 수 있습니다.");
                  return;
                }
                run(() => studioApi.attachImageToShot(shotId, { assetId, mode }), "이미지를 영상 컷 참조로 연결했습니다.");
              }}
            />
          ) : null}
          {view === "assets" ? (
            <AssetLibrary
              bundle={bundle}
              onRegister={(input) => bundle && run(() => studioApi.registerExternalImage(bundle.project.id, input), "외부 이미지를 Asset Library에 등록했습니다.")}
              onUseAsset={(assetId, mode) => {
                const shotId = targetShotId();
                if (!shotId) {
                  notify("먼저 영상 프로젝트를 만들면 이미지를 컷 참조로 연결할 수 있습니다.");
                  return;
                }
                run(() => studioApi.attachImageToShot(shotId, { assetId, mode }), "이미지를 영상 컷 참조로 연결했습니다.");
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
                  goToView("storyboard");
                }, "스토리보드를 만들었습니다.")
              }
            />
          ) : null}
          {view === "storyboard" ? (
            <Storyboard
              bundle={bundle}
              onGenerate={() => bundle && run(() => studioApi.generateAll(bundle.project.id), "전체 컷 생성을 시작했습니다.")}
              onCompare={() => goToView("compare")}
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
              onUpdateDirection={(shotId, patch) => run(() => studioApi.updateShotDirection(shotId, patch), "컷 연출 지시를 저장했습니다.")}
              onEdit={() => goToView("edit")}
            />
          ) : null}
          {view === "edit" ? <Edit bundle={bundle} onExport={() => goToView("export")} /> : null}
          {view === "export" ? (
            <ExportView
              bundle={bundle}
              onRender={(resolution, caption) =>
                bundle &&
                run(
                  () =>
                    studioApi.startRender(bundle.project.id, [
                      { resolution, cut: "6s", aspect: bundle.project.aspect, caption },
                      { resolution, cut: "15s", aspect: bundle.project.aspect, caption },
                      { resolution, cut: "30s", aspect: bundle.project.aspect, caption }
                    ]),
                  "렌더 잡 3개를 시작했습니다."
                )
              }
              onRenderAction={notify}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}

function Dashboard({
  projects,
  onNew,
  onImages,
  onOpen
}: {
  projects: Project[];
  onNew: () => void;
  onImages: () => void;
  onOpen: (projectId: string) => void;
}) {
  if (!projects.length) {
    return (
      <div className="empty">
        <div>
          <h2>아직 비주얼 프로젝트가 없습니다</h2>
          <p>먼저 Video Maker에서 프로젝트를 만들면 이미지와 영상 재료를 함께 관리할 수 있습니다.</p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <button type="button" className="primary" onClick={onNew}>
              Video Maker 시작
            </button>
            <button type="button" className="secondary" onClick={onImages}>
              Image Maker 보기
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="head">
        <div>
          <h2>이어서 작업하기</h2>
          <p className="hint">프로젝트 상태와 렌더 진행률을 확인합니다.</p>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button type="button" className="secondary" onClick={onImages}>
            Image Maker
          </button>
          <button type="button" className="primary" onClick={onNew}>
            Video Maker
          </button>
        </div>
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

function ImageMaker({
  bundle,
  onGenerate,
  onUseAsset
}: {
  bundle: ProjectBundle | null;
  onGenerate: (input: { prompt: string; purpose: ImageMakerPurpose; role: ImageAssetRole; aspect: Project["aspect"]; style?: string; count?: number }) => void;
  onUseAsset: (assetId: string, mode: AssetUsage["mode"]) => void;
}) {
  const [prompt, setPrompt] = useState("투명 컵의 딸기라떼 제품 이미지. 밝은 카페 배경, 딸기 과육과 얼음이 잘 보이게, 손은 나오지 않게.");
  const [purpose, setPurpose] = useState<ImageMakerPurpose>("product");
  const [roleOverride, setRoleOverride] = useState<ImageAssetRole | null>(null);
  const [style, setStyle] = useState("밝고 깨끗한 프리미엄 광고 사진");
  // 보관 분류는 용도에서 자동 파생하되, 사용자가 직접 지정하면 그 값을 우선한다. 제출에는 항상 유효한 role이 들어간다.
  const role = roleOverride ?? purposeToRole[purpose];
  if (!bundle) {
    return (
      <div className="empty">
        <div>
          <h2>프로젝트가 필요합니다</h2>
          <p>Image Maker에서 만든 이미지는 프로젝트의 Asset Library에 저장되고 Video Maker에서 재료로 사용됩니다.</p>
        </div>
      </div>
    );
  }
  const imageMakerAssets = bundle.imageAssets.filter((asset) => asset.source === "image_maker");
  // 승격된 후보 자산에 원본 변형의 체감 라벨(추천/안정적/확인 필요)을 연결해 카드에 노출한다.
  const scoreByAssetId: Record<string, ScoreLabel> = {};
  for (const job of bundle.imageJobs) {
    for (const variant of job.variants) {
      if (variant.assetId) scoreByAssetId[variant.assetId] = variant.scoreLabel;
    }
  }
  return (
    <div className="grid image-grid">
      <section className="panel">
        <h2>이미지 만들기</h2>
        <p className="hint">제품, 인물, 배경, 스타일 이미지를 먼저 만든 뒤 영상 컷의 참조 이미지로 보낼 수 있습니다.</p>
        <label style={{ marginTop: 16 }}>
          이미지 지시
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </label>
        <div className="grid two-compact" style={{ marginTop: 12 }}>
          <label>
            용도
            <select value={purpose} onChange={(event) => setPurpose(event.target.value as ImageMakerPurpose)}>
              {Object.entries(purposeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            보관 분류
            {roleOverride === null ? (
              <span className="role-auto">
                <span>{roleLabels[role]} <small>· 용도에 맞춰 자동</small></span>
                <button type="button" className="linklike" onClick={() => setRoleOverride(role)}>
                  직접 지정
                </button>
              </span>
            ) : (
              <span className="role-auto">
                <select value={role} onChange={(event) => setRoleOverride(event.target.value as ImageAssetRole)}>
                  {Object.entries(roleLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <button type="button" className="linklike" onClick={() => setRoleOverride(null)}>
                  자동으로
                </button>
              </span>
            )}
          </label>
        </div>
        <label style={{ marginTop: 12 }}>
          스타일
          <input value={style} onChange={(event) => setStyle(event.target.value)} />
        </label>
        <div className="notice">모델명은 노출하지 않습니다. 이 화면은 목적과 지시만 받고, 실제 이미지 엔진 선택은 백엔드 라우팅이 담당합니다.</div>
        <div className="actions">
          <button type="button" className="primary" onClick={() => onGenerate({ prompt, purpose, role, aspect: bundle.project.aspect, style, count: 4 })}>
            이미지 후보 만들기 <span className="cost">24⚡</span>
          </button>
        </div>
      </section>
      <section className="panel">
        <h2>이미지 후보와 저장된 재료</h2>
        <div className="grid" style={{ marginTop: 12 }}>
          {bundle.imageJobs.map((job) => (
            <div className="row-card" key={job.id}>
              <div>
                <strong>{purposeLabels[job.purpose]}</strong>
                <p className="hint">{imageJobStageLabel(job.stage)} · {Math.round(job.progress * 100)}%</p>
              </div>
              <span className={`badge ${job.status === "done" ? "ok" : "fast"}`}>{statusLabel(job.status)}</span>
            </div>
          ))}
        </div>
        <AssetGrid assets={imageMakerAssets} onUseAsset={onUseAsset} scoreByAssetId={scoreByAssetId} />
      </section>
    </div>
  );
}

function AssetLibrary({
  bundle,
  onRegister,
  onUseAsset
}: {
  bundle: ProjectBundle | null;
  onRegister: (input: { label: string; role: ImageAssetRole; url: string; aspect?: Project["aspect"]; prompt?: string; rightsConfirmed?: boolean }) => void;
  onUseAsset: (assetId: string, mode: AssetUsage["mode"]) => void;
}) {
  const [label, setLabel] = useState("외부 인물 참조");
  const [url, setUrl] = useState("https://example.com/reference-image.png");
  const [role, setRole] = useState<ImageAssetRole>("character");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  if (!bundle) return <NoProject />;
  return (
    <div className="grid image-grid">
      <section className="panel">
        <h2>외부 이미지 등록</h2>
        <p className="hint">다른 툴에서 만든 이미지나 직접 촬영한 사진을 등록해 Video Maker의 참조 이미지로 사용할 수 있습니다.</p>
        <div className="grid" style={{ marginTop: 16 }}>
          <label>
            이미지 이름
            <input value={label} onChange={(event) => setLabel(event.target.value)} />
          </label>
          <label>
            이미지 URL
            <input value={url} onChange={(event) => setUrl(event.target.value)} />
          </label>
          <label>
            분류
            <select value={role} onChange={(event) => setRole(event.target.value as ImageAssetRole)}>
              {Object.entries(roleLabels).map(([key, itemLabel]) => (
                <option key={key} value={key}>
                  {itemLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="check-row">
            <input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} />
            이 이미지의 사용 권리와 인물 동의를 확인했습니다.
          </label>
        </div>
        <div className="notice">사람 사진, 브랜드 로고, 외부 생성 이미지는 사용 권리와 동의를 확인한 뒤 영상 재료로 사용해야 합니다.</div>
        <div className="actions">
          <button type="button" className="primary" onClick={() => onRegister({ label, role, url, aspect: bundle.project.aspect, rightsConfirmed })}>
            Asset Library에 등록
          </button>
        </div>
      </section>
      <section className="panel">
        <h2>Reference Board</h2>
        <p className="hint">
          제품 {bundle.referenceBoard.productImages.length} · 인물 {bundle.referenceBoard.characterImages.length} · 스타일 {bundle.referenceBoard.styleImages.length} · 첫 프레임{" "}
          {bundle.referenceBoard.keyframes.length}
        </p>
        <AssetGrid assets={bundle.imageAssets} onUseAsset={onUseAsset} />
      </section>
    </div>
  );
}

const referenceModeByRole: Partial<Record<ImageAssetRole, AssetUsage["mode"]>> = {
  character: "character_reference",
  product: "product_reference",
  background: "background_reference",
  location: "background_reference"
};

function referenceModeForRole(role: ImageAssetRole): AssetUsage["mode"] {
  return referenceModeByRole[role] ?? "style_reference";
}

// 실제 전송되는 참조 mode 기준의 사람이 읽는 라벨. tooltip이 동작과 어긋나지 않도록 mode로 산출한다.
const referenceModeLabel: Record<AssetUsage["mode"], string> = {
  first_frame: "시작 화면(첫 프레임)",
  last_frame: "마지막 화면",
  style_reference: "스타일",
  character_reference: "인물",
  product_reference: "제품",
  background_reference: "배경"
};

function AssetGrid({
  assets,
  onUseAsset,
  scoreByAssetId
}: {
  assets: ImageAsset[];
  onUseAsset: (assetId: string, mode: AssetUsage["mode"]) => void;
  scoreByAssetId?: Record<string, ScoreLabel>;
}) {
  if (!assets.length) return <div className="empty compact-empty">아직 저장된 이미지 재료가 없습니다.</div>;
  return (
    <div className="grid asset-grid" style={{ marginTop: 12 }}>
      {assets.map((asset) => {
        const score = scoreByAssetId?.[asset.id];
        return (
          <article className="asset-card" key={asset.id}>
            <div className="asset-thumb">
              <strong>{roleLabels[asset.role]}</strong>
              <span>{asset.aspect}</span>
            </div>
            <div className="body">
              <strong>{asset.label}</strong>
              <div className="meta">
                {score ? <span className={`badge ${scoreBadgeClass(score)}`}>{score}</span> : null}
                <span className="badge fast">{asset.source === "image_maker" ? "Image Maker" : "외부 이미지"}</span>
                <span>{asset.rights.status === "needs_review" ? "권리 확인 필요" : "사용 가능"}</span>
              </div>
              <div className="actions">
                <button type="button" className="secondary" title="이 이미지를 영상 컷의 시작 화면(첫 프레임)으로 사용합니다." onClick={() => onUseAsset(asset.id, "first_frame")}>
                  첫 프레임
                </button>
                <button type="button" className="secondary" title={`이 이미지를 영상 컷의 ${referenceModeLabel[referenceModeForRole(asset.role)]} 참조로 연결합니다.`} onClick={() => onUseAsset(asset.id, referenceModeForRole(asset.role))}>
                  참조로 사용
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
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
  const [error, setError] = useState("");

  function submit() {
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) {
      setError("아이디어를 입력해 주세요.");
      return;
    }
    setError("");
    onCreate({ title: title.trim(), idea: trimmedIdea, intent });
  }

  return (
    <div className="panel">
      <h2>무엇을 만들까요?</h2>
      <p className="hint">모델명이나 세부 파라미터 없이 목적과 아이디어만 보냅니다.</p>
      <div className="grid" style={{ marginTop: 16 }}>
        <label>
          아이디어
          <textarea
            value={idea}
            aria-invalid={error ? "true" : "false"}
            onChange={(event) => {
              setIdea(event.target.value);
              if (error && event.target.value.trim()) setError("");
            }}
          />
          {error ? <span className="field-error">{error}</span> : null}
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
        <button type="button" className="primary" onClick={submit}>
          스토리보드 만들기
        </button>
      </div>
    </div>
  );
}

function Storyboard({ bundle, onGenerate, onCompare }: { bundle: ProjectBundle | null; onGenerate: () => void; onCompare: () => void }) {
  if (!bundle) return <NoProject />;
  const activeGeneration = bundle.generationJobs.some((job) => job.status === "queued" || job.status === "running");
  const generatableShots = bundle.shots.filter((shot) => shot.status === "pending" || shot.status === "failed");
  const hasGeneratedTakes = bundle.takes.length > 0;
  const canGenerate = !activeGeneration && generatableShots.length > 0;
  const generateCost = hasGeneratedTakes ? Math.max(12, generatableShots.length * 18) : 96;
  const generateLabel = activeGeneration ? "생성 중" : canGenerate ? (hasGeneratedTakes ? "남은 컷 생성" : "전체 생성") : "전체 생성 완료";
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
          <button type="button" className="primary" disabled={!canGenerate} onClick={onGenerate}>
            {generateLabel} {canGenerate ? <span className="cost">{generateCost}⚡</span> : null}
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
                    <span className={`badge ${shot.status === "failed" ? "warn" : shot.selectedTakeId ? "ok" : "fast"}`}>{shotStatusLabel(shot)}</span>
                    <span>{tierLabel(shot.requirements.tier)}</span>
                    {shot.referenceImageIds.length ? <span>{shot.referenceImageIds.length}개 이미지 참조</span> : null}
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
  onUpdateDirection,
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
  onUpdateDirection: (shotId: string, patch: Partial<DirectionSpec>) => void;
  onEdit: () => void;
}) {
  if (!bundle || !selectedShot) return <NoProject />;
  const takes = bundle.takes.filter((take) => take.shotId === selectedShot.id);
  const referenceAssets = bundle.imageAssets.filter((asset) => selectedShot.referenceImageIds.includes(asset.id));
  const hasTakes = takes.length > 0;
  const isFailed = selectedShot.status === "failed";
  const isGenerating = selectedShot.status === "generating" || takes.some((take) => take.status === "queued" || take.status === "running");
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
              <span className={`badge ${shot.status === "failed" ? "warn" : shot.selectedTakeId ? "ok" : "fast"}`}>{shotStatusLabel(shot)}</span>
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
          <span className={`badge ${selectedShot.status === "failed" ? "warn" : selectedShot.selectedTakeId ? "ok" : "fast"}`}>{shotStatusLabel(selectedShot)}</span>
        </div>
        <div className="grid take-grid">
          {takes.map((take) => (
            <TakeCard key={take.id} shot={selectedShot} take={take} onSelect={onSelect} />
          ))}
        </div>
        {!takes.length ? <div className="empty">아직 후보가 없습니다. 이 컷만 생성해 후보를 볼 수 있습니다.</div> : null}
        <DirectionPanel shot={selectedShot} referenceAssets={referenceAssets} onUpdate={onUpdateDirection} />
        {selectedShot.qualityFlags[0] ? <div className="notice">{selectedShot.qualityFlags[0].hint}</div> : null}
        <div className="actions">
          {!hasTakes ? (
            <button type="button" className="primary" disabled={isGenerating} onClick={() => onGenerate(selectedShot.id)}>
              이 컷 생성 <span className="cost">18⚡</span>
            </button>
          ) : (
            <button type="button" className={isFailed ? "primary" : "secondary"} disabled={isGenerating} onClick={() => onRegenerate(selectedShot.id, "shot")}>
              이 컷만 다시 <span className="cost">12⚡</span>
            </button>
          )}
          {hasTakes ? (
            <button type="button" className="secondary" disabled={isGenerating} onClick={() => onRegenerate(selectedShot.id, "segment")}>
              가능한 좁은 범위로 다시 <span className="cost">~12⚡</span>
            </button>
          ) : null}
          {selectedShot.selectedTakeId ? (
            <button
              type="button"
              className="primary"
              title="선택한 컷을 게시용 고품질로 다시 다듬어요. 크레딧이 사용돼요."
              onClick={() => onUpgrade(selectedShot.selectedTakeId as string)}
            >
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

function DirectionPanel({
  shot,
  referenceAssets,
  onUpdate
}: {
  shot: Shot;
  referenceAssets: ImageAsset[];
  onUpdate: (shotId: string, patch: Partial<DirectionSpec>) => void;
}) {
  const [notes, setNotes] = useState(shot.directionSpec.notes);
  const [motion, setMotion] = useState(shot.directionSpec.motion);

  useEffect(() => {
    setNotes(shot.directionSpec.notes);
    setMotion(shot.directionSpec.motion);
  }, [shot.id, shot.directionSpec.motion, shot.directionSpec.notes]);

  return (
    <section className="direction-box">
      <div className="head">
        <div>
          <h2>컷별 연출 지시</h2>
          <p className="hint">이미지 참조와 카메라 움직임을 함께 저장해, 이 이미지를 바탕으로 영상 컷을 만듭니다.</p>
        </div>
        <span className="badge">{referenceAssets.length}개 참조</span>
      </div>
      {referenceAssets.length ? (
        <div className="reference-strip">
          {referenceAssets.map((asset) => (
            <span key={asset.id} className="reference-chip">
              {roleLabels[asset.role]} · {asset.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="hint">Image Maker나 Asset Library에서 이미지를 선택해 이 컷의 첫 프레임, 인물, 제품, 스타일 참조로 연결할 수 있습니다.</p>
      )}
      <div className="grid two-compact" style={{ marginTop: 12 }}>
        <label>
          움직임
          <input value={motion} onChange={(event) => setMotion(event.target.value)} />
        </label>
        <label>
          연출 메모
          <input value={notes} placeholder="예) 컵 표면 물방울을 강조하고 손은 나오지 않게" onChange={(event) => setNotes(event.target.value)} />
        </label>
      </div>
      <div className="actions">
        <button type="button" className="secondary" onClick={() => onUpdate(shot.id, { motion, notes })}>
          연출 지시 저장
        </button>
      </div>
    </section>
  );
}

function TakeCard({ shot, take, onSelect }: { shot: Shot; take: Take; onSelect: (shotId: string, takeId: string) => void }) {
  const selected = shot.selectedTakeId === take.id;
  return (
    <article className={`take ${selected ? "selected" : ""} ${take.status === "failed" ? "failed" : ""}`}>
      <button type="button" disabled={take.status !== "done"} onClick={() => onSelect(shot.id, take.id)}>
        <div className="video">
          <strong>{take.label}</strong>
          <span>{take.status === "done" ? "미리보기 준비 중" : take.status === "failed" ? "다시 시도 필요" : "생성 중"}</span>
        </div>
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
            <span>{qualityLabel(take)}</span>
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

function ExportView({
  bundle,
  onRender,
  onRenderAction
}: {
  bundle: ProjectBundle | null;
  onRender: (resolution: "720p" | "1080p" | "4k", caption: "none" | "burn-in" | "srt" | "both") => void;
  onRenderAction: (message: string) => void;
}) {
  const [resolution, setResolution] = useState<"720p" | "1080p" | "4k">("1080p");
  const [caption, setCaption] = useState<"none" | "burn-in" | "srt" | "both">("burn-in");
  if (!bundle) return <NoProject />;
  const activeRender = bundle.renderJobs.some((job) => job.status === "queued" || job.status === "running");
  const hasRendered = bundle.renderJobs.some((job) => job.status === "done");
  // rightsReview/renderPlan은 startRender 시점 스냅샷이라 렌더 잡에만 존재한다. 가장 최근 잡을
  // 내보내기 점검 요약으로 삼는다(같은 배치의 잡들은 동일 스냅샷을 공유). 컷 제목 역참조 맵으로
  // missingShotId를 사람이 읽는 컷 이름으로 바꾼다.
  const latestJob = bundle.renderJobs.length ? bundle.renderJobs[bundle.renderJobs.length - 1] : null;
  const shotTitleById = new Map(bundle.shots.map((shot) => [shot.id, shot.title] as const));
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
        <label style={{ marginTop: 16 }}>
          자막
          <select value={caption} onChange={(event) => setCaption(event.target.value as "none" | "burn-in" | "srt" | "both")}>
            <option value="burn-in">자막을 영상에 새기기</option>
            <option value="srt">자막 파일만 따로 받기</option>
            <option value="both">영상 자막 + 자막 파일</option>
            <option value="none">자막 없음</option>
          </select>
        </label>
        <div className="notice">내보내기 시작 전 예상 비용은 48⚡, 예상 시간은 약 90초입니다. 선택한 컷과 편집 설정은 그대로 보존됩니다.</div>
        <div className="actions">
          <button type="button" className="primary" disabled={activeRender} onClick={() => onRender(resolution, caption)}>
            {activeRender ? "내보내는 중" : hasRendered ? "다시 내보내기" : "렌더 시작"} {!activeRender ? <span className="cost">48⚡</span> : null}
          </button>
        </div>
      </section>
      <section className="panel">
        <h2>렌더 잡</h2>
        {latestJob ? <RenderPreflight job={latestJob} shotTitleById={shotTitleById} /> : null}
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
                  {renderStageLabel(job) ? <span>{renderStageLabel(job)}</span> : null}
                </div>
              </div>
              {job.status === "done" ? (
                <div className="render-actions">
                  <button type="button" className="secondary" onClick={() => onRenderAction("미리보기 화면을 준비했습니다.")}>
                    미리보기
                  </button>
                  <button type="button" className="secondary" onClick={() => onRenderAction("다운로드 링크를 준비했습니다.")}>
                    다운로드
                  </button>
                  <button type="button" className="secondary" onClick={() => onRenderAction("공유 링크를 클립보드에 복사할 수 있습니다.")}>
                    공유
                  </button>
                </div>
              ) : (
                <span className="badge fast">진행</span>
              )}
            </div>
          ))}
          {!bundle.renderJobs.length ? <div className="empty">아직 렌더 잡이 없습니다.</div> : null}
        </div>
      </section>
    </div>
  );
}

function RenderPreflight({ job, shotTitleById }: { job: RenderJob; shotTitleById: Map<string, string> }) {
  const plan = job.renderPlan;
  const rights = job.rightsReview;
  const missing = plan.missingShotIds;
  return (
    <div className="preflight" aria-label="내보내기 점검">
      <div className="preflight-row">
        <span className="preflight-key">렌더 구성</span>
        <span className="preflight-val">
          <strong>{plan.shots.length}컷</strong> 연결 · 전체 약 {formatSeconds(plan.totalDurationSec)}
        </span>
      </div>
      {missing.length ? (
        <div className="preflight-flag warn-flag">
          <strong>빠지는 컷 {missing.length}개</strong>
          <p>아직 선택된 결과가 없어 이번 내보내기에는 포함되지 않습니다. 비교 화면에서 후보를 선택하면 다음 렌더에 합쳐집니다.</p>
          <ul>
            {missing.map((shotId) => (
              <li key={shotId}>{shotTitleById.get(shotId) || shotId}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="preflight-flag ok-flag">선택된 컷이 빠짐없이 이번 렌더에 포함되었습니다.</div>
      )}
      {rights.required ? (
        <div className="preflight-flag warn-flag">
          <strong>권리 확인 필요 {rights.items.length}건</strong>
          <p>아래 이미지의 사용 권리와 인물 동의를 확인한 뒤 게시하세요. 외부 등록 이미지는 직접 확인이 필요합니다.</p>
          <ul>
            {rights.items.map((item) => (
              <li key={item.assetId}>
                <span className="preflight-item-head">
                  {roleLabels[item.role]} · {item.label}
                  <span className="preflight-shotcount">{item.targetShotIds.length}개 컷에 사용</span>
                </span>
                {item.note ? <small>{item.note}</small> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="preflight-flag ok-flag">권리 확인 완료 · 별도 점검이 필요한 외부 이미지가 없습니다.</div>
      )}
    </div>
  );
}

function NoProject() {
  return <div className="empty">선택된 프로젝트가 없습니다.</div>;
}

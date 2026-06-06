"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INTENT_TEMPLATES } from "@/domain/templates";
import type { Aspect, AssetUsage, CreditTransaction, DirectionSpec, EditState, ExportSpec, ImageAsset, ImageAssetRole, ImageMakerPurpose, Intent, JobStatus, Project, ProjectBundle, RenderJob, RenderPlan, RenderPreview, RenderRightsReview, Saec, Shot, Take } from "@/domain/types";
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
      running: "진행중",
      cancelled: "취소됨"
    }[status] || status
  );
}

// 잡 상태별 배지 톤. 취소됨은 실패(빨강)와 구분해 중립(기본 회색) 배지로 보여준다 — 운영자가
// "사용자/시스템이 멈춘 작업"과 "엔진 오류로 실패한 작업"을 한눈에 구분할 수 있어야 한다.
function jobBadgeTone(status: JobStatus) {
  if (status === "done") return "ok";
  if (status === "failed") return "warn";
  if (status === "cancelled") return "";
  return "fast";
}

// 진행 중(대기/진행)인 잡을 취소하는 공통 버튼. 요청이 떠 있는 동안에는 전체 취소 버튼을 잠가
// 중복 취소를 막고(busy), 누른 버튼만 "취소 중…"으로 바꾼다. 내부 잡 id·모델명은 노출하지 않는다.
function CancelJobButton({
  jobId,
  canceling,
  busy,
  onCancel,
  className = "ghost"
}: {
  jobId: string;
  canceling: boolean;
  busy: boolean;
  onCancel: (jobId: string) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`${className} cancel-job`}
      disabled={busy}
      title="진행 중인 작업을 멈추고 예약한 크레딧을 돌려받습니다."
      onClick={() => onCancel(jobId)}
    >
      {canceling ? "취소 중…" : "작업 취소"}
    </button>
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

// 프로젝트 비율(9:16 등)을 CSS aspect-ratio 값("9 / 16")으로 변환한다. 미리보기 프레임이 컷의
// 실제 비율을 따르도록 해, 세로 영상이 모바일에서 과도하게 길어지지 않게 max-height와 함께 쓴다.
function aspectRatioCss(aspect: Aspect) {
  return aspect.replace(":", " / ");
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

// 크레딧 거래의 action(서버 내부 식별자)을 운영자용 한국어 작업 이름으로 바꾼다. 사용자에게
// generateImages/startRender 같은 내부 식별자나 잡/프로바이더/모델 id는 노출하지 않는다.
const creditActionLabels: Record<CreditTransaction["action"], string> = {
  generateImages: "이미지 후보 생성",
  generateShot: "영상 컷 생성",
  upgradeTake: "게시용 품질 업그레이드",
  startRender: "영상 내보내기"
};

// 거래 종류(reserve/capture/refund)별 라벨·배지 톤. 예약=보류(시안), 사용 확정=실제 차감(골드),
// 환불=되돌려줌(초록). 톤만으로 방향을 읽을 수 있게 해 사인(+/−) 혼동을 피한다.
const creditKindMeta: Record<CreditTransaction["kind"], { label: string; tone: string }> = {
  reserve: { label: "예약", tone: "fast" },
  capture: { label: "사용 확정", tone: "spend" },
  refund: { label: "환불", tone: "ok" }
};

// 거래 시각을 "방금 / N분 전 / N시간 전 / N일 전"의 짧은 상대 시간으로 표시한다. 운영 화면에서
// 빠르게 훑기 좋고, 정확한 타임스탬프(초 단위)는 굳이 노출하지 않는다.
function formatLedgerTime(iso: string) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.round((Date.now() - then) / 1000);
  if (diffSec < 60) return "방금";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  return `${day}일 전`;
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
  // 취소 요청이 떠 있는 동안의 잡 id(또는 배치 취소 시 첫 잡 id). 값이 있으면 모든 취소 버튼을 잠가
  // 중복 취소를 막고, 해당 버튼만 "취소 중…"으로 표시한다.
  const [cancelingJobId, setCancelingJobId] = useState<string | null>(null);
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

  // 진행 중인 잡 하나를 취소한다. 요청 중에는 cancelingJobId로 버튼을 잠그고, 성공/실패와 무관하게
  // 끝나면 번들을 새로고침해 화면이 실제 상태(취소됨/이미 완료)를 반영하게 한다. 환불 크레딧이 있으면
  // 토스트로 함께 안내한다. 이미 끝난 잡(409)·없는 잡(404)은 친절한 한국어 안내로 흡수한다.
  async function cancelJob(jobId: string) {
    if (cancelingJobId) return;
    setCancelingJobId(jobId);
    try {
      const result = await studioApi.cancelJob(jobId);
      if (result.cancelled) {
        notify(result.refundedCredits > 0 ? `작업을 취소하고 예약한 ${result.refundedCredits}⚡를 돌려드렸습니다.` : "작업을 취소했습니다.");
      } else {
        notify("이미 끝난 작업이라 취소할 수 없습니다.");
      }
    } catch {
      notify("작업을 취소하지 못했습니다. 이미 끝났을 수 있어 화면을 새로고침합니다.");
    } finally {
      await refresh().catch(() => {});
      setCancelingJobId(null);
    }
  }

  // 진행 중인 잡 여러 개를 한 번에 취소한다(스토리보드 전체 생성 중 일괄 취소). 개별 실패는 건너뛰고
  // 취소 건수·환불 합계를 모아 한 번만 안내한다. 첫 잡 id로 busy 상태를 잡아 다른 취소 버튼도 잠근다.
  async function cancelActiveJobs(jobIds: string[]) {
    if (!jobIds.length || cancelingJobId) return;
    setCancelingJobId(jobIds[0]);
    let cancelledCount = 0;
    let refunded = 0;
    try {
      for (const id of jobIds) {
        try {
          const result = await studioApi.cancelJob(id);
          if (result.cancelled) {
            cancelledCount += 1;
            refunded += result.refundedCredits;
          }
        } catch {
          // 이미 끝난 잡은 건너뛴다.
        }
      }
      if (cancelledCount) {
        notify(refunded > 0 ? `생성 작업 ${cancelledCount}건을 취소하고 ${refunded}⚡를 돌려드렸습니다.` : `생성 작업 ${cancelledCount}건을 취소했습니다.`);
      } else {
        notify("취소할 진행 중 작업이 없습니다.");
      }
    } finally {
      await refresh().catch(() => {});
      setCancelingJobId(null);
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
              cancelingJobId={cancelingJobId}
              onCancelJob={cancelJob}
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
              selectedShotId={selectedShotId}
              setSelectedShotId={setSelectedShotId}
              canceling={cancelingJobId !== null}
              onCancelGeneration={() =>
                bundle &&
                cancelActiveJobs(
                  bundle.generationJobs.filter((job) => job.status === "queued" || job.status === "running").map((job) => job.id)
                )
              }
              onGenerate={() => bundle && run(() => studioApi.generateAll(bundle.project.id), "전체 컷 생성을 시작했습니다.")}
              onSaveShot={(patch) => bundle && run(() => studioApi.updateStoryboard(bundle.project.id, { shots: [patch] }), "컷 내용을 저장했습니다.")}
              onCompare={() => goToView("compare")}
            />
          ) : null}
          {view === "compare" ? (
            <Compare
              bundle={bundle}
              selectedShot={selectedShot}
              selectedShotId={selectedShotId}
              setSelectedShotId={setSelectedShotId}
              cancelingJobId={cancelingJobId}
              onCancelJob={cancelJob}
              onGenerate={(shotId) => run(() => studioApi.generateShot(shotId), "이 컷 생성 잡을 시작했습니다.")}
              onRegenerate={(shotId, scope) => run(() => studioApi.regenerate(shotId, scope), "이전 후보를 보존하고 새 후보를 생성합니다.")}
              onSelect={(shotId, takeId) => run(() => studioApi.selectTake(shotId, takeId), "선택한 후보를 저장했습니다.")}
              onUpgrade={(takeId) => run(() => studioApi.upgradeTake(takeId), "게시용 품질로 다시 다듬는 잡을 시작했습니다.")}
              onUpdateDirection={(shotId, patch) => run(() => studioApi.updateShotDirection(shotId, patch), "컷 연출 지시를 저장했습니다.")}
              onEdit={() => goToView("edit")}
            />
          ) : null}
          {view === "edit" ? (
            <Edit
              bundle={bundle}
              onExport={() => goToView("export")}
              onApplyCommand={(command) => bundle && run(() => studioApi.applyEdit(bundle.project.id, { command }), "편집 명령을 저장했습니다.")}
              onSetAudio={(patch) => bundle && run(() => studioApi.setAudio(bundle.project.id, patch), "다듬기 설정을 저장했습니다.")}
            />
          ) : null}
          {view === "export" ? (
            <ExportView
              bundle={bundle}
              cancelingJobId={cancelingJobId}
              onCancelJob={cancelJob}
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
              onSetDefault={(renderJobId) =>
                bundle &&
                run(() => studioApi.setDefaultRender(bundle.project.id, renderJobId), "기본 버전으로 설정했습니다.")
              }
              onRenderAction={notify}
              onFocusMissingShot={(shotId) => {
                setSelectedShotId(shotId);
                goToView("compare");
                notify("비교 화면에서 이 컷의 후보를 선택하면 다음 렌더에 합쳐집니다.");
              }}
              onReviewRights={() => {
                goToView("assets");
                notify("Asset Library에서 외부 이미지의 사용 권리와 동의를 확인하세요.");
              }}
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
  cancelingJobId,
  onCancelJob,
  onGenerate,
  onUseAsset
}: {
  bundle: ProjectBundle | null;
  cancelingJobId: string | null;
  onCancelJob: (jobId: string) => void;
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
          {bundle.imageJobs.map((job) => {
            const active = job.status === "queued" || job.status === "running";
            return (
              <div className="row-card" key={job.id}>
                <div>
                  <strong>{purposeLabels[job.purpose]}</strong>
                  <p className="hint">{imageJobStageLabel(job.stage)} · {Math.round(job.progress * 100)}%</p>
                </div>
                <div className="row-card-side">
                  <span className={`badge ${jobBadgeTone(job.status)}`}>{statusLabel(job.status)}</span>
                  {active ? (
                    <CancelJobButton jobId={job.id} canceling={cancelingJobId === job.id} busy={cancelingJobId !== null} onCancel={onCancelJob} />
                  ) : null}
                </div>
              </div>
            );
          })}
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

type ShotEditPatch = Partial<Shot> & { id: string };

function Storyboard({
  bundle,
  selectedShotId,
  setSelectedShotId,
  canceling,
  onCancelGeneration,
  onGenerate,
  onSaveShot,
  onCompare
}: {
  bundle: ProjectBundle | null;
  selectedShotId: string | null;
  setSelectedShotId: (shotId: string | null) => void;
  canceling: boolean;
  onCancelGeneration: () => void;
  onGenerate: () => void;
  onSaveShot: (patch: ShotEditPatch) => void;
  onCompare: () => void;
}) {
  if (!bundle) return <NoProject />;
  const activeGeneration = bundle.generationJobs.some((job) => job.status === "queued" || job.status === "running");
  const generatableShots = bundle.shots.filter((shot) => shot.status === "pending" || shot.status === "failed");
  const hasGeneratedTakes = bundle.takes.length > 0;
  const canGenerate = !activeGeneration && generatableShots.length > 0;
  const generateCost = hasGeneratedTakes ? Math.max(12, generatableShots.length * 18) : 96;
  const generateLabel = activeGeneration ? "생성 중" : canGenerate ? (hasGeneratedTakes ? "남은 컷 생성" : "전체 생성") : "전체 생성 완료";
  const editingShot = selectedShotId ? bundle.shots.find((shot) => shot.id === selectedShotId) ?? null : null;
  // 편집 중인 컷에 이미 생성/선택 결과가 있으면, 내용을 바꿀 때 다시 생성이 필요할 수 있음을 부드럽게 안내한다.
  const editingShotHasResult = editingShot ? Boolean(editingShot.selectedTakeId) || bundle.takes.some((take) => take.shotId === editingShot.id) : false;
  return (
    <>
      <div className="head">
        <div>
          <h2>{bundle.project.title} · 스토리보드</h2>
          <p className="hint">
            {bundle.scenes.length}씬 · {bundle.shots.length}컷 · {bundle.project.targetDurationSec}s 목표 · 컷을 누르면 내용을 다듬을 수 있습니다.
          </p>
        </div>
        <div className="actions" style={{ marginTop: 0 }}>
          <button type="button" className="primary" disabled={!canGenerate} onClick={onGenerate}>
            {generateLabel} {canGenerate ? <span className="cost">{generateCost}⚡</span> : null}
          </button>
          {activeGeneration ? (
            <button
              type="button"
              className="ghost cancel-job"
              disabled={canceling}
              title="진행 중인 컷 생성을 모두 멈추고 예약한 크레딧을 돌려받습니다."
              onClick={onCancelGeneration}
            >
              {canceling ? "취소 중…" : "생성 취소"}
            </button>
          ) : null}
          <button type="button" className="secondary" onClick={onCompare}>
            비교 화면
          </button>
        </div>
      </div>
      {editingShot ? (
        <ShotEditor
          key={editingShot.id}
          shot={editingShot}
          hasResult={editingShotHasResult}
          onClose={() => setSelectedShotId(null)}
          onSave={onSaveShot}
        />
      ) : null}
      {bundle.scenes.map((scene) => (
        <section className="scene" key={scene.id}>
          <div className="head">
            <strong>{scene.title}</strong>
            <span className="badge">{bundle.shots.filter((shot) => shot.sceneId === scene.id).length}컷</span>
          </div>
          <div className="grid shot-grid">
            {bundle.shots
              .filter((shot) => shot.sceneId === scene.id)
              .map((shot) => {
                const isEditing = shot.id === selectedShotId;
                return (
                  <article className={`panel shot${isEditing ? " editing" : ""}`} key={shot.id}>
                    <button
                      type="button"
                      className="shot-open"
                      aria-pressed={isEditing}
                      title="이 컷의 내용을 다듬습니다."
                      onClick={() => setSelectedShotId(isEditing ? null : shot.id)}
                    >
                      <div className="shot-thumb">{shot.saec.framing}</div>
                      <strong>{shot.title}</strong>
                      <div className="meta">
                        <span className={`badge ${shot.status === "failed" ? "warn" : shot.selectedTakeId ? "ok" : "fast"}`}>{shotStatusLabel(shot)}</span>
                        <span>{tierLabel(shot.requirements.tier)}</span>
                        {shot.referenceImageIds.length ? <span>{shot.referenceImageIds.length}개 이미지 참조</span> : null}
                      </div>
                      <p className="hint">{shot.saec.action}</p>
                      <span className="shot-edit-cue">{isEditing ? "편집 중" : "다듬기"}</span>
                    </button>
                  </article>
                );
              })}
          </div>
        </section>
      ))}
    </>
  );
}

// 스토리보드 컷의 실무 필드를 한 곳에서 다듬는 컴팩트 인라인 에디터. 제목·길이·장면 묘사·연출을
// 저장하면 studioApi.updateStoryboard로 반영된다. 모델명·내부 계약명은 노출하지 않는다.
function ShotEditor({
  shot,
  hasResult,
  onClose,
  onSave
}: {
  shot: Shot;
  hasResult: boolean;
  onClose: () => void;
  onSave: (patch: ShotEditPatch) => void;
}) {
  const [title, setTitle] = useState(shot.title);
  const [durationSec, setDurationSec] = useState(String(shot.durationSec));
  const [saec, setSaec] = useState<Saec>(shot.saec);
  const [motion, setMotion] = useState(shot.directionSpec.motion);
  const [notes, setNotes] = useState(shot.directionSpec.notes);

  // 다른 컷으로 바뀌면(또는 부모 새로고침으로 값이 갱신되면) 입력값을 현재 컷 기준으로 다시 맞춘다.
  useEffect(() => {
    setTitle(shot.title);
    setDurationSec(String(shot.durationSec));
    setSaec(shot.saec);
    setMotion(shot.directionSpec.motion);
    setNotes(shot.directionSpec.notes);
  }, [shot.id, shot.title, shot.durationSec, shot.saec, shot.directionSpec.motion, shot.directionSpec.notes]);

  function setSaecField(field: keyof Saec, value: string) {
    setSaec((prev) => ({ ...prev, [field]: value }));
  }

  function save() {
    const trimmedTitle = title.trim();
    const parsedDuration = Number(durationSec);
    const nextDuration = Number.isFinite(parsedDuration) ? Math.max(1, Math.min(16, Math.round(parsedDuration))) : shot.durationSec;
    onSave({
      id: shot.id,
      title: trimmedTitle || shot.title,
      durationSec: nextDuration,
      saec,
      directionSpec: { ...shot.directionSpec, motion, notes }
    });
  }

  const saecFields: Array<{ field: keyof Saec; label: string; placeholder: string; multiline?: boolean }> = [
    { field: "action", label: "동작·연기", placeholder: "예) 컵을 들어 카메라 쪽으로 천천히 기울인다", multiline: true },
    { field: "environment", label: "배경·환경", placeholder: "예) 밝은 카페 창가, 아침 햇살" },
    { field: "camera", label: "카메라", placeholder: "예) 천천히 다가가는 클로즈업" },
    { field: "framing", label: "구도", placeholder: "예) 제품 중심 정면 클로즈업" },
    { field: "lighting", label: "조명", placeholder: "예) 부드러운 자연광" },
    { field: "style", label: "스타일", placeholder: "예) 밝고 산뜻한 광고 톤" },
    { field: "negative", label: "피할 요소", placeholder: "예) 손, 글자, 흐릿한 배경", multiline: true }
  ];

  return (
    <section className="panel shot-editor" aria-label={`${shot.title} 컷 다듬기`}>
      <div className="head">
        <div>
          <h2>컷 {shot.order + 1} · 내용 다듬기</h2>
          <p className="hint">제목, 길이, 장면 묘사, 연출을 바꾼 뒤 저장하면 스토리보드에 반영됩니다.</p>
        </div>
        <button type="button" className="ghost" onClick={onClose}>
          닫기
        </button>
      </div>
      <div className="grid two-compact" style={{ marginTop: 12 }}>
        <label>
          제목
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          길이(초)
          <input
            type="number"
            min={1}
            max={16}
            value={durationSec}
            onChange={(event) => setDurationSec(event.target.value)}
          />
        </label>
      </div>
      <div className="grid two-compact" style={{ marginTop: 12 }}>
        {saecFields.map(({ field, label, placeholder, multiline }) => (
          <label key={field} className={multiline ? "span-2" : undefined}>
            {label}
            {multiline ? (
              <textarea value={saec[field]} placeholder={placeholder} onChange={(event) => setSaecField(field, event.target.value)} />
            ) : (
              <input value={saec[field]} placeholder={placeholder} onChange={(event) => setSaecField(field, event.target.value)} />
            )}
          </label>
        ))}
      </div>
      <div className="grid two-compact" style={{ marginTop: 12 }}>
        <label>
          움직임
          <input value={motion} placeholder="예) 카메라가 천천히 다가간다" onChange={(event) => setMotion(event.target.value)} />
        </label>
        <label>
          연출 메모
          <input value={notes} placeholder="예) 컵 표면 물방울을 강조" onChange={(event) => setNotes(event.target.value)} />
        </label>
      </div>
      {hasResult ? (
        <div className="notice">이 컷은 이미 생성한 결과가 있어요. 내용을 바꾸면 결과와 달라질 수 있어, 저장 뒤 이 컷만 다시 생성하면 됩니다.</div>
      ) : null}
      <div className="actions">
        <button type="button" className="primary" onClick={save}>
          컷 내용 저장
        </button>
        <button type="button" className="secondary" onClick={onClose}>
          취소
        </button>
      </div>
    </section>
  );
}

function Compare({
  bundle,
  selectedShot,
  selectedShotId,
  setSelectedShotId,
  cancelingJobId,
  onCancelJob,
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
  cancelingJobId: string | null;
  onCancelJob: (jobId: string) => void;
  onGenerate: (shotId: string) => void;
  onRegenerate: (shotId: string, scope: "shot" | "segment") => void;
  onSelect: (shotId: string, takeId: string) => void;
  onUpgrade: (takeId: string) => void;
  onUpdateDirection: (shotId: string, patch: Partial<DirectionSpec>) => void;
  onEdit: () => void;
}) {
  if (!bundle || !selectedShot) return <NoProject />;
  const takes = bundle.takes.filter((take) => take.shotId === selectedShot.id);
  // 후보(take)별로 아직 진행 중인 생성 잡을 찾아 둔다. 후보 카드에서 곧바로 해당 컷의 생성 잡을
  // 취소할 수 있게 매핑한다(컷 단위 활성 잡 취소). 내부 잡 id는 노출하지 않고 버튼 동작에만 쓴다.
  const activeJobByTakeId = new Map<string, string>();
  for (const job of bundle.generationJobs) {
    if (job.status === "queued" || job.status === "running") activeJobByTakeId.set(job.takeId, job.id);
  }
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
            <TakeCard
              key={take.id}
              shot={selectedShot}
              take={take}
              aspect={bundle.project.aspect}
              cancelJobId={activeJobByTakeId.get(take.id) ?? null}
              canceling={Boolean(activeJobByTakeId.get(take.id)) && cancelingJobId === activeJobByTakeId.get(take.id)}
              busy={cancelingJobId !== null}
              onCancel={onCancelJob}
              onSelect={onSelect}
            />
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

function TakeCard({
  shot,
  take,
  aspect,
  cancelJobId,
  canceling,
  busy,
  onCancel,
  onSelect
}: {
  shot: Shot;
  take: Take;
  aspect: Aspect;
  cancelJobId?: string | null;
  canceling?: boolean;
  busy?: boolean;
  onCancel?: (jobId: string) => void;
  onSelect: (shotId: string, takeId: string) => void;
}) {
  const selected = shot.selectedTakeId === take.id;
  // done + videoUrl만 실제 재생 가능. 실패/생성중/취소됨은 한국어 상태 라벨로 비재생 상태를 명확히 한다.
  const playable = take.status === "done" && Boolean(take.videoUrl);
  const pending = take.status === "queued" || take.status === "running";
  const fallbackLabel = take.status === "failed" ? "다시 시도 필요" : take.status === "cancelled" ? "취소됨" : "생성 중";
  return (
    <article className={`take ${selected ? "selected" : ""} ${take.status === "failed" ? "failed" : ""}`}>
      <div className="take-media" style={{ aspectRatio: aspectRatioCss(aspect) }}>
        {playable ? (
          <video
            className="take-video"
            controls
            playsInline
            muted
            preload="metadata"
            poster={take.posterUrl ?? undefined}
            src={take.videoUrl ?? undefined}
          />
        ) : (
          <div className="media-fallback">
            <strong>{take.label}</strong>
            <span>{fallbackLabel}</span>
          </div>
        )}
      </div>
      <div className="take-footer">
        <strong>{take.label}</strong>
        <button
          type="button"
          className={`mini ${selected ? "primary" : "secondary"}`}
          disabled={take.status !== "done"}
          onClick={() => onSelect(shot.id, take.id)}
        >
          {take.status === "done" ? (selected ? "선택됨" : "이걸로 선택") : statusLabel(take.status)}
        </button>
      </div>
      <div className="body" style={{ paddingTop: 0 }}>
        {pending ? (
          <div className="progress">
            <i style={{ width: "48%" }} />
          </div>
        ) : null}
        <div className="meta">
          <span>{tierLabel(take.tier)}</span>
          <span>{qualityLabel(take)}</span>
        </div>
        {pending && cancelJobId && onCancel ? (
          <div className="take-cancel">
            <CancelJobButton jobId={cancelJobId} canceling={Boolean(canceling)} busy={Boolean(busy)} onCancel={onCancel} />
          </div>
        ) : null}
      </div>
    </article>
  );
}

const captionModeLabels: Record<EditState["captions"]["mode"], string> = {
  "burn-in": "영상에 새기기",
  srt: "파일로 따로 받기",
  both: "새기기 + 파일"
};

const captionSourceLabels: Record<EditState["captions"]["source"], string> = {
  "script-first": "대본 기준",
  stt: "음성 인식 기준"
};

const voiceSourceLabels: Record<EditState["voiceover"]["source"], string> = {
  licensed_tts: "기본 제공 보이스",
  user_upload: "직접 업로드"
};

// track/voice는 자유 문자열이라 저장값이 프리셋에 없을 수 있다. 항상 현재 값을 선택지에 포함시킨다.
const BGM_TRACKS = ["라이선스 확인 사운드", "잔잔한 배경음", "밝은 배경음", "감성 배경음"];
const VOICE_OPTIONS = ["보이스 A", "보이스 B", "보이스 C"];

function withCurrent(options: string[], current: string) {
  return options.includes(current) ? options : [current, ...options];
}

type PreviewSegment = { shot: Shot; take: Take };

// 선택된 컷을 이어보는 컴팩트한 플레이리스트 미리보기. 현재 컷 플레이어 + 세그먼트 목록만 제공하고
// 복잡한 편집기는 만들지 않는다. 한 컷이 끝나면 다음 컷으로 자동 진행한다(음소거 자동재생).
function EditPreview({ segments, aspect }: { segments: PreviewSegment[]; aspect: Aspect }) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstRender = useRef(true);
  const safeIndex = segments.length ? Math.min(index, segments.length - 1) : 0;
  const current = segments[safeIndex] ?? null;
  const currentTakeId = current?.take.id;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    // 첫 마운트에서는 자동재생하지 않는다. 사용자가 세그먼트를 고르거나 자동 진행될 때만 이어 재생.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    el.play().catch(() => {});
  }, [currentTakeId]);

  if (!segments.length) {
    return (
      <div className="player">
        <div>
          <strong>선택된 컷이 없습니다</strong>
          <p className="hint">비교 화면에서 컷을 선택하면 여기서 순서대로 이어볼 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-preview">
      <div className="edit-preview-stage" style={{ aspectRatio: aspectRatioCss(aspect) }}>
        <video
          ref={videoRef}
          className="take-video"
          controls
          playsInline
          muted
          preload="metadata"
          poster={current?.take.posterUrl ?? undefined}
          src={current?.take.videoUrl ?? undefined}
          onEnded={() => setIndex((value) => Math.min(value + 1, segments.length - 1))}
        />
      </div>
      <ol className="segment-list">
        {segments.map((segment, order) => (
          <li key={segment.shot.id}>
            <button type="button" className={order === safeIndex ? "active" : ""} onClick={() => setIndex(order)}>
              <span className="segment-index">{order + 1}</span>
              <span className="segment-title">{segment.shot.title}</span>
              <span className="segment-dur">{formatSeconds(segment.take.durationSec)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Edit({
  bundle,
  onExport,
  onApplyCommand,
  onSetAudio
}: {
  bundle: ProjectBundle | null;
  onExport: () => void;
  onApplyCommand: (command: string) => void;
  onSetAudio: (patch: Partial<EditState>) => void;
}) {
  const [command, setCommand] = useState("");
  if (!bundle) return <NoProject />;
  const selectedCount = bundle.shots.filter((shot) => shot.selectedTakeId).length;
  // 선택된 컷을 순서대로 모아 이어보기 세그먼트를 만든다. 선택 take의 재생 URL이 있어야 미리보기가 가능.
  const previewSegments: PreviewSegment[] = bundle.shots
    .filter((shot) => shot.selectedTakeId)
    .map((shot) => {
      const take = bundle.takes.find((item) => item.id === shot.selectedTakeId);
      return take ? { shot, take } : null;
    })
    .filter((segment): segment is PreviewSegment => segment !== null && Boolean(segment.take.videoUrl));
  // 컨트롤은 모두 저장된 bundle.editState를 직접 반영한다(로컬 사본 없이). 변경 즉시 저장 후
  // 부모 run()이 bundle을 새로고침하므로 editState·renderSourceHash가 항상 최신이고,
  // 그 덕분에 내보내기 화면의 "프로젝트가 바뀌었습니다" stale 안내도 정상 동작한다.
  const { captions, bgm, voiceover, transitions } = bundle.editState;
  const bgmTracks = withCurrent(BGM_TRACKS, bgm.track);
  const voiceOptions = withCurrent(VOICE_OPTIONS, voiceover.voice);
  const recentCommands = [...bundle.editState.commands].slice(-3).reverse();

  function submitCommand() {
    const trimmed = command.trim();
    if (!trimmed) return;
    onApplyCommand(trimmed);
    setCommand("");
  }

  return (
    <div className="grid edit-grid">
      <div className="panel">
        <div className="head">
          <div>
            <strong>{selectedCount}컷 연결 미리보기</strong>
            <p className="hint">선택된 컷을 순서대로 이어봅니다. 실제 렌더는 내보내기에서 생성됩니다.</p>
          </div>
        </div>
        <EditPreview segments={previewSegments} aspect={bundle.project.aspect} />
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
          편집 명령
          <div className="command-row">
            <input
              value={command}
              placeholder="예) 마지막 컷에 CTA를 2초 더 길게 보여줘"
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitCommand();
                }
              }}
            />
            <button type="button" className="secondary" disabled={!command.trim()} onClick={submitCommand}>
              명령 저장
            </button>
          </div>
        </label>
        {recentCommands.length ? (
          <ul className="command-log">
            {recentCommands.map((item, index) => (
              <li key={`${item.createdAt}-${index}`}>{item.command}</li>
            ))}
          </ul>
        ) : null}

        <div className="edit-controls">
          <div className="edit-control">
            <label className="check-row">
              <input type="checkbox" checked={captions.enabled} onChange={(event) => onSetAudio({ captions: { ...captions, enabled: event.target.checked } })} />
              자막 넣기
            </label>
            <div className="grid two-compact">
              <label>
                자막 형식
                <select
                  value={captions.mode}
                  disabled={!captions.enabled}
                  onChange={(event) => onSetAudio({ captions: { ...captions, mode: event.target.value as EditState["captions"]["mode"] } })}
                >
                  {Object.entries(captionModeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                자막 기준
                <select
                  value={captions.source}
                  disabled={!captions.enabled}
                  onChange={(event) => onSetAudio({ captions: { ...captions, source: event.target.value as EditState["captions"]["source"] } })}
                >
                  {Object.entries(captionSourceLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="edit-control">
            <label className="check-row">
              <input type="checkbox" checked={bgm.enabled} onChange={(event) => onSetAudio({ bgm: { ...bgm, enabled: event.target.checked } })} />
              배경 음악
            </label>
            <div className="grid two-compact">
              <label>
                음악 선택
                <select value={bgm.track} disabled={!bgm.enabled} onChange={(event) => onSetAudio({ bgm: { ...bgm, track: event.target.value } })}>
                  {bgmTracks.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>
              </label>
              <label className="check-row check-inline">
                <input type="checkbox" checked={bgm.ducking} disabled={!bgm.enabled} onChange={(event) => onSetAudio({ bgm: { ...bgm, ducking: event.target.checked } })} />
                말할 때 음악 줄이기
              </label>
            </div>
          </div>

          <div className="edit-control">
            <label className="check-row">
              <input type="checkbox" checked={voiceover.enabled} onChange={(event) => onSetAudio({ voiceover: { ...voiceover, enabled: event.target.checked } })} />
              보이스(내레이션)
            </label>
            <div className="grid two-compact">
              <label>
                보이스 선택
                <select value={voiceover.voice} disabled={!voiceover.enabled} onChange={(event) => onSetAudio({ voiceover: { ...voiceover, voice: event.target.value } })}>
                  {voiceOptions.map((voice) => (
                    <option key={voice} value={voice}>
                      {voice}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                보이스 소스
                <select
                  value={voiceover.source}
                  disabled={!voiceover.enabled}
                  onChange={(event) => onSetAudio({ voiceover: { ...voiceover, source: event.target.value as EditState["voiceover"]["source"] } })}
                >
                  {Object.entries(voiceSourceLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="edit-control">
            <label className="check-row">
              <input type="checkbox" checked={transitions === "soft"} onChange={(event) => onSetAudio({ transitions: event.target.checked ? "soft" : "none" })} />
              컷 전환 부드럽게
            </label>
          </div>
        </div>

        <div className="notice">라이선스 확인된 사운드만 기본 제공됩니다. 직접 업로드한 파일은 사용자가 권리를 확인해야 합니다.</div>
      </section>
    </div>
  );
}

function ExportView({
  bundle,
  cancelingJobId,
  onCancelJob,
  onRender,
  onSetDefault,
  onRenderAction,
  onFocusMissingShot,
  onReviewRights
}: {
  bundle: ProjectBundle | null;
  cancelingJobId: string | null;
  onCancelJob: (jobId: string) => void;
  onRender: (resolution: "720p" | "1080p" | "4k", caption: "none" | "burn-in" | "srt" | "both") => void;
  onSetDefault: (renderJobId: string) => void;
  onRenderAction: (message: string) => void;
  // 점검 경고에서 곧바로 작업 화면으로 이동하기 위한 콜백. 빠진 컷은 비교 화면으로 포커스 이동,
  // 권리 경고는 Asset Library로 이동한다. 부모의 setView/setSelectedShotId 앱 상태를 재사용한다.
  onFocusMissingShot: (shotId: string) => void;
  onReviewRights: () => void;
}) {
  const [resolution, setResolution] = useState<"720p" | "1080p" | "4k">("1080p");
  const [caption, setCaption] = useState<"none" | "burn-in" | "srt" | "both">("burn-in");
  // preview는 read-only 사전 점검이다. 렌더 잡을 만들지 않고 현재 spec 기준의 예상 비용/시간·빠지는
  // 컷·권리 경고를 미리 보여준다. 잡 스냅샷(RenderPreflight)과 달리 "예상"으로 명확히 구분한다.
  const [preview, setPreview] = useState<RenderPreview | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const projectId = bundle?.project.id ?? null;
  const aspect = bundle?.project.aspect ?? null;
  // preview는 전체 타임라인 점검이라 길이별(6s/15s/30s)로 갈리지 않는다. cut은 "full"로 고정하고
  // 사용자가 고르는 해상도·자막·프로젝트 비율만 반영한다.
  const currentSpec: ExportSpec | null =
    aspect && bundle ? { resolution, cut: "full", aspect, caption } : null;

  async function runPreview(spec: ExportSpec, id: string) {
    setPreviewing(true);
    setPreviewError(null);
    try {
      const result = await studioApi.previewRender(id, spec);
      setPreview(result);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : "미리 점검 중 오류가 발생했습니다.");
    } finally {
      setPreviewing(false);
    }
  }

  // 내보내기 화면을 열면(또는 프로젝트가 바뀌면) 현재 설정으로 한 번 미리 점검한다. 이후 설정을
  // 바꾸면 stale 배지가 떠 "다시 점검"을 유도한다(아래 staleSpec 비교).
  useEffect(() => {
    setPreview(null);
    setPreviewError(null);
    if (!projectId || !aspect) return;
    void runPreview({ resolution, cut: "full", aspect, caption }, projectId);
    // 의도적으로 projectId에만 반응. 설정 변경은 stale 처리 + 수동 재점검으로 흐른다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!bundle || !currentSpec) return <NoProject />;
  const activeRender = bundle.renderJobs.some((job) => job.status === "queued" || job.status === "running");
  const hasRendered = bundle.renderJobs.some((job) => job.status === "done");
  // rightsReview/renderPlan은 startRender 시점 스냅샷이라 렌더 잡에만 존재한다. 가장 최근 잡을
  // 내보내기 점검 요약으로 삼는다(같은 배치의 잡들은 동일 스냅샷을 공유). 컷 제목 역참조 맵으로
  // missingShotId를 사람이 읽는 컷 이름으로 바꾼다.
  const latestJob = bundle.renderJobs.length ? bundle.renderJobs[bundle.renderJobs.length - 1] : null;
  const shotTitleById = new Map(bundle.shots.map((shot) => [shot.id, shot.title] as const));
  // 마지막으로 점검한 spec과 현재 설정이 다르면 예상이 stale이다(해상도·자막·비율 기준).
  const staleSpec = Boolean(
    preview &&
      (preview.spec.resolution !== resolution || preview.spec.caption !== caption || preview.spec.aspect !== aspect)
  );
  // preview 계산 이후 프로젝트 소스(편집/선택 take/권리 등)가 바뀌면 서버가 준 renderSourceHash가
  // 달라진다. 해시 값 자체는 사용자에게 노출하지 않고 "프로젝트가 바뀌었다"는 신호로만 쓴다.
  const staleSource = Boolean(preview && preview.sourceHash !== bundle.renderSourceHash);
  const previewStale = staleSpec || staleSource;
  return (
    <>
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
        <RenderPreviewBlock
          preview={preview}
          previewing={previewing}
          previewError={previewError}
          stale={previewStale}
          staleSpec={staleSpec}
          staleSource={staleSource}
          shotTitleById={shotTitleById}
          onPreview={() => runPreview(currentSpec, bundle.project.id)}
          onFocusMissingShot={onFocusMissingShot}
          onReviewRights={onReviewRights}
        />
        <div className="actions">
          <button type="button" className="primary" disabled={activeRender} onClick={() => onRender(resolution, caption)}>
            {activeRender ? "내보내는 중" : hasRendered ? "다시 내보내기" : "렌더 시작"}{" "}
            {!activeRender ? <span className="cost">{preview && !previewStale ? `${preview.estimate.credits}⚡` : "48⚡"}</span> : null}
          </button>
        </div>
      </section>
      <section className="panel">
        <h2>렌더 버전</h2>
        {latestJob ? (
          <RenderPreflight
            job={latestJob}
            shotTitleById={shotTitleById}
            onFocusMissingShot={onFocusMissingShot}
            onReviewRights={onReviewRights}
          />
        ) : null}
        {bundle.renderJobs.length ? (
          <RenderVersions
            jobs={bundle.renderJobs}
            defaultRenderJobId={bundle.project.defaultRenderJobId}
            aspect={bundle.project.aspect}
            posterUrl={bundle.project.thumbUrl}
            cancelingJobId={cancelingJobId}
            onCancelJob={onCancelJob}
            onSetDefault={onSetDefault}
            onRenderAction={onRenderAction}
          />
        ) : (
          <div className="empty" style={{ marginTop: 12 }}>
            아직 렌더 잡이 없습니다.
          </div>
        )}
      </section>
    </div>
    <CreditLedger transactions={bundle.creditTransactions} />
    </>
  );
}

// 이 프로젝트의 최근 크레딧 예약·확정·환불을 한눈에 보여주는 운영용 요약. 서버가 주는
// bundle.creditTransactions는 오래된→최신 순이라 뒤에서 잘라 최신순으로 뒤집어 최근 항목만 노출한다.
// 잡/프로바이더/모델 id 같은 내부 식별자는 표시하지 않고, 사람이 읽는 작업 이름·종류·남은 크레딧·
// 상대 시각만 보여준다.
function CreditLedger({ transactions }: { transactions: CreditTransaction[] }) {
  const recent = useMemo(() => transactions.slice(-8).reverse(), [transactions]);
  return (
    <section className="panel ledger">
      <div className="head">
        <div>
          <h2>크레딧 사용 내역</h2>
          <p className="hint">이 프로젝트의 최근 크레딧 예약·사용 확정·환불을 보여줍니다.</p>
        </div>
        {recent.length ? <span className="badge">최근 {recent.length}건</span> : null}
      </div>
      {recent.length ? (
        <ul className="ledger-list">
          {recent.map((tx) => {
            const meta = creditKindMeta[tx.kind];
            return (
              <li className="ledger-row" key={tx.id}>
                <div className="ledger-main">
                  <span className={`badge ${meta.tone}`}>{meta.label}</span>
                  <span className="ledger-action">{creditActionLabels[tx.action]}</span>
                </div>
                <div className="ledger-side">
                  <strong className={`ledger-amount${tx.kind === "refund" ? " is-refund" : ""}`}>
                    {tx.kind === "refund" ? "+" : ""}
                    {tx.credits}⚡
                  </strong>
                  <span className="ledger-meta">
                    남은 {tx.balanceAfter.available}⚡ · {formatLedgerTime(tx.createdAt)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty" style={{ minHeight: 120 }}>아직 크레딧 사용 내역이 없습니다.</div>
      )}
    </section>
  );
}

// 길이별(6s/15s/30s/full) 렌더 결과를 세그먼트 탭으로 보여준다. 탭 하나가 길이 버전 하나에 대응하고,
// 활성 탭만 인라인 플레이어·다운로드·공유·기본 설정을 노출해 화면을 좁고 운영 중심으로 유지한다.
const RENDER_CUT_ORDER: ExportSpec["cut"][] = ["6s", "15s", "30s", "full"];
const renderCutLabels: Record<ExportSpec["cut"], string> = {
  "6s": "6초",
  "15s": "15초",
  "30s": "30초",
  full: "전체"
};

function RenderVersions({
  jobs,
  defaultRenderJobId,
  aspect,
  posterUrl,
  cancelingJobId,
  onCancelJob,
  onSetDefault,
  onRenderAction
}: {
  jobs: RenderJob[];
  defaultRenderJobId: string | null;
  aspect: Aspect;
  posterUrl: string | null;
  cancelingJobId: string | null;
  onCancelJob: (jobId: string) => void;
  onSetDefault: (renderJobId: string) => void;
  onRenderAction: (message: string) => void;
}) {
  const [activeCut, setActiveCut] = useState<ExportSpec["cut"] | null>(null);

  // 같은 길이로 여러 번 렌더하면 잡이 쌓인다. 길이별 대표 잡은 ①기본으로 지정된 잡 ②가장 최근 완료된 잡
  // ③가장 최근 잡 순으로 고른다. 그래야 기본 표시와 플레이어가 항상 같은 버전을 가리킨다.
  const jobsByCut = new Map<ExportSpec["cut"], RenderJob[]>();
  for (const job of jobs) {
    const list = jobsByCut.get(job.spec.cut) ?? [];
    list.push(job);
    jobsByCut.set(job.spec.cut, list);
  }
  const availableCuts = RENDER_CUT_ORDER.filter((cut) => jobsByCut.has(cut));

  function representativeFor(cut: ExportSpec["cut"]): RenderJob {
    const list = jobsByCut.get(cut) as RenderJob[];
    const asDefault = list.find((job) => job.id === defaultRenderJobId);
    if (asDefault) return asDefault;
    const done = list.filter((job) => job.status === "done");
    return done.length ? done[done.length - 1] : list[list.length - 1];
  }

  const defaultCut = availableCuts.find((cut) => representativeFor(cut).id === defaultRenderJobId) ?? null;
  // 사용자가 고른 탭을 우선하되, 없으면 기본 버전 → 완료된 첫 버전 → 첫 버전 순으로 떨어진다.
  const effectiveCut =
    (activeCut && availableCuts.includes(activeCut) ? activeCut : null) ??
    (defaultCut && availableCuts.includes(defaultCut) ? defaultCut : null) ??
    availableCuts.find((cut) => representativeFor(cut).status === "done") ??
    availableCuts[0] ??
    null;

  if (!effectiveCut) return null;

  const activeJob = representativeFor(effectiveCut);
  const isDefault = activeJob.id === defaultRenderJobId;
  const ready = activeJob.status === "done" && Boolean(activeJob.outputUrl);

  // 공유 링크는 토스트로만 끝내지 않고 실제 URL을 클립보드에 복사하고, 아래에도 링크를 노출한다.
  async function copyShare(url: string) {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        onRenderAction("공유 링크를 클립보드에 복사했습니다.");
        return;
      }
    } catch {
      // 권한 거부 등으로 복사가 막히면 아래 안내로 떨어진다.
    }
    onRenderAction("공유 링크를 복사할 수 없어 링크를 표시합니다. 직접 복사해 주세요.");
  }

  return (
    <div className="render-versions">
      <div className="seg-tabs" role="tablist" aria-label="렌더 길이 버전">
        {availableCuts.map((cut) => {
          const rep = representativeFor(cut);
          const selected = cut === effectiveCut;
          return (
            <button
              key={cut}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`seg-tab${selected ? " is-active" : ""}`}
              onClick={() => setActiveCut(cut)}
            >
              <span className="seg-tab-label">{renderCutLabels[cut]}</span>
              {rep.id === defaultRenderJobId ? <span className="seg-tab-default">기본</span> : null}
              {rep.status === "queued" || rep.status === "running" ? <span className="seg-tab-dot" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      <div className="render-version-body" role="tabpanel" aria-label={`${renderCutLabels[effectiveCut]} 버전`}>
        <div className="render-version-head">
          <strong>
            {renderCutLabels[effectiveCut]} 버전 · {activeJob.spec.resolution}
          </strong>
          {isDefault ? <span className="badge ok">기본 버전</span> : null}
        </div>

        {ready ? (
          <>
            <div className="edit-preview-stage" style={{ aspectRatio: aspectRatioCss(aspect) }}>
              <video
                key={activeJob.id}
                className="take-video"
                controls
                playsInline
                muted
                preload="metadata"
                poster={posterUrl ?? undefined}
                src={activeJob.outputUrl as string}
              />
            </div>
            <div className="render-actions">
              <a
                className="secondary"
                href={activeJob.outputUrl as string}
                download
                target="_blank"
                rel="noreferrer"
                onClick={() => onRenderAction("다운로드를 시작합니다.")}
              >
                다운로드
              </a>
              {activeJob.shareUrl ? (
                <button type="button" className="secondary" onClick={() => copyShare(activeJob.shareUrl as string)}>
                  공유 링크 복사
                </button>
              ) : null}
              <button type="button" className="secondary" disabled={isDefault} onClick={() => onSetDefault(activeJob.id)}>
                {isDefault ? "기본 버전" : "기본으로 설정"}
              </button>
            </div>
            {activeJob.shareUrl ? (
              <a className="share-link" href={activeJob.shareUrl} target="_blank" rel="noreferrer">
                공유 링크: {activeJob.shareUrl}
              </a>
            ) : null}
          </>
        ) : (
          <div className="render-version-progress">
            {activeJob.status === "cancelled" ? null : (
              <div className="progress">
                <i style={{ width: `${Math.round(activeJob.progress * 100)}%` }} />
              </div>
            )}
            <div className="meta">
              <span>{statusLabel(activeJob.status)}</span>
              {activeJob.status !== "cancelled" && renderStageLabel(activeJob) ? <span>{renderStageLabel(activeJob)}</span> : null}
            </div>
            {activeJob.status === "queued" || activeJob.status === "running" ? (
              <div className="render-version-cancel">
                <CancelJobButton
                  jobId={activeJob.id}
                  canceling={cancelingJobId === activeJob.id}
                  busy={cancelingJobId !== null}
                  onCancel={onCancelJob}
                  className="secondary"
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// 잡 스냅샷(startRender 결과) 기반 점검. 이미 확정된 렌더 잡의 plan/rights를 그대로 보여준다.
function RenderPreflight({
  job,
  shotTitleById,
  onFocusMissingShot,
  onReviewRights
}: {
  job: RenderJob;
  shotTitleById: Map<string, string>;
  onFocusMissingShot: (shotId: string) => void;
  onReviewRights: () => void;
}) {
  return (
    <div className="preflight" aria-label="렌더 잡 점검">
      <div className="preflight-row">
        <span className="preflight-key">렌더 구성</span>
        <span className="preflight-val">
          <strong>{job.renderPlan.shots.length}컷</strong> 연결 · 전체 약 {formatSeconds(job.renderPlan.totalDurationSec)}
        </span>
      </div>
      <PreflightFlags
        plan={job.renderPlan}
        rights={job.rightsReview}
        shotTitleById={shotTitleById}
        onFocusMissingShot={onFocusMissingShot}
        onReviewRights={onReviewRights}
      />
    </div>
  );
}

// 렌더 시작 전 read-only 미리 점검. studioApi.previewRender 결과(예상 비용/시간·빠지는 컷·권리)를
// "예상"으로 명확히 구분해 보여주고, 설정이 바뀌면 stale 배지로 재점검을 유도한다.
function RenderPreviewBlock({
  preview,
  previewing,
  previewError,
  stale,
  staleSpec,
  staleSource,
  shotTitleById,
  onPreview,
  onFocusMissingShot,
  onReviewRights
}: {
  preview: RenderPreview | null;
  previewing: boolean;
  previewError: string | null;
  stale: boolean;
  staleSpec: boolean;
  staleSource: boolean;
  shotTitleById: Map<string, string>;
  onPreview: () => void;
  onFocusMissingShot: (shotId: string) => void;
  onReviewRights: () => void;
}) {
  const blocking = preview ? preview.renderPlan.missingShotIds.length > 0 || preview.rightsReview.required : false;
  return (
    <div className={`render-preview${stale ? " is-stale" : ""}`} aria-label="내보내기 미리 점검">
      <div className="render-preview-head">
        <span className="badge preview-badge">예상</span>
        <span className="render-preview-title">렌더 시작 전 미리 점검</span>
        <button type="button" className="secondary preview-refresh" onClick={onPreview} disabled={previewing}>
          {previewing ? "점검 중" : preview ? "다시 점검" : "미리 점검"}
        </button>
      </div>
      {previewError ? <div className="preflight-flag warn-flag">{previewError}</div> : null}
      {!preview && !previewError ? (
        <p className="render-preview-empty">{previewing ? "현재 설정으로 예상을 계산하는 중입니다…" : "현재 설정의 예상 비용·시간과 빠지는 컷·권리 경고를 확인하세요."}</p>
      ) : null}
      {preview ? (
        <div className="preflight">
          {staleSource ? (
            <div className="preflight-flag stale-flag">
              <strong>프로젝트가 바뀌었습니다</strong>
              <p>미리 점검한 뒤 컷·편집·권리 등 프로젝트 내용이 바뀌었습니다. “다시 점검”을 눌러 지금 상태로 다시 확인하세요.</p>
            </div>
          ) : null}
          {staleSpec ? (
            <div className="preflight-flag stale-flag">
              <strong>설정이 바뀌었습니다</strong>
              <p>아래 예상은 직전 설정 기준입니다. “다시 점검”을 누르면 지금 설정으로 다시 계산합니다.</p>
            </div>
          ) : null}
          <div className="preflight-row">
            <span className="preflight-key">예상 비용 · 시간</span>
            <span className="preflight-val">
              <strong>{preview.estimate.credits}⚡</strong> · 약 {formatSeconds(preview.estimate.etaSec)}
            </span>
          </div>
          <div className="preflight-row">
            <span className="preflight-key">예상 결과</span>
            <span className="preflight-val">
              <strong>{preview.renderPlan.shots.length}컷</strong> 연결 · 전체 약 {formatSeconds(preview.renderPlan.totalDurationSec)}
            </span>
          </div>
          <PreflightFlags
            plan={preview.renderPlan}
            rights={preview.rightsReview}
            shotTitleById={shotTitleById}
            onFocusMissingShot={onFocusMissingShot}
            onReviewRights={onReviewRights}
          />
          <div className={`preflight-flag ${blocking ? "warn-flag" : "ok-flag"} render-preview-tip`}>
            {blocking
              ? "지금도 부분 내보내기는 가능합니다. 다만 빠진 컷을 선택하고 권리를 확인한 뒤 내보내면 더 완성도 높은 결과를 받습니다."
              : "지금 설정으로 내보내도 좋은 상태입니다. 선택된 컷이 모두 포함되고 별도 권리 확인도 필요 없습니다."}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// missing 컷 / 권리 경고 플래그. 잡 점검과 미리 점검이 같은 표현을 공유한다.
function PreflightFlags({
  plan,
  rights,
  shotTitleById,
  onFocusMissingShot,
  onReviewRights
}: {
  plan: RenderPlan;
  rights: RenderRightsReview;
  shotTitleById: Map<string, string>;
  onFocusMissingShot: (shotId: string) => void;
  onReviewRights: () => void;
}) {
  const missing = plan.missingShotIds;
  // 빠진 컷이 여러 개면 비교 화면에 모든 컷이 있으므로, 액션은 첫 컷으로 포커스만 옮기고 안내로 나머지를 보완한다.
  const firstMissing = missing[0] ?? null;
  const firstMissingTitle = firstMissing ? shotTitleById.get(firstMissing) || null : null;
  return (
    <>
      {missing.length ? (
        <div className="preflight-flag warn-flag">
          <strong>빠지는 컷 {missing.length}개</strong>
          <p>아직 선택된 결과가 없어 이번 내보내기에는 포함되지 않습니다. 비교 화면에서 후보를 선택하면 다음 렌더에 합쳐집니다.</p>
          <ul>
            {missing.map((shotId) => (
              <li key={shotId}>{shotTitleById.get(shotId) || shotId}</li>
            ))}
          </ul>
          {firstMissing ? (
            <div className="preflight-actions">
              <button type="button" className="secondary preflight-action" onClick={() => onFocusMissingShot(firstMissing)}>
                {missing.length > 1 ? "비교 화면에서 첫 컷 채우기" : "비교 화면에서 채우기"}
              </button>
              {missing.length > 1 ? (
                <p className="preflight-action-note">{firstMissingTitle ? `“${firstMissingTitle}”로 이동합니다. ` : ""}비교 화면에 빠진 컷이 모두 있습니다.</p>
              ) : null}
            </div>
          ) : null}
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
          <div className="preflight-actions">
            <button type="button" className="secondary preflight-action" onClick={onReviewRights}>
              Asset Library에서 확인
            </button>
          </div>
        </div>
      ) : (
        <div className="preflight-flag ok-flag">권리 확인 완료 · 별도 점검이 필요한 외부 이미지가 없습니다.</div>
      )}
    </>
  );
}

function NoProject() {
  return <div className="empty">선택된 프로젝트가 없습니다.</div>;
}

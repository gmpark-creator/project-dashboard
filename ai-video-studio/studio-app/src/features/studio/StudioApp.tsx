"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INTENT_TEMPLATES } from "@/domain/templates";
import { creditCostForAction, DEFAULT_EXPORT_RENDER_COUNT } from "@/domain/cost-policy";
import type { Aspect, AssetKind, AssetUsage, CreditTransaction, DirectionSpec, EditState, ExportSpec, ImageAsset, ImageAssetRole, ImageMakerPurpose, Intent, JobQueueSnapshot, JobStatus, JobStatusCounts, MediaArtifact, MediaArtifactCleanup, MediaArtifactInventory, MediaArtifactInventoryItem, Project, ProjectBundle, ProviderHealthSnapshot, QueueJobKind, RenderJob, RenderPlan, RenderPreview, RenderRightsReview, RuntimeReadiness, Saec, Shot, StorageCleanupAction, StorageCleanupExecutionSnapshot, StorageCleanupPlan, SystemMetrics, Take, WorkerCompletionSnapshot, WorkerCompletionStatus, WorkerDispatchKind, WorkerDispatchSnapshot, WorkerLeaseSnapshot, WorkerLeaseStatus, WorkerRetryAction, WorkerRetryExecutionSnapshot, WorkerRetryPlan } from "@/domain/types";
import { studioApi } from "./api";
import { CancelJobButton } from "./CancelJobButton";
import {
  aspectRatioCss,
  creditActionLabels,
  creditKindMeta,
  describeFailure,
  formatLedgerTime,
  formatSeconds,
  imageJobStageLabel,
  jobBadgeTone,
  progress,
  purposeLabels,
  purposeToRole,
  qualityLabel,
  readinessCheckLabels,
  readinessStatusText,
  readinessTime,
  renderStageLabel,
  roleLabels,
  scoreBadgeClass,
  shotStatusLabel,
  statusLabel,
  tierLabel,
  type ScoreLabel
} from "./format";

type View = "dashboard" | "images" | "assets" | "new" | "storyboard" | "compare" | "edit" | "export" | "ops";

const titles: Record<View, [string, string]> = {
  dashboard: ["프로젝트", "진행 중인 비주얼 프로젝트와 완료된 렌더를 확인합니다"],
  images: ["Image Maker", "영상 재료가 될 제품, 인물, 배경, 스타일 이미지를 만듭니다"],
  assets: ["Asset Library", "생성 이미지와 외부 이미지를 분류하고 영상 컷에 연결합니다"],
  new: ["Video Maker", "아이디어와 목적만 정하면 스토리보드를 만듭니다"],
  storyboard: ["스토리보드", "장면과 컷을 확인하고 전체 생성을 시작합니다"],
  compare: ["비교 선택", "컷별 후보를 보고 선택하거나 해당 컷만 다시 시도합니다"],
  edit: ["다듬기", "자막, 사운드, 보이스, 전환을 저장합니다"],
  export: ["내보내기", "선택된 컷을 여러 길이의 렌더 잡으로 보냅니다"],
  ops: ["운영", "워커·큐·엔진·스토리지 상태를 읽기 전용으로 점검합니다"]
};

function nextViewForBundle(nextBundle: ProjectBundle) {
  if (nextBundle.project.status === "rendering" || nextBundle.project.status === "done" || nextBundle.renderJobs.length) return "export";
  const selectedCount = nextBundle.shots.filter((shot) => shot.selectedTakeId).length;
  if (selectedCount && selectedCount === nextBundle.shots.length) return "edit";
  if (nextBundle.takes.length || nextBundle.shots.some((shot) => shot.status === "failed" || shot.status === "reviewing" || shot.status === "generating")) return "compare";
  return "storyboard";
}

// 상단 바에 항상 떠 있는 컴팩트한 런타임 상태 배지. 모바일(레일 푸터가 숨는 ≤980px)에서도 보이도록
// topbar-actions에 둔다. 배지를 누르면 점검 항목과 누락 환경변수 이름을 펼친다. 환경변수 값은 절대
// 노출하지 않고 이름만 칩으로 보여준다.
function RuntimeReadinessBadge({ readiness }: { readiness: RuntimeReadiness | null }) {
  const [open, setOpen] = useState(false);
  if (!readiness) return null;

  const production = readiness.mode === "production";
  const worst = readiness.checks.some((item) => item.status === "fail")
    ? "fail"
    : readiness.checks.some((item) => item.status === "warn")
      ? "warn"
      : "pass";
  // 운영 모드는 ready 여부로, 목업 모드는 점검 결과로 톤을 정한다(목업은 항상 ready=true).
  const tone = production ? (readiness.ready ? "pass" : "fail") : worst === "fail" ? "fail" : worst === "warn" ? "warn" : "pass";
  const attention = readiness.checks.filter((item) => item.status === "warn" || item.status === "fail").length;
  const modeLabel = production ? "운영 모드" : "목업 모드";
  const stateLabel = production ? (readiness.ready ? "준비됨" : "점검 필요") : attention ? "확인 권장" : "정상";

  return (
    <div className={`readiness ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className={`readiness-badge tone-${tone}`}
        aria-expanded={open}
        aria-controls="readiness-panel"
        onClick={() => setOpen((value) => !value)}
        title={`런타임 상태 · ${modeLabel} · ${stateLabel}`}
      >
        <span className="readiness-dot" aria-hidden="true" />
        <span className="readiness-mode">{modeLabel}</span>
        {attention ? <span className="readiness-count">{attention}</span> : null}
      </button>
      {open ? (
        <div id="readiness-panel" className="readiness-panel" role="region" aria-label="런타임 점검 상세">
          <div className="readiness-head">
            <strong>{modeLabel} · {stateLabel}</strong>
            {readinessTime(readiness.generatedAt) ? <span className="readiness-time">{readinessTime(readiness.generatedAt)} 점검</span> : null}
          </div>
          <ul className="readiness-list">
            {readiness.checks.map((item) => (
              <li key={item.id} className={`readiness-item status-${item.status}`}>
                <span className="readiness-item-dot" aria-hidden="true" />
                <span className="readiness-item-label">{readinessCheckLabels[item.id] || item.label}</span>
                <span className="readiness-item-status">{readinessStatusText[item.status]}</span>
              </li>
            ))}
          </ul>
          {readiness.missingEnv.length ? (
            <div className="readiness-env">
              <span className="readiness-env-title">누락 환경변수</span>
              <div className="readiness-env-chips">
                {readiness.missingEnv.map((name) => (
                  <code key={name} className="readiness-env-chip">{name}</code>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// 운영 지표용 컴팩트 스탯 한 칸. 큰 숫자 + 작은 라벨. tone으로만(초록/빨강) 방향을 읽게 해
// 사인 혼동을 피한다. 내부 id·엔진명은 다루지 않고 집계 수치만 표시한다.
function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "warn" }) {
  return (
    <div className="metric">
      <span className={`metric-value${tone ? ` tone-${tone}` : ""}`}>{value}</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

// 잡 상태 → 운영자용 한국어 라벨과 배지 톤. 진행/대기=중립·활성(시안), 완료=초록, 실패=빨강,
// 취소=중립. 작업 현황 줄에서 0이 아닌 상태만 칩으로 노출해 컴팩트하게 유지한다.
const metricJobStatusMeta: Array<{ key: keyof JobStatusCounts; label: string; tone: "active" | "ok" | "warn" | "" }> = [
  { key: "running", label: "진행", tone: "active" },
  { key: "queued", label: "대기", tone: "active" },
  { key: "done", label: "완료", tone: "ok" },
  { key: "failed", label: "실패", tone: "warn" },
  { key: "cancelled", label: "취소", tone: "" }
];

function MetricJobRow({ name, counts }: { name: string; counts: JobStatusCounts }) {
  const shown = metricJobStatusMeta.filter((status) => counts[status.key] > 0);
  return (
    <div className="metric-job-row">
      <span className="metric-job-name">{name}</span>
      {shown.length ? (
        <span className="metric-job-counts">
          {shown.map((status) => (
            <span key={status.key} className={`metric-job-count${status.tone ? ` tone-${status.tone}` : ""}`}>
              {status.label} {counts[status.key]}
            </span>
          ))}
        </span>
      ) : (
        <span className="metric-job-empty">없음</span>
      )}
    </div>
  );
}

function formatAvgLatency(ms: number | null) {
  if (ms === null) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}초`;
  return `${ms}ms`;
}

// 운영자용 시스템/운영 지표 surface. 전체 프로젝트의 프로덕션 상태·크레딧·작업 현황·엔진 시도 결과·
// 미디어 산출물을 한 패널에 컴팩트하게 모은다. 엔진/모델 이름, 잡·자산 id, 원시 프롬프트, 환경변수
// 값은 다루지 않고 집계 수치만 보여준다. 데이터는 GET /api/system/metrics(SystemMetrics)에서 온다.
function SystemMetricsPanel({ metrics }: { metrics: SystemMetrics }) {
  const inFlight =
    metrics.jobs.generation.queued +
    metrics.jobs.generation.running +
    metrics.jobs.image.queued +
    metrics.jobs.image.running +
    metrics.jobs.render.queued +
    metrics.jobs.render.running;
  const time = readinessTime(metrics.generatedAt);
  return (
    <section className="panel metrics" aria-label="운영 지표">
      <div className="head">
        <div>
          <h2>운영 지표</h2>
          <p className="hint">전체 프로젝트의 작업·크레딧·산출물 현황을 한눈에 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${inFlight ? "fast" : "ok"}`}>{inFlight ? `진행 중 작업 ${inFlight}건` : "진행 중 작업 없음"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">프로덕션</span>
          <div className="metric-row">
            <Metric label="프로젝트" value={metrics.projects.total} />
            <Metric label="진행 중" value={metrics.projects.active} />
            <Metric label="완료" value={metrics.projects.done} tone={metrics.projects.done ? "ok" : undefined} />
            <Metric label="실패" value={metrics.projects.failed} tone={metrics.projects.failed ? "warn" : undefined} />
            <Metric label="진행 중 작업" value={inFlight} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">크레딧 ⚡</span>
          <div className="metric-row">
            <Metric label="사용 가능" value={metrics.credits.available} />
            <Metric label="예약" value={metrics.credits.reserved} />
            <Metric label="사용" value={metrics.credits.spent} />
            <Metric label="사용 확정" value={metrics.credits.captured} />
            <Metric label="환불" value={metrics.credits.refunded} tone={metrics.credits.refunded ? "ok" : undefined} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">작업 현황</span>
          <div className="metric-jobs">
            <MetricJobRow name="영상 생성" counts={metrics.jobs.generation} />
            <MetricJobRow name="이미지" counts={metrics.jobs.image} />
            <MetricJobRow name="내보내기" counts={metrics.jobs.render} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">엔진 시도 결과</span>
          <div className="metric-row">
            <Metric label="시도" value={metrics.providerAttempts.total} />
            <Metric label="성공" value={metrics.providerAttempts.succeeded} tone={metrics.providerAttempts.succeeded ? "ok" : undefined} />
            <Metric label="실패" value={metrics.providerAttempts.failed} tone={metrics.providerAttempts.failed ? "warn" : undefined} />
            <Metric label="재시도 가능" value={metrics.providerAttempts.retryableFailures} />
            <Metric label="대체 권장" value={metrics.providerAttempts.fallbackSuggested} />
            <Metric label="평균 응답" value={formatAvgLatency(metrics.providerAttempts.avgLatencyMs)} />
          </div>
          <p className="hint metrics-note">엔진·모델 이름은 표시하지 않고 시도 결과만 집계합니다.</p>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">미디어 산출물</span>
          <div className="metric-row">
            <Metric label="전체" value={metrics.mediaArtifacts.total} />
            <Metric label="이미지" value={metrics.mediaArtifacts.images} />
            <Metric label="영상" value={metrics.mediaArtifacts.videos} />
            <Metric label="외부 연결" value={metrics.mediaArtifacts.external} />
          </div>
        </div>
      </div>
    </section>
  );
}

// 미디어 산출물의 보관 역할(role)을 운영자용 한국어 라벨로 바꾼다. 계약상 role은 산출물의 쓰임
// (이미지 자산/썸네일/영상 테이크/포스터/내보내기 결과)을 나타내는 분류값이라 노출해도 안전하다.
// 원시 자산/잡 id·소유자 id·스토리지 키는 다루지 않는다.
const artifactRoleLabels: Record<MediaArtifact["role"], string> = {
  image_asset: "이미지 자산",
  image_thumbnail: "이미지 썸네일",
  take_video: "영상 테이크",
  take_poster: "영상 포스터",
  render_output: "내보내기 결과"
};

const artifactKindLabels: Record<AssetKind, string> = {
  image: "이미지",
  video: "영상",
  audio: "오디오",
  brand: "브랜드"
};

// 정리 상태(cleanup)별 라벨·배지 톤·설명. retain=소유 자산이 있는 저장 산출물(보관),
// review_external=외부 연결이라 권리 확인 권장, orphaned=연결된 자산이 없어 정리 검토 대상.
// 이는 읽기 전용 안내일 뿐이며 이 화면에서 실제 삭제/정리는 하지 않는다.
const artifactCleanupMeta: Record<MediaArtifactCleanup, { label: string; tone: string; hint: string }> = {
  retain: { label: "보관", tone: "ok", hint: "소유 자산이 존재하는 저장 산출물" },
  review_external: { label: "외부 확인", tone: "fast", hint: "외부 연결 산출물 — 사용 권리 확인 권장" },
  orphaned: { label: "미참조", tone: "warn", hint: "연결된 자산이 없어 정리 검토 대상" }
};

// 바이트 수를 사람이 읽는 단위로 축약한다. 100 이상이거나 바이트 단위면 정수로, 그 외엔 소수 1자리로.
function formatBytes(bytes: number) {
  if (bytes <= 0) return "0B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exp = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** exp;
  return `${value >= 100 || exp === 0 ? Math.round(value) : value.toFixed(1)}${units[exp]}`;
}

// 인벤토리 목록의 한 줄. 프로젝트 제목·보관 역할·종류·저장 위치(저장/외부)·정리 상태·참조 수·용량·
// 상대 시각만 보여준다. 원시 url·스토리지 키·contentType·자산/잡/소유자 id 등 백엔드용 식별자는
// 계약에 들어 있어도 화면에는 절대 노출하지 않는다(사용자/운영자 안전).
function ArtifactRow({ item }: { item: MediaArtifactInventoryItem }) {
  const meta = artifactCleanupMeta[item.cleanup];
  const sizeLabel = item.artifact.bytes === null ? "용량 미상" : formatBytes(item.artifact.bytes);
  return (
    <li className="artifact-row">
      <div className="artifact-main">
        <strong className="artifact-title">{item.projectTitle}</strong>
        <span className="artifact-sub">
          {artifactRoleLabels[item.artifact.role]} · {artifactKindLabels[item.artifact.kind]} · {item.artifact.status === "stored" ? "저장됨" : "외부 연결"}
        </span>
      </div>
      <div className="artifact-side">
        <span className={`badge ${meta.tone}`} title={meta.hint}>{meta.label}</span>
        <span className="artifact-meta">
          {item.referenced ? `참조 ${item.referenceCount}` : "참조 없음"} · {sizeLabel} · {formatLedgerTime(item.artifact.createdAt)}
        </span>
      </div>
    </li>
  );
}

// 운영자용 미디어 산출물/스토리지 인벤토리 surface. 전체 프로젝트의 저장 vs 외부 산출물, 이미지/영상
// 구성, 정리 상태(보관/외부 확인/미참조), 저장 용량·용량 미상 건수와 최근 산출물 목록을 컴팩트하게
// 모은다. 데이터는 GET /api/system/media-artifacts(MediaArtifactInventory)에서 온다. 이 화면은
// 읽기 전용 점검용이며 삭제/정리 동작은 제공하지 않는다. 프로바이더/모델 이름, 원시 프롬프트, 환경값,
// 원시 자산/잡/소유자 id, 스토리지 키, url은 노출하지 않는다.
function MediaArtifactInventoryPanel({ inventory }: { inventory: MediaArtifactInventory }) {
  const { summary, artifacts } = inventory;
  const time = readinessTime(inventory.generatedAt);
  const attention = summary.orphaned + summary.reviewExternal;
  const retained = Math.max(0, summary.total - summary.orphaned - summary.reviewExternal);
  const recent = artifacts.slice(0, 8);
  return (
    <section className="panel metrics artifact-inventory" aria-label="미디어 산출물 인벤토리">
      <div className="head">
        <div>
          <h2>미디어 산출물 인벤토리</h2>
          <p className="hint">전체 프로젝트의 저장·외부 산출물과 정리 상태를 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${attention ? "warn" : "ok"}`}>{attention ? `확인 권장 ${attention}건` : "정리 양호"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">보관 현황</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="저장됨" value={summary.stored} />
            <Metric label="외부 연결" value={summary.external} />
            <Metric label="이미지" value={summary.images} />
            <Metric label="영상" value={summary.videos} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">정리 상태 · 용량</span>
          <div className="metric-row">
            <Metric label="보관" value={retained} tone={retained ? "ok" : undefined} />
            <Metric label="외부 확인" value={summary.reviewExternal} tone={summary.reviewExternal ? "warn" : undefined} />
            <Metric label="미참조" value={summary.orphaned} tone={summary.orphaned ? "warn" : undefined} />
            <Metric label="저장 용량" value={formatBytes(summary.knownBytes)} />
            <Metric label="용량 미상" value={`${summary.unknownBytes}건`} />
          </div>
          <p className="hint metrics-note">정리 상태는 읽기 전용 안내입니다. 이 화면에서 산출물을 삭제하거나 정리하지 않습니다.</p>
        </div>
      </div>
      {recent.length ? (
        <div className="artifact-list">
          <span className="metric-block-label">최근 산출물</span>
          <ul>
            {recent.map((item, index) => (
              <ArtifactRow key={`${item.artifact.createdAt}-${index}`} item={item} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">아직 저장된 미디어 산출물이 없습니다.</div>
      )}
    </section>
  );
}

// 큐 잡 종류(generation/image/render)를 운영자용 한국어 라벨로 바꾼다. 계약상 kind는 작업 분류값이라
// 노출해도 안전하다. 원시 잡/프로젝트 id는 다루지 않는다.
const queueKindLabels: Record<QueueJobKind, string> = {
  generation: "영상 생성",
  image: "이미지",
  render: "내보내기"
};

// 큐 잡의 진행 단계(stage)를 한국어로 바꾼다. 종류별로 단계 어휘가 달라(이미지/렌더/영상 생성) 알려진
// 단계는 매핑하고, 미정의 값은 원문으로 폴백한다. stage는 워크플로 단계 라벨일 뿐 식별자가 아니다.
const queueStageLabels: Record<string, string> = {
  queued: "대기 중",
  prompting: "요구사항 정리 중",
  generating: "생성 중",
  saving: "저장 중",
  assemble: "컷 합치는 중",
  audio_mix: "소리 입히는 중",
  caption_burn: "자막 입히는 중",
  encode: "인코딩 중",
  upscale: "고해상도 처리 중",
  done: "완료",
  failed: "실패"
};

function queueStageLabel(stage: string) {
  return queueStageLabels[stage] || stage;
}

// 마감 시각(epoch ms)을 "지금 / N초 후 / N분 후 / N시간 후"의 짧은 상대 시간으로 표시한다. null이면 —.
// 이미 지난 마감은 "지금"으로 흡수한다(기한 초과 건수는 요약에서 별도로 센다).
function formatDueIn(epochMs: number | null) {
  if (epochMs === null) return "—";
  const diffSec = Math.round((epochMs - Date.now()) / 1000);
  if (diffSec <= 0) return "지금";
  if (diffSec < 60) return `${diffSec}초 후`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}분 후`;
  const hr = Math.floor(min / 60);
  return `${hr}시간 후`;
}

// 운영자용 작업 큐/워커 스냅샷 surface. 전체 프로젝트의 큐 작업을 대기/진행/진행 중/취소 가능/실패/취소/
// 기한 초과/다음 마감으로 요약하고, 최근·진행 작업을 종류·상태·단계·진행률·예상 시간만으로 짧게 보여준다.
// 데이터는 GET /api/system/queue(JobQueueSnapshot)에서 온다. 이 화면은 읽기 전용 운영 점검용이며 큐
// 일시정지/재개/재시도/삭제 같은 워커 제어 동작은 제공하지 않는다. 계약에 들어 있는 원시 잡·프로젝트·
// 테이크·자산 id, 프로바이더/모델 이름, 원시 프롬프트, request id, 스토리지 키, url, 환경값은 노출하지 않는다.
function JobQueueSnapshotPanel({ queue }: { queue: JobQueueSnapshot }) {
  const { summary, jobs } = queue;
  const time = readinessTime(queue.generatedAt);
  // 진행 중(대기/진행) 잡을 먼저(마감 임박 순), 그다음 최근 갱신 순으로 정렬해 상위 8건만 컴팩트하게 노출한다.
  const rows = [...jobs]
    .sort((a, b) => {
      const aActive = a.status === "queued" || a.status === "running" ? 0 : 1;
      const bActive = b.status === "queued" || b.status === "running" ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      if (aActive === 0) return a.dueAt - b.dueAt;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, 8);
  return (
    <section className="panel metrics queue-snapshot" aria-label="작업 큐 스냅샷">
      <div className="head">
        <div>
          <h2>작업 큐 스냅샷</h2>
          <p className="hint">전체 프로젝트의 큐·워커 작업 현황을 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.active ? "fast" : "ok"}`}>{summary.active ? `진행 중 작업 ${summary.active}건` : "진행 중 작업 없음"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">작업 현황</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="대기" value={summary.queued} />
            <Metric label="진행" value={summary.running} />
            <Metric label="진행 중" value={summary.active} />
            <Metric label="취소 가능" value={summary.cancelable} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">상태 · 마감</span>
          <div className="metric-row">
            <Metric label="실패" value={summary.failed} tone={summary.failed ? "warn" : undefined} />
            <Metric label="취소됨" value={summary.cancelled} />
            <Metric label="기한 초과" value={summary.overdue} tone={summary.overdue ? "warn" : undefined} />
            <Metric label="다음 마감" value={formatDueIn(summary.nextDueAt)} />
          </div>
          <p className="hint metrics-note">읽기 전용 운영 스냅샷입니다. 이 화면에서 큐를 멈추거나 재시도/삭제하지 않습니다.</p>
        </div>
      </div>
      {rows.length ? (
        <div className="queue-list">
          <span className="metric-block-label">최근·진행 작업</span>
          <ul>
            {rows.map((job, index) => {
              const active = job.status === "queued" || job.status === "running";
              return (
                <li className="queue-row" key={`${job.kind}-${job.updatedAt}-${index}`}>
                  <div className="queue-main">
                    <strong className="queue-title">{queueKindLabels[job.kind]}</strong>
                    <span className="queue-sub">
                      {queueStageLabel(job.stage)} · {Math.round(job.progress * 100)}%
                      {active && job.etaSec !== null ? ` · 예상 ${formatSeconds(job.etaSec)}` : ""}
                    </span>
                  </div>
                  <div className="queue-side">
                    <span className={`badge ${jobBadgeTone(job.status)}`}>{statusLabel(job.status)}</span>
                    <span className="queue-meta">
                      {active ? formatDueIn(job.dueAt) : formatLedgerTime(job.updatedAt)}
                      {job.cancelable ? " · 취소 가능" : ""}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">현재 큐에 표시할 작업이 없습니다.</div>
      )}
    </section>
  );
}

// ── 운영 콘솔(Operations Console) 패널 ─────────────────────────────────────────
// 워커 파이프라인(디스패치→리스→완료→재시도)·엔진 헬스·런타임 점검을 읽기 전용으로 모으는 운영자 surface.
// 계약상 섞여 오는 raw id·token·provider/model 실명·storageKey·url·workerId·dispatchKey는 절대 노출하지
// 않고, summary 집계와 안전 라벨(종류·상태·단계·상대시간·집계 수치)만 그린다. 데이터는 GET /api/system/*
// 운영자 스냅샷에서 오며 admin-guard라 권한이 없으면 호출이 실패하므로, 상위에서 흡수하고 패널을 숨긴다.

// 워커 작업 종류(provider_generation/image_generation/render) → 한국어. 큐 라벨과 어휘를 맞춘다.
const workerKindLabels: Record<WorkerDispatchKind, string> = {
  provider_generation: "영상 생성",
  image_generation: "이미지",
  render: "내보내기"
};

// ISO 만료 시각을 "N분 후 만료" 형태 상대시간으로. 이미 지난 만료는 "만료 임박"으로 흡수한다.
function expiresInLabel(iso: string) {
  const ms = new Date(iso).getTime();
  if (Number.isNaN(ms)) return "";
  const diffSec = Math.round((ms - Date.now()) / 1000);
  if (diffSec <= 0) return "만료 임박";
  if (diffSec < 60) return `${diffSec}초 후 만료`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}분 후 만료`;
  return `${Math.floor(min / 60)}시간 후 만료`;
}

// 워커 디스패치 스냅샷. 엔진에 전달 대기·진행 중인 작업을 종류별 분포·기한 초과 중심으로 요약한다.
// dispatchKey·jobId·projectId·invocation은 노출하지 않고 종류·상태·단계·예상 시간만 보여준다.
function WorkerDispatchPanel({ dispatch }: { dispatch: WorkerDispatchSnapshot }) {
  const { summary, items } = dispatch;
  const time = readinessTime(dispatch.generatedAt);
  const rows = [...items]
    .sort((a, b) => {
      const aActive = a.status === "running" ? 0 : 1;
      const bActive = b.status === "running" ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return a.dueAt - b.dueAt;
    })
    .slice(0, 8);
  return (
    <section className="panel metrics" aria-label="워커 디스패치">
      <div className="head">
        <div>
          <h2>워커 디스패치</h2>
          <p className="hint">엔진에 전달 대기·진행 중인 작업을 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.running + summary.queued ? "fast" : "ok"}`}>{summary.running + summary.queued ? `진행 중 ${summary.running + summary.queued}건` : "대기 작업 없음"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">디스패치 현황</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="대기" value={summary.queued} />
            <Metric label="진행" value={summary.running} />
            <Metric label="기한 초과" value={summary.overdue} tone={summary.overdue ? "warn" : undefined} />
            <Metric label="다음 마감" value={formatDueIn(summary.nextDueAt)} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">종류별</span>
          <div className="metric-row">
            <Metric label="영상 생성" value={summary.providerGeneration} />
            <Metric label="이미지" value={summary.imageGeneration} />
            <Metric label="내보내기" value={summary.render} />
          </div>
        </div>
      </div>
      {rows.length ? (
        <div className="queue-list">
          <span className="metric-block-label">진행·대기 작업</span>
          <ul>
            {rows.map((item) => (
              <li className="queue-row" key={item.dispatchKey}>
                <div className="queue-main">
                  <strong className="queue-title">{workerKindLabels[item.kind]}</strong>
                  <span className="queue-sub">
                    {queueStageLabel(item.stage)}
                    {item.etaSec !== null ? ` · 예상 ${formatSeconds(item.etaSec)}` : ""}
                  </span>
                </div>
                <div className="queue-side">
                  <span className={`badge ${item.status === "running" ? "fast" : ""}`}>{item.status === "running" ? "진행" : "대기"}</span>
                  <span className="queue-meta">
                    {formatDueIn(item.dueAt)}
                    {item.cancelable ? " · 취소 가능" : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">현재 디스패치 대기·진행 작업이 없습니다.</div>
      )}
    </section>
  );
}

const leaseStatusMeta: Record<WorkerLeaseStatus, { label: string; tone: string }> = {
  active: { label: "진행 중", tone: "fast" },
  released: { label: "반납됨", tone: "" },
  expired: { label: "만료", tone: "warn" }
};

// 워커 리스 스냅샷. 워커가 작업을 점유(리스)한 현황. active를 만료 임박 순으로 상위 8건만 보여준다.
// token·workerId·dispatchKey·jobId 등 식별자는 노출하지 않고 종류·상태·만료 상대시간만 보여준다.
function WorkerLeasePanel({ leases }: { leases: WorkerLeaseSnapshot }) {
  const { summary } = leases;
  const time = readinessTime(leases.generatedAt);
  const rows = [...leases.leases]
    .sort((a, b) => {
      const aActive = a.status === "active" ? 0 : 1;
      const bActive = b.status === "active" ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
    })
    .slice(0, 8);
  return (
    <section className="panel metrics" aria-label="워커 리스">
      <div className="head">
        <div>
          <h2>워커 리스</h2>
          <p className="hint">워커가 점유 중인 작업과 만료 현황을 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.active ? "fast" : "ok"}`}>{summary.active ? `점유 중 ${summary.active}건` : "점유 없음"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">리스 현황</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="진행 중" value={summary.active} tone={summary.active ? "ok" : undefined} />
            <Metric label="반납됨" value={summary.released} />
            <Metric label="만료" value={summary.expired} tone={summary.expired ? "warn" : undefined} />
          </div>
        </div>
      </div>
      {rows.length ? (
        <div className="queue-list">
          <span className="metric-block-label">최근 리스</span>
          <ul>
            {rows.map((lease) => {
              const meta = leaseStatusMeta[lease.status];
              const when =
                lease.status === "active"
                  ? expiresInLabel(lease.expiresAt)
                  : lease.status === "released"
                    ? lease.releasedAt
                      ? `${formatLedgerTime(lease.releasedAt)} 반납`
                      : "반납됨"
                    : "만료됨";
              return (
                <li className="queue-row" key={lease.id}>
                  <div className="queue-main">
                    <strong className="queue-title">{workerKindLabels[lease.kind]}</strong>
                    <span className="queue-sub">{formatLedgerTime(lease.leasedAt)} 점유</span>
                  </div>
                  <div className="queue-side">
                    <span className={`badge ${meta.tone}`}>{meta.label}</span>
                    <span className="queue-meta">{when}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">현재 점유 중인 리스가 없습니다.</div>
      )}
    </section>
  );
}

const completionStatusMeta: Record<WorkerCompletionStatus, { label: string; tone: string }> = {
  succeeded: { label: "성공", tone: "ok" },
  failed: { label: "실패", tone: "warn" },
  cancelled: { label: "취소", tone: "" }
};

// 워커 완료 수령증 스냅샷. 완료된 작업의 성공/실패·산출물 수·확정/환불 크레딧을 집계한다. jobId·
// completionKey·원시 error·artifacts는 노출하지 않고 종류·상태·집계 수치만 보여준다.
function WorkerCompletionPanel({ completions }: { completions: WorkerCompletionSnapshot }) {
  const { summary } = completions;
  const time = readinessTime(completions.generatedAt);
  const rows = [...completions.receipts]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 8);
  return (
    <section className="panel metrics" aria-label="워커 완료">
      <div className="head">
        <div>
          <h2>워커 완료</h2>
          <p className="hint">완료된 작업의 결과와 크레딧 정산을 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.failed ? "warn" : "ok"}`}>{summary.failed ? `실패 ${summary.failed}건` : `성공 ${summary.succeeded}건`}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">완료 현황</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="성공" value={summary.succeeded} tone={summary.succeeded ? "ok" : undefined} />
            <Metric label="실패" value={summary.failed} tone={summary.failed ? "warn" : undefined} />
            <Metric label="취소" value={summary.cancelled} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">산출물 · 크레딧</span>
          <div className="metric-row">
            <Metric label="산출물" value={summary.artifactCount} />
            <Metric label="확정 ⚡" value={summary.capturedCredits} />
            <Metric label="환불 ⚡" value={summary.refundedCredits} tone={summary.refundedCredits ? "ok" : undefined} />
          </div>
        </div>
      </div>
      {rows.length ? (
        <div className="queue-list">
          <span className="metric-block-label">최근 완료</span>
          <ul>
            {rows.map((receipt) => {
              const meta = completionStatusMeta[receipt.status];
              return (
                <li className="queue-row" key={receipt.completionKey}>
                  <div className="queue-main">
                    <strong className="queue-title">{workerKindLabels[receipt.kind]}</strong>
                    <span className="queue-sub">
                      산출물 {receipt.summary.artifactCount}
                      {receipt.summary.capturedCredits ? ` · 확정 ${receipt.summary.capturedCredits}⚡` : ""}
                      {receipt.summary.refundedCredits ? ` · 환불 ${receipt.summary.refundedCredits}⚡` : ""}
                    </span>
                  </div>
                  <div className="queue-side">
                    <span className={`badge ${meta.tone}`}>{meta.label}</span>
                    <span className="queue-meta">{formatLedgerTime(receipt.completedAt)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">아직 완료된 작업이 없습니다.</div>
      )}
    </section>
  );
}

const retryActionLabels: Record<WorkerRetryAction, string> = {
  retry_provider_generation: "영상 재생성",
  retry_image_generation: "이미지 재생성",
  retry_render: "내보내기 재시도",
  hold: "보류"
};

// 워커 재시도 계획. 실패 작업을 재시도 가능/보류로 분류한 읽기 전용 계획. 실제 재시도 실행은 운영
// 런북(Codex 백엔드) 영역이라 이 화면에서 실행하지 않는다. receipt의 id는 노출하지 않는다.
function WorkerRetryPlanPanel({ plan }: { plan: WorkerRetryPlan }) {
  const { summary } = plan;
  const time = readinessTime(plan.generatedAt);
  const rows = plan.items.slice(0, 8);
  return (
    <section className="panel metrics" aria-label="재시도 계획">
      <div className="head">
        <div>
          <h2>재시도 계획</h2>
          <p className="hint">실패 작업의 재시도 가능 여부를 읽기 전용으로 분류합니다. 여기서 직접 재시도하지 않습니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.retryable ? "fast" : summary.totalFailed ? "warn" : "ok"}`}>{summary.totalFailed ? `재시도 가능 ${summary.retryable}/${summary.totalFailed}` : "실패 없음"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">분류</span>
          <div className="metric-row">
            <Metric label="실패" value={summary.totalFailed} tone={summary.totalFailed ? "warn" : undefined} />
            <Metric label="재시도 가능" value={summary.retryable} tone={summary.retryable ? "ok" : undefined} />
            <Metric label="보류" value={summary.hold} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">종류별</span>
          <div className="metric-row">
            <Metric label="영상 생성" value={summary.providerGeneration} />
            <Metric label="이미지" value={summary.imageGeneration} />
            <Metric label="내보내기" value={summary.render} />
          </div>
        </div>
      </div>
      {rows.length ? (
        <div className="queue-list">
          <span className="metric-block-label">계획 항목</span>
          <ul>
            {rows.map((item) => (
              <li className="queue-row" key={item.receipt.completionKey}>
                <div className="queue-main">
                  <strong className="queue-title">{workerKindLabels[item.receipt.kind]}</strong>
                  <span className="queue-sub">
                    {retryActionLabels[item.action]}
                    {item.fallbackSuggested ? " · 대체 권장" : ""}
                  </span>
                </div>
                <div className="queue-side">
                  <span className={`badge ${item.retryable ? "fast" : ""}`}>{item.retryable ? "재시도 가능" : "보류"}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">재시도할 실패 작업이 없습니다.</div>
      )}
    </section>
  );
}

// 워커 재시도 실행 스냅샷. 재시도로 만들어진 교체 작업 이력. 교체 누락은 점검 신호다. sourceJobId·
// replacementJobId 등 id는 노출하지 않고 동작·교체 종류·시각만 보여준다.
function WorkerRetryExecutionPanel({ executions }: { executions: WorkerRetryExecutionSnapshot }) {
  const { summary } = executions;
  const time = readinessTime(executions.generatedAt);
  const rows = [...executions.items]
    .sort((a, b) => new Date(b.record.createdAt).getTime() - new Date(a.record.createdAt).getTime())
    .slice(0, 8);
  return (
    <section className="panel metrics" aria-label="재시도 실행">
      <div className="head">
        <div>
          <h2>재시도 실행</h2>
          <p className="hint">재시도로 생성된 교체 작업 이력을 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.missingReplacement ? "warn" : "ok"}`}>{summary.missingReplacement ? `교체 누락 ${summary.missingReplacement}건` : `교체 ${summary.withReplacement}건`}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">실행 현황</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="교체 있음" value={summary.withReplacement} tone={summary.withReplacement ? "ok" : undefined} />
            <Metric label="교체 누락" value={summary.missingReplacement} tone={summary.missingReplacement ? "warn" : undefined} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">종류별</span>
          <div className="metric-row">
            <Metric label="영상 생성" value={summary.providerGeneration} />
            <Metric label="이미지" value={summary.imageGeneration} />
            <Metric label="내보내기" value={summary.render} />
          </div>
        </div>
      </div>
      {rows.length ? (
        <div className="queue-list">
          <span className="metric-block-label">최근 재시도</span>
          <ul>
            {rows.map((item) => (
              <li className="queue-row" key={item.record.id}>
                <div className="queue-main">
                  <strong className="queue-title">{retryActionLabels[item.record.action]}</strong>
                  <span className="queue-sub">
                    교체 {queueKindLabels[item.record.replacementKind]}
                    {item.replacementMissing ? " · 교체 누락" : ""}
                  </span>
                </div>
                <div className="queue-side">
                  <span className={`badge ${item.replacementMissing ? "warn" : "ok"}`}>{item.replacementMissing ? "누락" : "생성됨"}</span>
                  <span className="queue-meta">{formatLedgerTime(item.record.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">아직 재시도 실행 이력이 없습니다.</div>
      )}
    </section>
  );
}

// 엔진 상태 스냅샷. 생성 엔진의 가용성을 점검하되, 제품 원칙(P1: 모델명 숨김)과 노출 금지 규칙에 따라
// provider/model 실명·reason은 절대 노출하지 않고 상태 분포와 기능 지원 개수만 집계로 보여준다.
function ProviderHealthPanel({ health }: { health: ProviderHealthSnapshot }) {
  const { summary, targets } = health;
  const time = readinessTime(health.generatedAt);
  const attention = summary.degraded + summary.down;
  const audioCount = targets.filter((target) => target.supportsAudio === true || target.supportsAudio === "true").length;
  const imageInput = targets.filter((target) => target.input.includes("image")).length;
  const textInput = targets.filter((target) => target.input.includes("text")).length;
  return (
    <section className="panel metrics" aria-label="엔진 상태">
      <div className="head">
        <div>
          <h2>엔진 상태</h2>
          <p className="hint">생성 엔진의 가용성을 이름 없이 집계로만 점검합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${attention ? "warn" : "ok"}`}>{attention ? `점검 권장 ${attention}개` : "전체 정상"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">가용성</span>
          <div className="metric-row">
            <Metric label="모니터링" value={summary.total} />
            <Metric label="정상" value={summary.healthy} tone={summary.healthy ? "ok" : undefined} />
            <Metric label="주의" value={summary.degraded} tone={summary.degraded ? "warn" : undefined} />
            <Metric label="중단" value={summary.down} tone={summary.down ? "warn" : undefined} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">기능 지원</span>
          <div className="metric-row">
            <Metric label="오디오" value={audioCount} />
            <Metric label="이미지 입력" value={imageInput} />
            <Metric label="텍스트 입력" value={textInput} />
          </div>
          <p className="hint metrics-note">엔진·모델 이름은 표시하지 않고 가용성·기능만 집계합니다.</p>
        </div>
      </div>
    </section>
  );
}

// 운영 콘솔용 런타임 점검 패널. 상단 배지(RuntimeReadinessBadge)와 같은 데이터를 쓰되, 콘솔에서는
// 클릭 없이 점검 항목을 펼쳐 보여준다. 환경변수는 이름만 노출하고 값은 보여주지 않는다.
// 점검 항목별 한국어 액션 힌트(프로덕션 준비 체크리스트용). 무엇을 설정해야 정상이 되는지 안내한다.
// provider/model 실명은 쓰지 않고 개념(프로바이더 키·오브젝트 스토리지 등)으로만 설명한다.
const readinessHints: Record<string, string> = {
  runtime_mode: "프로덕션 전환 시 운영 모드로 전환됩니다.",
  mock_persistence: "파일 기반 목업 저장소가 켜져 있습니다.",
  persistence: "프로덕션 데이터베이스 연결이 필요합니다.",
  provider_credentials: "생성 엔진 사용을 위한 프로바이더 키가 필요합니다.",
  provider_execution: "엔진 실행을 위한 프로바이더 키가 필요합니다.",
  story_decomposer: "스토리 분해 엔진 설정이 필요합니다.",
  object_storage: "산출물 저장용 오브젝트 스토리지가 필요합니다.",
  queue_worker: "비동기 작업 큐 연결이 필요합니다.",
  worker_output_policy: "프로덕션에서는 실제 산출물이 있어야 완료로 인정됩니다.",
  admin_access: "운영자 API 보호용 관리자 토큰이 필요합니다."
};

function ReadinessConsolePanel({ readiness }: { readiness: RuntimeReadiness }) {
  const production = readiness.mode === "production";
  const attention = readiness.checks.filter((item) => item.status === "warn" || item.status === "fail").length;
  const passCount = readiness.checks.filter((item) => item.status === "pass").length;
  const total = readiness.checks.length;
  const time = readinessTime(readiness.generatedAt);
  const modeLabel = production ? "운영 모드" : "목업 모드";
  return (
    <section className="panel metrics" aria-label="런타임 점검">
      <div className="head">
        <div>
          <h2>런타임 점검 · 프로덕션 준비</h2>
          <p className="hint">
            {modeLabel} · 점검 {passCount}/{total} 정상
            {!production && attention ? " · 아래 항목은 프로덕션 전환 시 필요합니다" : ""}
          </p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${production ? (readiness.ready ? "ok" : "warn") : attention ? "warn" : "ok"}`}>
            {production ? (readiness.ready ? "준비됨" : "점검 필요") : attention ? `설정 필요 ${attention}건` : "정상"}
          </span>
          {time ? <span className="hint">{time} 점검</span> : null}
        </div>
      </div>
      <ul className="readiness-list">
        {readiness.checks.map((item) => {
          const hint = item.status !== "pass" ? readinessHints[item.id] : undefined;
          return (
            <li key={item.id} className={`readiness-item status-${item.status}`}>
              <span className="readiness-item-dot" aria-hidden="true" />
              <span className="readiness-item-label">{readinessCheckLabels[item.id] || item.label}</span>
              <span className="readiness-item-status">{readinessStatusText[item.status]}</span>
              {hint ? <span className="readiness-item-hint">{hint}</span> : null}
            </li>
          );
        })}
      </ul>
      {readiness.missingEnv.length ? (
        <div className="readiness-env">
          <span className="readiness-env-title">{production ? "누락된 필수 환경변수" : "프로덕션 전환에 필요한 환경변수"}</span>
          <div className="readiness-env-chips">
            {readiness.missingEnv.map((name) => (
              <code key={name} className="readiness-env-chip">{name}</code>
            ))}
          </div>
        </div>
      ) : null}
      {readiness.invalidEnv.length ? (
        <div className="readiness-env">
          <span className="readiness-env-title">형식이 올바르지 않은 환경변수</span>
          <div className="readiness-env-chips">
            {readiness.invalidEnv.map((name) => (
              <code key={name} className="readiness-env-chip">{name}</code>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

const cleanupActionMeta: Record<StorageCleanupAction, { label: string; tone: string }> = {
  retain: { label: "보관", tone: "ok" },
  review_external: { label: "외부 확인", tone: "fast" },
  delete_object: { label: "삭제 후보", tone: "warn" }
};

// 스토리지 정리 계획. 저장 산출물을 보관/외부 확인/삭제 후보로 분류한 읽기 전용 계획. 실제 삭제는 운영
// 런북(Codex 백엔드) 영역이라 이 화면에서 실행하지 않는다. storageKey·artifact id는 노출하지 않고
// 보관 역할·종류·정리 분류·참조 수·용량만 보여준다.
function StorageCleanupPlanPanel({ plan }: { plan: StorageCleanupPlan }) {
  const { summary } = plan;
  const time = readinessTime(plan.generatedAt);
  const rank = (action: StorageCleanupAction) => (action === "delete_object" ? 0 : action === "review_external" ? 1 : 2);
  const rows = [...plan.items].sort((a, b) => rank(a.action) - rank(b.action)).slice(0, 8);
  return (
    <section className="panel metrics" aria-label="스토리지 정리 계획">
      <div className="head">
        <div>
          <h2>스토리지 정리 계획</h2>
          <p className="hint">저장 산출물의 정리 후보를 읽기 전용으로 분류합니다. 이 화면에서 삭제하지 않습니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.deleteCandidates ? "warn" : "ok"}`}>{summary.deleteCandidates ? `삭제 후보 ${summary.deleteCandidates}건` : "정리 양호"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">정리 분류</span>
          <div className="metric-row">
            <Metric label="전체" value={summary.total} />
            <Metric label="보관" value={summary.retain} tone={summary.retain ? "ok" : undefined} />
            <Metric label="외부 확인" value={summary.reviewExternal} tone={summary.reviewExternal ? "warn" : undefined} />
            <Metric label="삭제 후보" value={summary.deleteCandidates} tone={summary.deleteCandidates ? "warn" : undefined} />
          </div>
        </div>
        <div className="metric-block">
          <span className="metric-block-label">회수 가능 용량</span>
          <div className="metric-row">
            <Metric label="회수 가능" value={formatBytes(summary.knownReclaimableBytes)} />
            <Metric label="용량 미상" value={`${summary.unknownReclaimableItems}건`} />
          </div>
          <p className="hint metrics-note">정리 계획은 읽기 전용 안내입니다. 실제 삭제는 운영 런북에서 수행합니다.</p>
        </div>
      </div>
      {rows.length ? (
        <div className="artifact-list">
          <span className="metric-block-label">정리 후보</span>
          <ul>
            {rows.map((item) => {
              const meta = cleanupActionMeta[item.action];
              return (
                <li className="artifact-row" key={item.artifact.id}>
                  <div className="artifact-main">
                    <strong className="artifact-title">{artifactRoleLabels[item.artifact.role]}</strong>
                    <span className="artifact-sub">
                      {artifactKindLabels[item.artifact.kind]} · {item.referenced ? `참조 ${item.referenceCount}` : "참조 없음"}
                      {item.artifact.bytes !== null ? ` · ${formatBytes(item.artifact.bytes)}` : ""}
                    </span>
                  </div>
                  <div className="artifact-side">
                    <span className={`badge ${meta.tone}`}>{meta.label}</span>
                    <span className="artifact-meta">{formatLedgerTime(item.artifact.createdAt)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">정리할 산출물이 없습니다.</div>
      )}
    </section>
  );
}

// 스토리지 정리 실행 이력. 실제로 정리(삭제)된 산출물 기록. id·artifactId·projectId·storageKey·reason은
// 노출하지 않고 회수 용량·시각만 보여준다.
function StorageCleanupExecutionPanel({ executions }: { executions: StorageCleanupExecutionSnapshot }) {
  const { summary } = executions;
  const time = readinessTime(executions.generatedAt);
  const rows = [...executions.records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  return (
    <section className="panel metrics" aria-label="스토리지 정리 실행">
      <div className="head">
        <div>
          <h2>스토리지 정리 실행</h2>
          <p className="hint">실제 정리(삭제)된 산출물 이력을 읽기 전용으로 요약합니다.</p>
        </div>
        <div className="metrics-meta">
          <span className={`badge ${summary.deleted ? "fast" : "ok"}`}>{summary.deleted ? `정리 ${summary.deleted}건` : "정리 이력 없음"}</span>
          {time ? <span className="hint">{time} 기준</span> : null}
        </div>
      </div>
      <div className="metric-blocks">
        <div className="metric-block">
          <span className="metric-block-label">정리 실행 현황</span>
          <div className="metric-row">
            <Metric label="기록" value={summary.total} />
            <Metric label="삭제됨" value={summary.deleted} />
            <Metric label="회수 용량" value={formatBytes(summary.knownReclaimedBytes)} />
            <Metric label="용량 미상" value={`${summary.unknownReclaimedItems}건`} />
          </div>
        </div>
      </div>
      {rows.length ? (
        <div className="artifact-list">
          <span className="metric-block-label">최근 정리</span>
          <ul>
            {rows.map((record) => (
              <li className="artifact-row" key={record.id}>
                <div className="artifact-main">
                  <strong className="artifact-title">산출물 삭제</strong>
                  <span className="artifact-sub">{record.bytes !== null ? `${formatBytes(record.bytes)} 회수` : "용량 미상"}</span>
                </div>
                <div className="artifact-side">
                  <span className="badge">삭제됨</span>
                  <span className="artifact-meta">{formatLedgerTime(record.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="empty compact-empty">아직 정리 실행 이력이 없습니다.</div>
      )}
    </section>
  );
}

// 운영 콘솔 상단 건강 요약 스트립. 12개 패널을 스크롤하지 않고 이상 징후(점검 필요·실패·재시도·엔진·삭제
// 후보)를 한눈에 triage하고, 타일을 누르면 해당 패널로 부드럽게 스크롤한다. 소스 스냅샷이 로드된 타일만
// 노출하며, 표시할 게 없으면 아무것도 렌더하지 않는다. 집계 수치만 다루고 raw 식별자는 노출하지 않는다.
function OpsSummaryStrip({
  readiness,
  queue,
  retryPlan,
  providerHealth,
  cleanupPlan
}: {
  readiness: RuntimeReadiness | null;
  queue: JobQueueSnapshot | null;
  retryPlan: WorkerRetryPlan | null;
  providerHealth: ProviderHealthSnapshot | null;
  cleanupPlan: StorageCleanupPlan | null;
}) {
  const tiles: Array<{ label: string; value: string | number; tone: "ok" | "warn" | ""; target: string }> = [];
  if (readiness) {
    const attention = readiness.checks.filter((item) => item.status === "warn" || item.status === "fail").length;
    const production = readiness.mode === "production";
    tiles.push({
      label: production ? "운영 모드" : "목업 모드",
      value: attention ? `점검 ${attention}` : "정상",
      tone: attention ? "warn" : "ok",
      target: "런타임 점검"
    });
  }
  if (queue) {
    tiles.push({ label: "진행 중 작업", value: queue.summary.active, tone: "", target: "작업 큐 스냅샷" });
    if (queue.summary.failed) tiles.push({ label: "실패 작업", value: queue.summary.failed, tone: "warn", target: "작업 큐 스냅샷" });
  }
  if (retryPlan && retryPlan.summary.totalFailed) {
    tiles.push({
      label: "재시도 가능",
      value: `${retryPlan.summary.retryable}/${retryPlan.summary.totalFailed}`,
      tone: retryPlan.summary.retryable ? "ok" : "warn",
      target: "재시도 계획"
    });
  }
  if (providerHealth) {
    const down = providerHealth.summary.degraded + providerHealth.summary.down;
    tiles.push({ label: "엔진 점검", value: down ? down : "정상", tone: down ? "warn" : "ok", target: "엔진 상태" });
  }
  if (cleanupPlan && cleanupPlan.summary.deleteCandidates) {
    tiles.push({ label: "삭제 후보", value: cleanupPlan.summary.deleteCandidates, tone: "warn", target: "스토리지 정리 계획" });
  }
  if (!tiles.length) return null;
  const scrollTo = (label: string) => {
    const el = document.querySelector(`section[aria-label="${label}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section className="panel ops-summary" aria-label="운영 요약">
      <div className="head">
        <div>
          <h2>운영 요약</h2>
          <p className="hint">이상 징후를 한눈에 확인하고, 타일을 누르면 해당 패널로 이동합니다.</p>
        </div>
      </div>
      <div className="ops-summary-grid">
        {tiles.map((tile) => (
          <button
            key={tile.label}
            type="button"
            className={`ops-tile${tile.tone ? ` tone-${tile.tone}` : ""}`}
            onClick={() => scrollTo(tile.target)}
            title={`${tile.label} · ${tile.target}로 이동`}
          >
            <span className="ops-tile-value">{tile.value}</span>
            <span className="ops-tile-label">{tile.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

// 운영 콘솔. 워커·큐·엔진·런타임·스토리지 상태를 한 화면에 모은 읽기 전용 운영자 surface. 로드된 패널만
// 렌더하고 권한/네트워크로 모두 실패하면 안내를 보여준다. 이 화면은 어떤 작업도 변경·중단하지 않는다.
function OperationsConsole({
  readiness,
  metrics,
  queue,
  dispatch,
  leases,
  completions,
  retryPlan,
  retryExecutions,
  providerHealth,
  inventory,
  cleanupPlan,
  cleanupExecutions
}: {
  readiness: RuntimeReadiness | null;
  metrics: SystemMetrics | null;
  queue: JobQueueSnapshot | null;
  dispatch: WorkerDispatchSnapshot | null;
  leases: WorkerLeaseSnapshot | null;
  completions: WorkerCompletionSnapshot | null;
  retryPlan: WorkerRetryPlan | null;
  retryExecutions: WorkerRetryExecutionSnapshot | null;
  providerHealth: ProviderHealthSnapshot | null;
  inventory: MediaArtifactInventory | null;
  cleanupPlan: StorageCleanupPlan | null;
  cleanupExecutions: StorageCleanupExecutionSnapshot | null;
}) {
  const anyLoaded =
    readiness || metrics || queue || dispatch || leases || completions || retryPlan || retryExecutions || providerHealth || inventory || cleanupPlan || cleanupExecutions;
  return (
    <>
      <div className="head">
        <div>
          <h2>운영 콘솔</h2>
          <p className="hint">워커·큐·엔진·런타임·스토리지 상태를 한곳에서 읽기 전용으로 점검합니다. 이 화면에서는 어떤 작업도 멈추거나 변경하지 않습니다.</p>
        </div>
      </div>
      <OpsSummaryStrip readiness={readiness} queue={queue} retryPlan={retryPlan} providerHealth={providerHealth} cleanupPlan={cleanupPlan} />
      {readiness ? <ReadinessConsolePanel readiness={readiness} /> : null}
      {metrics ? <SystemMetricsPanel metrics={metrics} /> : null}
      {queue ? <JobQueueSnapshotPanel queue={queue} /> : null}
      {dispatch ? <WorkerDispatchPanel dispatch={dispatch} /> : null}
      {leases ? <WorkerLeasePanel leases={leases} /> : null}
      {completions ? <WorkerCompletionPanel completions={completions} /> : null}
      {retryPlan ? <WorkerRetryPlanPanel plan={retryPlan} /> : null}
      {retryExecutions ? <WorkerRetryExecutionPanel executions={retryExecutions} /> : null}
      {providerHealth ? <ProviderHealthPanel health={providerHealth} /> : null}
      {inventory ? <MediaArtifactInventoryPanel inventory={inventory} /> : null}
      {cleanupPlan ? <StorageCleanupPlanPanel plan={cleanupPlan} /> : null}
      {cleanupExecutions ? <StorageCleanupExecutionPanel executions={cleanupExecutions} /> : null}
      {!anyLoaded ? (
        <div className="empty">
          <div>
            <h2>운영 데이터를 불러오지 못했습니다</h2>
            <p>운영 권한이 필요한 화면일 수 있습니다. 잠시 후 자동으로 다시 시도합니다.</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function StudioApp() {
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  // 첫 프로젝트 목록 로드가 끝났는지. 로드 전엔 "프로젝트 없음" 빈 상태 대신 로딩 표시를 보여준다(false-empty flash 방지).
  const [loaded, setLoaded] = useState(false);
  const [bundle, setBundle] = useState<ProjectBundle | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [intent, setIntent] = useState<Intent>("shorts");
  const [toast, setToast] = useState("");
  // 실패한 작업의 한국어 복구 안내. 토스트(2.6초 자동 사라짐)와 달리 사용자가 닫거나 다음 작업이
  // 성공할 때까지 남겨, 실패 원인과 다음 행동을 분명히 안내한다.
  const [failureNotice, setFailureNotice] = useState<{ title: string; detail: string } | null>(null);
  // mutating 작업이 진행 중인지(전역). 상단바 "처리 중" 표시와 긴 작업(예: 초안 자동 생성) 버튼 잠금에 쓴다.
  const [pending, setPending] = useState(false);
  // 취소 요청이 떠 있는 동안의 잡 id(또는 배치 취소 시 첫 잡 id). 값이 있으면 모든 취소 버튼을 잠가
  // 중복 취소를 막고, 해당 버튼만 "취소 중…"으로 표시한다.
  const [cancelingJobId, setCancelingJobId] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<RuntimeReadiness | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [inventory, setInventory] = useState<MediaArtifactInventory | null>(null);
  const [queue, setQueue] = useState<JobQueueSnapshot | null>(null);
  // 운영 콘솔(ops 뷰) 전용 운영자 스냅샷. 콘솔에 있는 동안에만 조회하고, 실패한 것만 패널을 숨긴다.
  const [dispatch, setDispatch] = useState<WorkerDispatchSnapshot | null>(null);
  const [leases, setLeases] = useState<WorkerLeaseSnapshot | null>(null);
  const [completions, setCompletions] = useState<WorkerCompletionSnapshot | null>(null);
  const [retryPlan, setRetryPlan] = useState<WorkerRetryPlan | null>(null);
  const [retryExecutions, setRetryExecutions] = useState<WorkerRetryExecutionSnapshot | null>(null);
  const [providerHealth, setProviderHealth] = useState<ProviderHealthSnapshot | null>(null);
  const [cleanupPlan, setCleanupPlan] = useState<StorageCleanupPlan | null>(null);
  const [cleanupExecutions, setCleanupExecutions] = useState<StorageCleanupExecutionSnapshot | null>(null);
  const toastTimer = useRef<number | null>(null);
  // 작업이 처리되는 동안 같은/다른 mutating 버튼을 다시 눌러 생기는 중복 제출·이중 과금을 막는다.
  const runningRef = useRef(false);
  // 뷰 전환 시 화면 제목(h1)으로 포커스를 옮겨 스크린리더/키보드 사용자가 내용 변경을 인지하게 한다.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const viewMountedRef = useRef(false);
  // 백그라운드 tick 루프에서 매번 지표를 새로 받지 않도록 틱 수를 센다(몇 틱마다 한 번만 갱신).
  const tickCount = useRef(0);

  // 운영 지표 조회. 실패해도 패널만 숨기고 본 작업 흐름은 막지 않는다(읽기 전용 부가 정보).
  function loadMetrics() {
    studioApi.getSystemMetrics().then(setMetrics).catch(() => {});
  }

  // 미디어 산출물 인벤토리 조회. 지표와 같은 정책으로, 실패해도 패널만 숨기고 본 흐름은 막지 않는다.
  function loadInventory() {
    studioApi.getMediaArtifactInventory().then(setInventory).catch(() => {});
  }

  // 작업 큐 스냅샷 조회. 지표·인벤토리와 같은 정책으로, 실패해도 패널만 숨기고 본 흐름은 막지 않는다.
  function loadQueue() {
    studioApi.getJobQueueSnapshot().then(setQueue).catch(() => {});
  }

  // 운영 콘솔용 운영자 스냅샷 일괄 조회. 모두 admin-guard라 권한이 없으면 실패하므로 각 패널을 독립적으로
  // 갱신하고, 실패한 것만 숨긴다(본 작업 흐름 비차단). 콘솔(ops 뷰)에 있는 동안에만 호출한다.
  function loadOps() {
    studioApi.getWorkerDispatch().then(setDispatch).catch(() => {});
    studioApi.getWorkerLeases().then(setLeases).catch(() => {});
    studioApi.getWorkerCompletions().then(setCompletions).catch(() => {});
    studioApi.getWorkerRetryPlan().then(setRetryPlan).catch(() => {});
    studioApi.getWorkerRetryExecutions().then(setRetryExecutions).catch(() => {});
    studioApi.getProviderHealth().then(setProviderHealth).catch(() => {});
    studioApi.getStorageCleanupPlan().then(setCleanupPlan).catch(() => {});
    studioApi.getStorageCleanupExecutions().then(setCleanupExecutions).catch(() => {});
    loadMetrics();
    loadQueue();
    loadInventory();
  }

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
    setFailureNotice(null);
    setView(nextView);
  }

  useEffect(() => {
    refresh().catch((error) => notify(error.message)).finally(() => setLoaded(true));
    loadMetrics();
    loadInventory();
    loadQueue();
    const id = window.setInterval(async () => {
      try {
        const nextQueue = await studioApi.tick();
        setQueue(nextQueue);
      } catch {
        // Production does not expose the mock tick endpoint.
      }
      await refresh();
      // 지표·인벤토리·큐 스냅샷은 tick으로 잡 상태가 진행되며 바뀌므로 라이브로 유지하되, 매 틱 호출은
      // 과해서 약 5틱(~6초)마다 한 번만 갱신한다. 액션 직후에는 run/cancel 경로에서 즉시 갱신한다.
      tickCount.current += 1;
      if (tickCount.current % 5 === 0) {
        loadMetrics();
        loadInventory();
        loadQueue();
      }
    }, 1200);
    return () => {
      window.clearInterval(id);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 런타임 점검은 환경변수 기반이라 거의 변하지 않으므로 마운트 시 1회만 조회한다. 실패해도 배지를
  // 숨기고 본 작업 흐름을 막지 않는다.
  useEffect(() => {
    studioApi.getReadiness().then(setReadiness).catch(() => setReadiness(null));
  }, []);

  // 운영 콘솔(ops) 화면에 있는 동안에만 운영자 스냅샷을 주기적으로 갱신한다. 다른 화면에서는 호출하지
  // 않아 불필요한 운영자 API 부하를 피한다. 화면을 떠나면 인터벌을 정리한다.
  useEffect(() => {
    if (view !== "ops") return;
    loadOps();
    const id = window.setInterval(loadOps, 4000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  useEffect(() => {
    const projectTitle = bundle?.project.title ? ` · ${bundle.project.title}` : "";
    document.title = `${titles[view][0]}${projectTitle} | Cutpilot`;
  }, [bundle?.project.title, view]);

  // 뷰가 바뀌면(최초 마운트 제외) 화면 제목(h1)으로 포커스를 이동한다. h1은 tabIndex=-1이라 탭 순서엔
  // 들어가지 않고 프로그램적 포커스만 받는다 — 스크린리더가 새 화면 시작점을 바로 안내한다.
  useEffect(() => {
    if (!viewMountedRef.current) {
      viewMountedRef.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [view]);

  // 모든 mutating 액션의 공통 실행기. (1) 이미 처리 중이면 중복 제출을 막고, (2) 성공 시 직전 실패
  // 안내를 지우고 성공 토스트+새로고침, (3) 실패 시 raw 에러를 노출하지 않고 code 기준 한국어 복구
  // 안내(failureNotice)를 띄운다. 14개 호출부(이미지/스토리보드/비교/편집/내보내기)가 모두 이 경로를 탄다.
  async function run(action: () => Promise<unknown>, message: string) {
    if (runningRef.current) {
      notify("앞선 작업을 처리하고 있어요. 잠시만요…");
      return;
    }
    runningRef.current = true;
    setPending(true);
    try {
      await action();
      setFailureNotice(null);
      notify(message);
      await refresh();
      loadMetrics();
      loadInventory();
      loadQueue();
    } catch (error) {
      setFailureNotice(describeFailure(error));
    } finally {
      runningRef.current = false;
      setPending(false);
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
      loadMetrics();
      loadInventory();
      loadQueue();
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
      loadMetrics();
      loadInventory();
      loadQueue();
      setCancelingJobId(null);
    }
  }

  function targetShotId() {
    return selectedShot?.id || bundle?.shots[0]?.id || null;
  }

  // 사용 가능 credit = balance - spent - reserved (실제 예약 체크와 동일). spent를 빼지 않으면 과대표시된다.
  const creditBalance = bundle ? Math.max(0, bundle.credits.balance - bundle.credits.spent - bundle.credits.reserved) : 1240;

  return (
    <div className="shell">
      {toast ? <div className="toast" role="status" aria-live="polite" aria-atomic="true">{toast}</div> : null}
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
            <h1 ref={headingRef} tabIndex={-1}>{titles[view][0]}</h1>
            <p>{titles[view][1]}</p>
          </div>
          <div className="topbar-actions">
            <RuntimeReadinessBadge readiness={readiness} />
            {pending ? <span className="pending-pill" role="status" aria-live="polite">처리 중…</span> : null}
            <span className="credit-pill">{creditBalance} ⚡</span>
            <span className="hint">자동 저장됨</span>
          </div>
        </header>
        <section className="view">
          {failureNotice ? (
            <div className="failure-notice" role="alert" aria-live="assertive">
              <div className="failure-body">
                <strong>{failureNotice.title}</strong>
                <p>{failureNotice.detail}</p>
              </div>
              <button type="button" className="failure-dismiss" onClick={() => setFailureNotice(null)}>
                닫기
              </button>
            </div>
          ) : null}
          {view === "dashboard" ? (
            <Dashboard
              loaded={loaded}
              projects={projects}
              metrics={metrics}
              queue={queue}
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
              busy={pending}
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
              inventory={inventory}
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
              busy={pending}
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
              onExpressCreate={(input) =>
                run(async () => {
                  const project = await studioApi.createProject(input);
                  setSelectedProjectId(project.id);
                  setSelectedShotId(null);
                  // P3(완성본 먼저): 빈 스토리보드 대신, 빠른 미리보기 품질로 모든 컷을 바로 생성하고
                  // 비교 화면으로 보내 완성될 초안부터 보여준다.
                  await studioApi.generateAll(project.id, "fast");
                  setBundle(await studioApi.getBundle(project.id));
                  goToView("compare");
                }, "초안을 만들고 있어요 — 첫 컷부터 채워집니다.")
              }
            />
          ) : null}
          {view === "storyboard" ? (
            <Storyboard
              busy={pending}
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
              busy={pending}
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
          {view === "ops" ? (
            <OperationsConsole
              readiness={readiness}
              metrics={metrics}
              queue={queue}
              dispatch={dispatch}
              leases={leases}
              completions={completions}
              retryPlan={retryPlan}
              retryExecutions={retryExecutions}
              providerHealth={providerHealth}
              inventory={inventory}
              cleanupPlan={cleanupPlan}
              cleanupExecutions={cleanupExecutions}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}

function Dashboard({
  loaded,
  projects,
  metrics,
  queue,
  onNew,
  onImages,
  onOpen
}: {
  loaded: boolean;
  projects: Project[];
  metrics: SystemMetrics | null;
  queue: JobQueueSnapshot | null;
  onNew: () => void;
  onImages: () => void;
  onOpen: (projectId: string) => void;
}) {
  if (!loaded) {
    return (
      <div className="empty">
        <div>
          <strong>프로젝트를 불러오는 중…</strong>
          <p className="hint">잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }
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
      {metrics ? <SystemMetricsPanel metrics={metrics} /> : null}
      {queue ? <JobQueueSnapshotPanel queue={queue} /> : null}
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
  onUseAsset,
  busy
}: {
  bundle: ProjectBundle | null;
  cancelingJobId: string | null;
  onCancelJob: (jobId: string) => void;
  onGenerate: (input: { prompt: string; purpose: ImageMakerPurpose; role: ImageAssetRole; aspect: Project["aspect"]; style?: string; count?: number }) => void;
  onUseAsset: (assetId: string, mode: AssetUsage["mode"]) => void;
  busy: boolean;
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
          <button type="button" className="primary" disabled={busy} onClick={() => onGenerate({ prompt, purpose, role, aspect: bundle.project.aspect, style, count: 4 })}>
            이미지 후보 만들기 <span className="cost">{creditCostForAction("generateImages", { imageCount: 4 })}⚡</span>
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
  inventory,
  onRegister,
  onUseAsset
}: {
  bundle: ProjectBundle | null;
  inventory: MediaArtifactInventory | null;
  onRegister: (input: { label: string; role: ImageAssetRole; url: string; aspect?: Project["aspect"]; prompt?: string; rightsConfirmed?: boolean }) => void;
  onUseAsset: (assetId: string, mode: AssetUsage["mode"]) => void;
}) {
  const [label, setLabel] = useState("외부 인물 참조");
  const [url, setUrl] = useState("https://example.com/reference-image.png");
  const [role, setRole] = useState<ImageAssetRole>("character");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  if (!bundle) return <NoProject />;
  return (
    <>
    {inventory ? <MediaArtifactInventoryPanel inventory={inventory} /> : null}
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
    </>
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
  onCreate,
  onExpressCreate,
  busy
}: {
  intent: Intent;
  setIntent: (intent: Intent) => void;
  onCreate: (input: { title: string; idea: string; intent: Intent }) => void;
  onExpressCreate: (input: { title: string; idea: string; intent: Intent }) => void;
  busy: boolean;
}) {
  const [title, setTitle] = useState("딸기라떼 쇼츠");
  const [idea, setIdea] = useState("신메뉴 딸기라떼를 소개하는 15초 세로 쇼츠. 밝고 산뜻하며 첫 2초에 시선을 잡아야 한다.");
  const [error, setError] = useState("");

  // 아이디어만 검증하고, 어느 진입 경로(초안까지 자동 / 스토리보드부터 직접)를 탈지는 핸들러로 받는다.
  function submit(handler: (input: { title: string; idea: string; intent: Intent }) => void) {
    const trimmedIdea = idea.trim();
    if (!trimmedIdea) {
      setError("아이디어를 입력해 주세요.");
      return;
    }
    setError("");
    handler({ title: title.trim(), idea: trimmedIdea, intent });
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
        <button type="button" className="primary" disabled={busy} onClick={() => submit(onExpressCreate)}>
          {busy ? "만드는 중…" : "초안까지 한 번에 만들기"}
        </button>
        <button type="button" className="secondary" disabled={busy} onClick={() => submit(onCreate)}>
          스토리보드부터 직접
        </button>
      </div>
      <p className="hint" style={{ marginTop: 8 }}>
        「초안까지」는 빠른 미리보기 품질로 모든 컷을 자동 생성해 완성될 초안부터 보여줍니다(크레딧 사용). 「직접」은 스토리보드를 먼저 검토한 뒤 생성합니다.
      </p>
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
  onCompare,
  busy
}: {
  bundle: ProjectBundle | null;
  selectedShotId: string | null;
  setSelectedShotId: (shotId: string | null) => void;
  canceling: boolean;
  onCancelGeneration: () => void;
  onGenerate: () => void;
  onSaveShot: (patch: ShotEditPatch) => void;
  onCompare: () => void;
  busy: boolean;
}) {
  if (!bundle) return <NoProject />;
  const activeGeneration = bundle.generationJobs.some((job) => job.status === "queued" || job.status === "running");
  const generatableShots = bundle.shots.filter((shot) => shot.status === "pending" || shot.status === "failed");
  const hasGeneratedTakes = bundle.takes.length > 0;
  const canGenerate = !activeGeneration && generatableShots.length > 0;
  // 실제 generateAll 예약과 동일: 생성 대상 컷 수 x (3 take x 6). 정책 단일 출처를 그대로 표시한다.
  const generateCost = creditCostForAction("generateAll", { shotCount: generatableShots.length });
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
          <button type="button" className="primary" disabled={!canGenerate || busy} onClick={onGenerate}>
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
  onEdit,
  busy
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
  busy: boolean;
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
        {!takes.length ? (
          <div className="empty">
            {isGenerating ? "후보를 만드는 중이에요. 곧 여기에 채워집니다." : "아직 후보가 없습니다. 이 컷만 생성해 후보를 볼 수 있습니다."}
          </div>
        ) : null}
        <DirectionPanel shot={selectedShot} referenceAssets={referenceAssets} onUpdate={onUpdateDirection} />
        {selectedShot.qualityFlags[0] ? <div className="notice">{selectedShot.qualityFlags[0].hint}</div> : null}
        <div className="actions">
          {!hasTakes ? (
            <button type="button" className="primary" disabled={isGenerating || busy} onClick={() => onGenerate(selectedShot.id)}>
              이 컷 생성 <span className="cost">{creditCostForAction("generateShot", { takeCount: 3 })}⚡</span>
            </button>
          ) : (
            <button type="button" className={isFailed ? "primary" : "secondary"} disabled={isGenerating || busy} onClick={() => onRegenerate(selectedShot.id, "shot")}>
              이 컷만 다시 <span className="cost">{creditCostForAction("regenerate")}⚡</span>
            </button>
          )}
          {hasTakes ? (
            <button type="button" className="secondary" disabled={isGenerating || busy} onClick={() => onRegenerate(selectedShot.id, "segment")}>
              가능한 좁은 범위로 다시 <span className="cost">~{creditCostForAction("regenerate")}⚡</span>
            </button>
          ) : null}
          {selectedShot.selectedTakeId ? (
            <button
              type="button"
              className="primary"
              disabled={busy}
              title="선택한 컷을 게시용 고품질로 다시 다듬어요. 크레딧이 사용돼요."
              onClick={() => onUpgrade(selectedShot.selectedTakeId as string)}
            >
              게시용 품질로 다듬기 <span className="cost">{creditCostForAction("upgradeTake")}⚡</span>
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
          <div className="progress" role="progressbar" aria-label="후보 생성 중">
            <i className="indeterminate" />
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
            {!activeRender ? <span className="cost">{preview && !previewStale ? `${preview.estimate.credits}⚡` : `${creditCostForAction("startRender", { renderCount: DEFAULT_EXPORT_RENDER_COUNT })}⚡`}</span> : null}
          </button>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>
          6초·15초·30초 세 가지 길이로 한 번에 내보내요. 완료되면 아래 「렌더 버전」에서 길이별로 받아 쓸 수 있어요.
        </p>
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
  return (
    <div className="empty">
      <div>
        <strong>선택된 프로젝트가 없습니다</strong>
        <p className="hint">왼쪽 「프로젝트」에서 기존 작업을 열거나 「Video Maker」에서 새 아이디어로 시작해 보세요.</p>
      </div>
    </div>
  );
}

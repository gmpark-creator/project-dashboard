import { isApiError } from "./api";
import type { Aspect, CreditTransaction, ImageAssetRole, ImageMakerPurpose, JobStatus, Project, RenderJob, RuntimeReadiness, Shot, Take } from "@/domain/types";

// 상태/단계 라벨, 배지 톤, 시간·용량·비율 포맷터, 실패 메시지 등 순수 표현 헬퍼 모음.
// React/앱 상태/run()에 의존하지 않으며, StudioApp 셸과 (이후 분리되는) 뷰·패널이 공통으로 import 한다.
// (design/41 분리 1단계)

export function statusLabel(status: string) {
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
export function jobBadgeTone(status: JobStatus) {
  if (status === "done") return "ok";
  if (status === "failed") return "warn";
  if (status === "cancelled") return "";
  return "fast";
}

// 실패한 작업을 사용자에게 보여줄 한국어 복구 안내로 바꾼다. ApiError의 code/retryable/추정치만 쓰고,
// raw error 문자열·영어 서버 메시지·내부 식별자(jobId/url/provider명)는 절대 노출하지 않는다. 어떤
// 실패든 "이전 작업은 보존된다"는 안심 문구를 함께 준다.
const WORK_PRESERVED = "이전 작업은 그대로 보존됩니다.";

export function describeFailure(error: unknown): { title: string; detail: string } {
  if (isApiError(error)) {
    if (error.code === "INSUFFICIENT_CREDITS") {
      const shortfall = error.estimate?.shortfallCredits;
      const amount = typeof shortfall === "number" && shortfall > 0 ? ` ${shortfall}⚡ 더 필요해요.` : "";
      return {
        title: "크레딧이 부족해요",
        detail: `이 작업을 시작하기엔 크레딧이 모자랍니다.${amount} 더 가벼운 「빠른 미리보기」로 만들거나 크레딧을 충전한 뒤 다시 시도해 주세요. ${WORK_PRESERVED}`
      };
    }
    if (error.retryable || error.fallbackSuggested) {
      return {
        title: "지금은 생성이 잠시 어려워요",
        detail: `잠시 후 다시 시도하거나 다른 방식으로 만들어 볼 수 있어요. ${WORK_PRESERVED}`
      };
    }
    return {
      title: "요청을 처리하지 못했어요",
      detail: `잠시 후 다시 시도해 주세요. 문제가 계속되면 다른 컷부터 진행해도 됩니다. ${WORK_PRESERVED}`
    };
  }
  return {
    title: "요청을 처리하지 못했어요",
    detail: `네트워크 상태를 확인하고 잠시 후 다시 시도해 주세요. ${WORK_PRESERVED}`
  };
}

export function tierLabel(tier: string) {
  return tier === "final" ? "게시용 품질" : tier === "economy" ? "저비용" : "빠른 미리보기";
}

export const roleLabels: Record<ImageAssetRole, string> = {
  product: "제품",
  character: "인물/캐릭터",
  location: "장소",
  style: "스타일",
  keyframe: "첫 프레임",
  thumbnail: "썸네일",
  logo: "로고",
  background: "배경"
};

export const purposeLabels: Record<ImageMakerPurpose, string> = {
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
export const purposeToRole: Record<ImageMakerPurpose, ImageAssetRole> = {
  photoreal: "product",
  product: "product",
  character: "character",
  background: "background",
  style: "style",
  poster: "logo",
  thumbnail: "thumbnail",
  transparent: "product"
};

export type ScoreLabel = "추천" | "안정적" | "확인 필요";

export function scoreBadgeClass(score: ScoreLabel) {
  return score === "추천" ? "ok" : score === "안정적" ? "fast" : "warn";
}

export function imageJobStageLabel(stage: string) {
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

export function shotStatusLabel(shot: Shot) {
  if (shot.selectedTakeId) return "선택됨";
  return statusLabel(shot.status);
}

export function qualityLabel(take: Take) {
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
export function aspectRatioCss(aspect: Aspect) {
  return aspect.replace(":", " / ");
}

export function formatSeconds(sec: number) {
  const rounded = Math.round(sec);
  if (rounded < 60) return `${rounded}초`;
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return seconds ? `${minutes}분 ${seconds}초` : `${minutes}분`;
}

export function renderStageLabel(job: RenderJob) {
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

export function progress(project: Project) {
  if (!project.progress.shotsTotal) return 0;
  return Math.round((project.progress.shotsDone / project.progress.shotsTotal) * 100);
}

// 크레딧 거래의 action(서버 내부 식별자)을 운영자용 한국어 작업 이름으로 바꾼다. 사용자에게
// generateImages/startRender 같은 내부 식별자나 잡/프로바이더/모델 id는 노출하지 않는다.
export const creditActionLabels: Record<CreditTransaction["action"], string> = {
  generateImages: "이미지 후보 생성",
  generateShot: "영상 컷 생성",
  upgradeTake: "게시용 품질 업그레이드",
  startRender: "영상 내보내기"
};

// 거래 종류(reserve/capture/refund)별 라벨·배지 톤. 예약=보류(시안), 사용 확정=실제 차감(골드),
// 환불=되돌려줌(초록). 톤만으로 방향을 읽을 수 있게 해 사인(+/−) 혼동을 피한다.
export const creditKindMeta: Record<CreditTransaction["kind"], { label: string; tone: string }> = {
  reserve: { label: "예약", tone: "fast" },
  capture: { label: "사용 확정", tone: "spend" },
  refund: { label: "환불", tone: "ok" }
};

// 거래 시각을 "방금 / N분 전 / N시간 전 / N일 전"의 짧은 상대 시간으로 표시한다. 운영 화면에서
// 빠르게 훑기 좋고, 정확한 타임스탬프(초 단위)는 굳이 노출하지 않는다.
export function formatLedgerTime(iso: string) {
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

// 운영자용 런타임 점검 라벨. 백엔드가 주는 영어 label/detail 대신 check.id로 한국어 라벨을 직접 매핑해
// 화면을 한국어로 유지한다. 미정의 id는 백엔드 label로 폴백한다(영문이라도 빈 칸보다 낫다).
export const readinessCheckLabels: Record<string, string> = {
  runtime_mode: "런타임 모드",
  mock_persistence: "목업 저장소",
  persistence: "영속성 저장소",
  provider_credentials: "프로바이더 키",
  provider_execution: "엔진 실행",
  story_decomposer: "스토리 분해",
  object_storage: "오브젝트 스토리지",
  queue_worker: "큐 워커",
  worker_output_policy: "워커 산출물 정책",
  admin_access: "관리자 접근"
};

export const readinessStatusText: Record<RuntimeReadiness["checks"][number]["status"], string> = {
  pass: "정상",
  warn: "주의",
  fail: "실패"
};

export function readinessTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

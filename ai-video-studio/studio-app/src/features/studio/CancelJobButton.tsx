"use client";

// 진행 중(대기/진행)인 잡을 취소하는 공통 버튼. 요청이 떠 있는 동안에는 전체 취소 버튼을 잠가
// 중복 취소를 막고(busy), 누른 버튼만 "취소 중…"으로 바꾼다. 내부 잡 id·모델명은 노출하지 않는다.
// ops 콘솔과 크리에이터 뷰가 공유하므로 공통 컴포넌트로 분리(design/41 분리).
export function CancelJobButton({
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

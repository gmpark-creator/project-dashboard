// 박사 라이브 관전용 대시보드 서버.
// live-server CLI의 --ignore는 Windows 절대경로(백슬래시)에 글롭 매칭이 안 되어
// node_modules 수만 파일까지 감시하는 문제가 있음 → 라이브러리 모드 + 정규식 ignore로 우회.
var path = require("path");
var liveServer = require(path.join(__dirname, "..", "node_modules", "live-server"));

var noBrowser = process.argv.indexOf("--no-browser") !== -1;

liveServer.start({
  port: 5500,
  root: path.join(__dirname, ".."),
  // 박사 기준 "대시보드" = 클로드 버전. 루트 index.html(폐기된 코덱스 링크 페이지)이 아니라 /claude/를 연다.
  open: noBrowser ? false : "/claude/",
  noCssInject: true,
  // _live-feed: 작업 피드(feed.jsonl)는 초단위로 갱신되므로 watch에서 제외 —
  // 포함하면 피드 기록 한 줄마다 모든 탭이 리로드된다. 뷰어는 자체 1초 폴링이라 무관.
  ignore: [/[\\\/](node_modules|ai-video-studio|inst-app|internal|tools|_live-feed|\.git)([\\\/]|$)/]
});

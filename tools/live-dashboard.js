// 박사 라이브 관전용 대시보드 서버.
// live-server CLI의 --ignore는 Windows 절대경로(백슬래시)에 글롭 매칭이 안 되어
// node_modules 수만 파일까지 감시하는 문제가 있음 → 라이브러리 모드 + 정규식 ignore로 우회.
var path = require("path");
var liveServer = require(path.join(__dirname, "..", "node_modules", "live-server"));

var noBrowser = process.argv.indexOf("--no-browser") !== -1;

liveServer.start({
  port: 5500,
  root: path.join(__dirname, ".."),
  open: !noBrowser,
  noCssInject: true,
  ignore: [/[\\\/](node_modules|ai-video-studio|inst-app|internal|tools|\.git)([\\\/]|$)/]
});

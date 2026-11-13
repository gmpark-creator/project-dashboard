/* node install.cjs <existing-unpacked-logger-folder> */
const fs = require('node:fs');
const path = require('node:path');
const folder = process.argv[2];
if(!folder) throw new Error('기존 기록기 확장 폴더 경로를 지정하세요.');
const target = path.resolve(folder), manifestPath=path.join(target,'manifest.json');
const original=fs.readFileSync(manifestPath,'utf8'), manifest=JSON.parse(original.replace(/^\uFEFF/,''));
if(manifest.manifest_version!==3 || !manifest.permissions?.includes('storage')) throw new Error('storage 권한이 있는 Manifest V3 기록기 확장이어야 합니다.');
if(!/질문|question|logger/i.test(manifest.name || '')) throw new Error('AI 질문 기록기 확장 폴더인지 확인하세요.');
const backup=manifestPath+'.before-dashboard-bridge';
if(!fs.existsSync(backup)) fs.writeFileSync(backup,original);
fs.copyFileSync(path.join(__dirname,'dashboard-bridge.js'),path.join(target,'dashboard-bridge.js'));
manifest.content_scripts=manifest.content_scripts || [];
if(!manifest.content_scripts.some(c=>c.js?.includes('dashboard-bridge.js'))) manifest.content_scripts.push({matches:['https://gmpark-creator.github.io/project-dashboard/claude/'],js:['dashboard-bridge.js'],run_at:'document_idle'});
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('연결 코드 추가 완료. chrome://extensions 또는 edge://extensions에서 기존 기록기를 새로고침한 뒤 대시보드를 다시 여세요.');

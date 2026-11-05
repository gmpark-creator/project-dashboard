// AGENT-GORGO-33 프로그램 안 업데이트: 새 버전이 올라오면 화면 위에 「새 버전이 나왔어요」 단추가 뜨고,
// 누르면 바뀐 내용을 보여 준 뒤 「지금 업데이트」 → 새 버전을 받고 프로그램이 잠깐 닫혔다가 다시 켜진다.
// 켤 때 한 번(5초 뒤), 이후 30분마다 확인한다. 설치형 서버가 없는 미리보기에서는 아무것도 표시하지 않는다.
const css=`.upd-pill{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:60;border:0;border-radius:22px;padding:9px 18px;background:#e8784e;color:#fff;font:800 13px 'Noto Sans KR','Malgun Gothic',sans-serif;box-shadow:0 8px 24px #b4553033;cursor:pointer;animation:updIn .4s ease}
.upd-pill[hidden]{display:none}@keyframes updIn{from{opacity:0;transform:translate(-50%,-8px)}}
.upd-dlg{border:0;border-radius:16px;padding:0;width:min(460px,calc(100vw - 32px));background:#fffdf6;color:#2f4c45;font-family:'Noto Sans KR','Malgun Gothic',sans-serif;box-shadow:0 20px 60px #23443840}
.upd-dlg::backdrop{background:#23443855}.upd-in{padding:20px 22px}.upd-in h3{margin:0 0 6px;font-size:17px}.upd-in p{margin:6px 0;font-size:13px;line-height:1.6}
.upd-list{margin:10px 0;padding:0;list-style:none;max-height:38vh;overflow:auto;border:1px solid #e3dccb;border-radius:10px}.upd-list li{padding:8px 10px;border-bottom:1px solid #f0eadc;font-size:12.5px;line-height:1.5}.upd-list li:last-child{border-bottom:0}.upd-list small{color:#7a877f;margin-right:6px}
.upd-ver{font-size:11.5px;color:#7a877f}.upd-act{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.upd-act button{border-radius:18px;padding:8px 16px;font:700 13px inherit;cursor:pointer;border:1px solid #d8d0bd;background:#fff;color:#2f4c45}.upd-act .go{background:#2f4c45;color:#fffef4;border-color:#2f4c45}.upd-act button:disabled{opacity:.5;cursor:default}
.upd-msg{font-weight:700}.upd-msg.err{color:#b4553a}`;
let state=null,pill,dlg;
async function api(method){const r=await fetch(method==='POST'?'/api/update':'/api/update?check=1',{method:method||'GET',cache:'no-store',headers:method==='POST'?{'Content-Type':'application/json'}:{}});let d=null;try{d=await r.json();}catch{}if(!r.ok)throw Error(d?.error||'업데이트를 확인하지 못했습니다.');return d;}
const el=(t,p={},k=[])=>{const e=document.createElement(t);Object.assign(e,p);e.append(...k);return e;};
function build(){const st=el('style',{textContent:css});document.head.append(st);
 pill=el('button',{type:'button',className:'upd-pill',id:'update-pill',hidden:true,onclick:openDialog});document.body.append(pill);
 dlg=el('dialog',{className:'upd-dlg',id:'update-dialog'});dlg.innerHTML='<div class="upd-in"><h3>새 버전이 나왔어요</h3><p class="upd-ver" id="upd-ver"></p><ul class="upd-list" id="upd-list"></ul><p>업데이트하면 프로그램이 잠깐 닫혔다가 <b>자동으로 다시 켜집니다</b>. 넣은 자료·대화·로그인은 그대로입니다.</p><p class="upd-msg" id="upd-msg"></p><div class="upd-act"><button type="button" id="upd-later">나중에</button><button type="button" class="go" id="upd-go">지금 업데이트</button></div></div>';
 document.body.append(dlg);dlg.addEventListener('keydown',e=>e.stopPropagation());
 dlg.querySelector('#upd-later').onclick=()=>dlg.close();dlg.querySelector('#upd-go').onclick=apply;}
function paint(){if(!pill)return;pill.hidden=!state?.available;if(state?.available)pill.textContent='새 버전이 나왔어요'+(state.behind?' ('+state.behind+'건)':'')+' · 업데이트';}
function openDialog(){if(!state)return;const list=dlg.querySelector('#upd-list');list.replaceChildren(...(state.changes||[]).map(c=>el('li',{},[el('small',{textContent:String(c.date).slice(5,10).replace('-','/')}),c.subject])));
 dlg.querySelector('#upd-ver').textContent='지금 '+(state.current?.sha||'?')+' → 새 버전 '+(state.latest?.sha||'?');const m=dlg.querySelector('#upd-msg');m.textContent='';m.className='upd-msg';dlg.querySelector('#upd-go').disabled=false;dlg.querySelector('#upd-later').disabled=false;dlg.showModal();}
async function apply(){const m=dlg.querySelector('#upd-msg'),go=dlg.querySelector('#upd-go'),later=dlg.querySelector('#upd-later');go.disabled=true;later.disabled=true;m.className='upd-msg';m.textContent='새 버전을 받는 중…';
 try{const r=await api('POST');if(!r.updated){m.textContent='이미 최신 버전입니다.';state=null;paint();later.disabled=false;return;}
  if(r.restart){m.textContent='새 버전('+r.to+')을 받았습니다. 프로그램을 다시 켭니다…';setTimeout(()=>{try{window.close();}catch{}},900);setTimeout(()=>{m.textContent='창이 닫히지 않으면 프로그램을 닫았다가 다시 켜주세요. 새 버전은 이미 받아 두었습니다.';},6000);return;}
  // 설치형 프로그램이 아닌 방식(시험·옛 실행기): 화면만 바뀌었으면 새로고침, 서버가 바뀌었으면 다시 켜기 안내
  if(r.serverChanged){m.textContent='새 버전('+r.to+')을 받았습니다. 프로그램을 닫았다가 다시 켜면 적용됩니다.';later.disabled=false;later.textContent='닫기';}else{m.textContent='새 버전('+r.to+')을 받았습니다. 화면을 새로 불러옵니다…';setTimeout(()=>location.reload(),900);}}
 catch(e){m.className='upd-msg err';m.textContent=e.message;go.disabled=false;later.disabled=false;}}
async function check(){try{state=await api();}catch{state=null;}paint();}
function start(){if(location.protocol!=='http:'||!/^(127\.0\.0\.1|localhost)$/.test(location.hostname))return;build();setTimeout(check,5000);setInterval(check,30*60*1000);
 window.__gorgoUpdate={check:async()=>{await check();return state;},state:()=>state,open:openDialog};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();

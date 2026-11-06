// AGENT-GORGO-33/39 프로그램 안 업데이트.
// - G39(박사 11-06): 화면 왼쪽에 늘 보이는 「⟳ 업데이트」 단추 → 창에서 지금 버전 확인 · 「업데이트 확인」(바로 확인) · 「최신으로 업데이트」.
//   새 버전이 없으면 「최신 버전입니다」, 있으면 바뀐 내용 목록 + 업데이트(받은 뒤 프로그램이 잠깐 닫혔다가 다시 켜진다).
// - 새 버전이 올라오면 화면 위 「새 버전이 나왔어요」 알림도 그대로 뜬다(켤 때 5초 뒤, 이후 30분마다 확인).
// - 설치형 서버가 없는 미리보기에서는 아무것도 표시하지 않는다.
const css=`.upd-pill{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:60;border:0;border-radius:22px;padding:9px 18px;background:#e8784e;color:#fff;font:800 13px 'Noto Sans KR','Malgun Gothic',sans-serif;box-shadow:0 8px 24px #b4553033;cursor:pointer;animation:updIn .4s ease}
.upd-pill[hidden]{display:none}@keyframes updIn{from{opacity:0;transform:translate(-50%,-8px)}}
.upd-open{position:absolute;left:22px;top:184px;z-index:6;border-radius:24px;background:#fffdf2;color:#36594d;padding:11px 18px;font:700 12px 'Noto Sans KR','Malgun Gothic',sans-serif;border:1px solid #e3dccb;cursor:pointer}.upd-open[hidden]{display:none}.upd-open b{margin-left:5px;padding:0 7px;border-radius:9px;background:#e77f58;color:#fff;font-size:10.5px}.upd-open b:empty{display:none}
@media(max-width:700px){.upd-open{left:14px;top:148px;padding:8px 12px;font-size:11px}}
body.in-interior .upd-open,body.map-leaving .upd-open{visibility:hidden}
.upd-dlg{border:0;border-radius:16px;padding:0;width:min(480px,calc(100vw - 32px));background:#fffdf6;color:#2f4c45;font-family:'Noto Sans KR','Malgun Gothic',sans-serif;box-shadow:0 20px 60px #23443840}
.upd-dlg::backdrop{background:#23443855}.upd-in{padding:20px 22px}.upd-in h3{margin:0 0 10px;font-size:17px}.upd-in p{margin:6px 0;font-size:13px;line-height:1.6}
.upd-cur{border:1px solid #e3dccb;border-radius:10px;padding:10px 12px;background:#fff;font-size:12.5px;line-height:1.6}.upd-cur b{font-size:13px}.upd-cur small{display:block;color:#7a877f}
.upd-state{margin:12px 0 4px;font-size:13.5px;font-weight:800}.upd-state.ok{color:#2f7a45}.upd-state.new{color:#b4553a}.upd-state.warn{color:#8a6a3a}
.upd-list{margin:8px 0;padding:0;list-style:none;max-height:34vh;overflow:auto;border:1px solid #e3dccb;border-radius:10px}.upd-list[hidden]{display:none}.upd-list li{padding:8px 10px;border-bottom:1px solid #f0eadc;font-size:12.5px;line-height:1.5}.upd-list li:last-child{border-bottom:0}.upd-list small{color:#7a877f;margin-right:6px}
.upd-note{font-size:12px;color:#6b7a72}.upd-act{display:flex;justify-content:flex-end;gap:8px;margin-top:14px;flex-wrap:wrap}.upd-act button{border-radius:18px;padding:8px 16px;font:700 13px 'Noto Sans KR','Malgun Gothic',sans-serif;cursor:pointer;border:1px solid #d8d0bd;background:#fff;color:#2f4c45}.upd-act .go{background:#2f4c45;color:#fffef4;border-color:#2f4c45}.upd-act button:disabled{opacity:.45;cursor:default}
.upd-msg{font-weight:700;font-size:13px}.upd-msg.err{color:#b4553a}`;
let state=null,pill,btn,dlg,busy=false;
async function api(method){const r=await fetch(method==='POST'?'/api/update':'/api/update?check=1',{method:method||'GET',cache:'no-store',headers:method==='POST'?{'Content-Type':'application/json'}:{}});let d=null;try{d=await r.json();}catch{}if(!r.ok)throw Object.assign(Error(d?.error||'업데이트를 확인하지 못했습니다.'),{status:r.status});return d;}
const el=(t,p={},k=[])=>{const e=document.createElement(t);Object.assign(e,p);e.append(...k);return e;};
const when=t=>{if(!t)return '';const d=new Date(t);return isNaN(d)?String(t):d.toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'});};
const $d=s=>dlg.querySelector(s);
function build(){const st=el('style',{textContent:css});document.head.append(st);
 pill=el('button',{type:'button',className:'upd-pill',id:'update-pill',hidden:true,onclick:()=>openDialog()});document.body.append(pill);
 btn=el('button',{type:'button',className:'upd-open',id:'update-open',innerHTML:'⟳ 업데이트<b id="update-count"></b>',title:'프로그램 버전 확인 · 최신으로 업데이트',onclick:()=>openDialog(true)});document.body.append(btn);
 dlg=el('dialog',{className:'upd-dlg',id:'update-dialog'});dlg.innerHTML=`<div class="upd-in"><h3 id="upd-title">프로그램 업데이트</h3>
  <div class="upd-cur" id="upd-cur"></div><p class="upd-state" id="upd-state"></p><ul class="upd-list" id="upd-list" hidden></ul>
  <p class="upd-note" id="upd-note">업데이트하면 프로그램이 잠깐 닫혔다가 <b>자동으로 다시 켜집니다</b>. 넣은 자료·대화·로그인·모델 선택은 그대로입니다.</p><p class="upd-msg" id="upd-msg"></p>
  <div class="upd-act"><button type="button" id="upd-later">닫기</button><button type="button" id="upd-check">업데이트 확인</button><button type="button" class="go" id="upd-go">최신으로 업데이트</button></div></div>`;
 document.body.append(dlg);dlg.addEventListener('keydown',e=>e.stopPropagation());
 $d('#upd-later').onclick=()=>dlg.close();$d('#upd-go').onclick=apply;$d('#upd-check').onclick=()=>check(true);}
function paint(){if(!pill)return;pill.hidden=!state?.available;if(state?.available)pill.textContent='새 버전이 나왔어요'+(state.behind?' ('+state.behind+'건)':'')+' · 업데이트';
 btn.hidden=!!state?.unavailable;if(state?.unavailable&&dlg?.open)dlg.close();btn.querySelector('#update-count').textContent=state?.available?(state.behind?String(state.behind):'N'):'';
 if(dlg?.open&&!busy)paintDialog();}
function paintDialog(){const s=state,cur=$d('#upd-cur'),st=$d('#upd-state'),list=$d('#upd-list'),go=$d('#upd-go');
 cur.replaceChildren(el('small',{textContent:'지금 쓰는 버전'}),el('b',{textContent:s?.current?.sha?s.current.sha+' · '+when(s.current.date):'확인 중…'}),...(s?.current?.subject?[el('small',{textContent:s.current.subject})]:[]));
 list.hidden=true;go.disabled=true;$d('#upd-title').textContent=s?.available?'새 버전이 나왔어요':'프로그램 업데이트';
 if(!s){st.className='upd-state';st.textContent='버전을 확인하는 중…';return;}
 if(s.supported===false){st.className='upd-state warn';st.textContent=s.reason||'이 실행 방식에서는 프로그램 안 업데이트를 쓸 수 없습니다.';return;}
 if(s.available){st.className='upd-state new';st.textContent='새 버전 '+(s.latest?.sha||'')+' — 바뀐 내용 '+(s.behind||(s.changes||[]).length)+'건';
  list.replaceChildren(...(s.changes||[]).map(c=>el('li',{},[el('small',{textContent:String(c.date).slice(5,10).replace('-','/')}),c.subject])));list.hidden=!(s.changes||[]).length;go.disabled=false;return;}
 if(s.offline||s.reason){st.className='upd-state warn';st.textContent=s.reason||'새 버전을 확인하지 못했습니다.';return;}
 st.className='upd-state ok';st.textContent='✔ 최신 버전입니다'+(s.checkedAt?' ('+when(s.checkedAt)+' 확인)':'');}
function openDialog(manual){if(!dlg)return;const m=$d('#upd-msg');m.textContent='';m.className='upd-msg';busy=false;for(const b of dlg.querySelectorAll('button'))b.disabled=false;paintDialog();if(!dlg.open)dlg.showModal();if(manual)check(true);}
async function apply(){const m=$d('#upd-msg'),go=$d('#upd-go'),later=$d('#upd-later'),chk=$d('#upd-check');busy=true;go.disabled=true;later.disabled=true;chk.disabled=true;m.className='upd-msg';m.textContent='새 버전을 받는 중…';
 try{const r=await api('POST');if(!r.updated){busy=false;m.textContent='이미 최신 버전입니다.';later.disabled=false;chk.disabled=false;await check(true);return;}
  if(r.restart){m.textContent='새 버전('+r.to+')을 받았습니다. 프로그램을 다시 켭니다…';setTimeout(()=>{try{window.close();}catch{}},900);setTimeout(()=>{m.textContent='창이 닫히지 않으면 프로그램을 닫았다가 다시 켜주세요. 새 버전은 이미 받아 두었습니다.';later.disabled=false;},6000);return;}
  // 설치형 프로그램이 아닌 방식(시험·옛 실행기): 화면만 바뀌었으면 새로고침, 서버가 바뀌었으면 다시 켜기 안내
  if(r.serverChanged){m.textContent='새 버전('+r.to+')을 받았습니다. 프로그램을 닫았다가 다시 켜면 적용됩니다.';later.disabled=false;}else{m.textContent='새 버전('+r.to+')을 받았습니다. 화면을 새로 불러옵니다…';setTimeout(()=>location.reload(),900);}}
 catch(e){busy=false;m.className='upd-msg err';m.textContent=e.message;go.disabled=!state?.available;later.disabled=false;chk.disabled=false;}}
async function check(manual){const chk=dlg?.querySelector('#upd-check');if(manual&&chk){chk.disabled=true;chk.textContent='확인 중…';}
 try{state=await api();}catch(e){state=e.status===404?{unavailable:true}:{supported:true,offline:true,reason:e.message,current:state?.current};} // 404 = 업데이트 기능이 없는 서버(미리보기·시험)
 if(chk){chk.disabled=false;chk.textContent='업데이트 확인';}paint();return state;}
function start(){if(location.protocol!=='http:'||!/^(127\.0\.0\.1|localhost)$/.test(location.hostname))return;build();setTimeout(()=>check(false),5000);setInterval(()=>check(false),30*60*1000);
 window.__gorgoUpdate={check:async()=>check(false),state:()=>state,open:()=>openDialog(true)};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();

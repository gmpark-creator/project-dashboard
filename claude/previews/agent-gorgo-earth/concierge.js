// AGENT-GORGO-26~28,31,32 안내원 대화창: 건물 안 안내원에게 말을 걸면 열리는 AI 대화 작업 패널(웹 AI에 일 맡기듯).
// - 로비 안내원 2명: 1번 「도윤 · GPT」(ChatGPT 로그인) · 2번 「하랑 · Claude」(Claude 구독, 없으면 API 키).
//   이 PC에서 로그인돼 있는 AI의 안내원만 로비에 보인다(/api/npcs). 로그인은 PC별로 한 번 하면 계속 유지된다.
// - 대화 1개 = 업무 카드 1개(kind:'chat', records/_cases)에 메시지·첨부·학습 이벤트로 저장 → 3대 PC 동기화.
//   같은 대화를 두 안내원이 이어받을 수 있다(누가 답했는지 메시지마다 남는다).
// - 파일: 대화창에 끌어놓기/＋ → 그 장소 자료로 저장 + 첨부, 또는 「자료함에서」 이미 넣어 둔 자료를 골라 첨부.
//   엑셀·워드·한글·PDF·그림을 읽는다(서버가 글/그림으로 바꿔 AI에 넘김, 원본은 그대로).
// - 작업 방식 학습: 「기억하기」 → 안내원이 기억할 점 제안 → 박사가 고쳐서 저장한 것만 장소별 작업 노트(records/_playbooks)에 쌓인다.
const $=id=>document.getElementById(id);
export const PERSONAS={chatgpt:{slot:1,name:'도윤',ai:'GPT',color:'#2f8f6f'},claudecode:{slot:2,name:'하랑',ai:'Claude',color:'#d9774f'},claude:{slot:2,name:'하랑',ai:'Claude API',color:'#d9774f'},gemini:{slot:3,name:'별',ai:'Gemini',color:'#4a78c9'}};
const READABLE=/\.(pdf|png|jpe?g|webp|gif|txt|csv|tsv|md|json|xml|log|docx?|xlsx?|xlsm|pptx|hwpx?)$/i;
let ui=null,ctx=null,state={provider:null,caseId:null,cases:[],busy:false,zoneDocType:'기타',current:null};
async function api(route,body,method){const r=await fetch(route,{cache:'no-store',...(body===undefined&&!method?{}:{method:method||'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})})});let d=null;try{d=await r.json();}catch{}if(!r.ok)throw Object.assign(Error(d?.error||'요청을 완료하지 못했습니다.'),{status:r.status});return d;}
function el(tag,props={},kids=[]){const e=document.createElement(tag);Object.assign(e,props);for(const k of kids)e.append(k);return e;}
const josa=(w,a,b)=>{const c=w.charCodeAt(w.length-1);return c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28?a:b;};
const persona=p=>PERSONAS[p]||PERSONAS.claudecode;
// 장소별 안내원(data/npcs.json): 장소마다 1번(GPT)·2번(Claude)이 서로 다른 인물. 파일을 못 받으면 기본 이름(도윤·하랑)을 쓴다.
let NPC_DATA=null;const getJson=f=>fetch(f,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
const npcLoad=Promise.all([getJson('data/npcs.json'),getJson('data/npcs-places.json')]).then(([a,b])=>{if(a){NPC_DATA=a;if(b?.zones)Object.assign(NPC_DATA.zones,b.zones);}});
export const hasPersonas=zone=>!!NPC_DATA?.zones?.[zone];
const slotKey=p=>p==='chatgpt'?'gpt':'claude';
export function personaFor(zone,provider){const base=persona(provider),z=NPC_DATA?.zones?.[zone]?.[slotKey(provider)];return z?{...base,name:z.name,title:z.title,focus:z.focus,greeting:z.greeting,quick:z.quick||[],look:z.look||null}:{...base,title:'',focus:'',greeting:'',quick:[],look:null};}

// ── 살아 있는(로그인된) 안내원 목록 ───────────────────────
let alive=null; // null = 아직 확인 전
let aliveRaw=null; // 로그인된 AI(장소와 무관)
export async function npcInfo(zone){await npcLoad;try{const r=await api('/api/npcs');aliveRaw=(r.npcs||[]).filter(n=>n.alive).map(n=>({provider:n.provider,account:n.account||''}));}catch{aliveRaw=aliveRaw||[];}alive=aliveRaw.map(n=>({...persona(n.provider),...personaFor(zone||ctx?.zone,n.provider),provider:n.provider,account:n.account}));return alive;}
// 건물에 들어갈 때 쓰는 즉시 값(없으면 빈 목록 → 확인되는 대로 나타난다)
export function npcCached(zone){return (aliveRaw||[]).map(n=>({...persona(n.provider),...personaFor(zone,n.provider),provider:n.provider,account:n.account}));}
export function npcChecked(){return aliveRaw!==null;}
// 이전 버전 호환(지도 준비 시 미리 불러 두기)
export const conciergeInfo=()=>npcInfo();

function build(){
 ui=el('aside',{id:'concierge',className:'concierge'});ui.innerHTML=`
 <header class="cg-head"><span class="cg-avatar" id="cg-avatar"></span><div class="cg-who"><b id="cg-name"></b><small id="cg-state"></small></div>
  <button type="button" class="cg-close" id="cg-close" aria-label="대화창 닫기">×</button></header>
 <div class="cg-npcs" id="cg-npcs"></div>
 <div class="cg-bar"><select id="cg-cases" aria-label="대화 목록"></select><button type="button" id="cg-new">새 대화</button><button type="button" id="cg-notes">작업 노트</button></div>
 <div class="cg-login" id="cg-login" hidden><span id="cg-login-text"></span><button type="button" id="cg-login-open">AI 연결 열기</button></div>
 <div class="cg-msgs" id="cg-msgs" aria-live="polite"></div>
 <div class="cg-today" id="cg-today" hidden><span id="cg-today-text"></span><button type="button" id="cg-today-btn">대화에 첨부</button></div>
 <div class="cg-chips" id="cg-chips"></div>
 <div class="cg-attach" id="cg-attach"></div>
 <form class="cg-input" id="cg-form"><button type="button" class="cg-file" id="cg-file-btn" title="내 PC에서 파일 첨부">＋</button><input type="file" id="cg-file" multiple hidden>
  <textarea id="cg-text" rows="2" maxlength="8000" placeholder="안내원에게 일을 맡겨보세요 (Enter 보내기 · Shift+Enter 줄바꿈)"></textarea><button type="submit" id="cg-send">보내기</button></form>
 <div class="cg-foot"><button type="button" id="cg-pick-open">자료함에서 첨부</button><button type="button" id="cg-learn">기억하기</button><button type="button" id="cg-mem">업무 기억</button><small>파일은 이 창에 끌어다 놓아도 됩니다</small></div>
 <div class="cg-drop" id="cg-drop">여기에 놓으면 이 장소 자료로 저장하고 대화에 첨부합니다</div>
 <div class="cg-modal" id="cg-modal" hidden><div class="cg-modal-box"><h3 id="cg-modal-title"></h3><textarea id="cg-modal-text" rows="12" maxlength="12000"></textarea><div class="cg-modal-actions"><button type="button" id="cg-modal-cancel">취소</button><button type="button" id="cg-modal-save" class="primary">저장</button></div></div></div>
 <div class="cg-modal" id="cg-memm" hidden><div class="cg-modal-box"><h3>업무 기억 — 안내원들이 일하면서 정리해 둔 것</h3><p class="cg-memsub">선박·서류·업무 방식만 기억합니다(여권번호 등 개인정보는 기억하지 않아요). 틀린 것은 지울 수 있어요.</p><ul class="cg-pick" id="cg-memlist"></ul><div class="cg-modal-actions"><button type="button" id="cg-mem-close" class="primary">닫기</button></div></div></div>
 <div class="cg-modal" id="cg-pickm" hidden><div class="cg-modal-box"><h3>자료함에서 대화에 첨부</h3><ul class="cg-pick" id="cg-pick"></ul><div class="cg-modal-actions"><button type="button" id="cg-pick-cancel">취소</button><button type="button" id="cg-pick-save" class="primary">첨부</button></div></div></div>`;
 document.body.append(ui);
 $('cg-close').onclick=()=>closeConcierge();$('cg-new').onclick=()=>{state.caseId=null;state.current=null;$('cg-cases').value='';render(null);};
 $('cg-cases').onchange=e=>{state.caseId=e.target.value||null;loadCase();};
 $('cg-login-open').onclick=()=>{$('ai-open')?.click();};
 $('cg-form').onsubmit=e=>{e.preventDefault();send();};
 $('cg-text').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send();}});
 ui.addEventListener('keydown',e=>e.stopPropagation());
 $('cg-file-btn').onclick=()=>$('cg-file').click();$('cg-file').onchange=e=>{upload([...e.target.files]);e.target.value='';};
 let depth=0;ui.addEventListener('dragenter',e=>{if(e.dataTransfer?.types?.includes('Files')){depth++;ui.classList.add('dragging');e.preventDefault();}});
 ui.addEventListener('dragover',e=>{if(e.dataTransfer?.types?.includes('Files'))e.preventDefault();});
 ui.addEventListener('dragleave',()=>{depth=Math.max(0,depth-1);if(!depth)ui.classList.remove('dragging');});
 ui.addEventListener('drop',e=>{e.preventDefault();e.stopPropagation();depth=0;ui.classList.remove('dragging');const files=[...(e.dataTransfer?.files||[])];if(files.length)upload(files);});
 $('cg-mem').onclick=openMemory;$('cg-mem-close').onclick=()=>{$('cg-memm').hidden=true;};
 $('cg-notes').onclick=openNotes;$('cg-learn').onclick=learn;$('cg-pick-open').onclick=openPicker;
 $('cg-modal-cancel').onclick=()=>{$('cg-modal').hidden=true;};$('cg-pick-cancel').onclick=()=>{$('cg-pickm').hidden=true;};
 $('cg-today-btn').onclick=attachToday;
}
function note(text){const m=$('cg-msgs');m.append(el('p',{className:'cg-note',textContent:text}));m.scrollTop=m.scrollHeight;}
function ready(){return (alive||[]).some(n=>n.provider===state.provider);}
function showPersona(){const p=personaFor(ctx?.zone,state.provider),me=(alive||[]).find(n=>n.provider===state.provider);
 $('cg-avatar').style.background=p.color;$('cg-avatar').textContent=p.name.slice(0,1);$('cg-name').textContent=p.slot+'번 '+p.name+(p.title?' · '+p.title:'');
 $('cg-state').textContent=p.ai+' · '+(me?('로그인 유지됨'+(me.account?' · '+me.account:'')):'이 PC에서 로그인 필요');$('cg-state').dataset.ready=String(!!me);
 $('cg-login').hidden=!!me;$('cg-login-text').textContent=p.ai+' 로그인이 필요합니다. 한 번 로그인하면 이 PC에서 계속 유지됩니다.';
 // 다른 살아 있는 안내원으로 바꾸기(같은 대화를 이어서 맡긴다)
 const box=$('cg-npcs');box.replaceChildren();const list=alive||[];if(list.length>1)for(const n of list)box.append(el('button',{type:'button',className:n.provider===state.provider?'on':'',textContent:n.slot+'번 '+n.name+' ('+n.ai+')',onclick:()=>{state.provider=n.provider;showPersona();ctx?.onPersona?.(n.provider);}}));
 box.hidden=list.length<2;}
function render(c){state.current=c;const m=$('cg-msgs');m.replaceChildren();const p=personaFor(ctx.zone,state.provider);
 if(!c||!c.messages?.length){m.append(el('div',{className:'cg-msg agent'},[el('b',{textContent:p.name}),el('p',{textContent:(p.greeting||('안녕하세요, '+ctx.name+' '+p.slot+'번 '+p.name+'('+p.ai+')입니다.'))+'\n서류를 이 창에 끌어다 놓거나 「자료함에서 첨부」로 고른 뒤, 할 일을 말씀해 주세요.'})]));}
 for(const msg of c?.messages||[]){const who=msg.role==='user'?'박사':(personaFor(ctx.zone,msg.provider).name||'안내원');m.append(el('div',{className:'cg-msg '+(msg.role==='user'?'user':'agent')},[el('b',{textContent:who}),el('p',{textContent:msg.text}),...(msg.role==='agent'?[el('div',{className:'cg-msg-actions'},[el('button',{type:'button',textContent:'복사',onclick:()=>navigator.clipboard?.writeText(msg.text)})])]:[])]));}
 const at=$('cg-attach');at.replaceChildren();for(const s of c?.attachments||[])at.append(el('span',{className:'cg-chip-file',textContent:'📎 '+s.name}));
 m.scrollTop=m.scrollHeight;renderChips(c);renderToday();}
async function renderChips(c){const box=$('cg-chips');box.replaceChildren();let chips=[],smart=[];try{const pb=await api('/api/playbooks/'+encodeURIComponent(ctx.zone));chips=pb.quick||[];}catch{}
 try{smart=(await api('/api/memory/suggest?zone='+encodeURIComponent(ctx.zone))).chips||[];}catch{}
 for(const t of smart.slice(0,2))box.append(el('button',{type:'button',className:'cg-chip smart',title:'기억해 둔 선박 기준 제안',textContent:'💡 '+t,onclick:()=>{$('cg-text').value=t;$('cg-text').focus();}}));
 if(!chips.length)chips=[...personaFor(ctx.zone,state.provider).quick,'첨부 자료 정리해줘','이 업무 다음 할 일 알려줘'];for(const t of chips.slice(0,smart.length?2:4))box.append(el('button',{type:'button',className:'cg-chip',textContent:t,onclick:()=>{$('cg-text').value=t;$('cg-text').focus();}}));}
// 오늘 이 장소에 넣은 자료 중 아직 대화에 안 붙은 것 → 한 번에 첨부 제안
async function zoneRecords(){try{return await api('/api/records?zone='+encodeURIComponent(ctx.zone));}catch{return [];}}
const today=()=>{const d=new Date(Date.now()+9*3600e3);return d.toISOString().slice(0,10);};
async function renderToday(){const box=$('cg-today');box.hidden=true;const attached=new Set(state.current?.sourceIds||[]);const list=(await zoneRecords()).filter(r=>String(r.addedAt).slice(0,10)===today()&&!attached.has(r.id)&&READABLE.test(r.originalName));
 state.today=list.slice(0,10);if(!state.today.length)return;$('cg-today-text').textContent='오늘 이 장소에 넣은 자료 '+state.today.length+'건'+(list[0]?.memo?' ('+list[0].memo+')':'')+' — 안내원이 읽을 수 있게 첨부할까요?';box.hidden=false;}
async function attachIds(ids){if(!ids.length)return;try{const id=await ensureCase();let c=null;for(const rid of ids)c=await api('/api/cases/'+encodeURIComponent(id)+'/attach',{recordId:rid});if(c)render(c);note(ids.length+'건을 대화에 첨부했습니다. 이제 할 일을 말씀해 주세요.');}catch(e){note(e.message);}}
async function attachToday(){const ids=(state.today||[]).map(r=>r.id);$('cg-today').hidden=true;await attachIds(ids);}
async function openPicker(){const list=await zoneRecords();const attached=new Set(state.current?.sourceIds||[]);const ul=$('cg-pick');ul.replaceChildren();
 if(!list.length)ul.append(el('li',{textContent:'이 장소 자료함이 비어 있습니다. 파일을 대화창에 끌어다 놓아 주세요.'}));
 for(const r of list.slice(0,60)){const ok=READABLE.test(r.originalName),done=attached.has(r.id);const cb=el('input',{type:'checkbox',value:r.id,disabled:!ok||done});
  ul.append(el('li',{className:done?'done':''},[cb,el('span',{textContent:r.originalName+(done?' · 첨부됨':ok?'':' · 읽을 수 없는 형식')}),el('small',{textContent:String(r.addedAt).slice(5,16).replace('T',' ')})]));}
 $('cg-pick-save').onclick=async()=>{const ids=[...ul.querySelectorAll('input:checked')].map(i=>i.value);$('cg-pickm').hidden=true;await attachIds(ids);};$('cg-pickm').hidden=false;}
async function loadCases(){try{const all=await api('/api/cases?zone='+encodeURIComponent(ctx.zone));state.cases=all.filter(c=>c.kind==='chat');}catch{state.cases=[];}
 const sel=$('cg-cases');sel.replaceChildren(new Option('새 대화',''));for(const c of state.cases)sel.append(new Option(c.title+' · '+String(c.updatedAt).slice(5,16).replace('T',' '),c.id));
 if(!state.caseId&&state.cases[0])state.caseId=state.cases[0].id;sel.value=state.caseId||'';}
async function loadCase(){if(!state.caseId){render(null);return;}try{render(await api('/api/cases/'+encodeURIComponent(state.caseId)));}catch(e){note(e.message);}}
async function ensureCase(){if(state.caseId)return state.caseId;const t=new Date();const c=await api('/api/cases',{zone:ctx.zone,kind:'chat',title:'대화 '+(t.getMonth()+1)+'/'+t.getDate()+' '+String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0')});state.caseId=c.id;await loadCases();return c.id;}
async function send(){const text=$('cg-text').value.trim();if(!text||state.busy)return;const p=persona(state.provider);
 // 이 PC에서 안내원 AI가 로그인 전이면 빈 대화를 만들지 않고 안내만 한다
 if(!ready()){note('먼저 「AI 연결 열기」에서 '+p.ai+' 로그인을 해주세요. 한 번 로그인하면 계속 유지됩니다.');return;}state.busy=true;$('cg-send').disabled=true;
 try{const id=await ensureCase();$('cg-text').value='';const m=$('cg-msgs');m.append(el('div',{className:'cg-msg user'},[el('b',{textContent:'박사'}),el('p',{textContent:text})]));
  const n=state.current?.attachments?.length||0;const think=el('div',{className:'cg-msg agent thinking'},[el('b',{textContent:personaFor(ctx.zone,state.provider).name}),el('p',{textContent:n?'첨부 '+n+'건을 읽고 작업 중… (서류가 많으면 몇 분 걸릴 수 있어요)':'작업 중…'})]);m.append(think);m.scrollTop=m.scrollHeight;
  try{render(await api('/api/cases/'+encodeURIComponent(id)+'/chat',{text,provider:state.provider}));}catch(e){think.remove();await loadCase();note(e.message+(e.status===409?' (AI 연결 열기에서 로그인해주세요)':''));}}
 catch(e){note(e.message);}finally{state.busy=false;$('cg-send').disabled=false;}}
async function upload(files){for(const f of files){try{const id=await ensureCase();note('「'+f.name+'」 저장 중…');
  const meta={zone:ctx.zone,docType:state.zoneDocType,memo:'안내원 대화 첨부',originalName:f.name,size:f.size,mime:f.type||'application/octet-stream'};
  let r=await fetch('/api/records',{method:'POST',headers:{'X-Gorgo-Meta':encodeURIComponent(JSON.stringify(meta))},body:f});let d=await r.json().catch(()=>({}));
  // 이미 자료함에 같은 파일이 있으면 그 자료를 그대로 첨부한다
  if(r.status===409&&d.duplicates?.[0]){render(await api('/api/cases/'+encodeURIComponent(id)+'/attach',{recordId:d.duplicates[0].id}));note('「'+f.name+'」 이미 자료함에 있어 그 자료를 첨부했습니다.');continue;}
  if(!r.ok)throw Error(d.error||'파일을 저장하지 못했습니다.');
  render(await api('/api/cases/'+encodeURIComponent(id)+'/attach',{recordId:d.id}));note('「'+f.name+'」 자료로 저장하고 대화에 첨부했습니다.');}catch(e){note(f.name+': '+e.message);}}}
async function openMemory(){const ul=$('cg-memlist');ul.replaceChildren();let m;try{m=await api('/api/memory');}catch(e){note(e.message);return;}
 const names=k=>({skybiz:'센텀 사무실','imm-jungang':'출입국 중앙동','imm-gamcheon':'출입국 감천',customs:'부산세관',bpa:'부산항만공사','mof-busan':'해양수산청',quarantine:'검역소','intergis-7':'북항 7부두','newport-cfs':'신항 CFS','jindo-wind':'진도 풍력'}[k]||k);
 if(!m.vessels.length&&!m.rules.length)ul.append(el('li',{textContent:'아직 기억해 둔 것이 없어요. 안내원에게 서류 일을 맡기면 선박 정보와 정리한 서류가 여기에 쌓입니다.'}));
 for(const v of m.vessels){const facts=Object.entries(v.facts).map(([k,x])=>k+' '+x.value).join(' · ');const docs=Object.entries(v.docs).filter(([z,l])=>l.length).map(([z,l])=>names(z)+': '+l.join(', ')).join(' / ');
  const li=el('li',{},[el('div',{style:'flex:1;min-width:0'},[el('b',{textContent:'🚢 '+v.name}),el('div',{style:'font-size:11.5px;color:#5b6b63;margin-top:2px',textContent:facts+(docs?' | 서류 — '+docs:'')})]),el('button',{type:'button',textContent:'지우기',onclick:async()=>{try{await api('/api/memory/forget',{vessel:v.key});openMemory();renderChips(null);}catch(e){note(e.message);}}})]);ul.append(li);}
 for(const r of m.rules)ul.append(el('li',{},[el('div',{style:'flex:1',textContent:'📝 '+names(r.zone)+' — '+r.text}),el('button',{type:'button',textContent:'지우기',onclick:async()=>{try{await api('/api/memory/forget',{id:r.id});openMemory();}catch(e){note(e.message);}}})]));
 $('cg-memm').hidden=false;}
async function openNotes(){try{const pb=await api('/api/playbooks/'+encodeURIComponent(ctx.zone));modal(ctx.name+' 작업 노트',pb.text||'',async t=>{await api('/api/playbooks/'+encodeURIComponent(ctx.zone),{text:t});note('작업 노트를 저장했습니다.');renderChips(null);});}catch(e){note(e.message);}}
async function learn(){if(!state.caseId){note('먼저 대화를 나눈 뒤 기억할 수 있습니다.');return;}if(!ready()){note('안내원 로그인이 필요합니다.');return;}note('이번 대화에서 기억할 점을 정리하는 중…');
 try{const r=await api('/api/cases/'+encodeURIComponent(state.caseId)+'/learn/suggest',{provider:state.provider});modal('기억할 작업 방식 (고쳐서 저장)',r.suggestion||'',async t=>{await api('/api/cases/'+encodeURIComponent(state.caseId)+'/learn',{text:t});note('작업 노트에 기억했습니다. 다음 대화부터 반영됩니다.');renderChips(null);});}catch(e){note(e.message);}}
function modal(title,text,onSave){$('cg-modal-title').textContent=title;$('cg-modal-text').value=text;$('cg-modal').hidden=false;$('cg-modal-save').onclick=async()=>{const t=$('cg-modal-text').value;$('cg-modal').hidden=true;try{await onSave(t);}catch(e){note(e.message);}};$('cg-modal-text').focus();}

// ctx = {zone, name, provider, onPersona} — provider = 말을 건 안내원의 AI
export async function openConcierge(c){if(!ui)build();ctx=c;state.caseId=null;state.current=null;state.provider=c.provider||(alive||[])[0]?.provider||'claudecode';npcLoad.then(()=>{if(ui?.classList.contains('on'))showPersona();});ui.classList.add('on');document.body.classList.add('concierge-on');showPersona();
 try{const zones=await api('/api/zones');const z=zones.find(z=>z.id===c.zone);state.zoneDocType=z?.docTypes?.includes('기타')?'기타':(z?.docTypes?.at(-1)||'기타');}catch{note('설치형 프로그램에서 안내원과 대화할 수 있습니다.');return;}
 await npcInfo(c.zone);showPersona();await loadCases();await loadCase();setTimeout(()=>$('cg-text')?.focus(),50);}
export function closeConcierge(){if(!ui)return;ui.classList.remove('on');document.body.classList.remove('concierge-on');$('cg-modal').hidden=true;$('cg-pickm').hidden=true;$('cg-memm').hidden=true;}
export function isConciergeOpen(){return !!ui?.classList.contains('on');}

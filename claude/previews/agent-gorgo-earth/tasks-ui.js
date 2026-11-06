// AGENT-GORGO-36 업무함 — 모든 장소 안내원에게 맡긴 일을 한곳에서 차곡차곡 본다(박사 2026-11-06).
// - 맡긴 일 1건 = 대화 업무 카드 1개(records/_cases, 3대 PC 동기화). 첫 요청 문장이 제목이 되고, 진행 상태(진행 중·검토 필요·보류·완료)와
//   「⭐ 결과로 저장」한 답(결과물, 자료함 파일)이 붙는다.
// - 보기: 상태별 / 장소별 묶음, 검색(제목·내용), 선박별(업무 기억에 있는 선박 이름이 나온 일).
// - 「이어서 맡기기」: 그 장소로 가서 건물에 들어가고, 그 일을 맡았던 안내원 대화창을 그 작업으로 연다(다른 지도면 지도를 옮겨 이어서 연다).
import { personaFor, STATUS } from './concierge.js';
const $=id=>document.getElementById(id);
const el=(tag,props={},kids=[])=>{const e=document.createElement(tag);const {dataset,...rest}=props;Object.assign(e,rest);if(dataset)Object.assign(e.dataset,dataset);for(const k of kids)if(k!=null)e.append(k);return e;};
const RESUME='gorgo.resumeTask';
const when=t=>t?String(t).slice(5,16).replace('T',' ').replace('-','/'):'';
const ORDER=['progress','review','hold','done'];
let hooks=null,tasks=[],zones={},view={status:'active',group:'zone',q:'',vessel:'',sel:null},timer=null,detail=null;
async function api(route,body){const r=await fetch(route,{cache:'no-store',...(body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})});let d=null;try{d=await r.json();}catch{}if(!r.ok)throw Object.assign(Error(d?.error||'요청을 완료하지 못했습니다.'),{status:r.status});return d;}
const CSS=`.tasks-open{position:absolute;left:22px;top:130px;z-index:6;border-radius:24px;background:#fffdf2;color:#36594d;padding:11px 18px;font-size:12px;font-weight:700;border:1px solid #e3dccb;cursor:pointer;font-family:inherit}.tasks-open[hidden]{display:none}.tasks-open b{margin-left:5px;padding:0 7px;border-radius:9px;background:#e77f58;color:#fff;font-size:10.5px}.tasks-open b:empty{display:none}
@media(max-width:700px){.tasks-open{left:14px;top:104px;padding:8px 12px;font-size:11px}}
body.in-interior .tasks-open,body.map-leaving .tasks-open{visibility:hidden}
.tasks-dlg{border:0;border-radius:16px;padding:0;width:min(1000px,calc(100vw - 24px));height:min(720px,calc(100vh - 40px));max-width:none;background:#fffdf6;color:#2f4c45;box-shadow:0 20px 60px #23443840}.tasks-dlg::backdrop{background:#23443866}
.tasks-in{display:flex;flex-direction:column;height:100%;font-family:'Noto Sans KR','Malgun Gothic',sans-serif}
.tasks-head{display:flex;align-items:center;gap:10px;padding:16px 20px 10px;border-bottom:1px solid #efe8d8}.tasks-head h3{margin:0;font-size:18px;flex:1}.tasks-head small{font-size:12px;color:#7a877f;font-weight:500;margin-left:8px}
.tasks-head button{font:inherit;background:none;border:0;font-size:24px;color:#829184;cursor:pointer}
.tasks-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:10px 20px;border-bottom:1px solid #efe8d8}
.tasks-tools input{flex:1;min-width:180px;font:inherit;font-size:13px;padding:8px 11px;border:1px solid #d9d1bd;border-radius:9px;background:#fff}
.tasks-seg{display:flex;gap:4px;flex-wrap:wrap}.tasks-seg button{font:inherit;font-size:11.5px;padding:5px 11px;border-radius:13px;border:1px solid #d9d1bd;background:#fff;cursor:pointer;color:#2f4c45}.tasks-seg button.on{background:#2f4c45;color:#fffef4;border-color:#2f4c45}
.tasks-seg.vessels button{border-color:#bcd3e4}.tasks-seg.vessels button.on{background:#2f6fa3;border-color:#2f6fa3}
.tasks-body{flex:1;display:grid;grid-template-columns:minmax(260px,38%) 1fr;min-height:0}
.tasks-list{overflow:auto;padding:10px 12px 16px 20px;border-right:1px solid #efe8d8}.tasks-list h4{margin:12px 0 6px;font-size:12px;color:#7a877f;display:flex;gap:6px;align-items:center}.tasks-list h4:first-child{margin-top:2px}
.tasks-list .t-item{width:100%;text-align:left;font:inherit;display:grid;grid-template-columns:auto 1fr;gap:3px 8px;align-items:center;padding:9px 11px;margin-bottom:6px;border:1px solid #ece4d2;border-radius:11px;background:#fff;cursor:pointer;color:#2f4c45}
.tasks-list .t-item.on{border-color:#e77f58;box-shadow:0 0 0 1px #e77f58}.tasks-list .t-item b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tasks-list .t-item small{grid-column:1/3;font-size:10.5px;color:#7a877f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tasks-list .empty{font-size:13px;color:#7a877f;line-height:1.7;padding:20px 4px}
.t-st{font-size:10px;font-weight:800;padding:2px 7px;border-radius:9px;background:#e9efe7;color:#3f6b52;white-space:nowrap}.t-st.st-review{background:#fff0e3;color:#a0573c}.t-st.st-hold{background:#efebe2;color:#7b7262}.t-st.st-done{background:#dcecdf;color:#2f7a45}
.tasks-detail{overflow:auto;padding:16px 22px 20px;display:flex;flex-direction:column;gap:10px}.tasks-detail .ph{color:#7a877f;font-size:13px;margin:auto;text-align:center;line-height:1.8}
.td-title{font-size:17px;font-weight:800;margin:0}.td-meta{font-size:12px;color:#5b6b63;display:flex;gap:10px;flex-wrap:wrap}
.td-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.td-row select{font:inherit;font-size:12px;font-weight:700;padding:5px 8px;border-radius:12px;border:1px solid #d9d1bd;background:#fff;color:#2f4c45}
.td-go{font:inherit;font-size:13px;font-weight:800;padding:9px 16px;border-radius:18px;border:0;background:#e77f58;color:#fff;cursor:pointer}
.td-res{border:1px solid #edcf9a;background:#fffaf0;border-radius:11px;padding:10px 12px;display:flex;flex-direction:column;gap:6px}.td-res b{font-size:12px;color:#a0573c}
.td-res .r{display:flex;gap:8px;align-items:center;font-size:12.5px}.td-res .r span{flex:1;min-width:0}.td-res .r button{font:inherit;font-size:11px;padding:4px 9px;border-radius:11px;border:1px solid #edcf9a;background:#fff;cursor:pointer;color:#7a5520}
.td-chat{display:flex;flex-direction:column;gap:8px}.td-chat .m{max-width:92%;padding:8px 11px;border-radius:11px;font-size:12.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word}.td-chat .m b{display:block;font-size:10.5px;opacity:.75}
.td-chat .m.agent{align-self:flex-start;background:#eef3ec}.td-chat .m.user{align-self:flex-end;background:#2f4c45;color:#fffef4}.td-chat .m.pinned{box-shadow:0 0 0 2px #edcf9a;background:#fff8e8}
@media(max-width:760px){.tasks-body{grid-template-columns:1fr}.tasks-detail{display:none}.tasks-body.detail .tasks-list{display:none}.tasks-body.detail .tasks-detail{display:flex}.td-back{display:inline-block!important}}
.td-back{display:none;font:inherit;font-size:12px;background:none;border:0;color:#2f6fa3;cursor:pointer;padding:0;text-align:left}`;
const zoneName=z=>zones[z]||z;
const who=t=>t.provider?personaFor(t.zone,t.provider).name:'';
function build(){if($('tasks-dialog'))return;const st=document.createElement('style');st.textContent=CSS;document.head.append(st);
 const btn=el('button',{type:'button',id:'tasks-open',className:'tasks-open',hidden:true,innerHTML:'📂 업무함<b id="tasks-count"></b>'});btn.onclick=()=>open();document.body.append(btn);
 const d=el('dialog',{id:'tasks-dialog',className:'tasks-dlg'});d.innerHTML=`<div class="tasks-in"><div class="tasks-head"><h3>업무함<small id="tasks-sub"></small></h3><button type="button" id="tasks-close" aria-label="업무함 닫기">×</button></div>
 <div class="tasks-tools"><input type="search" id="tasks-q" placeholder="제목·내용으로 찾기 (선박명, 서류명…)" aria-label="업무 찾기"><div class="tasks-seg" id="tasks-status"></div><div class="tasks-seg" id="tasks-group"></div><div class="tasks-seg vessels" id="tasks-vessels"></div></div>
 <div class="tasks-body" id="tasks-body"><div class="tasks-list" id="tasks-list"></div><div class="tasks-detail" id="tasks-detail"></div></div></div>`;document.body.append(d);
 d.addEventListener('keydown',e=>e.stopPropagation());d.addEventListener('close',()=>{clearInterval(timer);timer=null;});
 $('tasks-close').onclick=()=>d.close();$('tasks-q').oninput=e=>{view.q=e.target.value.trim().toLowerCase();paint();};}
async function load(){try{tasks=await api('/api/tasks');$('tasks-open').hidden=false;}catch{tasks=[];if(!Object.keys(zones).length)$('tasks-open').hidden=true;return false;}
 if(!Object.keys(zones).length){try{for(const z of await api('/api/zones'))zones[z.id]=z.name;}catch{}}
 const active=tasks.filter(t=>t.status!=='done').length;$('tasks-count').textContent=active?String(active):'';return true;}
function filtered(){return tasks.filter(t=>(view.status==='all'||(view.status==='active'?t.status!=='done':view.status==='results'?t.results.length:t.status===view.status))&&(!view.vessel||t.vessels.includes(view.vessel))&&(!view.q||t.search.toLowerCase().includes(view.q)||zoneName(t.zone).toLowerCase().includes(view.q)));}
function seg(box,items,cur,set){box.replaceChildren();for(const [k,label] of items)box.append(el('button',{type:'button',className:cur===k?'on':'',textContent:label,onclick:()=>{set(k);paint();}}));}
function paint(){const n=k=>k==='all'?tasks.length:k==='active'?tasks.filter(t=>t.status!=='done').length:k==='results'?tasks.filter(t=>t.results.length).length:tasks.filter(t=>t.status===k).length;
 seg($('tasks-status'),[['active','할 일 '+n('active')],...ORDER.filter(k=>n(k)).map(k=>[k,STATUS[k]+' '+n(k)]),['results','⭐ 결과 있음 '+n('results')],['all','전체 '+n('all')]],view.status,k=>view.status=k);
 seg($('tasks-group'),[['zone','장소별'],['status','상태별'],['date','날짜별']],view.group,k=>view.group=k);
 const vs=[...new Set(tasks.flatMap(t=>t.vessels))];seg($('tasks-vessels'),vs.length?[['','🚢 모든 선박'],...vs.map(v=>[v,'🚢 '+v])]:[],view.vessel,k=>view.vessel=k);
 $('tasks-sub').textContent='맡긴 일 '+tasks.length+'건 · 할 일 '+n('active')+' · 완료 '+n('done');
 const list=$('tasks-list');list.replaceChildren();const shown=filtered();
 if(!tasks.length){list.append(el('p',{className:'empty',textContent:'아직 안내원에게 맡긴 일이 없어요.\n업무 장소 건물에 들어가 안내원에게 말을 걸고 일을 맡기면, 여기 장소·상태별로 차곡차곡 모입니다.'}));paintDetail(null);return;}
 if(!shown.length)list.append(el('p',{className:'empty',textContent:'조건에 맞는 일이 없어요.'}));
 const key=t=>view.group==='zone'?zoneName(t.zone):view.group==='status'?(STATUS[t.status]||t.status):String(t.updatedAt).slice(0,10);
 const groups=new Map();for(const t of shown){const k=key(t);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(t);}
 const keys=[...groups.keys()];if(view.group==='status')keys.sort((a,b)=>ORDER.indexOf(Object.keys(STATUS).find(k=>STATUS[k]===a))-ORDER.indexOf(Object.keys(STATUS).find(k=>STATUS[k]===b)));if(view.group==='date')keys.sort().reverse();
 for(const k of keys){const arr=groups.get(k);list.append(el('h4',{textContent:k+' · '+arr.length}));
  for(const t of arr)list.append(el('button',{type:'button',className:'t-item'+(view.sel===t.id?' on':''),dataset:{task:t.id},onclick:()=>{view.sel=t.id;paint();}},[el('span',{className:'t-st st-'+t.status,textContent:STATUS[t.status]||t.status}),el('b',{textContent:t.title}),
   el('small',{textContent:[view.group==='zone'?'':zoneName(t.zone),when(t.updatedAt),who(t)&&'담당 '+who(t),t.messages+'개 대화',t.attachments?'📎'+t.attachments:'',t.results.length?'⭐'+t.results.length:'',...t.vessels.map(v=>'🚢'+v)].filter(Boolean).join(' · ')})]));}
 const sel=tasks.find(t=>t.id===view.sel);paintDetail(sel||null);}
async function paintDetail(t){const box=$('tasks-detail');$('tasks-body').classList.toggle('detail',!!t);if(!t){box.replaceChildren(el('p',{className:'ph',textContent:'왼쪽에서 일을 고르면 대화와 결과물이 보입니다.'}));detail=null;return;}
 if(detail?.id!==t.id||detail.updatedAt!==t.updatedAt){box.replaceChildren(el('p',{className:'ph',textContent:'불러오는 중…'}));try{detail=await api('/api/cases/'+encodeURIComponent(t.id));}catch(e){box.replaceChildren(el('p',{className:'ph',textContent:e.message}));return;}if(view.sel!==t.id)return;}
 const c=detail,status=el('select',{'aria-label':'진행 상태'});for(const k of ORDER)status.append(new Option(STATUS[k],k));status.value=ORDER.includes(c.status)?c.status:'progress';
 status.onchange=async()=>{try{await api('/api/cases/'+encodeURIComponent(c.id)+'/events',{type:'status',status:status.value});await load();paint();hooks?.toast?.('「'+STATUS[status.value]+'」(으)로 표시했습니다');}catch(e){hooks?.toast?.(e.message);}};
 const go=el('button',{type:'button',className:'td-go',textContent:'그 장소 안내원에게 이어서 맡기기 →',onclick:()=>resume({zone:c.zone,caseId:c.id,provider:c.lastProvider})});
 const kids=[el('button',{type:'button',className:'td-back',textContent:'← 목록',onclick:()=>{view.sel=null;paint();}}),el('p',{className:'td-title',textContent:c.title}),
  el('div',{className:'td-meta'},[el('span',{textContent:'📍 '+zoneName(c.zone)}),el('span',{textContent:'시작 '+when(c.createdAt)}),el('span',{textContent:'최근 '+when(c.updatedAt)+(c.updatedBy?' ('+c.updatedBy+')':'')}),who({zone:c.zone,provider:c.lastProvider})?el('span',{textContent:'담당 '+who({zone:c.zone,provider:c.lastProvider})}):null,c.attachments?.length?el('span',{textContent:'📎 '+c.attachments.map(a=>a.name).join(', ')}):null]),
  el('div',{className:'td-row'},[el('span',{textContent:'진행 상태',style:'font-size:12px'}),status,go])];
 if(c.results?.length){const r=el('div',{className:'td-res'},[el('b',{textContent:'⭐ 결과물 '+c.results.length})]);for(const x of c.results)r.append(el('div',{className:'r'},[el('span',{textContent:x.label}),
   el('button',{type:'button',textContent:'답 보기',onclick:()=>$('td-m-'+x.messageId)?.scrollIntoView({block:'center',behavior:'smooth'})}),x.recordId?el('button',{type:'button',textContent:'자료함 파일 열기',onclick:()=>api('/api/records/'+encodeURIComponent(x.recordId)+'/open',{}).catch(e=>hooks?.toast?.(e.message))}):null]));kids.push(r);}
 const chat=el('div',{className:'td-chat'});for(const m of c.messages||[]){const pin=c.results?.find(r=>r.messageId===m.id);chat.append(el('div',{className:'m '+(m.role==='user'?'user':'agent')+(pin?' pinned':''),id:'td-m-'+m.id},[el('b',{textContent:(m.role==='user'?'박사':(personaFor(c.zone,m.provider).name||'안내원'))+' · '+when(m.at)+(pin?' · ⭐ '+pin.label:'')}),document.createTextNode(m.text)]));}
 kids.push(chat);box.replaceChildren(...kids);}
// 이어서 맡기기: 이 지도에 있는 장소면 바로 가서 들어가고, 아니면 지도를 옮겨서 연다.
function resume(r){try{sessionStorage.setItem(RESUME,JSON.stringify({...r,at:Date.now()}));}catch{}$('tasks-dialog').close();
 if(hooks.canOpen(r.zone)){try{sessionStorage.removeItem(RESUME);}catch{}hooks.openTask(r);}else hooks.otherMap(r);}
export function open(opt={}){build();hooks?.clearMovement?.();for(const d of document.querySelectorAll('dialog[open]'))if(d.id!=='tasks-dialog')d.close();if(!$('tasks-dialog').open)$('tasks-dialog').showModal();
 if(opt.zone&&view.group!=='zone')view.group='zone';$('tasks-q').value=view.q;load().then(ok=>{if(!ok){$('tasks-list').replaceChildren(el('p',{className:'empty',textContent:'설치형 프로그램에서 업무함을 볼 수 있어요.'}));return;}paint();});
 clearInterval(timer);timer=setInterval(()=>load().then(ok=>ok&&paint()),30000);}
// h = {toast, clearMovement, canOpen(zone), openTask({zone,caseId,provider}), otherMap({zone,...})}
export function initTasks(h){hooks=h;build();load();window.GorgoTasks={open,reload:()=>load().then(()=>$('tasks-dialog')?.open&&paint()),state:()=>({tasks,view})};
 // 다른 지도에서 「이어서 맡기기」로 넘어왔으면 그 장소로 가서 연다(3분 안의 요청만)
 let r=null;try{r=JSON.parse(sessionStorage.getItem(RESUME)||'null');}catch{}
 if(r&&Date.now()-r.at<180000&&h.canOpen(r.zone)){try{sessionStorage.removeItem(RESUME);}catch{}setTimeout(()=>h.openTask(r),1200);}}

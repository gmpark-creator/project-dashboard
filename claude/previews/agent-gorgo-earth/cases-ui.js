// 업무 카드 창 — 자료 창(records-ui)의 업무존에서 연다.
// 한 건의 원본·지시·AI 초안·사람 수정본·진행 상태·다음 지시를 보고 이어서 처리한다.
// 저장은 서버(/api/cases)가 자료 저장소에 이벤트로 남기고, 기존 자동 동기화로 다른 PC에 전달된다.
const $=id=>document.getElementById(id);
const el=(tag,props={},...kids)=>{const n=Object.assign(document.createElement(tag),props);n.append(...kids.filter(k=>k!=null));return n;};
const STATUS={open:'접수',analyzing:'분석 중',review:'검토 필요',progress:'진행 중',hold:'보류',done:'완료'};
const AI_NAME={chatgpt:'ChatGPT',claude:'Claude',gemini:'Gemini'};
let hooks={},zone=null,zoneName='',cases=[],selected=null,dirty=new Set(),busy=false;
async function api(url,options={}){const r=await fetch(url,{cache:'no-store',...options});const data=await r.json().catch(()=>({}));if(!r.ok)throw Object.assign(Error(data.error||'요청을 완료하지 못했습니다.'),{status:r.status});return data;}
const post=(url,body)=>api(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const when=t=>t?new Date(t).toLocaleString('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
function tell(m){hooks.toast?.(m);}
function build(){if($('cases-dialog'))return;
 document.head.append(el('link',{rel:'stylesheet',href:'cases-ui.css'}));
 const d=el('dialog',{id:'cases-dialog'});d.setAttribute('aria-labelledby','cases-title');
 const close=el('button',{id:'cases-close',className:'close',textContent:'×',onclick:()=>d.close()});close.setAttribute('aria-label','업무 카드 창 닫기');
 d.append(close,el('h2',{id:'cases-title',textContent:'업무 카드'}),
  el('div',{className:'cases-bar'},el('button',{id:'cases-new',type:'button',textContent:'+ 새 업무 카드',onclick:()=>paintNew()}),el('small',{id:'cases-note',textContent:'여기 남긴 내용은 다른 PC의 고르고에서도 이어서 볼 수 있습니다.'})),
  el('div',{className:'cases-body'},el('div',{id:'cases-list'}),el('section',{id:'cases-detail'})));
 document.body.append(d);
}
export function attachCasesButton(){const bar=document.querySelector('#records-dialog .records-toolbar');if(!bar||$('records-cases'))return;
 const b=el('button',{id:'records-cases',type:'button',className:'cases-open',textContent:'업무 카드',onclick:()=>hooks.zone?.()&&openCases(hooks.zone())});bar.prepend(b);}
export async function openCases(id){build();zone=id;zoneName=hooks.zoneName?.(id)||id;$('cases-title').textContent=zoneName+' · 업무 카드';
 for(const dlg of document.querySelectorAll('dialog[open]'))if(dlg.id!=='cases-dialog')dlg.close();hooks.clearMovement?.();if(!$('cases-dialog').open)$('cases-dialog').showModal();
 selected=null;dirty.clear();$('cases-detail').replaceChildren(el('p',{className:'cases-empty',textContent:'카드를 고르거나 새로 만들어주세요.'}));await refreshCases();}
export async function refreshCases(){if(!zone||!$('cases-dialog')?.open)return;try{cases=await api('/api/cases?zone='+encodeURIComponent(zone));}catch(e){$('cases-list').replaceChildren(el('p',{className:'cases-empty',textContent:e.message}));return;}
 paintList();if(selected&&!busy){const c=cases.find(c=>c.id===selected);if(c&&!dirty.size)paintDetail(c);else if(c)markRemote(c);}}
function paintList(){const list=$('cases-list');list.replaceChildren();if(!cases.length){list.append(el('p',{className:'cases-empty',textContent:'아직 업무 카드가 없습니다.'}));return;}
 for(const c of cases){const item=el('button',{type:'button',className:'case-item'+(c.id===selected?' is-active':''),onclick:()=>{if(dirty.size&&!confirm('저장하지 않은 입력이 있습니다. 다른 카드로 이동할까요?'))return;dirty.clear();selected=c.id;paintList();paintDetail(c);}},
   el('strong',{textContent:c.title}),el('span',{className:'case-status s-'+c.status,textContent:STATUS[c.status]||c.status}),el('small',{textContent:'최근 '+c.updatedBy+' · '+when(c.updatedAt)}));item.dataset.caseId=c.id;list.append(item);}}
function markRemote(c){const box=$('cases-remote');if(box&&c.updatedAt!==box.dataset.seen)box.textContent='다른 PC에서 이 카드가 갱신됐습니다 ('+c.updatedBy+' · '+when(c.updatedAt)+'). 입력을 저장하거나 지운 뒤 새로 고쳐집니다.';}
function field(id,label,node){node.id=id;node.addEventListener('input',()=>dirty.add(id));return el('label',{className:'case-field'},el('span',{textContent:label}),node);}
async function act(button,fn,ok){if(busy)return;busy=true;const old=button.textContent;button.disabled=true;try{const c=await fn();dirty.clear();if(c?.id){selected=c.id;await refreshCases();paintDetail(cases.find(x=>x.id===c.id)||c);}if(ok)tell(ok);}catch(e){tell(e.message);const err=$('cases-error');if(err)err.textContent=e.message;}finally{busy=false;button.disabled=false;button.textContent=old;}}
function paintNew(){if(dirty.size&&!confirm('저장하지 않은 입력이 있습니다. 새 카드를 만들까요?'))return;dirty.clear();selected=null;paintList();
 const records=hooks.records?.(zone)||[];const picks=el('div',{className:'case-sources'});
 if(!records.length)picks.append(el('p',{className:'cases-empty',textContent:'이 업무존에 자료가 없습니다. 파일을 먼저 끌어 넣으면 원본으로 고를 수 있습니다.'}));
 for(const r of records){const box=el('input',{type:'checkbox',value:r.id});picks.append(el('label',{className:'case-pick'},box,el('span',{textContent:r.originalName+' · '+r.docType})));}
 const title=el('input',{maxLength:200,placeholder:'예: 11월 5일 입항 선원명부 작성'}),instr=el('textarea',{rows:4,maxLength:8000,placeholder:'AI와 사람이 할 일을 적어주세요. 예: 첨부 명단에서 이름·국적·여권번호·생년월일을 표로 정리'});
 const make=el('button',{type:'button',className:'case-primary',textContent:'업무 카드 만들기'});
 make.onclick=()=>act(make,()=>post('/api/cases',{zone,title:title.value,instruction:instr.value,sourceIds:[...picks.querySelectorAll('input:checked')].map(i=>i.value)}),'업무 카드를 만들었어요 · 동기화 중');
 $('cases-detail').replaceChildren(el('h3',{textContent:'새 업무 카드'}),field('case-new-title','업무 제목',title),field('case-new-instruction','지시',instr),el('div',{className:'case-field'},el('span',{textContent:'원본 자료 (최대 10건)'}),picks),el('p',{id:'cases-error',className:'case-error'}),make);title.focus();}
async function aiChoices(){try{return await api('/api/ai');}catch{return [];}}
async function paintDetail(c){if(!c)return;const detail=$('cases-detail');const recs=hooks.records?.(c.zone)||[];
 const status=el('select',{});for(const [k,v]of Object.entries(STATUS))status.append(new Option(v,k));status.value=c.status;
 status.onchange=()=>act(status,()=>post('/api/cases/'+encodeURIComponent(c.id)+'/events',{type:'status',status:status.value}),'진행 상태를 '+STATUS[status.value]+'(으)로 바꿨어요');
 const sources=el('ul',{className:'case-source-list'});for(const id of c.sourceIds){const r=recs.find(r=>r.id===id);sources.append(el('li',{textContent:r?r.originalName+' · '+r.docType:'(휴지통으로 옮겼거나 아직 동기화되지 않은 자료)'}));}
 if(!c.sourceIds.length)sources.append(el('li',{textContent:'원본 자료 없음'}));
 const rows=await aiChoices();const provider=el('select',{id:'case-ai'});for(const r of rows){const usable=r.authenticated&&r.enabled&&r.id!=='chatgpt';const o=new Option(AI_NAME[r.id]+(usable?'':r.id==='chatgpt'&&r.authenticated?' (분석 미지원)':!r.authenticated?' (연결 필요)':' (꺼짐)'),r.id);o.disabled=!usable;provider.append(o);}
 const firstUsable=[...provider.options].find(o=>!o.disabled);if(firstUsable)provider.value=firstUsable.value;
 const run=el('button',{type:'button',className:'case-primary',textContent:'AI 분석 실행'});run.disabled=!firstUsable;
 run.onclick=()=>{if(dirty.has('case-draft')&&!confirm('수정본을 저장하지 않았습니다. 그대로 AI 분석을 실행할까요?'))return;run.textContent='분석 중… (최대 3분)';act(run,()=>post('/api/cases/'+encodeURIComponent(c.id)+'/analyze',{provider:provider.value}),'AI 초안을 저장했어요 · 검토해주세요');};
 const draft=el('textarea',{rows:12,value:c.draft||'',placeholder:'AI 초안이나 직접 작성한 결과가 여기에 쌓입니다.'});
 const saveDraft=el('button',{type:'button',textContent:'수정본 저장'});saveDraft.onclick=()=>act(saveDraft,()=>post('/api/cases/'+encodeURIComponent(c.id)+'/events',{type:'edit',text:$('case-draft').value}),'수정본을 저장했어요 · 동기화 중');
 const copy=el('button',{type:'button',textContent:'결과 복사',onclick:()=>navigator.clipboard?.writeText($('case-draft').value).then(()=>tell('결과를 복사했어요'),()=>tell('복사하지 못했습니다'))});
 const next=el('textarea',{rows:3,value:c.next||'',placeholder:'다른 PC나 다음 사람이 이어서 할 일'});
 const saveNext=el('button',{type:'button',textContent:'다음 지시 저장'});saveNext.onclick=()=>act(saveNext,()=>post('/api/cases/'+encodeURIComponent(c.id)+'/events',{type:'next',instruction:$('case-next').value}),'다음 지시를 저장했어요');
 const from=c.draftFrom?(c.draftFrom.type==='analysis'?'AI 초안 · '+(c.analyses.at(-1)?.provider||'')+' '+(c.analyses.at(-1)?.model||'')+' · '+c.draftFrom.by:'사람 수정본 · '+c.draftFrom.by)+' · '+when(c.draftFrom.at):'아직 결과 없음';
 const typeName={create:'카드 생성',analysis:'AI 분석',edit:'수정본 저장',status:'상태 변경',next:'다음 지시',note:'메모'};
 const history=el('ol',{className:'case-history'});for(const h of [...c.history].reverse())history.append(el('li',{textContent:when(h.at)+' · '+h.by+' · '+(typeName[h.type]||h.type)+(h.status?' → '+(STATUS[h.status]||h.status):'')+(h.provider?' ('+(AI_NAME[h.provider]||h.provider)+')':'')}));
 const remote=el('p',{id:'cases-remote',className:'case-remote'});remote.dataset.seen=c.updatedAt;
 detail.replaceChildren(el('div',{className:'case-head'},el('h3',{textContent:c.title}),status),
  el('p',{className:'case-meta',textContent:'만든 PC '+c.createdBy+' · '+when(c.createdAt)+'  |  최근 '+c.updatedBy+' · '+when(c.updatedAt)}),remote,
  el('div',{className:'case-field'},el('span',{textContent:'원본 자료'}),sources),
  el('div',{className:'case-field'},el('span',{textContent:'지시'}),el('p',{className:'case-instruction',textContent:c.instruction||'(지시 없음)'})),
  el('div',{className:'case-ai'},provider,run,el('small',{textContent:'PDF·이미지·텍스트(CSV·메모장)를 분석합니다. 엑셀·한글은 PDF/CSV로 저장해 넣어주세요. 결과는 AI 초안이므로 꼭 검토해주세요.'})),
  field('case-draft','결과 ('+from+')',draft),el('div',{className:'case-actions'},saveDraft,copy),
  field('case-next','다음 지시',next),el('div',{className:'case-actions'},saveNext),
  el('p',{id:'cases-error',className:'case-error'}),el('details',{},el('summary',{textContent:'기록 '+c.history.length+'건'}),history));}
export function initCasesUI(options){hooks=options;build();$('cases-dialog').addEventListener('close',()=>{dirty.clear();selected=null;});attachCasesButton();
 try{const events=new EventSource('/api/events');events.addEventListener('change',()=>{clearTimeout(initCasesUI.t);initCasesUI.t=setTimeout(refreshCases,300);});}catch{}}

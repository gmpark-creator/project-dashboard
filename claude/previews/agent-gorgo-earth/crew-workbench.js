// Local source intake. Document extraction/export waits for the owner's approved form.
const $=id=>document.getElementById(id);
const slots=new Map();
const supported=/\.(pdf|png|jpe?g|webp|tiff?|xlsx?|csv|hwp[x]?|docx?)$/i;
const roles=[['crew','본선 선원명부'],['passport','여권사본'],['book','선원수첩사본'],['other','기타 / 미분류']];
let currentPoint=null,beforeOpen=()=>{},dbPromise=null;
function slot(id){if(!slots.has(id))slots.set(id,{files:[],template:null,folder:null,folderName:'',notice:'',busy:false,restored:false});return slots.get(id);}
function guessRole(name){if(/수첩|seaman|seafarer|seaman.?s.?book|cdc/i.test(name))return 'book';if(/여권|passport/i.test(name))return 'passport';if(/명부|crew.?list|crew.?manifest/i.test(name))return 'crew';return 'other';}
function database(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('gorgo-local-work',1);r.onupgradeneeded=()=>r.result.createObjectStore('handles');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return dbPromise;}
async function remember(id,kind,handle){try{const db=await database();await new Promise((resolve,reject)=>{const tx=db.transaction('handles','readwrite');tx.objectStore('handles').put(handle,id+':'+kind);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}catch{/* Picking files still works when browser storage is unavailable. */}}
async function recall(id,kind){try{const db=await database();return await new Promise((resolve,reject)=>{const r=db.transaction('handles').objectStore('handles').get(id+':'+kind);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}catch{return null;}}
function paint(id){
  if(id!==currentPoint)return;const s=slot(id);
  $('crew-template-name').textContent=s.template?s.template.name:'아직 선택하지 않았습니다.';
  $('crew-folder-refresh').disabled=!s.folder||s.busy;
  $('crew-folder-pick').disabled=s.busy;$('crew-template-pick').disabled=s.busy;
  const count=Object.fromEntries(roles.map(([k])=>[k,0]));for(const f of s.files)count[f.role]++;
  $('crew-source-summary').textContent=s.folderName?`${s.folderName} · ${s.files.length}개 문서 / 명부 ${count.crew} · 여권 ${count.passport} · 수첩 ${count.book} · 미분류 ${count.other}`:'아직 선택하지 않았습니다.';
  const list=$('crew-file-list');list.replaceChildren();
  for(const f of s.files){const row=document.createElement('div');row.className='crew-file';const name=document.createElement('span');name.textContent=f.path;name.title=f.path;const select=document.createElement('select');select.setAttribute('aria-label',f.path+' 자료 종류');
    for(const [value,text]of roles){const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);}select.value=f.role;
    select.addEventListener('change',()=>{f.role=select.value;paint(id);});row.append(name,select);list.append(row);
  }
  $('crew-status').textContent=s.busy?'폴더를 읽고 있습니다…':s.notice;
}
async function scan(id,handle){const s=slot(id);if(s.busy)return;s.busy=true;s.notice='';paint(id);const files=[];let seen=0,truncated=false;
  try{
    async function walk(dir,prefix='',depth=0){if(depth>8){truncated=true;return;}for await(const [name,item]of dir.entries()){if(++seen>5000||files.length>=1000){truncated=true;return;}if(name.startsWith('.'))continue;const path=prefix+name;
      if(item.kind==='directory')await walk(item,path+'/',depth+1);else if(supported.test(name))files.push({path,handle:item,role:guessRole(path)});
    }}
    await walk(handle);files.sort((a,b)=>a.path.localeCompare(b.path));s.files=files;s.folder=handle;s.folderName=handle.name;s.notice=truncated?'폴더가 커서 일부만 읽었습니다. 이번 본선 자료만 담은 폴더를 선택하세요.':files.length?'파일명으로 분류했습니다. 아래 목록에서 자료 종류를 확인할 수 있습니다.':'지원 문서가 없습니다. PDF·이미지·Excel·한글·Word 파일을 넣고 다시 읽어주세요.';
    await remember(id,'folder',handle);
  }catch(error){s.notice='폴더를 읽지 못했습니다. 자료 폴더를 다시 선택해주세요.';}
  finally{s.busy=false;paint(id);}
}
async function chooseFolder(){const id=currentPoint;if(!id)return;if(!window.showDirectoryPicker){$('crew-folder').click();return;}
  try{const handle=await window.showDirectoryPicker({id:'gorgo-crew-sources',mode:'read'});await scan(id,handle);}catch(e){if(e.name!=='AbortError'){slot(id).notice='폴더 선택을 사용할 수 없습니다. 폴더의 파일들을 선택해주세요.';paint(id);$('crew-folder').click();}}
}
async function chooseTemplate(){const id=currentPoint;if(!id)return;if(!window.showOpenFilePicker){$('crew-template').click();return;}
  try{const [handle]=await window.showOpenFilePicker({id:'gorgo-crew-template',multiple:false});slot(id).template=await handle.getFile();slot(id).notice='양식을 선택했습니다. 원본은 변경하지 않습니다.';await remember(id,'template',handle);paint(id);}catch(e){if(e.name!=='AbortError'){slot(id).notice='양식 파일을 다시 선택해주세요.';paint(id);}}
}
async function restore(id){const s=slot(id);if(s.restored)return;s.restored=true;
  const [folder,template]=await Promise.all([recall(id,'folder'),recall(id,'template')]);
  if(template&&!s.template){try{if(await template.queryPermission({mode:'read'})==='granted')s.template=await template.getFile();}catch{}}
  if(folder&&!s.folder){s.folder=folder;s.folderName=folder.name;s.notice='이전에 연결한 폴더입니다. 다시 읽기를 누르면 최신 자료를 확인합니다.';}
  paint(id);
}
export function openCrewWorkbench(id,name){currentPoint=id;beforeOpen();$('crew-location').textContent=name;$('crew-dialog').showModal();paint(id);restore(id);}
export function initCrewWorkbench(options={}){
  beforeOpen=options.beforeOpen||(()=>{});$('crew-close').onclick=()=>$('crew-dialog').close();
  $('crew-template-pick').onclick=chooseTemplate;$('crew-folder-pick').onclick=chooseFolder;
  $('crew-folder-refresh').onclick=async()=>{const id=currentPoint,s=slot(id);if(!s.folder)return;try{if(await s.folder.requestPermission({mode:'read'})!=='granted'){s.notice='폴더 읽기를 허용하거나 자료 폴더를 다시 선택해주세요.';paint(id);return;}await scan(id,s.folder);}catch{s.notice='이전에 선택한 폴더를 열 수 없습니다. 다시 선택해주세요.';paint(id);}};
  $('crew-template').onchange=e=>{const file=e.target.files[0];if(file&&currentPoint){slot(currentPoint).template=file;paint(currentPoint);}e.target.value='';};
  $('crew-folder').onchange=e=>{if(!currentPoint||!e.target.files.length)return;const s=slot(currentPoint),files=Array.from(e.target.files);s.folder=null;s.folderName=files[0].webkitRelativePath.split('/')[0];s.files=files.filter(f=>supported.test(f.name)).slice(0,1000).map(file=>({path:file.webkitRelativePath||file.name,file,role:guessRole(file.webkitRelativePath||file.name)}));s.notice=files.length>1000?'최대 1,000개까지 표시합니다. 이번 본선 자료만 담은 폴더를 선택하세요.':'자료를 선택했습니다. 파일명으로 분류된 종류를 확인해주세요.';paint(currentPoint);e.target.value='';};
}

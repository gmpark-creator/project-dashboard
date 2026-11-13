/* Runs INSIDE the existing logger extension, never as a separate extension. */
(() => {
  'use strict';
  if(location.origin !== 'https://gmpark-creator.github.io' || location.pathname !== '/project-dashboard/claude/') return;
  const allowed=['question','prompt','text','content','topic','title','주제','질문','내용','timestamp','createdAt','time','datetime','dateTime','ts','시각','일시','date','날짜','site','service','platform','hostname','사이트','category','카테고리','outside','outsideWorkHours','outOfHours','isOutsideWorkHours','isOffHours','offHours','근무시간외','근무시간 외'];
  window.addEventListener('message', async event => {
    if(event.source!==window || event.origin!==location.origin || event.data?.type!=='GM_AIQ_REQUEST' || typeof event.data.requestId!=='string' || location.hash!=='#/p/ai-question-logger') return;
    const reply=data=>window.postMessage({type:'GM_AIQ_RESPONSE',requestId:event.data.requestId,...data},location.origin);
    try {
      const data=await chrome.storage.local.get(null);
      const candidates=[];
      function inspect(obj, depth) {
        if(!obj || typeof obj!=='object' || depth>2) return;
        for(const [key,value] of Object.entries(obj)) {
          if(Array.isArray(value) && /^(records|logs|entries|history|questions|questionLogs|questionHistory|aiLogs)$/i.test(key)) candidates.push(value);
          else if(!Array.isArray(value)) inspect(value,depth+1);
        }
      }
      inspect(data,0);
      if(candidates.length!==1) {reply({error:'확장 저장 구조를 확인해야 합니다. records/logs/entries/history/questions 등 기록 배열이 하나 있어야 합니다. CSV 가져오기는 사용할 수 있습니다.'});return;}
      const records=candidates[0].filter(r=>r && typeof r==='object').map(r=>Object.fromEntries(allowed.filter(k=>typeof r[k]==='string'||typeof r[k]==='number'||typeof r[k]==='boolean').map(k=>[k,r[k]])));
      reply({records});
    } catch {reply({error:'확장 기록을 읽지 못했습니다. 확장을 새로고침하고 대시보드를 다시 열어주세요.'});}
  });
})();

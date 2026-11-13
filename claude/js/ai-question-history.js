/* Question history stays in this browser; no network requests. */
(function (global) {
  'use strict';
  const KEY = 'gmpark.ai-question-history.v1';
  const pick = (r, names) => { for (const n of names) if (r[n] !== undefined && r[n] !== null && r[n] !== '') return r[n]; return ''; };
  const text = value => typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  const esc = value => text(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normalize(input) {
    const rows = Array.isArray(input) ? input : input && (input.records || input.logs || input.entries || input.history || input.questions);
    if (!Array.isArray(rows)) throw new Error('기록 배열 또는 records/logs/entries/history/questions 배열이 필요합니다.');
    if (rows.length > 100000) throw new Error('한 번에 100,000건까지 가져올 수 있습니다.');
    return rows.map(r => {
      if (!r || typeof r !== 'object') return null;
      const question = text(pick(r, ['question','prompt','text','content','topic','title','주제','질문','내용']));
      const raw = pick(r, ['timestamp','createdAt','time','datetime','dateTime','ts','시각','일시']);
      const day = text(pick(r, ['date','날짜']));
      let stamp = text(raw) || day;
      if (/^\d{10}(\d{3})?$/.test(stamp)) stamp = new Date(Number(stamp) * (stamp.length === 10 ? 1000 : 1)).toISOString();
      else if (day && /^\d{1,2}:\d{2}/.test(stamp)) stamp = day + 'T' + stamp + '+09:00';
      else if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(stamp)) stamp = stamp.replace(' ', 'T') + '+09:00';
      const date = new Date(stamp);
      const valid = !Number.isNaN(date.getTime());
      const dateKey = valid ? new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(date) : day.slice(0,10);
      const flagged = pick(r, ['outside','outsideWorkHours','outOfHours','isOutsideWorkHours','isOffHours','offHours','근무시간외','근무시간 외']);
      if (!question.trim()) return null;
      return {question, timestamp: valid ? date.toISOString() : stamp, date:dateKey,
        site:text(pick(r,['site','service','platform','hostname','사이트'])),
        category:text(pick(r,['category','카테고리'])) || '미분류',
        outside:flagged === true || flagged === 1 || /^(true|yes|1|예|근무시간 외|외)$/i.test(text(flagged))};
    }).filter(Boolean);
  }
  function csvParse(source) {
    const rows = []; let row = [], cell = '', quote = false;
    source = source.replace(/^\uFEFF/, '');
    for (let i=0; i<source.length; i++) {
      const c = source[i];
      if(c === '"') { if(quote && source[i+1] === '"') {cell+='"'; i++;} else quote=!quote; }
      else if(c === ',' && !quote) {row.push(cell);cell='';}
      else if((c === '\n' || c === '\r') && !quote) { if(c==='\r' && source[i+1]==='\n') i++; row.push(cell); if(row.some(Boolean)) rows.push(row);row=[];cell=''; }
      else cell+=c;
    }
    if(quote) throw new Error('CSV 따옴표가 닫히지 않았습니다.');
    row.push(cell);if(row.some(Boolean)) rows.push(row);
    const headers = (rows.shift() || []).map(s=>s.trim());
    return rows.map(values=>Object.fromEntries(headers.map((h,i)=>[h,values[i] || ''])));
  }
  let host = null, records = [], sourceLabel = '가져온 기록', page = 0, pending = null, timer = null, live = false;
  function status(message) { if(host && host.isConnected) host.querySelector('[data-status]').textContent=message; }
  function filtered() {
    if (!host) return [];
    const val = n=>host.querySelector('[name="'+n+'"]').value;
    const q = val('search').toLowerCase();
    return records.filter(r=>(!val('from') || r.date>=val('from')) && (!val('to') || r.date<=val('to')) && (!val('site') || r.site===val('site')) && (!val('category') || r.category===val('category')) && (!host.querySelector('[name=outside]').checked || r.outside) && (!q || [r.question,r.category,r.site].join(' ').toLowerCase().includes(q))).sort((a,b)=>b.timestamp.localeCompare(a.timestamp));
  }
  function render() {
    if(!host || !host.isConnected) return;
    const rows = filtered(), pages = Math.max(1, Math.ceil(rows.length/50));page=Math.min(page,pages-1);
    host.querySelector('[data-stats]').innerHTML = '<span>전체 '+records.length.toLocaleString()+'건</span><span>검색 결과 '+rows.length.toLocaleString()+'건</span><span>근무시간 외 '+rows.filter(r=>r.outside).length.toLocaleString()+'건</span><span>'+esc(sourceLabel)+'</span>';
    host.querySelector('tbody').innerHTML = rows.slice(page*50,page*50+50).map(r=>'<tr><td>'+esc(r.timestamp && !Number.isNaN(Date.parse(r.timestamp)) ? new Date(r.timestamp).toLocaleString('ko-KR',{timeZone:'Asia/Seoul',hour12:false}) : r.timestamp || '시각 미상')+(r.outside?'<br><small class="aqh-warn">근무시간 외</small>':'')+'</td><td>'+esc(r.site || '미상')+'</td><td>'+esc(r.category)+'</td><td>'+(r.question.length>160?'<details><summary>'+esc(r.question.slice(0,160))+'…</summary>'+esc(r.question)+'</details>':esc(r.question))+'</td></tr>').join('') || '<tr><td colspan="4" class="aqh-empty">'+(records.length?'조건에 맞는 기록이 없습니다.':'아직 불러온 기록이 없습니다. 기존 기록기의 CSV/JSON 파일을 가져오거나 확장을 연결하세요.')+'</td></tr>';
    host.querySelector('[data-page]').textContent = (page+1)+' / '+pages;
    host.querySelector('[data-prev]').disabled=page===0;host.querySelector('[data-next]').disabled=page===pages-1;
  }
  function accept(rows, label) {
    records=normalize(rows);sourceLabel=label;page=0;
    for (const key of ['site','category']) {
      const el=host.querySelector('[name='+key+']'), old=el.value;
      el.innerHTML='<option value="">전체</option>'+[...new Set(records.map(r=>r[key]).filter(Boolean))].sort().map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('');el.value=old;
    }
    render();
  }
  function connect() {
    pending = global.crypto.randomUUID();
    clearTimeout(timer);status('확장 연결 확인 중…');
    global.postMessage({type:'GM_AIQ_REQUEST',requestId:pending}, global.location.origin);
    timer=setTimeout(()=>{pending=null;status('확장 연결이 확인되지 않았습니다. CSV/JSON을 가져오거나 아래 연결 안내를 확인하세요.');},4000);
  }
  global.addEventListener('message', event=>{
    if(event.source!==global || event.origin!==global.location.origin || !pending || event.data?.type!=='GM_AIQ_RESPONSE' || event.data.requestId!==pending || !host?.isConnected) return;
    clearTimeout(timer);pending=null;
    if(event.data.error) {status(event.data.error);return;}
    try {accept(event.data.records,'현재 브라우저 · 확장 연결'); live=true;status('연결됨 · 확장 기록이 바뀌면 새로고침 버튼으로 갱신할 수 있습니다.');} catch(e){status(e.message);}
  });
  function mount(el) {
    host=el;clearTimeout(timer);pending=null;live=false;
    if(!host) return;
    host.className='aqh';
    host.innerHTML='<h3>질문 내역</h3><p>이 브라우저의 기록을 대시보드에서 확인합니다. 기록은 서버에 전송하지 않습니다.</p><div class="aqh-toolbar"><button type="button" data-connect>확장 연결 / 새로고침</button><label class="aqh-file">CSV / JSON 가져오기<input type="file" accept=".csv,.json" hidden></label><button type="button" data-export>검색 결과 CSV 저장</button><button type="button" data-clear>가져온 기록 지우기</button></div><p data-status role="status"></p><div class="aqh-stats" data-stats></div><div class="aqh-filters"><label>시작 날짜<input type="date" name="from"></label><label>종료 날짜<input type="date" name="to"></label><label>사이트<select name="site"><option value="">전체</option></select></label><label>카테고리<select name="category"><option value="">전체</option></select></label><label>질문 검색<input type="search" name="search" placeholder="질문·주제·사이트 검색"></label><label><span>근무시간 외만</span><input type="checkbox" name="outside"></label></div><div class="aqh-scroll"><table><thead><tr><th scope="col">시각 (한국)</th><th scope="col">사이트</th><th scope="col">카테고리</th><th scope="col">질문 / 주제</th></tr></thead><tbody></tbody></table></div><div class="aqh-pages"><button type="button" data-prev>이전</button><span data-page></span><button type="button" data-next>다음</button></div><details><summary>기록기 연결 안내</summary><p>기존 기록기에서 내보낸 CSV 또는 JSON을 가져오면 바로 볼 수 있습니다. 가져온 기록은 이 브라우저에 저장됩니다. Chrome과 Edge 기록은 별도로 가져와야 합니다.</p><p>자동 연결은 기존 기록기 확장에 연결 코드를 추가한 뒤 확장을 새로고침해야 합니다. <a href="../tools/ai-question-logger-bridge/README.md" target="_blank" rel="noopener">연결 방법</a></p><p>기록기가 주제 앞 80자만 저장했다면 저장된 주제까지만 표시됩니다. 근무시간 외 표시는 원본 기록의 판정을 사용합니다.</p></details>';
    host.querySelector('.aqh-filters').addEventListener('input',()=>{page=0;render();});
    host.querySelector('[data-connect]').onclick=connect;
    host.querySelector('[data-prev]').onclick=()=>{page--;render();};host.querySelector('[data-next]').onclick=()=>{page++;render();};
    host.querySelector('[type=file]').onchange=async event=>{
      const file=event.target.files[0], target=host;if(!file)return;
      try {
        if(file.size>30*1024*1024) throw new Error('30MB 이하의 파일을 선택하세요.');
        const content=await file.text();if(host!==target || !target.isConnected)return;
        const rows=normalize(file.name.toLowerCase().endsWith('.csv')?csvParse(content):JSON.parse(content.replace(/^\uFEFF/,'')));
        if(!rows.length) throw new Error('질문/주제 필드를 찾지 못했거나 빈 파일입니다. 기존 기록은 유지됩니다.');
        clearTimeout(timer);pending=null;live=false;accept(rows,'가져온 기록');
        try{localStorage.setItem(KEY,JSON.stringify(rows));status(rows.length+'건을 가져와 이 브라우저에 저장했습니다.');}catch{status(rows.length+'건을 표시했습니다. 브라우저 저장 공간이 부족해 새로고침하면 사라집니다.');}
      } catch(e){status('가져오기 실패: '+e.message);}finally{event.target.value='';}
    };
    host.querySelector('[data-clear]').onclick=()=>{try{localStorage.removeItem(KEY);}catch{} if(!live)accept([],'가져온 기록');status('대시보드에 가져온 사본을 지웠습니다. 확장 원본은 유지됩니다.');};
    host.querySelector('[data-export]').onclick=()=>{
      const cell=v=>'"'+String(v).replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
      const csv='\uFEFF'+[['timestamp','site','category','question','outsideWorkHours'],...filtered().map(r=>[r.timestamp,r.site,r.category,r.question,r.outside])].map(r=>r.map(cell).join(',')).join('\r\n');
      const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})), a=document.createElement('a');a.href=url;a.download='ai-question-history.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    };
    try{accept(JSON.parse(localStorage.getItem(KEY)||'[]'),'가져온 기록');}catch{accept([],'가져온 기록');}
    status('CSV/JSON 파일을 가져오거나 확장 연결 버튼을 누르세요.');
  }
  global.AIQuestionHistory={mount,normalize,csvParse};
})(window);

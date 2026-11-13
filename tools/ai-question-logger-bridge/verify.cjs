// Usage: node verify.cjs <path-to-playwright-module>
const {chromium}=require(process.argv[2] || 'playwright');
const http=require('node:http'), fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0])+(req.url.split('?')[0].endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data);});
});
(async()=>{
  const vm=require('node:vm'), os=require('node:os'), {execFileSync}=require('node:child_process');
  const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'aiq-bridge-test-'));
  const manifest={name:'AI 질문 기록기',manifest_version:3,permissions:['storage'],content_scripts:[{matches:['https://claude.ai/*'],js:['content.js']}]};
  fs.writeFileSync(path.join(fixture,'manifest.json'),JSON.stringify(manifest));
  execFileSync(process.execPath,[path.join(__dirname,'install.cjs'),fixture]);
  execFileSync(process.execPath,[path.join(__dirname,'install.cjs'),fixture]);
  const installed=JSON.parse(fs.readFileSync(path.join(fixture,'manifest.json')));
  assert.equal(installed.content_scripts.length,2);assert.deepEqual(installed.content_scripts[0],manifest.content_scripts[0]);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(fixture,'manifest.json.before-dashboard-bridge'))),manifest);
  let listener, response, reads=0;
  const location={origin:'https://gmpark-creator.github.io',pathname:'/project-dashboard/claude/',hash:'#/p/ai-question-logger'};
  const win={addEventListener:(name,fn)=>{listener=fn;},postMessage:data=>{response=data;}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'dashboard-bridge.js'),'utf8'),{location,window:win,chrome:{storage:{local:{get:async()=>{reads++;return {logs:[{topic:'실제 저장 형식',timestamp:1794529800000,ownerPhone:'PRIVATE'}],ownerPhone:'PRIVATE'};}}}}});
  await listener({source:win,origin:location.origin,data:{type:'GM_AIQ_REQUEST',requestId:'test'}});
  assert.equal(response.records[0].topic,'실제 저장 형식');assert.equal(JSON.stringify(response).includes('PRIVATE'),false);
  await listener({source:win,origin:'https://other.example',data:{type:'GM_AIQ_REQUEST',requestId:'bad'}});assert.equal(reads,1);
  location.hash='#/';await listener({source:win,origin:location.origin,data:{type:'GM_AIQ_REQUEST',requestId:'bad'}});assert.equal(reads,1);
  // Keep the tiny temporary fixture for inspection; no user data is used.
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url='http://127.0.0.1:'+server.address().port+'/claude/#/p/ai-question-logger';
    await page.goto(url);await page.locator('.aqh').waitFor();
    const records=Array.from({length:62},(_,i)=>({timestamp:'2026-11-13T'+(i%2?'20':'09')+':30:00+09:00',site:i%2?'Claude':'ChatGPT',category:'개발',topic:i===0?'<img src=x onerror="window.injected=true">':'질문 '+i,outsideWorkHours:!!(i%2)}));
    await page.locator('.aqh input[type=file]').setInputFiles({name:'logs.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({records}))});
    assert.match(await page.locator('[data-stats]').innerText(),/전체 62건/);
    assert.equal(await page.locator('.aqh tbody tr').count(),50);
    await page.locator('[data-next]').click();assert.equal(await page.locator('.aqh tbody tr').count(),12);
    await page.locator('[name=outside]').check();assert.equal(await page.locator('.aqh tbody tr').count(),31);
    await page.reload();await page.locator('.aqh').waitFor();assert.match(await page.locator('[data-stats]').innerText(),/근무시간 외 31건/);
    await page.locator('[name=search]').fill('<img');assert.equal(await page.locator('.aqh tbody img').count(),0);assert.equal(await page.evaluate(()=>window.injected),undefined);
    await page.locator('[name=search]').fill('');await page.locator('[name=site]').selectOption('Claude');assert.equal(await page.locator('.aqh tbody tr').count(),31);
    await page.locator('[name=from]').fill('2026-11-14');assert.match(await page.locator('.aqh tbody').innerText(),/조건에 맞는/);
    await page.locator('[name=from]').fill('');
    const [download]=await Promise.all([page.waitForEvent('download'),page.locator('[data-export]').click()]);assert.equal(download.suggestedFilename(),'ai-question-history.csv');
    const csv='\uFEFF날짜,시각,사이트,카테고리,주제,근무시간 외\r\n2026-11-12,20:01:00,Claude,개발,"쉼표, 질문\n두 번째 줄",true';
    await page.locator('.aqh input[type=file]').setInputFiles({name:'logs.csv',mimeType:'text/csv',buffer:Buffer.from(csv)});
    assert.match(await page.locator('.aqh tbody').innerText(),/쉼표, 질문/);assert.match(await page.locator('[data-stats]').innerText(),/전체 1건/);
    await page.locator('.aqh input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});assert.match(await page.locator('[data-status]').innerText(),/가져오기 실패/);assert.match(await page.locator('[data-stats]').innerText(),/전체 1건/);
    await page.evaluate(()=>window.addEventListener('message',e=>{if(e.data.type==='GM_AIQ_REQUEST')window.postMessage({type:'GM_AIQ_RESPONSE',requestId:e.data.requestId,records:[{question:'연결 확인',timestamp:'2026-11-13T10:00:00+09:00',site:'Claude'}]},location.origin);}));
    await page.locator('[data-connect]').click();await page.getByText('연결 확인',{exact:true}).waitFor();
    await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);
    const overflow=await page.locator('.aqh').evaluate(el=>({width:el.getBoundingClientRect().width,right:el.getBoundingClientRect().right,viewport:innerWidth}));
    assert.ok(overflow.right<=overflow.viewport,JSON.stringify(overflow));
    assert.deepEqual(errors,[]);
    console.log('PASS: JSON/CSV import, 50-row pagination, date/site/outside/search filters, persistence, XSS escaping, CSV export, invalid-file preservation, connection protocol, mobile layout.');
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});

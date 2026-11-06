// AGENT-GORGO-34/35 AIS 선박: 박사의 AIS Ship Tracker 선박들을 실제 AIS 위치(위도·경도)에 선박 모형으로 세운다.
// - 데이터: 이 PC 서버 /api/ais (AIS Ship Tracker 공개 API 중계, 60초 보관) → 2분마다 새로 받아 선박이 새 위치로 천천히 미끄러져 간다.
//   서버가 없을 때(대시보드 미리보기)는 data/ais-snapshot.json(저장 시각 표시). 지도를 옮겨 다닐 때는 직전 값을 sessionStorage로 이어받아 들어가자마자 보인다.
// - 모형: 선단별 양식(PANDA=컨테이너선, MAGE=유조선, OCEAN ACE=벌크선, KYOWA=자동차 운반선풍) — 선종은 AIS에 없어 선단으로 정한 양식이다.
// - G35(박사 2026-11-06): 모형은 작게. 대신 어느 확대에서도 선단 색 표지(화면 크기 고정)와 이름표(겹치면 숨김)로 현재 위치가 보인다.
// - 방향: 선수방향(heading), 없으면 침로(course). 속도가 있으면 항적(물결). 이 지도 범위 밖 선박은 「선박」 목록에만 나온다.
import * as THREE from 'three';

const FONT="'Noto Sans KR','Malgun Gothic',sans-serif";
const CSS=`.ships-open{position:absolute;left:22px;top:76px;z-index:6;border-radius:24px;background:#fffdf2;color:#36594d;padding:11px 18px;font-size:12px;font-weight:700;border:1px solid #e3dccb;cursor:pointer}.ships-open[hidden]{display:none}
@media(max-width:700px){.ships-open{left:14px;top:60px;padding:8px 12px;font-size:11px}}
.ships-dlg{border:0;border-radius:16px;padding:0;width:min(520px,calc(100vw - 24px));max-height:80vh;background:#fffdf6;color:#2f4c45;font-family:${FONT};box-shadow:0 20px 60px #23443840}.ships-dlg::backdrop{background:#23443855}
.ships-in{padding:18px 20px;display:flex;flex-direction:column;gap:8px;max-height:80vh}.ships-in h3{margin:0;font-size:17px}.ships-in .sub{font-size:12px;color:#7a877f;margin:0}
.ships-list{overflow:auto;border:1px solid #e3dccb;border-radius:10px;padding:0;margin:4px 0;list-style:none}.ships-list li.fleet{padding:6px 12px;background:#f3efe3;font-size:12px;font-weight:800;position:sticky;top:0}
.ships-list li.row{display:flex;gap:8px;align-items:center;padding:8px 12px;border-bottom:1px solid #f0eadc;font-size:12.5px}.ships-list li.row b{flex:1;min-width:0}.ships-list li.row small{color:#7a877f;white-space:nowrap}
.ships-list li.row button{border:1px solid #d8d0bd;background:#fff;border-radius:14px;padding:5px 10px;font:700 12px inherit;cursor:pointer;color:#2f4c45;white-space:nowrap}.ships-list li.row button:disabled{opacity:.45;cursor:default}
.ships-act{display:flex;justify-content:flex-end}.ships-act button{border:0;border-radius:16px;background:#2f4c45;color:#fffef4;padding:8px 18px;font:700 13px inherit;cursor:pointer}`;

const mats=new Map();const mat=(c,o={})=>{const k=c+JSON.stringify(o);if(!mats.has(k))mats.set(k,new THREE.MeshStandardMaterial({color:c,roughness:.78,...o}));return mats.get(k);};
const boxG=new THREE.BoxGeometry(1,1,1),cylG=new THREE.CylinderGeometry(1,1,1,14);
function box(p,w,h,d,x,y,z,c,o){const m=new THREE.Mesh(boxG,mat(c,o));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;}
function cyl(p,r,h,x,y,z,c,rot){const m=new THREE.Mesh(cylG,mat(c));m.scale.set(r,h,r);m.position.set(x,y,z);if(rot)m.rotation.z=Math.PI/2;m.castShadow=true;p.add(m);return m;}
const rnd=(i,s=0)=>{const n=Math.sin(i*127.1+s*311.7)*43758.5453;return n-Math.floor(n);};
const CONTAINERS=['#c9553d','#2f6fa3','#e0a63a','#3f8f6e','#8b5a9c','#d9d3c3','#b5483a','#4c8bb5'];

// 배 길이 1(선수 +z), 폭 .17. 선체 윤곽을 위에서 본 모양으로 만들어 위로 눌러 뽑는다.
function hullGeometry(h){const b=.085;
  // 모양의 y를 배 길이 방향으로 쓰고, 위로 눌러 뽑은 뒤 눕힌다(회전 후 +z = 선수)
  const sh=new THREE.Shape();sh.moveTo(-b,.5);sh.lineTo(b,.5);sh.lineTo(b,-.27);sh.quadraticCurveTo(b*.95,-.42,0,-.52);sh.quadraticCurveTo(-b*.95,-.42,-b,-.27);sh.lineTo(-b,.5);
  const g=new THREE.ExtrudeGeometry(sh,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,0,0);return g;}
function tower(p,z,color,tall=.15){box(p,.12,tall,.1,0,.06+.04+tall/2,z,'#f4f1e6');box(p,.125,.025,.105,0,.06+.04+tall*.62,z,'#27333b');box(p,.13,.012,.11,0,.06+.04+tall+.006,z,'#e8e3d3');cyl(p,.022,.07,.0,.06+.04+tall+.04,z-.02,color);}

export function makeShip(style,color){const g=new THREE.Group(),H=.06;
  const hull=new THREE.Mesh(hullGeometry(H),mat('#2f3b44'));hull.castShadow=true;g.add(hull);
  box(g,.18,.012,.77,0,H*.58,-.115,color,{roughness:.6}); // 선체 띠(선단 색)
  if(style==='container'){
    const rows=7;for(let r=0;r<rows;r++){const z=-.3+r*.086,hgt=1+Math.floor(rnd(r,1)*2);for(let c=-1;c<=1;c++)for(let k=0;k<hgt+1;k++){box(g,.05,.03,.074,c*.052,H+.015+k*.031,z,CONTAINERS[Math.floor(rnd(r*7+c+3,k)*CONTAINERS.length)]);}}
    tower(g,-.42,color);}
  else if(style==='tanker'){
    box(g,.15,.012,.74,0,H+.006,.02,'#9a8e7a');for(let i=0;i<5;i++)cyl(g,.05,.03,0,H+.026,-.28+i*.14,'#cfc7b4');
    cyl(g,.008,.74,-.045,H+.04,.02,'#d86a3d').rotation.x=Math.PI/2;cyl(g,.008,.74,.045,H+.04,.02,'#3f6fae').rotation.x=Math.PI/2;box(g,.05,.04,.05,0,H+.03,.43,'#e8e3d3');tower(g,-.42,color,.14);}
  else if(style==='bulk'){
    for(let i=0;i<5;i++)box(g,.14,.022,.1,0,H+.011,-.28+i*.14,'#b6aa8e');
    for(const z of[-.21,-.07,.07,.21]){box(g,.012,.09,.012,-.06,H+.055,z+.0,'#e0a63a');box(g,.012,.09,.012,.06,H+.055,z+.0,'#e0a63a');box(g,.13,.01,.01,0,H+.1,z,'#e0a63a');}
    tower(g,-.42,color,.15);}
  else{ // carrier: 높은 상자형 차체
    box(g,.165,.13,.76,0,H+.065,-.02,'#e9e4d4');box(g,.168,.02,.76,0,H+.09,-.02,color);box(g,.168,.012,.76,0,H+.14,-.02,'#d8d3c3');box(g,.11,.07,.09,0,H+.165,.32,'#f4f1e6');box(g,.112,.014,.092,0,H+.18,.32,'#27333b');cyl(g,.022,.06,0,H+.23,-.34,color);}
  g.userData.wake=(()=>{const c=document.createElement('canvas');c.width=64;c.height=256;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'rgba(255,255,255,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');
    x.fillStyle=gr;x.beginPath();x.moveTo(26,0);x.lineTo(38,0);x.lineTo(64,256);x.lineTo(0,256);x.closePath();x.fill();const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(.42,1.5),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,opacity:0}));m.rotation.x=-Math.PI/2;m.position.set(0,.004,-1.2);g.add(m);return m;})();
  return g;}

function labelTexture(text,sub,color){const c=document.createElement('canvas');c.width=512;c.height=sub?150:100;const x=c.getContext('2d');
  x.fillStyle='#2f4c45f2';x.beginPath();x.roundRect(0,0,512,c.height,28);x.fill();x.fillStyle=color;x.fillRect(0,0,16,c.height);x.fillStyle='#fffef4';x.textBaseline='middle';
  let fs=54;x.font=`800 ${fs}px ${FONT}`;while(x.measureText(text).width>440&&fs>28){fs-=3;x.font=`800 ${fs}px ${FONT}`;}x.fillText(text,36,sub?42:c.height/2);
  if(sub){x.font=`600 38px ${FONT}`;x.fillStyle='#d8e6df';x.fillText(sub,36,108);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return {t,ratio:c.width/c.height};}
// 위치 표지(HTML, 장소 이름표 위 레이어): 선단 색 원 + 흰 배 모양. 화면에서 늘 같은 크기. 옆에 이름표(겹치면 숨김). 누르면 그 배로 간다.
const MK_CSS=`.ship-layer{position:absolute;inset:0;pointer-events:none}
.ship-mk{position:absolute;left:0;top:0;display:flex;align-items:center;gap:5px;pointer-events:auto;cursor:pointer;background:none;border:0;padding:0;font-family:${FONT};transform:translate(-9999px,0);will-change:transform}
.ship-mk i{flex:none;width:var(--s);height:var(--s);border-radius:50%;background:var(--c);border:2px solid #fffef6;box-shadow:0 1px 5px #1d3a3466;display:grid;place-items:center}
.ship-mk i svg{width:62%;height:62%}.ship-mk.moving i{box-shadow:0 0 0 3px #ffffff88,0 1px 5px #1d3a3466}
.ship-mk span{background:#2f4c45ee;color:#fffef4;border-left:3px solid var(--c);border-radius:6px;padding:3px 7px 3px 6px;font-size:11px;font-weight:800;white-space:nowrap;line-height:1.25;box-shadow:0 2px 8px #1d3a3433}
.ship-mk span small{display:block;font-size:9.5px;font-weight:600;color:#d8e6df}.ship-mk.nolabel span{visibility:hidden}.ship-mk.big i{display:none}.ship-mk.off{display:none}
.ship-mk:focus-visible{outline:none}.ship-mk:focus-visible i,.ship-mk:focus-visible span{outline:3px solid #e8784e;outline-offset:2px}`;
const SHIP_SVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c3 2.6 4.6 5.6 4.6 9v10.2H7.4V11C7.4 7.6 9 4.6 12 2z" fill="#fffef4"/><rect x="9.6" y="12.6" width="4.8" height="4" rx=".6" fill="currentColor"/></svg>';
const ago=ms=>{if(!ms)return '';const m=Math.max(0,Math.round((Date.now()-ms)/60000));return m<60?m+'분 전':m<2880?Math.round(m/60)+'시간 전':Math.round(m/1440)+'일 전';};
const kn=s=>s.speedKnots==null?'':s.speedKnots<.5?'정박·정지':s.speedKnots.toFixed(1)+'노트';
const CACHE_KEY='gorgo.ais.v1';
function readCache(){try{const j=JSON.parse(sessionStorage.getItem(CACHE_KEY)||'null');return j&&Array.isArray(j.ships)&&Date.now()-j.cachedAt<30*60000?j:null;}catch{return null;}}
function writeCache(j){try{sessionStorage.setItem(CACHE_KEY,JSON.stringify({...j,cachedAt:Date.now()}));}catch{}}

// o = {scene, project(lon,lat)->Vector3, seaY, length, labelDist, camera, bounds:[w,s,e,n], focus(pos), toast, openWorld?(ship), scaleBy?, markerPx?}
export function initShips(o){
  const style=document.createElement('style');style.textContent=CSS+MK_CSS;document.head.append(style);
  const btn=document.createElement('button');btn.id='ships-open';btn.className='ships-open';btn.type='button';btn.hidden=true;document.body.append(btn);
  const dlg=document.createElement('dialog');dlg.id='ships-dialog';dlg.className='ships-dlg';dlg.innerHTML='<div class="ships-in"><h3>선박 (AIS Ship Tracker)</h3><p class="sub" id="ships-sub"></p><ul class="ships-list" id="ships-list"></ul><div class="ships-act"><button type="button" id="ships-close">닫기</button></div></div>';document.body.append(dlg);
  dlg.addEventListener('keydown',e=>e.stopPropagation());dlg.querySelector('#ships-close').onclick=()=>dlg.close();
  const group=new THREE.Group();group.name='ais-ships';o.scene.add(group);
  const layer=document.createElement('div');layer.className='ship-layer';layer.id='ship-layer';(document.getElementById('labels')||document.body).append(layer);
  const ships=new Map();let data=null,source='';
  const markerPx=o.markerPx||20;
  const inside=s=>s.lng>=o.bounds[0]&&s.lng<=o.bounds[2]&&s.lat>=o.bounds[1]&&s.lat<=o.bounds[3];
  const headingOf=s=>{const h=s.headingDeg!=null&&s.headingDeg<=360?s.headingDeg:(s.courseDeg!=null?s.courseDeg:0);return Math.PI-THREE.MathUtils.degToRad(h);}; // 북=0, 시계방향 → 지도(x동·z남)에서 선수 +z 기준 회전
  function place(s){const p=o.project(s.lng,s.lat);p.y=o.seaY;return p;}
  function makeMarker(e){const b=document.createElement('button');b.type='button';b.className='ship-mk nolabel';b.style.setProperty('--s',markerPx+'px');b.innerHTML='<i>'+SHIP_SVG+'</i><span><b></b><small></small></span>';
    b.addEventListener('pointerdown',ev=>ev.stopPropagation());b.addEventListener('click',ev=>{ev.stopPropagation();o.clearMovement?.();o.focus(e.mesh.position.clone());});layer.append(b);return b;}
  function sync(list){const seen=new Set();let shown=0;
    for(const s of list){seen.add(s.mmsi);let e=ships.get(s.mmsi);const here=inside(s);
      if(!e){const m=makeShip(s.style,s.color);m.scale.setScalar(o.length);e={mesh:m,phase:Math.random()*6,pos:null,data:s,labelKey:''};e.el=makeMarker(e);group.add(m);ships.set(s.mmsi,e);}
      e.data=s;e.mesh.visible=here;e.el.classList.toggle('off',!here);if(!here)continue;shown++;
      const t=place(s),r=headingOf(s);if(!e.pos){e.pos=t.clone();e.mesh.position.copy(t);e.mesh.rotation.y=r;}e.target=t;e.targetRot=r;
      const moving=(s.speedKnots||0)>1;e.mesh.userData.wake.userData.on=moving;e.el.classList.toggle('moving',moving);e.el.style.setProperty('--c',s.color);e.el.style.color=s.color;
      const key=s.name+'|'+kn(s);if(key!==e.labelKey){e.labelKey=key;e.el.querySelector('b').textContent=s.name;e.el.querySelector('small').textContent=kn(s);e.el.setAttribute('aria-label',s.name+' '+kn(s)+' — 이 배로 가기');}}
    for(const [k,e] of ships)if(!seen.has(k)){group.remove(e.mesh);e.el.remove();ships.delete(k);}
    return shown;}
  function paintButton(){const total=data?.ships?.length||0,shown=[...ships.values()].filter(e=>e.mesh.visible).length;btn.hidden=!total;btn.textContent='선박 '+shown+'/'+total+'척'+(source==='snapshot'?' · 저장본':'');btn.title=source==='snapshot'?'실시간 서버가 없어 저장본 위치 ('+new Date(data.fetchedAt).toLocaleString('ko-KR')+')':'';}
  function use(j,from){data=j;source=from;sync(j.ships);paintButton();window.__gorgoShips.count=j.ships.length;window.__gorgoShips.source=from;}
  async function load(){try{const r=await fetch('/api/ais',{cache:'no-store'});if(!r.ok)throw Error(String(r.status));const j=await r.json();if(!Array.isArray(j.ships))throw Error('shape');use(j,'live');writeCache(j);return;}catch{/* 설치형 서버가 없거나 일시 오류 */}
    if(source==='live'||source==='cache'||source==='test')return; // 이전 실시간 값 유지
    try{const r=await fetch('data/ais-snapshot.json',{cache:'no-store'});if(!r.ok)throw Error(String(r.status));const j=await r.json();if(Array.isArray(j.ships)&&!data)use(j,'snapshot');}catch{}}
  function openList(){const ul=dlg.querySelector('#ships-list');ul.replaceChildren();const list=[...(data?.ships||[])];const groups=new Map();for(const s of list){if(!groups.has(s.fleetLabel))groups.set(s.fleetLabel,[]);groups.get(s.fleetLabel).push(s);}
    dlg.querySelector('#ships-sub').textContent='AIS 위치 '+(data?.fetchedAt?new Date(data.fetchedAt).toLocaleString('ko-KR'):'')+' 기준 · '+(source==='snapshot'?'저장본(실시간 서버 없음) · ':data?.stale?'최신을 못 받아 이전 값 · ':'')+'이 지도 안 '+list.filter(inside).length+'척 / 전체 '+list.length+'척';
    for(const [f,arr] of groups){const h=document.createElement('li');h.className='fleet';h.textContent=f+' · '+arr.length+'척';ul.append(h);
      for(const s of arr){const li=document.createElement('li');li.className='row';const here=inside(s);const b=document.createElement('b');b.textContent=s.name;const sm=document.createElement('small');sm.textContent=[kn(s),ago(s.updatedAt)].filter(Boolean).join(' · ');
        const go=document.createElement('button');go.type='button';go.textContent=here?'지도에서 보기':(o.openWorld?'세계 지도에서 보기':'이 지도 밖');go.disabled=!here&&!o.openWorld;
        go.onclick=()=>{dlg.close();if(here){const e=ships.get(s.mmsi);if(e)o.focus(e.mesh.position.clone());}else o.openWorld?.(s);};li.append(b,sm,go);ul.append(li);}}
    dlg.showModal();}
  btn.onclick=()=>{o.clearMovement?.();openList();};
  window.__gorgoShips={count:0,source:'',ships:()=>[...ships.entries()].map(([m,e])=>({mmsi:m,name:e.data.name,visible:e.mesh.visible,pos:e.mesh.position.toArray(),rot:e.mesh.rotation.y,style:e.data.style,lat:e.data.lat,lng:e.data.lng,scale:e.mesh.scale.x,
    marker:e.mesh.visible&&!e.el.classList.contains('big'),label:!e.el.classList.contains('nolabel'),screen:e.screen||null})),reload:load,open:openList,group,layer,setData:d=>use(d,'test')};
  const cached=readCache();if(cached)use(cached,'cache'); // 다른 지도에서 넘어올 때: 들어가자마자 같은 위치에 보인다
  load();setInterval(load,120000);
  const v=new THREE.Vector3(),placed=[];let frame=0;
  return {update(dt,t){const cam=o.camera,H=Math.max(1,innerHeight),W=Math.max(1,innerWidth),pxw=2*Math.tan(THREE.MathUtils.degToRad(cam.fov/2))/H; // 화면 1px의 월드 크기(거리 1 기준)
      const declutter=(frame++%3)===0,cand=[];
      for(const e of ships.values()){if(!e.mesh.visible||!e.target)continue;
        const k=Math.min(1,dt*.8);e.mesh.position.x+=(e.target.x-e.mesh.position.x)*k;e.mesh.position.z+=(e.target.z-e.mesh.position.z)*k;
        let dr=e.targetRot-e.mesh.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));e.mesh.rotation.y+=dr*Math.min(1,dt*2);
        const dd=Math.max(.001,cam.position.distanceTo(e.mesh.position)),Ls=o.scaleBy?Math.min(o.scaleBy.max,Math.max(o.scaleBy.min,dd*o.scaleBy.k)):o.length;
        if(o.scaleBy&&Math.abs(e.mesh.scale.x-Ls)>.001)e.mesh.scale.setScalar(Ls);
        e.mesh.position.y=o.seaY+Math.sin(t*1.3+e.phase)*Ls*.006;e.mesh.rotation.z=Math.sin(t*.9+e.phase)*.012;
        const w=e.mesh.userData.wake;w.material.opacity+=((w.userData.on?.55:0)-w.material.opacity)*Math.min(1,dt*2);
        // 화면에서 배 길이(px)가 표지보다 충분히 크면 표지 원은 숨기고 이름표를 모형 위에 단다.
        const big=Ls/(dd*pxw)>markerPx*2.4;v.set(e.mesh.position.x,o.seaY+(big?Ls*.3:0),e.mesh.position.z).project(cam);
        const on=v.z<1&&Math.abs(v.x)<1.1&&Math.abs(v.y)<1.1,sx=(v.x+1)/2*W,sy=(1-v.y)/2*H;e.screen=on?[Math.round(sx),Math.round(sy)]:null;
        e.el.classList.toggle('big',big);
        if(!on){e.el.style.transform='translate(-9999px,0)';continue;}
        const ox=big?-(e.sw||80)/2:-markerPx/2-2,oy=big?-34:-markerPx/2-2;e.el.style.transform=`translate(${(sx+ox).toFixed(1)}px,${(sy+oy).toFixed(1)}px)`;
        if(declutter)cand.push({e,sx,sy,big,d:dd,pr:(big?2:0)+((e.data.speedKnots||0)>1?1:0)});}
      if(declutter){placed.length=0;
        // 장소 이름표(HTML)가 먼저다. 선박 이름표는 그 자리와 겹치거나 서로 겹치면 숨긴다(표지 원은 남는다).
        for(const el of document.querySelectorAll('#labels > .map-label')){if(el.style.display==='none')continue;const b=el.getBoundingClientRect();if(b.width)placed.push({l:b.left,r:b.right,t:b.top,b:b.bottom});}
        cand.sort((a,b)=>b.pr-a.pr||a.d-b.d);
        for(const c of cand){const el=c.e.el,span=el.querySelector('span');c.e.sw=span.offsetWidth;
          const lw=c.e.sw||80,lh=span.offsetHeight||26,r=c.big?{l:c.sx-lw/2-3,r:c.sx+lw/2+3,t:c.sy-34-3,b:c.sy-34+lh+3}:{l:c.sx+markerPx/2+3,r:c.sx+markerPx/2+7+lw,t:c.sy-lh/2-3,b:c.sy+lh/2+3};
          const hit=c.d>o.labelDist||placed.some(p=>r.l<p.r&&r.r>p.l&&r.t<p.b&&r.b>p.t);el.classList.toggle('nolabel',hit);if(!hit)placed.push(r);}}
    }};
}

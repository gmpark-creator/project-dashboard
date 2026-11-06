// 세계 지도 (index.html?map=world) — 한반도 지도와 같은 미니어처 화풍으로 지구 전체를 펼친다. 1 단위 = 5°(적도에서 약 550km).
// 지형: data/world-terrain.bin (Mapzen/AWS Terrarium zoom 4를 0.5° 격자로 한 번 뽑은 것, tools/prepare_world.py). 바다는 음수 수심.
// 이동: 육지 위만 걷는다(바다 불가). 대륙·바다를 건너려면 핀을 눌러 비행기로 간다. 한반도·부산은 핀에서 들어가 이어진다.
// 선박: AIS Ship Tracker 선박이 실제 위치에 모두 서 있다(ships.js). 지도 안 어디든 「선박」 목록에서 바로 가 볼 수 있다.
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { initAiUI } from './ai-ui.js';
import { initShips } from './ships.js';
import { makePerson } from './people.js';
import { addClouds } from './clouds.js';

const $=id=>document.getElementById(id);
const clamp=THREE.MathUtils.clamp;
const DEG=5,MAX_DT=.5,EDGE=.3;
const state={ready:false,follow:true,selected:null,map:'world',frames:0,elapsed:0,speedMode:'normal'};
try{if(localStorage.getItem('gorgo.speedMode')==='fast')state.speedMode='fast';}catch{}
let scene,camera,renderer,controls,terrain,meta,heights,nx,nz,W,D,agent,legs=[],arms=[],plane,targetMark,ride=null,flight=null,last=0,gait=0,toastTimer,moveTarget=null,shipsLayer=null,cloudLayer=null;
const keys=new Set(),labelItems=[],places={},clock=new THREE.Clock(),inputLog=[];
const KEYS={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'shift',ShiftRight:'shift'};
const rand=(x,z,s=0)=>{const n=Math.sin(x*127.1+z*311.7+s*73.1)*43758.5453;return n-Math.floor(n);};
const project=(lon,lat)=>new THREE.Vector3(lon/DEG,0,-lat/DEG);
function toast(m){$('toast').textContent=m;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3300);}
// 해발(m): 격자 쌍선형 보간. 지도 밖은 깊은 바다.
function elevation(x,z){const lon=x*DEG,lat=-z*DEG;if(lon<-180||lon>180||lat>85||lat<-85)return -4000;const u=(lon+180)/360*nx,v=(85-lat)/170*nz,i=Math.min(nx-1,Math.floor(u)),j=Math.min(nz-1,Math.floor(v)),fu=u-i,fv=v-j,s=nx+1;
  const a=heights[j*s+i],b=heights[j*s+i+1],c=heights[(j+1)*s+i],d=heights[(j+1)*s+i+1];return (a*(1-fu)+b*fu)*(1-fv)+(c*(1-fu)+d*fu)*fv;}
const onLand=(x,z)=>elevation(x,z)>0;
const H=h=>h<=0?-.04:.04+Math.min(h,1500)*.00028+Math.max(0,h-1500)*.00011; // G35: 고산(히말라야 등)이 벽처럼 서지 않게 1500m 위는 낮춰 쌓는다
const groundHeight=(x,z)=>H(elevation(x,z));
function nearestLand(x,z,r=3){if(onLand(x,z))return new THREE.Vector3(x,0,z);for(let k=1;k<=r*10;k++){const d=k*.1;for(let a=0;a<16;a++){const t=a/16*Math.PI*2,px=x+Math.cos(t)*d,pz=z+Math.sin(t)*d;if(onLand(px,pz))return new THREE.Vector3(px,0,pz);}}return new THREE.Vector3(x,0,z);}

// ── 지형 ─────────────────────────────────────────────
function makeTerrain(){
  const geo=new THREE.PlaneGeometry(W,D,nx,nz);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,colors=new Float32Array(p.count*3),s=nx+1;
  // 바다까지의 거리(칸) — 내륙일수록 건조 지대 색을 더한다
  const dist=new Int16Array(heights.length).fill(-1),q=new Int32Array(heights.length);let qh=0,qt=0;for(let i=0;i<heights.length;i++)if(heights[i]<=0){dist[i]=0;q[qt++]=i;}
  while(qh<qt){const i=q[qh++],d=dist[i],x=i%s,y=(i/s)|0;if(d>=40)continue;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<0||X>=s||Y<0||Y>=nz+1)continue;const k=Y*s+X;if(dist[k]<0){dist[k]=d+1;q[qt++]=k;}}}
  const C=n=>new THREE.Color(n),green=C('#8eaf72'),dark=C('#5f9a68'),tan=C('#d9c18f'),sand=C('#e9d5a6'),rock=C('#8f9a8a'),snow=C('#f2f6f5'),tundra=C('#b7c3a0'),shallow=C('#9fd6cf'),deep=C('#6fb0b6'),c=new THREE.Color();
  const ss=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  for(let i=0;i<p.count;i++){const h=heights[i],lat=85-((i/s)|0)/nz*170,lon=-180+(i%s)/nx*360,al=Math.abs(lat);
    if(h<=0){c.copy(shallow).lerp(deep,clamp(-h/4500,0,1));p.setY(i,-.04);}
    else{const d=dist[i],arid=clamp(d/26,0,1)*Math.max(0,1-Math.abs(al-26)/15),rain=al<11?clamp(1-al/11,0,1)*(d>2?1:.4):0;
      c.copy(green).lerp(tundra,ss(52,68,al)).lerp(tan,arid*.85).lerp(dark,rain*.55);if(h<12)c.lerp(sand,.5);
      if(h>1400)c.lerp(rock,clamp((h-1400)/1800,0,1)*.9);
      const ice=al>69||(al>62&&lon>-60&&lon<-15&&h>700)||(h>3800)||(h>2500&&al>42)?1:ss(64,72,al);c.lerp(snow,clamp(ice,0,1));p.setY(i,H(h));}
    c.multiplyScalar(.97+rand(p.getX(i),p.getZ(i))*.045);colors.set([c.r,c.g,c.b],i*3);}
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.computeVertexNormals();
  terrain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0}));scene.add(terrain);
  // 바다 반짝임
  const gl=[];for(let i=0;i<5200;i++){const x=(rand(i,1)-.5)*W,z=(rand(i,2)-.5)*D;if(elevation(x,z)>0)continue;const l=.18+rand(i,3)*.35;gl.push(x,-.03,z,x+l,-.03,z);}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(gl,3));scene.add(new THREE.LineSegments(gg,new THREE.LineBasicMaterial({color:'#dff3ee',transparent:true,opacity:.5})));
  // 산림: 낮은 원뿔 나무
  const specs=[];for(let i=0;i<60000&&specs.length<26000;i++){const x=(rand(i,11)-.5)*W,z=(rand(i,12)-.5)*D,h=elevation(x,z),lat=Math.abs(z*DEG);if(h<40||h>2400||lat>64||rand(x,z,14)>.55)continue;const lon=x*DEG;
    const row=Math.round((85+z*DEG)/170*nz),colI=Math.round((lon+180)/360*nx),k=clamp(row,0,nz)*s+clamp(colI,0,nx);const d=dist[k],arid=clamp(d/26,0,1)*Math.max(0,1-Math.abs(lat-26)/15);if(arid>.5)continue;specs.push({x,z,y:H(h),s:.06+rand(x,z,15)*.06});}
  const trees=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5),new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.9}),specs.length),dm=new THREE.Object3D(),col=new THREE.Color();
  specs.forEach((t,i)=>{dm.position.set(t.x,t.y+t.s*.6,t.z);dm.scale.set(t.s*.6,t.s*1.6,t.s*.6);dm.rotation.set(0,rand(t.x,t.z)*6.28,0);dm.updateMatrix();trees.setMatrixAt(i,dm.matrix);trees.setColorAt(i,col.set(['#699568','#79a371','#85ab75','#5e8e68'][i%4]));});scene.add(trees);state.trees=specs.length;
  cloudLayer=addClouds(scene,{width:W,depth:D,count:52,y:2.6,size:1.1,opacity:.85,camera,fadeNear:6,fadeFar:26});
}
// ── 사람·비행기 ───────────────────────────────────────
function makeAgent(){agent=makePerson({});agent.userData.baseScale=agent.scale.x;legs=agent.userData.legs;arms=agent.userData.arms;scene.add(agent);}
function buildPlane(){const g=new THREE.Group(),m=(c,o={})=>new THREE.MeshStandardMaterial({color:c,roughness:.6,...o});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.9,14),m('#f4f1e6'));body.rotation.x=Math.PI/2;g.add(body);const nose=new THREE.Mesh(new THREE.SphereGeometry(.09,14,10),m('#f4f1e6'));nose.position.z=.45;nose.scale.z=1.4;g.add(nose);
  const tail=new THREE.Mesh(new THREE.ConeGeometry(.09,.3,14),m('#f4f1e6'));tail.rotation.x=-Math.PI/2;tail.position.z=-.58;g.add(tail);
  const wing=new THREE.Mesh(new THREE.BoxGeometry(1.0,.02,.22),m('#e8784e'));wing.position.set(0,-.01,.02);wing.rotation.y=0;g.add(wing);const tw=new THREE.Mesh(new THREE.BoxGeometry(.4,.02,.12),m('#e8784e'));tw.position.set(0,0,-.5);g.add(tw);
  const fin=new THREE.Mesh(new THREE.BoxGeometry(.02,.2,.14),m('#2f4c45'));fin.position.set(0,.12,-.52);g.add(fin);const stripe=new THREE.Mesh(new THREE.BoxGeometry(.182,.03,.5),m('#2f4c45'));stripe.position.set(0,.02,0);g.add(stripe);
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.4,20),new THREE.MeshBasicMaterial({color:'#2f5f58',transparent:true,opacity:.25,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.name='shadow';g.add(shadow);g.visible=false;return g;}
// ── 라벨 ─────────────────────────────────────────────
function addLabel(text,lon,lat,kind='',id=null,lift=.25){const el=document.createElement(id?'button':'div');el.className='map-label '+kind;el.textContent=text;if(id){el.dataset.place=id;el.addEventListener('click',()=>rideTo(id));}$('labels').appendChild(el);const p=project(lon,lat);p.y=Math.max(.06,groundHeight(p.x,p.z))+lift;labelItems.push({el,p,kind});return el;}
const tmp=new THREE.Vector3();
function updateLabels(){const dist=camera.position.distanceTo(controls.target);const vis=[];
  for(const l of labelItems){tmp.copy(l.p).project(camera);const off=tmp.z>1||Math.abs(tmp.x)>1.1||Math.abs(tmp.y)>1.1;const hide=off||(l.kind==='water'&&dist<30)||(l.kind==='continent'&&dist<45)||(l.kind==='pin'&&!l.major&&dist>70)||(l.kind==='pin'&&dist>150);l.el.style.display=hide?'none':'';if(hide)continue;l.x=(tmp.x*.5+.5)*innerWidth;l.y=(-tmp.y*.5+.5)*innerHeight;l.el.style.left=l.x+'px';l.el.style.top=l.y+'px';vis.push(l);}
  // 겹치는 라벨은 중요한 것(큰 도시·핀)부터 남기고 숨긴다
  const rank=l=>l.kind==='pin'?(l.major?0:1):l.kind==='water'?2:3,placed=[];vis.sort((a,b)=>rank(a)-rank(b));
  for(const l of vis){const w=l.el.offsetWidth+6,h=l.el.offsetHeight+4,b={x:l.x-w/2,y:l.y-h/2,w,h};if(placed.some(o=>b.x<o.x+o.w&&b.x+b.w>o.x&&b.y<o.y+o.h&&b.y+b.h>o.y))l.el.style.display='none';else placed.push(b);}}
// ── 이동 ─────────────────────────────────────────────
const blocked=()=>!!document.querySelector('dialog[open]')||window.__gorgoInteriorOpen;
function clearMovement(){keys.clear();moveTarget=null;if(targetMark)targetMark.visible=false;}
function flyTo(target,distance=30,keepFollow=false,duration=1.5){state.follow=keepFollow;flight={start:clock.getElapsedTime(),from:camera.position.clone(),to:target.clone().add(new THREE.Vector3(distance*.14,distance*.72,distance*.76)),fromTarget:controls.target.clone(),toTarget:target.clone(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?.05:duration};}
function stepFlight(t){const f=flight,k=clamp((t-f.start)/f.duration,0,1),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;camera.position.lerpVectors(f.from,f.to,e);controls.target.lerpVectors(f.fromTarget,f.toTarget,e);if(k>=1)flight=null;}
function speedMul(){return state.speedMode==='fast'?3:1;}
function updateAgent(dt){let x=0,z=0;if(keys.has('up'))z--;if(keys.has('down'))z++;if(keys.has('left'))x--;if(keys.has('right'))x++;if(x||z)moveTarget=null;
  const to=moveTarget?new THREE.Vector3(moveTarget.x-agent.position.x,0,moveTarget.z-agent.position.z):null;if(to&&to.length()<.03){moveTarget=null;}targetMark.visible=!!moveTarget;
  const moving=(!!(x||z)||!!moveTarget)&&!blocked()&&!ride;
  if(moving){let v,speed;if(moveTarget){const d=to.length();v=to.normalize();speed=Math.min(d,Math.max(2.2,Math.min(8,d*1.4))*speedMul()*dt);}
    else{const dir=new THREE.Vector3();camera.getWorldDirection(dir);dir.y=0;dir.normalize();const right=new THREE.Vector3().crossVectors(dir,new THREE.Vector3(0,1,0));v=right.multiplyScalar(x).addScaledVector(dir,-z).normalize();speed=(keys.has('shift')?7:3.6)*speedMul()*dt;}
    // 육지만: 막히면 해안을 따라 미끄러진다(바다 한가운데 있으면 자유롭게 빠져나온다)
    const cx=agent.position.x,cz=agent.position.z,nxp=clamp(cx+v.x*speed,-W/2+EDGE,W/2-EDGE),nzp=clamp(cz+v.z*speed,-D/2+EDGE,D/2-EDGE),ok=(a,b)=>onLand(a,b),stuck=!ok(cx,cz);
    let px=cx,pz=cz,moved=true;if(stuck||ok(nxp,nzp)){px=nxp;pz=nzp;}
    else{moved=false;for(const a of[.35,-.35,.7,-.7,1.05,-1.05,1.4,-1.4]){const c=Math.cos(a),s=Math.sin(a),f=speed*c*1.05,tx=clamp(cx+(v.x*c-v.z*s)*f,-W/2+EDGE,W/2-EDGE),tz=clamp(cz+(v.x*s+v.z*c)*f,-D/2+EDGE,D/2-EDGE);if(ok(tx,tz)){px=tx;pz=tz;moved=true;break;}}} // G35: 해안 방향으로 미끄러짐
    if(!moved&&moveTarget){moveTarget=null;toast('바다 위로는 갈 수 없어요 · 핀을 눌러 비행기로 가세요');}
    agent.position.x=px;agent.position.z=pz;agent.position.y+=(Math.max(.06,groundHeight(px,pz))+.02-agent.position.y)*Math.min(1,dt*6);agent.rotation.y=Math.atan2(v.x,v.z);gait+=dt*9;
    if(!state.follow){state.follow=true;if(camera.position.distanceTo(controls.target)>60)flyTo(agent.position.clone(),20,true);else flight=null;}}
  const sw=moving?Math.sin(gait)*.55:0;legs[0].rotation.x=sw;legs[1].rotation.x=-sw;arms[0].rotation.x=-sw;arms[1].rotation.x=sw;agent.userData.body.position.y=moving?Math.abs(Math.sin(gait))*.015:Math.sin(clock.elapsedTime*2)*.006;
  // 화면 크기에 맞춰 고르고 크기: 멀리서도 보이고 가까이서는 작게
  const d=camera.position.distanceTo(controls.target);agent.scale.setScalar(agent.userData.baseScale*clamp(d/34,.16,1.5));
  if(state.follow&&!flight&&!ride){const delta=agent.position.clone().sub(controls.target);controls.target.addScaledVector(delta,Math.min(1,dt*6));camera.position.addScaledVector(delta,Math.min(1,dt*6));}}
// 핀을 누르면 비행기로 간다(대륙·바다 건너기)
function rideTo(id){if($('travel-dialog').open)$('travel-dialog').close();const p=places[id];if(!p||ride)return;clearMovement();const t=nearestLand(p.x,p.z),from=agent.position.clone();const d=from.distanceTo(t);if(d<.5){agent.position.copy(t).setY(groundHeight(t.x,t.z)+.02);flyTo(t,18,true);toast(p.name+' 도착');if(p.enter==='korea')setTimeout(enterKorea,900);return;}
  ride={id,from,to:t,start:clock.getElapsedTime(),dur:clamp(d/(9*speedMul()),2.2,9),enter:p.enter};agent.visible=false;plane.visible=true;state.selected=id;state.follow=true;flight=null;toast(p.name+'(으)로 비행 중');}
function stepRide(){const r=ride,t=clamp((clock.getElapsedTime()-r.start)/r.dur,0,1),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;const px=THREE.MathUtils.lerp(r.from.x,r.to.x,e),pz=THREE.MathUtils.lerp(r.from.z,r.to.z,e),arc=Math.sin(Math.PI*e)*Math.min(3.2,r.from.distanceTo(r.to)*.12);
  const y=1.1+arc;plane.position.set(px,y,pz);const dx=r.to.x-r.from.x,dz=r.to.z-r.from.z;plane.rotation.y=Math.atan2(dx,dz);plane.rotation.x=-Math.cos(Math.PI*e)*.18*Math.sign(1);const sh=plane.getObjectByName('shadow');sh.position.set(0,-(y-groundHeight(px,pz))+.02,0);
  const sc=clamp(camera.position.distanceTo(controls.target)/20,.5,3);plane.scale.setScalar(sc);
  const delta=new THREE.Vector3(px,0,pz).sub(controls.target.clone().setY(0));controls.target.x+=delta.x*.12;controls.target.z+=delta.z*.12;camera.position.x+=delta.x*.12;camera.position.z+=delta.z*.12;
  if(t>=1){agent.position.set(r.to.x,groundHeight(r.to.x,r.to.z)+.02,r.to.z);agent.visible=true;plane.visible=false;const id=r.id,en=r.enter;ride=null;state.follow=true;flyTo(agent.position.clone(),18,true,1.2);toast(places[id].name+' 도착');if(en==='korea')setTimeout(enterKorea,1100);}}
function enterKorea(){clearMovement();const url='./';if(window.GorgoHandoff)window.GorgoHandoff.leave(renderer.domElement,'korea',url);else location.href=url;}
function walkToScreen(cx,cy){if(blocked()||ride)return false;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);const pl=new THREE.Plane(new THREE.Vector3(0,1,0),0),hit=new THREE.Vector3();if(!ray.ray.intersectPlane(pl,hit))return false;
  hit.x=clamp(hit.x,-W/2+EDGE,W/2-EDGE);hit.z=clamp(hit.z,-D/2+EDGE,D/2-EDGE);if(!onLand(hit.x,hit.z)){toast('바다 위로는 갈 수 없어요 · 핀을 눌러 비행기로 가세요');return false;}
  moveTarget=hit.clone();targetMark.position.set(hit.x,groundHeight(hit.x,hit.z)+.03,hit.z);state.follow=true;flight=null;return true;}
function setupEvents(){
  addEventListener('keydown',e=>{inputLog.push({code:e.code});if(blocked()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const k=KEYS[e.code];if(k){e.preventDefault();keys.add(k);moveTarget=null;}});
  addEventListener('keyup',e=>{const k=KEYS[e.code];if(k)keys.delete(k);});addEventListener('blur',()=>keys.clear());
  const el=renderer.domElement,downs=new Map();el.addEventListener('pointerdown',e=>downs.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now()}));
  el.addEventListener('pointerup',e=>{const d=downs.get(e.pointerId);downs.delete(e.pointerId);if(!d||Math.hypot(e.clientX-d.x,e.clientY-d.y)>6||performance.now()-d.t>450)return;walkToScreen(e.clientX,e.clientY);});el.addEventListener('pointercancel',e=>downs.delete(e.pointerId));
  controls.addEventListener('start',()=>{flight=null;state.follow=false;});addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
  const list=document.querySelector('#travel-dialog .travel-list');list.replaceChildren();
  const kr=document.createElement('button');kr.className='travel-home travel-switch';kr.innerHTML='<b>한반도 지도로 들어가기</b><small>부산·업무 장소로 이어집니다</small>';kr.onclick=()=>rideTo('korea');list.append(kr);
  for(const p of Object.values(places)){if(p.id==='korea')continue;const b=document.createElement('button');b.dataset.travel=p.id;b.innerHTML='<b></b><small></small>';b.querySelector('b').textContent=p.name;b.querySelector('small').textContent=p.region||'';b.onclick=()=>rideTo(p.id);list.append(b);}
  const home=document.createElement('button');home.className='travel-home';home.innerHTML='<b>세계 전체 보기</b><small>지도 처음 화면</small>';home.onclick=()=>{$('travel-dialog').close();homeView();};list.append(home);
  document.querySelector('#travel-title').textContent='어디로 갈까요? · 세계';$('travel-open').onclick=()=>{clearMovement();$('travel-dialog').showModal();};$('travel-close').onclick=()=>$('travel-dialog').close();
  $('map-switch').textContent='한반도 지도로';$('map-switch').setAttribute('aria-label','한반도 지도로 전환');$('map-switch').onclick=()=>enterKorea();
  const sp=$('speed-mode');const paint=()=>{sp.setAttribute('aria-pressed',String(state.speedMode==='fast'));sp.textContent=state.speedMode==='fast'?'속도 3×':'속도 1×';};paint();sp.onclick=()=>{state.speedMode=state.speedMode==='fast'?'normal':'fast';try{localStorage.setItem('gorgo.speedMode',state.speedMode);}catch{}paint();};
  for(const id of['work-open','sync-dot'])$(id)&&($(id).hidden=true);document.querySelector('.drop-guide')?.remove();}
function homeView(){state.follow=false;flyTo(new THREE.Vector3(0,0,1),64,false,1.8);}
function animate(now){requestAnimationFrame(animate);if(window.__gorgoInteriorOpen){last=now;return;}const dt=Math.min(MAX_DT,Math.max(0,(now-last)/1000||.016));last=now;const t=clock.getElapsedTime();
  if(flight)stepFlight(t);if(ride)stepRide();cloudLayer?.update(dt);
  shipsLayer?.update(dt,t);updateAgent(dt);controls.update();updateLabels();renderer.render(scene,camera);state.frames++;state.elapsed=t;
  if(!state.firstFrame){state.firstFrame=true;requestAnimationFrame(()=>window.GorgoHandoff?.finish());}}

export async function initWorld(){
  try{document.title='에이전트 고르고의 모험 · 세계';document.body.classList.add('map-korea','map-world');
    const css=document.createElement('link');css.rel='stylesheet';css.href='korea.css';document.head.append(css);
    const load=async(u,bin)=>{const r=await fetch(u);if(!r.ok)throw Error(u+' '+r.status);return bin?r.arrayBuffer():r.json();};
    const [m,hb,pl]=await Promise.all([load('data/world-meta.json'),load('data/world-terrain.bin',1),load('data/world-places.json')]);
    meta=m;nx=m.nx;nz=m.nz;heights=new Int16Array(hb);if(heights.length!==(nx+1)*(nz+1))throw Error('World terrain size mismatch');W=360/DEG;D=170/DEG;
    $('loading-status').textContent='세계 지도를 준비하는 중';
    scene=new THREE.Scene();scene.background=new THREE.Color('#b3d3cb');scene.fog=new THREE.Fog('#b3d3cb',170,420);
    camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,700);
    renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.23;$('scene').appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight('#fff5dc','#7daba0',2.5));const sun=new THREE.DirectionalLight('#ffedcc',3.0);sun.position.set(-60,120,64);scene.add(sun);
    controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=3;controls.maxDistance=140;controls.maxPolarAngle=Math.PI*.46;controls.minPolarAngle=.015;controls.screenSpacePanning=false;controls.maxTargetRadius=Math.hypot(W,D)/2+5;
    makeTerrain();
    for(const p of pl.places){const v=project(p.lon,p.lat);places[p.id]={...p,x:v.x,z:v.z};}
    for(const o of pl.oceans)addLabel(o.name,o.lon,o.lat,'water',null,.1);for(const c of pl.continents)addLabel(c.name,c.lon,c.lat,'continent',null,.4);
    for(const p of Object.values(places)){const el=addLabel(p.name,p.lon,p.lat,'pin',p.id,.3);labelItems[labelItems.length-1].major=!!p.major;if(p.major)el.classList.add('major');}
    makeAgent();const start=nearestLand(places.busan.x,places.busan.z);agent.position.set(start.x,groundHeight(start.x,start.z)+.02,start.z);
    plane=buildPlane();scene.add(plane);targetMark=new THREE.Mesh(new THREE.RingGeometry(.1,.16,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:'#ff7a45',transparent:true,opacity:.85,depthTest:false}));targetMark.renderOrder=11;targetMark.visible=false;scene.add(targetMark);
    setupEvents();initAiUI({clearMovement,toast});
    const d0=state.firstFlyDist=70;controls.target.copy(agent.position);camera.position.copy(agent.position).add(new THREE.Vector3(d0*.14,d0*.72,d0*.76));controls.update();state.follow=true;
    state.ready=true;window.__gorgoEarth={map:'world',state,places,agent,camera,controls,project,elevation,onLand,groundHeight,rideTo,riding:()=>!!ride,inputLog,flyTo,homeView,terrain,extent:()=>({hw:W/2,hd:D/2}),nearestLand,walkToScreen,enterKorea};
    shipsLayer=initShips({scene,project,seaY:-.03,length:.5,scaleBy:{min:.05,max:.6,k:.011},labelDist:90,markerPx:15,camera,bounds:[-180,-85,180,85],focus:p=>flyTo(p,16,false),clearMovement,toast});window.__gorgoEarth.ships=shipsLayer;
    // ?ship=MMSI — 다른 지도의 「세계 지도에서 보기」로 들어오면 그 선박으로 바로 간다
    const want=new URLSearchParams(location.search).get('ship');if(want){let tries=0;const go=()=>{const s=window.__gorgoShips?.ships().find(x=>x.mmsi===want&&x.visible);if(s){state.follow=false;flyTo(new THREE.Vector3(...s.pos),14,false,1.6);toast(s.name+' 위치');}else if(++tries<40)setTimeout(go,300);};setTimeout(go,900);}
    $('loading').classList.add('done');last=performance.now();requestAnimationFrame(animate);toast('세계 지도 · 핀을 누르면 비행기로 · 육지는 걸어서');
  }catch(error){console.error(error);$('loading-status').textContent='세계 지도를 불러오지 못했어요. 새로고침해 주세요. ('+error.message+')';$('loading').dataset.error=error.message;}
}

// AGENT-GORGO-20 건물 내부: 장소에 들어가면 고르고가 그 건물 안(로비)으로 들어가는 화면으로 전환된다.
// 1단계 = 공통 기본 로비 1종(디오라마식 단면 방). 이후 장소별 모습(theme)으로 다듬는다.
// 콘텐츠 = 벽 앞 안내 키오스크(화면에 제목만), 자료 = 자료함 캐비닛, 나가기 = 왼쪽 벽 출입문.
// 지도 화면과 별개의 캔버스·렌더러를 쓰고, 열려 있는 동안 지도는 그리지 않는다(window.__gorgoInteriorOpen).
import * as THREE from 'three';
import {makePerson} from './people.js';
import {themeOf,floorTexture,rugTexture,viewTexture,decorate} from './rooms.js';
import './rooms-places.js';

const W=10,D=7,WALL=3.4; // 방 폭(x), 깊이(z), 벽 높이 — 1단위 ≈ 1m
const FONT="'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',sans-serif";
let renderer,scene,camera,clock,root,ui,fade,agent,legs=[],arms=[],raf=0,opts=null,kiosks=[],door=null,cabinet=null,target=null,pendingOpen=null,near=null,gait=0,npcs=[],npcTimer=0;
const keys=new Set(),ray=new THREE.Raycaster(),floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0);
const mats=new Map();const mat=(c,o={})=>{const k=c+JSON.stringify(o);if(!mats.has(k))mats.set(k,new THREE.MeshStandardMaterial({color:c,roughness:.8,...o}));return mats.get(k);};
function box(p,w,h,d,x,y,z,m){const g=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof m==='string'?mat(m):m);g.position.set(x,y,z);g.castShadow=true;g.receiveShadow=true;p.add(g);return g;}
function cyl(p,rt,rb,h,x,y,z,m,n=20){const g=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),typeof m==='string'?mat(m):m);g.position.set(x,y,z);g.castShadow=true;g.receiveShadow=true;p.add(g);return g;}
function sph(p,r,x,y,z,m){const g=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),typeof m==='string'?mat(m):m);g.position.set(x,y,z);g.castShadow=true;p.add(g);return g;}
const $=id=>document.getElementById(id);

// ── 캔버스 텍스처 ─────────────────────────────────────
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
const rnd=(i,s=0)=>{const n=Math.sin(i*127.1+s*311.7)*43758.5453;return n-Math.floor(n);};
function woodFloor(){return canvasTex(1024,1024,(g,w,h)=>{const rows=14,rh=h/rows;for(let r=0;r<rows;r++){let x=-rnd(r)*200;while(x<w){const len=180+rnd(r,x)*220,l=58+rnd(r*7,x)*12;g.fillStyle=`hsl(32,${38+rnd(x,r)*10}%,${l}%)`;g.fillRect(x,r*rh,len-3,rh-3);
  g.strokeStyle='rgba(90,60,30,.08)';for(let k=0;k<5;k++){g.beginPath();const yy=r*rh+4+rnd(x,k)*(rh-8);g.moveTo(x+4,yy);g.bezierCurveTo(x+len*.3,yy+3,x+len*.6,yy-3,x+len-6,yy);g.stroke();}x+=len;}}});}
function rugTex(){return canvasTex(512,320,(g,w,h)=>{g.fillStyle='#3f6653';g.fillRect(0,0,w,h);g.strokeStyle='#e8d9b3';g.lineWidth=10;g.strokeRect(22,22,w-44,h-44);g.lineWidth=3;g.strokeRect(42,42,w-84,h-84);
  g.fillStyle='#e8784e';for(let i=0;i<5;i++){g.save();g.translate(w/2+(i-2)*70,h/2);g.rotate(Math.PI/4);g.fillRect(-14,-14,28,28);g.restore();}});}
function signTex(name,cols=['#2f4c45','#3f6653','#e8784e']){return canvasTex(1024,256,(g,w,h)=>{const grd=g.createLinearGradient(0,0,w,0);grd.addColorStop(0,cols[0]);grd.addColorStop(1,cols[1]);g.fillStyle=grd;g.fillRect(0,0,w,h);
  g.fillStyle=cols[2];g.fillRect(0,h-14,w,14);g.fillStyle='#fffef4';let fs=96;g.font=`800 ${fs}px ${FONT}`;while(g.measureText(name).width>w-120&&fs>40){fs-=4;g.font=`800 ${fs}px ${FONT}`;}g.textAlign='center';g.textBaseline='middle';g.fillText(name,w/2,h/2-4);});}
function screenTex(title,idx,disabled){return canvasTex(512,768,(g,w,h)=>{const hues=[160,200,24,280,340,120];const hue=hues[idx%hues.length];
  const grd=g.createLinearGradient(0,0,0,h);grd.addColorStop(0,`hsl(${hue},38%,22%)`);grd.addColorStop(1,`hsl(${hue},45%,12%)`);g.fillStyle=grd;g.fillRect(0,0,w,h);
  g.fillStyle=`hsla(${hue},70%,60%,.18)`;for(let i=0;i<6;i++){g.beginPath();g.arc(rnd(i,idx)*w,rnd(idx,i)*h*.5,40+rnd(i)*90,0,7);g.fill();}
  g.fillStyle=`hsl(${hue},70%,62%)`;g.fillRect(48,70,64,8);g.fillStyle='#fffef4';g.textAlign='left';g.textBaseline='top';
  // 제목만(줄바꿈)
  let fs=54;g.font=`800 ${fs}px ${FONT}`;const words=title.split(/(\s+)/);const lines=[];let line='';for(const wd of words){const t=line+wd;if(g.measureText(t).width>w-96&&line.trim()){lines.push(line.trim());line=wd.trimStart();}else line=t;}if(line.trim())lines.push(line.trim());
  while(lines.length>6&&fs>34){fs-=4;}g.font=`800 ${fs}px ${FONT}`;lines.slice(0,7).forEach((l,i)=>g.fillText(l,48,110+i*(fs*1.25)));
  g.fillStyle=disabled?'rgba(255,255,255,.35)':`hsl(${hue},75%,62%)`;g.beginPath();g.roundRect(48,h-140,w-96,84,42);g.fill();g.fillStyle=disabled?'#ddd':'#13221f';g.font=`800 40px ${FONT}`;g.textAlign='center';g.textBaseline='middle';g.fillText(disabled?'준비 중':'열기',w/2,h-98);});}
function labelTex(text,bg='#2f4c45',fg='#fffef4'){return canvasTex(512,160,(g,w,h)=>{g.fillStyle=bg;g.beginPath();g.roundRect(0,0,w,h,30);g.fill();g.fillStyle=fg;let fs=70;g.font=`800 ${fs}px ${FONT}`;while(g.measureText(text).width>w-48&&fs>30){fs-=4;g.font=`800 ${fs}px ${FONT}`;}g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+2);});}
function skyTex(){return canvasTex(256,256,(g,w,h)=>{const grd=g.createLinearGradient(0,0,0,h);grd.addColorStop(0,'#9fd3e6');grd.addColorStop(.7,'#d8f0f0');grd.addColorStop(1,'#f4f1dc');g.fillStyle=grd;g.fillRect(0,0,w,h);
  g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<5;i++){g.beginPath();g.ellipse(rnd(i,3)*w,30+rnd(i,4)*80,40+rnd(i)*40,12,0,0,7);g.fill();}
  g.fillStyle='rgba(120,160,150,.55)';for(let i=0;i<14;i++){const bw=10+rnd(i,9)*22,bh=30+rnd(i,8)*90;g.fillRect(i*20+rnd(i)*8,h-bh,bw,bh);}});}

// ── 방 짓기 ─────────────────────────────────────────
function buildRoom(o){
  root=new THREE.Group();scene.add(root);kiosks=[];const T=themeOf(o.id);
  // 바닥 · 러그
  const ft=(T.floor?floorTexture(...T.floor):woodFloor());ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(1.6,1.1);
  const floor=new THREE.Mesh(new THREE.BoxGeometry(W,.2,D),new THREE.MeshStandardMaterial({map:ft,roughness:.62,metalness:.02}));floor.position.y=-.1;floor.receiveShadow=true;floor.name='floor';root.add(floor);
  if(T.rug){const rug=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.6),new THREE.MeshStandardMaterial({map:rugTexture(...T.rug),roughness:.95}));rug.rotation.x=-Math.PI/2;rug.position.set(.6,.004,.7);rug.receiveShadow=true;root.add(rug);}
  // 벽(뒤 · 왼쪽) + 굽도리 + 징두리
  const wallM=mat(T.wall,{roughness:.92}),wainM=mat(T.wain,{roughness:.7});
  box(root,W,WALL,.2,0,WALL/2,-D/2-.1,wallM);box(root,.2,WALL,D,-W/2-.1,WALL/2,0,wallM);
  box(root,W,1,.06,0,.5,-D/2+.03,wainM);box(root,.06,1,D,-W/2+.03,.5,0,wainM);
  box(root,W,.08,.1,0,1.02,-D/2+.06,'#a88f63');box(root,.1,.08,D,-W/2+.06,1.02,0,'#a88f63');
  box(root,W,.12,.08,0,.06,-D/2+.05,'#5d4a36');box(root,.08,.12,D,-W/2+.05,.06,0,'#5d4a36');
  // 뒤 벽 큰 창 3개(바깥 하늘 + 창틀)
  const sky=new THREE.MeshBasicMaterial({map:viewTexture(T.view)});
  // 간판이 걸린 왼쪽 벽면에는 창을 두지 않는다(창틀이 간판을 가리지 않게)
  for(const x of[.95,3.55]){const win=new THREE.Mesh(new THREE.PlaneGeometry(2.1,1.7),sky);win.position.set(x,2.15,-D/2+.07);root.add(win);
    const fr='#4a5a58';box(root,2.24,.1,.1,x,3.04,-D/2+.1,fr);box(root,2.24,.1,.1,x,1.26,-D/2+.1,fr);box(root,.1,1.88,.1,x-1.07,2.15,-D/2+.1,fr);box(root,.1,1.88,.1,x+1.07,2.15,-D/2+.1,fr);box(root,.05,1.7,.06,x,2.15,-D/2+.1,fr);
    box(root,2.3,.06,.24,x,1.2,-D/2+.18,'#e6dcc6');
    const glow=new THREE.PointLight('#fff4d8',1.4,6,2);glow.position.set(x,2.2,-D/2+.8);root.add(glow);}
  // 안내 데스크(뒤쪽 왼편) + 이름 간판
  const desk=new THREE.Group();desk.position.set(-2.6,0,-2.1);root.add(desk);
  box(desk,2.6,.95,.7,0,.475,0,'#e9e2d0');box(desk,2.75,.07,.82,0,.98,0,'#6b5640');box(desk,2.6,.2,.04,0,.75,.37,'#3f6653');box(desk,.7,.95,1.5,-1.0,.475,.75,'#e9e2d0');box(desk,.82,.07,1.6,-1.0,.98,.75,'#6b5640');
  box(desk,.5,.32,.04,.85,1.18,-.1,'#1d2a30');box(desk,.08,.16,.08,.85,1.06,-.1,'#59636a');
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.05),new THREE.MeshStandardMaterial({map:signTex(o.name,T.sign),roughness:.5}));sign.position.set(-2.4,2.95,-D/2+.08);root.add(sign);
  // 화분
  const plant=(x,z,s=1)=>{const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);root.add(g);cyl(g,.26,.2,.5,0,.25,0,'#d9cbb0');cyl(g,.24,.24,.04,0,.5,0,'#5d4a36');
    for(let i=0;i<7;i++){const a=i/7*6.28;const l=sph(g,.22,Math.cos(a)*.16,.78+rnd(i,x)*.35,Math.sin(a)*.16,i%2?'#5f9a6a':'#77ad73');l.scale.set(1,1.4,1);}sph(g,.25,0,1.12,0,'#6aa36d');};
  if(T.sofa!==false){plant(-4.4,-3.0,1.15);plant(4.4,-3.0,1.15);plant(-4.4,3.0,.9);}
  // 소파 + 낮은 탁자
  if(T.sofa!==false){const sofa=new THREE.Group();sofa.position.set(.6,0,2.35);root.add(sofa);box(sofa,2.6,.42,.9,0,.21,0,'#7f9c94');box(sofa,2.6,.6,.22,0,.6,.36,'#6f8c84');box(sofa,.22,.55,.9,-1.3,.4,0,'#6f8c84');box(sofa,.22,.55,.9,1.3,.4,0,'#6f8c84');
  box(root,1.3,.06,.7,.6,.42,1.25,'#6b5640');for(const [x,z] of[[-.55,-.28],[.55,-.28],[-.55,.28],[.55,.28]])cyl(root,.03,.03,.4,.6+x,.2,1.25+z,'#3a3430',8);}
  // 펜던트 조명
  for(const [x,z] of[[-1.4,.9],[1.9,1.4]]){cyl(root,.01,.01,.55,x,WALL+.18,z,'#3a3430',6);const shade=cyl(root,.08,.34,.32,x,WALL-.8,z,'#2f4c45',24);shade.material=mat('#2f4c45',{roughness:.5,metalness:.3,side:THREE.DoubleSide});
    const bulb=sph(root,.09,x,WALL-.95,z,new THREE.MeshStandardMaterial({color:'#fff5d6',emissive:'#ffe9b0',emissiveIntensity:2.2}));bulb.castShadow=false;const pl=new THREE.PointLight('#ffe2b0',2.2,7,1.6);pl.position.set(x,WALL-1.05,z);root.add(pl);}
  // 출입문(왼쪽 벽, 앞쪽) — 나가기
  door=new THREE.Group();door.position.set(-W/2+.08,0,2.2);root.add(door);box(door,.12,2.3,1.3,0,1.15,0,'#5d4a36');box(door,.06,2.1,1.1,.06,1.07,0,'#a88f63');sph(door,.05,.14,1.05,.4,'#e6c477');
  const ex=new THREE.Mesh(new THREE.PlaneGeometry(1.0,.32),new THREE.MeshBasicMaterial({map:labelTex('나가기','#e8784e')}));ex.rotation.y=Math.PI/2;ex.position.set(.1,2.55,0);door.add(ex);
  const mat2=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.9),mat('#7a6a55',{roughness:1}));mat2.rotation.x=-Math.PI/2;mat2.position.set(.75,.006,0);door.add(mat2);
  // 자료함(오른쪽 앞)
  cabinet=null;if(o.records){cabinet=new THREE.Group();cabinet.position.set(4.0,0,.6);cabinet.rotation.y=-.55;root.add(cabinet);box(cabinet,1.3,1.5,.6,0,.75,0,'#b99a6e');for(let i=0;i<3;i++){box(cabinet,1.18,.4,.04,0,.32+i*.46,.31,'#d8bf92');box(cabinet,.3,.05,.05,0,.32+i*.46,.35,'#5d4a36');}
    const lb=new THREE.Mesh(new THREE.PlaneGeometry(1.0,.32),new THREE.MeshBasicMaterial({map:labelTex('자료함')}));lb.position.set(0,1.75,0);cabinet.add(lb);cabinet.userData.kind='records';}
  // 콘텐츠 키오스크(제목만) — 뒤 벽 앞에 반원으로
  const n=o.items.length;
  o.items.forEach((it,i)=>{const k=new THREE.Group();const t=n===1?.5:i/(n-1),x=THREE.MathUtils.lerp(-.6,3.9,t),z=-2.3+Math.sin(t*Math.PI)*.5;k.position.set(n===1?1.6:x,0,z);k.rotation.y=-.12-t*.25;root.add(k);
    box(k,.9,.06,.5,0,.03,0,'#3a4247');box(k,.12,1.0,.12,0,.55,0,'#59636a');box(k,1.18,1.7,.12,0,1.85,0,'#1d2a30');
    const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.06,1.58),new THREE.MeshStandardMaterial({map:screenTex(it.title,i,it.disabled),emissive:'#ffffff',emissiveMap:null,emissiveIntensity:0,roughness:.35}));scr.position.set(0,1.85,.065);k.add(scr);
    scr.material.emissiveMap=scr.material.map;scr.material.emissive=new THREE.Color('#ffffff');scr.material.emissiveIntensity=.55;
    k.userData={kind:'kiosk',index:i};kiosks.push(k);});
  // AGENT-GORGO-32 안내원 2명(데스크 뒤 상주): 1번 GPT · 2번 Claude — 로그인된 AI만 보인다
  npcs=[];setNpcs(o.npcs?.initial||[]);
  decorate(root,o.id); // 장소 컨셉 소품(rooms.js)
  // 빛
  scene.add(root);
}
function makeGorgo(){const g=makePerson({});legs=g.userData.legs;arms=g.userData.arms;return g;}
// 자리: 1번(GPT) 데스크 왼쪽 · 2번(Claude) 데스크 오른쪽. spot = 고르고가 서서 말을 거는 데스크 앞 자리
const NPC_SEAT={1:{x:-3.4,spot:new THREE.Vector3(-2.95,0,-1.15)},2:{x:-2.05,spot:new THREE.Vector3(-1.75,0,-1.15)}};
function josa(w){const c=w.charCodeAt(w.length-1);return c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28?'과':'와';}
// list = [{slot, provider, name, ai, color}] — 살아 있는(로그인된) 안내원만
function setNpcs(list){if(!root)return;for(const n of npcs){root.remove(n);n.traverse(m=>{m.geometry?.dispose?.();if(m.material?.map)m.material.map.dispose();});}npcs=[];
  for(const c of list||[]){const seat=NPC_SEAT[c.slot];if(!seat)continue;
   const n=makePerson({npc:true,suit:c.color,sleeve:c.color,pants:'#3a4247',...(c.look||{})});n.position.set(seat.x,0,-2.85);n.userData.kind='concierge';n.userData.provider=c.provider;n.userData.name=c.name;n.userData.spot=seat.spot;root.add(n);n.traverse(m=>{if(m.isMesh)m.castShadow=true;});
   const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:labelTex(c.slot+' · '+c.name+(c.title?' · '+c.title:' · '+c.ai),'#2f4c45'),depthTest:false}));tag.scale.set(.46,.144,1);tag.position.set(0,.84,0);tag.renderOrder=20;n.add(tag);
   const bub=new THREE.Sprite(new THREE.SpriteMaterial({map:labelTex('무엇을 도와드릴까요?','#fffef4','#2f4c45'),depthTest:false}));bub.scale.set(.5,.156,1);bub.position.set(0,.99,0);bub.renderOrder=20;n.add(bub);n.userData.bubble=bub;npcs.push(n);}
  const h=$('in-npc');if(h)h.hidden=!opts?.npcs?.checked||npcs.length>0;}
// 사람 모형은 people.js(고르고·안내원 공용)

// ── UI ─────────────────────────────────────────────
function buildUI(){
  ui=document.createElement('div');ui.id='interior';ui.innerHTML='<div class="in-top"><span class="in-place" id="in-place"></span><button id="in-exit" class="in-exit" type="button">← 밖으로</button></div><button id="in-action" class="in-action" type="button" hidden></button><button id="in-npc" class="in-npc" type="button" hidden>AI에 로그인하면 안내원(1번 GPT · 2번 Claude)이 나와 일을 맡아 줍니다 · AI 연결 열기</button><p class="in-hint">WASD·방향키·바닥 클릭으로 이동 · 화면을 누르면 열립니다</p>';
  document.body.append(ui);fade=document.createElement('div');fade.id='interior-fade';document.body.append(fade);
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;ui.prepend(renderer.domElement);
  scene=new THREE.Scene();scene.background=new THREE.Color('#e9e3d2');camera=new THREE.PerspectiveCamera(36,1,.1,100);clock=new THREE.Clock();
  scene.add(new THREE.HemisphereLight('#fff7e6','#b8a988',1.3));const sun=new THREE.DirectionalLight('#fff1d6',2.2);sun.position.set(4,9,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:30});sun.shadow.bias=-.0004;sun.shadow.normalBias=.02;scene.add(sun);
  $('in-exit').onclick=()=>closeInterior();$('in-npc').onclick=()=>document.getElementById('ai-open')?.click();$('in-action').onclick=()=>act();
  const el=renderer.domElement;let down=null;el.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,t:performance.now()};});
  el.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>6||performance.now()-down.t>500)return;click(e.clientX,e.clientY);});
  addEventListener('keydown',e=>{if(!isInteriorOpen()||document.querySelector('dialog[open]'))return;const k=moveKey(e);if(k){keys.add(k);e.preventDefault();target=null;pendingOpen=null;}else if(e.key==='Enter'||e.key===' '){if(near){e.preventDefault();act();}}else if(e.key==='Escape')closeInterior();});
  addEventListener('keyup',e=>{const k=moveKey(e);if(k)keys.delete(k);});addEventListener('blur',()=>keys.clear());
  addEventListener('resize',resize);
}
const KEYMAP={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
function moveKey(e){return KEYMAP[e.code]||null;}
function resize(){if(!renderer)return;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  // 화면 비율에 따라 방 전체가 들어오도록 거리 조정
  const a=innerWidth/innerHeight,d=12.5*Math.max(1,Math.pow(1.25/a,.8));camera.position.set(5.2*d/12.5,7.4*d/12.5,9.6*d/12.5);camera.lookAt(0,.9,-.3);}
function pick(cx,cy){ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);return ray;}
function click(cx,cy){if(document.querySelector('dialog[open]'))return;const r=pick(cx,cy);
  const targets=[...kiosks,...(cabinet?[cabinet]:[]),door,...npcs];const hit=r.intersectObjects(targets,true)[0];
  if(hit){let o=hit.object;while(o&&!o.userData.kind&&o!==door)o=o.parent;if(o===door||hit.object.parent===door){walkTo(door.position.x+.9,door.position.z,'door');return;}
    if(o?.userData.kind==='kiosk'){const k=o;const f=new THREE.Vector3(0,0,1.0).applyAxisAngle(new THREE.Vector3(0,1,0),k.rotation.y);walkTo(k.position.x+f.x,k.position.z+f.z,{kiosk:k.userData.index});return;}
    if(o?.userData.kind==='records'){const f=front(cabinet,1.0);walkTo(f.x,f.z,'records');return;}
    if(o?.userData.kind==='concierge'){const sp=o.userData.spot;walkTo(sp.x,sp.z,{npc:o.userData.provider});return;}}
  const p=new THREE.Vector3();if(r.ray.intersectPlane(floorPlane,p))walkTo(p.x,p.z,null);}
function walkTo(x,z,then){target=new THREE.Vector3(clamp(x,-W/2+.45,W/2-.45),0,clamp(z,-D/2+.55,D/2-.35));pendingOpen=then;}
const clamp=THREE.MathUtils.clamp;
function front(o,dist){return new THREE.Vector3(0,0,dist).applyAxisAngle(new THREE.Vector3(0,1,0),o.rotation.y).add(o.position);}
function act(){if(!near||!opts)return;if(near.kind==='concierge'){opts.onConcierge?.(near.provider);return;}if(near.kind==='kiosk'){const it=opts.items[near.index];if(!it.disabled)it.open();}else if(near.kind==='records')opts.records?.();else if(near.kind==='door')closeInterior();}
function arriveAction(a){if(!a)return;if(a.npc){agent.rotation.y=Math.PI;if(npcs.some(n=>n.userData.provider===a.npc))opts.onConcierge?.(a.npc);return;}if(a==='door'){closeInterior();return;}if(a==='records'){opts.records?.();return;}if(a.kiosk!=null){const it=opts.items[a.kiosk];if(!it.disabled)it.open();}}
function updateNear(){let best=null,bd=1.25;const p=agent.position;
  kiosks.forEach(k=>{const f=new THREE.Vector3(0,0,1.0).applyAxisAngle(new THREE.Vector3(0,1,0),k.rotation.y);const d=Math.hypot(p.x-(k.position.x+f.x),p.z-(k.position.z+f.z));if(d<bd){bd=d;best={kind:'kiosk',index:k.userData.index};}});
  if(cabinet){const f=front(cabinet,1.0);const d=Math.hypot(p.x-f.x,p.z-f.z);if(d<bd){bd=d;best={kind:'records'};}}
  const dd=Math.hypot(p.x-(door.position.x+.9),p.z-door.position.z);if(dd<1.0&&dd<bd)best={kind:'door'};
  for(const n of npcs){const sp=n.userData.spot,dn=Math.hypot(p.x-sp.x,p.z-sp.z);if(dn<.9&&dn<bd){bd=dn;best={kind:'concierge',provider:n.userData.provider,name:n.userData.name};}}
  near=best;const b=$('in-action');b.hidden=!best;if(best)b.textContent=best.kind==='concierge'?(best.name+josa(best.name)+' 대화하기'):best.kind==='kiosk'?opts.items[best.index].title+(opts.items[best.index].disabled?' · 준비 중':' · 열기'):best.kind==='records'?'자료함 열기':'밖으로 나가기';}
function loop(){raf=requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta()),t=clock.elapsedTime;const blocked=!!document.querySelector('dialog[open]');
  let x=0,z=0;if(keys.has('up'))z--;if(keys.has('down'))z++;if(keys.has('left'))x--;if(keys.has('right'))x++;let v=null,speed=0;
  if(!blocked&&(x||z)){const dir=new THREE.Vector3();camera.getWorldDirection(dir);dir.y=0;dir.normalize();const right=new THREE.Vector3().crossVectors(dir,new THREE.Vector3(0,1,0));v=right.multiplyScalar(x).addScaledVector(dir,-z).normalize();speed=2.6*dt;}
  else if(!blocked&&target){const to=target.clone().sub(agent.position);to.y=0;const d=to.length();if(d<.05){target=null;const a=pendingOpen;pendingOpen=null;arriveAction(a);}else{v=to.normalize();speed=Math.min(d,2.8*dt);}}
  const moving=!!v;if(v){agent.position.x=clamp(agent.position.x+v.x*speed,-W/2+.45,W/2-.45);agent.position.z=clamp(agent.position.z+v.z*speed,-D/2+.55,D/2-.35);const want=Math.atan2(v.x,v.z);let dr=want-agent.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));agent.rotation.y+=dr*Math.min(1,dt*12);gait+=dt*10;}
  const sw=moving?Math.sin(gait)*.55:0;legs[0].rotation.x=sw;legs[1].rotation.x=-sw;arms[0].rotation.x=-sw;arms[1].rotation.x=sw;agent.userData.body.position.y=moving?Math.abs(Math.sin(gait))*.015:Math.sin(t*2)*.006;
  for(const [i,n] of npcs.entries()){const u=n.userData,sp=u.spot;u.body.position.y=Math.sin(t*1.7+i*1.3)*.006;const close=Math.hypot(agent.position.x-sp.x,agent.position.z-sp.z)<1.6;u.arms[1].rotation.z=close?-2.4+Math.sin(t*8)*.35:0;u.arms[1].rotation.x=0;u.bubble.visible=!close;}
  updateNear();renderer.render(scene,camera);}

// ── 공개 API ────────────────────────────────────────
export function isInteriorOpen(){return !!opts;}
// o = { id, name, items:[{title, open(), disabled}], records: fn|null, onExit: fn, theme }
export function openInterior(o){if(opts)return;if(!renderer)buildUI();opts=o;window.__gorgoInteriorOpen=true;
  fade.classList.add('on');setTimeout(()=>{
    if(root){scene.remove(root);root.traverse(m=>{m.geometry?.dispose?.();if(m.material?.map)m.material.map.dispose();});}
    buildRoom(o);agent=makeGorgo();agent.position.set(-W/2+1.0,0,2.2);agent.rotation.y=Math.PI/2;root.add(agent);agent.traverse(m=>{if(m.isMesh)m.castShadow=true;});
    $('in-place').textContent=o.name;if(o.npcs){const refresh=()=>o.npcs.refresh?.().then(list=>{if(opts===o&&list){o.npcs.checked=true;setNpcs(list);}}).catch(()=>{});refresh();clearInterval(npcTimer);npcTimer=setInterval(refresh,30000);setTimeout(()=>{if(opts===o&&npcs.length)walkTo(-2.35,-.55,null);},900);}keys.clear();target=new THREE.Vector3(-W/2+2.2,0,1.6);pendingOpen=null;near=null;
    document.body.classList.add('in-interior');ui.classList.add('on');resize();clock.getDelta();cancelAnimationFrame(raf);loop();
    requestAnimationFrame(()=>fade.classList.remove('on'));},280);
  window.__gorgoInterior={open:()=>!!opts,id:()=>opts?.id,name:()=>opts?.name,items:()=>opts?opts.items.map(i=>i.title):[],openItem:i=>{const it=opts?.items[i];if(it&&!it.disabled)it.open();return !!it;},records:()=>{if(opts?.records){opts.records();return true;}return false;},hasRecords:()=>!!opts?.records,hasConcierge:()=>npcs.length>0,npcs:()=>npcs.map(n=>n.userData.provider),npcNames:()=>npcs.map(n=>n.userData.name),concierge:p=>{const n=npcs.find(n=>!p||n.userData.provider===p);if(n)opts?.onConcierge?.(n.userData.provider);return !!n;},setNpcs:list=>{setNpcs(list);return npcs.length;},exit:()=>closeInterior(),agent:()=>agent?.position.toArray()};}
export function closeInterior(){if(!opts)return;const o=opts;clearInterval(npcTimer);fade.classList.add('on');setTimeout(()=>{cancelAnimationFrame(raf);ui.classList.remove('on');document.body.classList.remove('in-interior');opts=null;window.__gorgoInteriorOpen=false;keys.clear();
  requestAnimationFrame(()=>fade.classList.remove('on'));o.onExit?.();},280);}

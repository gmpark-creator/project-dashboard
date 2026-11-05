// 한반도 지도 (index.html?map=korea) — 부산 지도와 같은 미니어처 화풍으로 전국을 걷는다.
// 1 단위 = 10km. 처음 화면(index.html)이 이 지도다. 부산에 들어가면 카메라가 「부산 상세 지도 범위」로 확대된 뒤
// 그 구도 그대로 부산 상세 지도(index.html?map=busan)로 이어진다(AGENT-GORGO-12, map-handoff.js).
// 장소 좌표는 data/korea-places.json(공식 명칭·주소 지오코딩 + 출처) 그대로 쓴다. 손으로 만든 좌표 없음.
import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { initAiUI } from './ai-ui.js';
import { initRecordsUI, openZoneRecords } from './records-ui.js';
import { buildCar, buildKTX, Ride, shortestPath } from './ride.js';

const $=id=>document.getElementById(id);
const clamp=THREE.MathUtils.clamp;
const state={ready:false,follow:false,selected:null,frames:0,elapsed:0,fps:0,speedMode:'normal',map:'korea'};
try{if(localStorage.getItem('gorgo.speedMode')==='fast')state.speedMode='fast';}catch{}
const KEY_CODES={KeyW:'up',ArrowUp:'up',KeyS:'down',ArrowDown:'down',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'shift',ShiftRight:'shift'};
const KEY_FALLBACK={w:'up','ㅈ':'up',arrowup:'up',s:'down','ㄴ':'down',arrowdown:'down',a:'left','ㅁ':'left',arrowleft:'left',d:'right','ㅇ':'right',arrowright:'right',shift:'shift'};
const MAX_DT=.5,CLICK_SLOP=6,CLICK_MS=450,EDGE=.3,NEAR=1.1;
// 지리 지명 라벨(행정 중심 대략 위치). 업무 장소가 아니라 지도 읽기용 지명이다.
const CITY_LABELS=[['서울',126.978,37.566,'major'],['인천',126.705,37.456,''],['수원',127.029,37.263,''],['춘천',127.730,37.881,''],['강릉',128.876,37.752,''],['청주',127.489,36.642,''],['대전',127.385,36.351,'major'],['전주',127.148,35.824,''],['광주',126.853,35.160,'major'],['목포',126.392,34.812,''],['여수',127.662,34.760,''],['대구',128.601,35.871,'major'],['안동',128.729,36.568,''],['울산',129.311,35.539,''],['창원',128.681,35.228,''],['제주',126.531,33.500,'major'],['울릉도',130.866,37.500,''],['독도',131.866,37.242,''],['백령도',124.680,37.960,''],['평양',125.754,39.039,'major'],['개성',126.554,37.971,''],['원산',127.443,39.153,''],['함흥',127.536,39.918,''],['신의주',124.398,40.100,''],['청진',129.776,41.795,''],['백두산',128.077,42.006,''],['한라산',126.533,33.362,''],['지리산',127.731,35.337,''],['설악산',128.465,38.119,''],['동해',130.6,36.6,'water'],['서해',124.9,36.4,'water'],['남해',127.8,33.9,'water']];
let scene,camera,renderer,controls,terrain,heights,land,meta,places={},catalog,agent,legs=[],arms=[],targetMark,flight=null,last=0,gait=0,toastTimer,nearby=null,moveTarget=null;
let widthU,depthU,leaders,busanBounds=null,busanOutline=null,landmarkList=[];
// AGENT-GORGO-15/16: 전국 지도에서 고르고는 걷지 않는다. 방향키로 다닐 때는 자동차, 지도·핀을 눌러 갈 때는 고속열차.
// agent(보이지 않음)가 탈것 머리 위치이고, 열차의 객차는 지나온 자취를 따라간다.
const CAR_SCALE=3.2,KTX_SCALE=2.0;let car=null,ktx=null,veh=null,mode='',scaleF=1,trail=[],lastHead=null;
function vehScale(){return (mode==='car'?CAR_SCALE:KTX_SCALE)*scaleF;}
function setMode(m){if(m===mode&&veh)return;const behind=trail.length>1?trail[1].clone().sub(trail[0]).setY(0):null;mode=m;veh=m==='car'?car:ktx;
 for(const p of car.parts)p.visible=m==='car';for(const p of ktx.parts)p.visible=m==='train';resetTrail(behind&&behind.lengthSq()>1e-6?behind.normalize():undefined);}const keys=new Set(),mobileKeys=new Set(),labelItems=[],spinners=[],clock=new THREE.Clock(),inputLog=[];
const matCache=new Map();const material=(color,extra={})=>{const k=color+JSON.stringify(extra);if(!matCache.has(k))matCache.set(k,new THREE.MeshStandardMaterial({color,roughness:.88,...extra}));return matCache.get(k);};
const rand=(x,z,s=0)=>{const n=Math.sin(x*127.1+z*311.7+s*73.1)*43758.5453;return n-Math.floor(n);};
const KX=()=>Math.cos(THREE.MathUtils.degToRad((meta.bounds[1]+meta.bounds[3])/2))*111.32/meta.unitKm,KZ=()=>111.195/meta.unitKm;
function project(lon,lat){return new THREE.Vector3((lon-(meta.bounds[0]+meta.bounds[2])/2)*KX(),0,((meta.bounds[1]+meta.bounds[3])/2-lat)*KZ());}
function cell(x,z){const u=(x/widthU+.5)*meta.nx,v=(z/depthU+.5)*meta.nz;return {u,v,out:u<0||v<0||u>meta.nx||v>meta.nz};}
function elevation(x,z){const {u,v,out}=cell(x,z);if(out)return -50;if(!land[Math.round(v)*(meta.nx+1)+Math.round(u)])return -50;const s=meta.nx+1,ix=Math.min(meta.nx-1,Math.floor(u)),iz=Math.min(meta.nz-1,Math.floor(v)),fx=u-ix,fz=v-iz;
 return Math.max(2,THREE.MathUtils.lerp(THREE.MathUtils.lerp(heights[iz*s+ix],heights[iz*s+ix+1],fx),THREE.MathUtils.lerp(heights[(iz+1)*s+ix],heights[(iz+1)*s+ix+1],fx),fz));}
const H=h=>h<=.5?-.06:.05+h*.00085; // 세로 과장: 1000m ≈ 0.9 단위(9km) — 미니어처 느낌
function groundHeight(x,z){return H(elevation(x,z));}
function geoPoint(lon,lat,lift=0){const p=project(lon,lat);p.y=Math.max(.06,groundHeight(p.x,p.z))+lift;return p;}
function cube(parent,w,h,d,x,y,z,color,extra={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color,extra));m.position.set(x,y,z);parent.add(m);return m;}
function cylinder(parent,rt,rb,h,x,y,z,color,n=10){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),material(color));m.position.set(x,y,z);parent.add(m);return m;}
function sphere(parent,r,x,y,z,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),material(color));m.position.set(x,y,z);parent.add(m);return m;}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3300);}

function makeTerrain(){
 const geo=new THREE.PlaneGeometry(widthU,depthU,meta.nx,meta.nz);geo.rotateX(-Math.PI/2);const p=geo.attributes.position,colors=new Float32Array(p.count*3);
 const low=new THREE.Color('#e7ddbb'),mid=new THREE.Color('#8eaf72'),high=new THREE.Color('#608d68'),peak=new THREE.Color('#7f8f7a'),sand=new THREE.Color('#e9d5a6'),sea=new THREE.Color('#8dc9c4'),c=new THREE.Color();
 for(let i=0;i<p.count;i++){const h=land[i]?Math.max(2,heights[i]):-50,x=p.getX(i),z=p.getZ(i);p.setY(i,H(h));
  if(h<=.5)c.copy(sea);else if(h<8)c.copy(sand);else if(h<120)c.copy(low).lerp(mid,clamp((h-20)/160,0,.6));else if(h<1300)c.copy(mid).lerp(high,clamp((h-120)/800,0,1));else c.copy(high).lerp(peak,clamp((h-1300)/1200,0,1));
  c.multiplyScalar(.97+rand(x,z)*.045);colors.set([c.r,c.g,c.b],i*3);}
 geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.computeVertexNormals();
 terrain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0}));scene.add(terrain);
 const water=new THREE.Mesh(new THREE.PlaneGeometry(widthU*3,depthU*3),new THREE.MeshStandardMaterial({color:'#8ac8c6',roughness:.52,metalness:.08}));water.rotation.x=-Math.PI/2;water.position.y=-.012;scene.add(water);
 const glints=[];for(let i=0;i<1600;i++){const x=(rand(i,1)-.5)*widthU,z=(rand(i,2)-.5)*depthU;if(elevation(x,z)>.5)continue;const l=.25+rand(i,3)*.5;glints.push(x,.004,z,x+l,.004,z);}
 const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(glints,3));scene.add(new THREE.LineSegments(gg,new THREE.LineBasicMaterial({color:'#c2e4dc',transparent:true,opacity:.45})));
 // 산림: 부산 지도와 같은 낮은 원뿔 나무를 산지에 흩뿌린다(인스턴스 1개).
 const specs=[];for(let i=0;i<26000;i++){const x=(rand(i,11)-.5)*widthU,z=(rand(i,12)-.5)*depthU,h=elevation(x,z);if(h<150||h>1900||rand(x,z,14)>.7)continue;specs.push({x,z,y:H(h),s:.10+rand(x,z,15)*.12});}
 const trees=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5),material('#ffffff'),specs.length),dummy=new THREE.Object3D(),color=new THREE.Color();
 specs.forEach((t,i)=>{dummy.position.set(t.x,t.y+t.s*.6,t.z);dummy.scale.set(t.s*.6,t.s*1.5,t.s*.6);dummy.rotation.set(0,rand(t.x,t.z)*6.28,0);dummy.updateMatrix();trees.setMatrixAt(i,dummy.matrix);trees.setColorAt(i,color.set(['#699568','#79a371','#85ab75','#5e8e68'][i%4]));});scene.add(trees);state.trees=specs.length;
}
// 장소별 미니어처. 실제 형태를 단순화한 원작 해석이며 측량 형상이 아니다.
function landmark(p){const g=new THREE.Group();g.position.copy(geoPoint(p.lon,p.lat));scene.add(g);const s=.95;g.scale.setScalar(s);
 const base=()=>cylinder(g,.55,.6,.06,0,.03,0,'#e9dfc4',24);
 switch(p.id){
  case 'cheomseongdae':{base();const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector2(.26-.12*Math.sin(t*Math.PI*.55)+(t>.5?-.02:0)*(t-.5),t*.9));}const body=new THREE.Mesh(new THREE.LatheGeometry(pts,18),material('#d8c39b'));body.position.y=.06;g.add(body);for(let k=1;k<9;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(.25-.1*Math.sin(k/9*Math.PI*.55),.008,4,18),material('#b9a27a'));r.rotation.x=Math.PI/2;r.position.y=.06+k*.1;g.add(r);}cube(g,.32,.04,.32,0,1.0,0,'#c9b48c');cube(g,.07,.07,.02,0,.55,.2,'#5c513f');break;}
  case 'cheongwadae':{base();cube(g,.8,.22,.36,0,.17,0,'#f3eee2');const roof=cube(g,.92,.08,.48,0,.32,0,'#3f6fb0');roof.scale.set(1,1,1);cube(g,.7,.06,.38,0,.39,0,'#4b7fc4');for(let x=-3;x<=3;x++)cube(g,.03,.2,.02,x*.11,.16,.19,'#e2dccd');cube(g,1.1,.01,.6,0,.065,.35,'#a9c48e');break;}
  case 'kori-nuclear':{base();for(const x of[-.28,.28]){cylinder(g,.2,.22,.32,x,.22,0,'#eef0ea',18);const d=sphere(g,.2,x,.38,0,'#f4f4ef');d.scale.y=.8;}cube(g,.3,.18,.25,0,.15,.3,'#d6dbd2');break;}
  case 'busan-science':{base();const d=sphere(g,.36,0,.06,0,'#cfd9de');d.scale.y=.75;cube(g,.9,.14,.3,0,.13,.35,'#eef0e6');cylinder(g,.02,.02,.4,.3,.5,0,'#9aa7ad');break;}
  case 'busan-station':{base();for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=.18+rand(i,3)*.32;cube(g,.09,.12+rand(i,4)*.45,.09,Math.cos(a)*r,.1,Math.sin(a)*r,['#f1e6cb','#d9ded0','#e7c3ae','#a1c4c5'][i%4]).position.y=.06+.06+rand(i,4)*.22;}cylinder(g,.03,.05,.7,0,.41,0,'#f6f0dc');cylinder(g,.09,.06,.07,0,.78,0,'#a7bdbc');break;}
  case 'jindo':{base();cube(g,.3,.15,.22,0,.13,0,'#efe8d6');cube(g,.34,.04,.26,0,.22,0,'#5f8f88');break;}
  default:{base();cube(g,.95,.22,.5,0,.17,0,p.id==='icheon-semi'||p.id==='asan-display'?'#e8eef0':'#d9d2c2');cube(g,.95,.03,.5,0,.3,0,p.id==='icheon-semi'?'#5b88b5':p.id==='asan-display'?'#4f7fa8':'#8f8a7c');
   if(p.id==='pohang-steel'){for(const x of[-.3,0,.3])cylinder(g,.04,.05,.65,x,.62,-.12,'#b9a89a');cylinder(g,.16,.18,.38,.25,.25,.33,'#9d8f84',14);}
   else if(p.id==='ulsan-battery'){for(let k=0;k<4;k++)cylinder(g,.05,.05,.16,-.3+k*.2,.4,.12,'#6fae7c',10);}else cube(g,.5,.12,.3,-.15,.36,0,'#f2f4f2');}
 }
 g.userData.place=p.id;return g;}
// 진도 해상풍력: 대표 지점(진도군청) 주변의 실제 바다 셀에 풍력기 배열을 둔다. 실제 단지 좌표 확인 전까지 '위치 확인 필요'.
function windFarm(p){const a=project(p.lon,p.lat);let best=null;
 for(let r=1.2;r<4&&!best;r+=.2)for(let k=0;k<24&&!best;k++){const ang=k/24*Math.PI*2,cx=a.x+Math.cos(ang)*r,cz=a.z+Math.sin(ang)*r;let ok=true;for(let i=-2;i<=2&&ok;i++)for(let j=-1;j<=1&&ok;j++)if(elevation(cx+i*.32,cz+j*.32)>.5)ok=false;if(ok)best={x:cx,z:cz};}
 if(!best)return null;const turbines=[];
 for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++){const g=new THREE.Group();g.position.set(best.x+i*.32+(j%2)*.16,0,best.z+j*.32);scene.add(g);g.scale.setScalar(.75);
  cylinder(g,.035,.035,.08,0,.0,0,'#d7d2c4',8);cylinder(g,.012,.022,.78,0,.42,0,'#f5f5f1',8);cube(g,.05,.045,.09,0,.82,0,'#eceee9');
  const rotor=new THREE.Group();rotor.position.set(0,.82,.055);g.add(rotor);sphere(rotor,.022,0,0,0,'#f5f5f1');for(let b=0;b<3;b++){const blade=new THREE.Mesh(new THREE.BoxGeometry(.022,.34,.008),material('#fbfbf8'));blade.position.y=.17;const arm=new THREE.Group();arm.rotation.z=b*Math.PI*2/3;arm.add(blade);rotor.add(arm);}
  spinners.push({rotor,speed:1.4+rand(i,j)*.4});turbines.push(g);}
 // 육지와 단지를 잇는 해저 케이블 표시(점선)
 const pts=[];for(let t=0;t<=1;t+=.1)pts.push(new THREE.Vector3(THREE.MathUtils.lerp(a.x,best.x,t),.01,THREE.MathUtils.lerp(a.z,best.z,t)));const g=new THREE.BufferGeometry().setFromPoints(pts);const ln=new THREE.Line(g,new THREE.LineDashedMaterial({color:'#e88b63',dashSize:.08,gapSize:.06}));ln.computeLineDistances();scene.add(ln);
 return {center:best,turbines};}
function makeAgent(start){const g=new THREE.Group();scene.add(g);const body=new THREE.Group();g.add(body);
 cube(body,.18,.21,.12,0,.27,0,'#344959');cube(body,.07,.15,.015,0,.30,.071,'#f5eddf');cube(body,.028,.12,.02,0,.28,.084,'#cf7359');
 sphere(body,.139,0,.49,.015,'#f1c8a7');const hair=sphere(body,.145,0,.535,-.012,'#3c3b49');hair.scale.y=.72;cube(body,.26,.04,.10,0,.58,.04,'#3c3b49');
 for(const s of[-1,1]){sphere(body,.012,s*.048,.49,.144,'#35404a');const cheek=sphere(body,.019,s*.081,.462,.13,'#e79e8e');cheek.scale.set(1,.5,.3);cube(body,.078,.035,.018,s*.064,.592,.11,'#384758');cube(body,.052,.016,.022,s*.064,.595,.123,'#7faaa9');}
 cube(body,.035,.009,.012,0,.449,.148,'#bb7f70');
 for(const s of[-1,1]){const leg=new THREE.Group();leg.position.set(s*.054,.19,0);cube(leg,.065,.14,.07,0,-.065,0,'#324452');cube(leg,.075,.035,.11,0,-.14,.018,'#41414a');body.add(leg);legs.push(leg);const arm=new THREE.Group();arm.position.set(s*.12,.35,0);cube(arm,.052,.15,.065,0,-.065,0,'#3b4f5e');sphere(arm,.031,0,-.15,.004,'#f1c8a7');body.add(arm);arms.push(arm);}
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.19,24),new THREE.MeshBasicMaterial({color:'#31554b',transparent:true,opacity:.18,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.002;g.add(shadow);g.userData.body=body;
 g.position.copy(start);g.scale.setScalar(1.25);agent=g;addLabel('고르고',null,null,'agent',null,g);}
function addLabel(text,lon,lat,kind='',id=null,object=null){const el=document.createElement(id?'button':'div');el.className='map-label '+kind;el.textContent=text;if(id){el.dataset.place=id;el.addEventListener('click',()=>rideTo(id));}$('labels').appendChild(el);labelItems.push({el,p:lon!=null?geoPoint(lon,lat,kind==='major'?.6:.25):null,kind,object});return el;}

// ── 장소 · 콘텐츠 ─────────────────────────────────────────
function contentUrl(item){if(item.src?.url)return item.src.url;if(!item.src?.path)return null;return catalog.source.pagesBase+item.src.path+(item.src.entry||'')+(item.src.query||'');}
// 부산 콘텐츠는 부산 상세 지도 안의 각 장소에서만 열린다(AGENT-GORGO-19). 전국 지도에는 koreaId가 있는 항목만.
function itemsFor(id){return catalog.items.filter(it=>it.place.koreaId===id);}
function buildDialogs(){
 const place=document.createElement('dialog');place.id='place-dialog';place.className='place-dialog';place.innerHTML='<button class="close" id="place-close" aria-label="장소 창 닫기">×</button><p class="place-kicker" id="place-kicker"></p><h2 id="place-title"></h2><p class="place-note" id="place-note"></p><div id="place-actions" class="place-actions"></div><div id="place-items" class="place-items"></div>';document.body.append(place);
 const view=document.createElement('dialog');view.id='content-dialog';view.className='content-dialog';view.innerHTML='<div class="content-bar"><button id="content-back" type="button">← 고르고로</button><strong id="content-title"></strong><a id="content-external" target="_blank" rel="noopener">새 창으로 열기</a></div><iframe id="content-frame" title="콘텐츠" referrerpolicy="no-referrer"></iframe>';document.body.append(view);
 $('place-close').onclick=()=>place.close();$('content-back').onclick=()=>{view.close();$('content-frame').src='about:blank';};
}
function openContent(item){const url=contentUrl(item);if(!url){toast('아직 연결된 화면이 없습니다.');return;}clearMovement();if(item.external){window.open(url,'_blank','noopener');return;}$('content-title').textContent=item.title;$('content-external').href=url;$('content-frame').src=url;for(const d of document.querySelectorAll('dialog[open]'))d.close();$('content-dialog').showModal();}
function openPlace(id){if(id==='busan-station'){enterBusan();return;}const p=places[id];if(!p)return;clearMovement();for(const d of document.querySelectorAll('dialog[open]'))d.close();
 $('place-kicker').textContent=p.region||'';$('place-title').textContent=p.name;$('place-note').textContent=[p.unverified?'위치 확인 필요 — '+(p.note||'대표 지점'):p.note,p.matched?'좌표: '+p.source+' · '+p.matched.split(',').slice(0,3).join(','):''].filter(Boolean).join('\n');
 const actions=$('place-actions');actions.replaceChildren();const btn=(t,f,cls='')=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.className=cls;b.onclick=f;actions.append(b);return b;};
 if(id==='busan-station')btn('부산 상세 지도로 들어가기',()=>enterBusan(),'primary');
 if(p.zone)btn('자료 넣기 · 보기',()=>{$('place-dialog').close();openZoneRecords(p.zone);},'primary');
 const list=$('place-items');list.replaceChildren();const items=itemsFor(id);
 if(!items.length&&!p.zone)list.append(Object.assign(document.createElement('p'),{className:'place-empty',textContent:'아직 이 장소에 연결된 콘텐츠가 없습니다.'}));
 const groups=new Map();for(const it of items){const k=id==='busan-station'?it.place.name:'';if(!groups.has(k))groups.set(k,[]);groups.get(k).push(it);}
 for(const [k,arr]of groups){if(k)list.append(Object.assign(document.createElement('h3'),{textContent:k}));for(const it of arr){const b=document.createElement('button');b.type='button';b.className='place-item';b.innerHTML='<b></b><small></small>';b.querySelector('b').textContent=it.title;b.querySelector('small').textContent=it.why||'';b.onclick=()=>{if(it.zone){$('place-dialog').close();openZoneRecords(it.zone);}else openContent(it);};if(!contentUrl(it)&&!it.zone)b.disabled=true;list.append(b);}}
 $('place-dialog').showModal();}

// ── AGENT-GORGO-14: 핀을 누르면 고르고가 기차를 타고 간다 ─────────────────────
// 노선은 실제 철도 데이터가 아니라 주요 철도 축(경부·호남·전라·동해·경강·중앙 등)을 도시 지명 좌표(CITY_LABELS)와
// 장소 좌표(korea-places.json)를 이어 단순화한 모식도다. 정확한 선로 위치를 주장하지 않는다. 진도는 목포에서 이어 간다.
const RAIL_LINKS=[['서울','수원'],['수원','asan-display'],['asan-display','대전'],['청주','대전'],['청주','asan-display'],['대전','대구'],['대구','busan-station'],['대구','cheomseongdae'],['안동','대구'],['안동','춘천'],
 ['cheomseongdae','pohang-steel'],['cheomseongdae','울산'],['울산','ulsan-battery'],['울산','kori-nuclear'],['kori-nuclear','busan-science'],['busan-science','busan-station'],['울산','busan-station'],['busan-station','창원'],
 ['대전','전주'],['전주','광주'],['광주','목포'],['목포','jindo'],['전주','여수'],['창원','여수'],['서울','cheongwadae'],['서울','인천'],['서울','icheon-semi'],['icheon-semi','강릉'],['서울','춘천'],['춘천','강릉'],['강릉','pohang-steel']];
let rail=null;
function railGraph(){if(rail)return rail;const city=Object.fromEntries(CITY_LABELS.map(c=>[c[0],[c[1],c[2]]])),idx=new Map(),nodes=[],adj=[];
 const node=n=>{if(idx.has(n))return idx.get(n);const ll=places[n]?[places[n].lon,places[n].lat]:city[n];if(!ll)return -1;const p=project(ll[0],ll[1]);idx.set(n,nodes.length);nodes.push(p);adj.push([]);return nodes.length-1;};
 for(const [a,b]of RAIL_LINKS){const i=node(a),j=node(b);if(i<0||j<0)continue;const w=nodes[i].distanceTo(nodes[j]);adj[i].push([j,w]);adj[j].push([i,w]);}
 rail={idx,nodes,adj};return rail;}
// 선로 높이: 지형을 앞뒤로 평균 내어 완만하게, 바다 위는 다리 높이로.
function railLine(pts){const out=[];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.max(1,Math.ceil(a.distanceTo(b)/.25));for(let k=i===1?0:1;k<=n;k++)out.push(new THREE.Vector3().lerpVectors(a,b,k/n));}
 const raw=out.map(p=>Math.max(.04,groundHeight(p.x,p.z))),W=6;out.forEach((p,i)=>{let s=0,c=0;for(let j=Math.max(0,i-W);j<=Math.min(raw.length-1,i+W);j++){s+=raw[j];c++;}p.y=Math.max(.08,s/c)+.02;});return out;}
function resetTrail(behind=new THREE.Vector3(-.55,0,-1).normalize()){trail=[agent.position.clone()];const len=(veh.parts.length+1)*veh.spacing*vehScale();for(let s=.2;s<=len+.2;s+=.2)trail.push(agent.position.clone().addScaledVector(behind,s));lastHead=agent.position.clone();}
function placeTrain(){const h=agent.position;if(h.distanceTo(trail[0])>.04)trail.unshift(h.clone());else trail[0].copy(h);
 const need=(veh.parts.length+1)*veh.spacing*vehScale()+1;let acc=0;for(let i=1;i<trail.length;i++){acc+=trail[i].distanceTo(trail[i-1]);if(acc>need){trail.length=i+1;break;}}
 veh.parts.forEach((part,i)=>{const want=i*veh.spacing*vehScale(),pos=trail[0].clone(),dir=new THREE.Vector3(0,0,-1);let s=0,j=1;
  for(;j<trail.length;j++){const seg=trail[j].distanceTo(trail[j-1]);if(s+seg>=want){pos.lerpVectors(trail[j-1],trail[j],seg?(want-s)/seg:0);dir.subVectors(trail[j-1],trail[j]);break;}s+=seg;}
  if(j>=trail.length){pos.copy(trail[trail.length-1]);if(trail.length>1)dir.subVectors(trail[trail.length-2],trail[trail.length-1]);}
  part.position.copy(pos);dir.y=0;if(dir.lengthSq()>1e-10)part.rotation.y=Math.atan2(dir.x,dir.z);part.scale.setScalar(vehScale());});
 const moved=lastHead?lastHead.distanceTo(h):0;for(const w of veh.wheels)w.rotation.x+=moved*30;lastHead=h.clone();}
function nearestRail(v){const g=railGraph();let best=-1,bd=Infinity;g.nodes.forEach((n,i)=>{const d=Math.hypot(n.x-v.x,n.z-v.z);if(d<bd&&g.adj[i].length){bd=d;best=i;}});return best;}
function rideTo(id){if(id==='busan-station'){enterBusan();return;}const p=places[id];if(!p||state.leaving||state.riding)return;clearMovement();for(const d of document.querySelectorAll('dialog[open]'))d.close();
 const q=project(p.lon,p.lat);if(Math.hypot(agent.position.x-q.x,agent.position.z-q.z)<NEAR){openPlace(id);return;}
 trainTo(new THREE.Vector3(q.x+.65,0,q.z+.8),id,railGraph().idx.get(id));}
// 고속열차로 dest까지: 4단위(40km) 넘게 떨어지면 주요 철도 축을 타고, 가까우면 곧장 선로를 깔며 간다.
function trainTo(dest,id=null,goal=null){if(state.leaving||state.riding)return false;dest.y=Math.max(.08,groundHeight(dest.x,dest.z))+.02;
 const g=railGraph(),direct=Math.hypot(dest.x-agent.position.x,dest.z-agent.position.z);if(direct<.15)return false;let path=null;
 if(direct>4){const start=nearestRail(agent.position);if(goal==null)goal=nearestRail(dest);if(start>=0&&goal>=0){path=shortestPath(g.adj,start,goal);
  if(path&&id==null){let L=0,prev=agent.position;for(const i of path){L+=prev.distanceTo(g.nodes[i]);prev=g.nodes[i];}L+=prev.distanceTo(dest);if(L>direct*2.2)path=null;}}}
 const way=[agent.position.clone()];if(path)for(const i of path)way.push(g.nodes[i].clone());way.push(dest.clone());
 // 꺾이는 역에서 객차가 벌어지지 않도록 노선을 곡선으로 다듬고 같은 간격으로 다시 찍는다.
 const raw=railLine(way.filter((v,i)=>!i||v.distanceTo(way[i-1])>.05)),smooth=new THREE.CatmullRomCurve3(raw,false,'centripetal'),line=smooth.getSpacedPoints(Math.max(8,Math.ceil(smooth.getLength()/.15)));
 const curve=new THREE.CatmullRomCurve3(line.map(v=>v.clone().setY(v.y-.03)));const track=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.min(2400,line.length*2),.06,6,false),new THREE.MeshStandardMaterial({color:'#55585c',roughness:.75,metalness:.15,transparent:true,opacity:.95}));scene.add(track);
 setMode('train');const ride=new Ride(line,[],{duration:1});ride.duration=clamp(2.2+ride.length*.09,2.4,8);
 state.riding={id,ride,track,dest,view:clamp(camera.position.distanceTo(controls.target)*.6,12,22)};state.follow=false;flight=null;clearMovement();$('work-open').hidden=true;
 state.lastRide={id,units:+ride.length.toFixed(2),seconds:+ride.duration.toFixed(2),stations:path?path.length:0};toast((id?places[id].name:'선택한 곳')+' · 고속열차로 이동 중');return true;}
function stepRide(dt){const r=state.riding;const done=r.ride.update(dt);agent.position.copy(r.ride.head);
 const dist=camera.position.distanceTo(controls.target);const dir=camera.position.clone().sub(controls.target).normalize();controls.target.lerp(r.ride.head,Math.min(1,dt*5));camera.position.copy(controls.target).addScaledVector(dir,dist+(r.view-dist)*Math.min(1,dt*2));
 if(done){const track=r.track,t0=clock.getElapsedTime();const fade=()=>{const k=(clock.getElapsedTime()-t0)/.9;if(k>=1){scene.remove(track);track.geometry.dispose();track.material.dispose();return;}track.material.opacity=.95*(1-k);requestAnimationFrame(fade);};fade();
  state.riding=null;agent.position.copy(r.dest);state.selected=r.id;state.follow=true;nearby=null;toast((r.id?places[r.id].name:'목적지')+' 도착');if(r.id)openPlace(r.id);}}

// ── 이동 (부산 지도와 같은 조작) ─────────────────────────────
function flyTo(target,distance=30,keepFollow=false,duration=1.65,zoom=false){state.follow=keepFollow;const end=target.clone().add(new THREE.Vector3(distance*.14,distance*.72,distance*.76));flight={start:clock.getElapsedTime(),from:camera.position.clone(),to:end,fromTarget:controls.target.clone(),toTarget:target.clone(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?.05:duration,zoom};}
// 줌 비행: 거리를 지수로 보간해 확대·축소가 일정한 속도로 느껴지게 한다.
function stepFlight(t){const k=clamp((t-flight.start)/flight.duration,0,1),s=k*k*(3-2*k);controls.target.lerpVectors(flight.fromTarget,flight.toTarget,s);
 if(flight.zoom){const a=flight.from.clone().sub(flight.fromTarget),b=flight.to.clone().sub(flight.toTarget),la=a.length(),lb=b.length();camera.position.copy(controls.target).addScaledVector(a.normalize().lerp(b.normalize(),s).normalize(),Math.exp(THREE.MathUtils.lerp(Math.log(la),Math.log(lb),s)));}
 else camera.position.lerpVectors(flight.from,flight.to,s);if(k===1)flight=null;}
// 부산 상세 지도의 처음 화면과 같은 구도: 부산 지도는 1단위=1km, 중심=범위 중앙, 처음 거리=max(34km, 폭×1.2), 시선 방향은 두 지도 공통.
function busanFrame(){const b=busanBounds,widthKm=(b[2]-b[0])*91,c=project((b[0]+b[2])/2,(b[1]+b[3])/2);c.z+=1/meta.unitKm;return {target:c,distance:Math.max(34,widthKm*1.2)/meta.unitKm};}
// 부산 상세 지도 범위(부산 + 창원 쪽 신항 CFS까지)를 전국 지도 위에 점선 사각형으로 표시한다.
function makeBusanOutline(){const b=busanBounds,pts=[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]],[b[0],b[1]]].map(([lon,lat])=>{const p=project(lon,lat);p.y=.05;return p;});
 const g=new THREE.BufferGeometry().setFromPoints(pts),m=new THREE.LineDashedMaterial({color:'#e8784e',dashSize:.12,gapSize:.08,transparent:true,opacity:.55,depthTest:false});busanOutline=new THREE.Line(g,m);busanOutline.computeLineDistances();busanOutline.renderOrder=9;scene.add(busanOutline);}
// 전국 → 부산: 부산 상세 지도 범위로 확대한 뒤 그 화면을 넘기고 부산 상세 지도로 이어진다.
function enterBusan(){if(state.riding)return;if(state.leaving||!busanBounds){if(!busanBounds)location.href='./?map=busan';return;}state.leaving=true;clearMovement();for(const d of document.querySelectorAll('dialog[open]'))d.close();
 controls.enabled=false;document.body.classList.add('map-leaving');const f=busanFrame(),far=camera.position.distanceTo(controls.target);flyTo(f.target,f.distance,false,clamp(1.2+Math.log(far/f.distance)*.45,1.2,2.8),true);}
function homeView(){state.selected=null;flyTo(new THREE.Vector3(0,0,depthU*.05),Math.max(60,depthU*1.05));}
function travelTo(id){if($('travel-dialog').open)$('travel-dialog').close();if(id==='home'){homeView();return;}const p=places[id];if(!p)return;state.selected=id;const q=project(p.lon,p.lat);agent.position.set(q.x+.65,Math.max(.08,groundHeight(q.x+.65,q.z+.8))+.02,q.z+.8);resetTrail();toast(p.name+(p.unverified?' (위치 확인 필요)':'')+' 도착');flyTo(agent.position.clone().add(new THREE.Vector3(-.32,0,-.4)),11,true);}
function clearMovement(){keys.clear();mobileKeys.clear();moveTarget=null;if(targetMark)targetMark.visible=false;}
function speedMultiplier(){return state.speedMode==='fast'?3:1;}
function setSpeedMode(mode){state.speedMode=mode==='fast'?'fast':'normal';try{localStorage.setItem('gorgo.speedMode',state.speedMode);}catch{}const b=$('speed-mode');b.textContent='속도 '+speedMultiplier()+'×';b.setAttribute('aria-pressed',String(state.speedMode==='fast'));}
const blocked=()=>!!state.leaving||!!state.riding||!!document.querySelector('dialog[open]');
function moveKey(e){return KEY_CODES[e.code]||KEY_FALLBACK[(e.key||'').toLowerCase()]||null;}
function walkTo(cx,cy){if(blocked())return false;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);const hit=ray.intersectObject(terrain,false)[0];if(!hit)return false;const x=clamp(hit.point.x,-widthU/2+EDGE,widthU/2-EDGE),z=clamp(hit.point.z,-depthU/2+EDGE,depthU/2-EDGE);return trainTo(new THREE.Vector3(x,0,z));}
function updateAgent(dt){let x=0,z=0;if(keys.has('up')||mobileKeys.has('up'))z--;if(keys.has('down')||mobileKeys.has('down'))z++;if(keys.has('left')||mobileKeys.has('left'))x--;if(keys.has('right')||mobileKeys.has('right'))x++;if(x||z){moveTarget=null;if(!blocked())setMode('car');}
 const to=moveTarget?new THREE.Vector3(moveTarget.x-agent.position.x,0,moveTarget.z-agent.position.z):null;if(to&&to.length()<.03){moveTarget=null;}targetMark.visible=!!moveTarget;
 const moving=(!!(x||z)||!!moveTarget)&&!blocked();if(moving){let v,speed;
  if(moveTarget){const d=to.length();v=to.normalize();speed=Math.min(d,Math.max(2.5,Math.min(9,d*1.6))*speedMultiplier()*dt);}
  else{const dir=new THREE.Vector3();camera.getWorldDirection(dir);dir.y=0;dir.normalize();const right=new THREE.Vector3().crossVectors(dir,new THREE.Vector3(0,1,0));v=right.multiplyScalar(x).addScaledVector(dir,-z).normalize();speed=(keys.has('shift')?9:5)*speedMultiplier()*dt;}
  agent.position.x=clamp(agent.position.x+v.x*speed,-widthU/2+EDGE,widthU/2-EDGE);agent.position.z=clamp(agent.position.z+v.z*speed,-depthU/2+EDGE,depthU/2-EDGE);agent.position.y+=(Math.max(.08,groundHeight(agent.position.x,agent.position.z))+.02-agent.position.y)*Math.min(1,dt*5);agent.rotation.y=Math.atan2(v.x,v.z);gait+=dt*9;
  if(!state.follow){state.follow=true;if(camera.position.distanceTo(controls.target)>40)flyTo(agent.position.clone(),20,true);else flight=null;}}
 const swing=moving?Math.sin(gait)*.55:0;legs[0].rotation.x=swing;legs[1].rotation.x=-swing;arms[0].rotation.x=-swing;arms[1].rotation.x=swing;agent.userData.body.position.y=moving?Math.abs(Math.sin(gait))*.015:Math.sin(clock.elapsedTime*2)*.006;
 if(state.follow&&!flight){const delta=agent.position.clone().sub(controls.target);controls.target.addScaledVector(delta,Math.min(1,dt*7));camera.position.addScaledVector(delta,Math.min(1,dt*7));}}
function insideBusan(){if(!busanBounds)return false;const a=project(busanBounds[0],busanBounds[3]),c=project(busanBounds[2],busanBounds[1]);return agent.position.x>=a.x&&agent.position.x<=c.x&&agent.position.z>=a.z&&agent.position.z<=c.z;}
function updateNearby(){if(state.riding)return;let next=null,best=Infinity;for(const p of Object.values(places)){const q=project(p.lon,p.lat),d=Math.hypot(agent.position.x-q.x,agent.position.z-q.z);if(d<NEAR&&d<best){best=d;next=p.id;}}
 // AGENT-GORGO-13: 부산 상세 지도 범위 안에서는 바로 옆(4km 이내) 장소가 아니면 「부산 상세 지도 · 들어가기」가 우선이다.
 if(places['busan-station']&&insideBusan()&&!(next&&next!=='busan-station'&&best<.4))next='busan-station';if(next===nearby)return;nearby=next;$('work-open').hidden=!next;if(next)$('work-open').textContent=next==='busan-station'?'부산 상세 지도 · 들어가기':places[next].name+' · 들어가기';}
const temp=new THREE.Vector3();
function updateLabels(){const pins=[];const distance=camera.position.distanceTo(controls.target);for(const l of labelItems){if(l.object){temp.copy(l.object.position);temp.y+=.75*l.object.scale.y;}else temp.copy(l.p);temp.project(camera);const off=temp.z>1||temp.z<-1||Math.abs(temp.x)>1.1||Math.abs(temp.y)>1.1;const hide=off||(l.kind===''&&distance>140)||(l.kind==='water'&&distance<25);l.el.style.display=hide?'none':'';if(hide)continue;const x=(temp.x*.5+.5)*innerWidth,y=(-temp.y*.5+.5)*innerHeight;if(l.kind==='pin'){pins.push({l,x,y,w:l.el.offsetWidth,h:l.el.offsetHeight});continue;}l.el.style.left=x+'px';l.el.style.top=y+'px';}pins.sort((a,b)=>a.y-b.y);const placed=[],lines=[];for(const p of pins){let box=null;for(let k=0;k<14&&!box;k++){const dy=(k%2?1:-1)*Math.ceil(k/2)*(p.h+4);const b={x:p.x-p.w/2,y:p.y-p.h-10+dy,w:p.w,h:p.h};if(!placed.some(o=>b.x<o.x+o.w+4&&b.x+b.w+4>o.x&&b.y<o.y+o.h+2&&b.y+b.h+2>o.y))box=b;}box||={x:p.x-p.w/2,y:p.y-p.h-10,w:p.w,h:p.h};placed.push(box);p.l.el.style.transform='none';p.l.el.style.left=box.x+'px';p.l.el.style.top=box.y+'px';const ln=document.createElementNS('http://www.w3.org/2000/svg','line');ln.setAttribute('x1',p.x);ln.setAttribute('y1',p.y);ln.setAttribute('x2',p.x);ln.setAttribute('y2',clamp(p.y,box.y,box.y+box.h));lines.push(ln);}leaders.replaceChildren(...lines);}
function animate(now){requestAnimationFrame(animate);const dt=Math.min(MAX_DT,Math.max(0,(now-last)/1000||.016));last=now;const t=clock.getElapsedTime();
 if(flight)stepFlight(t);
 if(state.riding)stepRide(dt);
 // 부산과 이어지는 동안에는 고르고·랜드마크를 거리에 맞춰 줄인다. 부산 구도(거리≈5)에서 전국 축척 그대로면 화면을 가린다.
 if(state.leaving||state.arriving){const f=clamp(camera.position.distanceTo(controls.target)/26,.08,1);agent.scale.setScalar(1.25*f);scaleF=f;for(const g of landmarkList)g.scale.setScalar(.95*f);if(state.arriving&&f>=1&&!flight)state.arriving=false;}
 updateAgent(dt);placeTrain();controls.update();for(const s of spinners)s.rotor.rotation.z+=dt*s.speed;
 renderer.render(scene,camera);
 if(state.leaving&&!flight&&!state.left){state.left=true;window.GorgoHandoff?window.GorgoHandoff.leave(renderer.domElement,'busan','./?map=busan'):location.href='./?map=busan';}
 if(!state.firstFrame){state.firstFrame=true;requestAnimationFrame(()=>window.GorgoHandoff?.finish());}
 updateLabels();updateNearby();state.frames++;state.elapsed+=dt;if(state.elapsed>1){state.fps=Math.round(state.frames/state.elapsed);state.frames=0;state.elapsed=0;}}
function setupEvents(zonesForPins){
 initAiUI({clearMovement});setSpeedMode(state.speedMode);$('speed-mode').onclick=()=>setSpeedMode(state.speedMode==='fast'?'normal':'fast');
 $('work-open').onclick=()=>{if(nearby==='busan-station')enterBusan();else if(nearby)openPlace(nearby);};
 const far=new THREE.Vector3(1e6,0,1e6);
 initRecordsUI({clearMovement,toast,getPosition:()=>agent.position,project:z=>{const p=Object.values(places).find(p=>p.zone===z.id);return p?project(p.lon,p.lat):far;},pickPoint:(cx,cy)=>{const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-cy/innerHeight*2+1),camera);return ray.intersectObject(terrain,false)[0]?.point;},
  ensurePin:z=>{const p=Object.values(places).find(p=>p.zone===z.id);if(!p)return;const el=labelItems.find(l=>l.el.dataset.place===p.id)?.el;if(el)el.dataset.recordsZone=z.id;},walkToZone:z=>{const p=Object.values(places).find(p=>p.zone===z.id);if(!p)return;moveTarget=project(p.lon,p.lat);}});
 const list=document.querySelector('.travel-list');list.replaceChildren();
 for(const p of Object.values(places)){if(p.id==='busan-station')continue;const b=document.createElement('button');b.dataset.travel=p.id;b.innerHTML='<b></b><small></small>';b.querySelector('b').textContent=p.name+(p.unverified?' (위치 확인 필요)':'');b.querySelector('small').textContent=p.region||'';list.append(b);}
 const home=document.createElement('button');home.dataset.travel='home';home.className='travel-home';home.innerHTML='<b>한반도 전체 보기</b><small>지도 처음 화면</small>';list.append(home);
 const busan=document.createElement('button');busan.className='travel-home travel-switch';busan.innerHTML='<b>부산 상세 지도로 전환</b><small>부산 범위로 확대 · 업무 거점 9곳</small>';busan.onclick=()=>enterBusan();list.prepend(busan);
 document.querySelector('#travel-title').textContent='어디로 갈까요? · 한반도';
 // 전국 지도의 이동은 기차다: 목록에서 장소를 고르면 그 장소까지 기차로 달린다.
 list.querySelectorAll('[data-travel]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.travel;if(id==='home')travelTo('home');else{$('travel-dialog').close();rideTo(id);}}));
 $('map-switch').textContent='부산 상세 지도로';$('map-switch').setAttribute('aria-label','부산 상세 지도로 전환');$('map-switch').onclick=()=>enterBusan();
 $('travel-open').onclick=()=>{clearMovement();$('travel-dialog').showModal();};$('travel-close').onclick=()=>$('travel-dialog').close();
 addEventListener('keydown',e=>{const k=moveKey(e);inputLog.push({t:Math.round(performance.now()),code:e.code,k});if(inputLog.length>40)inputLog.shift();if(blocked()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;if(k){e.preventDefault();keys.add(k);moveTarget=null;}});
 addEventListener('keyup',e=>{const k=moveKey(e);if(k)keys.delete(k);});addEventListener('blur',()=>{keys.clear();mobileKeys.clear();});document.addEventListener('visibilitychange',()=>{keys.clear();mobileKeys.clear();last=performance.now();});
 const el=renderer.domElement,downs=new Map();
 // 창을 활성화하려고 누른 첫 클릭(로드 직후·창 포커스 직후)은 걷기 명령으로 받지 않는다.
 let quietUntil=performance.now()+1200;addEventListener('focus',()=>{quietUntil=performance.now()+400;});
 el.addEventListener('pointerdown',e=>{downs.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now(),multi:downs.size>0,quiet:performance.now()<quietUntil||!document.hasFocus()});if(downs.size>1)downs.forEach(d=>d.multi=true);});
 el.addEventListener('pointerup',e=>{const d=downs.get(e.pointerId);downs.delete(e.pointerId);if(!d||d.multi||d.quiet||e.button>0||Math.hypot(e.clientX-d.x,e.clientY-d.y)>CLICK_SLOP||performance.now()-d.t>CLICK_MS)return;walkTo(e.clientX,e.clientY);});
 el.addEventListener('pointercancel',e=>downs.delete(e.pointerId));
 document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);mobileKeys.add(b.dataset.move);});for(const ev of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>mobileKeys.delete(b.dataset.move));});
 controls.addEventListener('start',()=>{flight=null;state.follow=false;});addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});}

export async function initKorea(){
 try{document.title='에이전트 고르고의 모험 · 한반도';document.body.classList.add('map-korea');
  const css=document.createElement('link');css.rel='stylesheet';css.href='korea.css';document.head.append(css);
  const load=async(u,bin)=>{const r=await fetch(u);if(!r.ok)throw Error(u+' '+r.status);return bin?r.arrayBuffer():r.json();};
  const [m,hb,lb,pl,cat,zones,bm,wps]=await Promise.all([load('data/korea-meta.json'),load('data/korea-terrain.bin',1),load('data/korea-land.bin',1),load('data/korea-places.json'),load('data/content-catalog.json'),load('data/zones.json'),load('data/sources.json'),load('data/workpoints.json')]);
  if(Array.isArray(bm?.bounds)&&bm.bounds.length===4)busanBounds=bm.bounds;
  meta=m;heights=new Int16Array(hb);land=new Uint8Array(lb);catalog=cat;if(heights.length!==(meta.nx+1)*(meta.nz+1)||land.length!==heights.length)throw Error('Korea terrain size mismatch');
  const regions={cheomseongdae:'경북 경주',cheongwadae:'서울 종로','icheon-semi':'경기 이천','asan-display':'충남 아산','pohang-steel':'경북 포항','ulsan-battery':'울산 울주','busan-science':'부산 기장','kori-nuclear':'부산 기장','busan-station':'부산',jindo:'전남 진도'};
  for(const p of pl){if(typeof p.lon!=='number'||typeof p.lat!=='number')continue;places[p.id]={...p,region:regions[p.id]||''};}
  for(const z of zones)if(z.map==='korea'&&places[z.place])places[z.place].zone=z.id;
  widthU=(meta.bounds[2]-meta.bounds[0])*KX();depthU=(meta.bounds[3]-meta.bounds[1])*KZ();
  $('loading-status').textContent='한반도 지도를 준비하는 중';
  scene=new THREE.Scene();scene.background=new THREE.Color('#b3d3cb');scene.fog=new THREE.Fog('#b3d3cb',120,320);
  camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,600);
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.23;$('scene').appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight('#fff5dc','#7daba0',2.5));const sun=new THREE.DirectionalLight('#ffedcc',3.0);sun.position.set(-60,120,64);scene.add(sun);
  controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=3;controls.maxDistance=180;controls.maxPolarAngle=Math.PI*.46;controls.minPolarAngle=.015;controls.screenSpacePanning=false;controls.maxTargetRadius=Math.hypot(widthU,depthU)/2+5;
  makeTerrain();if(busanBounds)makeBusanOutline();
  const landmarks={};for(const p of Object.values(places))landmarks[p.id]=landmark(p);landmarkList=Object.values(landmarks);
  if(places.jindo){const wf=windFarm(places.jindo);state.windFarm=wf?{turbines:wf.turbines.length,center:[+wf.center.x.toFixed(2),+wf.center.z.toFixed(2)]}:null;}
  leaders=document.createElementNS('http://www.w3.org/2000/svg','svg');leaders.classList.add('pin-leaders');$('labels').prepend(leaders);for(const c of CITY_LABELS)addLabel(...c);
  for(const p of Object.values(places))addLabel(p.name+(p.unverified?' ·확인 필요':''),p.lon,p.lat,'pin',p.id);
  // AGENT-GORGO-13 (박사 11-05): 전국 지도에서도 고르고는 센텀 스카이비즈 사무실 자리에 가만히 서서 시작한다.
  const busan=places['busan-station'],office=Array.isArray(wps)?wps.find(w=>w.id==='skybiz'):null;
  makeAgent(office?geoPoint(office.lon,office.lat,.02):busan?geoPoint(busan.lon,busan.lat,.02).add(new THREE.Vector3(.5,0,.5)):new THREE.Vector3());
  agent.visible=false;agent.position.y=Math.max(.08,groundHeight(agent.position.x,agent.position.z))+.02;const c=buildCar();car={parts:[c],spacing:0,wheels:c.userData.wheels};ktx=buildKTX();for(const part of[...car.parts,...ktx.parts])scene.add(part);setMode('car');placeTrain();
  targetMark=new THREE.Mesh(new THREE.RingGeometry(.1,.15,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:'#ff7a45',transparent:true,opacity:.85,depthTest:false}));targetMark.renderOrder=11;targetMark.visible=false;scene.add(targetMark);
  buildDialogs();setupEvents();
  // 부산 상세 지도에서 나왔다면 부산 처음 화면과 같은 구도에서 시작해 한반도로 줄어든다. 아니면 한반도 전체에서 시작한다.
  const fromBusan=window.GorgoHandoff?.pending?.from==='busan'&&busanBounds;
  if(fromBusan){state.arriving=true;const f=busanFrame();controls.target.copy(f.target);camera.position.copy(f.target).add(new THREE.Vector3(f.distance*.14,f.distance*.72,f.distance*.76));}
  else{const d=26;controls.target.copy(agent.position);camera.position.copy(agent.position).add(new THREE.Vector3(d*.14,d*.72,d*.76));state.follow=true;}controls.update();
  state.ready=true;window.__gorgoEarth={state,places,agent,camera,controls,project,elevation,groundHeight,travelTo,openPlace,openContent,catalog,inputLog,walkTo,landmarks,enterBusan,busanFrame,busanBounds,rideTo,train:()=>veh&&{mode,parts:veh.parts.length,scale:vehScale(),head:veh.parts[0].position.toArray()},trainTo,riding:()=>state.riding&&{id:state.riding.id},lastRide:()=>state.lastRide,extent:()=>({hw:widthU/2,hd:depthU/2}),map:'korea'};
  $('loading').classList.add('done');last=performance.now();requestAnimationFrame(animate);
  if(fromBusan){setTimeout(()=>flyTo(agent.position.clone(),26,true,2.2,true),650);toast('전국 지도 · 부산으로 돌아가려면 부산 핀에서 들어가기');}
  else{toast('전국 지도 · 방향키 = 자동차 · 지도나 장소 핀을 누르면 고속열차로 갑니다');}
 }catch(error){console.error(error);$('loading-status').textContent='한반도 지도를 불러오지 못했어요. ('+error.message+')';$('loading').dataset.error=error.message;}}

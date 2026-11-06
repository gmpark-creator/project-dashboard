import * as THREE from 'three';
import {initAiUI} from './ai-ui.js';
import {initShips} from './ships.js';
import { OrbitControls } from './vendor/OrbitControls.js';
import { initCrewWorkbench, openCrewWorkbench } from './crew-workbench.js';
import { initRecordsUI, openZoneRecords, hasRecordZone } from './records-ui.js';
import { buildCar, Ride, shortestPath } from './ride.js';
import { openInterior } from './interior.js';
import { openConcierge, closeConcierge, conciergeInfo, npcInfo, npcCached, npcChecked, hasPersonas } from './concierge.js';

const $ = id => document.getElementById(id);
const clamp = THREE.MathUtils.clamp;
const state = { ready:false, follow:false, labels:true, selected:null, frames:0, elapsed:0, fps:0, speedMode:'normal' };
try { if(localStorage.getItem('gorgo.speedMode')==='fast')state.speedMode='fast'; } catch {}
const WORK_POINTS={},places={};
const LEGACY_PLACES={jungang:'imm-jungang',gamcheon:'imm-gamcheon',centum:'skybiz'};
let nearbyWork=null,shipsLayer=null,seaFx=null;
function workpointName(p){return p.name+(p.unverified?' (위치 확인 필요)':'');}
function configureWorkpoints(points){
  const list=document.querySelector('.travel-list');
  for(const p of points){places[p.id]=p;WORK_POINTS[p.id]={name:p.name,radius:.75};const b=document.createElement('button'),name=document.createElement('b'),detail=document.createElement('small');b.dataset.travel=p.id;name.textContent=workpointName(p);detail.textContent=p.docTypes.slice(0,2).join(' · ');b.title=[p.address,p.locationNote].filter(Boolean).join(' — ');b.append(name,detail);list.append(b);}
  const b=document.createElement('button');b.dataset.travel='home';b.className='travel-home';b.innerHTML='<b>부산 전체 보기</b><small>지도 처음 화면</small>';list.append(b);
  const k=document.createElement('button');k.type='button';k.className='travel-home travel-korea travel-switch';k.innerHTML='<b>한반도 지도로 전환</b><small>부산에서 한반도 전체로 줄어듭니다</small>';k.onclick=()=>leaveToKorea();list.prepend(k);
}

let scene, camera, renderer, controls, terrain, heights, landMask, meta, roadData, agent, legs=[], arms=[];
let pinLeaders;
let widthKm, depthKm, flight=null, toastTimer, last=0, gait=0;
const labelItems=[], keys=new Set(), mobileKeys=new Set(), boats=[], animated=[];
const buildingGrid=new Map(),landmarks={};
const EDGE=.05; // keep Gorgo just inside the terrain mesh
// FIX-2: movement uses real elapsed time up to MAX_DT (Codex #3: the old .05 cap cut walking to ~7% at software-render fps). Longer stalls are clamped; tab return resets the clock.
const MAX_DT=.5,CLICK_SLOP=6,CLICK_MS=450;
const KEY_CODES={KeyW:"up",ArrowUp:"up",KeyS:"down",ArrowDown:"down",KeyA:"left",ArrowLeft:"left",KeyD:"right",ArrowRight:"right",ShiftLeft:"shift",ShiftRight:"shift"};
const KEY_FALLBACK={w:"up","ㅈ":"up",arrowup:"up",s:"down","ㄴ":"down",arrowdown:"down",a:"left","ㅁ":"left",arrowleft:"left",d:"right","ㅇ":"right",arrowright:"right",shift:"shift"};
const inputLog=[];let moveTarget=null,targetMark;
const clock = new THREE.Clock();
const matCache=new Map();
const material=(color, extra={})=>{const k=color+JSON.stringify(extra); if(!matCache.has(k))matCache.set(k,new THREE.MeshStandardMaterial({color,roughness:.88,...extra}));return matCache.get(k);};
const rand=(x,z,s=0)=>{const n=Math.sin(x*127.1+z*311.7+s*73.1)*43758.5453;return n-Math.floor(n);};

function project(lon,lat){return new THREE.Vector3((lon-(meta.bounds[0]+meta.bounds[2])/2)*91.0,0,((meta.bounds[1]+meta.bounds[3])/2-lat)*111.195);}
function elevation(x,z){
  const u=(x/widthKm+.5)*meta.nx, v=(z/depthKm+.5)*meta.nz;
  if(u<0||v<0||u>meta.nx||v>meta.nz)return -20;
  if(!landMask[Math.round(v)*(meta.nx+1)+Math.round(u)])return -20;
  const ix=Math.min(meta.nx-1,Math.floor(u)),iz=Math.min(meta.nz-1,Math.floor(v));
  const fx=u-ix,fz=v-iz,s=meta.nx+1;
  return Math.max(2,THREE.MathUtils.lerp(THREE.MathUtils.lerp(heights[iz*s+ix],heights[iz*s+ix+1],fx),THREE.MathUtils.lerp(heights[(iz+1)*s+ix],heights[(iz+1)*s+ix+1],fx),fz)/4);
}
function groundHeight(x,z){const h=elevation(x,z);return h<=.65?-.035:.035+h*.00215;}
function addFootprint(x,z,w,d,rotation=0){
  const r={x,z,w:w/2,d:d/2,c:Math.cos(rotation),s:Math.sin(rotation)},extent=Math.max(w,d);
  for(let iz=Math.floor((z-extent)/.25);iz<=Math.floor((z+extent)/.25);iz++)for(let ix=Math.floor((x-extent)/.25);ix<=Math.floor((x+extent)/.25);ix++){const key=ix+','+iz;if(!buildingGrid.has(key))buildingGrid.set(key,[]);buildingGrid.get(key).push(r);}
}
function canWalk(x,z){
  if(elevation(x,z)<=1)return false;
  const nearby=buildingGrid.get(Math.floor(x/.25)+','+Math.floor(z/.25))||[];
  return !nearby.some(r=>{const dx=x-r.x,dz=z-r.z;return Math.abs(dx*r.c-dz*r.s)<r.w+.025&&Math.abs(dx*r.s+dz*r.c)<r.d+.025;});
}
// AGENT-GORGO-34 (owner 2026-11-05): 육지 위만 이동. 바다는 못 가고, 다리(OSM bridge 도로 + 광안대교·부산항대교) 위는 지나갈 수 있다.
const bridgeGrid=new Map();
function addBridgeSeg(a,b,y,half){const s={ax:a.x,az:a.z,bx:b.x,bz:b.z,y,half},minX=Math.min(a.x,b.x)-half,maxX=Math.max(a.x,b.x)+half,minZ=Math.min(a.z,b.z)-half,maxZ=Math.max(a.z,b.z)+half;
  for(let iz=Math.floor(minZ/.25);iz<=Math.floor(maxZ/.25);iz++)for(let ix=Math.floor(minX/.25);ix<=Math.floor(maxX/.25);ix++){const k=ix+','+iz;if(!bridgeGrid.has(k))bridgeGrid.set(k,[]);bridgeGrid.get(k).push(s);}}
function bridgeAt(x,z){const list=bridgeGrid.get(Math.floor(x/.25)+','+Math.floor(z/.25));if(!list)return null;let best=null;
  for(const s of list){const dx=s.bx-s.ax,dz=s.bz-s.az,l2=dx*dx+dz*dz;let t=l2?((x-s.ax)*dx+(z-s.az)*dz)/l2:0;t=t<0?0:t>1?1:t;if(Math.hypot(x-s.ax-dx*t,z-s.az-dz*t)<s.half&&(best===null||s.y>best))best=s.y;}return best;}
const onLand=(x,z)=>elevation(x,z)>1;
function geoPoint(lon,lat,lift=0){const p=project(lon,lat);p.y=Math.max(.045,groundHeight(p.x,p.z))+lift;return p;}
function cube(parent,w,h,d,x,y,z,color,extra={}){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color,extra));m.position.set(x,y,z);parent.add(m);return m;}
function cylinder(parent,rt,rb,h,x,y,z,color,n=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,n),material(color));m.position.set(x,y,z);parent.add(m);return m;}
function sphere(parent,r,x,y,z,color){const m=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),material(color));m.position.set(x,y,z);parent.add(m);return m;}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3300);}

function makeTerrain(){
  const geo=new THREE.PlaneGeometry(widthKm,depthKm,meta.nx,meta.nz);geo.rotateX(-Math.PI/2);
  const p=geo.attributes.position, colors=new Float32Array(p.count*3);
  const low=new THREE.Color('#e7ddbb'), mid=new THREE.Color('#8eaf72'), high=new THREE.Color('#608d68'), sand=new THREE.Color('#e9d5a6'), sea=new THREE.Color('#8dc9c4');
  const c=new THREE.Color();
  for(let i=0;i<p.count;i++){
    const h=landMask[i]?Math.max(2,heights[i]/4):-20,x=p.getX(i),z=p.getZ(i);p.setY(i,h<=.65?-.035:.035+h*.00215);
    if(h<=.65)c.copy(sea);else if(h<5)c.copy(sand);else if(h<65)c.copy(low).lerp(mid,clamp((h-22)/100,0,.5));else c.copy(mid).lerp(high,clamp((h-65)/420,0,1));
    c.multiplyScalar(.97+rand(x,z)*.045);colors.set([c.r,c.g,c.b],i*3);
  }
  geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.computeVertexNormals();
  terrain=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0}));terrain.receiveShadow=true;scene.add(terrain);
  const water=new THREE.Mesh(new THREE.PlaneGeometry(150,150,1,1),new THREE.MeshStandardMaterial({color:'#8ac8c6',roughness:.52,metalness:.08}));water.rotation.x=-Math.PI/2;water.position.y=-.007;scene.add(water);
  seaFx=makeSeaFx(water);
  // Small, restrained glints make the harbour feel alive without obscuring its outline.
  const glints=[];for(let i=0;i<450;i++){const x=(rand(i,1)-.5)*widthKm,z=(rand(i,2)-.5)*depthKm;if(elevation(x,z)>.5)continue;const l=.06+rand(i,3)*.13;glints.push(x,.006,z,x+l,.006,z);}
  const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(glints,3));scene.add(new THREE.LineSegments(gg,new THREE.LineBasicMaterial({color:'#c2e4dc',transparent:true,opacity:.45})));
}

// G35 바다 고급화: 수면에 느리게 흐르는 잔물결 무늬(셰이더) + 해안을 따라 숨 쉬듯 밀려오는 흰 거품 띠(육지 격자에서 해안선을 뽑아 그린 텍스처).
function makeSeaFx(water){
  const uTime={value:0};
  water.material.onBeforeCompile=sh=>{sh.uniforms.uTime=uTime;
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vSeaW;').replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvSeaW=(modelMatrix*vec4(transformed,1.0)).xyz;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform float uTime;varying vec3 vSeaW;')
      .replace('#include <color_fragment>',`#include <color_fragment>
      {vec2 q=vSeaW.xz;float a=sin(q.x*9.0+q.y*3.0+uTime*.9)*sin(q.y*7.0-q.x*2.0-uTime*.7);float b=sin((q.x-q.y)*23.0+uTime*1.6)*sin((q.x+q.y)*17.0-uTime*1.2);
       float r=smoothstep(.55,.95,a*.6+b*.4);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.86,.95,.93),r*.32);diffuseColor.rgb*=.97+.05*sin(q.x*1.3+q.y*.9+uTime*.25);}`);};
  water.material.needsUpdate=true;
  // 해안 거품: 바다 칸 중 육지에서 1~3칸 안을 밝게, 부드럽게 번지게.
  const W=meta.nx+1,Hh=meta.nz+1,c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d'),img=x.createImageData(W,Hh),dist=new Uint8Array(W*Hh).fill(255),q=[];
  for(let i=0;i<W*Hh;i++)if(landMask[i]){dist[i]=0;q.push(i);}
  for(let h=0;h<q.length;h++){const i=q[h],d=dist[i];if(d>=3)continue;const cx=i%W,cy=(i/W)|0;for(const [dx,dy] of[[1,0],[-1,0],[0,1],[0,-1]]){const X=cx+dx,Y=cy+dy;if(X<0||Y<0||X>=W||Y>=Hh)continue;const k=Y*W+X;if(dist[k]>d+1){dist[k]=d+1;q.push(k);}}}
  for(let i=0;i<W*Hh;i++){const d=dist[i],a=d===1?255:d===2?150:d===3?60:0;img.data[i*4]=255;img.data[i*4+1]=255;img.data[i*4+2]=250;img.data[i*4+3]=a;}
  x.putImageData(img,0,0);const c2=document.createElement('canvas');c2.width=W*2;c2.height=Hh*2;const x2=c2.getContext('2d');x2.filter='blur(1.2px)';x2.drawImage(c,0,0,c2.width,c2.height);
  const tex=new THREE.CanvasTexture(c2);tex.colorSpace=THREE.SRGBColorSpace;tex.minFilter=THREE.LinearFilter;
  const foamMat=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.5,color:'#ffffff'});
  const foam=new THREE.Mesh(new THREE.PlaneGeometry(widthKm,depthKm,1,1),foamMat);foam.rotation.x=-Math.PI/2;foam.position.y=-.005;foam.renderOrder=1;foam.raycast=()=>{};foam.name='shore-foam';scene.add(foam);
  return {update(t){uTime.value=t;foamMat.opacity=.42+.16*Math.sin(t*1.1);},foam};
}

function makeRoads(){
  const arrays={main:[],small:[]};
  function strip(a,b,w,arr,bridge){
    const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);if(len<.0001)return;const ox=-dz/len*w/2,oz=dx/len*w/2;
    const ya=bridge?Math.max(.11,a.y+.01):a.y+.016,yb=bridge?Math.max(.11,b.y+.01):b.y+.016;
    arr.push(a.x+ox,ya,a.z+oz,a.x-ox,ya,a.z-oz,b.x+ox,yb,b.z+oz,b.x+ox,yb,b.z+oz,a.x-ox,ya,a.z-oz,b.x-ox,yb,b.z-oz);
  }
  for(const r of roadData){
    if(r.tunnel)continue;const major=['motorway','trunk','primary'].includes(r.kind);const arr=major?arrays.main:arrays.small;
    for(let i=1;i<r.points.length;i++){
      const a=geoPoint(...r.points[i-1]),b=geoPoint(...r.points[i]);if(Math.abs(a.x)>widthKm/2||Math.abs(a.z)>depthKm/2||Math.abs(b.x)>widthKm/2||Math.abs(b.z)>depthKm/2)continue;
      strip(a,b,major?.047:.025,arr,r.bridge);if(r.bridge)addBridgeSeg(a,b,Math.max(.11,(a.y+b.y)/2+.01),major?.05:.035);
    }
  }
  for(const [k,arr]of Object.entries(arrays)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();const mesh=new THREE.Mesh(g,material(k==='main'?'#f6ead3':'#eee5cc',{side:THREE.DoubleSide}));scene.add(mesh);}
}

function makeCity(){
  const specs=[],treeSpecs=[];
  for(let ri=0;ri<roadData.length;ri++){
    const r=roadData[ri];if(r.bridge||r.tunnel||r.kind==='motorway')continue;
    for(let i=1;i<r.points.length;i+=2){
      if(rand(ri,i)>.46)continue;
      const p=project(...r.points[i]),q=project(...r.points[i-1]),len=p.distanceTo(q);if(len<.001)continue;
      for(const side of[-1,1]){
        const x=p.x+(q.z-p.z)/len*.075*side,z=p.z-(q.x-p.x)/len*.075*side,h=elevation(x,z);
        if(h<2||h>150||Math.abs(x)>widthKm*.495||Math.abs(z)>depthKm*.495)continue;
        const v=rand(x,z,2),tall=(x>4&&z<0&&v>.7);
        specs.push({x,z,y:groundHeight(x,z),w:.045+v*.055,d:.045+rand(x,z,3)*.055,h:tall?.24+v*.22:.045+v*.13,rot:Math.atan2(q.x-p.x,q.z-p.z),c:Math.floor(rand(x,z,4)*6)});
      }
    }
  }
  const palette=['#f1e6cb','#e8d9b8','#d9ded0','#e7c3ae','#d5cdb7','#ead9c4'];
  const geometry=new THREE.BoxGeometry(1,1,1),buildings=new THREE.InstancedMesh(geometry,material('#ffffff'),specs.length),roofs=new THREE.InstancedMesh(geometry,material('#ffffff'),specs.length);
  const dummy=new THREE.Object3D(),color=new THREE.Color();
  specs.forEach((p,i)=>{addFootprint(p.x,p.z,p.w,p.d,p.rot);dummy.position.set(p.x,p.y+p.h/2,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.rotation.y=p.rot;dummy.updateMatrix();buildings.setMatrixAt(i,dummy.matrix);buildings.setColorAt(i,color.set(palette[p.c]));dummy.position.y=p.y+p.h+.008;dummy.scale.y=.017;dummy.updateMatrix();roofs.setMatrixAt(i,dummy.matrix);roofs.setColorAt(i,color.set(p.h>.2?'#a5bfc0':p.c%3===0?'#bf8169':'#b9bca3'));});
  scene.add(buildings,roofs);state.buildings=specs.length;landmarks.city=buildings;
  for(let i=0;i<13500;i++){
    const x=(rand(i,11)-.5)*widthKm,z=(rand(i,12)-.5)*depthKm,h=elevation(x,z);
    if(h<60||h>750||rand(x,z,14)>.76)continue;treeSpecs.push({x,z,y:groundHeight(x,z),size:.045+rand(x,z,15)*.07});
  }
  const trees=new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,5),material('#ffffff'),treeSpecs.length);
  treeSpecs.forEach((p,i)=>{dummy.position.set(p.x,p.y+p.size*.6,p.z);dummy.scale.set(p.size*.6,p.size*1.5,p.size*.6);dummy.rotation.set(0,rand(p.x,p.z)*6.28,0);dummy.updateMatrix();trees.setMatrixAt(i,dummy.matrix);trees.setColorAt(i,color.set(['#699568','#79a371','#85ab75','#5e8e68'][i%4]));});scene.add(trees);state.trees=treeSpecs.length;
}

function addLandmark(lon,lat,type){
  const g=new THREE.Group(),p=geoPoint(lon,lat);g.position.copy(p);scene.add(g);
  if(type!=='tower')addFootprint(p.x,p.z,type==='station'?.64:type==='office'?.36:.54,type==='station'?.27:.34);
  if(type==='tower'){
    cylinder(g,.10,.15,.10,0,.05,0,'#d6c8a9');cylinder(g,.035,.065,.72,0,.45,0,'#f6f0dc');cylinder(g,.16,.11,.10,0,.82,0,'#f6edd2');cylinder(g,.11,.16,.10,0,.92,0,'#a7bdbc');cylinder(g,.095,.10,.055,0,1,0,'#e8dfcb');cylinder(g,.005,.008,.18,0,1.10,0,'#de8766');
  }else if(type==='station'){
    cube(g,.64,.18,.27,0,.09,0,'#e7e1c9');cube(g,.71,.045,.33,0,.20,0,'#8ca7a2');cube(g,.50,.075,.04,0,.11,.15,'#9db9bc');cube(g,.11,.24,.07,0,.12,.17,'#ecead5');
  }else if(type==='spot'){
    // AGENT-GORGO-19 콘텐츠 장소: 업무 거점과 구별되는 작은 전시관(둥근 지붕 + 깃발)
    cube(g,.34,.16,.30,0,.08,0,'#f3ead6');const dome=new THREE.Mesh(new THREE.SphereGeometry(.15,16,8,0,Math.PI*2,0,Math.PI/2),material('#8fb7b0'));dome.position.y=.16;g.add(dome);cylinder(g,.006,.006,.3,.12,.31,.1,'#6b8179');cube(g,.09,.05,.005,.165,.42,.1,'#e8784e');
  }else if(type==='office'){
    cube(g,.27,.60,.24,0,.30,0,'#a1c4c5');cube(g,.30,.04,.27,0,.62,0,'#f4ead2');for(let i=1;i<6;i++)cube(g,.28,.014,.25,0,i*.10,0,'#e9ead8');cube(g,.36,.13,.34,0,.065,.025,'#ede6cf');cube(g,.11,.10,.015,0,.05,.202,'#557f86');cube(g,.05,.08,.015,0,.52,.13,'#e88b63');
  }else{
    cube(g,.54,.24,.31,0,.12,0,'#f1e8d2');cube(g,.59,.045,.36,0,.26,0,'#7d9992');for(let x=-2;x<=2;x++)cube(g,.042,.075,.015,x*.09,.16,.162,'#9bb8bc');cube(g,.12,.14,.025,0,.07,.17,'#6f969d');cube(g,.18,.025,.10,0,.02,.20,'#d1c9b4');cylinder(g,.004,.004,.37,-.25,.18,.20,'#6b8179');cube(g,.09,.055,.005,-.205,.32,.20,'#f6f0df');
  }
  return g;
}
function line(points,color,radius=.008){const curve=new THREE.CatmullRomCurve3(points);const m=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(8,points.length*5),radius,4,false),material(color));scene.add(m);return m;}
function bridge(aLL,bLL,type){
  const a=project(...aLL),b=project(...bLL);a.y=b.y=.19;const len=a.distanceTo(b),dir=b.clone().sub(a).normalize(),side=new THREE.Vector3(-dir.z,0,dir.x);
  addBridgeSeg(a,b,.19,.075);
  const deck=new THREE.Mesh(new THREE.BoxGeometry(.10,.055,len),material('#e9e2c9'));deck.position.copy(a).add(b).multiplyScalar(.5);deck.lookAt(b);scene.add(deck);
  for(const t of[.32,.68]){
    const p=a.clone().lerp(b,t);for(const s of[-1,1]){const q=p.clone().addScaledVector(side,s*.065);const g=new THREE.Group();g.position.copy(q);scene.add(g);cube(g,.035,.72,.045,0,.23,0,'#eae5d1');}
    const crossA=p.clone().addScaledVector(side,-.065),crossB=p.clone().addScaledVector(side,.065);crossA.y=crossB.y=.65;line([crossA,crossB],'#eae5d1',.015);
  }
  for(const s of[-1,1]){
    if(type==='suspension'){
      const pts=[];for(let i=0;i<=40;i++){const t=i/40,p=a.clone().lerp(b,t).addScaledVector(side,s*.065);p.y=t<.32?.20+(t/.32)*.50:t>.68?.70-((t-.68)/.32)*.50:.70-Math.sin((t-.32)/.36*Math.PI)*.32;pts.push(p);if(i%3===0){const q=p.clone();q.y=.21;line([q,p],'#f5f0db',.003);}}line(pts,'#f7efd5',.008);
    }else{
      for(const t of[.32,.68])for(let i=0;i<=12;i++){const p=a.clone().lerp(b,t).addScaledVector(side,s*.065);p.y=.72;const q=a.clone().lerp(b,clamp(t+(i-6)*.036,0,1)).addScaledVector(side,s*.065);q.y=.21;line([p,q],'#f8e9cf',.0035);}
    }
  }
}
function makeHarbor(){
  const quays=[[129.050,35.111],[129.060,35.118],[129.075,35.108],[129.080,35.105]];
  for(const [lon,lat]of quays)for(let k=0;k<5;k++){
    const g=new THREE.Group();g.position.copy(geoPoint(lon+k*.0012,lat));g.rotation.y=-.35;scene.add(g);const c=k%2?'#d59174':'#c8b56f';
    for(const x of[-.075,.075])cube(g,.02,.28,.025,x,.14,0,c);cube(g,.24,.025,.035,0,.28,0,c);cube(g,.025,.13,.025,0,.32,0,c);cube(g,.025,.025,.36,0,.39,-.10,c);cube(g,.012,.25,.012,0,.25,-.25,'#87948a');
  }
  const lanes=[[129.081,35.101],[129.104,35.075],[129.148,35.115],[129.012,35.068],[129.176,35.139]];
  for(let i=0;i<lanes.length;i++){
    const g=new THREE.Group(),p=project(...lanes[i]);g.position.set(p.x,.025,p.z);g.rotation.y=i*1.3;scene.add(g);cube(g,.11,.075,.41,0,.05,0,'#f4eddb');cube(g,.10,.025,.37,0,.018,0,'#697d82');cube(g,.085,.09,.10,0,.12,-.11,'#f7f0da');for(let k=0;k<4;k++)cube(g,.085,.055,.05,0,.11,.02+k*.06,['#ce957b','#c6b568','#87a39b'][k%3]);boats.push({g,base:p,phase:i});
  }
}

function makeAgent(){
  const g=new THREE.Group();scene.add(g);const body=new THREE.Group();g.add(body);
  cube(body,.18,.21,.12,0,.27,0,'#344959');cube(body,.07,.15,.015,0,.30,.071,'#f5eddf');cube(body,.028,.12,.02,0,.28,.084,'#cf7359');
  sphere(body,.139,0,.49,.015,'#f1c8a7');const hair=sphere(body,.145,0,.535,-.012,'#3c3b49');hair.scale.y=.72;cube(body,.26,.04,.10,0,.58,.04,'#3c3b49');
  for(const s of[-1,1]){sphere(body,.012,s*.048,.49,.144,'#35404a');const cheek=sphere(body,.019,s*.081,.462,.13,'#e79e8e');cheek.scale.set(1,.5,.3);cube(body,.078,.035,.018,s*.064,.592,.11,'#384758');cube(body,.052,.016,.022,s*.064,.595,.123,'#7faaa9');}
  cube(body,.035,.009,.012,0,.449,.148,'#bb7f70');
  for(const s of[-1,1]){
    const leg=new THREE.Group();leg.position.set(s*.054,.19,0);cube(leg,.065,.14,.07,0,-.065,0,'#324452');cube(leg,.075,.035,.11,0,-.14,.018,'#41414a');body.add(leg);legs.push(leg);
    const arm=new THREE.Group();arm.position.set(s*.12,.35,0);cube(arm,.052,.15,.065,0,-.065,0,'#3b4f5e');sphere(arm,.031,0,-.15,.004,'#f1c8a7');body.add(arm);arms.push(arm);
  }
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.19,24),new THREE.MeshBasicMaterial({color:'#31554b',transparent:true,opacity:.18,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.002;g.add(shadow);g.userData.body=body;
  // AGENT-GORGO-13 (박사 11-05): 고르고는 센텀 스카이비즈 사무실 앞에 가만히 선 채로 시작한다.
  const start=places.skybiz?.spawn||[129.0395,35.1060];g.position.copy(geoPoint(start[0],start[1],.01));
  const desired=g.position.clone();let found=false;
  for(let radius=0;radius<1&&!found;radius+=.025)for(let a=0;a<Math.PI*2;a+=Math.PI/4){const x=desired.x+Math.cos(a)*radius,z=desired.z+Math.sin(a)*radius;if(canWalk(x,z)){g.position.set(x,groundHeight(x,z)+.01,z);found=true;break;}}
  agent=g;addXray(body);addLabel('고르고',start[0],start[1],'agent',null,g);
}

// AGENT-GORGO-4 B1: Gorgo walks through buildings, so draw an x-ray silhouette wherever he is hidden.
// Visible Gorgo pixels mark stencil=1; ghost copies render only where depth is behind something AND stencil!=1.
// All material changes use clones owned by the agent — the shared city material cache is untouched.
const xrayGhosts=[];
function addXray(body){
  const meshes=[];body.traverse(o=>{if(o.isMesh)meshes.push(o);});
  for(const m of meshes){
    m.material=m.material.clone();Object.assign(m.material,{stencilWrite:true,stencilRef:1,stencilFunc:THREE.AlwaysStencilFunc,stencilZPass:THREE.ReplaceStencilOp});
    const ghost=new THREE.Mesh(m.geometry,new THREE.MeshBasicMaterial({color:m.material.color.clone().multiplyScalar(.92),transparent:true,opacity:.9,depthWrite:false,depthFunc:THREE.GreaterDepth,stencilWrite:true,stencilRef:1,stencilFunc:THREE.NotEqualStencilFunc,stencilWriteMask:0}));
    ghost.renderOrder=10;ghost.raycast=()=>{};ghost.userData.xray=true;m.add(ghost);xrayGhosts.push(ghost);
  }
}
function setXray(on){xrayGhosts.forEach(g=>g.visible=on);}
function addLabel(text,lon,lat,kind='',id=null,object=null){
  const el=document.createElement(id?'button':'div');el.className='map-label '+kind;el.textContent=text;if(id){el.dataset.place=id;el.setAttribute('aria-label',text+' 자료');el.addEventListener('click',()=>{if(!driveTo(id)&&!openZoneRecords(id))travelTo(id);});} $('labels').appendChild(el);
  labelItems.push({el,p:geoPoint(lon,lat,kind==='major'?.4:.1),kind,object});
}
function makeLabels(){
  pinLeaders=document.createElementNS('http://www.w3.org/2000/svg','svg');pinLeaders.classList.add('pin-leaders');$('labels').prepend(pinLeaders);
  const all=[['영도',129.055,35.077,'major'],['서면',129.058,35.158,'major'],['해운대',129.160,35.167,'major'],['강서',128.925,35.170,'major'],['낙동강',128.949,35.162,'water'],['을숙도',128.945,35.106,''],['남항',129.023,35.085,'water'],['북항',129.059,35.108,'water'],['수영강',129.124,35.185,'water'],['봉래산',129.055,35.083,''],['황령산',129.082,35.156,''],['장산',129.174,35.190,''],['부산역',129.0425,35.1154,''],['부산타워',129.0326,35.1006,''],['태종대',129.085,35.059,''],['송도',129.018,35.076,''],['다대포',128.969,35.049,''],['감천',129.008,35.097,''],['광안대교',129.129,35.145,''],['부산항대교',129.064,35.105,'']];
  all.forEach(a=>addLabel(...a));for(const p of Object.values(places))addLabel(p.name,p.lon,p.lat,'pin',p.id);
}

function flyTo(target,distance=35,top=false,keepFollow=false,duration=1.65,zoom=false){
  state.follow=keepFollow;
  const end=target.clone().add(top?new THREE.Vector3(.001,distance,.01):new THREE.Vector3(distance*.14,distance*.72,distance*.76));
  flight={start:clock.getElapsedTime(),from:camera.position.clone(),to:end,fromTarget:controls.target.clone(),toTarget:target.clone(),duration:matchMedia('(prefers-reduced-motion: reduce)').matches?.05:duration,zoom};
}
// AGENT-GORGO-12: 줌 비행은 거리를 지수로 보간해 확대·축소 속도가 일정하게 느껴지게 한다.
function stepFlight(t){
  const k=clamp((t-flight.start)/flight.duration,0,1),s=k*k*(3-2*k);controls.target.lerpVectors(flight.fromTarget,flight.toTarget,s);
  if(flight.zoom){const a=flight.from.clone().sub(flight.fromTarget),b=flight.to.clone().sub(flight.toTarget),la=a.length(),lb=b.length();camera.position.copy(controls.target).addScaledVector(a.normalize().lerp(b.normalize(),s).normalize(),Math.exp(THREE.MathUtils.lerp(Math.log(la),Math.log(lb),s)));}
  else camera.position.lerpVectors(flight.from,flight.to,s);
  if(k===1)flight=null;
}
// 부산 → 전국: 부산 전체 구도(처음 화면)까지 물러난 뒤 그 화면을 넘기고 전국 지도로 간다. 전국 지도는 같은 구도에서 시작해 한반도로 줄어든다.
function leaveToKorea(){
  if(state.leaving||state.riding)return;state.leaving=true;clearMovement();for(const d of document.querySelectorAll('dialog[open]'))d.close();
  controls.enabled=false;document.body.classList.add('map-leaving');state.selected=null;
  flyTo(new THREE.Vector3(0,0,1),homeDistance(),false,false,1.4,true);
}
function landingSpot(lon,lat){
  // Teleport lands on open ground near the point when possible; free movement never depends on this.
  const desired=project(lon,lat);
  for(let radius=0;radius<.7;radius+=.04)for(let a=0;a<Math.PI*2;a+=Math.PI/4){const x=desired.x+Math.cos(a)*radius,z=desired.z+Math.sin(a)*radius;if(canWalk(x,z))return new THREE.Vector3(x,groundHeight(x,z)+.01,z);}
  return new THREE.Vector3(desired.x,groundHeight(desired.x,desired.z)+.01,desired.z);
}
// ── AGENT-GORGO-14: 핀을 누르면 고르고가 자동차를 타고 실제 도로망을 따라 빠르게 간다 ─────────
// 도로망 = data/roads.json(OSM) 점들을 이은 그래프. 가장 큰 연결 덩어리(전체 노드의 약 91%)에서만 경로를 찾고,
// 출발·도착은 그 덩어리의 가장 가까운 도로 점으로 붙인다. 터널 구간은 도로가 안 그려져도 지나간다.
let roads=null;
function roadGraph(){
  if(roads)return roads;const idx=new Map(),nodes=[],adj=[];
  const node=(pt,y)=>{const k=pt[0].toFixed(5)+','+pt[1].toFixed(5);let i=idx.get(k);if(i==null){const p=project(pt[0],pt[1]);i=nodes.length;idx.set(k,i);nodes.push(new THREE.Vector3(p.x,y,p.z));adj.push([]);}else nodes[i].y=Math.max(nodes[i].y,y);return i;};
  for(const r of roadData)for(let i=0;i<r.points.length;i++){const g=geoPoint(...r.points[i]),y=r.bridge?Math.max(.11,g.y+.01):g.y+.016,j=node(r.points[i],y);
    if(i){const k=node(r.points[i-1],y),w=Math.hypot(nodes[j].x-nodes[k].x,nodes[j].z-nodes[k].z);adj[j].push([k,w]);adj[k].push([j,w]);}}
  const comp=new Int32Array(nodes.length).fill(-1),sizes=[];for(let i=0;i<nodes.length;i++){if(comp[i]>=0)continue;const c=sizes.length,st=[i];comp[i]=c;let n=0;while(st.length){const u=st.pop();n++;for(const [v]of adj[u])if(comp[v]<0){comp[v]=c;st.push(v);}}sizes.push(n);}
  const main=sizes.indexOf(Math.max(...sizes));roads={nodes,adj,main:nodes.map((_,i)=>i).filter(i=>comp[i]===main)};return roads;
}
function nearestRoad(x,z){const g=roadGraph();let best=-1,bd=Infinity;for(const i of g.main){const n=g.nodes[i],d=(n.x-x)**2+(n.z-z)**2;if(d<bd){bd=d;best=i;}}return best;}
const RIDE_VIEW=8;
function driveTo(id){
  id=LEGACY_PLACES[id]||id;const p=places[id];if(!p||state.leaving)return false;if(state.riding)return true;
  const dest=landingSpot(...p.spawn);clearMovement();for(const d of document.querySelectorAll('dialog[open]'))d.close();
  if(Math.hypot(agent.position.x-dest.x,agent.position.z-dest.z)<WORK_POINTS[id].radius){arrive(id,dest);return true;}
  const g=roadGraph(),a=nearestRoad(agent.position.x,agent.position.z),b=nearestRoad(dest.x,dest.z),path=a>=0&&b>=0?shortestPath(g.adj,a,b):null;
  const pts=[agent.position.clone()];if(path)for(const i of path)pts.push(g.nodes[i].clone());pts.push(dest.clone().setY(dest.y+.005));
  const clean=pts.filter((q,i)=>!i||Math.hypot(q.x-pts[i-1].x,q.z-pts[i-1].z)>1e-4);
  const car=buildCar();scene.add(car);const ride=new Ride(clean,[car],{duration:1,wheels:car.userData.wheels,scale:agent.scale.x*1.4});
  ride.duration=clamp(1.6+ride.length*.12,2,6);
  state.riding={id,ride,car,dest,view:camera.position.distanceTo(controls.target)};state.follow=false;flight=null;agent.visible=false;$('work-open').hidden=true;
  state.lastRide={id,km:+ride.length.toFixed(2),seconds:+ride.duration.toFixed(2),roadNodes:path?path.length:0};
  toast(workpointName(p)+' · 자동차로 이동 중');return true;
}
function stepRide(dt){
  const r=state.riding;r.ride.scale=agent.scale.x*1.4;const done=r.ride.update(dt);agent.position.copy(r.ride.head);
  // 카메라는 차를 따라가며 보기 좋은 거리로 천천히 다가간다(사용자가 돌려 놓은 각도는 유지).
  r.view+=(RIDE_VIEW-r.view)*Math.min(1,dt*2.2);const dir=camera.position.clone().sub(controls.target).normalize();
  controls.target.lerp(r.ride.head,Math.min(1,dt*6));camera.position.copy(controls.target).addScaledVector(dir,r.view);
  if(done){scene.remove(r.car);state.riding=null;arrive(r.id,r.dest);}
}
function arrive(id,dest){agent.position.copy(dest);agent.visible=true;state.selected=id;state.follow=true;nearbyWork=null;updateWorkPoint();toast(workpointName(places[id])+' 도착');openSpot(id);}
// ── AGENT-GORGO-19: 콘텐츠는 그 장소에 가야만 열린다 ─────────────────────
// 업무 거점(place.host)과 콘텐츠 장소(data/busan-spots.json, place.name 일치)에 카탈로그 항목을 묶는다.
let catalog=null;const SPOTS={};
function contentsFor(id){if(!catalog)return[];const p=places[id];return catalog.items.filter(it=>it.place.scope==='busan'&&(it.place.host===id||(p?.spot&&it.place.name===p.name)));}
function contentUrl(item){if(item.src?.url)return item.src.url;if(!item.src?.path)return null;return catalog.source.pagesBase+item.src.path+(item.src.entry||'')+(item.src.query||'');}
function buildPlaceDialogs(){
  const css=document.createElement('link');css.rel='stylesheet';css.href='korea.css';document.head.append(css);
  const place=document.createElement('dialog');place.id='place-dialog';place.className='place-dialog';place.innerHTML='<button class="close" id="place-close" aria-label="장소 창 닫기">×</button><p class="place-kicker" id="place-kicker"></p><h2 id="place-title"></h2><p class="place-note" id="place-note"></p><div id="place-actions" class="place-actions"></div><div id="place-items" class="place-items"></div>';document.body.append(place);
  const view=document.createElement('dialog');view.id='content-dialog';view.className='content-dialog';view.innerHTML='<div class="content-bar"><button id="content-back" type="button">← 고르고로</button><strong id="content-title"></strong><a id="content-external" target="_blank" rel="noopener">새 창으로 열기</a></div><iframe id="content-frame" title="콘텐츠" referrerpolicy="no-referrer"></iframe>';document.body.append(view);
  $('place-close').onclick=()=>place.close();$('content-back').onclick=()=>{view.close();$('content-frame').src='about:blank';};
}
function openContent(item){const url=contentUrl(item);if(!url){toast('아직 연결된 화면이 없습니다.');return;}clearMovement();$('content-title').textContent=item.title;$('content-external').href=url;$('content-frame').src=url;for(const d of document.querySelectorAll('dialog[open]'))d.close();$('content-dialog').showModal();}
// 장소에 도착했을 때(AGENT-GORGO-20): 콘텐츠가 있으면 건물 안(로비)으로 들어가 키오스크에서 연다. 없으면 예전처럼 자료 창.
function openSpot(id){const p=places[id],items=contentsFor(id);if(!p)return;const zoned=hasRecordZone(id),npcZone=zoned?id:(hasPersonas(id)?id:null);if(!items.length&&!zoned){if(!openZoneRecords(id)&&p.spot)toast(p.name+' · 아직 연결된 콘텐츠가 없습니다');return;}
  // AGENT-GORGO-26: 자료 존이 있는 장소(설치형 서버)에는 안내원이 상주한다
  clearMovement();for(const d of document.querySelectorAll('dialog[open]'))d.close();$('work-open').hidden=true;
  openInterior({id,name:p.name,theme:p.spot?'hall':'office',items:items.map(it=>({title:it.title,disabled:!contentUrl(it),open:()=>openContent(it)})),records:zoned?()=>openZoneRecords(id):null,npcs:npcZone?{initial:npcCached(npcZone),checked:npcChecked(),refresh:()=>npcInfo(npcZone)}:null,onConcierge:provider=>openConcierge({zone:npcZone||id,name:p.name,provider}),onExit:()=>{closeConcierge();nearbyWork=null;updateWorkPoint();}});}
function addSpots(list){const b=meta.bounds,m=.0015;
  for(const s of list){if(typeof s.lon!=='number')continue;const lon=clamp(s.lon,b[0]+m,b[2]-m),lat=clamp(s.lat,b[1]+m,b[3]-m);
    const p={id:s.id,name:s.name,lon,lat,spawn:[lon,lat],spot:true,unverified:!!s.unverified,locationNote:s.locationNote||'',source:s.source};places[s.id]=p;SPOTS[s.id]=p;WORK_POINTS[s.id]={name:s.name,radius:.75};
    const g=addLandmark(lon,lat,'spot');g.userData.spot=s.id;landmarks['spot-'+s.id]=g;}}
function homeDistance(){return Math.max(34,widthKm*1.2);}
function home(){state.selected=null;flyTo(new THREE.Vector3(0,0,1.0),homeDistance());}
function travelTo(id){
  id=LEGACY_PLACES[id]||id;
  if($('travel-dialog').open)$('travel-dialog').close();
  if(id==='home'){home();return;}
  const p=places[id];if(!p)return;state.selected=id;
  agent.position.copy(landingSpot(...p.spawn));
  toast(workpointName(p)+' 도착');
  flyTo(agent.position.clone(),4.0,false,true);
}
function movementBlocked(){return !!window.__gorgoInteriorOpen||!!state.leaving||!!state.riding||!!document.querySelector('dialog[open]');}
function speedMultiplier(){return state.speedMode==='fast'?3:1;}
function setSpeedMode(mode){
  state.speedMode=mode==='fast'?'fast':'normal';
  try{localStorage.setItem('gorgo.speedMode',state.speedMode);}catch{}
  const button=$('speed-mode');button.textContent='속도 '+speedMultiplier()+'×';button.setAttribute('aria-pressed',String(state.speedMode==='fast'));
  button.setAttribute('aria-label',state.speedMode==='fast'?'이동 속도 1배로 전환':'이동 속도 3배로 전환');
}
function clearMovement(){keys.clear();mobileKeys.clear();moveTarget=null;if(targetMark)targetMark.visible=false;}
function updateWorkPoint(){
  if(state.riding)return;let next=null,best=Infinity;
  for(const [id,w]of Object.entries(WORK_POINTS)){const p=project(places[id].lon,places[id].lat),d=Math.hypot(agent.position.x-p.x,agent.position.z-p.z);if(d<=w.radius&&d<best){next=id;best=d;}}
  if(state.selected&&WORK_POINTS[state.selected]){const p=project(places[state.selected].lon,places[state.selected].lat);if(Math.hypot(agent.position.x-p.x,agent.position.z-p.z)<=WORK_POINTS[state.selected].radius)next=state.selected;}
  if(next===nearbyWork)return;nearbyWork=next;$('work-open').hidden=!next;
  if(next)$('work-open').textContent=WORK_POINTS[next].name+(contentsFor(next).length?' · 들어가기':' · 자료')+' (스페이스)';
}
function setupEvents(){
  initAiUI({clearMovement,toast});
  setSpeedMode(state.speedMode);$('speed-mode').onclick=()=>setSpeedMode(state.speedMode==='fast'?'normal':'fast');
  initCrewWorkbench({beforeOpen:clearMovement});
  $('work-open').onclick=()=>{if(nearbyWork)openSpot(nearbyWork);};
  $('map-switch').textContent='한반도 지도로';$('map-switch').setAttribute('aria-label','한반도 지도로 전환');$('map-switch').onclick=()=>leaveToKorea();
  initRecordsUI({clearMovement,toast,getPosition:()=>agent.position,project:z=>places[z.place]?project(places[z.place].lon,places[z.place].lat):new THREE.Vector3(1e6,0,1e6),pickPoint:(cx,cy)=>{const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-cy/innerHeight*2+1),camera);return ray.intersectObject(terrain,false)[0]?.point;},ensurePin:z=>{if(z.map==='korea')return;if(!places[z.place])throw Error('업무존 장소가 없습니다: '+z.place);if(!labelItems.some(l=>l.el.dataset.place===z.id))addLabel(z.name,places[z.place].lon,places[z.place].lat,'pin',z.id);},walkToZone:z=>{if(!places[z.place])return;const p=project(places[z.place].lon,places[z.place].lat);moveTarget=p;targetMark.position.set(p.x,groundHeight(p.x,p.z)+.012,p.z);},onReady:()=>{nearbyWork=null;updateWorkPoint();conciergeInfo();}});
  document.querySelectorAll('[data-travel]').forEach(b=>b.addEventListener('click',()=>travelTo(b.dataset.travel)));
  $('travel-open').onclick=()=>{keys.clear();mobileKeys.clear();$('travel-dialog').showModal();};$('travel-close').onclick=()=>$('travel-dialog').close();
  // FIX-2 (Codex ddc5c83 review #1): physical key position (e.code), so the Korean IME state (key 'ㅈ'/'Process') cannot drop or stick a key.
  addEventListener('keydown',e=>{const k=moveKey(e);logInput('down',e,k);if(movementBlocked()||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;if(k){e.preventDefault();keys.add(k);moveTarget=null;}else if(e.code==='Space'){e.preventDefault();if(!e.repeat&&nearbyWork&&!$('work-open').hidden)openSpot(nearbyWork);}});
  addEventListener('keyup',e=>{const k=moveKey(e);logInput('up',e,k);if(k)keys.delete(k);});addEventListener('blur',()=>{keys.clear();mobileKeys.clear();});document.addEventListener('visibilitychange',()=>{keys.clear();mobileKeys.clear();last=performance.now();});
  // Click / tap on the map walks Gorgo there (old 2D behaviour). A drag, a long press or a second finger stays a camera gesture.
  const el=renderer.domElement,downs=new Map();
  // AGENT-GORGO-13: 창을 활성화하려고 누른 첫 클릭(로드 직후·창 포커스 직후)은 걷기 명령으로 받지 않는다.
  let quietUntil=performance.now()+1200;addEventListener('focus',()=>{quietUntil=performance.now()+400;});
  el.addEventListener('pointerdown',e=>{downs.set(e.pointerId,{x:e.clientX,y:e.clientY,t:performance.now(),multi:downs.size>0,quiet:performance.now()<quietUntil||!document.hasFocus()});if(downs.size>1)downs.forEach(d=>d.multi=true);});
  el.addEventListener('pointerup',e=>{const d=downs.get(e.pointerId);downs.delete(e.pointerId);if(!d||d.multi||d.quiet||e.button>0||Math.hypot(e.clientX-d.x,e.clientY-d.y)>CLICK_SLOP||performance.now()-d.t>CLICK_MS)return;walkTo(e.clientX,e.clientY);});
  el.addEventListener('pointercancel',e=>downs.delete(e.pointerId));
  document.querySelectorAll('[data-move]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);mobileKeys.add(b.dataset.move);});for(const ev of['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>mobileKeys.delete(b.dataset.move));});
  controls.addEventListener('start',()=>{flight=null;state.follow=false;});
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
}

function moveKey(e){return KEY_CODES[e.code]||KEY_FALLBACK[(e.key||'').toLowerCase()]||null;}
function logInput(type,e,k){inputLog.push({t:Math.round(performance.now()),type,key:e.key,code:e.code,action:k,pos:agent?[+agent.position.x.toFixed(4),+agent.position.z.toFixed(4)]:null});if(inputLog.length>40)inputLog.shift();}
function walkTo(cx,cy){
  if(movementBlocked())return false;
  // Ray against the terrain only: buildings are not obstacles and must not catch the click.
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(cx/innerWidth*2-1,-(cy/innerHeight)*2+1),camera);const hit=ray.intersectObject(terrain,false)[0];if(!hit)return false;
  const x=clamp(hit.point.x,-widthKm/2+EDGE,widthKm/2-EDGE),z=clamp(hit.point.z,-depthKm/2+EDGE,depthKm/2-EDGE);
  moveTarget=new THREE.Vector3(x,0,z);targetMark.position.set(x,groundHeight(x,z)+.012,z);targetMark.visible=true;return true;
}
// ?debug=1: owner-visible trace of the input chain (received key -> mapped action -> position -> Gorgo on screen) for Codex #2.
const debugHud=/[?&]debug/.test(location.search)?document.body.appendChild(Object.assign(document.createElement("pre"),{id:"debug-hud",style:"position:fixed;left:8px;bottom:8px;z-index:50;margin:0;padding:6px 8px;background:rgba(0,0,0,.72);color:#9f9;font:11px/1.35 monospace;pointer-events:none;white-space:pre"})):null;
function drawDebug(){const p=agent.position.clone();p.y+=.3*agent.scale.y;p.project(camera);const on=Math.abs(p.x)<1&&Math.abs(p.y)<1&&p.z<1;const l=inputLog[inputLog.length-1];debugHud.textContent=`fps ${state.fps}  keys [${[...keys,...mobileKeys].join(",")}]  target ${moveTarget?"yes":"no"}
last ${l?l.type+" key="+JSON.stringify(l.key)+" code="+l.code+" -> "+(l.action||"(ignored)"):"-"}
pos ${agent.position.x.toFixed(3)}, ${agent.position.z.toFixed(3)}  on-screen ${on}  cam ${camera.position.distanceTo(controls.target).toFixed(1)}  focus ${document.hasFocus()} ${document.activeElement?.tagName}`;}
function updateAgent(dt){
  let x=0,z=0;if(keys.has('up')||mobileKeys.has('up'))z--;if(keys.has('down')||mobileKeys.has('down'))z++;if(keys.has('left')||mobileKeys.has('left'))x--;if(keys.has('right')||mobileKeys.has('right'))x++;
  if(x||z)moveTarget=null;
  const toTarget=moveTarget?new THREE.Vector3(moveTarget.x-agent.position.x,0,moveTarget.z-agent.position.z):null;
  if(toTarget&&toTarget.length()<.01){moveTarget=null;targetMark.visible=false;}
  targetMark.visible=!!moveTarget;
  const moving=(!!(x||z)||!!moveTarget)&&!movementBlocked();if(moving){
    let v,speed;
    if(moveTarget){const d=toTarget.length();v=toTarget.normalize();speed=Math.min(d,(d>2?.8:.32)*speedMultiplier()*dt);}
    else{const direction=new THREE.Vector3();camera.getWorldDirection(direction);direction.y=0;direction.normalize();const right=new THREE.Vector3().crossVectors(direction,new THREE.Vector3(0,1,0));v=right.multiplyScalar(x).addScaledVector(direction,-z).normalize();speed=(keys.has('shift')?.8:.32)*speedMultiplier()*dt;}
    // AGENT-GORGO-34 (owner 2026-11-05): 육지와 다리 위만 걸을 수 있다(건물은 막지 않는다). 막히면 벽을 따라 미끄러진다.
    const cx=agent.position.x,cz=agent.position.z,nx=clamp(cx+v.x*speed,-widthKm/2+EDGE,widthKm/2-EDGE),nz=clamp(cz+v.z*speed,-depthKm/2+EDGE,depthKm/2-EDGE);
    const ok=(px,pz)=>onLand(px,pz)||bridgeAt(px,pz)!==null,stuck=!ok(cx,cz); // 바다 한가운데에 있으면(시작·순간이동 직후) 자유롭게 빠져나온다
    let px=cx,pz=cz,moved=true;if(stuck||ok(nx,nz)){px=nx;pz=nz;}
    else{ // G35: 막히면 가장자리 방향으로 미끄러진다(비스듬한 다리·해안에서 끼지 않게 진행 방향을 ±20°씩 돌려 본다)
      moved=false;for(const a of[.35,-.35,.7,-.7,1.05,-1.05,1.4,-1.4]){const c=Math.cos(a),s=Math.sin(a),f=speed*c*1.05,tx=clamp(cx+(v.x*c-v.z*s)*f,-widthKm/2+EDGE,widthKm/2-EDGE),tz=clamp(cz+(v.x*s+v.z*c)*f,-depthKm/2+EDGE,depthKm/2-EDGE);if(ok(tx,tz)){px=tx;pz=tz;moved=true;break;}}}
    if(!moved||(moveTarget&&Math.hypot(px-cx,pz-cz)<speed*.2&&!ok(moveTarget.x,moveTarget.z))){if(moveTarget){moveTarget=null;targetMark.visible=false;toast('바다 위로는 갈 수 없어요');}}
    agent.position.x=px;agent.position.z=pz;const br=bridgeAt(px,pz);
    agent.position.y=(br!==null&&!onLand(px,pz)?br:groundHeight(px,pz))+.01;agent.rotation.y=Math.atan2(v.x,v.z);gait+=dt*(keys.has('shift')?15:9);
    // Walking keeps the camera on Gorgo; dragging the map releases it until the next step.
    if(!state.follow){state.follow=true;if(camera.position.distanceTo(controls.target)>10)flyTo(agent.position.clone(),5,false,true);else flight=null;}
  }
  const swing=moving?Math.sin(gait)*.55:0;legs[0].rotation.x=swing;legs[1].rotation.x=-swing;arms[0].rotation.x=-swing;arms[1].rotation.x=swing;agent.userData.body.position.y=moving?Math.abs(Math.sin(gait))*.015:Math.sin(clock.elapsedTime*2)*.006;
  if(state.follow&&!flight){const delta=agent.position.clone().sub(controls.target);controls.target.addScaledVector(delta,Math.min(1,dt*7));camera.position.addScaledVector(delta,Math.min(1,dt*7));}
}
const temp=new THREE.Vector3();
function updateLabels(){
  const distance=camera.position.distanceTo(controls.target),pins=[];
  temp.copy(agent.position);temp.y+=.3*agent.scale.y;temp.project(camera);
  const ax=(temp.x*.5+.5)*innerWidth,ay=(-temp.y*.5+.5)*innerHeight;
  const occupied=[{x:ax-30,y:ay-45,w:60,h:95}];
  const overlaps=(a,b)=>a.x<b.x+b.w+8&&a.x+a.w+8>b.x&&a.y<b.y+b.h+8&&a.y+a.h+8>b.y;
  for(const l of labelItems){
    if(l.object){temp.copy(l.object.position);temp.y+=.82*l.object.scale.y;}else temp.copy(l.p);temp.project(camera);
    const off=temp.z>1||temp.z< -1||Math.abs(temp.x)>1.15||Math.abs(temp.y)>1.15;
    const close=distance<10&&l.kind==='major';l.el.style.display=off||close?'none':'';if(off||close)continue;
    const x=(temp.x*.5+.5)*innerWidth,y=(-temp.y*.5+.5)*innerHeight;
    if(l.kind==='pin'){pins.push({l,x,y,w:l.el.offsetWidth,h:l.el.offsetHeight});continue;}
    l.el.style.left=x+'px';l.el.style.top=y+'px';
  }
  // Expand crowded agency labels around their true anchors, keeping document drop targets separate.
  const lines=[];for(const p of pins){let best=null;
    for(let ring=0;ring<=8&&!best;ring++)for(let k=0;k<(ring?12:1);k++){
      const angle=k/12*Math.PI*2-Math.PI/2,r=ring*48;
      const box={x:clamp(p.x-p.w/2+Math.cos(angle)*r,8,Math.max(8,innerWidth-p.w-8)),y:clamp(p.y-p.h-12+Math.sin(angle)*r,80,Math.max(80,innerHeight-p.h-48)),w:p.w,h:p.h};
      if(!occupied.some(o=>overlaps(box,o))){best=box;break;}
    }
    best||={x:p.x-p.w/2,y:p.y-p.h-12,w:p.w,h:p.h};occupied.push(best);
    p.l.el.style.transform='none';p.l.el.style.visibility='';p.l.el.style.left=best.x+'px';p.l.el.style.top=best.y+'px';
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',p.x);line.setAttribute('y1',p.y);line.setAttribute('x2',clamp(p.x,best.x,best.x+best.w));line.setAttribute('y2',clamp(p.y,best.y,best.y+best.h));lines.push(line);
    p.l.el.dataset.anchorX=p.x.toFixed(1);p.l.el.dataset.anchorY=p.y.toFixed(1);
  }pinLeaders.replaceChildren(...lines);
}

function animate(now){
  requestAnimationFrame(animate);if(window.__gorgoInteriorOpen){last=now;return;}const dt=Math.min(MAX_DT,Math.max(0,(now-last)/1000||.016));last=now;const t=clock.getElapsedTime();
  if(flight)stepFlight(t);
  if(state.riding)stepRide(dt);
  shipsLayer?.update(dt,t);seaFx?.update(t);updateAgent(dt);controls.update();agent.scale.setScalar(clamp(camera.position.distanceTo(controls.target)/10,.45,1));
  boats.forEach(({g,base,phase})=>{g.position.y=.025+Math.sin(t*1.5+phase)*.004;const dx=Math.sin(t*.03+phase)*.06,dz=Math.cos(t*.03+phase)*.06;if(elevation(base.x+dx,base.z+dz)<.5){g.position.x=base.x+dx;g.position.z=base.z+dz;}});
  renderer.render(scene,camera);
  if(state.leaving&&!flight&&!state.left){state.left=true;window.GorgoHandoff?window.GorgoHandoff.leave(renderer.domElement,'korea','./'):location.href='./';}
  if(!state.firstFrame){state.firstFrame=true;requestAnimationFrame(()=>window.GorgoHandoff?.finish());}
  updateLabels();updateWorkPoint();if(debugHud)drawDebug();state.frames++;state.elapsed+=state.lastFrameTime?Math.max(0,(now-state.lastFrameTime)/1000):dt;state.lastFrameTime=now;if(state.elapsed>1){state.fps=Math.round(state.frames/state.elapsed);state.frames=0;state.elapsed=0;}
}

async function init(){
  // AGENT-GORGO-11: ?map=korea opens the Korean-peninsula layer (korea.js) in the same page and dialogs; Busan stays the detailed map.
  // AGENT-GORGO-12: 처음 화면은 전국 지도. 부산 상세 지도는 ?map=busan 이며, 전국 지도에서 부산으로 들어가면 확대되며 이어진다.
  const mapParam=new URLSearchParams(location.search).get('map');if(mapParam==='world'){(await import('./world.js')).initWorld();return;}
  if(mapParam!=='busan'){(await import('./korea.js')).initKorea();return;}
  try{
    const results=await Promise.all(['data/sources.json','data/terrain.bin','data/roads.json','data/land.bin','data/workpoints.json'].map(async(url)=>{const r=await fetch(url);if(!r.ok)throw new Error(url+' '+r.status);return url.endsWith('.bin')?r.arrayBuffer():r.json();}));
    configureWorkpoints(results[4]);[meta,,roadData]=results;heights=new Int16Array(results[1]);landMask=new Uint8Array(results[3]);if(heights.length!==(meta.nx+1)*(meta.nz+1)||landMask.length!==heights.length)throw new Error('Terrain size mismatch');
    widthKm=(meta.bounds[2]-meta.bounds[0])*91;depthKm=(meta.bounds[3]-meta.bounds[1])*111.195;
    $('loading-status').textContent='지도를 준비하는 중';
    scene=new THREE.Scene();scene.background=new THREE.Color('#b3d3cb');scene.fog=new THREE.Fog('#b3d3cb',42,95);
    camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.03,180);const distance=homeDistance();camera.position.set(distance*.14,distance*.72,1+distance*.76);
    renderer=new THREE.WebGLRenderer({antialias:true,stencil:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.23;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;$('scene').appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight('#fff5dc','#7daba0',2.5));const sun=new THREE.DirectionalLight('#ffedcc',3.0);sun.position.set(-15,30,16);scene.add(sun);
    controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,1);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=1.7;controls.maxDistance=65;controls.maxPolarAngle=Math.PI*.46;controls.minPolarAngle=.015;controls.screenSpacePanning=false;controls.maxTargetRadius=Math.hypot(widthKm,depthKm)/2+2;controls.cursor.set(0,0,0);controls.update();
    makeTerrain();makeRoads();makeCity();
    landmarks.tower=addLandmark(129.0326,35.1006,'tower');landmarks.station=addLandmark(129.0425,35.1154,'station');
    const colors=['#527f94','#697fa8','#6a9c91','#af8958','#577f8d','#8a799f','#839855','#b77458','#768b76'];
    Object.values(places).forEach((p,i)=>{const g=addLandmark(p.lon,p.lat,p.id==='skybiz'?'office':'immigration');g.userData.workpoint=p.id;cube(g,.18,.055,.025,0,.32,.21,colors[i]);g.name=p.name;landmarks[p.id]=g;});
    // AGENT-GORGO-19: 콘텐츠 카탈로그 + 콘텐츠 장소(없거나 실패해도 지도는 그대로 뜬다)
    try{const [cat,spots]=await Promise.all(['data/content-catalog.json','data/busan-spots.json'].map(async u=>{const r=await fetch(u);if(!r.ok)throw Error(u+' '+r.status);return r.json();}));catalog=cat;addSpots(spots);}catch(e){console.warn('contents',e.message);}
    landmarks.office=landmarks.skybiz;landmarks.immigration=landmarks['imm-jungang'];landmarks.gamcheon=landmarks['imm-gamcheon'];
    bridge([129.114,35.138],[129.144,35.158],'suspension');bridge([129.053,35.098],[129.075,35.111],'cable');
    buildPlaceDialogs();makeHarbor();makeAgent();targetMark=new THREE.Mesh(new THREE.RingGeometry(.035,.05,24).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:"#ff7a45",transparent:true,opacity:.85,depthTest:false}));targetMark.renderOrder=11;targetMark.visible=false;targetMark.raycast=()=>{};scene.add(targetMark);makeLabels();setupEvents();
    state.ready=true;window.__gorgoEarth={onLand,bridgeAt:typeof bridgeAt==='function'?bridgeAt:undefined,onBridge:typeof onBridge==='function'?onBridge:undefined,state,places,agent,camera,controls,elevation,groundHeight,canWalk,project,travelTo,landingSpot,home,homeDistance,leaveToKorea,driveTo,openSpot,contentsFor,spots:()=>Object.keys(SPOTS),riding:()=>state.riding&&{id:state.riding.id},lastRide:()=>state.lastRide,map:'busan',meta,setXray,xrayGhosts,EDGE,extent:()=>({hw:widthKm/2,hd:depthKm/2}),landmarks,renderer,terrain,inputLog,walkTo,MAX_DT,setSpeedMode,speedMultiplier,WORK_POINTS,nearbyWork:()=>nearbyWork,target:()=>moveTarget&&[moveTarget.x,moveTarget.z]};
    shipsLayer=initShips({scene,project,seaY:-.03,length:.28,labelDist:70,markerPx:18,camera,bounds:meta.bounds,focus:p=>flyTo(p,2.6,false,false),openWorld:s=>{clearMovement();const url='./?map=world&ship='+encodeURIComponent(s.mmsi);if(window.GorgoHandoff)window.GorgoHandoff.leave(renderer.domElement,'world',url);else location.href=url;},clearMovement,toast});window.__gorgoEarth.ships=shipsLayer;
    $('loading').classList.add('done');last=performance.now();requestAnimationFrame(animate);toast('지도 클릭으로 이동 · WASD/방향키');
  }catch(error){console.error(error);$('loading-status').textContent='지도를 불러오지 못했어요. 새로고침해 주세요. ('+error.message+')';$('loading').dataset.error=error.message;}
}
init();

// AGENT-GORGO-34 사람 모형(고르고·장소별 안내원 공용). 같은 미니어처 화풍에서 머리 모양·모자·안경·마스크·가운·조끼·명찰로 서로 다른 인물을 만든다.
// look = {gender, skin, hairStyle: short|side|long|bob|ponytail|bun|crew|curly, hair, suit, sleeve, pants, tie|null,
//         hat:{type:'peak'|'cap'|'hardhat', color}, glasses:color, mask:true, coat:color(긴 가운), vest:color(형광 조끼), badge:color(명찰), goggles:true(고르고 이마 고글)}
import * as THREE from 'three';
const mats=new Map();const mat=(c,o={})=>{const k=c+JSON.stringify(o);if(!mats.has(k))mats.set(k,new THREE.MeshStandardMaterial({color:c,roughness:.8,...o}));return mats.get(k);};
const boxG=new THREE.BoxGeometry(1,1,1),sphG=new THREE.SphereGeometry(1,18,12);
function box(p,w,h,d,x,y,z,col){const m=new THREE.Mesh(boxG,mat(col));m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;}
const cylG=new THREE.CylinderGeometry(1,1,1,14);
function cyl2(p,rt,rb,x,y,z,col){const m=new THREE.Mesh(cylG,mat(col));m.scale.set(rt,rb*1.2,rt);m.position.set(x,y,z);p.add(m);return m;}
function sph(p,r,x,y,z,col){const m=new THREE.Mesh(sphG,mat(col));m.scale.setScalar(r);m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;}

export const SKINS=['#f1c8a7','#e9b997','#d9a37f','#f4d3b8','#c98f6c'];

export function makePerson(look={}){
  const L={suit:'#344959',sleeve:'#3b4f5e',pants:'#324452',hair:'#3c3b49',tie:'#cf7359',skin:'#f1c8a7',hairStyle:'short',...look};
  const g=new THREE.Group(),body=new THREE.Group();g.add(body);const legs=[],arms=[];
  const c=(w,h,d,x,y,z,col)=>box(body,w,h,d,x,y,z,col),s=(r,x,y,z,col)=>sph(body,r,x,y,z,col);
  const skin=L.skin;
  // 몸통 · 셔츠 · 넥타이
  c(.18,.21,.12,0,.27,0,L.suit);
  if(L.tie!==null){c(.07,.15,.015,0,.30,.071,'#f5eddf');c(.028,.12,.02,0,.28,.084,L.tie);}
  if(L.coat){c(.2,.25,.14,0,.255,0,L.coat);c(.2,.12,.13,0,.115,.0,L.coat);c(.03,.2,.02,0,.25,.075,'#dfe5e4');}
  if(L.vest){c(.19,.2,.13,0,.275,0,L.vest);c(.192,.022,.132,0,.24,0,'#e8ecef');c(.192,.022,.132,0,.31,0,'#e8ecef');}
  if(L.badge){c(.012,.1,.012,-.03,.31,.074,'#555b63');c(.05,.04,.012,-.03,.255,.078,L.badge);}
  // 머리
  s(.139,0,.49,.015,skin);
  const hs=L.hairStyle,hc=L.hair;
  if(!L.hat||L.hat.type==='cap'||L.hat.type==='peak'){const hair=s(.145,0,.535,-.012,hc);hair.scale.y*=hs==='crew'?.62:.72;if(hs!=='crew')c(.26,.04,.10,0,.58,.04,hc);}
  else{const hair=s(.142,0,.52,-.02,hc);hair.scale.y*=.6;}
  if(hs==='long'){c(.27,.3,.07,0,.43,-.09,hc);c(.04,.2,.1,-.135,.42,-.01,hc);c(.04,.2,.1,.135,.42,-.01,hc);}
  if(hs==='bob'){c(.05,.17,.16,-.135,.46,-.02,hc);c(.05,.17,.16,.135,.46,-.02,hc);c(.25,.16,.06,0,.47,-.1,hc);}
  if(hs==='ponytail'){s(.045,0,.52,-.15,hc);c(.04,.15,.04,0,.43,-.17,hc);s(.036,0,.35,-.17,hc);}
  if(hs==='bun'||L.bun){s(.07,0,.6,-.11,hc);}
  if(hs==='side'){c(.12,.03,.1,.07,.585,.045,hc);}
  if(hs==='curly'){for(const [x,y,z] of[[-.1,.6,0],[.1,.6,0],[0,.63,-.03],[-.12,.53,-.06],[.12,.53,-.06],[0,.6,.06]])s(.05,x,y,z,hc);}
  // 모자
  const hat=L.hat;if(hat){const hcol=hat.color;
    if(hat.type==='hardhat'){const dome=s(.158,0,.575,-.005,hcol);dome.scale.y*=.62;dome.scale.z*=1.05;c(.34,.03,.34,0,.545,0,hcol);c(.04,.03,.3,0,.63,0,hcol);c(.1,.02,.04,0,.5,.19,'#2a2f33');}
    else{const crown=s(.15,0,.575,-.01,hcol);crown.scale.x*=1.02;crown.scale.y*=.62;crown.scale.z*=1.04;c(.3,.025,.3,0,.548,-.005,hcol);c(.22,.02,.12,0,.552,.17,hat.type==='peak'?'#1a1f24':hcol);if(hat.type==='peak')c(.07,.025,.01,0,.585,.15,'#d9b44a');}}
  // 얼굴
  for(const k of[-1,1]){s(.012,k*.048,.49,.144,'#35404a');const ch=s(.019,k*.081,.462,.13,'#e79e8e');ch.scale.y*=.5;ch.scale.z*=.3;}
  c(.035,.009,.012,0,.449,.148,'#bb7f70');
  if(L.glasses){for(const k of[-1,1]){c(.062,.05,.01,k*.048,.492,.152,L.glasses);c(.044,.034,.012,k*.048,.492,.154,'#cfe3e8');}c(.04,.012,.01,0,.5,.152,L.glasses);}
  if(L.mask)c(.2,.085,.03,0,.445,.14,'#eef3f3');
  if(L.goggles||(look.goggles!==false&&!look.npc&&!look.id)){for(const k of[-1,1]){c(.078,.035,.018,k*.064,.592,.11,'#384758');c(.052,.016,.022,k*.064,.595,.123,'#7faaa9');}}
  // AGENT-GORGO-34 고급화: 목·귀·눈썹·허리띠·깃·단추·소매 끝·구두 밑창·(고르고) 배낭 — 같은 화풍 안에서 디테일을 더한다
  if(!L.plain){const dk=(col,k)=>new THREE.Color(col).multiplyScalar(k).getStyle();
    cyl2(body,.045,.05,0,.405,.01,skin);for(const k of[-1,1]){const ear=s(.026,k*.14,.485,.0,skin);ear.scale.x*=.6;c(.05,.012,.012,k*.062,.527,.138,dk(hc,.8));}
    c(.19,.022,.125,0,.168,0,'#2a2a2e');c(.03,.024,.01,0,.168,.066,'#d9b44a');
    if(L.tie!==null){for(const k of[-1,1]){const col=c(.03,.04,.02,k*.034,.372,.07,'#f5eddf');col.rotation.z=k*.5;}}
    if(!L.coat&&!L.vest){for(const k of[-1,1]){const lp=c(.03,.12,.014,k*.052,.3,.074,dk(L.suit,.82));lp.rotation.z=k*.16;}sph(body,.01,.0,.245,.066,'#2a2a2e');sph(body,.01,.0,.2,.066,'#2a2a2e');}
    if(look.npc===undefined&&!look.id&&!L.hat&&!L.coat&&!L.vest){c(.15,.2,.05,0,.28,-.09,'#2f6d6a');c(.15,.03,.052,0,.37,-.09,'#2a5552');c(.04,.2,.04,-.09,.3,-.05,'#2a5552');c(.04,.2,.04,.09,.3,-.05,'#2a5552');}}
  // 다리 · 팔
  for(const k of[-1,1]){const leg=new THREE.Group();leg.position.set(k*.054,.19,0);box(leg,.065,.14,.07,0,-.065,0,L.coat?L.pants:L.pants);box(leg,.075,.035,.11,0,-.14,.018,'#41414a');if(!L.plain)box(leg,.08,.012,.115,0,-.158,.018,'#1d1d22');body.add(leg);legs.push(leg);
    const arm=new THREE.Group();arm.position.set(k*.12,.35,0);box(arm,.052,.15,.065,0,-.065,0,L.coat||L.sleeve);sph(arm,.031,0,-.15,.004,skin);if(!L.plain&&!L.coat)box(arm,.056,.016,.07,0,-.128,0,'#f5eddf');body.add(arm);arms.push(arm);}
  const sh=new THREE.Mesh(new THREE.CircleGeometry(.2,24),new THREE.MeshBasicMaterial({color:'#31554b',transparent:true,opacity:.2,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.005;g.add(sh);
  g.scale.setScalar(2.2);g.userData={body,legs,arms};return g;}

// AGENT-GORGO-14/16 탈것: 부산 상세 지도는 자동차(실제 도로망 경로). 전국 지도는 방향키=자동차, 클릭·핀=고속열차(주요 철도 축을 단순화한 노선).
// 미니어처 화풍의 원작 모형이다. 특정 차종·열차 디자인을 따라 하지 않는다.
import * as THREE from 'three';

const mats=new Map();
const mat=c=>{if(!mats.has(c))mats.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.82}));return mats.get(c);};
function box(p,w,h,d,x,y,z,c){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);p.add(m);return m;}
function wheel(p,x,y,z,r,list){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.045,12),mat('#2f3436'));m.rotation.z=Math.PI/2;m.position.set(x,y,z);p.add(m);list.push(m);return m;}
function gorgoHead(p,x,y,z,s=1){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);p.add(g);
  const face=new THREE.Mesh(new THREE.SphereGeometry(.05,12,8),mat('#f1c8a7'));g.add(face);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.053,12,8),mat('#3c3b49'));hair.position.set(0,.018,-.006);hair.scale.y=.7;g.add(hair);
  for(const sx of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.006,6,4),mat('#35404a'));e.position.set(sx*.018,0,.048);g.add(e);}
  return g;}
// 차창: 안의 고르고가 보이도록 반투명
const glassMat=new THREE.MeshStandardMaterial({color:'#9fd0d3',roughness:.15,metalness:.1,transparent:true,opacity:.42,depthWrite:false});
function glass(p,w,h,d,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),glassMat);m.position.set(x,y,z);m.renderOrder=2;p.add(m);return m;}
function shadow(p,w,d){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({color:'#31554b',transparent:true,opacity:.2,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.003;p.add(m);return m;}

// 자동차: +z가 앞. 길이 약 0.5(모형 단위). 고르고가 운전석에 앉아 있다.
export function buildCar(){
  const g=new THREE.Group(),wheels=[];
  shadow(g,.3,.56);
  box(g,.26,.08,.5,0,.085,0,'#e8784e');box(g,.262,.018,.5,0,.128,0,'#f3f0e6');
  box(g,.22,.085,.25,0,.17,-.035,'#f6efe0');box(g,.225,.012,.255,0,.218,-.035,'#d9653d');
  glass(g,.19,.06,.01,0,.172,.092);glass(g,.19,.05,.01,0,.172,-.162);
  for(const s of[-1,1]){glass(g,.01,.05,.18,s*.112,.172,-.035);box(g,.045,.025,.01,s*.085,.095,.252,'#fff6c8');box(g,.045,.022,.01,s*.085,.095,-.252,'#d84a3a');}
  for(const s of[-1,1])for(const z of[.16,-.16])wheel(g,s*.13,.048,z,.048,wheels);
  gorgoHead(g,-.045,.163,.0,.72);
  g.userData.wheels=wheels;return g;
}

// ── AGENT-GORGO-16: 고속열차(전국 지도 클릭·핀 이동). 긴 유선형 노즈 + 둥근 차체 + 창문 띠 + 줄무늬 + 팬터그래프 + 대차.
// 고속열차 장르의 원작 모형이다(로고·문자·실제 도장 복제 없음). +z가 앞, 1량 길이 약 0.9.
const glossy=new Map();
const gmat=(c,r=.32,m=.12,extra={})=>{const k=c+r+m+JSON.stringify(extra);if(!glossy.has(k))glossy.set(k,new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m,...extra}));return glossy.get(k);};
const KW=.25,KH=.25,KR=.085; // 차체 폭·높이·모서리 반경
function bodyShape(){const s=new THREE.Shape(),w=KW/2,h=KH,r=KR,b=.012;s.moveTo(-w+b,0);s.lineTo(w-b,0);s.quadraticCurveTo(w,0,w,b);s.lineTo(w,h-r);s.quadraticCurveTo(w,h,w-r,h);s.lineTo(-w+r,h);s.quadraticCurveTo(-w,h,-w,h-r);s.lineTo(-w,b);s.quadraticCurveTo(-w,0,-w+b,0);return s;}
function extrudeBody(len,color){const g=new THREE.ExtrudeGeometry(bodyShape(),{depth:len,bevelEnabled:false,curveSegments:8});g.translate(0,0,-len/2);return new THREE.Mesh(g,gmat(color));}
// 노즈: 단면을 줄여 가며 앞으로 뾰족해지는 유선형(아래는 평평, 위는 낮게 깎임)
function noseGeometry(len){const segs=22,ring=28,pos=[],idx=[],tipY=.045;
  for(let i=0;i<=segs;i++){const t=i/segs,z=t*len;
    const top=tipY+(KH-tipY)*Math.pow(Math.max(0,1-Math.pow(t,1.4)),.75),bot=tipY*Math.pow(t,1.5),hw=Math.max(.004,KW/2*Math.sqrt(Math.max(0,1-Math.pow(t,2.4))));
    const mid=(top+bot)/2,half=(top-bot)/2;
    for(let j=0;j<ring;j++){const a=j/ring*Math.PI*2,cx=Math.cos(a),sy=Math.sin(a);
      // 아래쪽은 평평하게(바닥선으로 눌러 붙임), 위쪽은 둥근 지붕
      // 차체 쪽은 각진 단면(초타원), 끝으로 갈수록 둥글게
      const p=.4+.6*t,y=mid+(sy<0?-Math.pow(-sy,.3):Math.pow(sy,p))*half;pos.push(Math.sign(cx)*Math.pow(Math.abs(cx),p)*hw,y,z);}}
  for(let i=0;i<segs;i++)for(let j=0;j<ring;j++){const a=i*ring+j,b=i*ring+(j+1)%ring,c=(i+1)*ring+j,d=(i+1)*ring+(j+1)%ring;idx.push(a,c,b,b,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;}
function sideBand(g,len,y,h,color,z=0,out=.0015){for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(len,h),gmat(color,.25,.2));m.rotation.y=s*Math.PI/2;m.position.set(s*(KW/2+out),y,z);g.add(m);}}
function bogie(g,z,wheels){const b=new THREE.Group();b.position.set(0,0,z);g.add(b);const f=new THREE.Mesh(new THREE.BoxGeometry(KW*.82,.04,.17),gmat('#2b3236',.6,.3));f.position.y=.03;b.add(f);
  for(const s of[-1,1])for(const dz of[-.055,.055]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.03,14),gmat('#1d2225',.4,.5));w.rotation.z=Math.PI/2;w.position.set(s*KW*.38,.03,dz);b.add(w);wheels.push(w);}}
function ktxCar(kind,wheels){ // kind: 'lead' | 'coach'
  const g=new THREE.Group(),len=kind==='lead'?.52:.86,zc=kind==='lead'?-.17:0,y0=.045;
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(KW*1.25,(kind==='lead'?.95:.9)),new THREE.MeshBasicMaterial({color:'#2a4a42',transparent:true,opacity:.18,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(0,.004,kind==='lead'?.0:0);g.add(sh);
  const body=extrudeBody(len,'#f6f7f4');body.position.set(0,y0,zc);g.add(body);
  const skirt=new THREE.Mesh(new THREE.BoxGeometry(KW*.96,.03,len),gmat('#39434a',.55,.2));skirt.position.set(0,y0+.012,zc);g.add(skirt);
  // 창문 띠 · 남색 굵은 줄 · 하늘색 가는 줄
  sideBand(g,len*.94,y0+KH*.66,.05,'#1f2c36',zc);sideBand(g,len,y0+KH*.3,.05,'#1d4e8f',zc,.0025);sideBand(g,len,y0+KH*.18,.013,'#4fa3d9',zc,.003);
  if(kind==='coach'){for(let k=-4;k<=4;k++)sideBand(g,.012,y0+KH*.66,.052,'#f6f7f4',k*.09,.003);for(const s of[-1,1]){const d=new THREE.Mesh(new THREE.PlaneGeometry(.05,.13),gmat('#d9dde0',.4,.1));d.rotation.y=s*Math.PI/2;d.position.set(s*(KW/2+.0035),y0+.1,len/2-.06);g.add(d);}}
  bogie(g,zc-len/2+.11,wheels);bogie(g,zc+len/2-.11,wheels);
  if(kind==='lead'){
    const nl=.42,nose=new THREE.Mesh(noseGeometry(nl),gmat('#f6f7f4'));nose.position.set(0,y0,zc+len/2);g.add(nose);
    // 앞유리: 노즈 윗면을 덮는 짙은 유광 곡면
    const ws=new THREE.Mesh(new THREE.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2),gmat('#16222b',.12,.6));ws.scale.set(KW*.43,.05,.16);ws.position.set(0,y0+KH*.78,zc+len/2+.06);ws.rotation.x=-.32;g.add(ws);
    // 전조등
    for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(.03,.012,.02),gmat('#fff8d6',.2,0,{emissive:'#fff1b0',emissiveIntensity:.8}));l.position.set(s*.055,y0+.06,zc+len/2+nl*.52);g.add(l);}
    // 팬터그래프(지붕 마름모 틀)
    const pan=new THREE.Group();pan.position.set(0,y0+KH+.004,zc-.08);g.add(pan);const pm=gmat('#59636a',.5,.6);
    const base=new THREE.Mesh(new THREE.BoxGeometry(.09,.012,.07),pm);pan.add(base);const a1=new THREE.Mesh(new THREE.BoxGeometry(.008,.008,.11),pm);a1.position.set(0,.035,.0);a1.rotation.x=.75;pan.add(a1);const a2=a1.clone();a2.rotation.x=-.75;a2.position.y=.075;pan.add(a2);const bar=new THREE.Mesh(new THREE.BoxGeometry(.13,.008,.012),pm);bar.position.set(0,.105,0);pan.add(bar);
    // 운전석의 고르고
    const head=new THREE.Group();head.position.set(0,y0+KH*.8,zc+len/2+.03);head.scale.setScalar(.8);g.add(head);
    const face=new THREE.Mesh(new THREE.SphereGeometry(.05,12,8),gmat('#f1c8a7',.8,0));head.add(face);const hair=new THREE.Mesh(new THREE.SphereGeometry(.053,12,8),gmat('#3c3b49',.8,0));hair.position.set(0,.018,-.006);hair.scale.y=.7;head.add(hair);
  }
  // 차량 사이 연결막
  const gw=new THREE.Mesh(new THREE.BoxGeometry(KW*.8,KH*.82,.05),gmat('#3a4247',.7,.1));gw.position.set(0,y0+KH*.45,zc-len/2-.02);g.add(gw);
  return g;
}
// 4량 편성: 앞 동력차(노즈 앞) · 객차 2 · 뒤 동력차(노즈 뒤)
export function buildKTX(){const wheels=[],lead=ktxCar('lead',wheels),c1=ktxCar('coach',wheels),c2=ktxCar('coach',wheels),tail=ktxCar('lead',wheels);
  // 뒤 동력차는 노즈가 뒤를 향하도록 내부 그룹을 돌린다(바깥 그룹은 진행 방향 회전에 쓰인다)
  const tailWrap=new THREE.Group();tail.rotation.y=Math.PI;tailWrap.add(tail);
  return {parts:[lead,c1,c2,tailWrap],spacing:.93,wheels};}

// 경로를 따라 달리기. points는 높이까지 정한 Vector3 배열, parts는 앞에서부터 줄지어 따라가는 탈것 조각들.
export class Ride{
  constructor(points,parts,{duration,spacing=0,wheels=[],scale=1}){
    this.pts=points;this.parts=parts;this.spacing=spacing;this.wheels=wheels;this.duration=duration;this.t=0;this.scale=scale;
    this.cum=[0];for(let i=1;i<points.length;i++)this.cum.push(this.cum[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z));
    this.length=this.cum[this.cum.length-1];this.head=points[0].clone();this.done=this.length<1e-6;this.place(0);
  }
  at(s,out,dir){const c=this.cum,n=c.length;s=THREE.MathUtils.clamp(s,0,this.length);let lo=0,hi=n-1;while(hi-lo>1){const m=(lo+hi)>>1;if(c[m]<=s)lo=m;else hi=m;}
    const a=this.pts[lo],b=this.pts[Math.min(n-1,lo+1)],seg=(c[lo+1]??c[lo])-c[lo],k=seg>0?(s-c[lo])/seg:0;out.lerpVectors(a,b,k);if(dir)dir.set(b.x-a.x,0,b.z-a.z);return out;}
  place(s){const p=new THREE.Vector3(),d=new THREE.Vector3();
    this.parts.forEach((part,i)=>{const si=s-i*this.spacing*this.scale;this.at(Math.max(0,si),p,d);
      // 꼬리 칸이 출발점 뒤에 있을 때는 첫 구간 방향으로 늘어선다.
      if(si<0&&this.pts.length>1){d.set(this.pts[1].x-this.pts[0].x,0,this.pts[1].z-this.pts[0].z).normalize();p.addScaledVector(d,si);}
      part.position.copy(p);if(d.lengthSq()>1e-12)part.rotation.y=Math.atan2(d.x,d.z);part.scale.setScalar(this.scale);});
    this.at(s,this.head);}
  update(dt){if(this.done)return true;this.t=Math.min(this.duration,this.t+dt);const k=this.t/this.duration,e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const s=this.length*e;
    this.place(s);for(const w of this.wheels)w.rotation.x+=dt*18;if(this.t>=this.duration)this.done=true;return this.done;}
}

// 다익스트라: adj[i] = [[j, 거리], ...]
export function shortestPath(adj,start,goal){
  const n=adj.length,dist=new Float64Array(n).fill(Infinity),prev=new Int32Array(n).fill(-1),heap=[[0,start]];dist[start]=0;
  const push=x=>{heap.push(x);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=heap[i][0])break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p;}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m;}}return top;};
  while(heap.length){const [d,u]=pop();if(u===goal)break;if(d>dist[u])continue;for(const [v,w]of adj[u]){const nd=d+w;if(nd<dist[v]){dist[v]=nd;prev[v]=u;push([nd,v]);}}}
  if(!isFinite(dist[goal]))return null;const path=[];for(let u=goal;u!==-1;u=prev[u])path.push(u);return path.reverse();
}

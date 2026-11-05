// AGENT-GORGO-14 탈것: 부산 상세 지도는 자동차(실제 도로망 경로), 전국 지도는 기차(주요 철도 축을 단순화한 노선).
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
function shadow(p,w,d){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),new THREE.MeshBasicMaterial({color:'#31554b',transparent:true,opacity:.2,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.003;p.add(m);return m;}

// 자동차: +z가 앞. 길이 약 0.5(모형 단위). 고르고가 운전석에 앉아 있다.
export function buildCar(){
  const g=new THREE.Group(),wheels=[];
  shadow(g,.3,.56);
  box(g,.26,.08,.5,0,.085,0,'#e8784e');box(g,.262,.018,.5,0,.128,0,'#f3f0e6');
  box(g,.22,.085,.25,0,.17,-.035,'#f6efe0');box(g,.225,.012,.255,0,.218,-.035,'#d9653d');
  box(g,.19,.06,.01,0,.172,.092,'#86b9bd');box(g,.19,.05,.01,0,.172,-.162,'#86b9bd');
  for(const s of[-1,1]){box(g,.01,.05,.18,s*.112,.172,-.035,'#86b9bd');box(g,.045,.025,.01,s*.085,.095,.252,'#fff6c8');box(g,.045,.022,.01,s*.085,.095,-.252,'#d84a3a');}
  for(const s of[-1,1])for(const z of[.16,-.16])wheel(g,s*.13,.048,z,.048,wheels);
  gorgoHead(g,-.045,.2,.0,.9);
  g.userData.wheels=wheels;return g;
}

// 기차: 기관차 + 객차 2량. 각 량은 +z가 앞이며 따로 경로를 따라간다.
export function buildTrain(){
  const parts=[],wheels=[];
  const coach=(lead)=>{const g=new THREE.Group();shadow(g,.28,.74);
    box(g,.24,.17,lead?.56:.68,0,.13,lead?-.06:0,'#f4f2ea');
    box(g,.242,.035,lead?.56:.68,0,.115,lead?-.06:0,'#3f6fb0');box(g,.243,.012,lead?.56:.68,0,.142,lead?-.06:0,'#e8784e');
    box(g,.244,.045,lead?.48:.6,0,.18,lead?-.08:0,'#4a6470');box(g,.2,.02,lead?.56:.68,0,.222,lead?-.06:0,'#d9dbd3');
    if(lead){const nose=box(g,.24,.13,.16,0,.11,.27,'#f4f2ea');nose.scale.set(1,1,1);box(g,.2,.06,.012,0,.17,.28,'#4a6470');box(g,.21,.05,.12,0,.065,.33,'#f4f2ea');
      for(const s of[-1,1])box(g,.035,.02,.01,s*.07,.08,.395,'#fff6c8');gorgoHead(g,0,.18,.2,.85);}
    for(const s of[-1,1])for(const z of(lead?[.2,-.25]:[.25,-.25]))wheel(g,s*.11,.035,z,.035,wheels);
    return g;};
  parts.push(coach(true),coach(false),coach(false));
  return {parts,spacing:.76,wheels};
}

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

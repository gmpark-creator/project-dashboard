// AGENT-GORGO-34 장소별 건물 내부(룸): 같은 미니어처 화풍의 로비 방을 장소의 컨셉에 맞게 바꾼다.
// 방 뼈대(벽·문·안내 데스크·자료함·키오스크)는 interior.js, 여기서는 ① 색·바닥·창밖 풍경 ② 장소 소품을 정한다.
// 방 크기: x -5..5(왼쪽 벽 x=-5, 출입문 z=2.2), z -3.5..3.5(뒤 벽 z=-3.5). 비워 둘 곳: 안내 데스크(-2.6,-2.1) · 키오스크(x -0.6..3.9, z -2.3) · 자료함(4.0,0.6) · 출입문 앞.
import * as THREE from 'three';
import {makeShip} from './ships.js';

const FONT="'Noto Sans KR','Malgun Gothic',sans-serif";
const mats=new Map();const mat=(c,o={})=>{const k=c+JSON.stringify(o);if(!mats.has(k))mats.set(k,new THREE.MeshStandardMaterial({color:c,roughness:.8,...o}));return mats.get(k);};
const boxG=new THREE.BoxGeometry(1,1,1),cylG=new THREE.CylinderGeometry(1,1,1,16),sphG=new THREE.SphereGeometry(1,16,12);
const box=(p,w,h,d,x,y,z,c,o)=>{const m=new THREE.Mesh(boxG,typeof c==='string'?mat(c,o):c);m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;};
const cyl=(p,r,h,x,y,z,c,o)=>{const m=new THREE.Mesh(cylG,mat(c,o));m.scale.set(r,h,r);m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;};
const sph=(p,r,x,y,z,c)=>{const m=new THREE.Mesh(sphG,mat(c));m.scale.setScalar(r);m.position.set(x,y,z);m.castShadow=true;p.add(m);return m;};
const rnd=(i,s=0)=>{const n=Math.sin(i*127.1+s*311.7)*43758.5453;return n-Math.floor(n);};
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;}
const grp=(p,x,y,z,ry=0)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;p.add(g);return g;};

// ── 바닥 · 러그 · 창밖 풍경 ───────────────────────────
export function floorTexture(kind,a,b){
  if(kind==='tile')return canvasTex(1024,1024,(g,w,h)=>{const n=8,s=w/n;for(let y=0;y<n;y++)for(let x=0;x<n;x++){g.fillStyle=(x+y)%2?a:b;g.fillRect(x*s,y*s,s,s);}g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=3;for(let i=0;i<=n;i++){g.beginPath();g.moveTo(i*s,0);g.lineTo(i*s,h);g.moveTo(0,i*s);g.lineTo(w,i*s);g.stroke();}});
  if(kind==='concrete')return canvasTex(1024,1024,(g,w,h)=>{g.fillStyle=a;g.fillRect(0,0,w,h);for(let i=0;i<2600;i++){g.fillStyle='rgba('+(rnd(i)>.5?'255,255,255':'0,0,0')+','+(.03+rnd(i,3)*.05)+')';g.fillRect(rnd(i,1)*w,rnd(i,2)*h,2+rnd(i,4)*5,2+rnd(i,5)*5);}
    g.strokeStyle='rgba(0,0,0,.14)';g.lineWidth=4;for(let i=1;i<4;i++){g.beginPath();g.moveTo(i*w/4,0);g.lineTo(i*w/4,h);g.moveTo(0,i*h/4);g.lineTo(w,i*h/4);g.stroke();}g.fillStyle=b;g.fillRect(0,h*.62,w,26);});
  if(kind==='carpet')return canvasTex(1024,1024,(g,w,h)=>{g.fillStyle=a;g.fillRect(0,0,w,h);for(let i=0;i<9000;i++){g.fillStyle='rgba('+(rnd(i)>.5?'255,255,255':'0,0,0')+',.05)';g.fillRect(rnd(i,1)*w,rnd(i,2)*h,2,2);}g.strokeStyle=b;g.lineWidth=10;g.globalAlpha=.35;g.strokeRect(24,24,w-48,h-48);});
  return null; // wood = interior.js 기본
}
export function rugTexture(c1,c2,c3){return canvasTex(512,320,(g,w,h)=>{g.fillStyle=c1;g.fillRect(0,0,w,h);g.strokeStyle=c2;g.lineWidth=10;g.strokeRect(22,22,w-44,h-44);g.lineWidth=3;g.strokeRect(42,42,w-84,h-84);g.fillStyle=c3;for(let i=0;i<5;i++){g.save();g.translate(w/2+(i-2)*70,h/2);g.rotate(Math.PI/4);g.fillRect(-14,-14,28,28);g.restore();}});}

export const EXTRA_VIEWS={};
export {P,box,cyl,sph,mat,canvasTex,grp,rnd};
export function viewTexture(kind){
  if(EXTRA_VIEWS[kind])return canvasTex(256,256,(g,w,h)=>EXTRA_VIEWS[kind](g,w,h));
  return canvasTex(256,256,(g,w,h)=>{
    const sky=(a,b,c)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,a);gr.addColorStop(.7,b);gr.addColorStop(1,c);g.fillStyle=gr;g.fillRect(0,0,w,h);};
    const clouds=()=>{g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<5;i++){g.beginPath();g.ellipse(rnd(i,3)*w,30+rnd(i,4)*70,40+rnd(i)*40,12,0,0,7);g.fill();}};
    if(kind==='port'||kind==='newport'){sky('#9fd3e6','#d8f0f0','#f4f1dc');clouds();g.fillStyle='#6f9fb4';g.fillRect(0,h*.68,w,h*.32);g.fillStyle='#4f7f96';g.fillRect(0,h*.68,w,4);
      for(let i=0;i<6;i++){const x=14+i*42+rnd(i)*8;g.fillStyle='#c9553d';g.fillRect(x,h*.34,5,h*.34);g.fillRect(x-18,h*.34,46,6);g.fillStyle='#e0a63a';g.fillRect(x+14,h*.34,3,28);}
      for(let i=0;i<14;i++){g.fillStyle=['#c9553d','#2f6fa3','#e0a63a','#3f8f6e','#8b5a9c'][i%5];g.fillRect(8+i*18,h*.62,16,12);g.fillRect(8+i*18,h*.55,16,7);}
      g.fillStyle='#2f3b44';g.fillRect(150,h*.7,96,12);g.fillStyle='#e9e4d4';g.fillRect(200,h*.64,24,10);}
    else if(kind==='sea'){sky('#8fc7e6','#cfe9f2','#e8f3ee');clouds();g.fillStyle='#5f9db8';g.fillRect(0,h*.62,w,h*.38);g.fillStyle='#7db5cb';for(let i=0;i<10;i++)g.fillRect(rnd(i)*w,h*.65+rnd(i,2)*h*.3,30,2);
      for(const x of[40,110,180,232]){g.fillStyle='#f4f6f4';g.fillRect(x,h*.34,3,h*.28);g.save();g.translate(x+1.5,h*.34);for(let k=0;k<3;k++){g.rotate(Math.PI*2/3);g.fillRect(-1.5,-28,3,28);}g.restore();}}
    else if(kind==='hillside'){sky('#a8d8ea','#e3f3ee','#f7efd8');clouds();g.fillStyle='#8fb97a';g.beginPath();g.moveTo(0,h);g.lineTo(0,h*.45);g.lineTo(w*.5,h*.2);g.lineTo(w,h*.42);g.lineTo(w,h);g.fill();
      const cols=['#e8a39a','#f1c97a','#8cc7b5','#9ab6e0','#e6b8d4','#f4e4a0'];for(let r=0;r<7;r++)for(let c=0;c<12;c++){g.fillStyle=cols[(r*3+c)%6];g.fillRect(8+c*20+rnd(r*9+c)*5,h*.34+r*17,14,11);g.fillStyle='#d9d3c3';g.fillRect(8+c*20+rnd(r*9+c)*5,h*.34+r*17,14,3);}
      g.fillStyle='#6f9fb4';g.fillRect(0,h*.92,w,h*.08);}
    else if(kind==='yard'){sky('#b8d9e6','#e4eef0','#efeadb');clouds();g.fillStyle='#8f958f';g.fillRect(0,h*.62,w,h*.38);for(let r=0;r<3;r++)for(let c=0;c<10;c++){g.fillStyle=['#c9553d','#2f6fa3','#e0a63a','#3f8f6e','#8b5a9c','#d9d3c3'][(r*4+c)%6];g.fillRect(6+c*24,h*.5+r*18,22,15);}
      g.fillStyle='#e0a63a';g.fillRect(180,h*.2,6,h*.42);g.fillRect(150,h*.2,70,7);}
    else if(kind==='industrial'){sky('#c9dde6','#e6eef0','#efe9d8');clouds();g.fillStyle='#8a948f';for(let i=0;i<6;i++)g.fillRect(10+i*40,h*.45-rnd(i)*30,28,h*.55);g.fillStyle='#a0aaa5';g.fillRect(0,h*.78,w,h*.22);}
    else{sky('#9fd3e6','#d8f0f0','#f4f1dc');clouds();g.fillStyle='rgba(120,160,150,.55)';for(let i=0;i<14;i++){const bw=10+rnd(i,9)*22,bh=30+rnd(i,8)*90;g.fillRect(i*20+rnd(i)*8,h-bh,bw,bh);}
      g.fillStyle='rgba(150,190,200,.5)';for(let i=0;i<8;i++){const bw=14+rnd(i,5)*16,bh=60+rnd(i,6)*80;g.fillRect(8+i*32,h-bh,bw,bh);}}
  });
}

// ── 소품 ────────────────────────────────────────────
const P={
  poster(r,x,y,z,ry,w,h,title,sub,c1='#2f4c45',c2='#e8784e'){const t=canvasTex(512,Math.round(512*h/w),(g,cw,ch)=>{g.fillStyle='#f6f1e3';g.fillRect(0,0,cw,ch);g.fillStyle=c1;g.fillRect(0,0,cw,ch*.34);g.fillStyle=c2;g.fillRect(0,ch*.34,cw,10);g.fillStyle='#fff';g.font=`800 ${Math.round(cw*.11)}px ${FONT}`;g.textAlign='center';g.textBaseline='middle';
      const lines=String(title).split('\n');lines.forEach((l,i)=>g.fillText(l,cw/2,ch*.17+(i-(lines.length-1)/2)*cw*.12));g.fillStyle=c1;g.font=`600 ${Math.round(cw*.07)}px ${FONT}`;String(sub||'').split('\n').forEach((l,i)=>g.fillText(l,cw/2,ch*.6+i*cw*.09));});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.7}));m.position.set(x,y,z);m.rotation.y=ry;r.add(m);box(r,w+.08,h+.08,.03,x,y,z,'#6b5640').position.add(new THREE.Vector3(Math.sin(ry)*-.02,0,Math.cos(ry)*-.02));return m;},
  flag(r,x,z,kind='kr',h=2.1){const g=grp(r,x,0,z);cyl(g,.025,h,0,h/2,0,'#c9c4b2');sph(g,.04,0,h+.02,0,'#e6c477');box(g,.5,.06,.06,0,.04,0,'#4a4a4a');
    const t=canvasTex(256,170,(c,w,hh)=>{if(kind==='kr'){c.fillStyle='#fff';c.fillRect(0,0,w,hh);c.fillStyle='#cd2e3a';c.beginPath();c.arc(w/2,hh/2,34,Math.PI,0);c.fill();c.fillStyle='#0047a0';c.beginPath();c.arc(w/2,hh/2,34,0,Math.PI);c.fill();c.fillStyle='#222';for(const [x0,y0] of[[28,24],[w-28,24],[28,hh-24],[w-28,hh-24]]){c.fillRect(x0-16,y0-9,32,5);c.fillRect(x0-16,y0+4,32,5);}}
      else if(kind==='blue'){c.fillStyle='#1d56a6';c.fillRect(0,0,w,hh);c.fillStyle='#fff';c.beginPath();c.arc(w/2,hh/2,34,0,7);c.fill();c.fillStyle='#1d56a6';c.beginPath();c.arc(w/2,hh/2,22,0,7);c.fill();c.fillStyle='#fff';c.fillRect(w/2-3,hh/2-30,6,60);}
      else{c.fillStyle='#2f6b6e';c.fillRect(0,0,w,hh);c.fillStyle='#fff';c.font='800 44px '+FONT;c.textAlign='center';c.textBaseline='middle';c.fillText('KCS',w/2,hh/2);}});
    const f=new THREE.Mesh(new THREE.PlaneGeometry(.78,.52),new THREE.MeshStandardMaterial({map:t,side:THREE.DoubleSide,roughness:.9}));f.position.set(.4,h-.3,0);g.add(f);return g;},
  desk(r,x,z,ry=0,mon=true){const g=grp(r,x,0,z,ry);box(g,1.5,.06,.75,0,.74,0,'#d8cdb4');for(const sx of[-.68,.68])for(const sz of[-.3,.3])box(g,.05,.72,.05,sx,.36,sz,'#59636a');
    if(mon){box(g,.5,.32,.04,0,1.05,-.2,'#1d2a30');box(g,.46,.28,.01,0,1.05,-.175,'#7fb7c9');box(g,.06,.2,.06,0,.87,-.2,'#59636a');box(g,.38,.02,.14,0,.78,.1,'#2d333a');}
    // 의자
    box(g,.45,.06,.45,0,.45,.75,'#3d4a52');box(g,.45,.5,.06,0,.75,.97,'#3d4a52');cyl(g,.04,.4,0,.22,.75,'#59636a');return g;},
  counter(r,x,z,w=2.4,ry=0,top='#cfc6b0',base='#e9e2d0'){const g=grp(r,x,0,z,ry);box(g,w,.95,.6,0,.475,0,base);box(g,w+.1,.07,.7,0,.98,0,top);
    const glass=new THREE.Mesh(boxG,new THREE.MeshStandardMaterial({color:'#bfe0e6',transparent:true,opacity:.35,roughness:.1}));glass.scale.set(w,.7,.03);glass.position.set(0,1.37,-.25);g.add(glass);box(g,w,.05,.05,0,1.73,-.25,'#59636a');box(g,.05,.7,.05,-w/2,1.37,-.25,'#59636a');box(g,.05,.7,.05,w/2,1.37,-.25,'#59636a');
    box(g,.34,.24,.03,w*.25,1.2,.1,'#1d2a30');box(g,.1,.2,.1,w*.25,1.04,.1,'#59636a');return g;},
  booth(r,x,z,ry=0,color='#2f4c6a'){const g=grp(r,x,0,z,ry);box(g,1.3,.95,.8,0,.475,0,color);box(g,1.4,.06,.9,0,.98,0,'#d8d0bd');const gl=new THREE.Mesh(boxG,new THREE.MeshStandardMaterial({color:'#bfe0e6',transparent:true,opacity:.32,roughness:.1}));gl.scale.set(1.3,1.0,.03);gl.position.set(0,1.5,.38);g.add(gl);box(g,1.34,.06,.06,0,2.02,.38,'#59636a');
    box(g,.2,.12,.14,.4,1.06,.1,'#2d333a');box(g,.14,.02,.1,.4,1.12,.1,'#7fd6e0');cyl(g,.03,.5,-.5,1.25,-.2,'#59636a');sph(g,.07,-.5,1.55,-.2,'#e8c25a');return g;},
  stanchions(r,x,z,ry,n=4,gap=.7){const g=grp(r,x,0,z,ry);for(let i=0;i<n;i++){cyl(g,.03,.85,i*gap,.43,0,'#bfa763');cyl(g,.08,.03,i*gap,.015,0,'#bfa763');sph(g,.045,i*gap,.88,0,'#bfa763');if(i)box(g,gap,.04,.015,(i-.5)*gap,.8,0,'#c9553d');}return g;},
  bench(r,x,z,ry=0,len=1.6,c='#7f9c94'){const g=grp(r,x,0,z,ry);box(g,len,.1,.45,0,.42,0,c);box(g,len,.5,.08,0,.72,-.2,c);for(const s of[-1,1])box(g,.06,.4,.4,s*(len/2-.06),.2,0,'#4a5a58');return g;},
  xray(r,x,z,ry=0){const g=grp(r,x,0,z,ry);box(g,2.6,.42,.7,0,.21,0,'#3d4650');box(g,2.1,.08,.5,0,.46,0,'#1d2428');for(let i=0;i<9;i++)box(g,.03,.09,.5,-1.0+i*.25,.5,0,'#2a3238');
    box(g,1.0,1.0,.95,0,.9,0,'#d0d6d8');box(g,.84,.62,.8,0,.78,0,'#10181c');box(g,1.04,.08,.98,0,1.42,0,'#aeb5b8');box(g,.5,.28,.06,.9,1.15,.1,'#10181c');box(g,.44,.22,.01,.9,1.15,.14,'#5fe0a0');
    box(g,.34,.24,.3,-.9,.62,0,'#c9553d');box(g,.3,.2,.26,.8,.6,0,'#2f6fa3');return g;},
  table(r,x,z,ry,w=1.4,d=.8,c='#b99a6e'){const g=grp(r,x,0,z,ry);box(g,w,.07,d,0,.78,0,c);for(const sx of[-1,1])for(const sz of[-1,1])box(g,.06,.76,.06,sx*(w/2-.07),.38,sz*(d/2-.07),'#59636a');return g;},
  boxes(r,x,z,ry=0,n=3,s=.38){const g=grp(r,x,0,z,ry);for(let i=0;i<n;i++){const k=i%3;box(g,s*(1.1-k*.1),s*.8,s,(i%2)*s*.2,s*.4+Math.floor(i/2)*s*.8,0,['#c8a46e','#b98f5c','#d4b684'][k]);box(g,s*.4,.012,s*1.02,(i%2)*s*.2,s*.8+Math.floor(i/2)*s*.8,0,'#8a6a40');}return g;},
  pallet(r,x,z,ry=0,stack=3,col){const g=grp(r,x,0,z,ry);box(g,1.0,.12,.8,0,.06,0,'#b78d5a');for(let i=0;i<3;i++)box(g,1.0,.03,.08,0,.135,-.28+i*.28,'#a97f4d');
    for(let k=0;k<stack;k++)for(let a=0;a<2;a++)for(let b=0;b<2;b++)box(g,.44,.3,.34,-.24+a*.48,.3+k*.31,-.2+b*.4,col||['#c8a46e','#b98f5c','#d4b684'][(a+b+k)%3]);return g;},
  rack(r,x,z,ry=0,w=2.6,levels=3){const g=grp(r,x,0,z,ry);for(const sx of[-1,1])for(const sz of[-1,1])box(g,.07,levels*.95+.2,.07,sx*(w/2),((levels*.95+.2)/2),sz*.38,'#2f6fa3');
    for(let l=0;l<=levels;l++){box(g,w,.06,.06,0,.2+l*.95,-.38,'#e8892f');box(g,w,.06,.06,0,.2+l*.95,.38,'#e8892f');if(l<levels)box(g,w-.1,.03,.76,0,.23+l*.95,0,'#cfd4d6');}
    for(let l=0;l<levels;l++)for(let i=0;i<4;i++)if(rnd(l*4+i,x)>.2){const s=.5+rnd(i,l)*.12;box(g,s,s*.7,.5,-w/2+.45+i*(w/4.2),.25+l*.95+s*.35+.03,0,['#c8a46e','#b98f5c','#d4b684','#cdb98a'][(i+l)%4]);}return g;},
  container(r,x,z,ry=0,col='#c9553d',len=2.4,stack=1){const g=grp(r,x,0,z,ry);for(let k=0;k<stack;k++){box(g,len,.82,.9,0,.45+k*.84,0,col);const dark=new THREE.Color(col).multiplyScalar(.8).getStyle();for(let i=0;i<Math.round(len/.14);i++)box(g,.045,.74,.02,-len/2+.1+i*.14,.45+k*.84,.455,dark);box(g,.04,.84,.9,-len/2,.45+k*.84,0,'#4a4f52');box(g,.04,.84,.9,len/2,.45+k*.84,0,'#4a4f52');}return g;},
  forklift(r,x,z,ry=0){const g=grp(r,x,0,z,ry);box(g,.8,.4,1.2,0,.4,0,'#e8b43a');box(g,.7,.5,.7,0,.85,-.2,'#2d333a');box(g,.74,.04,.74,0,1.35,-.2,'#e8b43a');for(const sx of[-1,1]){box(g,.04,.5,.04,sx*.34,1.1,-.5,'#e8b43a');box(g,.04,.5,.04,sx*.34,1.1,.1,'#e8b43a');cyl(g,.18,.14,sx*.43,.18,.35,'#26292d').rotation.z=Math.PI/2;cyl(g,.18,.14,sx*.43,.18,-.35,'#26292d').rotation.z=Math.PI/2;}
    box(g,.06,1.3,.06,-.25,.85,.72,'#59636a');box(g,.06,1.3,.06,.25,.85,.72,'#59636a');box(g,.06,.06,.9,-.25,.1,1.2,'#59636a');box(g,.06,.06,.9,.25,.1,1.2,'#59636a');return g;},
  lockers(r,x,z,ry=0,n=4,col='#4a6f8a'){const g=grp(r,x,0,z,ry);for(let i=0;i<n;i++){box(g,.42,1.6,.45,i*.44,.8,0,col);box(g,.34,.02,.02,i*.44,1.2,.24,'#2a3238');box(g,.03,.3,.02,i*.44+.12,1.0,.24,'#d9d3c3');}return g;},
  monitorWall(r,x,y,z,ry,cols=3,rows=2){const g=grp(r,x,y,z,ry);for(let a=0;a<cols;a++)for(let b=0;b<rows;b++){box(g,.62,.4,.04,(a-(cols-1)/2)*.66,(b-(rows-1)/2)*.44,0,'#1d2a30');const t=canvasTex(128,80,(c,w,h)=>{c.fillStyle='#10181c';c.fillRect(0,0,w,h);c.strokeStyle='#5fe0a0';c.lineWidth=2;c.beginPath();for(let i=0;i<w;i+=6){const v=h/2+Math.sin(i*.12+a*2+b)*h*.25*rnd(i,a+b);i?c.lineTo(i,v):c.moveTo(i,v);}c.stroke();});const m=new THREE.Mesh(new THREE.PlaneGeometry(.56,.34),new THREE.MeshBasicMaterial({map:t}));m.position.set((a-(cols-1)/2)*.66,(b-(rows-1)/2)*.44,.025);g.add(m);}return g;},
  whiteboard(r,x,y,z,ry,w=1.8,h=1.0){const g=grp(r,x,y,z,ry);box(g,w+.08,h+.08,.04,0,0,0,'#9aa5a8');const t=canvasTex(512,300,(c,cw,ch)=>{c.fillStyle='#f6f8f6';c.fillRect(0,0,cw,ch);const cols=['#f1d36b','#f09a8c','#8cc7b5','#9ab6e0'];for(let i=0;i<9;i++){c.fillStyle=cols[i%4];c.fillRect(24+(i%5)*96,24+Math.floor(i/5)*110,80,80);c.fillStyle='#4a4f57';for(let l=0;l<3;l++)c.fillRect(34+(i%5)*96,40+Math.floor(i/5)*110+l*16,50,4);}});const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.5}));m.position.z=.025;g.add(m);return g;},
  portModel(r,x,z,ry=0){const g=grp(r,x,0,z,ry);P.table(g,0,0,0,2.0,1.1,'#cfc6b0');box(g,1.9,.04,1.0,0,.84,0,'#7fb7c9');box(g,1.1,.08,.5,-.35,.88,.18,'#a8a89a');
    for(let i=0;i<3;i++){const cx=-.7+i*.5;box(g,.03,.34,.03,cx,1.05,.0,'#c9553d');box(g,.03,.34,.03,cx,1.05,.34,'#c9553d');box(g,.03,.03,.5,cx,1.23,.17,'#c9553d');}
    for(let i=0;i<12;i++)box(g,.1,.06,.16,-.9+(i%6)*.14,.95+Math.floor(i/6)*.06,.3+(i%2)*.0,['#c9553d','#2f6fa3','#e0a63a','#3f8f6e'][i%4]);const ship=makeShip('container','#c96a4a');ship.scale.setScalar(.5);ship.position.set(.5,.86,-.2);ship.rotation.y=Math.PI/2;g.add(ship);
    box(g,2.04,.04,1.14,0,.8,0,'#bfd8de');return g;},
  shipCase(r,x,y,z,ry,style='tanker',color='#3f6fae'){const g=grp(r,x,y,z,ry);box(g,1.2,.9,.5,0,0,0,'#8a6a40');const gl=new THREE.Mesh(boxG,new THREE.MeshStandardMaterial({color:'#bfe0e6',transparent:true,opacity:.28,roughness:.1}));gl.scale.set(1.12,.82,.44);gl.position.set(0,0,.03);g.add(gl);const s=makeShip(style,color);s.scale.setScalar(.7);s.rotation.y=Math.PI/2;s.position.set(0,-.18,0);g.add(s);return g;},
  shipPedestal(r,x,z,style='tanker',color='#3f6fae',ry=0){const g=grp(r,x,0,z,ry);box(g,.9,.62,.9,0,.31,0,'#6b5640');box(g,.96,.05,.96,0,.645,0,'#8a6a40');const gl=new THREE.Mesh(boxG,new THREE.MeshStandardMaterial({color:'#bfe0e6',transparent:true,opacity:.28,roughness:.1}));gl.scale.set(.86,.62,.86);gl.position.set(0,1.0,0);g.add(gl);for(const sx of[-1,1])for(const sz of[-1,1])box(g,.03,.64,.03,sx*.43,1.0,sz*.43,'#59636a');const s=makeShip(style,color);s.scale.setScalar(.74);s.rotation.y=Math.PI/2.4;s.position.set(0,.7,0);g.add(s);return g;},
  turbine(r,x,z,ry=0){const g=grp(r,x,0,z,ry);P.table(g,0,0,0,1.6,.9,'#cfc6b0');box(g,1.5,.03,.8,0,.83,0,'#7fb7c9');cyl(g,.025,.9,0,1.3,0,'#f4f6f4');box(g,.07,.07,.14,0,1.77,.02,'#f4f6f4');
    const hub=grp(g,0,1.77,.1);for(let k=0;k<3;k++){const bl=box(hub,.03,.62,.02,0,.31,0,'#f4f6f4');bl.rotation.z=0;bl.position.set(Math.sin(k*2.094)*.3*-1,Math.cos(k*2.094)*.3,0);bl.rotation.z=k*2.094;}return g;},
  blueprint(r,x,z,ry=0){const g=grp(r,x,0,z,ry);P.table(g,0,0,0,1.8,1.0,'#9aa5a8');const t=canvasTex(512,300,(c,w,h)=>{c.fillStyle='#2f5f8f';c.fillRect(0,0,w,h);c.strokeStyle='#cfe3f2';c.lineWidth=2;for(let i=0;i<w;i+=32){c.beginPath();c.moveTo(i,0);c.lineTo(i,h);c.stroke();}for(let i=0;i<h;i+=32){c.beginPath();c.moveTo(0,i);c.lineTo(w,i);c.stroke();}
      for(let k=0;k<5;k++){c.beginPath();c.arc(70+k*90,120+rnd(k)*60,26,0,7);c.stroke();c.beginPath();c.moveTo(70+k*90,150);c.lineTo(70+k*90,240);c.stroke();}});const m=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.84),new THREE.MeshStandardMaterial({map:t,roughness:.6}));m.rotation.x=-Math.PI/2;m.position.y=.825;g.add(m);return g;},
  globe(r,x,z){const g=grp(r,x,0,z);cyl(g,.18,.05,0,.025,0,'#59636a');cyl(g,.03,.6,0,.3,0,'#59636a');const t=canvasTex(256,128,(c,w,h)=>{c.fillStyle='#4f86b8';c.fillRect(0,0,w,h);c.fillStyle='#8fb97a';for(let i=0;i<9;i++){c.beginPath();c.ellipse(rnd(i)*w,rnd(i,2)*h,18+rnd(i,3)*24,10+rnd(i,4)*14,0,0,7);c.fill();}});const m=new THREE.Mesh(new THREE.SphereGeometry(.28,24,16),new THREE.MeshStandardMaterial({map:t,roughness:.6}));m.position.set(0,.88,0);m.castShadow=true;g.add(m);return g;},
  medcab(r,x,z,ry=0){const g=grp(r,x,0,z,ry);box(g,.9,1.7,.45,0,.85,0,'#f1f4f3');box(g,.84,.5,.02,0,1.25,.23,'#bfe0e6',{transparent:true,opacity:.5});box(g,.84,.5,.02,0,.55,.23,'#d8dedc');box(g,.3,.09,.02,0,1.62,.235,'#3a9a8a');box(g,.09,.3,.02,0,1.62,.236,'#3a9a8a');return g;},
  crossSign(r,x,y,z,ry){const g=grp(r,x,y,z,ry);box(g,.7,.7,.04,0,0,0,'#f4f6f4');box(g,.46,.14,.05,0,0,0,'#2f9a6e');box(g,.14,.46,.05,0,0,0,'#2f9a6e');return g;},
  thermal(r,x,z,ry=0){const g=grp(r,x,0,z,ry);for(const a of[0,2.09,4.19])box(g,.04,1.4,.04,Math.sin(a)*.22,.7,Math.cos(a)*.22,'#59636a').rotation.z=Math.sin(a)*.12;box(g,.3,.2,.22,0,1.5,0,'#2d333a');cyl(g,.07,.1,0,1.5,.14,'#10181c').rotation.x=Math.PI/2;box(g,.46,.34,.04,.7,1.15,0,'#1d2a30');
    const t=canvasTex(128,96,(c,w,h)=>{const gr=c.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#3a2a8a');gr.addColorStop(.5,'#e8892f');gr.addColorStop(1,'#f4e46a');c.fillStyle=gr;c.fillRect(0,0,w,h);c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.arc(w/2,h*.34,16,0,7);c.fill();c.fillRect(w/2-22,h*.5,44,40);});const m=new THREE.Mesh(new THREE.PlaneGeometry(.4,.28),new THREE.MeshBasicMaterial({map:t}));m.position.set(.7,1.15,.025);g.add(m);cyl(g,.03,1.0,.7,.5,0,'#59636a');return g;},
  sanitizer(r,x,z){const g=grp(r,x,0,z);cyl(g,.03,1.0,0,.5,0,'#c9c4b2');cyl(g,.05,.04,0,.02,0,'#59636a');box(g,.14,.2,.1,0,1.05,0,'#f4f6f4');box(g,.1,.06,.02,0,1.06,.06,'#3a9a8a');return g;},
  coffee(r,x,z,ry=0){const g=grp(r,x,0,z,ry);box(g,.7,.9,.5,0,.45,0,'#e9e2d0');box(g,.5,.5,.4,0,1.15,0,'#2f4c45');box(g,.3,.1,.02,0,1.2,.21,'#10181c');cyl(g,.06,.12,0,.96,.1,'#f4f1e6');return g;},
  plant(r,x,z,s=1){const g=grp(r,x,0,z);g.scale.setScalar(s);cyl(g,.26,.5,0,.25,0,'#d9cbb0');cyl(g,.24,.04,0,.5,0,'#5d4a36');for(let i=0;i<7;i++){const a=i/7*6.28;const l=sph(g,.22,Math.cos(a)*.16,.78+rnd(i,x)*.35,Math.sin(a)*.16,i%2?'#5f9a6a':'#77ad73');l.scale.set(.22,.31,.22);}sph(g,.25,0,1.12,0,'#6aa36d');return g;},
  seaMap(r,x,y,z,ry,w=2.4,h=1.4){const g=grp(r,x,y,z,ry);box(g,w+.1,h+.1,.04,0,0,0,'#6b5640');const t=canvasTex(512,300,(c,cw,ch)=>{c.fillStyle='#8fc7d6';c.fillRect(0,0,cw,ch);c.fillStyle='#e8dcb4';c.beginPath();c.moveTo(0,0);c.lineTo(cw*.55,0);c.quadraticCurveTo(cw*.5,ch*.3,cw*.62,ch*.5);c.quadraticCurveTo(cw*.5,ch*.8,cw*.58,ch);c.lineTo(0,ch);c.fill();c.fillStyle='#b8d7a0';c.beginPath();c.ellipse(cw*.18,ch*.4,60,36,0,0,7);c.fill();
      c.strokeStyle='#e8784e';c.lineWidth=3;c.setLineDash([8,6]);c.beginPath();c.moveTo(cw*.6,ch*.52);c.quadraticCurveTo(cw*.8,ch*.3,cw*.95,ch*.2);c.moveTo(cw*.6,ch*.52);c.quadraticCurveTo(cw*.85,ch*.7,cw*.95,ch*.85);c.stroke();c.setLineDash([]);c.fillStyle='#c9553d';for(const [px,py] of[[.6,.52],[.78,.36],[.88,.74]]){c.beginPath();c.arc(cw*px,ch*py,7,0,7);c.fill();}
      c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1;for(let i=1;i<10;i++){c.beginPath();c.moveTo(i*cw/10,0);c.lineTo(i*cw/10,ch);c.stroke();}for(let i=1;i<6;i++){c.beginPath();c.moveTo(0,i*ch/6);c.lineTo(cw,i*ch/6);c.stroke();}});const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.6}));m.position.z=.025;g.add(m);return g;},
  glassDoor(r,x,y,z,ry,w=1.6,h=2.2,color='#bfe0e6'){const g=grp(r,x,y,z,ry);const gl=new THREE.Mesh(boxG,new THREE.MeshStandardMaterial({color,transparent:true,opacity:.35,roughness:.1}));gl.scale.set(w,h,.04);g.add(gl);box(g,w+.06,.05,.06,0,h/2,0,'#59636a');box(g,.05,h,.06,-w/2,0,0,'#59636a');box(g,.05,h,.06,w/2,0,0,'#59636a');return g;},
  rollDoor(r,x,y,z,ry,w=3.2,h=2.4){const g=grp(r,x,y,z,ry);box(g,w,h,.08,0,0,0,'#9aa5a8');for(let i=0;i<14;i++)box(g,w-.1,.03,.1,0,-h/2+.12+i*.17,0,'#7d878a');box(g,w+.2,.12,.14,0,h/2+.06,0,'#e6c92a');for(const s of[-1,1])box(g,.1,h,.12,s*(w/2+.05),0,0,'#e6c92a');return g;},
  hazardLine(r,x,z,ry,len=4,w=.18){const g=grp(r,x,0,z,ry);for(let i=0;i<Math.round(len/.3);i++){const b=box(g,.16,.004,w,-len/2+i*.3,.003,0,i%2?'#e6c92a':'#2a2f33');}return g;},
};

// ── 장소별 테마 ─────────────────────────────────────
// view: 창밖 풍경 · floor: [kind,a,b] · wall/wain: 벽·징두리 · sign: 간판 그라데이션 [왼,오른,띠] · rug: [바탕,테두리,무늬] | null · sofa: 기본 소파 유지 여부
export const THEMES={
  default:{view:'city',floor:null,wall:'#f3ecdc',wain:'#c9b48c',sign:['#2f4c45','#3f6653','#e8784e'],rug:['#3f6653','#e8d9b3','#e8784e'],sofa:true,build(){}},
  skybiz:{view:'city',floor:['carpet','#5f7486','#7f93a3'],wall:'#eef1f0',wain:'#a9b6bd',sign:['#2f4c6a','#3f6a8a','#e8784e'],rug:null,sofa:false,
    build(r){P.desk(r,-3.1,.9,Math.PI/2.4);P.desk(r,-3.1,2.7,Math.PI/2.4);P.whiteboard(r,-4.88,1.8,.2,Math.PI/2,1.5,1.0);P.coffee(r,4.2,-3.0);P.plant(r,4.4,2.9,.9);P.table(r,1.2,1.9,0,2.2,.9,'#d8cdb4');P.boxes(r,.6,1.9,0,3,.3);P.poster(r,-4.9,1.9,-1.5,Math.PI/2,.9,1.2,'PANDA\nEXPRESS','선박 대리점');}},
  'imm-jungang':{view:'city',floor:['tile','#e8e4d8','#d2cdbd'],wall:'#e9eef2',wain:'#8fa3b8',sign:['#243b5a','#33507a','#d9b44a'],rug:null,sofa:false,
    build(r){P.booth(r,-1.2,.6,0,'#2f4c6a');P.booth(r,.6,.6,0,'#2f4c6a');P.stanchions(r,-1.6,2.3,0,5,.7);P.flag(r,-4.3,-.2,'kr');P.flag(r,-3.7,-.2,'blue');P.bench(r,2.2,2.6,Math.PI,1.8,'#6f86a0');P.bench(r,.4,2.9,Math.PI,1.8,'#6f86a0');P.poster(r,-4.9,1.9,-1.9,Math.PI/2,.9,1.2,'출입국\n외국인청','법무부','#243b5a','#d9b44a');P.plant(r,4.4,2.9,.9);}},
  'imm-gamcheon':{view:'hillside',floor:['tile','#efe6d2','#e0d6bd'],wall:'#f1ebdc',wain:'#8fa9b8',sign:['#243b5a','#3a6a8a','#e8a39a'],rug:null,sofa:false,
    build(r){P.counter(r,-1.0,.2,2.4,0,'#d9d0bc','#e6dec8');P.stanchions(r,-2.0,2.2,0,4,.7);P.bench(r,1.8,2.7,Math.PI,1.6,'#6f86a0');P.bench(r,3.6,2.7,Math.PI,1.6,'#6f86a0');P.flag(r,-4.3,-.2,'kr');P.poster(r,-4.9,1.9,-1.9,Math.PI/2,.9,1.2,'감천항\n출장소','외항선 승선 신고','#243b5a','#e8a39a');P.whiteboard(r,-4.88,1.8,-.4,Math.PI/2,1.2,.8);P.plant(r,4.4,2.9,.9);}},
  customs:{view:'port',floor:['tile','#d9dedd','#c5cccb'],wall:'#e8eeee',wain:'#5f8a8c',sign:['#1f4f52','#2f6b6e','#e8b43a'],rug:null,sofa:false,
    build(r){P.xray(r,-1.4,1.3,0);P.table(r,1.2,1.5,0,1.8,.8,'#cfd4d6');P.boxes(r,.7,1.5,0,4,.34);P.boxes(r,1.7,1.5,.3,2,.3);P.flag(r,-4.3,-.2,'kr');P.flag(r,-3.7,-.2,'teal');P.hazardLine(r,-1.4,2.3,0,3.2);P.poster(r,-4.9,1.9,-1.9,Math.PI/2,.9,1.2,'KCS\n관세청','부산본부세관','#1f4f52','#e8b43a');P.plant(r,4.4,2.9,.9);}},
  bpa:{view:'port',floor:['carpet','#3a5877','#5f7f9f'],wall:'#eef2f4',wain:'#9eb4c6',sign:['#2c4f8a','#3f6aaa','#e8892f'],rug:null,sofa:false,
    build(r){P.portModel(r,-1.3,1.6,.2);P.seaMap(r,-4.88,1.9,-1.3,Math.PI/2,2.2,1.3);P.table(r,2.4,2.2,0,1.6,.8,'#d8cdb4');P.boxes(r,2.0,2.2,0,2,.3);P.plant(r,4.4,2.9,.9);P.flag(r,-4.3,-2.7,'kr');}},
  'mof-busan':{view:'sea',floor:['carpet','#23384f','#45607a'],wall:'#ecf0f3',wain:'#7f96ab',sign:['#1d3a66','#2f5c9a','#d9b44a'],rug:null,sofa:false,
    build(r){P.shipPedestal(r,-3.9,-.2,'tanker','#3f6fae');P.shipPedestal(r,-3.9,1.05,'container','#c96a4a',.3);P.seaMap(r,-4.88,1.9,-1.3,Math.PI/2,2.0,1.2);P.table(r,-.6,1.9,0,1.8,1.0,'#b99a6e');P.globe(r,-.6,1.9);P.flag(r,-4.3,-2.7,'kr');P.flag(r,-3.7,-2.7,'blue');P.bench(r,1.8,2.8,Math.PI,1.6,'#4a5f78');P.plant(r,4.4,2.9,.9);}},
  quarantine:{view:'city',floor:['tile','#f1f5f4','#dde7e6'],wall:'#f2f7f6',wain:'#8fd0c4',sign:['#2f8f84','#3fae9f','#f4f6f4'],rug:null,sofa:false,
    build(r){P.thermal(r,-1.2,1.6,.5);P.medcab(r,-4.4,-.4,Math.PI/2);P.medcab(r,-4.4,.6,Math.PI/2);P.sanitizer(r,-3.4,2.7);P.bench(r,1.8,2.8,Math.PI,1.6,'#9fd0c8');P.crossSign(r,-4.9,2.2,-1.3,Math.PI/2);P.stanchions(r,-2.2,.4,0,3,.7);P.plant(r,4.4,2.9,.9);P.poster(r,-4.9,1.9,1.2,Math.PI/2,.7,.9,'검역','건강 상태 질문서','#2f8f84','#f4f6f4');}},
  'intergis-7':{view:'yard',floor:['concrete','#b9bdb9','#e6c92a'],wall:'#e4e8e6',wain:'#79858a',sign:['#3b434a','#59646b','#e6c92a'],rug:null,sofa:false,
    build(r){P.monitorWall(r,-4.88,1.9,-1.2,Math.PI/2,3,2);P.lockers(r,-4.6,.6,Math.PI/2,5,'#4a6f8a');P.container(r,-1.2,2.2,.1,'#2f6fa3',2.4);P.container(r,1.6,2.4,-.1,'#c9553d',2.4,2);P.pallet(r,3.6,2.4,.2,2);P.hazardLine(r,0,.6,0,6);P.forklift(r,-3.0,2.2,.9);P.plant(r,4.4,-3.0,.9);}},
  'newport-cfs':{view:'newport',floor:['concrete','#b0b3ae','#e6c92a'],wall:'#d9ddd8',wain:'#8d9690',sign:['#3a4d3f','#587a52','#e6c92a'],rug:null,sofa:false,
    build(r){P.rollDoor(r,-.2,1.2,-3.44,0,3.2,2.4);P.rack(r,-3.9,.4,Math.PI/2,2.6,3);P.rack(r,-3.9,2.4,Math.PI/2,2.2,3);P.pallet(r,1.0,2.0,.15,3);P.pallet(r,2.4,2.2,-.2,2);P.pallet(r,3.8,2.0,.1,3);P.forklift(r,-1.2,2.0,.4);P.hazardLine(r,.8,.7,0,6);P.boxes(r,4.2,-3.0,0,3,.36);}},
  'jindo-wind':{view:'sea',floor:['carpet','#4c6078','#6f8aa3'],wall:'#eef3f4',wain:'#8fb0c4',sign:['#c46a1f','#e8892f','#f4f6f4'],rug:null,sofa:false,
    build(r){P.turbine(r,-1.3,1.7,.3);P.blueprint(r,1.8,2.2,0);P.poster(r,-4.9,1.9,-1.4,Math.PI/2,1.0,1.3,'COENS\nEOLOS','진도 해상풍력','#c46a1f','#2f6fa3');P.whiteboard(r,-4.88,1.8,.7,Math.PI/2,1.4,.9);P.lockers(r,4.4,2.6,Math.PI,3,'#e8892f');P.plant(r,4.4,-3.0,.9);}},
};
THEMES.jindo=THEMES['jindo-wind']; // 한반도 지도의 장소 id
export const themeOf=id=>THEMES[id]||THEMES.default;
export function decorate(root,id){const t=themeOf(id);t.build(root);}

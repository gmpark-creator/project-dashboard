// AGENT-GORGO-34/35 구름: 지도 위를 느리게 흐르는 뭉게구름(한반도·세계 지도 공용).
// G35: 딱딱한 공 덩어리 → 부드러운 솜 조각(캔버스 그라데이션 스프라이트) 여러 장으로 한 구름을 만든다.
//      카메라가 낮게 내려오면 옅어져 지도와 장소 이름을 가리지 않는다. 땅에는 옅은 그림자.
import * as THREE from 'three';
const rnd=(i,s=0)=>{const n=Math.sin(i*127.1+s*311.7)*43758.5453;return n-Math.floor(n);};
let puffTex=null,shadeTex=null;
function puff(){if(puffTex)return puffTex;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  const g=x.createRadialGradient(58,54,6,64,64,62);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.45,'rgba(255,255,255,.92)');g.addColorStop(.75,'rgba(246,250,250,.45)');g.addColorStop(1,'rgba(240,246,246,0)');
  x.fillStyle=g;x.fillRect(0,0,128,128);puffTex=new THREE.CanvasTexture(c);puffTex.colorSpace=THREE.SRGBColorSpace;return puffTex;}
function shade(){if(shadeTex)return shadeTex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'rgba(40,80,76,.55)');g.addColorStop(1,'rgba(40,80,76,0)');x.fillStyle=g;x.fillRect(0,0,64,64);
  shadeTex=new THREE.CanvasTexture(c);return shadeTex;}
// camera가 있으면 카메라 높이가 fadeNear 아래에서는 거의 안 보이고 fadeFar 위에서는 opacity 그대로.
export function addClouds(scene,{width,depth,count=30,y=2.4,size=1,opacity=.86,camera=null,fadeNear=null,fadeFar=null}){
  const list=[],mats=[],near=fadeNear??y*2.2,far=fadeFar??y*5;
  const shadowMat=new THREE.MeshBasicMaterial({map:shade(),transparent:true,depthWrite:false,opacity:.16});const shadowGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);
  for(let i=0;i<count;i++){const g=new THREE.Group(),n=5+Math.floor(rnd(i,5)*5),len=(1.3+rnd(i,6)*1.4)*size;
    for(let k=0;k<n;k++){const m=new THREE.SpriteMaterial({map:puff(),transparent:true,depthWrite:false,opacity,color:new THREE.Color().setHSL(.5,.12,.94+rnd(i,k+30)*.06)});mats.push(m);
      const sp=new THREE.Sprite(m),t=k/(n-1||1)-.5,s=(.55+rnd(i,k)*.5)*size*(1-Math.abs(t)*.7);
      sp.scale.set(s*1.25,s*.82,1);sp.position.set(t*len+(rnd(k,i)-.5)*.2*size,(rnd(i,k+9)*.28-.05)*size*(1-Math.abs(t)),(rnd(i,k+19)-.5)*.5*size);sp.raycast=()=>{};g.add(sp);}
    const sh=new THREE.Mesh(shadowGeo,shadowMat);sh.scale.set(len*1.1,1,size*1.1);sh.position.y=-y+.06;sh.raycast=()=>{};g.add(sh);
    g.position.set((rnd(i,21)-.5)*width,y+rnd(i,22)*y*.3,(rnd(i,23)-.5)*depth);g.userData.v=(.04+rnd(i,24)*.06)*Math.max(1,size);g.name='cloud';scene.add(g);list.push(g);}
  let fade=-1;
  return {list,update(dt){for(const c of list){c.position.x+=c.userData.v*dt;if(c.position.x>width/2+4*size)c.position.x=-width/2-4*size;}
    if(camera){const f=THREE.MathUtils.clamp((camera.position.y-near)/Math.max(.001,far-near),0,1);if(Math.abs(f-fade)>.01){fade=f;for(const m of mats)m.opacity=opacity*(.06+.94*f);shadowMat.opacity=.16*f;for(const c of list)c.visible=f>.02;}}}};
}

// AGENT-GORGO-12 지도 이음새: 전국 지도 ⇄ 부산 상세 지도를 한 장면처럼 잇는다.
// 떠나는 지도는 「부산 상세 지도 범위」와 똑같은 구도까지 카메라를 옮긴 뒤 그 화면을 한 장 찍어 sessionStorage에 넘긴다.
// 도착하는 지도는 데이터를 읽는 동안 그 사진을 덮어 두었다가, 같은 구도로 첫 화면을 그린 뒤 사진을 서서히 걷어낸다.
// 일반(classic) 스크립트로 모듈보다 먼저 실행돼 로딩 화면이 번쩍이지 않게 한다. 저장소를 못 쓰면 평소처럼 로딩 화면이 보일 뿐이다.
(function(){
  var KEY='gorgo.mapHandoff',MAX_AGE=30000;
  var q=new URLSearchParams(location.search).get('map'),map=q==='busan'?'busan':q==='world'?'world':'korea';
  var pending=null,cover=null;
  try{var raw=sessionStorage.getItem(KEY);sessionStorage.removeItem(KEY);if(raw){var h=JSON.parse(raw);if(h&&h.to===map&&Date.now()-h.t<MAX_AGE&&typeof h.img==='string'&&h.img.indexOf('data:image/')===0)pending=h;}}catch(e){pending=null;}
  if(pending){
    cover=document.createElement('div');cover.id='map-handoff';cover.setAttribute('aria-hidden','true');cover.style.backgroundImage='url("'+pending.img+'")';
    var cap=document.createElement('span');cap.textContent=map==='busan'?'부산 상세 지도를 펼치는 중':map==='world'?'세계 지도를 펼치는 중':'전국 지도로 나가는 중';cover.appendChild(cap);
    document.body.appendChild(cover);document.documentElement.classList.add('map-handoff-active');
  }
  window.GorgoHandoff={
    map:map,
    // 도착 지도: 넘겨받은 장면이 있으면 그 정보(from 등), 없으면 null
    pending:pending&&{from:pending.from,to:pending.to},
    // 도착 지도가 같은 구도로 첫 화면을 그린 뒤 호출 → 사진을 서서히 걷어낸다
    finish:function(){if(!cover)return;var c=cover;cover=null;c.classList.add('fade');document.documentElement.classList.remove('map-handoff-active');setTimeout(function(){c.remove();},900);},
    // 떠나는 지도: 방금 그린 캔버스를 찍어 넘기고 이동한다. 사진이 없어도 이동은 한다.
    leave:function(canvas,to,url){
      try{sessionStorage.setItem(KEY,JSON.stringify({to:to,from:map,t:Date.now(),img:canvas.toDataURL('image/jpeg',.84)}));}catch(e){}
      location.href=url;
    }
  };
})();

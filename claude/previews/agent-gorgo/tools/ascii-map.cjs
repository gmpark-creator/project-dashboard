const path=process.argv[2];require(require("path").join(require("path").dirname(path),"..","data","busan-osm.js"));require(path);
const m=globalThis.GorgoMapGen.generate();
const ch=['~','-','.',':','=','#',',','^','Q','B','r'];
const grid=[];for(let y=0;y<m.H;y++){let s='';for(let x=0;x<m.W;x++)s+=ch[m.tiles[y*m.W+x]];grid.push(s.split(''));}
for(const o of m.objs){const x=Math.floor(o.x),y=Math.floor(o.y-0.01);const c={tree:'t',house:'h',apt:'A',tower:'T',crane:'C',container:'c',pylon:'P'}[o.type];if(grid[y])grid[y][x]=c;}
for(const l of m.landmarks){grid[Math.floor(l.y)][Math.floor(l.x)]='@';}
console.log(grid.map(r=>r.join('')).join('\n'));
console.log('objs',m.objs.length);

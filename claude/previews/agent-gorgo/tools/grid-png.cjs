// data/busan-osm.js → PNG 미리보기 (지형 확인용). 사용: node tools/grid-png.cjs <out.png> [scale]
const fs = require('fs'), zlib = require('zlib'), path = require('path');
require(path.join(__dirname, '..', 'data', 'busan-osm.js'));
const d = globalThis.BUSAN_OSM, c = Buffer.from(d.cls, 'base64'), W = d.meta.W, H = d.meta.H, S = +process.argv[3] || 3;
const col = [[88,173,232],[115,196,240],[160,216,120],[96,170,82],[236,226,240],[200,206,216],[214,176,120]];
const img = Buffer.alloc(W * S * H * S * 3);
const put = (x, y, rgb) => { if (x < 0 || y < 0 || x >= W * S || y >= H * S) return; const i = (y * W * S + x) * 3; img[i] = rgb[0]; img[i + 1] = rgb[1]; img[i + 2] = rgb[2]; };
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let oy = 0; oy < S; oy++) for (let ox = 0; ox < S; ox++) put(x * S + ox, y * S + oy, (c[y * W + x] & 0x80) ? col[c[y * W + x] & 0x7f] : col[c[y * W + x] & 0x7f].map(v => Math.round(v * 0.8)));
const line = (f, rgb, step) => { for (let k = 0; k + 3 < f.length; k += 2) { const ax = f[k] * S, ay = f[k + 1] * S, bx = f[k + 2] * S, by = f[k + 3] * S, n = Math.ceil(Math.hypot(bx - ax, by - ay)) + 1; for (let i = 0; i <= n; i++) { if (step && (i % step) > step / 2) continue; put(Math.round(ax + (bx - ax) * i / n), Math.round(ay + (by - ay) * i / n), rgb); } } };
for (const r of d.roads) line(r[1], r[0] === 1 ? [235, 120, 60] : [250, 210, 90]);
for (const b of d.boundary) line(b, [150, 60, 200], 6); // 부산 밖은 어둡게
const raw = Buffer.alloc((W * S * 3 + 1) * H * S);
for (let y = 0; y < H * S; y++) { raw[y * (W * S * 3 + 1)] = 0; img.copy(raw, y * (W * S * 3 + 1) + 1, y * W * S * 3, (y + 1) * W * S * 3); }
const crc = (b) => { let c = ~0; for (const x of b) { c ^= x; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1)); } return ~c >>> 0; };
const chunk = (t, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(t), data]); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td)); return Buffer.concat([len, td, cr]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W * S, 0); ihdr.writeUInt32BE(H * S, 4); ihdr[8] = 8; ihdr[9] = 2;
fs.writeFileSync(process.argv[2], Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]));
console.log('png', W * S, 'x', H * S);

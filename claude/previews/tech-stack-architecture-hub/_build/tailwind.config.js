/** Tailwind v3 precompile — Play CDN(cdn.tailwindcss.com) 대체.
 *  production warning 제거 + 런타임 CDN 의존 제거. 색 토큰은 기존 인라인 config와 1:1. */
module.exports = {
  content: ['./index.html', './tech-hub.js'],
  theme: { extend: { colors: {
    base:'#0b1220', panel:'#13203a', line:'#26385a', ink:'#e7eefb', muted:'#93a4c4',
    cyan:'#38bdf8', mint:'#34d6c0', gold:'#f4b740', danger:'#fb7185'
  } } },
  plugins: []
};

export async function overpass(ql) {
  const eps = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter", "https://lz4.overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"];
  for (let round = 0; round < 3; round++) for (const ep of eps) {
    try {
      const r = await fetch(ep, { method: "POST", headers: { "User-Agent": "agent-gorgo-map-research/1.0", "Content-Type": "application/x-www-form-urlencoded" }, body: "data=" + encodeURIComponent(ql) });
      const t = await r.text(); if (!r.ok || t[0] !== "{") { console.error("fail", ep, r.status); continue; }
      return { json: JSON.parse(t), ep, at: new Date().toISOString() };
    } catch (e) { console.error("err", ep, e.message); }
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error("all overpass endpoints failed");
}

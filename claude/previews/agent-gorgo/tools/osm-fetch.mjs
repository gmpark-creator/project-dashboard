// OSM 원자료 수집 → RAW_DIR(레포 밖)에 저장. 사용: node tools/osm-fetch.mjs <RAW_DIR>
// 데이터 © OpenStreetMap contributors, ODbL 1.0
import { overpass } from "./ovp-lib.mjs";
import fs from "node:fs"; import path from "node:path";
const RAW = process.argv[2]; if (!RAW) throw new Error("RAW_DIR 필요");
fs.mkdirSync(RAW, { recursive: true });
const BB = "34.98,128.74,35.25,129.20"; // S,W,N,E — 진해 신항 ~ 해운대·송정
const Q = {
  coastline: `[out:json][timeout:180];way["natural"="coastline"](${BB});out geom;`,
  water: `[out:json][timeout:180];(way["natural"="water"](${BB});relation["natural"="water"](${BB});way["waterway"="riverbank"](${BB});relation["waterway"="riverbank"](${BB}););out geom;`,
  forest: `[out:json][timeout:240];(way["landuse"="forest"](${BB});relation["landuse"="forest"](${BB});way["natural"="wood"](${BB});relation["natural"="wood"](${BB}););out geom;`,
  landuse: `[out:json][timeout:240];(way["landuse"~"^(residential|commercial|retail|industrial|port|farmland)$"](${BB});relation["landuse"~"^(residential|commercial|retail|industrial|port|farmland)$"](${BB}););out geom;`,
  roads: `[out:json][timeout:180];way["highway"~"^(motorway|trunk|primary|secondary)$"](${BB});out geom tags;`,
  boundary: `[out:json][timeout:180];relation["boundary"="administrative"]["admin_level"="4"]["name"="부산광역시"];out geom;`,
  peaks: `[out:json][timeout:60];node["natural"="peak"]["name"](${BB});out;`,
};
const log = [];
for (const [k, ql] of Object.entries(Q)) {
  const { json, ep, at } = await overpass(ql);
  fs.writeFileSync(path.join(RAW, k + ".json"), JSON.stringify(json));
  log.push({ layer: k, endpoint: ep, fetchedAt: at, elements: json.elements.length, query: ql });
  console.log(k, json.elements.length, ep);
  await new Promise(r => setTimeout(r, 2500));
}
fs.writeFileSync(path.join(RAW, "_fetchlog.json"), JSON.stringify(log, null, 1));

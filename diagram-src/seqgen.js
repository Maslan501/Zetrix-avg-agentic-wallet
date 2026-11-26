#!/usr/bin/env node
// Renders simple sequence-diagram text files to SVG.
// Usage: node seqgen.js <src-dir> <out-dir>
// Syntax (subset of websequencediagrams):
//   title <text>
//   participant <Name>            (underscores shown as spaces)
//   ==<SECTION LABEL>==
//   A->B:message                  solid arrow
//   A-->B:message                 dashed arrow (reply / async)
//   A->A:note                     self call
//   alt <condition> ... end       alternative block (also: opt, loop)
"use strict";
const fs = require("fs");
const path = require("path");

const FONT = "Inter, Segoe UI, Helvetica, Arial, sans-serif";
const CW = 6.9;            // approx char width at 13px
const LH = 16;             // line height
const C = { ink: "#1f2937", line: "#64748b", box: "#eef2ff", boxStroke: "#4f46e5",
            sec: "#4f46e5", altFill: "#f8fafc", altStroke: "#94a3b8", bg: "#ffffff" };

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(text, maxW) {
  const maxC = Math.max(8, Math.floor(maxW / CW));
  const out = []; let cur = "";
  for (const w of text.split(/\s+/)) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= maxC) cur += " " + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out;
}

function parse(src) {
  const d = { title: "", parts: [], items: [] };
  for (let raw of src.split(/\r?\n/)) {
    const l = raw.trim();
    if (!l || l.startsWith("#")) continue;
    let m;
    if ((m = l.match(/^title\s+(.*)$/))) d.title = m[1];
    else if ((m = l.match(/^participant\s+(\S+)/))) d.parts.push(m[1]);
    else if ((m = l.match(/^==(.*)==$/))) d.items.push({ t: "sec", label: m[1].trim() });
    else if ((m = l.match(/^(alt|opt|loop|else)\s*(.*)$/))) d.items.push({ t: m[1] === "else" ? "else" : "alt", kind: m[1], label: m[2] });
    else if (l === "end") d.items.push({ t: "end" });
    else if ((m = l.match(/^(\S+?)\s*(-->|->)\s*(\S+?)\s*:\s*(.*)$/))) {
      for (const p of [m[1], m[3]]) if (!d.parts.includes(p)) d.parts.push(p);
      d.items.push({ t: "msg", from: m[1], to: m[3], dashed: m[2] === "-->", text: m[4] });
    } else throw new Error("Cannot parse: " + l);
  }
  return d;
}

function render(d) {
  const n = d.parts.length;
  const idx = Object.fromEntries(d.parts.map((p, i) => [p, i]));
  const boxW = d.parts.map(p => Math.max(110, p.replace(/_/g, " ").length * CW + 28));
  // gap between neighbouring lifelines: fit the longest message per span (on up to 2 lines)
  let gap = 190;
  for (const it of d.items) if (it.t === "msg" && it.from !== it.to) {
    const span = Math.abs(idx[it.from] - idx[it.to]);
    gap = Math.max(gap, Math.min(300, (it.text.length * CW) / 2 / span + 30));
  }
  for (let i = 0; i < n - 1; i++) gap = Math.max(gap, (boxW[i] + boxW[i + 1]) / 2 + 24);
  const left = 40 + boxW[0] / 2;
  const xs = d.parts.map((_, i) => left + i * gap);
  const width = Math.round(xs[n - 1] + boxW[n - 1] / 2 + 230);
  const out = []; let y = 0;

  // title
  out.push(`<text x="40" y="44" font-size="18" font-weight="700" fill="${C.ink}">${esc(d.title)}</text>`);
  y = 76;
  const headY = y, boxH = 38;
  const heads = yy => d.parts.map((p, i) =>
    `<rect x="${xs[i] - boxW[i] / 2}" y="${yy}" width="${boxW[i]}" height="${boxH}" rx="6" fill="${C.box}" stroke="${C.boxStroke}" stroke-width="1.4"/>` +
    `<text x="${xs[i]}" y="${yy + 24}" font-size="13" font-weight="600" text-anchor="middle" fill="${C.ink}">${esc(p.replace(/_/g, " "))}</text>`).join("");
  y += boxH + 26;

  const body = []; const altStack = [];
  for (const it of d.items) {
    if (it.t === "sec") {
      y += 10;
      const w = it.label.length * 7.4 + 28;
      body.push(`<line x1="20" y1="${y}" x2="${width - 20}" y2="${y}" stroke="${C.sec}" stroke-width="1.2" stroke-dasharray="2 3"/>` +
        `<rect x="${width / 2 - w / 2}" y="${y - 13}" width="${w}" height="26" rx="13" fill="${C.sec}"/>` +
        `<text x="${width / 2}" y="${y + 5}" font-size="12" font-weight="700" text-anchor="middle" fill="#ffffff">${esc(it.label)}</text>`);
      y += 34;
    } else if (it.t === "alt") {
      y += 6;
      altStack.push({ y0: y, kind: it.kind, label: it.label, elses: [] });
      y += 34;
    } else if (it.t === "else") {
      const a = altStack[altStack.length - 1];
      y += 4; a.elses.push({ y, label: it.label }); y += 28;
    } else if (it.t === "end") {
      const a = altStack.pop(); y += 4;
      const inset = 26 + altStack.length * 8;
      const tagW = a.kind.length * 8 + 20;
      body.unshift(`<rect x="${inset}" y="${a.y0}" width="${width - inset * 2}" height="${y - a.y0}" rx="4" fill="${C.altFill}" stroke="${C.altStroke}" stroke-width="1"/>`);
      body.push(`<path d="M${inset} ${a.y0} h${tagW} v14 l-8 8 h-${tagW - 8} z" fill="${C.altStroke}"/>` +
        `<text x="${inset + 8}" y="${a.y0 + 16}" font-size="12" font-weight="700" fill="#ffffff">${a.kind}</text>` +
        `<text x="${inset + tagW + 10}" y="${a.y0 + 16}" font-size="12" font-weight="700" fill="${C.ink}">[${esc(a.label)}]</text>`);
      for (const e of a.elses) body.push(`<line x1="${inset}" y1="${e.y}" x2="${width - inset}" y2="${e.y}" stroke="${C.altStroke}" stroke-dasharray="5 4"/>` +
        `<text x="${inset + 10}" y="${e.y + 16}" font-size="12" font-weight="700" fill="${C.ink}">[${esc(e.label)}]</text>`);
      y += 14;
    } else if (it.t === "msg") {
      const a = idx[it.from], b = idx[it.to];
      const dash = it.dashed ? ` stroke-dasharray="6 4"` : "";
      if (a === b) {
        const lines = wrap(it.text, 250);
        const x = xs[a];
        lines.forEach((ln, k) => body.push(`<text x="${x + 38}" y="${y + 4 + k * LH}" font-size="13" fill="${C.ink}">${esc(ln)}</text>`));
        const h = Math.max(26, lines.length * LH + 6);
        body.push(`<path d="M${x} ${y - 6} h28 v${h} h-24" fill="none" stroke="${C.ink}" stroke-width="1.4"${dash} marker-end="url(#ah)"/>`);
        y += h + 22;
      } else {
        const x1 = xs[a], x2 = xs[b];
        const lines = wrap(it.text, Math.abs(x2 - x1) - 24);
        const cx = (x1 + x2) / 2;
        lines.forEach((ln, k) => body.push(`<text x="${cx}" y="${y + k * LH}" font-size="13" text-anchor="middle" fill="${C.ink}">${esc(ln)}</text>`));
        const ay = y + (lines.length - 1) * LH + 9;
        const end = x2 + (x2 > x1 ? -3 : 3);
        body.push(`<line x1="${x1}" y1="${ay}" x2="${end}" y2="${ay}" stroke="${C.ink}" stroke-width="1.4"${dash} marker-end="url(#ah)"/>`);
        y = ay + 32;
      }
    }
  }
  y += 10;
  const life = xs.map(x => `<line x1="${x}" y1="${headY + boxH}" x2="${x}" y2="${y}" stroke="${C.line}" stroke-width="1" stroke-dasharray="5 5"/>`).join("");
  const footY = y; const height = Math.round(footY + boxH + 30);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="${FONT}">
<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${C.ink}"/></marker></defs>
<rect width="100%" height="100%" fill="${C.bg}"/>
${life}
${body.join("\n")}
${out.join("")}
${heads(headY)}
${heads(footY)}
</svg>\n`;
}

const [srcDir, outDir] = process.argv.slice(2);
for (const f of fs.readdirSync(srcDir).filter(f => f.endsWith(".seq"))) {
  const svg = render(parse(fs.readFileSync(path.join(srcDir, f), "utf8")));
  const out = path.join(outDir, f.replace(/\.seq$/, ".svg"));
  fs.writeFileSync(out, svg);
  console.log("wrote", out);
}

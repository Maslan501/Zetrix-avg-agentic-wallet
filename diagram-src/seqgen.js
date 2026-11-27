#!/usr/bin/env node
// Renders simple sequence-diagram text files to SVG.
// Usage: node seqgen.js <src-dir> <out-dir>
// Syntax (subset of websequencediagrams):
//   title <text>
//   fontsize <px>                 optional, default 13; scales text, boxes and spacing
//   gap <px>                      optional fixed distance between lifelines; long participant
//                                 names and messages wrap onto more lines to fit
//   participant <Name>            (underscores shown as spaces)
//   ==<SECTION LABEL>==
//   A->B:message                  solid arrow
//   A-->B:message                 dashed arrow (reply / async)
//   A->A:note                     self call
//   alt <condition> ... end       alternative block (also: opt, loop)
// Use fontsize + gap on wide diagrams so they stay readable when a docs page scales them down.
"use strict";
const fs = require("fs");
const path = require("path");

const FONT = "Inter, Segoe UI, Helvetica, Arial, sans-serif";
const C = { ink: "#1f2937", line: "#64748b", box: "#eef2ff", boxStroke: "#4f46e5",
            sec: "#4f46e5", altFill: "#f8fafc", altStroke: "#94a3b8", bg: "#ffffff" };

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(text, maxW, cw) {
  const maxC = Math.max(8, Math.floor(maxW / cw));
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
  const d = { title: "", parts: [], items: [], fontsize: 13, gap: null };
  for (let raw of src.split(/\r?\n/)) {
    const l = raw.trim();
    if (!l || l.startsWith("#")) continue;
    let m;
    if ((m = l.match(/^title\s+(.*)$/))) d.title = m[1];
    else if ((m = l.match(/^fontsize\s+(\d+)$/))) d.fontsize = +m[1];
    else if ((m = l.match(/^gap\s+(\d+)$/))) d.gap = +m[1];
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
  const FS = d.fontsize, k = FS / 13;
  const CW = 6.9 * k, LH = 16 * k, SW = +(1.4 * k).toFixed(2);
  const n = d.parts.length;
  const idx = Object.fromEntries(d.parts.map((p, i) => [p, i]));
  const names = d.parts.map(p => p.replace(/_/g, " "));

  // participant boxes: one line by default; with a fixed gap, wrap long names to fit the column
  let nameLines, boxW;
  if (d.gap) {
    const maxBox = d.gap - 16 * k;
    nameLines = names.map(nm => wrap(nm, maxBox - 20 * k, CW));
    boxW = nameLines.map(ls => Math.min(maxBox, Math.max(110 * k, Math.max(...ls.map(l => l.length)) * CW + 28 * k)));
  } else {
    nameLines = names.map(nm => [nm]);
    boxW = names.map(nm => Math.max(110, nm.length * CW + 28));
  }
  const boxH = Math.max(...nameLines.map(ls => ls.length)) * LH + 22 * k;

  let gap;
  if (d.gap) gap = d.gap;
  else {
    // fit the longest message per span (on up to 2 lines)
    gap = 190;
    for (const it of d.items) if (it.t === "msg" && it.from !== it.to) {
      const span = Math.abs(idx[it.from] - idx[it.to]);
      gap = Math.max(gap, Math.min(300, (it.text.length * CW) / 2 / span + 30));
    }
    for (let i = 0; i < n - 1; i++) gap = Math.max(gap, (boxW[i] + boxW[i + 1]) / 2 + 24);
  }
  const selfW = d.gap ? Math.round(d.gap * 1.25) : 250;
  const left = 40 * k + boxW[0] / 2;
  const xs = d.parts.map((_, i) => left + i * gap);
  // right margin: room for self-call notes only when the last participant has one
  const lastHasSelf = d.items.some(it => it.t === "msg" && it.from === it.to && idx[it.from] === n - 1);
  const rightPad = !d.gap ? 230 : lastHasSelf ? selfW + 40 * k : 40 * k;
  const width = Math.round(xs[n - 1] + boxW[n - 1] / 2 + rightPad);
  const out = []; let y = 0;

  out.push(`<text x="${40 * k}" y="${44 * k}" font-size="${18 * k}" font-weight="700" fill="${C.ink}">${esc(d.title)}</text>`);
  y = 76 * k;
  const headY = y;
  const heads = yy => d.parts.map((p, i) => {
    const ls = nameLines[i], top = yy + (boxH - ls.length * LH) / 2 + LH * 0.8125;
    return `<rect x="${xs[i] - boxW[i] / 2}" y="${yy}" width="${boxW[i]}" height="${boxH}" rx="${6 * k}" fill="${C.box}" stroke="${C.boxStroke}" stroke-width="${SW}"/>` +
      ls.map((l, j) => `<text x="${xs[i]}" y="${top + j * LH}" font-size="${FS}" font-weight="600" text-anchor="middle" fill="${C.ink}">${esc(l)}</text>`).join("");
  }).join("");
  y += boxH + 26 * k;

  const body = []; const altStack = [];
  for (const it of d.items) {
    if (it.t === "sec") {
      y += 10 * k;
      const w = it.label.length * 7.4 * k + 28 * k;
      body.push(`<line x1="20" y1="${y}" x2="${width - 20}" y2="${y}" stroke="${C.sec}" stroke-width="${+(1.2 * k).toFixed(2)}" stroke-dasharray="2 3"/>` +
        `<rect x="${width / 2 - w / 2}" y="${y - 13 * k}" width="${w}" height="${26 * k}" rx="${13 * k}" fill="${C.sec}"/>` +
        `<text x="${width / 2}" y="${y + 5 * k}" font-size="${12 * k}" font-weight="700" text-anchor="middle" fill="#ffffff">${esc(it.label)}</text>`);
      y += 34 * k;
    } else if (it.t === "alt") {
      y += 6 * k;
      altStack.push({ y0: y, kind: it.kind, label: it.label, elses: [] });
      y += 34 * k;
    } else if (it.t === "else") {
      const a = altStack[altStack.length - 1];
      y += 4 * k; a.elses.push({ y, label: it.label }); y += 28 * k;
    } else if (it.t === "end") {
      const a = altStack.pop(); y += 4 * k;
      const inset = 26 + altStack.length * 8;
      const tagW = a.kind.length * 8 * k + 20 * k;
      body.unshift(`<rect x="${inset}" y="${a.y0}" width="${width - inset * 2}" height="${y - a.y0}" rx="4" fill="${C.altFill}" stroke="${C.altStroke}" stroke-width="1"/>`);
      body.push(`<path d="M${inset} ${a.y0} h${tagW} v${14 * k} l${-8 * k} ${8 * k} h${-(tagW - 8 * k)} z" fill="${C.altStroke}"/>` +
        `<text x="${inset + 8 * k}" y="${a.y0 + 16 * k}" font-size="${12 * k}" font-weight="700" fill="#ffffff">${a.kind}</text>` +
        `<text x="${inset + tagW + 10 * k}" y="${a.y0 + 16 * k}" font-size="${12 * k}" font-weight="700" fill="${C.ink}">[${esc(a.label)}]</text>`);
      for (const e of a.elses) body.push(`<line x1="${inset}" y1="${e.y}" x2="${width - inset}" y2="${e.y}" stroke="${C.altStroke}" stroke-dasharray="5 4"/>` +
        `<text x="${inset + 10 * k}" y="${e.y + 16 * k}" font-size="${12 * k}" font-weight="700" fill="${C.ink}">[${esc(e.label)}]</text>`);
      y += 14 * k;
    } else if (it.t === "msg") {
      const a = idx[it.from], b = idx[it.to];
      const dash = it.dashed ? ` stroke-dasharray="${6 * k} ${4 * k}"` : "";
      if (a === b) {
        const lines = wrap(it.text, selfW, CW);
        const x = xs[a];
        lines.forEach((ln, j) => body.push(`<text x="${x + 38 * k}" y="${y + 4 * k + j * LH}" font-size="${FS}" fill="${C.ink}">${esc(ln)}</text>`));
        const h = Math.max(26 * k, lines.length * LH + 6 * k);
        body.push(`<path d="M${x} ${y - 6 * k} h${28 * k} v${h} h${-24 * k}" fill="none" stroke="${C.ink}" stroke-width="${SW}"${dash} marker-end="url(#ah)"/>`);
        y += h + 22 * k;
      } else {
        const x1 = xs[a], x2 = xs[b];
        const lines = wrap(it.text, Math.abs(x2 - x1) - 24 * k, CW);
        const cx = (x1 + x2) / 2;
        lines.forEach((ln, j) => body.push(`<text x="${cx}" y="${y + j * LH}" font-size="${FS}" text-anchor="middle" fill="${C.ink}">${esc(ln)}</text>`));
        const ay = y + (lines.length - 1) * LH + 9 * k;
        const end = x2 + (x2 > x1 ? -3 : 3);
        body.push(`<line x1="${x1}" y1="${ay}" x2="${end}" y2="${ay}" stroke="${C.ink}" stroke-width="${SW}"${dash} marker-end="url(#ah)"/>`);
        y = ay + 32 * k;
      }
    }
  }
  y += 10 * k;
  const life = xs.map(x => `<line x1="${x}" y1="${headY + boxH}" x2="${x}" y2="${y}" stroke="${C.line}" stroke-width="1" stroke-dasharray="5 5"/>`).join("");
  const footY = y; const height = Math.round(footY + boxH + 30 * k);
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

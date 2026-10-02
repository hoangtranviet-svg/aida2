// office.js — tạo file .docx / .xlsx / .csv ngay trong trình duyệt, không thư viện ngoài.
// Dependency-free ES module (works under strict CSP and in Node for tests).

const enc = new TextEncoder();
const u8 = (d) => (typeof d === 'string' ? enc.encode(d) : d);
// Escape XML + bỏ ký tự điều khiển không hợp lệ trong XML 1.0
const esc = (s) => String(s ?? '')
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

/* ---------------- ZIP (STORE) ---------------- */
const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = (b) => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };

export function zip(files) {
  const d = new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((Math.max(d.getFullYear(), 1980) - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const locals = [], centrals = []; let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name), data = u8(f.data), crc = crc32(data), n = data.length;
    const hdr = (sig, central) => {
      const b = new Uint8Array((central ? 46 : 30) + name.length), v = new DataView(b.buffer);
      let p = 0; const w16 = (x) => { v.setUint16(p, x, true); p += 2; }, w32 = (x) => { v.setUint32(p, x, true); p += 4; };
      w32(sig); if (central) w16(20);           // version made by
      w16(20); w16(0x0800); w16(0);             // version needed, UTF-8 flag, STORE
      w16(time); w16(date); w32(crc); w32(n); w32(n); w16(name.length); w16(0);
      if (central) { w16(0); w16(0); w16(0); w32(0); w32(offset); }
      b.set(name, p); return b;
    };
    const lh = hdr(0x04034b50, false);
    locals.push(lh, data); centrals.push(hdr(0x02014b50, true));
    offset += lh.length + n;
  }
  const cdSize = centrals.reduce((s, b) => s + b.length, 0);
  const eocd = new Uint8Array(22), v = new DataView(eocd.buffer);
  v.setUint32(0, 0x06054b50, true); v.setUint16(8, files.length, true); v.setUint16(10, files.length, true);
  v.setUint32(12, cdSize, true); v.setUint32(16, offset, true);
  const parts = [...locals, ...centrals, eocd], out = new Uint8Array(offset + cdSize + 22);
  let p = 0; for (const b of parts) { out.set(b, p); p += b.length; }
  return out;
}

/* ---------------- Shared package parts ---------------- */
const RELS_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const OD = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const rels = (list) => XML + `<Relationships xmlns="${RELS_NS}">` +
  list.map(([id, type, target]) => `<Relationship Id="${id}" Type="${type}" Target="${target}"/>`).join('') + '</Relationships>';
const coreXml = (title) => { const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z'); return XML +
  '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  `<dc:title>${esc(title)}</dc:title><dc:creator>AIDA</dc:creator>` +
  `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`; };
const appXml = (app) => XML + `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>${app}</Application></Properties>`;
const pkgRels = (main) => rels([
  ['rId1', OD + '/officeDocument', main],
  ['rId2', 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', 'docProps/core.xml'],
  ['rId3', OD + '/extended-properties', 'docProps/app.xml']]);
const types = (overrides) => XML + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
  [['/docProps/core.xml', 'application/vnd.openxmlformats-package.core-properties+xml'],
   ['/docProps/app.xml', 'application/vnd.openxmlformats-officedocument.extended-properties+xml'], ...overrides]
    .map(([p, t]) => `<Override PartName="${p}" ContentType="${t}"/>`).join('') + '</Types>';

/* ---------------- DOCX ---------------- */
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const CM = 567; // twips per cm
const FONT = '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>';
const toRuns = (r) => (r == null ? [] : typeof r === 'string' ? [{ text: r }] : Array.isArray(r) ? r : [r]);

// Một run; '\n' → ngắt dòng, '\t' → tab
function runXml(r, force = {}) {
  r = { ...r, ...force };
  const pr = (r.b ? '<w:b/><w:bCs/>' : '') + (r.i ? '<w:i/><w:iCs/>' : '') + (r.u ? '<w:u w:val="single"/>' : '') +
    (r.size ? `<w:sz w:val="${Math.round(r.size * 2)}"/><w:szCs w:val="${Math.round(r.size * 2)}"/>` : '');
  const body = String(r.text ?? '').split('\n').map((line, i) =>
    (i ? '<w:br/>' : '') + line.split('\t').map((s, j) => (j ? '<w:tab/>' : '') + (s ? `<w:t xml:space="preserve">${esc(s)}</w:t>` : '')).join('')).join('');
  return `<w:r>${pr ? `<w:rPr>${pr}</w:rPr>` : ''}${body}</w:r>`;
}
function paraXml(runs, o = {}, force) {
  const pr = (o.style ? `<w:pStyle w:val="${o.style}"/>` : '') + (o.keepNext ? '<w:keepNext/>' : '') +
    (o.spaceAfter != null ? `<w:spacing w:after="${Math.round(o.spaceAfter * 20)}"/>` : '') +
    (o.indent ? `<w:ind w:left="${Math.round(o.indent * CM)}"/>` : '') + (o.align ? `<w:jc w:val="${o.align}"/>` : '');
  return `<w:p>${pr ? `<w:pPr>${pr}</w:pPr>` : ''}${toRuns(runs).map((r) => runXml(r, force)).join('')}</w:p>`;
}
const BORDER = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'];
function tableXml(rows, { widths, header, border = true, align } = {}) {
  const cols = Math.max(...rows.map((r) => r.length), 1);
  const ws = (widths && widths.length >= cols ? widths : Array(cols).fill(17 / cols)).map((w) => Math.round(w * CM));
  const b = BORDER.map((s) => `<w:${s} w:val="${border ? 'single' : 'nil'}" w:sz="4" w:space="0" w:color="000000"/>`).join('');
  const tr = rows.map((row, ri) => {
    const hd = header && ri === 0;
    const cells = Array.from({ length: cols }, (_, ci) =>
      `<w:tc><w:tcPr><w:tcW w:w="${ws[ci]}" w:type="dxa"/>${hd ? '<w:shd w:val="clear" w:color="auto" w:fill="E7E6E6"/>' : ''}</w:tcPr>` +
      paraXml(row[ci] ?? '', { spaceAfter: 0, align: hd ? 'center' : align?.[ci] }, hd ? { b: true } : undefined) + '</w:tc>').join('');
    return `<w:tr>${hd ? '<w:trPr><w:tblHeader/></w:trPr>' : ''}${cells}</w:tr>`;
  }).join('');
  return `<w:tbl><w:tblPr><w:tblW w:w="${ws.reduce((a, c) => a + c, 0)}" w:type="dxa"/><w:tblBorders>${b}</w:tblBorders>` +
    '<w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="85" w:type="dxa"/><w:right w:w="85" w:type="dxa"/></w:tblCellMar></w:tblPr>' +
    `<w:tblGrid>${ws.map((w) => `<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${tr}</w:tbl><w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>`;
}
function blockXml(b) {
  if (typeof b === 'string') return paraXml(b);
  if (b.h) return paraXml(b.text, { style: 'Heading' + Math.min(3, Math.max(1, b.h)), align: b.align });
  if (b.pageBreak) return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  if (b.table) return tableXml(b.table, b);
  if (b.twoCol) return tableXml([b.twoCol], { widths: b.widths || [7.5, 9.5], border: false, align: ['center', 'center'] });
  if (b.p !== undefined) return paraXml(b.p, b);
  return '';
}
const stylesDocx = () => XML + `<w:styles xmlns:w="${W}">` +
  `<w:docDefaults><w:rPrDefault><w:rPr>${FONT}<w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault>` +
  '<w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
  '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
  [[1, 32], [2, 28], [3, 26]].map(([n, sz]) =>
    `<w:style w:type="paragraph" w:styleId="Heading${n}"><w:name w:val="heading ${n}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:uiPriority w:val="9"/><w:qFormat/>` +
    `<w:pPr><w:keepNext/><w:spacing w:before="${n === 1 ? 240 : 160}" w:after="120"/><w:outlineLvl w:val="${n - 1}"/></w:pPr>` +
    `<w:rPr>${FONT}<w:b/><w:bCs/><w:sz w:val="${sz}"/><w:szCs w:val="${sz}"/></w:rPr></w:style>`).join('') +
  '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/>' +
  '<w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>';

export function buildDocx(doc = {}) {
  const m = 2 * CM;
  const body = (doc.blocks || []).map(blockXml).join('') +
    `<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="${m}" w:right="${m}" w:bottom="${m}" w:left="${m}" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr>`;
  const ct = 'application/vnd.openxmlformats-officedocument.wordprocessingml.';
  return zip([
    { name: '[Content_Types].xml', data: types([['/word/document.xml', ct + 'document.main+xml'], ['/word/styles.xml', ct + 'styles+xml']]) },
    { name: '_rels/.rels', data: pkgRels('word/document.xml') },
    { name: 'word/document.xml', data: XML + `<w:document xmlns:w="${W}" xmlns:r="${OD}"><w:body>${body}</w:body></w:document>` },
    { name: 'word/styles.xml', data: stylesDocx() },
    { name: 'word/_rels/document.xml.rels', data: rels([['rId1', OD + '/styles', 'styles.xml']]) },
    { name: 'docProps/core.xml', data: coreXml(doc.title || '') },
    { name: 'docProps/app.xml', data: appXml('Microsoft Office Word') },
  ]);
}

/* ---------------- XLSX ---------------- */
const S = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const colName = (i) => { let s = ''; for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s; return s; };
const parseRef = (ref) => { const m = /^([A-Z]+)(\d+)$/i.exec(ref || ''); if (!m) return null;
  return { c: [...m[1].toUpperCase()].reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1, r: +m[2] - 1 }; };
// Style ids: 0 default, 1 bold, 2 bold+fill (header), 3 số 0.00, 4 bold + 0.00
const stylesXlsx = () => XML + `<styleSheet xmlns="${S}">` +
  '<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>' +
  '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
  '<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill></fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5">' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
  '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>' +
  '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' +
  '<xf numFmtId="2" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/></cellXfs>' +
  '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';

function cellXml(val, ref, hdr) {
  let bold = hdr, v = val;
  if (v && typeof v === 'object' && !('f' in v)) { bold = bold || !!v.bold; v = v.v; }
  if (v && typeof v === 'object' && 'f' in v) {
    return `<c r="${ref}"${bold ? ` s="${hdr ? 2 : 1}"` : ''}><f>${esc(String(v.f).replace(/^=/, ''))}</f></c>`;
  }
  if (typeof v === 'number' && Number.isFinite(v)) {
    const s = hdr ? 2 : Number.isInteger(v) ? (bold ? 1 : 0) : (bold ? 4 : 3);
    return `<c r="${ref}"${s ? ` s="${s}"` : ''}><v>${v}</v></c>`;
  }
  if (typeof v === 'boolean') return `<c r="${ref}" t="b"${bold ? ` s="${hdr ? 2 : 1}"` : ''}><v>${v ? 1 : 0}</v></c>`;
  if (v == null || (typeof v === 'number')) return hdr ? `<c r="${ref}" s="2"/>` : '';
  return `<c r="${ref}" t="inlineStr"${bold ? ` s="${hdr ? 2 : 1}"` : ''}><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
}
function sheetXml(sh) {
  const rows = sh.rows || [];
  const f = parseRef(sh.freeze);
  let view = '<sheetView workbookViewId="0"';
  if (f && (f.r || f.c)) {
    const pane = f.r && f.c ? 'bottomRight' : f.r ? 'bottomLeft' : 'topRight';
    view += `><pane${f.c ? ` xSplit="${f.c}"` : ''}${f.r ? ` ySplit="${f.r}"` : ''} topLeftCell="${sh.freeze.toUpperCase()}" activePane="${pane}" state="frozen"/>` +
      `<selection pane="${pane}" activeCell="${sh.freeze.toUpperCase()}" sqref="${sh.freeze.toUpperCase()}"/></sheetView>`;
  } else view += '/>';
  const cols = sh.widths?.length ? `<cols>${sh.widths.map((w, i) => w ? `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>` : '').join('')}</cols>` : '';
  const data = rows.map((row, ri) => `<row r="${ri + 1}">` +
    (row || []).map((v, ci) => cellXml(v, colName(ci) + (ri + 1), sh.header && ri === 0)).join('') + '</row>').join('');
  return XML + `<worksheet xmlns="${S}" xmlns:r="${OD}"><sheetViews>${view}</sheetViews><sheetFormatPr defaultRowHeight="15"/>${cols}<sheetData>${data}</sheetData></worksheet>`;
}
// Tên sheet: ≤31 ký tự, không []:*?/\ , không trùng
function sheetNames(sheets) {
  const used = new Set();
  return sheets.map((s, i) => {
    let base = String(s.name ?? '').replace(/[\[\]:*?/\\]/g, ' ').replace(/\s+/g, ' ').replace(/^'+|'+$/g, '').trim().slice(0, 31) || `Sheet${i + 1}`, n = base, k = 2;
    while (used.has(n.toLowerCase())) { const suf = ` (${k++})`; n = base.slice(0, 31 - suf.length) + suf; }
    used.add(n.toLowerCase()); return n;
  });
}

export function buildXlsx(sheets = []) {
  if (!sheets.length) sheets = [{ name: 'Sheet1', rows: [] }];
  const names = sheetNames(sheets), ct = 'application/vnd.openxmlformats-officedocument.spreadsheetml.';
  const wb = XML + `<workbook xmlns="${S}" xmlns:r="${OD}"><bookViews><workbookView/></bookViews><sheets>` +
    names.map((n, i) => `<sheet name="${esc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>';
  return zip([
    { name: '[Content_Types].xml', data: types([['/xl/workbook.xml', ct + 'sheet.main+xml'], ['/xl/styles.xml', ct + 'styles+xml'],
      ...sheets.map((_, i) => [`/xl/worksheets/sheet${i + 1}.xml`, ct + 'worksheet+xml'])]) },
    { name: '_rels/.rels', data: pkgRels('xl/workbook.xml') },
    { name: 'xl/workbook.xml', data: wb },
    { name: 'xl/_rels/workbook.xml.rels', data: rels([...sheets.map((_, i) => [`rId${i + 1}`, OD + '/worksheet', `worksheets/sheet${i + 1}.xml`]),
      [`rId${sheets.length + 1}`, OD + '/styles', 'styles.xml']]) },
    { name: 'xl/styles.xml', data: stylesXlsx() },
    ...sheets.map((s, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: sheetXml(s) })),
    { name: 'docProps/core.xml', data: coreXml(names[0]) },
    { name: 'docProps/app.xml', data: appXml('Microsoft Excel') },
  ]);
}

/* ---------------- Helpers ---------------- */
const MIME = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv;charset=utf-8',
};
export const toBlob = (data, kind) => new Blob([data], { type: MIME[kind] || 'application/octet-stream' });

// CSV cho Excel: BOM UTF-8, dấu phẩy, CRLF
export const csv = (rows) => '﻿' + rows.map((r) => (r || []).map((v) => {
  const s = v == null ? '' : String(v);
  return /[",\r\n]|^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}).join(',')).join('\r\n');

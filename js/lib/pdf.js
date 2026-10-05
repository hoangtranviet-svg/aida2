// Tạo tệp PDF tối giản từ các ảnh JPEG (mỗi ảnh một trang A4) – không cần thư viện ngoài
export function jpegPagesToPdf(pages, { w = 595.28, h = 841.89 } = {}) {
  const enc = new TextEncoder(); const parts = []; let len = 0; const offs = [];
  const push = x => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; };
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'.replace(/[\u0080-ÿ]/g, '')); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
  const n = pages.length; const obj = id => { offs[id] = len; };
  // 1: catalog, 2: pages, rồi mỗi trang 3 đối tượng: page, image, content
  obj(1); push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  obj(2); push(`2 0 obj\n<< /Type /Pages /Count ${n} /Kids [${pages.map((_, i) => `${3 + i * 3} 0 R`).join(' ')}] >>\nendobj\n`);
  pages.forEach((p, i) => {
    const P = 3 + i * 3, I = P + 1, C = P + 2;
    obj(P); push(`${P} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im${i} ${I} 0 R >> >> /Contents ${C} 0 R >>\nendobj\n`);
    obj(I); push(`${I} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${p.pw} /Height ${p.ph} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`); push(p.bytes); push('\nendstream\nendobj\n');
    const cs = `q ${w} 0 0 ${h} 0 0 cm /Im${i} Do Q`;
    obj(C); push(`${C} 0 obj\n<< /Length ${cs.length} >>\nstream\n${cs}\nendstream\nendobj\n`);
  });
  const total = 3 + n * 3; const xref = len;
  push(`xref\n0 ${total}\n0000000000 65535 f \n${Array.from({ length: total - 1 }, (_, k) => String(offs[k + 1]).padStart(10, '0') + ' 00000 n \n').join('')}`);
  push(`trailer\n<< /Size ${total} /Root 1 0 R /Info << /Producer (AIDA 2.0) >> >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts, { type: 'application/pdf' });
}
export async function canvasToJpegPage(cv, q = .9) {
  const blob = await new Promise(res => cv.toBlob(res, 'image/jpeg', q));
  return { bytes: new Uint8Array(await blob.arrayBuffer()), pw: cv.width, ph: cv.height };
}

// Vẽ bản đồ Đông Nam Á dạng SVG (dùng trong bài giảng). Dữ liệu biên giới: Natural Earth 1:50m.
import { VB, P, C, RIV, LAKE } from './sea.js';

export const SEA11 = ['VNM', 'LAO', 'KHM', 'THA', 'MMR', 'MYS', 'SGP', 'IDN', 'BRN', 'PHL', 'TLS'];
export const NAME = Object.fromEntries(Object.entries(C).map(([k, v]) => [k, v.n]));
const LBL = { MMR: [96.2, 21.4], THA: [101.0, 15.6], LAO: [102.6, 19.6], KHM: [104.9, 12.7], VNM: [108.1, 14.2], MYS: [102.1, 4.3], SGP: [104.2, .6], IDN: [113.6, -1.0], BRN: [114.6, 5.3], PHL: [121.1, 16.6], TLS: [126.0, -9.3],
  CHN: [106, 26.5], IND: [92.3, 25.6], AUS: [133.5, -13.3], PNG: [144.5, -5.6], BGD: [90.2, 23.5] };
const RIVN = { Mekong: ['Mê Công', 105.6, 15.9], Hong: ['Hồng', 104.6, 22.2], Ayeyarwady: ['I-ra-oa-đi', 95.2, 19.2], Salween: ['Xa-lu-en', 98.3, 19.8] };
const pt = (lon, lat) => P(lon, lat).map(v => v.toFixed(1));

/**
 * @param {object} o
 *  o.groups  – tô màu theo 2 bộ phận (lục địa / hải đảo); mặc định true
 *  o.labels  – ghi tên các nước (true | false | 'sea11')
 *  o.rivers  – vẽ sông lớn và Biển Hồ
 *  o.grat    – lưới kinh, vĩ tuyến
 *  o.extent  – khung phạm vi lãnh thổ (kinh tuyến 92°Đ–152°Đ, vĩ tuyến 10°N–28°B)
 *  o.pick    – cho phép bấm chọn nước (thêm class pick)
 *  o.extra   – chuỗi SVG vẽ thêm
 */
export function seaSVG(o = {}) {
  const { groups = true, labels = true, rivers = false, grat = true, extent = false, pick = false, oceans = true, extra = '' } = o;
  const [W, H] = VB; let s = `<svg class="map ${groups ? '' : 'mono'}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bản đồ khu vực Đông Nam Á"><rect class="sea" width="${W}" height="${H}"/>`;
  if (grat) {
    for (let lat = -10; lat <= 30; lat += 10) { const [, y] = pt(0, lat); s += `<path class="grat" d="M0 ${y}H${W}"/><text class="gl" x="4" y="${+y - 3}">${lat === 0 ? '0°' : Math.abs(lat) + '°' + (lat > 0 ? 'B' : 'N')}</text>`; }
    for (let lon = 90; lon <= 150; lon += 10) { const [x] = pt(lon, 0); s += `<path class="grat" d="M${x} 0V${H}"/><text class="gl" x="${+x + 3}" y="${H - 5}">${lon}°Đ</text>`; }
  }
  Object.entries(C).forEach(([k, c]) => { const g = SEA11.includes(k) ? c.g : 'out'; s += `<path class="c ${g}${pick && SEA11.includes(k) ? ' pick' : ''}" data-iso="${k}" d="${c.d}"><title>${c.n}</title></path>`; });
  if (rivers) { RIV.forEach(r => (s += `<path class="riv" d="${r.d}"/>`)); LAKE.forEach(d => (s += `<path class="lake" d="${d}"/>`)); Object.values(RIVN).forEach(([n, lo, la]) => { const [x, y] = pt(lo, la); s += `<text class="lbl" x="${x}" y="${y}" style="font-size:11px;font-style:italic;fill:#1f5f8b">S. ${n}</text>`; }); const [bx, by] = pt(104.3, 13.0); s += `<text class="lbl" x="${bx}" y="${by}" style="font-size:10.5px;font-style:italic;fill:#1f5f8b">Biển Hồ</text>`; }
  if (extent) { const [x0, y0] = pt(92, 28), [x1, y1] = pt(152, -10); s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="#c4561f" stroke-width="2.4" stroke-dasharray="9 6"/><text class="lbl" x="${+x0 + 6}" y="${+y0 + 16}" style="fill:#c4561f">28°B</text><text class="lbl" x="${+x0 + 6}" y="${+y1 - 6}" style="fill:#c4561f">10°N · 92°Đ</text><text class="lbl" x="${+x1 - 46}" y="${+y1 - 6}" style="fill:#c4561f">152°Đ</text>`; }
  if (oceans) {
    const T = (t, lo, la, cls = 'ocean', st = '') => { const [x, y] = pt(lo, la); s += `<text class="${cls}" x="${x}" y="${y}" text-anchor="middle" ${st}>${t}</text>`; };
    T('THÁI BÌNH DƯƠNG', 141, 16); T('ẤN ĐỘ DƯƠNG', 97, -6); T('Biển Đông', 114.2, 14.2, 'ocean', 'style="font-size:15px"');
  }
  // chủ quyền biển đảo Việt Nam
  const isl = (lo, la, n, txt) => { let d = ''; for (let i = 0; i < n; i++) { const [x, y] = pt(lo + Math.cos(i * 2.4) * (i % 3) * .35, la + Math.sin(i * 2.4) * (i % 3) * .3); d += `<circle class="isl" cx="${x}" cy="${y}" r="1.9"/>`; } const [x, y] = pt(lo + .8, la + .2); s += d + `<text class="isl-l" x="${x}" y="${y}">${txt}</text>`; };
  isl(111.9, 16.5, 8, 'QĐ. Hoàng Sa (Việt Nam)'); isl(114.2, 9.6, 11, 'QĐ. Trường Sa (Việt Nam)');
  if (labels) Object.entries(LBL).forEach(([k, [lo, la]]) => { if (labels === 'sea11' && !SEA11.includes(k)) return; const [x, y] = pt(lo, la); const out = !SEA11.includes(k); s += `<text class="lbl" x="${x}" y="${y}" text-anchor="middle" style="${out ? 'fill:#7b766a;font-weight:500' : ''}${k === 'SGP' || k === 'BRN' ? ';font-size:11px' : ''}">${C[k]?.n || ''}</text>`; });
  return s + extra + '</svg>';
}
export const at = pt;

// Bài giảng Địa lí 11 – Bài 11 (Kết nối tri thức): Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á
import { seaSVG, SEA11, NAME, at } from '../maps/sea-svg.js';

const POP = [['IDN', 283.5], ['PHL', 115.8], ['VNM', 101.0], ['THA', 71.7], ['MMR', 54.5], ['MYS', 35.6], ['KHM', 17.6], ['LAO', 7.8], ['SGP', 5.8], ['TLS', 1.4], ['BRN', 0.5]];
const LD = ['VNM', 'LAO', 'KHM', 'THA', 'MMR'];
const n1 = v => String(v).replace('.', ',');
const legend = `<div class="legend"><span><i style="background:var(--ld)"></i>Đông Nam Á lục địa</span><span><i style="background:var(--hd)"></i>Đông Nam Á hải đảo</span><span><i style="background:#c0392b;border-radius:50%"></i>Quần đảo của Việt Nam</span></div>`;
const malacca = () => { const [x, y] = at(99.6, 3.7); const [x2, y2] = at(101.4, 2.4); return `<path d="M${x} ${y} L${x2} ${y2}" stroke="#c4561f" stroke-width="2" marker-end="url(#ar)"/><text class="lbl" x="${+x - 4}" y="${+y - 6}" text-anchor="end" style="fill:#c4561f">Eo biển Ma-lắc-ca</text>`; };
const defs = '<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#c4561f"/></marker></defs>';

export default {
  id: '11-11', code: 'DL11.B11', grade: 11, short: 'Địa lí 11 · Bài 11 – Đông Nam Á',
  title: 'Bài 11: Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á',
  sources: [
    'SGK Địa lí 11 – Kết nối tri thức với cuộc sống, Bài 11',
    'Liên hợp quốc – World Population Prospects 2024 (dân số các nước, làm tròn)',
    'Natural Earth 1:50m – dữ liệu biên giới để vẽ bản đồ',
  ],
  slides: [
    { kind: 'cover', title: 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á', kicker: 'Địa lí 11 · Bài 11 · Khu vực Đông Nam Á',
      sub: 'Vì sao Đông Nam Á được gọi là “ngã tư đường” của thế giới, và điều đó ảnh hưởng thế nào đến sự phát triển của khu vực?', meta: 'AIDA 2.0 · Lớp học số Địa lí',
      art: `<svg class="map bg" viewBox="0 0 1000 681">${seaSVG({ labels: false, grat: false, oceans: false }).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`,
      notes: 'Mở đầu bằng câu hỏi gợi mở ở phụ đề. Có thể hỏi nhanh: “Em đã từng đến hoặc biết gì về một nước Đông Nam Á nào?”' },
    { kind: 'goals', title: 'Mục tiêu bài học', kicker: 'Sau bài học, em có thể',
      items: ['Xác định được vị trí, phạm vi lãnh thổ và các quốc gia của khu vực Đông Nam Á trên bản đồ.', 'Phân tích được ảnh hưởng của <b class="hl">vị trí địa lí, điều kiện tự nhiên, tài nguyên thiên nhiên</b> đến phát triển kinh tế – xã hội của khu vực.', 'Phân tích được tác động của <b class="hl">đặc điểm dân cư, xã hội</b> tới phát triển kinh tế – xã hội của khu vực.'],
      codes: ['DL11.11.03', 'DL11.11.01', 'DL11.11.02'] },
    { kind: 'html', title: 'Khởi động: Tìm các quốc gia Đông Nam Á', kicker: 'Hoạt động',
      body: `<div class="s-body split-r" style="grid-template-columns:420px 1fr"><div><div class="find-q">Bấm vào nước: <span class="hl" id="fq">…</span></div><p style="font-size:22px;color:var(--muted);margin:6px 0 18px">Khu vực có <b>11 quốc gia</b>. Em tìm được bao nhiêu nước?</p><div class="find" id="fc"></div></div><div class="mapbox" id="fm">${seaSVG({ groups: false, labels: false, pick: true, oceans: true })}</div></div>`,
      notes: 'Có thể cho HS lên bảng bấm trên màn hình, hoặc chia đội thi tìm nhanh. Bản đồ chưa ghi tên nước.',
      mount(el, api) {
        const order = [...SEA11].sort(() => Math.random() - .5); let i = 0, miss = 0; const found = new Set();
        const q = el.querySelector('#fq'), fc = el.querySelector('#fc');
        const paint = () => { q.textContent = i < order.length ? NAME[order[i]] : 'Hoàn thành!'; fc.innerHTML = SEA11.map(k => `<span class="chip ${found.has(k) ? 'ok' : ''}">${NAME[k]}</span>`).join(''); };
        el.querySelectorAll('path.pick').forEach(p => (p.onclick = () => {
          if (i >= order.length) return; const k = p.dataset.iso;
          if (k === order[i]) { found.add(k); p.classList.add('found'); i++; if (i === order.length) { api.toast(`Tìm đủ 11 nước! (${miss} lần chọn nhầm)`); api.track('activity', { name: 'tim-nuoc', miss }); } }
          else { miss++; api.toast(`Đó là ${NAME[k]} – thử lại nhé`); }
          paint();
        }));
        paint();
      } },
    { kind: 'content', kicker: 'I. Vị trí địa lí và phạm vi lãnh thổ', title: 'Phạm vi lãnh thổ', layout: 'split-r',
      bullets: ['Gồm <b class="hl">11 quốc gia</b>, diện tích khoảng <b>4,5 triệu km²</b>.', ['Chia thành 2 bộ phận:', '<b>Đông Nam Á lục địa</b>: Việt Nam, Lào, Cam-pu-chia, Thái Lan, Mi-an-ma.', '<b>Đông Nam Á hải đảo</b>: Ma-lai-xi-a, Xin-ga-po, In-đô-nê-xi-a, Bru-nây, Phi-líp-pin, Đông Ti-mo.'], 'Lãnh thổ trải dài khoảng <b>từ 10°N đến 28°B</b> và <b>từ 92°Đ đến 152°Đ</b>.'],
      fig: `<div class="mapbox" style="flex:1">${seaSVG({ extent: true, labels: 'sea11' })}</div>${legend}`, src: 'SGK Địa lí 11 – Kết nối tri thức; bản đồ: Natural Earth',
      notes: 'Lưu ý HS: Ma-lai-xi-a có phần lãnh thổ trên bán đảo Mã Lai nhưng được xếp vào Đông Nam Á hải đảo. Chỉ trên bản đồ khung phạm vi (đường đứt màu cam).' },
    { kind: 'content', kicker: 'I. Vị trí địa lí và phạm vi lãnh thổ', title: 'Đặc điểm vị trí địa lí', layout: 'split-r',
      bullets: ['Nằm ở phía <b>đông nam châu Á</b>, tiếp giáp <b>Thái Bình Dương</b> và <b>Ấn Độ Dương</b>.', 'Là <b class="hl">cầu nối</b> giữa lục địa Á – Âu với lục địa Ô-xtrây-li-a.', 'Nằm hoàn toàn trong vùng nội chí tuyến, chịu ảnh hưởng của gió mùa.', 'Nằm trên các tuyến hàng hải quốc tế quan trọng (eo biển Ma-lắc-ca, Biển Đông).', 'Nơi giao thoa của các nền văn hoá lớn (Trung Hoa, Ấn Độ…) và nơi các cường quốc cạnh tranh ảnh hưởng.'],
      fig: `<div class="mapbox" style="flex:1">${seaSVG({ labels: 'sea11', extra: defs + malacca() })}</div>`,
      notes: 'Nhấn mạnh từ khoá “cầu nối” và “ngã tư đường”. Có thể hỏi: vì sao eo biển Ma-lắc-ca quan trọng với thương mại thế giới?' },
    { kind: 'html', kicker: 'I. Vị trí địa lí và phạm vi lãnh thổ', title: 'Ý nghĩa của vị trí địa lí',
      body: `<div class="grid2" style="align-items:start"><div class="box good frag"><h3>Thuận lợi</h3><ul><li>Giao lưu, hợp tác kinh tế với các nước trong và ngoài khu vực; phát triển giao thông, thương mại quốc tế.</li><li>Khí hậu nóng ẩm → phát triển nông nghiệp nhiệt đới.</li><li>Vùng biển rộng → phát triển tổng hợp kinh tế biển.</li><li>Văn hoá đa dạng → phát triển du lịch.</li></ul></div>
        <div class="box bad frag"><h3>Khó khăn</h3><ul><li>Nằm trong vùng có nhiều <b>thiên tai</b>: bão, lũ lụt, động đất, núi lửa, sóng thần.</li><li>Vị trí địa – chính trị quan trọng, là nơi các cường quốc cạnh tranh ảnh hưởng.</li><li>Vấn đề bảo vệ chủ quyền biển đảo, an ninh hàng hải.</li></ul></div></div>`,
      notes: 'Có thể liên hệ: Việt Nam nằm ở trung tâm khu vực, có đường bờ biển dài, nhiều cảng nước sâu.' },
    { kind: 'quiz', q: 'Đông Nam Á là cầu nối giữa lục địa Á – Âu với lục địa nào?', a: ['Phi', 'Ô-xtrây-li-a', 'Bắc Mỹ', 'Nam Cực'], k: 1,
      x: 'Đông Nam Á nằm giữa lục địa Á – Âu và lục địa Ô-xtrây-li-a, đồng thời giữa Thái Bình Dương và Ấn Độ Dương.' },
    { kind: 'html', kicker: 'II. Điều kiện tự nhiên', title: 'Đông Nam Á lục địa và Đông Nam Á hải đảo',
      body: `<table class="t"><thead><tr><th></th><th>Đông Nam Á lục địa</th><th>Đông Nam Á hải đảo</th></tr></thead><tbody>
        <tr class="frag"><th>Địa hình</th><td>Bị chia cắt mạnh; nhiều dãy núi hướng bắc – nam, tây bắc – đông nam; đồng bằng phù sa màu mỡ ở hạ lưu các sông lớn.</td><td>Nhiều đảo, quần đảo; ít đồng bằng, nhiều đồi núi và <b>núi lửa</b>.</td></tr>
        <tr class="frag"><th>Khí hậu</th><td>Chủ yếu nhiệt đới gió mùa; phía bắc Mi-an-ma, Việt Nam có mùa đông lạnh.</td><td>Nhiệt đới gió mùa và <b>xích đạo</b>.</td></tr>
        <tr class="frag"><th>Sông ngòi</th><td>Nhiều sông lớn: Mê Công, Hồng, Mê Nam, I-ra-oa-đi, Xa-lu-en.</td><td>Sông ngắn, dốc.</td></tr>
        <tr class="frag"><th>Đất</th><td>Đất phù sa, đất feralit.</td><td>Đất feralit, đất phù sa; đất từ tro bụi núi lửa màu mỡ.</td></tr></tbody></table>`,
      notes: 'Cho HS so sánh nhanh theo cặp trước khi hiện từng hàng. Liên hệ: In-đô-nê-xi-a có nhiều núi lửa hoạt động.' },
    { kind: 'content', kicker: 'II. Điều kiện tự nhiên', title: 'Sông ngòi và tài nguyên thiên nhiên', layout: 'split',
      bullets: ['<b>Khoáng sản</b> đa dạng: dầu mỏ, khí tự nhiên, than, thiếc, đồng, bô-xít…', '<b>Rừng nhiệt đới</b> có diện tích lớn, nhiều loài động, thực vật quý.', '<b>Biển</b>: giàu hải sản, nhiều vũng vịnh, bãi biển đẹp, có dầu khí ở thềm lục địa.', 'Sông lớn cung cấp nước, phù sa, thuỷ năng; <b>Biển Hồ</b> (Cam-pu-chia) điều hoà nước sông Mê Công.'],
      fig: `<div class="mapbox" style="flex:1">${seaSVG({ rivers: true, labels: 'sea11', grat: false })}</div>`, src: 'Bản đồ: Natural Earth 1:50m (sông lớn, Biển Hồ)' },
    { kind: 'html', kicker: 'II. Điều kiện tự nhiên', title: 'Ảnh hưởng của điều kiện tự nhiên và tài nguyên',
      body: `<div class="grid2" style="align-items:start"><div class="box good frag"><h3>Thuận lợi</h3><ul><li>Phát triển <b>nông nghiệp nhiệt đới</b>: lúa nước, cây công nghiệp (cao su, cà phê, dầu cọ…), cây ăn quả.</li><li>Phát triển công nghiệp khai khoáng, năng lượng.</li><li>Khai thác, nuôi trồng thuỷ sản, giao thông biển, du lịch.</li><li>Phát triển lâm nghiệp.</li></ul></div>
        <div class="box bad frag"><h3>Khó khăn</h3><ul><li>Nhiều thiên tai: bão, lũ, hạn hán, động đất, núi lửa, sóng thần.</li><li>Địa hình chia cắt, nhiều đảo → khó khăn cho giao thông, đặc biệt theo hướng đông – tây.</li><li>Rừng và khoáng sản bị khai thác quá mức, suy giảm; ô nhiễm môi trường.</li></ul></div></div>` },
    { kind: 'truefalse', q: 'Nhận định nào sau đây về tự nhiên Đông Nam Á là đúng, nhận định nào sai?',
      items: [['Đông Nam Á hải đảo có nhiều núi lửa.', true, 'khu vực nằm ở nơi tiếp giáp các mảng kiến tạo, In-đô-nê-xi-a và Phi-líp-pin có nhiều núi lửa hoạt động.'],
        ['Tất cả các nước Đông Nam Á đều có khí hậu xích đạo.', false, 'phần lớn Đông Nam Á lục địa có khí hậu nhiệt đới gió mùa; khí hậu xích đạo chủ yếu ở Đông Nam Á hải đảo.'],
        ['Sông Mê Công chảy qua nhiều quốc gia Đông Nam Á lục địa.', true, 'sông Mê Công chảy qua Mi-an-ma, Lào, Thái Lan, Cam-pu-chia và Việt Nam.'],
        ['Địa hình chia cắt, nhiều đảo không gây khó khăn cho giao thông.', false, 'địa hình bị chia cắt mạnh và lãnh thổ phân tán gây khó khăn cho giao thông, nhất là đường bộ.']] },
    { kind: 'content', kicker: 'III. Dân cư và xã hội', title: 'Dân cư: đông dân, phân bố không đều', layout: 'split',
      bullets: ['Dân số khoảng <b class="hl">700 triệu người</b> (2024), chiếm khoảng 8,5% dân số thế giới.', 'Mật độ khoảng <b>155 người/km²</b>, cao gấp hơn 2,5 lần mức trung bình thế giới.', 'Cơ cấu dân số <b>trẻ</b>, nhưng nhiều nước đang <b>già hoá</b> (Xin-ga-po, Thái Lan).', 'Phân bố không đều: tập trung ở đồng bằng châu thổ, ven biển và một số đảo (đảo Gia-va của In-đô-nê-xi-a).'],
      fig: `<div class="box" style="padding:22px 26px"><h3 style="font-size:24px">Dân số các nước, năm 2024 (triệu người)</h3><div class="bars">${POP.map(([k, v]) => `<div class="bar ${LD.includes(k) ? 'ld' : ''}"><span>${NAME[k]}</span><div class="tr"><i style="width:${(v / 283.5 * 100).toFixed(1)}%"></i></div><span class="n">${n1(v)}</span></div>`).join('')}</div></div>${legend.replace(/<span><i style="background:#c0392b[^]*?<\/span>/, '')}`,
      src: 'Liên hợp quốc, World Population Prospects 2024 (làm tròn)',
      notes: 'Gợi ý HS đọc biểu đồ: nước đông dân nhất (In-đô-nê-xi-a, thứ 4 thế giới), Việt Nam đứng thứ 3 khu vực với khoảng 101 triệu người.' },
    { kind: 'html', kicker: 'III. Dân cư và xã hội', title: 'Xã hội: đa dân tộc, đa tôn giáo, văn hoá có nhiều nét tương đồng',
      body: `<div class="grid3"><div class="box teal frag"><h3>Dân tộc</h3><p>Nhiều dân tộc; một số dân tộc phân bố ở nhiều nước (không theo biên giới quốc gia).</p></div>
        <div class="box teal frag"><h3>Tôn giáo</h3><p><b>Phật giáo</b>: Thái Lan, Mi-an-ma, Lào, Cam-pu-chia…<br><b>Hồi giáo</b>: In-đô-nê-xi-a, Ma-lai-xi-a, Bru-nây.<br><b>Công giáo</b>: Phi-líp-pin, Đông Ti-mo.</p></div>
        <div class="box teal frag"><h3>Văn hoá</h3><p>Phong tục, tập quán có nhiều nét tương đồng: văn minh lúa nước, lễ hội, ẩm thực; cùng chịu ảnh hưởng văn hoá Trung Hoa, Ấn Độ.</p></div></div>
        <div class="box frag" style="margin-top:22px"><p>Trình độ phát triển xã hội <b>chênh lệch</b> giữa các nước: Xin-ga-po, Bru-nây có chỉ số phát triển con người (HDI) cao; một số nước còn nhiều khó khăn về việc làm, y tế, giáo dục.</p></div>` },
    { kind: 'html', kicker: 'III. Dân cư và xã hội', title: 'Ảnh hưởng của dân cư, xã hội tới phát triển kinh tế – xã hội',
      body: `<div class="grid2" style="align-items:start"><div class="box good frag"><h3>Thuận lợi</h3><ul><li>Nguồn lao động dồi dào, chi phí lao động tương đối thấp, thu hút đầu tư.</li><li>Thị trường tiêu thụ rộng lớn.</li><li>Văn hoá đa dạng, nhiều nét tương đồng → phát triển du lịch, thuận lợi cho hợp tác giữa các nước.</li></ul></div>
        <div class="box bad frag"><h3>Khó khăn</h3><ul><li>Lao động có trình độ chuyên môn cao còn thiếu ở nhiều nước; sức ép việc làm.</li><li>Phân bố dân cư không đều.</li><li>Chênh lệch giàu nghèo; đa dạng dân tộc, tôn giáo đòi hỏi giải quyết tốt quan hệ để giữ ổn định xã hội.</li></ul></div></div>` },
    { kind: 'quiz', q: 'Đặc điểm dân cư nào sau đây tạo thuận lợi cho Đông Nam Á thu hút đầu tư nước ngoài?', a: ['Dân cư phân bố không đều', 'Nguồn lao động dồi dào, chi phí lao động tương đối thấp', 'Nhiều dân tộc phân bố ở nhiều nước', 'Một số nước đang già hoá dân số'], k: 1,
      x: 'Lao động dồi dào, chi phí thấp và thị trường tiêu thụ lớn là sức hút với các nhà đầu tư nước ngoài.' },
    { kind: 'summary', title: 'Tổng kết bài học', core: 'Khu vực<br>Đông Nam Á',
      left: [['Vị trí, lãnh thổ', '11 quốc gia, ~4,5 triệu km²; cầu nối Á – Âu và Ô-xtrây-li-a; giữa Thái Bình Dương và Ấn Độ Dương.'], ['Tự nhiên', 'Lục địa: núi chia cắt, đồng bằng phù sa, sông lớn. Hải đảo: nhiều đảo, núi lửa, khí hậu xích đạo.']],
      right: [['Tài nguyên', 'Khoáng sản, rừng nhiệt đới, biển giàu hải sản; nhiều thiên tai.'], ['Dân cư, xã hội', '~700 triệu người, lao động dồi dào; đa dân tộc, đa tôn giáo, văn hoá tương đồng.']],
      notes: 'Cho HS tự hoàn thành sơ đồ vào vở trước khi hiện từng nhánh.' },
    { kind: 'content', kicker: 'Vận dụng', title: 'Nhiệm vụ về nhà',
      bullets: ['Chọn <b>một quốc gia</b> Đông Nam Á (ngoài Việt Nam).', 'Tìm hiểu và giới thiệu <b>3 điểm tương đồng</b> giữa quốc gia đó với Việt Nam về tự nhiên, dân cư hoặc văn hoá.', 'Hình thức: một trang trình bày ngắn, có bản đồ hoặc hình ảnh minh hoạ, ghi rõ nguồn tham khảo.'],
      after: '<p style="font-size:24px;color:var(--muted);margin-top:30px">Bài tiếp theo: <b>Bài 12 – Kinh tế khu vực Đông Nam Á</b>.</p>' },
  ],
};

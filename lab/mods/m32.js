// 3D-32 · Bài 32 – Thực hành: Viết báo cáo tìm hiểu một vấn đề về công nghiệp
import { reportScene } from '../report.js';
import { fmtN } from '../kit.js';

// Ember – Global Electricity Review 2024: sản lượng điện thế giới năm 2023 theo nguồn (TWh)
const GEN = [['Than', 10434], ['Khí', 6634], ['Thuỷ điện', 4210], ['Hạt nhân', 2686], ['Gió', 2304], ['Mặt trời', 1631], ['Sinh khối', 697]];
const TOTAL = 29471;

export default {
  id: '3D-32', code: 'DL10.B32', title: 'Thực hành: Viết báo cáo về một vấn đề công nghiệp',
  objectives: [
    { c: 'DL10.11.07', t: 'Thu thập tài liệu, trình bày, báo cáo một vấn đề công nghiệp' },
    { c: 'DL10.11.08', t: 'Vẽ và phân tích biểu đồ về công nghiệp' },
  ],
  sources: [
    { t: 'Ember – Global Electricity Review 2024', u: 'https://ember-energy.org/latest-insights/global-electricity-review-2024/global-electricity-trends/', n: 'sản lượng điện theo nguồn năm 2023' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 32', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Đề tài mẫu: “Sự phát triển điện gió và điện mặt trời trên thế giới”. Em có thể chọn đề tài khác (ngành công nghiệp ở địa phương, một khu công nghiệp…) theo cùng các bước.',
  view: { pos: [0, 10, 18], target: [0, 1.5, 0] },
  steps: [
    { title: 'Nhiệm vụ', html: '<p>Viết báo cáo ngắn tìm hiểu <b>một vấn đề về công nghiệp</b> (ví dụ: một ngành công nghiệp của thế giới, của Việt Nam hoặc ở địa phương em).</p><p>Đề tài mẫu trong mô-đun: <b>Sự phát triển điện gió và điện mặt trời trên thế giới</b>.</p><div class="tip">Năm tấm bảng phía sau là 5 bước viết báo cáo. Bấm vào từng tấm để đọc hướng dẫn.</div>',
      enter: a => a.fly([0, 10, 18], [0, 1.5, 0]) },
    { title: 'Đề cương và tư liệu', html: '<p>Đề cương mẫu gồm: Mở đầu – Nội dung (vai trò, tình hình phát triển, phân bố, nguyên nhân) – Kết luận – Tài liệu tham khảo.</p><p>Tư liệu: báo cáo thường niên của tổ chức Ember về điện năng toàn cầu; số liệu của Cơ quan Năng lượng Quốc tế (IEA).</p><div class="tip">Bật “Xem đề cương mẫu” ở mục điều khiển.</div>',
      enter: a => a.fly([0, 6, 9], [0, 3, -6]) },
    { title: 'Xử lí số liệu', html: `<p>Năm 2023, tổng sản lượng điện thế giới là <b>${fmtN(TOTAL)} TWh</b>, trong đó điện gió ${fmtN(2304)} TWh, điện mặt trời ${fmtN(1631)} TWh.</p><p>Năm 2000, gió và mặt trời chỉ chiếm 0,2% sản lượng điện thế giới.</p><div class="tip">Hãy tính <b>tỉ trọng điện gió và mặt trời năm 2023</b> (%) rồi nhập ở mục điều khiển.</div>`,
      enter: a => a.fly([0, 5, 11], [0, 2, 3]) },
    { title: 'Nhận xét, kết luận', html: '<ul><li>Điện gió và mặt trời tăng rất nhanh: từ 0,2% (2000) lên khoảng <b>13,4%</b> (2023) sản lượng điện thế giới.</li><li>Nguyên nhân: công nghệ tiến bộ, giá thành giảm mạnh, chính sách giảm phát thải, nhu cầu điện tăng.</li><li>Hạn chế: phụ thuộc thời tiết, cần hệ thống lưu trữ, lưới điện truyền tải.</li><li>Than vẫn là nguồn điện lớn nhất (khoảng 35%).</li></ul>',
      enter: a => a.fly([3, 6, 12], [0, 2, 2]) },
  ],
  tasks: [
    { id: 'order', text: 'Bật thử thách và bấm <b>5 bước viết báo cáo theo đúng thứ tự</b>.' },
    { id: 'outline', text: 'Mở <b>đề cương mẫu</b>.' },
    { id: 'calc', text: 'Tính đúng <b>tỉ trọng điện gió và mặt trời năm 2023</b>.' },
    { id: 'bar', text: 'Bấm vào cột <b>điện mặt trời</b> trên biểu đồ.' },
  ],

  async setup(api) {
    reportScene(api, {
      rows: GEN.map(([t, v]) => ({ t, v: [v] })), series: [{ t: 'Sản lượng điện năm 2023 (TWh)', c: 0x5dade2 }], unit: 'TWh', scale: .0003, axisMax: 10000, axisStep: 2500,
      chartTitle: 'Sản lượng điện thế giới theo nguồn, năm 2023 (TWh)',
      info: (r) => ({ title: r.t, html: `<b>${fmtN(r.v[0])} TWh</b> – chiếm ${fmtN(r.v[0] / TOTAL * 100)}% tổng sản lượng điện thế giới.`, id: r.t, onPick: () => { if (r.t === 'Mặt trời') api.done('bar'); } }),
      outline: '<b>Đề cương mẫu</b><br>1. Mở đầu: vì sao cần phát triển điện gió, điện mặt trời?<br>2. Nội dung:<br>&nbsp;– Vai trò, đặc điểm<br>&nbsp;– Tình hình phát triển (số liệu 2000 → 2023)<br>&nbsp;– Phân bố: Trung Quốc, Hoa Kỳ, EU, Ấn Độ…<br>&nbsp;– Nguyên nhân, hạn chế<br>3. Kết luận, đề xuất<br>4. Tài liệu tham khảo',
      calc: { label: 'Tỉ trọng gió + mặt trời năm 2023 (%)', answer: 13.4, tol: .1, ok: '(2 304 + 1 631) ÷ 29 471 × 100 ≈ <b>13,4%</b>.', hint: 'Cộng sản lượng điện gió và mặt trời, chia cho tổng sản lượng điện, nhân 100.' },
    });
  },
};

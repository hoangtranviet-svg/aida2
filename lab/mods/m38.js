// 3D-38 · Bài 38 – Thực hành: Viết báo cáo tìm hiểu về một ngành dịch vụ
import { reportScene } from '../report.js';
import { fmtN } from '../kit.js';

// Tổng cục Thống kê: khách quốc tế đến Việt Nam (triệu lượt, làm tròn)
const VN = [['2019', 18.0], ['2020', 3.8], ['2021', .16], ['2022', 3.7], ['2023', 12.6], ['2024', 17.6]];

export default {
  id: '3D-38', code: 'DL10.B38', title: 'Thực hành: Viết báo cáo về một ngành dịch vụ',
  objectives: [
    { c: 'DL10.12.06', t: 'Viết báo cáo tìm hiểu về một ngành dịch vụ' },
    { c: 'DL10.12.04', t: 'Vẽ biểu đồ, phân tích số liệu ngành dịch vụ' },
    { c: 'DL10.12.05', t: 'Liên hệ hoạt động dịch vụ ở địa phương' },
  ],
  sources: [
    { t: 'Tổng cục Thống kê – Thông cáo báo chí tình hình kinh tế – xã hội các năm 2019 – 2024', u: 'https://www.nso.gov.vn/' },
    { t: 'Khách quốc tế đến Việt Nam năm 2024 (VietnamPlus)', u: 'https://www.vietnamplus.vn/khach-quoc-te-den-viet-nam-tang-manh-ve-gan-muc-truoc-dich-covid-19-post1006168.vnp' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 38', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Đề tài mẫu: “Sự phục hồi của du lịch quốc tế ở Việt Nam sau đại dịch COVID-19”. Em có thể chọn ngành dịch vụ khác ở địa phương (chợ, siêu thị, bến xe, ngân hàng…).',
  view: { pos: [0, 10, 18], target: [0, 1.5, 0] },
  steps: [
    { title: 'Nhiệm vụ', html: '<p>Viết báo cáo ngắn tìm hiểu <b>một ngành dịch vụ</b> (giao thông vận tải, bưu chính viễn thông, du lịch, thương mại, tài chính ngân hàng) của thế giới, Việt Nam hoặc địa phương.</p><p>Đề tài mẫu: <b>Sự phục hồi của du lịch quốc tế ở Việt Nam sau đại dịch</b>.</p><div class="tip">Bấm vào năm tấm bảng để đọc hướng dẫn từng bước.</div>',
      enter: a => a.fly([0, 10, 18], [0, 1.5, 0]) },
    { title: 'Đề cương và tư liệu', html: '<p>Nguồn tư liệu tin cậy: Tổng cục Thống kê (niên giám, thông cáo báo chí), Cục Du lịch Quốc gia Việt Nam, Tổ chức Du lịch Liên Hợp Quốc (UN Tourism).</p><div class="tip">Bật “Xem đề cương mẫu” ở mục điều khiển.</div>',
      enter: a => a.fly([0, 6, 9], [0, 3, -6]) },
    { title: 'Xử lí số liệu', html: '<p>Khách quốc tế đến Việt Nam năm 2023 là 12,6 triệu lượt, năm 2024 là 17,6 triệu lượt.</p><p style="text-align:center"><b>Tốc độ tăng (%) = (năm sau − năm trước) ÷ năm trước × 100</b></p><div class="tip">Tính <b>tốc độ tăng của năm 2024 so với năm 2023</b> rồi nhập ở mục điều khiển.</div>',
      enter: a => a.fly([0, 5, 11], [0, 2, 3]) },
    { title: 'Nhận xét, kết luận', html: '<ul><li>Năm 2019 đạt đỉnh 18,0 triệu lượt; năm 2020 – 2021 giảm rất mạnh do đóng cửa biên giới vì đại dịch.</li><li>Từ 2022 phục hồi nhanh; năm 2024 đạt 17,6 triệu lượt (gần bằng năm 2019).</li><li>Nguyên nhân: mở cửa trở lại, chính sách thị thực thuận lợi hơn, quảng bá, nhiều đường bay quốc tế.</li><li>Đề xuất: đa dạng sản phẩm, nâng chất lượng dịch vụ, phát triển du lịch xanh.</li></ul>',
      enter: a => a.fly([3, 6, 12], [0, 2, 2]) },
  ],
  tasks: [
    { id: 'order', text: 'Bật thử thách và bấm <b>5 bước viết báo cáo theo đúng thứ tự</b>.' },
    { id: 'outline', text: 'Mở <b>đề cương mẫu</b>.' },
    { id: 'calc', text: 'Tính đúng <b>tốc độ tăng số khách năm 2024 so với 2023</b>.' },
    { id: 'bar', text: 'Bấm vào cột <b>năm thấp nhất</b> trên biểu đồ.' },
  ],

  async setup(api) {
    reportScene(api, {
      rows: VN.map(([t, v]) => ({ t, v: [v] })), series: [{ t: 'Khách quốc tế đến Việt Nam (triệu lượt)', c: 0xff6b6b }], unit: 'triệu lượt', scale: .17, axisMax: 20, axisStep: 5,
      chartTitle: 'Khách quốc tế đến Việt Nam (triệu lượt)',
      info: (r) => ({ title: `Năm ${r.t}`, html: `<b>${fmtN(r.v[0], 2)} triệu lượt</b> khách quốc tế${r.t === '2021' ? ' – thấp nhất do đóng cửa biên giới.' : '.'}`, id: r.t, onPick: () => { if (r.t === '2021') api.done('bar'); } }),
      outline: '<b>Đề cương mẫu</b><br>1. Mở đầu: vai trò của du lịch quốc tế với kinh tế Việt Nam<br>2. Nội dung:<br>&nbsp;– Tài nguyên, điểm đến nổi bật<br>&nbsp;– Diễn biến số khách 2019 → 2024<br>&nbsp;– Các thị trường khách chính<br>&nbsp;– Nguyên nhân phục hồi, hạn chế<br>3. Kết luận, đề xuất<br>4. Tài liệu tham khảo',
      calc: { label: 'Tốc độ tăng số khách 2024 so với 2023 (%)', answer: 39.7, tol: .35, ok: '(17,6 − 12,6) ÷ 12,6 × 100 ≈ <b>39,7%</b> (số liệu chính xác của Tổng cục Thống kê: tăng 39,5%).', hint: 'Lấy số khách 2024 trừ 2023, chia cho số khách 2023, nhân 100.' },
    });
  },
};

// Trang giới thiệu
import { $ } from '../core/util.js';
import { ic, LOGO } from '../core/icons.js';
import { MODULES, allQ } from '../core/qbank.js';
import { mountGlobe } from '../core/globe.js';
import * as D from '../core/data.js';

export default {
  bare: true, title: 'Giới thiệu',
  render(el) {
    const u = D.me();
    el.innerHTML = `<div class="land">
    <div class="land-nav"><div class="bar"><a class="logo" href="#gioi-thieu">${LOGO}<span><b>AIDA 2.0</b><small>ĐỊA LÍ · LỚP HỌC SỐ</small></span></a>
      <nav class="links"><a href="#gioi-thieu" data-to="tinh-nang">Tính năng</a><a href="#gioi-thieu" data-to="quy-trinh">Cách dùng</a><a href="#gioi-thieu" data-to="hoc-lieu">Học liệu 3D</a></nav>
      ${u ? `<a class="btn pri" href="#">${ic('arrowR')} Vào lớp học</a>` : `<a class="btn ghost" href="#dang-nhap">Đăng nhập</a><a class="btn pri" href="#dang-ki">Đăng kí</a>`}</div></div>

    <section class="hero">
      <div>
        <span class="eyebrow">Địa lí 10 · Chương trình GDPT 2018 · Kết nối tri thức</span>
        <h1 style="margin-top:14px">Nhìn thấy <span class="o">Trái Đất</span> chuyển động. <span class="s">Hiểu vì sao</span> mình sai.</h1>
        <p class="big">AIDA 2.0 là lớp học số cho môn Địa lí: học sinh khám phá ${MODULES.length} mô hình 3D theo mô-đun thầy cô mở, luyện tập theo từng mã mục tiêu, và nhận gợi ý cách học từ chính thói quen, lỗi sai của mình.</p>
        <div class="ctas"><a class="btn sun lg" href="#${u ? '' : 'dang-nhap'}">${ic('play')} Dùng thử ngay</a><a class="btn lg" href="#dang-ki">${ic('users')} Tạo lớp cho giáo viên</a></div>
        <div class="proof"><div><b class="num">${MODULES.length}</b><span>mô-đun 3D có chuyển động</span></div><div><b class="num">318</b><span>mục tiêu được mã hoá</span></div><div><b class="num">${allQ(null).length}</b><span>câu hỏi theo CV 7991</span></div></div>
      </div>
      <div class="globe-box" id="globe">
        <div class="globe-tag" style="left:16px;top:16px"><b>DL10.04.03</b>Các đai khí áp và gió</div>
        <div class="globe-tag" style="right:16px;bottom:16px"><b>21°B · 105°Đ</b>Lớp 10A1 đang học Bài 9</div>
      </div>
    </section>

    <section class="band" id="tinh-nang">
      <span class="eyebrow">Một nền tảng, ba vai trò</span>
      <h2 style="margin-top:8px">Từ mô hình 3D đến lời nhận xét trong học bạ</h2>
      <p class="sub">Mỗi thao tác của học sinh trên mô hình, mỗi câu trả lời đều gắn với một mã mục tiêu. Nhờ vậy giáo viên biết chính xác lớp đang hổng ở đâu, học sinh biết mình cần làm gì tiếp theo.</p>
      <div class="feat">
        <div class="card flat"><span class="ic">${ic('unlock')}</span><h3>Mở mô-đun theo lịch học</h3><p>Giáo viên mở, khoá hoặc chuyển sang ôn tập từng bài; học sinh thấy ngay trên máy của mình.</p></div>
        <div class="card flat"><span class="ic">${ic('cube')}</span><h3>${MODULES.length} mô hình 3D có chuyển động</h3><p>Trọn 40 bài SGK Địa lí 10: hoàn lưu khí quyển, kiến tạo mảng, tháp dân số, chọn vị trí nhà máy, cáp quang biển, cán cân thương mại…</p></div>
        <div class="card flat"><span class="ic">${ic('wand')}</span><h3>Tạo đề theo CV 7991</h3><p>Chọn phạm vi bài, hệ thống lập ma trận Biết – Hiểu – Vận dụng, sinh đề 3 phần và trộn nhiều mã đề, xuất Word.</p></div>
        <div class="card flat"><span class="ic">${ic('grade')}</span><h3>Chấm và phân tích bài kiểm tra</h3><p>Chấm tự động trắc nghiệm, đúng/sai, trả lời ngắn; gợi ý điểm tự luận; độ khó, độ phân biệt từng câu.</p></div>
        <div class="card flat"><span class="ic">${ic('pulse')}</span><h3>Phân tích thói quen học</h3><p>Phát hiện học dồn, học khuya, đoán mò, lặp lỗi – kèm bằng chứng và chiến lược học có cơ sở khoa học.</p></div>
        <div class="card flat"><span class="ic">${ic('comment')}</span><h3>Nhận xét theo Thông tư 22</h3><p>Tính điểm trung bình môn, xếp mức tham chiếu và soạn sẵn lời nhận xét để giáo viên chỉnh sửa.</p></div>
      </div>
    </section>

    <section class="band" id="quy-trinh">
      <span class="eyebrow">Một vòng học</span>
      <h2 style="margin-top:8px">Mở → Khám phá → Luyện tập → Kiểm tra → Cải thiện</h2>
      <div class="flow">
        <div><span class="n">GV · trên lớp</span><b>Mở mô-đun</b><p>Bấm “Mở” đúng giờ học, đặt hạn hoàn thành.</p></div>
        <div><span class="n">HS · ở nhà</span><b>Khám phá 3D</b><p>Đi qua từng bước, bật tắt lớp bản đồ, làm nhiệm vụ trên mô hình.</p></div>
        <div><span class="n">HS · ngay sau đó</span><b>Luyện tập theo mục tiêu</b><p>Sai câu nào, quay lại đúng bước mô hình liên quan.</p></div>
        <div><span class="n">GV · hằng tháng</span><b>Kiểm tra</b><p>Làm trực tuyến hoặc nhập điểm bài giấy theo từng câu.</p></div>
        <div><span class="n">HS · tuần sau</span><b>Cải thiện</b><p>Mục tiêu dưới 50% thành nhiệm vụ; hoàn thành khi làm đúng thêm 2 câu.</p></div>
      </div>
    </section>

    <section class="band" id="hoc-lieu">
      <span class="eyebrow">Học liệu 3D · Phần 1 – 3 sách Địa lí 10</span>
      <h2 style="margin-top:8px">${MODULES.length} mô-đun, xếp theo chương</h2>
      <div class="mods" style="margin-top:20px">${MODULES.map(m => `<div class="mod"><span class="mod-n">${m.bai.toUpperCase()} · ${m.code}</span><div class="mod-t">${m.title}</div><span class="muted" style="font-size:12.5px">${m.chap}</span></div>`).join('')}</div>
    </section>
    <footer class="foot">AIDA 2.0 · Trần Việt Hoàng · Dự án dự thi Giải thưởng Tiên phong ứng dụng AI trong giáo dục 2026</footer></div>`;
    el.querySelectorAll('[data-to]').forEach(a => (a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.to)?.scrollIntoView({ behavior: 'smooth' }); }));
    return mountGlobe($('#globe'), { markers: [{ lat: 21, lon: 105.8 }, { lat: 10.8, lon: 106.7 }], zoom: 3.05, speed: .09 });
  },
};

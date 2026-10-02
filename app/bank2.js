// Ngân hàng câu hỏi mở rộng theo cấu trúc đề của Công văn 7991/BGDĐT-GDTrH (17/12/2024):
// Phần I nhiều lựa chọn (mc) · Phần II đúng/sai (ds) · Phần III trả lời ngắn (tln) · Tự luận (tlu)
// Mức độ: B = Biết, H = Hiểu, V = Vận dụng. Mỗi câu gắn mã mục tiêu (o) và mô-đun 3D (m).
import { BANK } from './bank.js';

export const LEVEL_NAME = { B: 'Biết', H: 'Hiểu', V: 'Vận dụng' };
export const TYPE_NAME = { mc: 'Nhiều lựa chọn', ds: 'Đúng/Sai', tln: 'Trả lời ngắn', tlu: 'Tự luận' };

// Mức độ cho câu nhiều lựa chọn sẵn có: suy từ cách hỏi (GV chỉnh lại được trong Ngân hàng câu hỏi)
export function guessLevel(q) {
  const s = q.q.toLowerCase();
  if (/\d/.test(s) && /(một |nếu |khi |cho |biết )/.test(s)) return 'V';
  if (/(nguyên nhân|vì sao|do đâu|chủ yếu do|là do|giải thích|hệ quả|ảnh hưởng|tác động|phản ánh|ý nghĩa)/.test(s)) return 'H';
  if (/(phân biệt|so sánh|khác)/.test(s)) return 'H';
  return 'B';
}
// mức do GV bộ môn xác định lại cho những câu cần suy luận/vận dụng
const MANUAL = {
  'DL10.01.01-Q03': 'H', 'DL10.01.01-Q04': 'H', 'DL10.01.03-Q03': 'H', 'DL10.01.02-Q02': 'H', 'DL10.02.04-Q01': 'H', 'DL10.03.02-Q01': 'H', 'DL10.03.02-Q02': 'H',
  'DL10.03.02-Q03': 'H', 'DL10.03.04-Q01': 'H', 'DL10.03.05-Q02': 'H', 'DL10.03.02-Q04': 'V', 'DL10.03.05-Q03': 'H', 'DL10.04.04-Q01': 'H', 'DL10.04.08-Q01': 'H',
  'DL10.04.04-Q03': 'H', 'DL10.04.07-Q02': 'V', 'DL10.04.06-Q01': 'V', 'DL10.04.07-Q03': 'H', 'DL10.05.02-Q01': 'V', 'DL10.05.05-Q01': 'H', 'DL10.05.01-Q02': 'H',
  'DL10.05.08-Q03': 'H', 'DL10.05.09-Q01': 'V', 'DL10.05.09-Q02': 'H', 'DL10.06.03-Q02': 'H', 'DL10.07.03-Q03': 'V', 'DL10.07.04-Q01': 'V', 'DL10.08.05-Q02': 'H', 'DL10.08.09-Q01': 'H',
};
export const LEVEL = Object.fromEntries(BANK.map(q => [q.id, MANUAL[q.id] || guessLevel(q)]));

const DS = (m, o, lv, q, st, k, e, x, s = null) => ({ t: 'ds', m, o, lv, q, st, k, e, x, s });
const TL = (m, o, lv, q, k, tol, unit, x, s = null) => ({ t: 'tln', m, o, lv, q, k, tol, unit, x, s });
const TU = (m, o, lv, q, rubric, x, s = null) => ({ t: 'tlu', m, o, lv, q, rubric: rubric.map(([d, p, kw]) => ({ d, p, kw })), x, s });

export const EXTRA = [
  // ===== Bài 2 – Phương pháp biểu hiện trên bản đồ
  DS('DL10.B02', 'DL10.01.01', 'H', 'Một bản đồ khí hậu Việt Nam dùng mũi tên để thể hiện hướng gió mùa, dùng các vùng màu để thể hiện các miền khí hậu và đặt các kí hiệu hình học tại vị trí các trạm khí tượng.',
    ['Mũi tên thể hiện hướng gió mùa thuộc phương pháp kí hiệu đường chuyển động.', 'Các vùng màu thể hiện miền khí hậu thuộc phương pháp chấm điểm.', 'Phương pháp kí hiệu có thể cho biết vị trí, số lượng và chất lượng của đối tượng.', 'Phương pháp chấm điểm thường dùng để thể hiện các đối tượng phân bố liên tục, đều khắp như nhiệt độ không khí.'],
    [true, false, true, false], ['E15', 'E15', 'E15', 'E15'], 'Vùng màu là phương pháp khoanh vùng; chấm điểm dùng cho đối tượng phân bố phân tán, lẻ tẻ (ví dụ dân cư nông thôn).', 2),
  TL('DL10.B02', 'DL10.01.02', 'V', 'Trên bản đồ tỉ lệ 1 : 6 000 000, khoảng cách giữa hai thành phố đo được là 4,5 cm. Khoảng cách thực tế giữa hai thành phố là bao nhiêu ki-lô-mét?', '270', 0, 'km', '4,5 cm × 6 000 000 = 27 000 000 cm = 270 km.'),
  TU('DL10.B02', 'DL10.01.01', 'H', 'Phân biệt phương pháp kí hiệu và phương pháp chấm điểm trên bản đồ (đối tượng thể hiện, cách thể hiện, ví dụ).',
    [['Phương pháp kí hiệu: thể hiện đối tượng phân bố theo những điểm cụ thể; kí hiệu đặt đúng vị trí đối tượng; ví dụ mỏ khoáng sản, nhà máy, thành phố.', 0.5, ['ki hieu', 'diem cu the', 'dung vi tri', 'mo', 'nha may']],
     ['Phương pháp chấm điểm: thể hiện đối tượng phân bố phân tán, lẻ tẻ bằng các điểm chấm, mỗi chấm ứng với một giá trị; ví dụ phân bố dân cư.', 0.5, ['cham diem', 'phan tan', 'le te', 'moi cham', 'dan cu']]],
    'Kí hiệu – đối tượng theo điểm, đặt chính xác vị trí, cho biết vị trí, số lượng, chất lượng. Chấm điểm – đối tượng phân tán, mỗi chấm một giá trị nhất định.'),

  // ===== Bài 3 – GPS và bản đồ số
  DS('DL10.B03', 'DL10.01.03', 'H', 'Một bạn học sinh dùng ứng dụng bản đồ trên điện thoại để tìm đường từ nhà đến bảo tàng.',
    ['GPS xác định vị trí của điện thoại dựa vào tín hiệu nhận được từ các vệ tinh.', 'Máy thu chỉ cần nhận tín hiệu từ một vệ tinh là xác định được vị trí.', 'Bản đồ số có thể cập nhật thông tin nhanh và kết hợp với GPS để chỉ đường.', 'GPS hiện nay chỉ được dùng trong lĩnh vực quân sự.'],
    [true, false, true, false], ['E16', 'E16', 'E16', 'E16'], 'Cần tín hiệu từ ít nhất 3 – 4 vệ tinh để xác định vị trí; GPS được dùng rộng rãi trong giao thông, đo đạc, cứu hộ, đời sống.', 2),
  TU('DL10.B03', 'DL10.01.03', 'V', 'Nêu bốn ứng dụng của GPS và bản đồ số trong đời sống mà em biết.',
    [['Dẫn đường, tìm đường trong giao thông.', 0.25, ['dan duong', 'chi duong', 'tim duong', 'giao thong']], ['Theo dõi, giám sát vị trí phương tiện, người, hàng hoá.', 0.25, ['theo doi', 'giam sat', 'dinh vi', 'vi tri']],
     ['Tìm kiếm, cứu hộ cứu nạn.', 0.25, ['cuu ho', 'cuu nan', 'tim kiem']], ['Đo đạc, quản lí đất đai, nông nghiệp; dịch vụ gọi xe, giao hàng.', 0.25, ['do dac', 'dat dai', 'goi xe', 'giao hang', 'nong nghiep']]],
    'Chỉ đường; theo dõi vị trí phương tiện; cứu hộ cứu nạn; đo đạc, quản lí đất đai; gọi xe, giao hàng…'),

  // ===== Bài 4 – Trái Đất, vỏ Trái Đất
  DS('DL10.B04', 'DL10.02.01', 'H', 'Đọc thông tin về cấu tạo của vỏ Trái Đất.',
    ['Độ dày của vỏ Trái Đất dao động khoảng từ 5 km ở đại dương đến 70 km ở lục địa.', 'Vỏ lục địa gồm ba tầng đá: trầm tích, granit và badan.', 'Vỏ đại dương có tầng granit dày hơn vỏ lục địa.', 'Đá trầm tích được hình thành do mắc-ma nguội lạnh và đông đặc.'],
    [true, true, false, false], ['E14', 'E14', 'E14', 'E14'], 'Vỏ đại dương mỏng, hầu như không có tầng granit. Đá do mắc-ma đông đặc là đá mắc-ma; đá trầm tích hình thành do lắng đọng, nén chặt vật liệu.', 3),
  TU('DL10.B04', 'DL10.02.01', 'B', 'Trình bày đặc điểm cấu tạo của vỏ Trái Đất.',
    [['Vỏ Trái Đất là lớp vỏ cứng, mỏng ngoài cùng; dày khoảng 5 km (đại dương) đến 70 km (lục địa).', 0.25, ['vo cung', 'mong', '5 km', '70 km']], ['Vỏ lục địa gồm ba tầng: trầm tích, granit, badan.', 0.5, ['tram tich', 'granit', 'badan']], ['Vỏ đại dương mỏng hơn, không có tầng granit.', 0.25, ['dai duong', 'khong co', 'granit']]],
    'Lớp vỏ cứng mỏng; vỏ lục địa 3 tầng (trầm tích, granit, badan); vỏ đại dương mỏng, thiếu tầng granit.'),

  // ===== Bài 5 – Hệ quả chuyển động
  DS('DL10.B05', 'DL10.02.02', 'H', 'Quan sát mô hình chuyển động của Trái Đất quanh Mặt Trời trong một năm.',
    ['Ngày 22/6, bán cầu Bắc có thời gian ngày dài hơn đêm.', 'Ngày 22/6, Mặt Trời lên thiên đỉnh ở chí tuyến Nam.', 'Ngày 21/3 và 23/9, mọi nơi trên Trái Đất có ngày dài bằng đêm.', 'Ngày 22/12, ở vòng cực Bắc có hiện tượng ngày dài 24 giờ.'],
    [true, false, true, false], ['E07', 'E07', 'E07', 'E06'], 'Ngày 22/6 Mặt Trời lên thiên đỉnh ở chí tuyến Bắc. Ngày 22/12 vòng cực Bắc có đêm dài 24 giờ.', 1),
  TL('DL10.B05', 'DL10.02.02', 'V', 'Khi ở Luân Đôn (múi giờ số 0) là 21 giờ ngày 10/7 thì ở Hà Nội (múi giờ số 7) là mấy giờ? (chỉ ghi số giờ)', '4', 0, 'giờ', 'Hà Nội sớm hơn 7 giờ: 21 + 7 = 28 → 4 giờ sáng ngày 11/7.', 5),
  TL('DL10.B05', 'DL10.02.04', 'V', 'Hai địa điểm A và B cách nhau 45 độ kinh tuyến. Chênh lệch giờ địa phương giữa hai địa điểm là bao nhiêu giờ?', '3', 0, 'giờ', 'Mỗi độ kinh tuyến chênh 4 phút: 45 × 4 = 180 phút = 3 giờ.', 5),
  TU('DL10.B05', 'DL10.02.02', 'H', 'Giải thích vì sao có hiện tượng ngày đêm dài ngắn khác nhau theo mùa và theo vĩ độ.',
    [['Trục Trái Đất nghiêng và không đổi phương khi chuyển động quanh Mặt Trời.', 0.5, ['truc', 'nghieng', 'khong doi phuong', 'quanh mat troi']], ['Đường phân chia sáng tối không trùng với trục Trái Đất nên các vĩ độ có thời gian ngày, đêm khác nhau.', 0.25, ['phan chia sang toi', 'khong trung']], ['Ví dụ: mùa hạ ở bán cầu Bắc ngày dài hơn đêm, càng lên vĩ độ cao chênh lệch càng lớn.', 0.25, ['mua ha', 'ngay dai', 'vi do cao', 'chenh lech']]],
    'Do trục nghiêng không đổi phương khi chuyển động quanh Mặt Trời; đường sáng tối không trùng trục nên độ dài ngày đêm khác nhau theo mùa và vĩ độ.'),

  // ===== Bài 6 – Thạch quyển, kiến tạo mảng
  DS('DL10.B06', 'DL10.03.02', 'H', 'Đọc thông tin về thạch quyển và thuyết kiến tạo mảng.',
    ['Thạch quyển gồm vỏ Trái Đất và phần trên của lớp Man-ti.', 'Thạch quyển và vỏ Trái Đất là hai tên gọi của cùng một lớp.', 'Ở nơi hai mảng xô vào nhau thường hình thành núi trẻ, động đất và núi lửa.', 'Ở nơi hai mảng đại dương tách xa nhau thường hình thành các vực biển sâu.'],
    [true, false, true, false], ['E09', 'E09', 'E10', 'E10'], 'Nơi các mảng đại dương tách xa nhau hình thành sống núi ngầm giữa đại dương; vực biển sâu hình thành ở nơi mảng bị hút chìm.', 3),
  TL('DL10.B06', 'DL10.03.02', 'V', 'Một mảng kiến tạo dịch chuyển với tốc độ trung bình 5 cm/năm. Sau 1 triệu năm, mảng đó dịch chuyển được bao nhiêu ki-lô-mét?', '50', 0, 'km', '5 cm × 1 000 000 = 5 000 000 cm = 50 km.'),
  TU('DL10.B06', 'DL10.03.02', 'V', 'Dựa vào thuyết kiến tạo mảng, giải thích sự hình thành dãy núi Hi-ma-lay-a.',
    [['Mảng Ấn Độ – Ô-xtrây-li-a di chuyển, xô vào mảng Á – Âu.', 0.5, ['an do', 'a au', 'xo vao', 'va cham', 'tiep xuc']], ['Hai mảng lục địa va chạm, đá bị nén ép, uốn nếp và đẩy lên cao tạo thành núi trẻ đồ sộ.', 0.5, ['nen ep', 'uon nep', 'day len', 'nui tre']]],
    'Mảng Ấn Độ – Ô-xtrây-li-a xô vào mảng Á – Âu; vùng tiếp xúc bị nén ép, uốn nếp, nâng lên thành dãy núi trẻ Hi-ma-lay-a.'),

  // ===== Bài 7 – Nội lực, ngoại lực
  DS('DL10.B07', 'DL10.03.03', 'H', 'Đọc thông tin về các lực tác động đến địa hình bề mặt Trái Đất.',
    ['Nội lực là lực phát sinh từ bên trong Trái Đất.', 'Nguồn năng lượng chủ yếu sinh ra ngoại lực là năng lượng bức xạ của Mặt Trời.', 'Uốn nếp và đứt gãy là kết quả tác động của ngoại lực.', 'Phong hoá, bóc mòn, vận chuyển, bồi tụ là các quá trình của nội lực.'],
    [true, true, false, false], ['E11', 'E11', 'E11', 'E11'], 'Uốn nếp, đứt gãy do nội lực; phong hoá, bóc mòn, vận chuyển, bồi tụ là các quá trình ngoại lực.', 1),
  TU('DL10.B07', 'DL10.03.03', 'H', 'Phân biệt nội lực và ngoại lực (khái niệm, nguồn năng lượng, tác động đến địa hình).',
    [['Nội lực: lực sinh ra bên trong Trái Đất, nguồn năng lượng trong lòng đất; gây uốn nếp, đứt gãy, làm địa hình gồ ghề, nâng cao.', 0.5, ['noi luc', 'ben trong', 'long dat', 'uon nep', 'dut gay']], ['Ngoại lực: lực bên ngoài, nguồn năng lượng bức xạ Mặt Trời; phong hoá, bóc mòn, vận chuyển, bồi tụ, có xu hướng san bằng địa hình.', 0.5, ['ngoai luc', 'ben ngoai', 'buc xa', 'phong hoa', 'boc mon', 'boi tu', 'san bang']]],
    'Nội lực – bên trong, tạo uốn nếp, đứt gãy, làm địa hình gồ ghề. Ngoại lực – bên ngoài, bức xạ Mặt Trời, phong hoá – bóc mòn – vận chuyển – bồi tụ, san bằng địa hình.'),

  // ===== Bài 8 – Vành đai động đất, núi lửa
  DS('DL10.B08', 'DL10.03.05', 'H', 'Quan sát bản đồ phân bố các vành đai động đất, núi lửa trên thế giới.',
    ['Động đất, núi lửa tập trung chủ yếu ở ranh giới các mảng kiến tạo.', 'Vành đai lửa Thái Bình Dương chạy dọc theo ven bờ Thái Bình Dương.', 'Phần trung tâm ổn định của lục địa Ô-xtrây-li-a có nhiều núi lửa đang hoạt động.', 'Nhật Bản thường xuyên có động đất vì nằm ở nơi tiếp xúc giữa các mảng kiến tạo.'],
    [true, true, false, true], ['E28', 'E28', 'E28', 'E28'], 'Trung tâm các mảng lục địa tương đối ổn định nên rất ít động đất, núi lửa.', 2),
  TU('DL10.B08', 'DL10.03.05', 'V', 'Nhận xét và giải thích sự phân bố các vành đai động đất, núi lửa trên thế giới.',
    [['Nhận xét: phân bố thành vành đai, tập trung ven Thái Bình Dương, khu vực Địa Trung Hải – Hi-ma-lay-a, dọc sống núi giữa đại dương.', 0.5, ['vanh dai', 'thai binh duong', 'dia trung hai', 'song nui']], ['Giải thích: đây là nơi tiếp xúc của các mảng kiến tạo, vỏ Trái Đất không ổn định, mắc-ma dễ trào lên.', 0.5, ['tiep xuc', 'mang kien tao', 'khong on dinh', 'mac-ma', 'mac ma']]],
    'Phân bố thành vành đai ở nơi tiếp xúc các mảng kiến tạo (ven Thái Bình Dương, Địa Trung Hải – Hi-ma-lay-a, sống núi đại dương) vì vỏ Trái Đất ở đó không ổn định.'),

  // ===== Bài 9 – Khí quyển
  DS('DL10.B09', 'DL10.04.03', 'H', 'Quan sát mô hình các đai khí áp và gió chính trên Trái Đất.',
    ['Đai áp thấp xích đạo hình thành chủ yếu do nguyên nhân nhiệt lực.', 'Đai áp cao cận chí tuyến hình thành chủ yếu do nguyên nhân động lực.', 'Gió Mậu dịch thổi từ áp thấp xích đạo về áp cao cận chí tuyến.', 'Gió Tây ôn đới thổi từ áp cao cận chí tuyến về áp thấp ôn đới.'],
    [true, true, false, true], ['E03', 'E03', 'E02', 'E05'], 'Gió luôn thổi từ áp cao về áp thấp: gió Mậu dịch thổi từ áp cao cận chí tuyến về áp thấp xích đạo.', 4),
  DS('DL10.B09', 'DL10.04.02', 'V', 'Đọc thông tin về sự phân bố nhiệt độ không khí trên Trái Đất.',
    ['Nhiệt độ trung bình năm nhìn chung giảm dần từ vùng vĩ độ thấp lên vùng vĩ độ cao.', 'Biên độ nhiệt năm nhìn chung tăng dần từ xích đạo về cực.', 'Càng lên cao nhiệt độ không khí càng tăng, trung bình 0,6 °C/100 m.', 'Đại dương có biên độ nhiệt năm lớn hơn lục địa.'],
    [true, true, false, false], ['E31', 'E31', 'E31', 'E31'], 'Lên cao nhiệt độ giảm (0,6 °C/100 m). Đại dương hấp thụ và toả nhiệt chậm nên biên độ nhiệt nhỏ hơn lục địa.', 3),
  TL('DL10.B09', 'DL10.04.02', 'V', 'Ở chân núi (độ cao 200 m) nhiệt độ không khí là 26 °C. Theo quy luật giảm nhiệt độ theo độ cao (0,6 °C/100 m), nhiệt độ ở đỉnh núi cao 2 200 m là bao nhiêu °C?', '14', 0, '°C', 'Chênh cao 2 000 m → giảm 20 × 0,6 = 12 °C; 26 − 12 = 14 °C.', 3),
  TL('DL10.B09', 'DL10.04.06', 'V', 'Một trạm khí tượng có nhiệt độ tháng cao nhất là 29,8 °C và tháng thấp nhất là 16,4 °C. Biên độ nhiệt năm của trạm là bao nhiêu °C? (làm tròn đến một chữ số thập phân)', '13,4', 0.05, '°C', 'Biên độ nhiệt năm = 29,8 − 16,4 = 13,4 °C.'),
  TL('DL10.B09', 'DL10.04.08', 'V', 'Một khối khí ẩm ở chân sườn đón gió (độ cao 0 m) có nhiệt độ 25 °C, vượt qua dãy núi cao 2 000 m rồi xuống sườn khuất gió. Biết khi lên cao không khí ẩm giảm 0,6 °C/100 m, khi xuống không khí khô tăng 1 °C/100 m. Nhiệt độ ở chân sườn khuất gió (độ cao 0 m) là bao nhiêu °C?', '33', 0, '°C', 'Lên đỉnh: 25 − 20 × 0,6 = 13 °C. Xuống: 13 + 20 × 1 = 33 °C (hiệu ứng phơn).', 5),
  TU('DL10.B09', 'DL10.04.05', 'H', 'Giải thích vì sao khu vực xích đạo mưa nhiều còn khu vực chí tuyến mưa ít.',
    [['Xích đạo: khí áp thấp, không khí nóng ẩm bốc lên cao, ngưng tụ; diện tích đại dương và rừng lớn, bốc hơi mạnh.', 0.5, ['ap thap', 'boc len', 'dai duong', 'boc hoi', 'rung']], ['Chí tuyến: khí áp cao, không khí giáng xuống khó gây mưa; gió Mậu dịch khô; nhiều lục địa rộng lớn.', 0.5, ['ap cao', 'giang xuong', 'mau dich', 'kho', 'luc dia']]],
    'Xích đạo – áp thấp, không khí bốc lên, nhiều đại dương, rừng → mưa nhiều. Chí tuyến – áp cao, không khí giáng xuống, gió Mậu dịch khô → mưa ít.'),

  // ===== Bài 10 – Đới và kiểu khí hậu
  DS('DL10.B10', 'DL10.04.07', 'H', 'Quan sát bản đồ các đới khí hậu trên Trái Đất.',
    ['Mỗi bán cầu có 7 đới khí hậu chính.', 'Việt Nam nằm hoàn toàn trong đới khí hậu ôn đới.', 'Kiểu khí hậu nhiệt đới gió mùa có lượng mưa lớn, tập trung vào mùa hạ.', 'Khí hậu ôn đới lục địa có mưa nhiều quanh năm do ảnh hưởng của biển.'],
    [true, false, true, false], ['E20', 'E20', 'E20', 'E20'], 'Việt Nam thuộc đới khí hậu nhiệt đới (gió mùa). Ôn đới lục địa nằm sâu trong lục địa nên mưa ít.', 4),
  TL('DL10.B10', 'DL10.04.07', 'V', 'Lượng mưa các tháng (mm) của một trạm: 18; 26; 44; 90; 188; 240; 288; 318; 265; 130; 43; 23. Tổng lượng mưa năm của trạm là bao nhiêu mm?', '1673', 0, 'mm', 'Cộng 12 tháng: 1 673 mm.'),
  TU('DL10.B10', 'DL10.04.07', 'B', 'Trình bày đặc điểm của kiểu khí hậu nhiệt đới gió mùa.',
    [['Nhiệt độ trung bình năm cao (trên 20 °C).', 0.25, ['nhiet do', 'cao', '20']], ['Lượng mưa lớn (khoảng 1 500 – 2 000 mm/năm).', 0.25, ['luong mua', 'lon', '1500', '2000', '1 500']], ['Mưa theo mùa, tập trung vào mùa hạ; có mùa khô (ít mưa).', 0.25, ['theo mua', 'mua ha', 'mua kho']], ['Phân bố ở Đông Nam Á, Nam Á (trong đó có Việt Nam).', 0.25, ['dong nam a', 'nam a', 'viet nam']]],
    'Nóng quanh năm, mưa lớn tập trung vào mùa hạ, có mùa khô; điển hình ở Đông Nam Á, Nam Á.'),

  // ===== Bài 11 – Thuỷ quyển, nước trên lục địa
  DS('DL10.B11', 'DL10.05.02', 'H', 'Đọc thông tin về chế độ nước sông và các loại hồ.',
    ['Chế độ nước sông phụ thuộc vào nguồn cấp nước như nước mưa, băng tuyết tan, nước ngầm.', 'Rừng ở thượng nguồn có tác dụng điều hoà dòng chảy, giảm lũ.', 'Hồ Tây (Hà Nội) là hồ hình thành từ khúc uốn cũ của sông Hồng.', 'Hồ Ba Bể là hồ nhân tạo.'],
    [true, true, true, false], ['E17', 'E17', 'E17', 'E17'], 'Hồ Ba Bể là hồ tự nhiên; hồ nhân tạo ở Việt Nam như hồ Hoà Bình, hồ Trị An.', 3),
  TL('DL10.B11', 'DL10.05.03', 'V', 'Một con sông có lưu lượng nước trung bình 268 m³/s. Tổng lượng nước chảy qua mặt cắt trong một năm (365 ngày) là bao nhiêu tỉ m³? (làm tròn đến một chữ số thập phân)', '8,5', 0.05, 'tỉ m³', '268 × 365 × 24 × 3 600 ≈ 8 451 648 000 m³ ≈ 8,5 tỉ m³.'),
  TU('DL10.B11', 'DL10.05.02', 'H', 'Phân tích các nhân tố ảnh hưởng tới chế độ nước sông.',
    [['Chế độ mưa, băng tuyết, nước ngầm (nguồn cấp nước).', 0.5, ['mua', 'bang tuyet', 'nuoc ngam']], ['Địa hình: độ dốc ảnh hưởng đến tốc độ dòng chảy.', 0.25, ['dia hinh', 'do doc', 'toc do']], ['Thực vật, hồ đầm: điều hoà dòng chảy.', 0.25, ['thuc vat', 'rung', 'ho dam', 'dieu hoa']]],
    'Nguồn cấp nước (mưa, băng tuyết, nước ngầm), địa hình, thực vật và hồ đầm.'),

  // ===== Bài 12 – Nước biển và đại dương
  DS('DL10.B12', 'DL10.05.08', 'H', 'Đọc thông tin về nước biển và đại dương.',
    ['Độ muối trung bình của nước biển và đại dương khoảng 35‰.', 'Thuỷ triều lớn nhất khi Mặt Trời, Mặt Trăng và Trái Đất nằm thẳng hàng.', 'Nguyên nhân chủ yếu tạo nên sóng biển là gió.', 'Dòng biển nóng làm cho khí hậu vùng ven bờ khô hạn, hình thành hoang mạc.'],
    [true, true, true, false], ['E18', 'E18', 'E18', 'E19'], 'Dòng biển lạnh (không phải nóng) làm khí hậu ven bờ khô, góp phần hình thành hoang mạc ven biển.', 3),
  TL('DL10.B12', 'DL10.05.07', 'B', 'Với độ muối trung bình 35‰, trong 1 tấn (1 000 kg) nước biển có bao nhiêu ki-lô-gam muối?', '35', 0, 'kg', '35‰ nghĩa là 35 phần nghìn: 1 000 × 35 / 1 000 = 35 kg.'),
  TL('DL10.B12', 'DL10.05.08', 'V', 'Tại một trạm, mực nước triều cao nhất trong ngày là 3,8 m, thấp nhất là 0,6 m. Biên độ triều trong ngày là bao nhiêu mét?', '3,2', 0.05, 'm', '3,8 − 0,6 = 3,2 m.'),
  TU('DL10.B12', 'DL10.05.08', 'H', 'Giải thích nguyên nhân sinh ra thuỷ triều. Khi nào có triều cường?',
    [['Thuỷ triều do sức hút của Mặt Trăng và Mặt Trời (kết hợp lực li tâm của Trái Đất).', 0.5, ['suc hut', 'mat trang', 'mat troi']], ['Triều cường khi Mặt Trời, Mặt Trăng, Trái Đất thẳng hàng (ngày không trăng, trăng tròn).', 0.5, ['thang hang', 'trang tron', 'khong trang', 'trieu cuong']]],
    'Do sức hút của Mặt Trăng, Mặt Trời. Triều cường khi ba thiên thể thẳng hàng (mùng 1, rằm âm lịch).'),

  // ===== Bài 14 – Đất
  DS('DL10.B14', 'DL10.06.02', 'H', 'Đọc thông tin về đất và các nhân tố hình thành đất.',
    ['Đất là lớp vật chất tơi xốp ở bề mặt lục địa, đặc trưng là độ phì.', 'Đá mẹ quyết định thành phần khoáng vật và thành phần cơ giới của đất.', 'Sinh vật không có vai trò trong quá trình hình thành đất.', 'Lớp vỏ phong hoá và đất là một.'],
    [true, true, false, false], ['E21', 'E22', 'E22', 'E21'], 'Sinh vật giữ vai trò chủ đạo (cung cấp chất hữu cơ, phân giải). Vỏ phong hoá gồm cả lớp đá vụn chưa thành đất.', 2),
  TU('DL10.B14', 'DL10.06.02', 'H', 'Trình bày vai trò của các nhân tố hình thành đất.',
    [['Đá mẹ: cung cấp vật chất vô cơ, quyết định thành phần khoáng, cơ giới.', 0.25, ['da me', 'khoang', 'co gioi']], ['Khí hậu: nhiệt, ẩm ảnh hưởng đến phong hoá, hoà tan, rửa trôi.', 0.25, ['khi hau', 'nhiet', 'am', 'phong hoa']], ['Sinh vật: cung cấp, phân giải chất hữu cơ – vai trò chủ đạo.', 0.25, ['sinh vat', 'huu co', 'chu dao']], ['Địa hình, thời gian, con người.', 0.25, ['dia hinh', 'thoi gian', 'con nguoi']]],
    'Đá mẹ, khí hậu, sinh vật (chủ đạo), địa hình, thời gian, con người.'),

  // ===== Bài 15 – Sinh quyển
  DS('DL10.B15', 'DL10.06.03', 'H', 'Đọc thông tin về sinh quyển và các nhân tố ảnh hưởng đến sinh vật.',
    ['Giới hạn phía trên của sinh quyển là nơi tiếp giáp tầng ô-dôn.', 'Ở đại dương, sinh quyển xuống tới đáy đại dương sâu nhất.', 'Khí hậu ảnh hưởng đến sinh vật qua nhiệt độ, nước, độ ẩm và ánh sáng.', 'Con người chỉ có tác động tiêu cực đến sự phân bố sinh vật.'],
    [true, true, true, false], ['E23', 'E23', 'E23', 'E23'], 'Con người có cả tác động tích cực (trồng rừng, di giống) và tiêu cực (phá rừng, săn bắt).', 3),
  TL('DL10.B15', 'DL10.06.03', 'V', 'Chân núi có nhiệt độ trung bình 24 °C. Rừng lá kim trên núi phát triển ở nơi nhiệt độ trung bình khoảng 9 °C. Với mức giảm 0,6 °C/100 m, độ cao của đai rừng lá kim so với chân núi khoảng bao nhiêu mét?', '2500', 0, 'm', '(24 − 9) / 0,6 × 100 = 2 500 m.', 3),
  TU('DL10.B15', 'DL10.06.03', 'H', 'Phân tích ảnh hưởng của khí hậu đến sự phát triển và phân bố của sinh vật.',
    [['Nhiệt độ: mỗi loài thích nghi giới hạn nhiệt nhất định.', 0.25, ['nhiet do', 'gioi han']], ['Nước và độ ẩm: nơi nhiều nước sinh vật phong phú, hoang mạc nghèo.', 0.25, ['nuoc', 'do am', 'hoang mac']], ['Ánh sáng: ảnh hưởng quang hợp, cây ưa sáng, ưa bóng.', 0.25, ['anh sang', 'quang hop']], ['Ví dụ minh hoạ phù hợp.', 0.25, ['vi du', 'rung', 'xuong rong', 'dong vat']]],
    'Khí hậu tác động qua nhiệt độ, nước – độ ẩm, ánh sáng; có ví dụ minh hoạ.'),

  // ===== Bài 18 – Quy luật địa đới, phi địa đới
  DS('DL10.B18', 'DL10.07.03', 'H', 'Đọc thông tin về các quy luật của vỏ địa lí.',
    ['Quy luật địa đới là sự thay đổi có quy luật của các thành phần địa lí theo vĩ độ.', 'Nguyên nhân của quy luật địa đới là dạng hình cầu của Trái Đất và bức xạ Mặt Trời.', 'Sự thay đổi các vành đai thực vật theo độ cao là biểu hiện của quy luật địa đới.', 'Sự thay đổi thảm thực vật từ đông sang tây theo kinh độ là biểu hiện của quy luật địa ô.'],
    [true, true, false, true], ['E24', 'E24', 'E24', 'E24'], 'Vành đai thực vật theo độ cao là quy luật đai cao (phi địa đới).', 3),
  TU('DL10.B18', 'DL10.07.03', 'V', 'Lấy ví dụ và giải thích một biểu hiện của quy luật đai cao.',
    [['Khái niệm: sự thay đổi có quy luật của các thành phần tự nhiên theo độ cao địa hình.', 0.25, ['do cao', 'quy luat', 'thay doi']], ['Nguyên nhân: nhiệt độ giảm, độ ẩm và lượng mưa thay đổi theo độ cao.', 0.5, ['nhiet do giam', 'do am', 'luong mua']], ['Ví dụ: các vành đai thực vật, đất thay đổi từ chân lên đỉnh núi.', 0.25, ['vanh dai', 'thuc vat', 'chan nui', 'dinh nui']]],
    'Đai cao – thành phần tự nhiên thay đổi theo độ cao do nhiệt độ, độ ẩm, mưa thay đổi; ví dụ vành đai thực vật trên núi.'),

  // ===== Bài 19 – Dân số
  DS('DL10.B19', 'DL10.08.02', 'H', 'Đọc thông tin về gia tăng và cơ cấu dân số.',
    ['Tỉ suất gia tăng dân số tự nhiên bằng tỉ suất sinh thô trừ tỉ suất tử thô.', 'Gia tăng dân số cơ học bằng số người xuất cư trừ số người nhập cư.', 'Tháp dân số mở rộng có đáy rộng, đỉnh nhọn, phản ánh dân số trẻ.', 'Gia tăng dân số thực tế bằng tổng gia tăng tự nhiên và gia tăng cơ học.'],
    [true, false, true, true], ['E25', 'E25', 'E25', 'E25'], 'Gia tăng cơ học = nhập cư − xuất cư.', 2),
  TL('DL10.B19', 'DL10.08.08', 'V', 'Một quốc gia có tỉ suất sinh thô 18‰ và tỉ suất tử thô 6‰. Tỉ suất gia tăng dân số tự nhiên là bao nhiêu %?', '1,2', 0.01, '%', '18 − 6 = 12‰ = 1,2%.'),
  TL('DL10.B19', 'DL10.08.08', 'V', 'Một nước có 49,6 triệu nam và 50,7 triệu nữ. Tỉ số giới tính (số nam trên 100 nữ) là bao nhiêu? (làm tròn đến một chữ số thập phân)', '97,8', 0.05, 'nam/100 nữ', '49,6 / 50,7 × 100 ≈ 97,8.'),
  TL('DL10.B19', 'DL10.08.08', 'V', 'Dân số một nước năm 2023 là 100,3 triệu người, tỉ lệ gia tăng 0,9%/năm và giữ nguyên. Dân số năm 2024 là bao nhiêu triệu người? (làm tròn đến một chữ số thập phân)', '101,2', 0.05, 'triệu người', '100,3 × 1,009 ≈ 101,2 triệu người.'),
  TU('DL10.B19', 'DL10.08.02', 'H', 'Phân tích các nhân tố tác động đến gia tăng dân số.',
    [['Tự nhiên – sinh học (cơ cấu tuổi, giới…).', 0.25, ['tu nhien', 'sinh hoc', 'co cau tuoi']], ['Trình độ phát triển kinh tế – xã hội, mức sống, y tế.', 0.25, ['kinh te', 'phat trien', 'muc song', 'y te']], ['Chính sách dân số.', 0.25, ['chinh sach']], ['Phong tục tập quán, tâm lí xã hội.', 0.25, ['phong tuc', 'tap quan', 'tam li']]],
    'Tự nhiên – sinh học; trình độ phát triển KT – XH; chính sách dân số; phong tục tập quán, tâm lí xã hội.'),

  // ===== Bài 20 – Phân bố dân cư, đô thị hoá
  DS('DL10.B20', 'DL10.08.05', 'H', 'Đọc thông tin về phân bố dân cư và đô thị hoá.',
    ['Đô thị hoá là quá trình tăng nhanh số dân thành thị, mở rộng lối sống thành thị.', 'Dân cư thế giới phân bố đồng đều giữa các châu lục.', 'Nhân tố quyết định sự phân bố dân cư là trình độ phát triển của lực lượng sản xuất.', 'Đô thị hoá tự phát luôn tác động tích cực đến môi trường.'],
    [true, false, true, false], ['E26', 'E26', 'E26', 'E26'], 'Dân cư phân bố không đều; đô thị hoá tự phát gây ô nhiễm, thiếu nhà ở, thất nghiệp.', 2),
  TL('DL10.B20', 'DL10.08.09', 'V', 'Một thành phố có 8,4 triệu dân, diện tích 3 359 km². Mật độ dân số của thành phố là bao nhiêu người/km²? (làm tròn đến hàng đơn vị)', '2501', 0.5, 'người/km²', '8 400 000 / 3 359 ≈ 2 501 người/km².'),
  TL('DL10.B20', 'DL10.08.05', 'V', 'Một nước có 100,3 triệu dân, trong đó 38,1 triệu người sống ở thành thị. Tỉ lệ dân thành thị là bao nhiêu %? (làm tròn đến một chữ số thập phân)', '38,0', 0.05, '%', '38,1 / 100,3 × 100 ≈ 38,0%.'),
  TU('DL10.B20', 'DL10.08.05', 'H', 'Phân tích ảnh hưởng của đô thị hoá đến kinh tế – xã hội và môi trường.',
    [['Tích cực: thúc đẩy tăng trưởng, chuyển dịch cơ cấu kinh tế, tạo việc làm, thay đổi phân bố dân cư, lối sống.', 0.5, ['tich cuc', 'chuyen dich', 'viec lam', 'tang truong']], ['Tiêu cực (đô thị hoá tự phát): thất nghiệp, thiếu nhà ở, ô nhiễm môi trường, ùn tắc giao thông.', 0.5, ['tieu cuc', 'that nghiep', 'nha o', 'o nhiem', 'un tac']]],
    'Tích cực: chuyển dịch cơ cấu kinh tế, việc làm, lối sống. Tiêu cực khi tự phát: thất nghiệp, nhà ở, ô nhiễm, ùn tắc.'),
  // ===== Bài 13 – Thực hành: chế độ nước sông Hồng
  DS('DL10.B13', 'DL10.05.03', 'V', 'Lưu lượng nước trung bình tháng của sông Hồng tại trạm Sơn Tây (m³/s): T1: 1 318; T2: 1 100; T3: 914; T4: 1 071; T5: 1 893; T6: 4 692; T7: 7 986; T8: 9 246; T9: 6 690; T10: 4 122; T11: 2 813; T12: 1 746.',
    ['Lưu lượng nước trung bình năm của sông Hồng tại Sơn Tây khoảng 3 633 m³/s.', 'Mùa lũ kéo dài 5 tháng, từ tháng 6 đến tháng 10.', 'Đỉnh lũ của sông Hồng vào tháng 10.', 'Sông Hồng được cấp nước chủ yếu bởi băng tuyết tan.'],
    [true, true, false, false], ['E27', 'E17', 'E17', 'E17'], 'Đỉnh lũ vào tháng 8 (9 246 m³/s). Sông Hồng được cấp nước chủ yếu bởi nước mưa.', 3),
  TL('DL10.B13', 'DL10.05.11', 'V', 'Lưu lượng trung bình tháng 8 của sông Hồng tại Sơn Tây là 9 246 m³/s. Lượng nước chảy qua trạm trong tháng 8 (31 ngày) là bao nhiêu tỉ m³? (làm tròn đến một chữ số thập phân)', '24,8', 0.05, 'tỉ m³', '9 246 × 31 × 86 400 ≈ 24 764 486 400 m³ ≈ 24,8 tỉ m³.', 5),
  TL('DL10.B13', 'DL10.05.11', 'V', 'Tổng lưu lượng trung bình 12 tháng của sông Hồng tại Sơn Tây là 43 591 m³/s. Lưu lượng nước trung bình năm là bao nhiêu m³/s? (làm tròn đến hàng đơn vị)', '3633', 0.5, 'm³/s', '43 591 : 12 ≈ 3 633 m³/s.', 2),
  TU('DL10.B13', 'DL10.05.03', 'V', 'Trình bày chế độ nước của sông Hồng và giải thích nguyên nhân.',
    [['Mùa lũ từ tháng 6 đến tháng 10, đỉnh lũ tháng 8.', 0.25, ['thang 6', 'thang 10', 'thang 8', 'mua lu']], ['Mùa cạn từ tháng 11 đến tháng 5, cạn nhất tháng 3.', 0.25, ['thang 11', 'thang 5', 'thang 3', 'mua can']],
     ['Giải thích: sông được cấp nước chủ yếu bởi nước mưa; khí hậu nhiệt đới gió mùa, mưa nhiều vào mùa hạ, ít mưa vào mùa đông.', 0.5, ['nuoc mua', 'gio mua', 'mua ha', 'mua dong']]],
    'Mùa lũ T6 – T10 (đỉnh T8), mùa cạn T11 – T5 (cạn nhất T3), do chế độ mưa mùa của khí hậu nhiệt đới gió mùa.'),

  // ===== Bài 16 – Thực hành: phân bố đất và sinh vật
  DS('DL10.B16', 'DL10.06.04', 'H', 'Quan sát bản đồ các kiểu thảm thực vật và nhóm đất chính trên thế giới.',
    ['Đất pốt-dôn phát triển chủ yếu dưới rừng lá kim.', 'Đất đen phân bố chủ yếu ở các thảo nguyên ôn đới.', 'Hoang mạc nhiệt đới có lớp đất dày, giàu mùn.', 'Ranh giới các đới đất gần trùng ranh giới các kiểu thảm thực vật vì cùng chịu tác động của khí hậu.'],
    [true, true, false, true], ['E32', 'E32', 'E32', 'E22'], 'Hoang mạc khô hạn, thực vật nghèo nên đất mỏng, nghèo mùn (đất xám hoang mạc).', 1),
  TU('DL10.B16', 'DL10.06.04', 'H', 'Vì sao các nhóm đất và các kiểu thảm thực vật trên thế giới phân bố thành từng đới tương ứng với nhau?',
    [['Khí hậu (nhiệt, ẩm) thay đổi theo vĩ độ, quyết định cả kiểu thảm thực vật và quá trình hình thành đất.', 0.5, ['khi hau', 'nhiet', 'am', 'vi do']], ['Sinh vật cung cấp chất hữu cơ cho đất; đất là nơi sinh trưởng của thực vật – hai thành phần quan hệ chặt chẽ.', 0.5, ['sinh vat', 'huu co', 'thuc vat', 'chat che']]],
    'Cùng chịu tác động của khí hậu thay đổi theo vĩ độ và có quan hệ qua lại (sinh vật ↔ đất) nên phân bố thành các đới tương ứng.'),

  // ===== Bài 17 – Vỏ địa lí, quy luật thống nhất và hoàn chỉnh
  DS('DL10.B17', 'DL10.07.01', 'H', 'Đọc thông tin về vỏ địa lí và vỏ Trái Đất.',
    ['Vỏ địa lí dày khoảng 30 – 35 km.', 'Ở đại dương, giới hạn dưới của vỏ địa lí là đáy vực thẳm.', 'Vỏ Trái Đất gồm cả khí quyển và thuỷ quyển.', 'Vỏ địa lí và vỏ Trái Đất có chiều dày như nhau.'],
    [true, true, false, false], ['E33', 'E33', 'E33', 'E33'], 'Vỏ Trái Đất chỉ gồm các tầng đá, dày 5 – 70 km; vỏ địa lí dày khoảng 30 – 35 km.', 2),
  DS('DL10.B17', 'DL10.07.02', 'V', 'Một vùng núi bị chặt phá rừng đầu nguồn trên diện rộng.',
    ['Đất ở sườn núi bị xói mòn, rửa trôi mạnh hơn.', 'Vào mùa mưa, lũ ở hạ lưu lên chậm hơn trước.', 'Vào mùa khô, sông suối dễ cạn kiệt hơn.', 'Sự thay đổi chỉ xảy ra với thành phần sinh vật.'],
    [true, false, true, false], ['E34', 'E34', 'E34', 'E34'], 'Mất rừng → nước chảy tràn nhanh nên lũ lên nhanh hơn; mọi thành phần đều thay đổi theo (quy luật thống nhất và hoàn chỉnh).', 5),
  TU('DL10.B17', 'DL10.07.02', 'V', 'Lấy ví dụ chứng minh quy luật thống nhất và hoàn chỉnh của vỏ địa lí và nêu ý nghĩa thực tiễn của quy luật.',
    [['Nêu đúng biểu hiện: một thành phần thay đổi kéo theo các thành phần khác thay đổi.', 0.25, ['thanh phan', 'thay doi', 'keo theo']], ['Ví dụ hợp lí, có chuỗi tác động (vd: phá rừng → đất xói mòn → lũ, cạn kiệt → khí hậu thay đổi).', 0.5, ['pha rung', 'xoi mon', 'lu', 'khi hau']], ['Ý nghĩa: cần nghiên cứu kĩ, toàn diện các thành phần trước khi khai thác, sử dụng tự nhiên.', 0.25, ['nghien cuu', 'toan dien', 'khai thac']]],
    'Một thành phần thay đổi kéo theo các thành phần khác; ví dụ phá rừng đầu nguồn; cần nghiên cứu toàn diện trước khi khai thác.'),
];
// mã câu: <mục tiêu>-DS01 / -TL01 / -TU01
const PRE = { ds: 'DS', tln: 'TL', tlu: 'TU' };
EXTRA.forEach((q, i) => { const n = EXTRA.slice(0, i).filter(x => x.o === q.o && x.t === q.t).length + 1; q.id = `${q.o}-${PRE[q.t]}${String(n).padStart(2, '0')}`; });

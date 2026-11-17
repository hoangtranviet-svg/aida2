// Khung chương trình Địa lí 11 và 12 – SGK Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)
// Mỗi bài là một mô-đun. Học liệu: 'deck' = bài giảng slide trên web, 'lab' = mô hình 3D; chưa có thì để trống.
// tt17: ghi chú điều chỉnh theo Thông tư 17/2025/TT-BGDĐT (sửa đổi CT GDPT 2018) – cần đối chiếu văn bản gốc.

export const GRADES = {
  10: { name: 'Lớp 10', sub: 'Địa lí đại cương' },
  11: { name: 'Lớp 11', sub: 'Địa lí kinh tế – xã hội thế giới' },
  12: { name: 'Lớp 12', sub: 'Địa lí Việt Nam' },
};

const P11A = 'Phần một – Một số vấn đề về kinh tế – xã hội thế giới';
const R = r => 'Phần hai – ' + r;
const L11 = [
  [1, 'Sự khác biệt về trình độ phát triển kinh tế – xã hội của các nhóm nước', P11A],
  [2, 'Toàn cầu hoá và khu vực hoá kinh tế', P11A],
  [3, 'Thực hành: Tìm hiểu về cơ hội và thách thức của toàn cầu hoá, khu vực hoá kinh tế', P11A],
  [4, 'Một số tổ chức quốc tế và khu vực, an ninh toàn cầu', P11A],
  [5, 'Thực hành: Viết báo cáo về đặc điểm và biểu hiện của nền kinh tế tri thức', P11A],
  [6, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Mỹ La-tinh', R('Khu vực Mỹ La-tinh')],
  [7, 'Kinh tế khu vực Mỹ La-tinh', R('Khu vực Mỹ La-tinh')],
  [8, 'Thực hành: Viết báo cáo về tình hình phát triển kinh tế – xã hội ở Cộng hoà Liên bang Bra-xin', R('Khu vực Mỹ La-tinh')],
  [9, 'Liên minh châu Âu – một liên kết kinh tế khu vực lớn', R('Liên minh châu Âu (EU)')],
  [10, 'Thực hành: Viết báo cáo về sự phát triển công nghiệp của Cộng hoà Liên bang Đức', R('Liên minh châu Âu (EU)')],
  [11, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Đông Nam Á', R('Khu vực Đông Nam Á'), { deck: '11-11' }],
  [12, 'Kinh tế khu vực Đông Nam Á', R('Khu vực Đông Nam Á')],
  [13, 'Hiệp hội các quốc gia Đông Nam Á (ASEAN)', R('Khu vực Đông Nam Á')],
  [14, 'Thực hành: Tìm hiểu hoạt động kinh tế đối ngoại của khu vực Đông Nam Á', R('Khu vực Đông Nam Á')],
  [15, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội khu vực Tây Nam Á', R('Khu vực Tây Nam Á')],
  [16, 'Kinh tế khu vực Tây Nam Á', R('Khu vực Tây Nam Á')],
  [17, 'Thực hành: Viết báo cáo về vấn đề dầu mỏ của khu vực Tây Nam Á', R('Khu vực Tây Nam Á')],
  [18, 'Vị trí địa lí, điều kiện tự nhiên và dân cư Hoa Kỳ', R('Hợp chủng quốc Hoa Kỳ')],
  [19, 'Kinh tế Hoa Kỳ', R('Hợp chủng quốc Hoa Kỳ')],
  [20, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Liên bang Nga', R('Liên bang Nga')],
  [21, 'Kinh tế Liên bang Nga', R('Liên bang Nga')],
  [22, 'Thực hành: Tìm hiểu về công nghiệp khai thác của Liên bang Nga', R('Liên bang Nga')],
  [23, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Nhật Bản', R('Nhật Bản')],
  [24, 'Kinh tế Nhật Bản', R('Nhật Bản')],
  [25, 'Thực hành: Viết báo cáo về hoạt động kinh tế đối ngoại của Nhật Bản', R('Nhật Bản')],
  [26, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Trung Quốc', R('Cộng hoà Nhân dân Trung Hoa')],
  [27, 'Kinh tế Trung Quốc', R('Cộng hoà Nhân dân Trung Hoa')],
  [28, 'Thực hành: Viết báo cáo về sự thay đổi của kinh tế vùng duyên hải Trung Quốc', R('Cộng hoà Nhân dân Trung Hoa')],
  [29, 'Thực hành: Tìm hiểu về kinh tế Ô-xtrây-li-a', R('Ô-xtrây-li-a')],
  [30, 'Vị trí địa lí, điều kiện tự nhiên, dân cư và xã hội Cộng hoà Nam Phi', R('Cộng hoà Nam Phi')],
  [31, 'Kinh tế Cộng hoà Nam Phi', R('Cộng hoà Nam Phi')],
];

const P1 = 'Phần 1 – Địa lí tự nhiên', P2 = 'Phần 2 – Địa lí dân cư', P3 = 'Phần 3 – Địa lí các ngành kinh tế', P4 = 'Phần 4 – Địa lí các vùng kinh tế', P5 = 'Phần 5 – Địa lí địa phương';
const T17 = s => ({ tt17: s });
const L12 = [
  [1, 'Vị trí địa lí và phạm vi lãnh thổ', P1, T17('Bổ sung yêu cầu xác định vị trí các tỉnh, thành phố trên bản đồ (theo đơn vị hành chính mới).')],
  [2, 'Thiên nhiên nhiệt đới ẩm gió mùa', P1],
  [3, 'Sự phân hoá đa dạng của thiên nhiên', P1],
  [4, 'Thực hành: Viết báo cáo về sự phân hoá tự nhiên Việt Nam', P1],
  [5, 'Vấn đề sử dụng hợp lí tài nguyên thiên nhiên và bảo vệ môi trường', P1],
  [6, 'Dân số Việt Nam', P2],
  [7, 'Lao động và việc làm', P2, T17('Lược bớt yêu cầu phân tích sử dụng lao động theo thành thị – nông thôn.')],
  [8, 'Đô thị hoá', P2, T17('Lược bớt yêu cầu về phân bố mạng lưới đô thị.')],
  [9, 'Thực hành: Viết báo cáo về một chủ đề dân cư ở Việt Nam', P2],
  [10, 'Chuyển dịch cơ cấu kinh tế', P3, T17('Nội dung được lược bỏ khỏi chương trình.')],
  [11, 'Vấn đề phát triển ngành nông nghiệp', P3],
  [12, 'Vấn đề phát triển ngành lâm nghiệp và ngành thuỷ sản', P3],
  [13, 'Tổ chức lãnh thổ nông nghiệp', P3, T17('Thay “vùng nông nghiệp” bằng khu nông nghiệp ứng dụng công nghệ cao.')],
  [14, 'Thực hành: Tìm hiểu vai trò ngành nông nghiệp, lâm nghiệp và thuỷ sản; vẽ biểu đồ và nhận xét', P3],
  [15, 'Chuyển dịch cơ cấu ngành công nghiệp', P3],
  [16, 'Một số ngành công nghiệp', P3],
  [17, 'Tổ chức lãnh thổ công nghiệp', P3, T17('Bỏ “trung tâm công nghiệp” khỏi yêu cầu.')],
  [18, 'Thực hành: Vẽ biểu đồ, nhận xét và giải thích tình hình phát triển ngành công nghiệp', P3],
  [19, 'Vai trò, các nhân tố ảnh hưởng đến sự phát triển và phân bố các ngành dịch vụ', P3],
  [20, 'Giao thông vận tải và bưu chính viễn thông', P3],
  [21, 'Thương mại và du lịch', P3, T17('Du lịch: dùng “điểm du lịch, khu du lịch” thay cho “trung tâm, vùng du lịch”.')],
  [22, 'Thực hành: Tìm hiểu sự phát triển một số ngành dịch vụ', P3],
  [23, 'Khai thác thế mạnh ở Trung du và miền núi Bắc Bộ', P4, T17('Bỏ nội dung kinh tế biển trong các thế mạnh của vùng.')],
  [24, 'Phát triển kinh tế – xã hội ở Đồng bằng sông Hồng', P4, T17('Yêu cầu chung về phát triển và phân bố kinh tế – xã hội của vùng.')],
  [25, 'Phát triển nông nghiệp, lâm nghiệp và thuỷ sản ở Bắc Trung Bộ', P4],
  [26, 'Phát triển kinh tế biển ở Duyên hải Nam Trung Bộ', P4, T17('Duyên hải Nam Trung Bộ và Tây Nguyên được gộp thành vùng Nam Trung Bộ.')],
  [27, 'Thực hành: Tìm hiểu và viết báo cáo về ý nghĩa của phát triển kinh tế biển đối với quốc phòng an ninh ở Duyên hải Nam Trung Bộ', P4],
  [28, 'Khai thác thế mạnh để phát triển kinh tế ở Tây Nguyên', P4, T17('Duyên hải Nam Trung Bộ và Tây Nguyên được gộp thành vùng Nam Trung Bộ.')],
  [29, 'Phát triển kinh tế – xã hội ở Đông Nam Bộ', P4, T17('Bổ sung kinh tế biển, bỏ yêu cầu về lâm nghiệp.')],
  [30, 'Sử dụng hợp lí tự nhiên để phát triển kinh tế ở Đồng bằng sông Cửu Long', P4],
  [31, 'Thực hành: Viết báo cáo về biến đổi khí hậu ở Đồng bằng sông Cửu Long', P4],
  [32, 'Phát triển các vùng kinh tế trọng điểm', P4, T17('Nội dung được lược bỏ khỏi chương trình.')],
  [33, 'Phát triển kinh tế và đảm bảo quốc phòng an ninh ở Biển Đông và các đảo, quần đảo', P4],
  [34, 'Thực hành: Viết báo cáo tuyên truyền về bảo vệ chủ quyền biển, đảo của Việt Nam', P4],
  [35, 'Thực hành: Tìm hiểu địa lí địa phương', P5, T17('Tìm hiểu theo đơn vị hành chính cấp tỉnh.')],
];

const build = (g, L) => L.map(([n, title, chap, x = {}]) => ({ code: `DL${g}.B${String(n).padStart(2, '0')}`, grade: g, bai: `Bài ${n}`, title, chap, lab: null, deck: null, ...x }));
export const MODULES_11 = build(11, L11);
export const MODULES_12 = build(12, L12);

// Yêu cầu cần đạt (CT GDPT 2018) – đang mã hoá dần theo từng bài khi có học liệu
export const OBJ_11_12 = {
  'DL11.11.01': 'Phân tích được ảnh hưởng của vị trí địa lí, điều kiện tự nhiên và tài nguyên thiên nhiên đến phát triển kinh tế – xã hội của khu vực Đông Nam Á.',
  'DL11.11.02': 'Phân tích được tác động của các đặc điểm dân cư, xã hội tới phát triển kinh tế – xã hội của khu vực Đông Nam Á.',
  'DL11.11.03': 'Sử dụng được bản đồ để xác định vị trí, phạm vi lãnh thổ và các quốc gia của khu vực Đông Nam Á.',
};

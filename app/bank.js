// Ngân hàng câu hỏi AIDA 2.0 – Địa lí 10 (KNTT). Mỗi phương án sai gắn một mã lỗi sai thường gặp.
// q: câu hỏi · a: phương án · k: chỉ số đáp án đúng · e: mã lỗi cho từng phương án (null = đúng) · x: giải thích · s: bước 3D nên xem lại

export const ERR = {
  E01: ['Nhầm vị trí, đặc điểm các tầng khí quyển', 'DL10.B09', 2],
  E02: ['Đảo ngược áp cao ↔ áp thấp, chiều gió', 'DL10.B09', 4],
  E03: ['Nhầm nguyên nhân nhiệt lực với động lực', 'DL10.B09', 4],
  E04: ['Hiểu sai vai trò của chuyển động tự quay (lệch hướng)', 'DL10.B05', 6],
  E05: ['Nhầm hướng, phạm vi, tính chất các loại gió', 'DL10.B09', 5],
  E06: ['Nhầm hệ quả của tự quay với hệ quả của chuyển động quanh Mặt Trời', 'DL10.B05', 4],
  E07: ['Nhầm các ngày hạ chí, đông chí, xuân phân, thu phân', 'DL10.B05', 1],
  E08: ['Tính giờ theo múi giờ sai chiều', 'DL10.B05', 5],
  E09: ['Nhầm thạch quyển với vỏ Trái Đất', 'DL10.B06', 1],
  E10: ['Nhầm các kiểu tiếp xúc giữa các mảng kiến tạo', 'DL10.B06', 3],
  E11: ['Nhầm nội lực với ngoại lực', 'DL10.B07', 1],
  E12: ['Nhầm địa luỹ với địa hào', 'DL10.B07', 3],
  E13: ['Nhầm cấu tạo, nguồn gốc Trái Đất', 'DL10.B04', 2],
  E14: ['Nhầm cấu tạo vỏ Trái Đất, các loại đá', 'DL10.B04', 3],
  E15: ['Nhầm các phương pháp biểu hiện trên bản đồ', 'DL10.B02', 2],
  E16: ['Hiểu sai nguyên lí, ứng dụng của GPS', 'DL10.B03', 2],
  E17: ['Nhầm thành phần thuỷ quyển, nguồn cấp nước sông', 'DL10.B11', 3],
  E18: ['Nhầm nguyên nhân sóng, thuỷ triều; triều cường – triều kém', 'DL10.B12', 3],
  E19: ['Nhầm dòng biển nóng – lạnh và tác động', 'DL10.B12', 4],
  E20: ['Nhầm đặc điểm các đới, kiểu khí hậu', 'DL10.B10', 4],
  E21: ['Nhầm các tầng đất; đất với vỏ phong hoá', 'DL10.B14', 2],
  E22: ['Nhầm vai trò các nhân tố hình thành đất', 'DL10.B14', 4],
  E23: ['Nhầm thứ tự, nguyên nhân các vành đai thực vật', 'DL10.B15', 3],
  E24: ['Nhầm quy luật địa đới với phi địa đới', 'DL10.B18', 3],
  E25: ['Nhầm các kiểu tháp, cơ cấu dân số', 'DL10.B19', 2],
  E26: ['Nhầm nhân tố phân bố dân cư, khái niệm đô thị hoá', 'DL10.B20', 2],
  E27: ['Đọc, tính toán số liệu chưa chính xác', null, null],
  E28: ['Nhầm sự phân bố các vành đai động đất, núi lửa', 'DL10.B08', 2],
  E30: ['Nhầm sự phân bố mưa và nhân tố ảnh hưởng', 'DL10.B09', 9],
  E31: ['Nhầm sự phân bố nhiệt độ không khí', 'DL10.B09', 3],
};

const Q = (m, o, q, a, k, e, x, s) => ({ m, o, q, a, k, e, x, s });
export const BANK = [
  // Bài 2
  Q('DL10.B02', 'DL10.01.01', 'Để thể hiện các nhà máy thuỷ điện trên bản đồ, người ta thường dùng phương pháp nào?', ['Kí hiệu', 'Chấm điểm', 'Khoanh vùng', 'Bản đồ – biểu đồ'], 0, [null, 'E15', 'E15', 'E15'], 'Nhà máy là đối tượng phân bố theo điểm cụ thể → dùng phương pháp kí hiệu đặt đúng vị trí.', 2),
  Q('DL10.B02', 'DL10.01.01', 'Phương pháp kí hiệu đường chuyển động thường dùng để thể hiện', ['hướng gió, đường đi của bão', 'sự phân bố dân cư', 'vùng trồng lúa', 'vị trí sân bay'], 0, [null, 'E15', 'E15', 'E15'], 'Mũi tên thể hiện sự di chuyển: hướng, tốc độ, khối lượng của đối tượng.', 3),
  Q('DL10.B02', 'DL10.01.01', 'Bản đồ dùng các chấm, mỗi chấm ứng với 200 000 người. Đây là phương pháp', ['khoanh vùng', 'chấm điểm', 'kí hiệu', 'bản đồ – biểu đồ'], 1, ['E15', null, 'E15', 'E15'], 'Phương pháp chấm điểm thể hiện đối tượng phân bố phân tán, lẻ tẻ; mỗi chấm có giá trị như nhau.', 4),
  Q('DL10.B02', 'DL10.01.01', 'Để thể hiện dân số từng vùng bằng các cột đặt trong mỗi vùng, người ta dùng phương pháp', ['bản đồ – biểu đồ', 'khoanh vùng', 'kí hiệu', 'đường chuyển động'], 0, [null, 'E15', 'E15', 'E15'], 'Biểu đồ đặt trong đơn vị lãnh thổ thể hiện giá trị tổng cộng của đối tượng ở đơn vị đó.', 6),
  Q('DL10.B02', 'DL10.01.02', 'Toạ độ địa lí gần đúng của Hà Nội là', ['21°B, 105°Đ', '105°B, 21°Đ', '16°B, 108°Đ', '10°B, 106°Đ'], 0, [null, 'E27', 'E27', 'E27'], 'Toạ độ ghi vĩ độ trước, kinh độ sau. 16°B, 108°Đ là Đà Nẵng; 10°B, 106°Đ là TP Hồ Chí Minh.', 1),
  // Bài 3
  Q('DL10.B03', 'DL10.01.03', 'Các vệ tinh GPS bay quanh Trái Đất ở độ cao khoảng', ['400 km', '20 200 km', '36 000 km', '384 000 km'], 1, ['E16', null, 'E16', 'E16'], '400 km là độ cao Trạm Vũ trụ Quốc tế; 36 000 km là quỹ đạo địa tĩnh; 384 000 km là khoảng cách tới Mặt Trăng.', 1),
  Q('DL10.B03', 'DL10.01.03', 'Để xác định chính xác một vị trí, máy thu GPS cần tín hiệu từ ít nhất', ['1 vệ tinh', '2 vệ tinh', '3 vệ tinh', '4 vệ tinh'], 3, ['E16', 'E16', 'E16', null], '3 vệ tinh cho 2 điểm; vệ tinh thứ 4 giúp xác định 1 điểm duy nhất và hiệu chỉnh sai số đồng hồ.', 2),
  Q('DL10.B03', 'DL10.01.03', 'Máy thu GPS tính khoảng cách tới vệ tinh dựa vào', ['thời gian tín hiệu truyền từ vệ tinh tới máy thu', 'độ sáng của vệ tinh', 'ảnh chụp từ vệ tinh', 'từ trường Trái Đất'], 0, [null, 'E16', 'E16', 'E16'], 'Khoảng cách = tốc độ tín hiệu × thời gian truyền.', 2),
  Q('DL10.B03', 'DL10.01.02', 'Hoạt động nào sau đây KHÔNG cần dùng đến GPS và bản đồ số?', ['Gọi xe công nghệ', 'Tìm đường đi ngắn nhất', 'Theo dõi đường đi của bão', 'Đo nhiệt độ không khí bằng nhiệt kế'], 3, ['E16', 'E16', 'E16', null], 'Đo nhiệt độ bằng nhiệt kế không cần định vị.', 3),
  // Bài 4
  Q('DL10.B04', 'DL10.02.01', 'Lớp nào của Trái Đất có vật chất ở trạng thái lỏng?', ['Vỏ Trái Đất', 'Man-ti dưới', 'Nhân ngoài', 'Nhân trong'], 2, ['E13', 'E13', null, 'E13'], 'Nhân ngoài (2 900 – 5 100 km) ở trạng thái lỏng; nhân trong rắn do áp suất rất lớn.', 2),
  Q('DL10.B04', 'DL10.02.01', 'Vỏ đại dương khác vỏ lục địa ở chỗ vỏ đại dương', ['không có tầng granit', 'không có tầng badan', 'dày hơn', 'không có tầng trầm tích'], 0, [null, 'E14', 'E14', 'E14'], 'Vỏ đại dương mỏng (5 – 10 km), chỉ có trầm tích và badan; tầng granit chỉ có ở vỏ lục địa.', 3),
  Q('DL10.B04', 'DL10.02.01', 'Độ dày của vỏ Trái Đất khoảng', ['5 km ở đại dương đến 70 km ở lục địa', 'khoảng 100 km', 'khoảng 2 900 km', '700 – 2 900 km'], 0, [null, 'E13', 'E13', 'E13'], '100 km là độ dày thạch quyển; 2 900 km là ranh giới man-ti – nhân.', 2),
  Q('DL10.B04', 'DL10.02.01', 'Theo giả thuyết phổ biến, Trái Đất hình thành cách đây khoảng', ['4,6 tỉ năm', '46 triệu năm', '4,6 triệu năm', '460 tỉ năm'], 0, [null, 'E13', 'E13', 'E13'], 'Trái Đất và hệ Mặt Trời hình thành từ tinh vân Mặt Trời khoảng 4,6 tỉ năm trước.', 1),
  Q('DL10.B04', 'DL10.02.01', 'Đá granit thuộc nhóm đá nào?', ['Đá mác-ma', 'Đá trầm tích', 'Đá biến chất', 'Không phải đá'], 0, [null, 'E14', 'E14', 'E14'], 'Granit hình thành do mác-ma nguội đặc lại → đá mác-ma.', 4),
  // Bài 5
  Q('DL10.B05', 'DL10.02.02', 'Hiện tượng nào là hệ quả của chuyển động tự quay quanh trục?', ['Ngày đêm luân phiên', 'Các mùa trong năm', 'Ngày đêm dài ngắn theo mùa', 'Mặt Trời lên thiên đỉnh ở chí tuyến'], 0, [null, 'E06', 'E06', 'E06'], 'Các mùa, ngày đêm dài ngắn theo mùa là hệ quả chuyển động quanh Mặt Trời.', 4),
  Q('DL10.B05', 'DL10.02.02', 'Vào ngày 22 – 6, ở bán cầu Bắc có', ['ngày dài nhất, đêm ngắn nhất', 'ngày ngắn nhất, đêm dài nhất', 'ngày dài bằng đêm', 'đêm dài 24 giờ ở vòng cực Bắc'], 0, [null, 'E07', 'E07', 'E07'], 'Ngày hạ chí, bán cầu Bắc ngả về phía Mặt Trời nhiều nhất.', 3),
  Q('DL10.B05', 'DL10.02.03', 'Khi ở Luân Đôn (múi giờ 0) là 12 giờ thì ở Hà Nội (múi giờ 7) là', ['19 giờ', '5 giờ', '7 giờ', '12 giờ'], 0, [null, 'E08', 'E08', 'E08'], 'Hà Nội ở phía đông, sớm hơn 7 giờ: 12 + 7 = 19 giờ.', 5),
  Q('DL10.B05', 'DL10.02.02', 'Ngày và đêm dài bằng nhau ở mọi nơi trên Trái Đất vào các ngày', ['21 – 3 và 23 – 9', '22 – 6 và 22 – 12', '1 – 1 và 1 – 7', '22 – 6 và 23 – 9'], 0, [null, 'E07', 'E07', 'E07'], 'Xuân phân và thu phân: Mặt Trời lên thiên đỉnh ở Xích đạo.', 1),
  Q('DL10.B05', 'DL10.02.04', 'Ở bán cầu Bắc, các vật chuyển động theo chiều kinh tuyến bị lệch', ['sang phải', 'sang trái', 'không bị lệch', 'lên cao'], 0, [null, 'E04', 'E04', 'E04'], 'Do Trái Đất tự quay: lệch phải ở bán cầu Bắc, lệch trái ở bán cầu Nam (theo hướng chuyển động).', 6),
  // Bài 6
  Q('DL10.B06', 'DL10.03.01', 'Thạch quyển gồm', ['vỏ Trái Đất và phần trên của lớp man-ti', 'chỉ vỏ Trái Đất', 'man-ti và nhân', 'vỏ lục địa và vỏ đại dương'], 0, [null, 'E09', 'E09', 'E09'], 'Thạch quyển dày khoảng 100 km, gồm vỏ Trái Đất và phần trên cùng của man-ti.', 1),
  Q('DL10.B06', 'DL10.03.02', 'Dãy Hi-ma-lay-a được hình thành do', ['mảng Ấn Độ – Ô-xtrây-li-a xô vào mảng Âu – Á', 'hai mảng tách xa nhau', 'mảng Thái Bình Dương bị hút chìm', 'ngoại lực bồi tụ'], 0, [null, 'E10', 'E10', 'E11'], 'Hai mảng lục địa va chạm → vỏ bị dồn ép, nhô cao thành núi.', 5),
  Q('DL10.B06', 'DL10.03.02', 'Ở nơi hai mảng đại dương tách xa nhau thường hình thành', ['sống núi giữa đại dương', 'vực biển sâu', 'dãy núi uốn nếp trên lục địa', 'đồng bằng châu thổ'], 0, [null, 'E10', 'E10', 'E11'], 'Mác-ma trào lên ở chỗ tách giãn tạo sống núi và lớp vỏ mới.', 3),
  Q('DL10.B06', 'DL10.03.02', 'Khi mảng đại dương xô vào mảng lục địa, mảng đại dương', ['bị hút chìm xuống dưới', 'trồi lên trên mảng lục địa', 'trượt ngang qua nhau', 'tách đôi'], 0, [null, 'E10', 'E10', 'E10'], 'Mảng đại dương nặng hơn nên bị hút chìm, tạo vực biển sâu.', 4),
  // Bài 7
  Q('DL10.B07', 'DL10.03.03', 'Nguyên nhân chủ yếu sinh ra ngoại lực là', ['năng lượng bức xạ Mặt Trời', 'sự phân huỷ chất phóng xạ trong lòng Trái Đất', 'sự dịch chuyển vật chất trong man-ti', 'phản ứng hoá học trong nhân Trái Đất'], 0, [null, 'E11', 'E11', 'E11'], 'Ba phương án còn lại là nguồn năng lượng của nội lực.', 4),
  Q('DL10.B07', 'DL10.03.03', 'Hiện tượng uốn nếp xảy ra khi', ['các lớp đá có độ dẻo cao bị nén ép theo phương nằm ngang', 'đá cứng bị kéo căng và gãy vỡ', 'nước chảy xâm thực', 'gió thổi mòn đá'], 0, [null, 'E12', 'E11', 'E11'], 'Đá dẻo bị nén ép → uốn cong mà không mất tính liên tục.', 2),
  Q('DL10.B07', 'DL10.03.04', 'Thung lũng sông Hồng là một ví dụ về', ['địa hào', 'địa luỹ', 'nếp uốn', 'núi lửa'], 0, [null, 'E12', 'E12', 'E11'], 'Bộ phận sụt xuống giữa các đứt gãy gọi là địa hào.', 3),
  Q('DL10.B07', 'DL10.03.03', 'Thứ tự đúng của các quá trình ngoại lực là', ['phong hoá → bóc mòn → vận chuyển → bồi tụ', 'bồi tụ → vận chuyển → bóc mòn → phong hoá', 'bóc mòn → phong hoá → bồi tụ → vận chuyển', 'vận chuyển → phong hoá → bóc mòn → bồi tụ'], 0, [null, 'E11', 'E11', 'E11'], 'Đá bị phá huỷ trước, sau đó sản phẩm bị dời đi, được mang đi và tích tụ ở nơi thấp.', 5),
  // Bài 8
  Q('DL10.B08', 'DL10.03.05', 'Vành đai động đất, núi lửa lớn nhất thế giới là', ['Vành đai lửa Thái Bình Dương', 'Vành đai Địa Trung Hải – Hi-ma-lay-a', 'Sống núi giữa Đại Tây Dương', 'Thung lũng Đông Phi'], 0, [null, 'E28', 'E28', 'E28'], 'Vành đai quanh Thái Bình Dương tập trung khoảng 3/4 số núi lửa đang hoạt động.', 2),
  Q('DL10.B08', 'DL10.03.05', 'Động đất, núi lửa trên Trái Đất thường phân bố', ['thành dải dọc ranh giới các mảng kiến tạo', 'đều khắp bề mặt Trái Đất', 'chủ yếu ở giữa các mảng', 'chỉ ở vùng cực'], 0, [null, 'E28', 'E28', 'E28'], 'Ranh giới mảng là nơi vỏ Trái Đất không ổn định.', 1),
  Q('DL10.B08', 'DL10.03.02', 'Núi lửa ở Ai-xơ-len liên quan tới', ['hai mảng tách giãn (sống núi giữa Đại Tây Dương)', 'mảng đại dương hút chìm', 'hai mảng lục địa va chạm', 'hai mảng trượt ngang'], 0, [null, 'E10', 'E10', 'E10'], 'Ai-xơ-len nằm trên sống núi giữa Đại Tây Dương – nơi mảng Bắc Mỹ và Âu – Á tách xa.', 4),
  Q('DL10.B08', 'DL10.03.05', 'Nhật Bản thường xuyên có động đất vì', ['nằm ở nơi các mảng xô vào nhau, có hút chìm', 'nằm ở giữa một mảng lớn', 'nằm gần Xích đạo', 'có nhiều sông ngắn và dốc'], 0, [null, 'E28', 'E28', 'E28'], 'Nhật Bản thuộc Vành đai lửa Thái Bình Dương.', 2),
  // Bài 9
  Q('DL10.B09', 'DL10.04.01', 'Tầng khí quyển nào tập trung khoảng 80% khối lượng không khí và gần như toàn bộ hơi nước?', ['Tầng bình lưu', 'Tầng đối lưu', 'Tầng giữa', 'Tầng nhiệt'], 1, ['E01', null, 'E01', 'E01'], 'Tầng đối lưu sát mặt đất – nơi diễn ra mây, mưa, gió, bão.', 2),
  Q('DL10.B09', 'DL10.04.01', 'Lớp ô-dôn nằm ở tầng nào của khí quyển?', ['Tầng đối lưu', 'Tầng bình lưu', 'Tầng giữa', 'Tầng nhiệt'], 1, ['E01', null, 'E01', 'E01'], 'Lớp ô-dôn ở độ cao 20 – 25 km, thuộc tầng bình lưu.', 2),
  Q('DL10.B09', 'DL10.04.03', 'Đai áp thấp xích đạo được hình thành chủ yếu do', ['không khí lạnh, co lại và chìm xuống', 'không khí nóng, nở ra và bốc lên cao', 'không khí từ cực di chuyển tới', 'Trái Đất tự quay'], 1, ['E02', null, 'E03', 'E04'], 'Nhiệt độ cao quanh năm → không khí nở ra, bốc lên → khí áp thấp (nguyên nhân nhiệt lực).', 4),
  Q('DL10.B09', 'DL10.04.03', 'Đai áp cao cận chí tuyến hình thành do nguyên nhân', ['động lực', 'nhiệt lực', 'Trái Đất tự quay', 'địa hình'], 0, [null, 'E03', 'E04', 'E03'], 'Không khí từ Xích đạo lên cao, di chuyển về chí tuyến rồi giáng xuống → khí áp tăng (động lực).', 4),
  Q('DL10.B09', 'DL10.04.04', 'Gió Mậu dịch thổi từ', ['áp cao cận chí tuyến về áp thấp xích đạo', 'áp cao cận chí tuyến về áp thấp ôn đới', 'áp cao cực về áp thấp ôn đới', 'áp thấp xích đạo về áp cao cận chí tuyến'], 0, [null, 'E05', 'E05', 'E02'], 'Gió luôn thổi từ nơi áp cao về nơi áp thấp.', 5),
  Q('DL10.B09', 'DL10.04.04', 'Ở bán cầu Bắc, gió Tây ôn đới có hướng chủ yếu là', ['tây nam', 'đông bắc', 'tây bắc', 'đông nam'], 0, [null, 'E05', 'E05', 'E05'], 'Tây nam ở bán cầu Bắc, tây bắc ở bán cầu Nam.', 5),
  Q('DL10.B09', 'DL10.04.08', 'Khi vượt núi sang sườn khuất gió, gió phơn có tính chất', ['khô và nóng', 'ẩm và mát', 'lạnh và khô', 'nóng, ẩm, gây mưa'], 0, [null, 'E05', 'E05', 'E05'], 'Không khí đã mất hơi nước ở sườn đón gió, khi xuống nóng lên khoảng 1 °C/100 m.', 8),
  Q('DL10.B09', 'DL10.04.05', 'Khu vực có lượng mưa nhiều nhất trên Trái Đất là', ['Xích đạo', 'chí tuyến', 'ôn đới', 'cực'], 0, [null, 'E30', 'E30', 'E30'], 'Áp thấp, không khí bốc lên mạnh, nhiều đại dương và rừng.', 9),
  Q('DL10.B09', 'DL10.04.02', 'Từ Xích đạo về cực, nhiệt độ trung bình năm', ['giảm dần', 'tăng dần', 'không thay đổi', 'tăng rồi giảm'], 0, [null, 'E31', 'E31', 'E31'], 'Góc chiếu của tia sáng Mặt Trời giảm dần về phía cực.', 3),
  Q('DL10.B09', 'DL10.04.04', 'Ban ngày, ở vùng ven biển gió thổi', ['từ biển vào đất liền', 'từ đất liền ra biển', 'song song với bờ biển', 'từ núi xuống đồng bằng'], 0, [null, 'E02', 'E05', 'E05'], 'Ban ngày đất nóng nhanh hơn → áp thấp trên đất → gió biển thổi vào.', 7),
  // Bài 10
  Q('DL10.B10', 'DL10.04.07', 'Phần lớn lãnh thổ Việt Nam thuộc đới khí hậu nào?', ['Nhiệt đới', 'Ôn đới', 'Cận nhiệt', 'Cực'], 0, [null, 'E20', 'E20', 'E20'], 'Việt Nam có khí hậu nhiệt đới gió mùa.', 2),
  Q('DL10.B10', 'DL10.04.07', 'Biểu đồ có các tháng mùa đông dưới 0 °C, biên độ nhiệt năm lớn, mưa ít là của kiểu khí hậu', ['ôn đới lục địa', 'ôn đới hải dương', 'nhiệt đới gió mùa', 'xích đạo'], 0, [null, 'E20', 'E20', 'E20'], 'Ví dụ trạm U-pha (Liên bang Nga) trong SGK.', 4),
  Q('DL10.B10', 'DL10.04.06', 'Hà Nội có nhiệt độ tháng cao nhất khoảng 29 °C, tháng thấp nhất khoảng 16 °C. Biên độ nhiệt năm khoảng', ['13 °C', '45 °C', '22,5 °C', '29 °C'], 0, [null, 'E27', 'E27', 'E27'], 'Biên độ nhiệt năm = nhiệt độ tháng cao nhất − tháng thấp nhất.', 3),
  Q('DL10.B10', 'DL10.04.07', 'Kiểu khí hậu ôn đới hải dương có đặc điểm', ['ấm áp quanh năm, mưa nhiều, biên độ nhiệt nhỏ', 'mùa đông rất lạnh, mưa ít', 'khô hạn quanh năm', 'nóng quanh năm, mưa theo mùa'], 0, [null, 'E20', 'E20', 'E20'], 'Ví dụ trạm Va-len-xi-a (Ai-len).', 4),
  // Bài 11
  Q('DL10.B11', 'DL10.05.01', 'Thuỷ quyển là', ['lớp nước trên Trái Đất: nước biển, đại dương, nước trên lục địa và hơi nước trong khí quyển', 'chỉ gồm nước sông, hồ', 'chỉ gồm nước biển và đại dương', 'chỉ gồm nước ngầm'], 0, [null, 'E17', 'E17', 'E17'], 'Thuỷ quyển bao gồm mọi dạng nước trên Trái Đất.', 1),
  Q('DL10.B11', 'DL10.05.02', 'Sông ngòi Việt Nam có mùa lũ trùng với mùa mưa vì', ['nguồn cấp nước chủ yếu là nước mưa', 'nguồn cấp nước chủ yếu là băng tuyết tan', 'nguồn cấp nước chủ yếu là nước ngầm', 'do thuỷ triều'], 0, [null, 'E17', 'E17', 'E18'], 'Ở vùng nhiệt đới, chế độ nước sông phụ thuộc chế độ mưa.', 3),
  Q('DL10.B11', 'DL10.05.05', 'Vai trò của nước ngầm đối với sông là', ['điều hoà dòng chảy, giúp sông có nước vào mùa khô', 'gây lũ vào mùa xuân', 'làm sông cạn nước', 'không ảnh hưởng gì'], 0, [null, 'E17', 'E17', 'E17'], 'Nước ngầm thấm ra sông quanh năm.', 4),
  Q('DL10.B11', 'DL10.05.06', 'Biện pháp nào giúp bảo vệ nguồn nước ngọt?', ['Trồng và bảo vệ rừng đầu nguồn', 'Xả nước thải chưa xử lí ra sông', 'Khai thác nước ngầm tối đa', 'Phá rừng lấy đất canh tác'], 0, [null, 'E17', 'E17', 'E17'], 'Rừng giữ nước, điều hoà dòng chảy, giảm xói mòn.', 5),
  Q('DL10.B11', 'DL10.05.01', 'Trong vòng tuần hoàn lớn, hơi nước từ biển được đưa vào lục địa nhờ', ['gió', 'dòng biển', 'sông', 'nước ngầm'], 0, [null, 'E17', 'E17', 'E17'], 'Gió đưa mây, hơi nước từ biển vào đất liền.', 2),
  // Bài 12
  Q('DL10.B12', 'DL10.05.08', 'Nguyên nhân chủ yếu tạo ra sóng biển là', ['gió', 'sức hút của Mặt Trăng', 'dòng biển', 'sự chênh lệch độ muối'], 0, [null, 'E18', 'E18', 'E18'], 'Sức hút của Mặt Trăng, Mặt Trời là nguyên nhân của thuỷ triều.', 1),
  Q('DL10.B12', 'DL10.05.08', 'Thuỷ triều lớn nhất (triều cường) xảy ra khi Mặt Trời, Mặt Trăng và Trái Đất', ['nằm thẳng hàng', 'tạo thành góc vuông', 'tạo thành góc 45°', 'ở xa nhau nhất'], 0, [null, 'E18', 'E18', 'E18'], 'Sức hút của Mặt Trời và Mặt Trăng cộng hưởng.', 3),
  Q('DL10.B12', 'DL10.05.08', 'Triều kém thường xảy ra vào các ngày âm lịch', ['mùng 8 và 23', 'mùng 1 và 15', 'mùng 5 và 20', 'mùng 10 và 30'], 0, [null, 'E18', 'E18', 'E18'], 'Ngày trăng thượng huyền, hạ huyền: Mặt Trời và Mặt Trăng vuông góc so với Trái Đất.', 3),
  Q('DL10.B12', 'DL10.05.09', 'Dòng biển lạnh Pê-ru chảy dọc bờ tây Nam Mỹ làm cho vùng ven biển', ['khô hạn, ít mưa', 'mưa nhiều quanh năm', 'nóng ẩm', 'nhiều bão'], 0, [null, 'E19', 'E19', 'E19'], 'Dòng biển lạnh làm không khí ven bờ ổn định, ít mưa → hoang mạc A-ta-ca-ma.', 4),
  Q('DL10.B12', 'DL10.05.09', 'Ở vùng nhiệt đới, các dòng biển nóng thường chảy ở', ['bờ đông các lục địa', 'bờ tây các lục địa', 'giữa các đại dương', 'quanh vùng cực'], 0, [null, 'E19', 'E19', 'E19'], 'Ví dụ: dòng Gơn-xtrim, Cư-rô-si-ô, Bra-xin ở bờ đông.', 4),
  // Bài 14
  Q('DL10.B14', 'DL10.06.01', 'Đặc trưng cơ bản của đất là', ['độ phì', 'màu sắc', 'độ dày', 'nhiệt độ'], 0, [null, 'E21', 'E21', 'E21'], 'Độ phì là khả năng cung cấp nước, dinh dưỡng, nhiệt, khí cho thực vật.', 1),
  Q('DL10.B14', 'DL10.06.01', 'Tầng nào quyết định độ phì của đất?', ['Tầng chứa mùn', 'Tầng tích tụ', 'Tầng đá mẹ', 'Tầng đá gốc'], 0, [null, 'E21', 'E21', 'E21'], 'Tầng chứa mùn có nhiều chất hữu cơ.', 2),
  Q('DL10.B14', 'DL10.06.01', 'Vỏ phong hoá khác đất ở chỗ', ['vỏ phong hoá gồm cả đất và tầng đá mẹ chưa có độ phì', 'vỏ phong hoá mỏng hơn đất', 'vỏ phong hoá có nhiều mùn hơn', 'vỏ phong hoá chỉ có ở đại dương'], 0, [null, 'E21', 'E21', 'E21'], 'Đất chỉ là phần trên cùng của vỏ phong hoá.', 2),
  Q('DL10.B14', 'DL10.06.02', 'Nhân tố đóng vai trò chủ đạo trong quá trình hình thành đất là', ['sinh vật', 'đá mẹ', 'khí hậu', 'địa hình'], 0, [null, 'E22', 'E22', 'E22'], 'Sinh vật cung cấp chất hữu cơ, phân giải tạo mùn.', 4),
  Q('DL10.B14', 'DL10.06.02', 'Nhân tố cung cấp chất khoáng cho đất là', ['đá mẹ', 'sinh vật', 'thời gian', 'con người'], 0, [null, 'E22', 'E22', 'E22'], 'Đá mẹ quyết định thành phần khoáng vật của đất.', 4),
  // Bài 15
  Q('DL10.B15', 'DL10.06.03', 'Giới hạn trên của sinh quyển là', ['nơi tiếp xúc với lớp ô-dôn', 'hết tầng nhiệt', 'đỉnh núi cao nhất', 'mặt đất'], 0, [null, 'E23', 'E23', 'E23'], 'Giới hạn dưới: đáy đại dương sâu nhất và đáy lớp vỏ phong hoá.', 1),
  Q('DL10.B15', 'DL10.06.03', 'Đi từ vùng nhiệt đới lên cực, ngay sau vành đai rừng lá kim là', ['đài nguyên', 'thảo nguyên', 'xa van', 'rừng nhiệt đới'], 0, [null, 'E23', 'E23', 'E23'], 'Rừng lá kim → đài nguyên → hoang mạc cực.', 3),
  Q('DL10.B15', 'DL10.06.03', 'Ở vùng nhiệt đới, lên cao vành đai thực vật thay đổi chủ yếu do', ['nhiệt độ giảm, độ ẩm thay đổi', 'ánh sáng mạnh hơn', 'đất màu mỡ hơn', 'gió yếu hơn'], 0, [null, 'E23', 'E23', 'E23'], 'Nhiệt độ giảm khoảng 0,6 °C/100 m.', 4),
  Q('DL10.B15', 'DL10.06.03', 'Hoạt động nào của con người tác động tiêu cực đến sinh vật?', ['Phá rừng', 'Trồng rừng', 'Lai tạo giống mới', 'Mở rộng vùng trồng cây'], 0, [null, 'E23', 'E23', 'E23'], 'Phá rừng thu hẹp môi trường sống, giảm đa dạng sinh học.', 5),
  // Bài 18
  Q('DL10.B18', 'DL10.07.03', 'Nguyên nhân của quy luật địa đới là', ['Trái Đất hình cầu nên góc chiếu của tia sáng Mặt Trời giảm dần từ Xích đạo về cực', 'năng lượng bên trong Trái Đất', 'sự phân bố lục địa và đại dương', 'địa hình núi cao'], 0, [null, 'E24', 'E24', 'E24'], 'Ba phương án còn lại là nguyên nhân của quy luật phi địa đới.', 1),
  Q('DL10.B18', 'DL10.07.03', 'Quy luật đai cao là biểu hiện của quy luật', ['phi địa đới', 'địa đới', 'thống nhất và hoàn chỉnh', 'tuần hoàn'], 0, [null, 'E24', 'E24', 'E24'], 'Thay đổi theo độ cao không phụ thuộc vĩ độ → phi địa đới.', 3),
  Q('DL10.B18', 'DL10.07.03', 'Ở Bắc Mỹ, khoảng vĩ tuyến 40°B, từ tây sang đông cảnh quan thay đổi: rừng → hoang mạc → thảo nguyên → rừng. Đây là biểu hiện của quy luật', ['địa ô', 'địa đới', 'đai cao', 'thống nhất và hoàn chỉnh'], 0, [null, 'E24', 'E24', 'E24'], 'Thay đổi theo kinh độ do khoảng cách tới biển → quy luật địa ô.', 4),
  Q('DL10.B18', 'DL10.07.04', 'Vì sao trên cùng vĩ độ, vùng sâu trong lục địa thường khô hơn vùng ven biển?', ['Xa biển, ít nhận hơi ẩm từ biển', 'Gần Xích đạo hơn', 'Có nhiều rừng hơn', 'Có độ cao lớn hơn'], 0, [null, 'E24', 'E24', 'E24'], 'Gió ẩm từ biển suy yếu dần khi vào sâu nội địa.', 4),
  // Bài 19
  Q('DL10.B19', 'DL10.08.06', 'Tháp dân số kiểu mở rộng có đặc điểm', ['đáy rộng, đỉnh nhọn, cạnh thoải', 'đáy hẹp, phình ở giữa', 'đáy và đỉnh gần bằng nhau', 'đỉnh rộng hơn đáy'], 0, [null, 'E25', 'E25', 'E25'], 'Phản ánh tỉ suất sinh cao, dân số tăng nhanh.', 2),
  Q('DL10.B19', 'DL10.08.06', 'Tháp dân số kiểu thu hẹp phản ánh', ['tỉ suất sinh thấp, dân số già', 'tỉ suất sinh cao, dân số trẻ', 'tuổi thọ thấp', 'dân số tăng nhanh'], 0, [null, 'E25', 'E25', 'E25'], 'Đáy hẹp: ít trẻ em; phình ở trên: nhiều người cao tuổi.', 2),
  Q('DL10.B19', 'DL10.08.03', 'Cơ cấu dân số theo tuổi và giới thuộc loại', ['cơ cấu sinh học', 'cơ cấu xã hội', 'cơ cấu theo lao động', 'cơ cấu theo trình độ văn hoá'], 0, [null, 'E25', 'E25', 'E25'], 'Cơ cấu xã hội gồm theo lao động và trình độ văn hoá.', 1),
  Q('DL10.B19', 'DL10.08.08', 'Một nước có nhóm 0 – 14 tuổi chiếm 40%, nhóm 65 tuổi trở lên chiếm 3%. Cơ cấu dân số nước đó là', ['dân số trẻ', 'dân số già', 'dân số đang già rất nhanh', 'không xác định được'], 0, [null, 'E27', 'E27', 'E27'], 'Tỉ lệ trẻ em cao, người già thấp → dân số trẻ.', 3),
  // Bài 20
  Q('DL10.B20', 'DL10.08.04', 'Nhân tố quyết định sự phân bố dân cư là', ['trình độ phát triển lực lượng sản xuất, tính chất nền kinh tế', 'khí hậu', 'địa hình', 'nguồn nước'], 0, [null, 'E26', 'E26', 'E26'], 'Các nhân tố tự nhiên có ảnh hưởng nhưng không quyết định.', 2),
  Q('DL10.B20', 'DL10.08.05', 'Siêu đô thị là đô thị có số dân', ['từ 10 triệu người trở lên', 'từ 1 triệu người trở lên', 'từ 5 triệu người trở lên', 'từ 50 triệu người trở lên'], 0, [null, 'E26', 'E26', 'E26'], 'Phần lớn siêu đô thị hiện nay ở châu Á.', 3),
  Q('DL10.B20', 'DL10.08.09', 'Khu vực nào sau đây có dân cư thưa thớt nhất?', ['Hoang mạc Xa-ha-ra', 'Đồng bằng sông Hằng', 'Tây Âu', 'Đông Bắc Hoa Kỳ'], 0, [null, 'E26', 'E26', 'E26'], 'Khí hậu khô hạn khắc nghiệt, thiếu nước.', 1),
  Q('DL10.B20', 'DL10.08.05', 'Đô thị hoá tự phát, không gắn với công nghiệp hoá dẫn đến', ['thất nghiệp, thiếu nhà ở, ô nhiễm môi trường', 'kinh tế tăng trưởng bền vững', 'giảm dân số thành thị', 'nông thôn phát triển mạnh'], 0, [null, 'E26', 'E26', 'E26'], 'Dân nông thôn đổ về thành phố nhưng thiếu việc làm, hạ tầng.', 4),
];
BANK.forEach((q, i) => { const n = BANK.slice(0, i).filter(x => x.o === q.o).length + 1; q.id = `${q.o}-Q${String(n).padStart(2, '0')}`; });

// mô-đun có học liệu 3D (khớp thư viện)
export const MODULES = [
  ['DL10.B02', '02', 'Bài 2', 'Các phương pháp biểu hiện trên bản đồ', 'Chương 1 – Sử dụng bản đồ'],
  ['DL10.B03', '03', 'Bài 3', 'GPS và bản đồ số', 'Chương 1 – Sử dụng bản đồ'],
  ['DL10.B04', '04', 'Bài 4', 'Sự hình thành Trái Đất, vỏ Trái Đất', 'Chương 2 – Trái Đất'],
  ['DL10.B05', '05', 'Bài 5', 'Hệ quả các chuyển động của Trái Đất', 'Chương 2 – Trái Đất'],
  ['DL10.B06', '06', 'Bài 6', 'Thạch quyển, thuyết kiến tạo mảng', 'Chương 3 – Thạch quyển'],
  ['DL10.B07', '07', 'Bài 7', 'Nội lực và ngoại lực', 'Chương 3 – Thạch quyển'],
  ['DL10.B08', '08', 'Bài 8', 'Vành đai động đất, núi lửa', 'Chương 3 – Thạch quyển'],
  ['DL10.B09', '09', 'Bài 9', 'Khí quyển, các yếu tố khí hậu', 'Chương 4 – Khí quyển'],
  ['DL10.B10', '10', 'Bài 10', 'Các đới và kiểu khí hậu', 'Chương 4 – Khí quyển'],
  ['DL10.B11', '11', 'Bài 11', 'Thuỷ quyển, nước trên lục địa', 'Chương 5 – Thuỷ quyển'],
  ['DL10.B12', '12', 'Bài 12', 'Nước biển và đại dương', 'Chương 5 – Thuỷ quyển'],
  ['DL10.B14', '14', 'Bài 14', 'Đất trên Trái Đất', 'Chương 6 – Sinh quyển'],
  ['DL10.B15', '15', 'Bài 15', 'Sinh quyển', 'Chương 6 – Sinh quyển'],
  ['DL10.B18', '18', 'Bài 18', 'Quy luật địa đới và phi địa đới', 'Chương 7 – Quy luật của vỏ địa lí'],
  ['DL10.B19', '19', 'Bài 19', 'Dân số và cơ cấu dân số', 'Chương 8 – Địa lí dân cư'],
  ['DL10.B20', '20', 'Bài 20', 'Phân bố dân cư và đô thị hoá', 'Chương 8 – Địa lí dân cư'],
].map(([code, lab, bai, title, chap]) => ({ code, lab, bai, title, chap }));

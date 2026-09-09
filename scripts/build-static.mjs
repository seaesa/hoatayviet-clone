import fs from 'fs';
import path from 'path';
import { page, breadcrumb, esc } from './templates.mjs';

function write(outPath, html) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

/* ---------------- Giới thiệu (About) ---------------- */
const aboutMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Giới thiệu', url: '/gioi-thieu/' }])}
<div class="container page-content">
  <h1>Giới thiệu về Hoa Tay Việt</h1>
  <p>Chào mừng quý khách đến với đại gia đình HOA TAY VIỆT.</p>
  <p>Công ty chúng tôi chuyên xuất khẩu ngành hàng thủ công mỹ nghệ, có bề dày kinh nghiệm trong ngành thủ công làm bằng tay. Chúng tôi là xưởng sản xuất mô hình thuyền gỗ (wooden ship model) — nếu quý khách muốn đặt chế tác bất kỳ mẫu tàu thuyền nào trên thế giới, xin vui lòng liên hệ với chúng tôi.</p>
  <p>Hoa Tay Việt cũng có đối tác tại Vương quốc Anh (UK). Nếu quý khách muốn hợp tác và nhận hàng tại UK, chúng tôi sẽ gửi thông tin đối tác liên quan.</p>
  <p><strong>Địa chỉ:</strong> 199, ấp 1B, Phước Thái, Long Thành, Đồng Nai, Việt Nam<br>
  <strong>Email:</strong> <a href="mailto:hoatayviet.modelship@gmail.com">hoatayviet.modelship@gmail.com</a></p>
</div>`;
write('./gioi-thieu/index.html', page({ title: 'Giới Thiệu', activeKey: 'about', main: aboutMain }));

/* ---------------- Liên hệ (Contact) — reconstructed, live page returns HTTP 500 ---------------- */
const contactMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Liên hệ', url: '/lien-he/' }])}
<div class="container page-content">
  <h1>Liên hệ với chúng tôi</h1>
  <div class="contact-grid">
    <div>
      <ul class="contact-info">
        <li><strong>CÔNG TY TNHH HOA TAY VIỆT</strong></li>
        <li>199 ấp 1B, Phước Thái, Long Thành, Đồng Nai</li>
        <li><a href="tel:0908062685">0908 062 685</a></li>
        <li>84 35234 4343 – Contact (Ms Tram)</li>
        <li><a href="mailto:hoatayviet.modelship@gmail.com">hoatayviet.modelship@gmail.com</a></li>
        <li><a href="mailto:lywoodenmodelboat@gmail.com">lywoodenmodelboat@gmail.com</a></li>
      </ul>
      <h3>Google Map</h3>
      <div class="map-embed">
        <iframe title="Bản đồ Hoa Tay Việt" loading="lazy" src="https://www.google.com/maps?q=199+%E1%BA%A5p+1B,+Ph%C6%B0%E1%BB%9Bc+Th%C3%A1i,+Long+Th%C3%A0nh,+%C4%90%E1%BB%93ng+Nai&output=embed"></iframe>
      </div>
    </div>
    <form class="contact-form" onsubmit="return false;">
      <h3 style="margin-top:0;">Gửi yêu cầu tư vấn</h3>
      <input type="text" name="name" placeholder="Họ và tên" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="tel" name="phone" placeholder="Số điện thoại">
      <textarea name="message" placeholder="Nội dung yêu cầu / mẫu thuyền cần đặt"></textarea>
      <button class="btn btn-primary" type="submit">Gửi liên hệ</button>
    </form>
  </div>
</div>`;
write('./lien-he/index.html', page({ title: 'Liên Hệ', activeKey: 'contact', main: contactMain }));

/* ---------------- Hướng Dẫn (index) ---------------- */
const guideIndexMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Hướng dẫn', url: '/huong-dan/' }])}
<div class="container page-content">
  <h1>Hướng dẫn đặt hàng</h1>
  <p>Bước 1. Khách hàng cho biết tên thuyền, mã sản phẩm để chúng tôi xác nhận. Tùy vào hàng có sẵn hay không, thời gian giao hàng từ 1–2 ngày cho đến 2–3 tuần. Hàng có thể cọc trước 30%, hoặc giao và thanh toán trực tiếp.</p>
  <p>Trên đây là giá bán lẻ, vui lòng <a href="/lien-he/">liên hệ với chúng tôi</a> để biết giá bán buôn.</p>
  <p>Xem thêm: <a href="/phuong-thuc-van-chuyen/">Hướng dẫn sử dụng</a> · <a href="/huong-dan-mua-hang/">Hướng dẫn mua hàng</a></p>
</div>`;
write('./huong-dan/index.html', page({ title: 'Hướng Dẫn', activeKey: 'guide', main: guideIndexMain }));

/* ---------------- Hướng Dẫn Sử Dụng (usage/shipping) ---------------- */
const usageMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Hướng dẫn', url: '/huong-dan/' }, { name: 'Hướng Dẫn Sử Dụng', url: '/phuong-thuc-van-chuyen/' }])}
<div class="container page-content">
  <h1>Hướng Dẫn Sử Dụng</h1>
  <p>Mỗi mô hình đều đi kèm đế gỗ chắc chắn và bảng tên bằng đồng gắn trên đế. Nên đặt sản phẩm ở nơi khô ráo, tránh ánh nắng trực tiếp và độ ẩm cao để giữ màu gỗ và các chi tiết dây lèo, cột buồm không bị giãn hoặc mối mọt.</p>
  <p>Sản phẩm được đóng gói cố định chắc chắn trong thùng gỗ (crate) rồi lồng trong thùng carton để bảo vệ trong quá trình vận chuyển đường dài. Với các mẫu nhỏ, đơn giản, thùng gỗ có thể được lược bỏ để tối ưu chi phí.</p>
  <p>Nếu cần vệ sinh, chỉ nên dùng khăn mềm, khô lau nhẹ theo chiều thớ gỗ — tránh dùng hóa chất tẩy rửa mạnh.</p>
</div>`;
write('./phuong-thuc-van-chuyen/index.html', page({ title: 'Hướng Dẫn Sử Dụng', activeKey: 'guide', main: usageMain }));

/* ---------------- Hướng dẫn mua hàng (production & purchase terms) ---------------- */
const purchaseItems = [
  ['Chất liệu', 'Tất cả mô hình được làm từ gỗ tự nhiên chọn lọc: Gõ đỏ (Mahogany), Hương (Rosewood), gỗ đen (Blackwood), gỗ Cherry… Gỗ được sấy khô hoàn toàn để thuyền giữ được form dáng tốt trong nhiều điều kiện khí hậu khác nhau.'],
  ['Chế tác', 'Gỗ được sấy khô, cắt và ghép từng chi tiết trên khung sườn bằng keo chuyên dụng. Thuyền được chế tác theo đúng tỷ lệ bản vẽ hoặc hình ảnh gốc; có thể tùy chỉnh theo yêu cầu nếu khách hàng cung cấp bản vẽ/hình ảnh.'],
  ['Kích thước', 'Kích thước được đo bằng centimet theo chiều dài thân tàu. Có thể thiết kế và chế tác theo kích thước khách yêu cầu; chúng tôi luôn đề xuất các kích thước phổ biến, bán chạy nhất trên thực tế.'],
  ['Tên & lịch sử', 'Mỗi mẫu thuyền đi kèm đế gỗ chắc chắn và bảng tên bằng đồng. Mô tả tóm tắt lịch sử con tàu có thể được cung cấp theo yêu cầu.'],
  ['Đóng gói', 'Mỗi sản phẩm được lắp ráp hoàn chỉnh, cố định chắc chắn trong thùng gỗ riêng rồi đóng trong thùng carton để bảo vệ trong quá trình vận chuyển. Riêng các mẫu nhỏ, đơn giản có thể không cần thùng gỗ.'],
  ['Giá', 'Giá được báo theo USD – giá FOB cảng Hồ Chí Minh, Việt Nam, hoặc giá C&amp;F theo yêu cầu đến bất kỳ điểm đến nào trên thế giới.'],
  ['Thanh toán', 'Chấp nhận chuyển khoản ngân hàng (T/T), đặt cọc 40% khi xác nhận đơn hàng, thanh toán 60% còn lại khi có chứng từ giao hàng. Giá trị đơn hàng tối thiểu 2.000 USD.'],
  ['Thời gian sản xuất', 'Thời gian hoàn thành đơn hàng dao động từ 2–4 tuần tùy số lượng đặt hàng.'],
  ['Vận chuyển', 'Để tiết kiệm chi phí, khuyến khích vận chuyển đường biển (FCL/LCL). Hàng cũng có thể gửi bằng đường hàng không theo yêu cầu.'],
  ['Đại lý phân phối', 'Chúng tôi luôn hoan nghênh và đánh giá cao mong muốn trở thành Đại lý phân phối độc quyền tại thị trường nước ngoài, với chính sách ưu tiên đặc biệt dành cho đối tác phân phối.'],
];
const purchaseMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Hướng dẫn', url: '/huong-dan/' }, { name: 'Hướng dẫn mua hàng', url: '/huong-dan-mua-hang/' }])}
<div class="container page-content">
  <h1>Hướng Dẫn Mua Hàng</h1>
  <ol>
    ${purchaseItems.map(([t, d]) => `<li><strong>${esc(t)}:</strong> ${d}</li>`).join('')}
  </ol>
</div>`;
write('./huong-dan-mua-hang/index.html', page({ title: 'Hướng Dẫn Mua Hàng', activeKey: 'guide', main: purchaseMain }));

/* ---------------- Tin tức (news — currently empty, matching live site) ---------------- */
const newsMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Tin tức', url: '/category/chua-duoc-phan-loai/' }])}
<div class="container page-content">
  <h1>Chuyên mục: Chưa được phân loại</h1>
  <div class="empty-state">
    <p>Không tìn thấy gì! Dường như chúng tôi không thể tìm thấy thứ bạn đang tìm kiếm.</p>
  </div>
</div>`;
write('./category/chua-duoc-phan-loai/index.html', page({ title: 'Tin Tức', activeKey: 'news', main: newsMain }));

/* ---------------- Giỏ hàng (cart — static empty-cart state) ---------------- */
const cartMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Giỏ hàng', url: '/gio-hang/' }])}
<div class="container page-content">
  <h1>Giỏ hàng</h1>
  <div class="empty-state">
    <p>Chưa có sản phẩm trong giỏ hàng.</p>
  </div>
</div>`;
write('./gio-hang/index.html', page({ title: 'Giỏ Hàng', activeKey: 'shop', main: cartMain }));

/* ---------------- 404 ---------------- */
const notFoundMain = `
<div class="container page-content">
  <div class="empty-state">
    <h1 style="font-size:48px;">404</h1>
    <p>Không tìm thấy trang bạn yêu cầu.</p>
    <a class="btn btn-primary" href="/">Về trang chủ</a>
  </div>
</div>`;
write('./404.html', page({ title: 'Không tìm thấy trang', activeKey: null, main: notFoundMain }));

console.error('Static pages built.');

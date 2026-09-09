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
  <p class="lede">Chào mừng quý khách đến với đại gia đình HOA TAY VIỆT.</p>
  <p>Công ty chúng tôi chuyên xuất khẩu ngành hàng thủ công mỹ nghệ, có bề dày kinh nghiệm trong ngành thủ công làm bằng tay. Chúng tôi là xưởng sản xuất mô hình thuyền gỗ (wooden ship model) — nếu quý khách muốn đặt chế tác bất kỳ mẫu tàu thuyền nào trên thế giới, xin vui lòng liên hệ với chúng tôi.</p>
  <p>Hoa Tay Việt cũng có đối tác tại Vương quốc Anh (UK). Nếu quý khách muốn hợp tác và nhận hàng tại UK, chúng tôi sẽ gửi thông tin đối tác liên quan.</p>

  <div class="info-cards">
    <div class="info-card"><div class="num">1</div><h4>Chất liệu gỗ tự nhiên</h4><p>Gỗ Gõ đỏ, Hương, Cẩm lai, Xoan đào… được sấy khô kỹ để giữ form dáng bền theo thời gian.</p></div>
    <div class="info-card"><div class="num">2</div><h4>Chế tác thủ công tỉ mỉ</h4><p>Từng chi tiết được cắt, ghép và hoàn thiện thủ công theo đúng tỷ lệ bản vẽ gốc.</p></div>
    <div class="info-card"><div class="num">3</div><h4>Nhận đặt theo yêu cầu</h4><p>Thiết kế và gia công theo kích thước, mẫu tàu do khách hàng cung cấp.</p></div>
  </div>

  <p><strong>Địa chỉ:</strong> 199, ấp 1B, Phước Thái, Long Thành, Đồng Nai, Việt Nam<br>
  <strong>Email:</strong> <a href="mailto:hoatayviet.modelship@gmail.com">hoatayviet.modelship@gmail.com</a></p>
</div>`;
write('./gioi-thieu/index.html', page({ title: 'Giới Thiệu', activeKey: 'about', main: aboutMain }));

/* ---------------- Liên hệ (Contact) — reconstructed, live page returns HTTP 500 ---------------- */
const contactMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Liên hệ', url: '/lien-he/' }])}
<div class="container page-content">
  <h1>Liên hệ với chúng tôi</h1>
  <p class="lede">Hoa Tay Việt luôn sẵn sàng tư vấn và báo giá mô hình thuyền theo yêu cầu của quý khách.</p>
  <div class="contact-grid">
    <div>
      <ul class="contact-info">
        <li>${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d=\'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\'/><circle cx=\'12\' cy=\'10\' r=\'3\'/></svg>'}<span><strong>CÔNG TY TNHH HOA TAY VIỆT</strong><br>199 ấp 1B, Phước Thái, Long Thành, Đồng Nai</span></li>
        <li>${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d=\'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z\'/></svg>'}<span><a href="tel:0908062685">0908 062 685</a><br>84 35234 4343 – Contact (Ms Tram)</span></li>
        <li>${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d=\'M4 4h16v16H4z\'/><path d=\'m22 6-10 7L2 6\'/></svg>'}<span><a href="mailto:hoatayviet.modelship@gmail.com">hoatayviet.modelship@gmail.com</a><br><a href="mailto:lywoodenmodelboat@gmail.com">lywoodenmodelboat@gmail.com</a></span></li>
      </ul>
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
  <div class="info-cards">
    <div class="info-card"><div class="num">1</div><h4>Chọn mẫu thuyền</h4><p>Cho chúng tôi biết tên thuyền, mã sản phẩm để chúng tôi xác nhận tình trạng hàng.</p></div>
    <div class="info-card"><div class="num">2</div><h4>Thời gian giao hàng</h4><p>Tùy hàng có sẵn hay không, thời gian giao từ 1–2 ngày cho đến 2–3 tuần.</p></div>
    <div class="info-card"><div class="num">3</div><h4>Thanh toán</h4><p>Có thể đặt cọc trước 30%, hoặc giao và thanh toán trực tiếp.</p></div>
  </div>
  <p>Giá niêm yết trên website là giá bán lẻ. Vui lòng <a href="/lien-he/">liên hệ với chúng tôi</a> để biết giá bán buôn (số lượng lớn).</p>
  <p>Xem thêm: <a href="/phuong-thuc-van-chuyen/">Hướng dẫn sử dụng &amp; vận chuyển</a> · <a href="/huong-dan-mua-hang/">Quy trình sản xuất &amp; mua hàng chi tiết</a></p>
</div>`;
write('./huong-dan/index.html', page({ title: 'Hướng Dẫn', activeKey: 'guide', main: guideIndexMain }));

/* ---------------- Hướng Dẫn Sử Dụng (usage/shipping) ---------------- */
const usageMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Hướng dẫn', url: '/huong-dan/' }, { name: 'Hướng Dẫn Sử Dụng', url: '/phuong-thuc-van-chuyen/' }])}
<div class="container page-content">
  <h1>Hướng Dẫn Sử Dụng &amp; Bảo Quản</h1>
  <p class="lede">Một vài lưu ý giúp mô hình thuyền gỗ của bạn luôn bền đẹp theo thời gian.</p>
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
  <p class="lede">Quy trình sản xuất, chính sách giá và thanh toán khi đặt mô hình thuyền tại Hoa Tay Việt.</p>
  ${purchaseItems.map(([t, d], i) => `<div class="info-card" style="text-align:left;margin-bottom:16px;">
    <h4 style="display:flex;gap:10px;align-items:center;"><span class="num" style="display:inline-flex;width:32px;height:32px;font-size:14px;">${i + 1}</span> ${esc(t)}</h4>
    <p style="margin:0;">${d}</p>
  </div>`).join('')}
</div>`;
write('./huong-dan-mua-hang/index.html', page({ title: 'Hướng Dẫn Mua Hàng', activeKey: 'guide', main: purchaseMain }));

/* ---------------- Tin tức (news — currently empty, matching live site) ---------------- */
const newsMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Tin tức', url: '/category/chua-duoc-phan-loai/' }])}
<div class="container page-content">
  <h1>Chuyên mục: Chưa được phân loại</h1>
  <div class="empty-state">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    <p>Không tìm thấy bài viết nào. Hãy quay lại sau để xem tin tức mới nhất từ Hoa Tay Việt.</p>
    <a class="btn btn-outline" href="/shop/">Xem sản phẩm</a>
  </div>
</div>`;
write('./category/chua-duoc-phan-loai/index.html', page({ title: 'Tin Tức', activeKey: 'news', main: newsMain }));

/* ---------------- Giỏ hàng (cart — static empty-cart state) ---------------- */
const cartMain = `
${breadcrumb([{ name: 'Trang chủ', url: '/' }, { name: 'Giỏ hàng', url: '/gio-hang/' }])}
<div class="container page-content">
  <h1>Giỏ hàng</h1>
  <div class="empty-state">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
    <p>Chưa có sản phẩm trong giỏ hàng.</p>
    <a class="btn btn-primary" href="/shop/">Quay lại cửa hàng</a>
  </div>
</div>`;
write('./gio-hang/index.html', page({ title: 'Giỏ Hàng', activeKey: 'shop', main: cartMain }));

/* ---------------- 404 ---------------- */
const notFoundMain = `
<div class="container page-content">
  <div class="empty-state">
    <h1 style="font-size:64px;color:#003eaa;">404</h1>
    <p>Không tìm thấy trang bạn yêu cầu.</p>
    <a class="btn btn-primary" href="/">Về trang chủ</a>
  </div>
</div>`;
write('./404.html', page({ title: 'Không tìm thấy trang', activeKey: null, main: notFoundMain }));

console.error('Static pages built.');

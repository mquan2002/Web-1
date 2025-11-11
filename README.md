# 📚 BookStore - Thư viện sách trực tuyến

Một nền tảng thương mại điện tử hoàn chỉnh cho bán sách trực tuyến với chức năng cho cả khách hàng (end-user) và quản trị viên (admin).

## ✨ Tính năng

### 👤 Cho Khách hàng (End-User)

#### 1. **Quản lý Tài khoản**
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập / Đăng xuất
- ✅ Quản lý hồ sơ

#### 2. **Duyệt & Tìm kiếm Sản phẩm**
- ✅ Xem tất cả sản phẩm trên trang `Products`
- ✅ Tìm kiếm theo tên sách, tác giả
- ✅ Lọc theo thể loại (category)
- ✅ Sắp xếp theo giá (thấp→cao, cao→thấp, mới nhất)
- ✅ Lọc theo khoảng giá
- ✅ Phân trang (8 sản phẩm/trang)
- ✅ Xem chi tiết sản phẩm

#### 3. **Giỏ Hàng**
- ✅ Thêm sản phẩm vào giỏ
- ✅ Thay đổi số lượng
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Cập nhật số lượng trong giỏ tự động
- ✅ Hiển thị tổng giá trị giỏ

#### 4. **Thanh toán & Giao hàng**
- ✅ Nhập thông tin giao hàng (FHO, SDT, địa chỉ)
- ✅ **Lưu địa chỉ giao hàng** để lần tới
- ✅ Chọn địa chỉ đã lưu từ dropdown
- ✅ Chọn phương thức thanh toán (COD hoặc online)
- ✅ Xác nhận mua hàng
- ✅ Xem thông báo thành công

#### 5. **Xem lại Đơn hàng**
- ✅ Trang `Orders` để xem tất cả đơn hàng đã mua
- ✅ Xem chi tiết từng đơn hàng (sản phẩm, số lượng, giá)
- ✅ Xem địa chỉ giao hàng, phương thức thanh toán
- ✅ Xem trạng thái đơn hàng
- ✅ Nút "Tiếp tục mua sắm"

---

### 🔐 Cho Quản trị viên (Admin)

**Truy cập:** `admin-login.html` hoặc `/admin.html`

**Thông tin demo:**
- Email: `admin@bookstore.com`
- Password: `admin123`

#### 1. **Dashboard**
- 📈 Xem tổng doanh thu
- 📦 Xem tổng số đơn hàng
- 📚 Xem tổng số sản phẩm
- 👥 Xem tổng số người dùng

#### 2. **Quản lý Sản phẩm**
- ✅ **Thêm** sản phẩm mới
- ✅ **Sửa** thông tin sản phẩm
- ✅ **Xóa** sản phẩm
- ✅ Tìm kiếm sản phẩm
- ✅ Lọc theo thể loại
- ✅ Hiển thị danh sách với hình ảnh

#### 3. **Quản lý Danh mục**
- ✅ **Thêm** danh mục mới
- ✅ **Sửa** danh mục
- ✅ **Xóa** danh mục
- ✅ Danh mục được dùng trong select khi thêm sản phẩm

#### 4. **Quản lý Đơn hàng**
- ✅ Xem danh sách tất cả đơn hàng
- ✅ Xem chi tiết từng đơn hàng (click 👁️)
- ✅ **Cập nhật trạng thái:** Đang xử lý → Đã gửi → Đã giao
- ✅ Tìm kiếm đơn hàng theo mã hoặc tên khách
- ✅ Lọc theo trạng thái

#### 5. **Quản lý Người dùng**
- ✅ Xem danh sách tất cả người dùng
- ✅ **Reset mật khẩu** người dùng
- ✅ **Xóa tài khoản** người dùng
- ✅ Tìm kiếm người dùng theo email
- ✅ Xem trạng thái hoạt động

#### 6. **Nhập/Xuất Dữ liệu**
- ✅ **Nhập sản phẩm từ JSON:** Dán JSON → Click "📥 Nhập"
- ✅ **Xuất sản phẩm:** Click "📤 Xuất" → Tải file JSON
- ✅ Hỗ trợ cập nhật sản phẩm đã tồn tại
- ✅ Validate dữ liệu trước khi nhập

---

## 📁 Cấu trúc Project

```
Web-1/
├── index.html              # Trang chủ
├── home.html               # Trang chủ (nội dung)
├── products.html           # Danh sách sản phẩm
├── details.html            # Chi tiết sản phẩm
├── cart.html               # Giỏ hàng
├── checkout.html           # Thanh toán
├── orders.html             # Đơn hàng của tôi
├── login.html              # Đăng nhập / Đăng ký
├── register.html           # Trang đăng ký
├── admin-login.html        # Đăng nhập Admin ✨ MỚI
├── admin.html              # Bảng quản trị (MỚI & CẬP NHẬT)
├── pricing.html            # Bảng giá
├── import.html             # Nhập dữ liệu
├── css/
│   ├── style.css           # Style chính
│   └── checkout.css        # Style checkout
├── js/
│   ├── main.js             # Logic chung
│   ├── admin.js            # Logic admin (MỚI & CẬP NHẬT)
│   ├── cart.js             # Logic giỏ hàng
│   ├── import.js           # Logic nhập dữ liệu
│   └── pricing.js          # Logic bảng giá
├── data/
│   └── books.json          # Dữ liệu sách
└── ADMIN-GUIDE.md          # Hướng dẫn admin ✨ MỚI
```

---

## 🚀 Cách Sử dụng

### 1. **Chạy Local Server**

```bash
python -m http.server 8000
```

Sau đó truy cập: `http://localhost:8000`

### 2. **Cho Khách hàng**

1. Truy cập `http://localhost:8000`
2. Tìm kiếm sản phẩm trên trang `Products`
3. Thêm vào giỏ hàng
4. Hoàn tất thanh toán
5. Xem lại đơn hàng ở trang `Orders`

### 3. **Cho Admin**

1. Truy cập `http://localhost:8000/admin-login.html`
2. Đăng nhập: `admin@bookstore.com` / `admin123`
3. Quản lý sản phẩm, đơn hàng, người dùng
4. Xem thống kê trên Dashboard

---

## 🔒 Bảo Mật & Lưu trữ Dữ liệu

### localStorage Keys:
- `bs_auth` - Thông tin đăng nhập người dùng
- `bs_users` - Danh sách người dùng
- `bs_cart` - Giỏ hàng
- `bs_addresses` - Địa chỉ giao hàng đã lưu
- `bs_categories` - Danh mục sản phẩm
- `bs_products` - Sản phẩm (custom)
- `bs_admin_session` - Phiên đăng nhập admin
- `orders` - Danh sách đơn hàng

**⚠️ Lưu ý:** Dữ liệu được lưu trên localStorage của trình duyệt. Nếu xóa dữ liệu trình duyệt, tất cả dữ liệu sẽ bị mất. Nên xuất dữ liệu định kỳ để backup.

---

## 📊 Công Nghệ Sử dụng

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** localStorage
- **Server:** Python HTTP Server (hoặc Node.js/PHP)
- **No Backend Database:** Sử dụng JSON file và localStorage

---

## 📝 API/Hàm Chính

### Auth Functions
- `getAuth()` - Lấy thông tin người dùng hiện tại
- `setAuth(user)` - Lưu thông tin người dùng
- `clearAuth()` - Xóa thông tin người dùng

### Product Functions
- `getProducts()` - Lấy danh sách sản phẩm
- `saveProducts(products)` - Lưu danh sách sản phẩm
- `renderProducts(list)` - Hiển thị danh sách sản phẩm

### Cart Functions
- `getCart()` - Lấy giỏ hàng
- `saveCart(cart)` - Lưu giỏ hàng
- `addToCart(id, qty)` - Thêm vào giỏ
- `updateCartCount()` - Cập nhật số lượng giỏ

### Order Functions
- `getOrders()` - Lấy danh sách đơn hàng
- `saveOrder(order)` - Lưu đơn hàng

### Category Functions
- `getCategories()` - Lấy danh sách danh mục
- `saveCategories(categories)` - Lưu danh mục

---

## 🐛 Troubleshooting

### 1. **Không thấy sản phẩm**
- Đảm bảo `books.json` tồn tại trong folder `data/`
- Kiểm tra console (F12) xem có lỗi không
- Thử nhập sản phẩm từ admin panel

### 2. **Dữ liệu mất sau khi F5**
- localStorage có thể bị xóa
- Kiểm tra "Settings → Storage → Clear"
- Thử làm mới trang hoặc mở tab mới

### 3. **Giỏ hàng không cập nhật**
- Kiểm tra console (F12) xem có lỗi không
- Thử xóa cache trình duyệt
- Đảm bảo JavaScript được kích hoạt

### 4. **Admin login không hoạt động**
- Email phải chính xác: `admin@bookstore.com`
- Password: `admin123`
- Kiểm tra localStorage (lưu trữ phiên)

---

## 🎯 Roadmap Tương lai

- [ ] Backend database (SQL/MongoDB)
- [ ] Payment gateway (Stripe, Zalopay)
- [ ] Email notification
- [ ] Advanced analytics & reporting
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Wishlist feature
- [ ] Product reviews & ratings
- [ ] Coupon & discount system
- [ ] Inventory management

---

## 📞 Hỗ trợ

Nếu có vấn đề, vui lòng:
1. Kiểm tra console (F12 → Console)
2. Đọc file `ADMIN-GUIDE.md`
3. Xóa localStorage và thử lại
4. Liên hệ admin để reset dữ liệu

---

## 📄 Giấy phép

Dự án này được tạo cho mục đích học tập và demo.

---

**Chúc bạn sử dụng BookStore hiệu quả! 🚀**

Được cập nhật: **11/11/2025**

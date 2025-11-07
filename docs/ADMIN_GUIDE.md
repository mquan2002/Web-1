# Hệ thống Quản lý Sản phẩm - Hướng dẫn

## 📋 Tổng quan

Hệ thống quản lý toàn diện với các tính năng:

-   ✅ Quản lý loại sản phẩm (Categories)
-   ✅ Quản lý sản phẩm (Products)
-   ✅ Quản lý người dùng (Users)
-   ✅ Kiểm tra tài khoản khóa
-   ✅ Tìm kiếm động
-   ✅ Auto reload sau CRUD

## 🗂️ Cấu trúc File mới

### HTML Files

-   `categories.html` - Quản lý loại sản phẩm
-   `products-admin.html` - Quản lý sản phẩm

### JavaScript Files

-   `js/categories.js` - Logic quản lý loại sản phẩm
-   `js/products-admin.js` - Logic quản lý sản phẩm

## 🎯 Tính năng Chi tiết

### 1. Quản lý Loại Sản phẩm (`categories.html`)

#### Thêm loại sản phẩm

-   **Mã loại**: Mã định danh unique (VD: ELEC, FASH)
-   **Tên loại**: Tên hiển thị
-   **Mô tả**: Mô tả chi tiết
-   **Trạng thái**: Hiển thị/Ẩn

#### Sửa loại sản phẩm

-   Click nút "✏️ Sửa"
-   Form tự động điền đúng thông tin hiện tại
-   Chỉnh sửa và lưu

#### Xóa/Ẩn loại sản phẩm

-   **Xóa**: Xóa vĩnh viễn (có confirm)
-   **Ẩn**: Ẩn loại sản phẩm (không xóa database)
-   **Hiện**: Hiển thị lại loại đã ẩn

#### Tìm kiếm

-   Tìm kiếm động khi gõ
-   Tìm theo: Mã, Tên, Mô tả

#### Dữ liệu mẫu

```javascript
ELEC - Điện tử
FASH - Thời trang
FOOD - Thực phẩm
BOOK - Sách
HOME - Gia dụng
```

---

### 2. Quản lý Sản phẩm (`products-admin.html`)

#### Thêm sản phẩm

-   **Mã sản phẩm**: ID unique (VD: SP001)
-   **Tên sản phẩm**: Tên hiển thị
-   **Loại sản phẩm**: Dropdown từ danh sách loại (chỉ hiện loại đang active)
-   **Giá**: Số tiền VNĐ
-   **Số lượng tồn**: Số lượng trong kho
-   **Hình ảnh**: URL hình ảnh
-   **Mô tả**: Mô tả chi tiết
-   **Trạng thái**: Hiển thị/Ẩn

#### Sửa sản phẩm

-   Click nút "✏️ Sửa"
-   Form hiển thị **đúng thông tin trước khi sửa**
-   Bao gồm cả dropdown loại sản phẩm được chọn đúng
-   Chỉnh sửa và lưu
-   **Auto reload** danh sách sau khi lưu

#### Xóa/Ẩn sản phẩm

-   **Xóa**: Xóa vĩnh viễn (có confirm)
-   **Ẩn**: Ẩn sản phẩm khỏi danh sách hiển thị
-   **Hiện**: Hiển thị lại sản phẩm đã ẩn

#### Tìm kiếm

-   **Phương thức gõ tìm kiếm** (live search)
-   Tìm theo: Mã, Tên, Loại, Mô tả
-   Kết quả hiện ngay khi gõ

#### Badge hiển thị

-   **Số lượng tồn**:
    -   🟢 Xanh: >= 10
    -   🟠 Cam: 1-9
    -   🔴 Đỏ: Hết hàng (0)
-   **Trạng thái**:
    -   🟢 Hiển thị
    -   🔴 Ẩn

#### ID sản phẩm

-   Mỗi sản phẩm có **ID unique** (tránh trùng tên)
-   Format: `PRD{timestamp}` (VD: PRD1699366800123)
-   Đồng bộ giữa các thao tác

---

### 3. Kiểm tra Tài khoản Khóa

#### Login (`login.html`)

```javascript
// Check tài khoản khóa khi đăng nhập
if (u.locked) {
    return 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin.'
}
```

#### Tài khoản test

Trong `data/users.json`:

```json
{
    "username": "test@gmail.com",
    "password": "test123",
    "locked": true // ← Tài khoản bị khóa
}
```

**Test**: Đăng nhập với `test@gmail.com` sẽ bị chặn

---

## 🔄 Auto Reload

### Sau khi thêm sản phẩm

```javascript
saveProducts(products)
renderProducts(searchInput.value) // ← Auto reload
resetForm()
```

### Sau khi sửa sản phẩm

-   Tự động cập nhật danh sách
-   Không cần admin reload trang
-   Giữ nguyên trạng thái tìm kiếm

---

## 💾 LocalStorage Structure

### Categories

```javascript
localStorage.getItem('bs_categories')[
    {
        id: 'CAT001',
        code: 'ELEC',
        name: 'Điện tử',
        description: 'Các sản phẩm điện tử...',
        status: 'active',
        createdAt: '2025-11-07T...',
    }
]
```

### Products

```javascript
localStorage.getItem('bs_products')[
    {
        id: 'PRD001',
        code: 'SP001',
        name: 'iPhone 15 Pro Max',
        category: 'ELEC',
        price: 29990000,
        stock: 15,
        image: 'https://...',
        description: '...',
        status: 'active',
        createdAt: '2025-11-07T...',
    }
]
```

---

## 🎨 UI/UX Features

### Toast Notifications

-   ✅ Thành công (xanh)
-   ❌ Lỗi (đỏ)
-   ⚠️ Cảnh báo (cam)
-   ℹ️ Thông tin (xanh dương)

### Form Validation

-   Required fields
-   Unique code check
-   Category selection check
-   Number validation

### Smooth Scrolling

-   Scroll to form khi edit
-   Scroll to table sau khi save

### Responsive Design

-   Grid layout tự động điều chỉnh
-   Mobile-friendly

---

## 🔗 Navigation

Tất cả trang admin có navigation bar:

```
🏠 Trang chủ | ⚙️ Quản lý sách | 📦 Quản lý sản phẩm |
🏷️ Loại sản phẩm | 👥 Quản lý người dùng | 🚪 Đăng xuất
```

---

## 🧪 Testing Checklist

### Loại sản phẩm

-   [ ] Thêm loại mới
-   [ ] Sửa loại (kiểm tra form điền đúng)
-   [ ] Xóa loại (có confirm)
-   [ ] Ẩn/Hiện loại
-   [ ] Tìm kiếm loại
-   [ ] Check trùng mã

### Sản phẩm

-   [ ] Thêm sản phẩm
-   [ ] Chọn loại từ dropdown
-   [ ] Sửa sản phẩm (form hiển thị đúng)
-   [ ] Xóa sản phẩm (có confirm)
-   [ ] Ẩn/Hiện sản phẩm
-   [ ] Tìm kiếm sản phẩm (gõ tìm)
-   [ ] Check ID unique
-   [ ] Auto reload sau save
-   [ ] Hiển thị số lượng tồn
-   [ ] Format giá tiền

### User Authentication

-   [ ] Đăng nhập thành công
-   [ ] Đăng nhập với tài khoản bị khóa
-   [ ] Hiển thị thông báo lỗi đúng

---

## 📝 Notes

1. **ID Sản phẩm**: Dùng để đồng bộ, tránh trùng tên
2. **Auto Reload**: Không cần admin tự reload trang
3. **Số lượng tồn**: Admin nhập thay vì xem code
4. **Tìm kiếm**: Phương thức gõ tìm kiếm (live search)
5. **Toast**: Thông báo rõ ràng sau mỗi thao tác

---

## 🚀 Quick Start

1. Mở `categories.html` - Tạo loại sản phẩm
2. Mở `products-admin.html` - Thêm sản phẩm
3. Test tìm kiếm và CRUD operations
4. Test login với tài khoản khóa (`test@gmail.com`)

---

## 🎯 Pattern Summary

Hệ thống follow pattern hiện có:

-   ✅ LocalStorage for data
-   ✅ Lucide icons
-   ✅ Toast notifications
-   ✅ Form validation
-   ✅ Responsive grid layout
-   ✅ Admin header navigation
-   ✅ Event delegation
-   ✅ Auto reload after CRUD

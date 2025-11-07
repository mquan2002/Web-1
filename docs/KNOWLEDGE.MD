# Kiến thức cần nắm vững trong dự án BookStore

## 1. **HTML/CSS Cơ bản**
- Semantic HTML (header, nav, main, footer, section)
- Form elements (input, select, textarea, button)
- CSS Selectors, Flexbox, Grid
- Responsive design (media queries)
- Modal/Dialog patterns

## 2. **JavaScript Core**

### 2.1 DOM Manipulation
```javascript
// Query elements
document.querySelector('#id')
document.querySelectorAll('.class')
document.getElementById('id')

// Create & modify
element.innerHTML = '...'
element.textContent = '...'
element.classList.add/remove/toggle()
element.setAttribute()
document.createElement()
parent.appendChild(child)
```

### 2.2 Event Handling
```javascript
// Event listeners
element.addEventListener('click', callback)
element.addEventListener('submit', (e) => {
    e.preventDefault() // Ngăn form submit reload page
})
element.addEventListener('input', callback) // Live search

// Event delegation
parent.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        // Handle
    }
})
```

### 2.3 Array Methods (quan trọng!)
```javascript
// map - transform array
books.map(b => ({ id: b.id, title: b.title }))

// filter - lọc
books.filter(b => b.price > 100000)

// find - tìm 1 phần tử
books.find(b => b.id === 'abc')

// findIndex - tìm vị trí
books.findIndex(b => b.id === 'abc')

// forEach - duyệt
books.forEach(b => console.log(b.title))

// reduce - tính toán
cart.reduce((sum, item) => sum + item.qty, 0)

// sort - sắp xếp
books.sort((a, b) => a.price - b.price)

// Set - loại bỏ trùng
[...new Set(books.map(b => b.category))]
```

## 3. **LocalStorage**
```javascript
// Lưu (phải stringify object/array)
localStorage.setItem('key', JSON.stringify(data))

// Đọc (phải parse về object/array)
JSON.parse(localStorage.getItem('key') || '[]')

// Xóa
localStorage.removeItem('key')
localStorage.clear() // Xóa tất cả
```

## 4. **Async/Await & Fetch API**
```javascript
// Fetch data từ JSON
async function loadData() {
    try {
        const response = await fetch('data/books.json')
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Lỗi:', error)
    }
}

// Hoặc dùng .then()
fetch('data.json')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
```

## 5. **ES6+ Features**

### 5.1 Arrow Functions
```javascript
const add = (a, b) => a + b
const greet = name => `Hello ${name}`
```

### 5.2 Template Literals
```javascript
const html = `
    <div class="card">
        <h2>${book.title}</h2>
        <p>${book.price}đ</p>
    </div>
`
```

### 5.3 Destructuring
```javascript
const { username, password } = form
const [first, second] = array
```

### 5.4 Spread Operator
```javascript
const newBook = { ...oldBook, price: 100000 }
const allBooks = [...books, newBook]
```

### 5.5 Optional Chaining & Nullish Coalescing
```javascript
user?.profile?.avatar
const value = input || 'default'
const value = input ?? 'default' // Chỉ thay nếu null/undefined
```

## 6. **Form Handling**
```javascript
form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Lấy giá trị
    const title = form.title.value.trim()
    const price = parseInt(form.price.value)
    
    // Validation
    if (!title) {
        toast.error('Vui lòng nhập tên!')
        return
    }
    
    // Reset form
    form.reset()
})
```

## 7. **UUID Generation**
```javascript
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}
```

## 8. **Date & Time**
```javascript
new Date().toISOString() // "2025-11-07T10:30:00.000Z"
new Date().getFullYear() // 2025
```

## 9. **String Methods**
```javascript
// Normalize tiếng Việt không dấu
str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
str.replace(/đ/g, 'd')

// Case conversion
str.toLowerCase()
str.toUpperCase()

// Trim
str.trim()

// Substring
str.substring(0, 6)

// Pad
String(5).padStart(3, '0') // "005"
```

## 10. **Conditional Rendering**
```javascript
// Ternary
const html = user.locked ? '<span>Khóa</span>' : '<span>Hoạt động</span>'

// Template literal với điều kiện
const html = `
    ${user.locked 
        ? '<button>Mở khóa</button>' 
        : '<button>Khóa</button>'
    }
`
```

## 11. **Modal Pattern**
```javascript
const modal = document.getElementById('modal')

const openModal = () => {
    modal.style.display = 'flex'
}

const closeModal = () => {
    modal.style.display = 'none'
}

// Click outside to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
})
```

## 12. **Toast Notifications**
```javascript
// Hiển thị thông báo
toast.success('Thành công!')
toast.error('Lỗi!')
toast.info('Thông tin')
```

## 13. **Authentication Flow**
```javascript
// Login
const auth = { username: 'admin', role: 'admin' }
localStorage.setItem('bs_auth', JSON.stringify(auth))

// Check auth
const getAuth = () => JSON.parse(localStorage.getItem('bs_auth') || 'null')

// Logout
localStorage.removeItem('bs_auth')
window.location.href = 'login.html'

// Redirect based on role
if (auth.role === 'admin') {
    location.href = 'admin/products.html'
}
```

## 14. **Search & Filter**
```javascript
// Live search
input.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase()
    const filtered = books.filter(b => 
        b.title.toLowerCase().includes(keyword) ||
        b.author.toLowerCase().includes(keyword)
    )
    renderBooks(filtered)
})

// Filter by category
const filtered = books.filter(b => b.category === selectedCategory)

// Filter by price range
const filtered = books.filter(b => 
    b.price >= minPrice && b.price <= maxPrice
)
```

## 15. **Sort**
```javascript
// Sort by price ascending
books.sort((a, b) => a.price - b.price)

// Sort by price descending
books.sort((a, b) => b.price - a.price)

// Sort by string
books.sort((a, b) => a.title.localeCompare(b.title))
```

## 16. **CRUD Operations**

### Create
```javascript
const newBook = { id: generateUUID(), title: '...', ... }
books.push(newBook)
saveBooks(books)
```

### Read
```javascript
const books = getBooks()
const book = books.find(b => b.id === id)
```

### Update
```javascript
const index = books.findIndex(b => b.id === id)
if (index >= 0) {
    books[index] = { ...books[index], ...updatedData }
    saveBooks(books)
}
```

### Delete
```javascript
const filtered = books.filter(b => b.id !== id)
saveBooks(filtered)
```

## 17. **Data Flow trong Project**

```
1. Page Load
   ↓
2. main.js init()
   ↓
3. initGlobalData()
   - Load categories.json → localStorage bs_categories
   - Load books.json → localStorage books
   - Load users.json → localStorage bs_users
   ↓
4. Admin pages render từ localStorage
   ↓
5. User CRUD
   ↓
6. Update localStorage
   ↓
7. Re-render UI
```

## 18. **Project Structure**
```
/admin/          - Trang admin (products, categories, users)
/user/           - Trang user (cart, details, products)
/js/admin/       - JS cho admin
/js/user/        - JS cho user
/js/main.js      - Shared logic
/data/           - JSON data files
```

## 19. **Icon Library (Lucide)**
```javascript
// Sử dụng icon
<i data-lucide="lock"></i>
<i data-lucide="edit"></i>
<i data-lucide="trash"></i>

// Init icons sau khi render
lucide.createIcons()
```

## 20. **Best Practices**
- ✅ Validate input trước khi lưu
- ✅ Trim() string input
- ✅ Dùng const/let, không dùng var
- ✅ Kiểm tra null/undefined
- ✅ Dùng try-catch cho async
- ✅ DRY - Don't Repeat Yourself
- ✅ Meaningful variable names
- ✅ Comment code phức tạp
- ✅ Console.log để debug

---

**Tổng kết:** Nắm vững 20 phần này là đủ làm được full project này! 🚀
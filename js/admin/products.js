// products.js - Quản lý sản phẩm (sách)
document.addEventListener('DOMContentLoaded', async () => {
    // Khởi tạo Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons()
    }

    const bookTableBody = document.getElementById('bookTableBody')
    const noBooksMsg = document.getElementById('noBooks')
    const form = document.getElementById('bookForm')
    const logoutBtn = document.getElementById('logoutBtn')
    const searchInput = document.getElementById('searchInput')
    const cancelBtn = document.getElementById('cancelBtn')
    const categorySelect = document.getElementById('category')
    const modal = document.getElementById('productModal')
    const modalTitle = document.getElementById('modalTitle')
    const addProductBtn = document.getElementById('addProductBtn')
    const closeModal = document.getElementById('closeModal')

    // Lấy danh sách sản phẩm từ localStorage
    const getBooks = () => {
        return JSON.parse(localStorage.getItem('books') || '[]')
    }

    // Lưu danh sách sản phẩm
    const saveBooks = (books) => {
        localStorage.setItem('books', JSON.stringify(books))
    }

    // Lấy danh sách loại sản phẩm
    const getCategories = () => {
        return JSON.parse(localStorage.getItem('bs_categories') || '[]')
    }

    // Load categories vào select
    const loadCategories = () => {
        const categories = getCategories().filter((c) => c.status === 'active')
        categorySelect.innerHTML = '<option value="">-- Chọn loại --</option>'

        categories.forEach((cat) => {
            const option = document.createElement('option')
            option.value = cat.name
            option.textContent = cat.name
            categorySelect.appendChild(option)
        })
    }

    // Format tiền
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount)
    }

    // Tạo UUID
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                const r = (Math.random() * 16) | 0
                const v = c === 'x' ? r : (r & 0x3) | 0x8
                return v.toString(16)
            }
        )
    }

    // Reset form
    const resetForm = () => {
        form.reset()
        form.bookId.value = ''
        modalTitle.textContent = 'Thêm Sản phẩm'
    }

    // Mở modal
    const openModal = () => {
        modal.classList.add('show')
        if (typeof lucide !== 'undefined') {
            lucide.createIcons()
        }
    }

    // Đóng modal
    const closeModalFunc = () => {
        modal.classList.remove('show')
        resetForm()
    }

    // Render danh sách sản phẩm
    const renderBooks = (filter = '') => {
        const books = getBooks()

        const filtered = books.filter((book) => {
            const searchStr = filter.toLowerCase()
            return (
                (book.code || '').toLowerCase().includes(searchStr) ||
                book.title.toLowerCase().includes(searchStr) ||
                book.author.toLowerCase().includes(searchStr) ||
                book.category.toLowerCase().includes(searchStr) ||
                (book.description || '').toLowerCase().includes(searchStr)
            )
        })

        if (filtered.length === 0) {
            bookTableBody.innerHTML = ''
            noBooksMsg.style.display = 'block'
            return
        }

        noBooksMsg.style.display = 'none'
        bookTableBody.innerHTML = ''

        filtered.forEach((book, index) => {
            const tr = document.createElement('tr')

            // Status badge
            const statusClass =
                book.status === 'hidden' ? 'status-locked' : 'status-active'
            const statusText = book.status === 'hidden' ? 'Ẩn' : 'Hiển thị'
            const statusIcon = book.status === 'hidden' ? 'eye-off' : 'eye'

            // Stock badge
            const stock = book.stock || 0
            let stockBadge = ''
            if (stock <= 0) {
                stockBadge =
                    '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">Hết hàng</span>'
            } else if (stock < 10) {
                stockBadge = `<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${stock}</span>`
            } else {
                stockBadge = `<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${stock}</span>`
            }

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${book.code || book.id}</strong></td>
                <td>${book.title}</td>
                <td>${book.category}</td>
                <td>${book.author}</td>
                <td>${formatMoney(book.price)}</td>
                <td style="text-align: center;">${stockBadge}</td>
                <td style="text-align: center;">
                    ${
                        book.image
                            ? `<img src="${book.image}" alt="${book.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />`
                            : '<span style="color: #999;">Không có</span>'
                    }
                </td>
                <td>
                    <span class="user-status ${statusClass}">
                        <i data-lucide="${statusIcon}"></i>
                        ${statusText}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" data-id="${
                            book.id
                        }">
                            <i data-lucide="edit"></i>
                            Sửa
                        </button>
                        <button class="btn-action btn-delete" data-id="${
                            book.id
                        }" style="background: #ef4444;">
                            <i data-lucide="trash-2"></i>
                            Xóa
                        </button>
                        ${
                            book.status === 'active' || !book.status
                                ? `<button class="btn-action btn-toggle" data-id="${book.id}" data-action="hide" style="background: #f59e0b;">
                                    <i data-lucide="eye-off"></i>
                                    Ẩn
                                </button>`
                                : `<button class="btn-action btn-toggle" data-id="${book.id}" data-action="show" style="background: #10b981;">
                                    <i data-lucide="eye"></i>
                                    Hiện
                                </button>`
                        }
                    </div>
                </td>
            `

            bookTableBody.appendChild(tr)
        })

        // Gán sự kiện cho các nút
        attachEventListeners()

        // Khởi tạo lại Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons()
        }
    }

    // Gán sự kiện cho các nút
    const attachEventListeners = () => {
        // Sửa
        document.querySelectorAll('.btn-edit').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id
                editBook(id)
            })
        })

        // Xóa
        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id
                deleteBook(id)
            })
        })

        // Ẩn/Hiện
        document.querySelectorAll('.btn-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id
                const action = btn.dataset.action
                toggleBook(id, action)
            })
        })
    }

    // Sửa sản phẩm - hiển thị đúng thông tin trước khi sửa
    const editBook = (id) => {
        const books = getBooks()
        const book = books.find((b) => b.id == id)

        if (!book) return

        // Điền dữ liệu vào form
        form.bookId.value = book.id
        form.productCode.value = book.code || book.id
        form.title.value = book.title
        form.author.value = book.author
        form.price.value = book.price
        form.category.value = book.category
        form.stock.value = book.stock || 0
        form.image.value = book.image || ''
        form.description.value = book.description || ''

        modalTitle.textContent = `Sửa: ${book.title}`

        // Mở modal
        openModal()
    }

    // Xóa sản phẩm
    const deleteBook = (id) => {
        const books = getBooks()
        const book = books.find((b) => b.id == id)

        if (!book) return

        if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${book.title}"?`)) {
            return
        }

        const filtered = books.filter((b) => b.id != id)
        saveBooks(filtered)
        toast.success('Đã xóa sản phẩm!')
        renderBooks(searchInput.value)
    }

    // Ẩn/Hiện sản phẩm
    const toggleBook = (id, action) => {
        const books = getBooks()
        const index = books.findIndex((b) => b.id == id)

        if (index === -1) return

        const newStatus = action === 'hide' ? 'hidden' : 'active'
        books[index].status = newStatus
        saveBooks(books)

        toast.success(
            newStatus === 'hidden' ? 'Đã ẩn sản phẩm!' : 'Đã hiển thị sản phẩm!'
        )
        renderBooks(searchInput.value)
    }

    // Xử lý submit form
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const id = form.bookId.value || generateUUID()
        const code = form.productCode.value.trim()

        const newBook = {
            id: id,
            code: code || id,
            title: form.title.value.trim(),
            author: form.author.value.trim(),
            price: parseInt(form.price.value),
            category: form.category.value,
            stock: parseInt(form.stock.value) || 0,
            image:
                form.image.value.trim() ||
                'https://via.placeholder.com/100x150',
            description: form.description.value.trim(),
            status: 'active',
        }

        const books = getBooks()
        const index = books.findIndex((b) => b.id == id)

        // Kiểm tra trùng mã (nếu có mã)
        if (code) {
            const duplicateCode = books.find(
                (b) =>
                    b.code &&
                    b.code.toLowerCase() === code.toLowerCase() &&
                    b.id != id
            )

            if (duplicateCode) {
                toast.error('Mã sản phẩm đã tồn tại!')
                return
            }
        }

        // Validate
        if (!newBook.category) {
            toast.error('Vui lòng chọn loại sản phẩm!')
            return
        }

        if (index >= 0) {
            // Sửa
            books[index] = { ...books[index], ...newBook }
        } else {
            // Thêm mới
            books.push(newBook)
        }

        saveBooks(books)
        renderBooks(searchInput.value) // Auto reload
        resetForm()
        closeModalFunc()
        toast.success(
            index >= 0 ? 'Đã cập nhật sản phẩm!' : 'Đã thêm sản phẩm mới!'
        )
    })

    // Tìm kiếm động (phương thức gõ tìm kiếm)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderBooks(e.target.value)
        })
    }

    // Nút hủy
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModalFunc)
    }

    // Nút thêm sản phẩm
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            resetForm()
            openModal()
        })
    }

    // Nút đóng modal
    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc)
    }

    // Click ngoài modal để đóng
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc()
        }
    })

    // Đăng xuất
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault()
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('bs_auth')
                window.location.href = '../index.html'
            }
        })
    }

    // Khởi tạo (data đã được init từ main.js - categories trước, books sau)
    loadCategories()
    renderBooks()
})

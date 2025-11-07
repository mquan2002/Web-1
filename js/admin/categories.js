// categories.js - Quản lý loại sản phẩm
document.addEventListener('DOMContentLoaded', async () => {
    // Khởi tạo Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons()
    }

    const categoryTableBody = document.getElementById('categoryTableBody')
    const noCategoriesMsg = document.getElementById('noCategories')
    const form = document.getElementById('categoryForm')
    const logoutBtn = document.getElementById('logoutBtn')
    const searchInput = document.getElementById('searchInput')
    const cancelBtn = document.getElementById('cancelBtn')
    const modal = document.getElementById('categoryModal')
    const modalTitle = document.getElementById('modalTitle')
    const addCategoryBtn = document.getElementById('addCategoryBtn')
    const closeModal = document.getElementById('closeModal')

    // Lấy danh sách loại sản phẩm từ localStorage
    const getCategories = () => {
        return JSON.parse(localStorage.getItem('bs_categories') || '[]')
    }

    // Lưu danh sách loại sản phẩm
    const saveCategories = (categories) => {
        localStorage.setItem('bs_categories', JSON.stringify(categories))
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
        form.categoryId.value = ''
        modalTitle.textContent = 'Thêm Loại Sản phẩm'
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

    // Render danh sách loại sản phẩm
    const renderCategories = (filter = '') => {
        const categories = getCategories()
        const filtered = categories.filter((cat) => {
            const searchStr = filter.toLowerCase()
            return (
                cat.code.toLowerCase().includes(searchStr) ||
                cat.name.toLowerCase().includes(searchStr) ||
                (cat.description || '').toLowerCase().includes(searchStr)
            )
        })

        if (filtered.length === 0) {
            categoryTableBody.innerHTML = ''
            noCategoriesMsg.style.display = 'block'
            return
        }

        noCategoriesMsg.style.display = 'none'
        categoryTableBody.innerHTML = ''

        filtered.forEach((category, index) => {
            const tr = document.createElement('tr')

            const statusClass =
                category.status === 'hidden' ? 'status-locked' : 'status-active'
            const statusText = category.status === 'hidden' ? 'Ẩn' : 'Hiển thị'
            const statusIcon = category.status === 'hidden' ? 'eye-off' : 'eye'

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${category.code}</strong></td>
                <td>${category.name}</td>
                <td style="max-width: 300px;">${
                    category.description ||
                    '<em style="color: #999;">Không có mô tả</em>'
                }</td>
                <td>
                    <span class="user-status ${statusClass}">
                        <i data-lucide="${statusIcon}"></i>
                        ${statusText}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" data-id="${
                            category.id
                        }">
                            <i data-lucide="edit"></i>
                            Sửa
                        </button>
                        <button class="btn-action btn-delete" data-id="${
                            category.id
                        }" style="background: #ef4444;">
                            <i data-lucide="trash-2"></i>
                            Xóa
                        </button>
                        ${
                            category.status === 'active'
                                ? `<button class="btn-action btn-toggle" data-id="${category.id}" data-action="hide" style="background: #f59e0b;">
                                    <i data-lucide="eye-off"></i>
                                    Ẩn
                                </button>`
                                : `<button class="btn-action btn-toggle" data-id="${category.id}" data-action="show" style="background: #10b981;">
                                    <i data-lucide="eye"></i>
                                    Hiện
                                </button>`
                        }
                    </div>
                </td>
            `

            categoryTableBody.appendChild(tr)
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
                editCategory(id)
            })
        })

        // Xóa
        document.querySelectorAll('.btn-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id
                deleteCategory(id)
            })
        })

        // Ẩn/Hiện
        document.querySelectorAll('.btn-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id
                const action = btn.dataset.action
                toggleCategory(id, action)
            })
        })
    }

    // Sửa loại sản phẩm
    const editCategory = (id) => {
        const categories = getCategories()
        const category = categories.find((c) => c.id === id)

        if (!category) return

        // Điền dữ liệu vào form
        form.categoryId.value = category.id
        form.categoryCode.value = category.code
        form.categoryName.value = category.name
        form.categoryDescription.value = category.description || ''

        modalTitle.textContent = `Sửa: ${category.name}`

        // Mở modal
        openModal()
    }

    // Xóa loại sản phẩm
    const deleteCategory = (id) => {
        const categories = getCategories()
        const category = categories.find((c) => c.id === id)

        if (!category) return

        if (!confirm(`Bạn có chắc muốn xóa loại "${category.name}"?`)) {
            return
        }

        const filtered = categories.filter((c) => c.id !== id)
        saveCategories(filtered)
        toast.success('Đã xóa loại sản phẩm!')
        renderCategories(searchInput.value)
    }

    // Ẩn/Hiện loại sản phẩm
    const toggleCategory = (id, action) => {
        const categories = getCategories()
        const index = categories.findIndex((c) => c.id === id)

        if (index === -1) return

        const newStatus = action === 'hide' ? 'hidden' : 'active'
        categories[index].status = newStatus
        saveCategories(categories)

        toast.success(
            newStatus === 'hidden'
                ? 'Đã ẩn loại sản phẩm!'
                : 'Đã hiển thị loại sản phẩm!'
        )
        renderCategories(searchInput.value)
    }

    // Xử lý submit form
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const id = form.categoryId.value || generateUUID()
        const newCategory = {
            id: id,
            code: form.categoryCode.value.trim(),
            name: form.categoryName.value.trim(),
            description: form.categoryDescription.value.trim(),
            status: 'active',
            createdAt: new Date().toISOString(),
        }

        const categories = getCategories()
        const index = categories.findIndex((c) => c.id === id)

        // Kiểm tra trùng mã
        const duplicateCode = categories.find(
            (c) =>
                c.code.toLowerCase() === newCategory.code.toLowerCase() &&
                c.id !== id
        )

        if (duplicateCode) {
            toast.error('Mã loại sản phẩm đã tồn tại!')
            return
        }

        if (index >= 0) {
            // Sửa
            categories[index] = { ...categories[index], ...newCategory }
        } else {
            // Thêm mới
            categories.push(newCategory)
        }

        saveCategories(categories)
        renderCategories(searchInput.value)
        resetForm()
        closeModalFunc()
        toast.success(
            index >= 0
                ? 'Đã cập nhật loại sản phẩm!'
                : 'Đã thêm loại sản phẩm mới!'
        )
    })

    // Tìm kiếm động
    searchInput.addEventListener('input', (e) => {
        renderCategories(e.target.value)
    })

    // Nút hủy
    cancelBtn.addEventListener('click', closeModalFunc)

    // Nút thêm loại
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
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

    // Khởi tạo (data đã được init từ main.js - categories đã được tạo trước books)
    renderCategories()
})

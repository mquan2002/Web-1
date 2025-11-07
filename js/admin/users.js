// users.js - Quản lý người dùng
document.addEventListener('DOMContentLoaded', async () => {
    const usersTableBody = document.getElementById('usersTableBody')
    const noUsersMsg = document.getElementById('noUsers')
    const logoutBtn = document.getElementById('logoutBtn')

    // Lấy danh sách người dùng từ localStorage
    const getUsers = () => {
        return JSON.parse(localStorage.getItem('bs_users') || '[]')
    }

    // Kiểm tra và load mock data từ users.json nếu localStorage trống
    const initMockData = async () => {
        const existingUsers = getUsers()
        console.log('Existing users in localStorage:', existingUsers)

        if (existingUsers.length === 0) {
            try {
                const response = await fetch('../data/users.json')
                const mockUsers = await response.json()
                saveUsers(mockUsers)
                console.log('Đã load mock data từ users.json:', mockUsers)
            } catch (error) {
                console.log('Không thể load mock users từ file JSON:', error)
            }
        } else {
            console.log('Using existing data from localStorage')
        }
    }

    // Lưu danh sách người dùng vào localStorage
    const saveUsers = (users) => {
        localStorage.setItem('bs_users', JSON.stringify(users))
    }

    // Hiển thị danh sách người dùng
    const renderUsers = () => {
        const users = getUsers()

        if (users.length === 0) {
            usersTableBody.innerHTML = ''
            noUsersMsg.style.display = 'block'
            return
        }

        noUsersMsg.style.display = 'none'
        usersTableBody.innerHTML = ''

        users.forEach((user, index) => {
            const tr = document.createElement('tr')

            const statusText = user.locked ? 'Đã khóa' : 'Đang hoạt động'
            const statusIcon = user.locked ? 'lock' : 'check-circle'
            const statusClass = user.locked ? 'status-locked' : 'status-active'

            tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td><span class="password-mask">${'**********'}</span></td>
        <td>
          <span class="user-status ${statusClass}">
            <i data-lucide="${statusIcon}"></i>
            ${statusText}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-action btn-reset" data-username="${
                user.username
            }">
              <i data-lucide="key"></i>
              Reset mật khẩu
            </button>
            ${
                user.locked
                    ? `<button class="btn-action btn-unlock" data-username="${user.username}">
                        <i data-lucide="unlock"></i>
                        Mở khóa
                      </button>`
                    : `<button class="btn-action btn-lock" data-username="${user.username}">
                        <i data-lucide="lock"></i>
                        Khóa tài khoản
                      </button>`
            }
          </div>
        </td>
      `

            usersTableBody.appendChild(tr)
        })

        // Gán sự kiện cho các nút
        attachEventListeners()

        // Khởi tạo Lucide icons để chuyển đổi các thẻ <i data-lucide="icon-name"> thành SVG thật.
        if (typeof lucide !== 'undefined') {
            lucide.createIcons()
        }
    }

    // Gán sự kiện cho các nút
    const attachEventListeners = () => {
        // Reset password
        document.querySelectorAll('.btn-reset').forEach((btn) => {
            btn.addEventListener('click', () => {
                const username = btn.dataset.username
                resetPassword(username)
            })
        })

        // Lock account
        document.querySelectorAll('.btn-lock').forEach((btn) => {
            btn.addEventListener('click', () => {
                const username = btn.dataset.username
                toggleLock(username, true)
            })
        })

        // Unlock account
        document.querySelectorAll('.btn-unlock').forEach((btn) => {
            btn.addEventListener('click', () => {
                const username = btn.dataset.username
                toggleLock(username, false)
            })
        })
    }

    // Reset password
    const resetPassword = (username) => {
        const newPassword = prompt(
            `Nhập mật khẩu mới cho người dùng "${username}":`
        )

        if (!newPassword) {
            return
        }

        if (newPassword.length < 3) {
            toast.error('Mật khẩu phải có ít nhất 3 ký tự!')
            return
        }

        const users = getUsers()
        const userIndex = users.findIndex((u) => u.username === username)

        if (userIndex !== -1) {
            users[userIndex].password = newPassword
            saveUsers(users)
            toast.success(`Đã reset mật khẩu cho người dùng "${username}"`)
            renderUsers()
        }
    }

    // Lock/Unlock account
    const toggleLock = (username, lock) => {
        const action = lock ? 'khóa' : 'mở khóa'
        if (
            !confirm(`Bạn có chắc chắn muốn ${action} tài khoản "${username}"?`)
        ) {
            return
        }

        const users = getUsers()
        const userIndex = users.findIndex((u) => u.username === username)

        if (userIndex !== -1) {
            users[userIndex].locked = lock
            saveUsers(users)
            toast.success(`Đã ${action} tài khoản "${username}"`)
            renderUsers()
        }
    }

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

    // Khởi tạo
    await initMockData()
    renderUsers()
})

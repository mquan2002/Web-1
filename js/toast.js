// toast.js - Reusable Toast Notification Component
class Toast {
    constructor() {
        this.container = null
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init())
        } else {
            this.init()
        }
    }

    init() {
        // Create container if not exists
        let container = document.getElementById('toastContainer')
        if (!container) {
            container = document.createElement('div')
            container.id = 'toastContainer'
            container.className = 'toast-container'
            document.body.appendChild(container)
            console.log('Toast container created')
        }
        this.container = container
        console.log('Toast initialized, container:', this.container)
    }

    show(message, type = 'info', duration = 5000) {
        console.log('Toast show called:', message, type)

        if (!this.container) {
            console.error('Toast container not initialized')
            return
        }

        const toast = document.createElement('div')
        toast.className = `toast ${type}`

        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            info: 'info',
            warning: 'alert-triangle',
        }

        const titles = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông báo',
        }

        toast.innerHTML = `
            <i data-lucide="${icons[type]}" class="toast-icon"></i>
            <div class="toast-content">
                <strong>${titles[type]}</strong>
                <div>${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        `

        this.container.appendChild(toast)

        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons()
        }

        // Auto remove after duration
        setTimeout(() => {
            this.remove(toast)
        }, duration)
    }

    remove(toast) {
        toast.style.animation = 'slideOut 0.3s ease-out'
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove()
            }
        }, 300)
    }

    success(message, duration) {
        this.show(message, 'success', duration)
    }

    error(message, duration) {
        this.show(message, 'error', duration)
    }

    warning(message, duration) {
        this.show(message, 'warning', duration)
    }

    info(message, duration) {
        this.show(message, 'info', duration)
    }
}

// Export global instance
window.toast = new Toast()

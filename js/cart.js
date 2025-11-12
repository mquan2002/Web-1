// cart.js - Cart Preview functionality
// Thêm file này vào cuối body của các trang cần cart preview

(function() {
  'use strict';

  // Helper functions
  const getCart = () => JSON.parse(localStorage.getItem('bs_cart') || '[]');
  const money = v => new Intl.NumberFormat('vi-VN').format(v) + '₫';

  // Lấy dữ liệu sách từ localStorage hoặc từ biến BOOKS global
  const getBooks = () => {
    // Nếu có biến BOOKS global từ main.js
    if (typeof BOOKS !== 'undefined' && BOOKS.length > 0) {
      return BOOKS;
    }
    // Nếu không thì lấy từ localStorage
    return JSON.parse(localStorage.getItem('books') || '[]');
  };

  function updateCartPreview() {
    const cart = getCart();
    const books = getBooks();
    
    // Cập nhật số lượng trong icon giỏ hàng
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountEls = document.querySelectorAll('#cart-count');
    cartCountEls.forEach(el => {
      if (el) el.textContent = totalQty;
    });

    // Tìm hoặc tạo cart preview container
    let previewContainer = document.querySelector('.cart-preview');
    
    if (!previewContainer) {
      // Tạo cart preview nếu chưa có
      const cartLink = document.querySelector('#cart-link');
      if (!cartLink) return;

      // Kiểm tra nếu đã có cart-container
      let wrapper = cartLink.closest('.cart-container');
      
      if (!wrapper) {
        // Wrap cart link trong container
        wrapper = document.createElement('div');
        wrapper.className = 'cart-container';
        cartLink.parentNode.insertBefore(wrapper, cartLink);
        wrapper.appendChild(cartLink);
      }

      // Tạo preview element
      previewContainer = document.createElement('div');
      previewContainer.className = 'cart-preview';
      wrapper.appendChild(previewContainer);
    }

    // Render nội dung preview
    if (cart.length === 0) {
      previewContainer.innerHTML = `
        <div class="cart-preview-header">
          <h3>Giỏ hàng</h3>
          <span class="cart-preview-count">0 sản phẩm</span>
        </div>
        <div class="cart-preview-empty">
          <div class="icon">🛒</div>
          <p>Giỏ hàng của bạn đang trống</p>
        </div>
      `;
      return;
    }

    // Tính toán chi tiết giỏ hàng
    const cartItems = cart.map(item => {
      const book = books.find(b => b.id === item.id);
      return {
        id: item.id,
        qty: item.qty,
        title: book ? book.title : 'Sản phẩm',
        author: book ? book.author : '',
        price: book ? book.price : 0,
        cover: book ? book.cover || book.image : 'https://via.placeholder.com/60x80'
      };
    });

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Check auth status
    const auth = typeof getAuth === 'function' ? getAuth() : null;

    // Render header
    let html = `
      <div class="cart-preview-header">
        <h3>Giỏ hàng</h3>
        <span class="cart-preview-count">${totalQty} sản phẩm</span>
      </div>
    `;

    // Render items
    html += '<div class="cart-preview-items">';
    cartItems.forEach(item => {
      html += `
        <a href="details.html?id=${item.id}" class="cart-preview-item" style="text-decoration: none; color: inherit;">
          <img src="${item.cover}" alt="${item.title}">
          <div class="cart-preview-item-info">
            <div class="cart-preview-item-title">${item.title}</div>
            <div class="cart-preview-item-meta">
              <span class="cart-preview-item-qty">SL: ${item.qty}</span>
              <span class="cart-preview-item-price">${money(item.price * item.qty)}</span>
            </div>
          </div>
        </a>
      `;
    });
    html += '</div>';

    // Render footer
    html += `
      <div class="cart-preview-footer">
        <div class="cart-preview-subtotal">
          <span>Tạm tính:</span>
          <span>${money(subtotal)}</span>
        </div>
        ${!auth ? '<div style="color:#e81123;font-size:0.85rem;text-align:center;margin-bottom:12px;">⚠️ Cần đăng nhập để thanh toán</div>' : ''}
        <div class="cart-preview-actions">
          <a href="cart.html" class="cart-preview-btn view-cart">Xem giỏ hàng</a>
          ${auth ? 
            '<a href="checkout.html" class="cart-preview-btn checkout">Thanh toán</a>' :
            '<a href="login.html" class="cart-preview-btn checkout" onclick="sessionStorage.setItem(\'redirect_after_login\', \'checkout.html\')">Đăng nhập</a>'
          }
        </div>
      </div>
    `;

    previewContainer.innerHTML = html;
  }

  // Khởi tạo cart preview khi DOM ready
  function initCartPreview() {
    updateCartPreview();
    
    // Không cần event listeners phức tạp, CSS :hover sẽ xử lý
    // Chỉ cần đảm bảo preview có thể tương tác được
    
    // Lắng nghe sự kiện thay đổi localStorage từ các tab khác
    window.addEventListener('storage', (e) => {
      if (e.key === 'bs_cart') {
        updateCartPreview();
      }
    });

    // Lắng nghe sự kiện custom để cập nhật từ cùng trang
    window.addEventListener('cartUpdated', () => {
      updateCartPreview();
    });
  }

  // Chạy khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPreview);
  } else {
    initCartPreview();
  }

  // Export function để các file khác có thể gọi
  window.updateCartPreview = updateCartPreview;
})();
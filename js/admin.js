// ============= ADMIN AUTHENTICATION =============
function checkAdminAuth() {
  const adminAuth = localStorage.getItem('bs_admin_session');
  if (!adminAuth) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// ============= TAB SWITCHING =============
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const tabEl = document.getElementById(tabName);
  if (tabEl) {
    tabEl.classList.add('active');
  }
  
  // Add active to clicked button
  if (event && event.target) {
    event.target.classList.add('active');
  }
  
  // Load data based on tab
  if (tabName === 'products') renderProducts();
  if (tabName === 'categories') renderCategories();
  if (tabName === 'orders') renderOrders();
  if (tabName === 'users') renderUsers();
  if (tabName === 'dashboard') updateDashboard();
}

// ============= STORAGE HELPERS =============
const getCategories = () => JSON.parse(localStorage.getItem('bs_categories') || '[]');
const saveCategories = (cat) => localStorage.setItem('bs_categories', JSON.stringify(cat));

const getProducts = () => {
  // Check if custom products exist, otherwise load from BOOKS
  const custom = localStorage.getItem('bs_products');
  if (custom) return JSON.parse(custom);
  return BOOKS || [];
};
const saveProducts = (prod) => localStorage.setItem('bs_products', JSON.stringify(prod));

const getOrders = () => JSON.parse(localStorage.getItem('orders') || '[]');

// ============= PRODUCTS MANAGEMENT =============
let currentEditProductId = null;
let adminCurrentPage = 1;
const adminItemsPerPage = 8;
let adminFilteredProducts = [];

function loadProductCategories() {
  const categories = getCategories();
  const selects = ['#productCategory', '#categoryFilter'];
  
  selects.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.innerHTML = '<option value="">-- Chọn thể loại --</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = cat.name;
      el.appendChild(opt);
    });
  });
}

function renderProducts() {
  const products = getProducts();
  const tbody = document.querySelector('#productTable tbody');
  const searchVal = document.querySelector('#productSearch')?.value?.toLowerCase() || '';
  const categoryFilter = document.querySelector('#categoryFilter')?.value || '';
  
  let filtered = products;
  
  if (searchVal) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchVal) || 
      p.author.toLowerCase().includes(searchVal)
    );
  }
  
  if (categoryFilter) {
    filtered = filtered.filter(p => p.category === categoryFilter);
  }
  
  adminFilteredProducts = filtered;
  adminCurrentPage = 1;
  
  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / adminItemsPerPage);
  const startIdx = (adminCurrentPage - 1) * adminItemsPerPage;
  const endIdx = startIdx + adminItemsPerPage;
  const paginatedList = filtered.slice(startIdx, endIdx);
  
  tbody.innerHTML = paginatedList.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.author}</td>
      <td>${p.price?.toLocaleString('vi-VN')}₫</td>
      <td>${p.category}</td>
      <td><img src="${p.cover || p.image}" alt="${p.title}" style="max-width:50px;border-radius:4px;" onerror="this.src='https://via.placeholder.com/50x70'" /></td>
      <td>
        <button class="btn btn-edit" onclick="editProduct('${p.id}')">✏️</button>
        <button class="btn btn-delete" onclick="deleteProduct('${p.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
  
  // Render pagination
  renderAdminPagination(totalItems, 'products');
}

function renderAdminPagination(totalItems, type) {
  const totalPages = Math.ceil(totalItems / adminItemsPerPage);
  const containerSelector = type === 'products' ? '#productTable' : '#orderTable';
  let paginationEl = document.querySelector(containerSelector).parentNode.querySelector('.admin-pagination');
  
  if (!paginationEl) {
    paginationEl = document.createElement('div');
    paginationEl.className = 'admin-pagination';
    paginationEl.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:20px;align-items:center';
    document.querySelector(containerSelector).parentNode.appendChild(paginationEl);
  }
  
  paginationEl.innerHTML = `
    <button onclick="adminPrevPage('${type}')" ${adminCurrentPage === 1 ? 'disabled' : ''} class="btn">← Trước</button>
    <span style="font-weight:600">Trang ${adminCurrentPage} / ${totalPages}</span>
    <button onclick="adminNextPage('${type}')" ${adminCurrentPage === totalPages ? 'disabled' : ''} class="btn">Sau →</button>
  `;
}

function adminPrevPage(type) {
  if (adminCurrentPage > 1) {
    adminCurrentPage--;
    if (type === 'products') renderProducts();
    if (type === 'orders') renderOrders();
  }
}

function adminNextPage(type) {
  const filtered = type === 'products' ? adminFilteredProducts : getOrders();
  const totalPages = Math.ceil(filtered.length / adminItemsPerPage);
  if (adminCurrentPage < totalPages) {
    adminCurrentPage++;
    if (type === 'products') renderProducts();
    if (type === 'orders') renderOrders();
  }
}

function editProduct(id) {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  
  if (product) {
    document.getElementById('productId').value = product.id;
    document.getElementById('productTitle').value = product.title;
    document.getElementById('productAuthor').value = product.author;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.cover || product.image;
    document.getElementById('productDesc').value = product.desc || product.description || '';
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
    currentEditProductId = id;
  }
}

function deleteProduct(id) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderProducts();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Check admin auth
  checkAdminAuth();
  
  // Update dashboard
  updateDashboard();
  
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('bs_admin_session');
    localStorage.removeItem('bs_auth');
    window.location.href = 'admin-login.html';
  });
  
  // ============= PRODUCTS FORM =============
  const productForm = document.getElementById('productForm');
  if (productForm) {
    // Load categories
    loadProductCategories();
    
    // Add product
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('productId').value || 'p' + Date.now();
      const product = {
        id: id,
        title: document.getElementById('productTitle').value,
        author: document.getElementById('productAuthor').value,
        price: parseInt(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        cover: document.getElementById('productImage').value || 'https://via.placeholder.com/100x150',
        image: document.getElementById('productImage').value || 'https://via.placeholder.com/100x150',
        desc: document.getElementById('productDesc').value
      };
      
      let products = getProducts();
      const idx = products.findIndex(p => p.id === id);
      
      if (idx >= 0) {
        products[idx] = { ...products[idx], ...product };
      } else {
        products.push(product);
      }
      
      saveProducts(products);
      renderProducts();
      productForm.reset();
      document.getElementById('productId').value = '';
      currentEditProductId = null;
      alert('✅ Lưu sản phẩm thành công!');
    });
    
    // Search and filter
    document.getElementById('productSearch').addEventListener('input', renderProducts);
    document.getElementById('categoryFilter').addEventListener('change', renderProducts);
    
    // Initial render
    renderProducts();
  }
  
  // ============= CATEGORIES MANAGEMENT =============
  const categoryForm = document.getElementById('categoryForm');
  if (categoryForm) {
    categoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('categoryId').value || 'cat' + Date.now();
      const category = {
        id: id,
        name: document.getElementById('categoryName').value,
        desc: document.getElementById('categoryDesc').value
      };
      
      let categories = getCategories();
      const idx = categories.findIndex(c => c.id === id);
      
      if (idx >= 0) {
        categories[idx] = category;
      } else {
        categories.push(category);
      }
      
      saveCategories(categories);
      loadProductCategories();
      renderCategories();
      categoryForm.reset();
      document.getElementById('categoryId').value = '';
      alert('✅ Lưu danh mục thành công!');
    });
    
    renderCategories();
  }
});

function renderCategories() {
  const categories = getCategories();
  const tbody = document.querySelector('#categoryTable tbody');
  
  tbody.innerHTML = categories.map(cat => `
    <tr>
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td>${cat.desc}</td>
      <td>
        <button class="btn btn-edit" onclick="editCategory('${cat.id}')">✏️</button>
        <button class="btn btn-delete" onclick="deleteCategory('${cat.id}')">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function editCategory(id) {
  const categories = getCategories();
  const category = categories.find(c => c.id === id);
  
  if (category) {
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDesc').value = category.desc;
    document.getElementById('categoryForm').scrollIntoView({ behavior: 'smooth' });
  }
}

function deleteCategory(id) {
  if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
    let categories = getCategories();
    categories = categories.filter(c => c.id !== id);
    saveCategories(categories);
    renderCategories();
  }
}

// ============= ORDERS MANAGEMENT =============
function renderOrders() {
  const orders = getOrders();
  const tbody = document.querySelector('#orderTable tbody');
  const searchVal = document.querySelector('#orderSearch')?.value?.toLowerCase() || '';
  const statusFilter = document.querySelector('#orderStatusFilter')?.value || '';
  
  let filtered = orders;
  
  if (searchVal) {
    filtered = filtered.filter(o => 
      o.id.toLowerCase().includes(searchVal) || 
      (o.shippingAddress && o.shippingAddress.fullname && o.shippingAddress.fullname.toLowerCase().includes(searchVal))
    );
  }
  
  if (statusFilter) {
    filtered = filtered.filter(o => o.status === statusFilter);
  }
  
  adminFilteredProducts = filtered;
  
  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / adminItemsPerPage);
  const startIdx = (adminCurrentPage - 1) * adminItemsPerPage;
  const endIdx = startIdx + adminItemsPerPage;
  const paginatedList = filtered.slice(startIdx, endIdx);
  
  tbody.innerHTML = paginatedList.map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.date}</td>
      <td>${o.shippingAddress.fullname}</td>
      <td>${o.total.toLocaleString('vi-VN')}₫</td>
      <td><span class="status-badge status-${o.status === 'Đang xử lý' ? 'pending' : o.status === 'Đã gửi' ? 'shipped' : 'delivered'}">${o.status}</span></td>
      <td>
        <button class="btn btn-primary" onclick="viewOrderDetail('${o.id}')">👁️</button>
        <select class="btn" style="padding:6px;font-size:0.85rem;" onchange="updateOrderStatus('${o.id}', this.value)">
          <option value="">-- Cập nhật --</option>
          <option value="Đang xử lý">Đang xử lý</option>
          <option value="Đã gửi">Đã gửi</option>
          <option value="Đã giao">Đã giao</option>
        </select>
      </td>
    </tr>
  `).join('');
  
  // Render pagination
  renderAdminPagination(totalItems, 'orders');
}

function viewOrderDetail(orderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    const details = `
📦 Đơn hàng: ${order.id}
📅 Ngày: ${order.date}
👤 Khách: ${order.shippingAddress.fullname}
📍 Địa chỉ: ${order.shippingAddress.street}, ${order.shippingAddress.district}, ${order.shippingAddress.city}
📞 SĐT: ${order.shippingAddress.phone}
💵 Tổng: ${order.total.toLocaleString('vi-VN')}₫
📊 Trạng thái: ${order.status}

Sản phẩm:
${order.items.map(i => `- ${i.title} (x${i.quantity}) = ${(i.price * i.quantity).toLocaleString('vi-VN')}₫`).join('\n')}
    `;
    alert(details);
  }
}

function updateOrderStatus(orderId, status) {
  if (!status) return;
  
  let orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    order.status = status;
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders();
    alert(`✅ Cập nhật trạng thái thành: ${status}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const orderSearch = document.getElementById('orderSearch');
  const orderStatusFilter = document.getElementById('orderStatusFilter');
  
  if (orderSearch) orderSearch.addEventListener('input', renderOrders);
  if (orderStatusFilter) orderStatusFilter.addEventListener('change', renderOrders);
});

// ============= USERS MANAGEMENT =============
function renderUsers() {
  const users = getUsers();
  const tbody = document.querySelector('#userTable tbody');
  const searchVal = document.querySelector('#userSearch')?.value?.toLowerCase() || '';
  
  let filtered = users.filter(u => 
    u.username && u.username.toLowerCase().includes(searchVal)
  );
  
  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td>${u.username || 'N/A'}</td>
      <td>
        <span class="status-badge status-active">Hoạt động</span>
      </td>
      <td style="font-size:0.85rem;">
        <button class="btn btn-edit" onclick="resetPassword('${u.username}')">🔑 Reset</button>
        <button class="btn btn-delete" onclick="deleteUser('${u.username}')">🗑️</button>
      </td>
    </tr>
  `).join('');
  
  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#666;">Không có người dùng nào</td></tr>';
  }
}

function resetPassword(username) {
  const newPass = prompt('Nhập mật khẩu mới:', 'password123');
  if (newPass) {
    let users = getUsers();
    const user = users.find(u => u.username === username);
    if (user) {
      user.password = newPass;
      localStorage.setItem('bs_users', JSON.stringify(users));
      alert(`✅ Reset mật khẩu thành công!\nMật khẩu mới: ${newPass}`);
    }
  }
}

function deleteUser(username) {
  if (confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) {
    let users = getUsers();
    users = users.filter(u => u.username !== username);
    localStorage.setItem('bs_users', JSON.stringify(users));
    renderUsers();
    alert('✅ Xóa tài khoản thành công!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const userSearch = document.getElementById('userSearch');
  if (userSearch) userSearch.addEventListener('input', renderUsers);
});

// ============= IMPORT/EXPORT =============
function importProducts() {
  const json = document.getElementById('importJSON').value;
  
  if (!json.trim()) {
    alert('❌ Vui lòng dán dữ liệu JSON!');
    return;
  }
  
  try {
    const products = JSON.parse(json);
    
    if (!Array.isArray(products)) {
      throw new Error('Dữ liệu phải là một mảng!');
    }
    
    // Validate and clean data
    const cleanedProducts = products.map(p => ({
      id: p.id || 'p' + Date.now(),
      title: p.title || 'Không tên',
      author: p.author || 'Tác giả',
      price: parseInt(p.price) || 0,
      category: p.category || 'Khác',
      cover: p.cover || p.image || 'https://via.placeholder.com/100x150',
      image: p.image || p.cover || 'https://via.placeholder.com/100x150',
      desc: p.desc || p.description || ''
    }));
    
    let existingProducts = getProducts();
    const newProducts = [...existingProducts];
    
    cleanedProducts.forEach(newProd => {
      const idx = newProducts.findIndex(p => p.id === newProd.id);
      if (idx >= 0) {
        newProducts[idx] = newProd;
      } else {
        newProducts.push(newProd);
      }
    });
    
    saveProducts(newProducts);
    document.getElementById('importJSON').value = '';
    renderProducts();
    alert(`✅ Nhập thành công ${cleanedProducts.length} sản phẩm!`);
  } catch (e) {
    alert(`❌ Lỗi: ${e.message}`);
  }
}

function exportProducts() {
  const products = getProducts();
  const json = JSON.stringify(products, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `products-${new Date().getTime()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============= DASHBOARD =============
function updateDashboard() {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();
  
  // Total revenue
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('vi-VN') + ' ₫';
  
  // Total orders
  document.getElementById('totalOrders').textContent = orders.length;
  
  // Total products
  document.getElementById('totalProducts').textContent = products.length;
  
  // Total users
  document.getElementById('totalUsers').textContent = users.length;
}

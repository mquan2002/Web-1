// main.js - shared logic for all pages
const DATA_URL = 'data/books.json';
let BOOKS = [];

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const money = v => new Intl.NumberFormat('vi-VN').format(v) + '₫';
const getCart = () => JSON.parse(localStorage.getItem('bs_cart') || '[]');
const saveCart = (cart) => localStorage.setItem('bs_cart', JSON.stringify(cart));
const getUsers = () => JSON.parse(localStorage.getItem('bs_users') || '[]');
const saveUsers = (u) => localStorage.setItem('bs_users', JSON.stringify(u));
const getAuth = () => JSON.parse(localStorage.getItem('bs_auth') || 'null');
const setAuth = (u) => localStorage.setItem('bs_auth', JSON.stringify(u));
const clearAuth = () => localStorage.removeItem('bs_auth');

/* ---------- Init common UI ---------- */
function updateCartCount() {
  const c = getCart().reduce((s,i)=>s+i.qty,0);
  $$('#cart-count').forEach(el => { if(el) el.textContent = c; });
}
function updateAuthUI() {
  const auth = getAuth();
  $$('#auth-link').forEach(el => {
    if(!el) return;
    if(auth){
      el.textContent = auth.username;
      el.href = '#';
      el.onclick = (e)=>{ e.preventDefault(); if(confirm('Đăng xuất?')){ clearAuth(); location.reload(); }};
    } else {
      el.textContent = 'Đăng nhập';
      el.href = 'login.html';
      el.onclick = null;
    }
  });
}

/* ---------- Fetch data ---------- */
async function loadBooks(){
  if(BOOKS.length) return BOOKS;
  try{
    const res = await fetch(DATA_URL);
    BOOKS = await res.json();
    return BOOKS;
  }catch(e){
    console.error('Không load được data. Nếu mở bằng file:// hãy chạy local server.', e);
    BOOKS = [];
    return BOOKS;
  }
}

/* ---------- Render helpers ---------- */
function createProductCard(book){
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${book.cover}" alt="${escape(book.title)}">
    <div class="product-title">${book.title}</div>
    <div class="product-meta">${book.author} • ${book.category}</div>
    <div class="price">${money(book.price)}</div>
    <div style="margin-top:10px;display:flex;gap:8px">
      <a class="btn" href="details.html?id=${book.id}">Xem</a>
      <button class="btn primary add-btn" data-id="${book.id}">Thêm vào giỏ</button>
    </div>
  `;
  return div;
}
/* ---------- Home page ---------- */
async function initHome(){
  document.getElementById('year').textContent = new Date().getFullYear();
  await loadBooks();
  const featured = BOOKS.slice(0,6);
  const container = $('#featured-list');
  featured.forEach(b => container.appendChild(createProductCard(b)));
  // bind add-to-cart
  container.addEventListener('click', e=>{
    if(e.target.classList.contains('add-btn')){
      const id = e.target.dataset.id; addToCart(id,1);
    }
  });
}

/* ---------- Products page ---------- */
let currentPage = 1;
const itemsPerPage = 8;
let filteredBooks = [];

function populateCategories(selectEl){
  const cats = Array.from(new Set(BOOKS.map(b=>b.category)));
  cats.forEach(c=>{
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
    selectEl.appendChild(opt);
  });
}

function renderProducts(list){
  filteredBooks = list;
  const grid = $('#product-grid');
  grid.innerHTML = '';
  
  // Calc Pagination
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedList = list.slice(startIdx, endIdx);
  
  paginatedList.forEach(b => grid.appendChild(createProductCard(b)));
  
  renderPagination(list.length);
}

function renderPagination(totalItems){
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationEl = $('#pagination');
  
  if(!paginationEl){
    paginationEl = document.createElement('div');
    paginationEl.id = 'pagination';
    paginationEl.className = 'pagination';
    $('#product-grid').parentNode.appendChild(paginationEl);
  }
  
  paginationEl.innerHTML = `
    <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}> < </button>
    <span class="page-info">Trang ${currentPage} / ${totalPages}</span>
    <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''}> > </button>
  `;
  
  // Pagination event
  const prevBtn = $('#prev-page');
  const nextBtn = $('#next-page');

  $('#prev-page')?.addEventListener('click', ()=>{
    if(currentPage > 1){
      currentPage--;
      renderProducts(filteredBooks);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });
  
  $('#next-page')?.addEventListener('click', ()=>{
    if(currentPage < totalPages){
      currentPage++;
      renderProducts(filteredBooks);
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  });
}

function applyFilters(){
  let list = BOOKS.slice();
  const q = $('#search-input') ? $('#search-input').value.trim().toLowerCase() : '';
  const cat = $('#filter-category') ? $('#filter-category').value : '';
  const min = parseInt($('#price-min')?.value || '') || 0;
  const max = parseInt($('#price-max')?.value || '') || Infinity;
  const sort = $('#sort-select') ? $('#sort-select').value : 'default';

  if(q) list = list.filter(b => (b.title + ' ' + b.author + ' ' + b.desc).toLowerCase().includes(q));
  if(cat) list = list.filter(b => b.category === cat);
  list = list.filter(b => b.price >= min && b.price <= max);

  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  else if(sort === 'newest') list.sort((a,b)=>a.id.localeCompare(b.id));

  currentPage = 1;
  renderProducts(list);
}

/* ---------- Detail page ---------- */
function renderDetail(book){
  const el = $('#book-detail');
  el.innerHTML = '';
  if(!book){ el.innerHTML = '<p>Sách không tồn tại.</p>'; return; }
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
    <img src="${book.cover}" alt="${escape(book.title)}">
  `;
  const right = document.createElement('div');
  right.className = 'detail-content';
  right.innerHTML = `
    <h2>${book.title}</h2>
    <div class="product-meta">${book.author} • ${book.category}</div>
    <div class="price">${money(book.price)}</div>
    <p>${book.desc}</p>
    <div class="qty">
      <label>Số lượng</label>
      <input id="qty" type="number" value="1" min="1" />
      <button id="add-to-cart" class="btn primary">Thêm vào giỏ</button>
    </div>
  `;
  el.appendChild(div);
  el.appendChild(right);
  $('#add-to-cart').addEventListener('click', ()=>{
    const q = parseInt($('#qty').value) || 1;
    addToCart(book.id, q);
  });
}

/* ---------- Cart ---------- */
function addToCart(id, qty=1){
  const auth = getAuth();
  if (!auth) return alert('Bạn cần đăng nhập để thêm sản phẩm!');
  const book = BOOKS.find(b=>b.id===id);
  if(!book) return alert('Sách không tồn tại.');
  const cart = getCart();
  const idx = cart.findIndex(i=>i.id===id);
  if(idx >= 0) cart[idx].qty += qty;
  else cart.push({id:id, qty: qty});
  saveCart(cart);
  updateCartCount();
  alert('Đã thêm vào giỏ hàng.');
  // if on cart page, refresh
  if(document.body.id === 'page-cart') renderCart();
}
function renderCart(){
  const list = getCart();
  const container = $('#cart-list');
  container.innerHTML = '';
  if(list.length === 0){ container.innerHTML = '<p>Giỏ hàng trống.</p>'; $('#cart-summary').innerHTML=''; return; }
  const rows = list.map(item => {
    const book = BOOKS.find(b=>b.id===item.id);
    return { ...book, qty: item.qty };
  });
  rows.forEach(r=>{
    const row = document.createElement('div');
    row.className = 'card';
    row.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${r.cover}" style="width:80px;height:100px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div style="font-weight:600">${r.title}</div>
          <div class="muted">${r.author} • ${r.category}</div>
          <div style="margin-top:8px">Đơn giá: ${money(r.price)}</div>
        </div>
        <div style="min-width:140px;text-align:right">
          <input class="cart-qty" data-id="${r.id}" type="number" value="${r.qty}" min="1" style="width:70px;padding:6px;border-radius:8px;border:1px solid #e6eef2">
          <div style="margin-top:8px">${money(r.price * r.qty)}</div>
          <button class="btn" data-remove="${r.id}" style="margin-top:8px">Xóa</button>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  // summary
  const total = rows.reduce((s,r)=>s + r.price * r.qty, 0);
  $('#cart-summary').innerHTML = `
    <div class="cart-summary">
      <div class="cart-row"><div>Tạm tính</div><div>${money(total)}</div></div>
      <div style="padding-top:10px;text-align:right">
        <button id="checkout" class="btn primary">Thanh toán</button>
      </div>
    </div>
  `;

  // events: qty change
  $$('.cart-qty').forEach(el=>{
    el.addEventListener('change', e=>{
      const id = el.dataset.id;
      const val = parseInt(el.value) || 1;
      const cart = getCart();
      const it = cart.find(i=>i.id===id);
      if(it){ it.qty = val; saveCart(cart); renderCart(); updateCartCount(); }
    });
  });
  // remove
  $$('[data-remove]').forEach(b=>{
    b.addEventListener('click', e=>{
      const id = b.getAttribute('data-remove');
      let cart = getCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); renderCart(); updateCartCount();
    });
  });
  // checkout
  $('#checkout').addEventListener('click', ()=>{
    const auth = getAuth();
    if (!auth) {
      if (confirm('Bạn cần đăng nhập để thanh toán.\nChuyển đến trang đăng nhập?')) {
        location.href = 'login.html';
      }
      return;
    }
    location.href = 'checkout.html';
  });
}
/* ---------- Validation ---------- */
function validateEmail(email) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}
function showError(inputEl, message) {
  let errorEl = inputEl.nextElementSibling;
  if (!errorEl || !errorEl.classList.contains('error-msg')) {
    errorEl = document.createElement('div');
    errorEl.className = 'error-msg';
    errorEl.style.color = '#e81123';
    errorEl.style.fontSize = '0.85rem';
    errorEl.style.marginTop = '4px';
    inputEl.parentNode.insertBefore(errorEl, inputEl.nextSibling);
  }
  errorEl.textContent = message;
  inputEl.style.borderColor = '#e81123';
}
function clearError(inputEl) {
  const errorEl = inputEl.nextElementSibling;
  if (errorEl && errorEl.classList.contains('error-msg')) {
    errorEl.textContent = '';
  }
  inputEl.style.borderColor = '#e6eef2';
}

/* ---------- Auth  ---------- */
function initAuthPage(){
  document.getElementById('year5').textContent = new Date().getFullYear();

  const loginEmail = $('#login-username');
  const loginPass = $('#login-password');
  const regEmail = $('#reg-username');
  const regPass = $('#reg-password');
  const authMsg = $('#auth-msg');


  // login email and password validation onblur
    loginEmail.addEventListener('blur', () => {
    const val = loginEmail.value.trim();
    if (val === '') {
      showError(loginEmail, 'Email không được trống');
    } else {
      clearError(loginEmail);
    }
  });
    loginPass.addEventListener('blur', () => {
    const val = loginPass.value;
    if (val === '') {
      showError(loginPass, 'Mật khẩu không được để trống');
    } else {
      clearError(loginPass);
    }
  });

    // register email and password validation onblur
    regEmail.addEventListener('blur', () => {
    const val = regEmail.value.trim();
    if (val === '') {
      showError(regEmail, 'Email không được để trống');
    } else if (!validateEmail(val)) {
      showError(regEmail, 'Email không hợp lệ');
    } else {
      clearError(regEmail);
    }
  });
    regPass.addEventListener('blur', () => {
    const val = regPass.value;
    if (val === '') {
      showError(regPass, 'Mật khẩu không được để trống');
    } else if (!validatePassword(val)) {
      showError(regPass, 'Mật khẩu phải có ít nhất 6 ký tự');
    } else {
      clearError(regPass);
    }
  });

    loginEmail.addEventListener('input', () => {
      if (loginEmail.value.trim() !== '') clearError(loginEmail);
    });
    loginPass.addEventListener('input', () => {
      if (loginPass.value !== '') clearError(loginPass);
    });
    regEmail.addEventListener('input', () => {
      if (regEmail.value.trim() !== '') clearError(regEmail);
    });
    regPass.addEventListener('input', () => {
      if (regPass.value !== '') clearError(regPass);
    });

  $('#btn-register').addEventListener('click', ()=>{
    const email = $('#reg-username').value.trim();
    const pass = $('#reg-password').value;
    
    authMsg.textContent = '';
    authMsg.style.color = '';
    let hasError = false;

    if (!email){
      showError(regEmail, 'Email không được để trống');
      hasError = true;
    } else if (!validateEmail(email)) {
      showError(regEmail, 'Email không hợp lệ');
      hasError = true;
    } else {
      clearError(regEmail);
    }
    if (!pass){
      showError(regPass, 'Mật Khẩu không được trống');
      hasError = true;
    } else if (!validatePassword(pass)) {
      showError(regPass, 'Mật khẩu phải có ít nhất 6 ký tự');
      hasError = true;
    } else {
      clearError(regPass);
    }

    if (hasError) return;

    const users = getUsers();
    if(users.find(u=>u.username===email)){
      authMsg.textContent = 'Tài khoản đã tồn tại.'; 
      authMsg.style.color = '#e81123';
      return;
    }
    users.push({username: email, password: pass});
    saveUsers(users);
    $('#auth-msg').textContent = 'Đăng ký thành công. Bạn có thể đăng nhập.';
    $('#auth-msg').style.color = '#00a884';
    $('#reg-username').value=''; $('#reg-password').value='';
    clearError(regEmail); clearError(regPass);
  });
  $('#btn-login').addEventListener('click', ()=>{
    const email = $('#login-username').value.trim();
    const pass = $('#login-password').value;

    authMsg.textContent = '';
    authMsg.style.color = '';
    let hasError = false;
    if(!email){
      showError(loginEmail, "Email không được để trống");
      hasError=true;
      clearError(loginEmail); 
    }
    if(!pass){
      showError(loginPass, "Mật khẩu không được để trống");
      hasError=true;
      clearError(loginPass);
    }
    if (hasError) return;
    const users = getUsers();
    const u = users.find(x=>x.username===email && x.password===pass);
    if(!u){
      authMsg.textContent = 'Sai thông tin đăng nhập.'; 
      authMsg.style.color = '#e81123';
      return;
    }
    setAuth({username: u.username});
    location.href = 'index.html';
  });
}

/* ---------- Page router/init ---------- */
async function init(){
  updateCartCount();
  updateAuthUI();
  const page = document.body.id;
  await loadBooks();

  if(page === 'page-home') await initHome();
  if(page === 'page-products'){
    document.getElementById('year2').textContent = new Date().getFullYear();
    populateCategories($('#filter-category'));
    renderProducts(BOOKS);
    // events
    $('#filter-category').addEventListener('change', applyFilters);
    $('#sort-select').addEventListener('change', applyFilters);
    $('#price-min').addEventListener('input', applyFilters);
    $('#price-max').addEventListener('input', applyFilters);
    $('#search-input').addEventListener('input', applyFilters);
    // delegate add-to-cart
    document.getElementById('product-grid').addEventListener('click', e=>{
      if(e.target.classList.contains('add-btn')){
        addToCart(e.target.dataset.id,1);
      }
    });
  }
  if(page === 'page-detail'){
    document.getElementById('year3').textContent = new Date().getFullYear();
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const book = BOOKS.find(b=>b.id===id);
    renderDetail(book);
  }
  if(page === 'page-cart'){
    document.getElementById('year4').textContent = new Date().getFullYear();
    renderCart();
  }
  if(page === 'page-login') initAuthPage();

  // common year ids fallback
  ['year','year2','year3','year4','year5'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.textContent = new Date().getFullYear();
  });
}

// safe init
document.addEventListener('DOMContentLoaded', init);

/* ---------- Checkout ---------- */
// Hiển thị năm hiện tại
document.getElementById('year6').textContent = new Date().getFullYear();

// Lấy các elements
const newAddressContainer = document.getElementById('newAddressContainer');
const checkoutForm = document.getElementById('checkout-form');
const successCard = document.getElementById('successCard');
const viewOrderBtn = document.getElementById('viewOrderBtn');
const orderDetails = document.getElementById('orderDetails');

// Hiển thị form nhập địa chỉ ngay từ đầu
newAddressContainer.classList.remove('hidden');
newAddressContainer.setAttribute('aria-hidden', 'false');

// Xử lý submit form
checkoutForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const paymentMethod = document.getElementById('payment').value;
  
  // Validate địa chỉ - chỉ yêu cầu nhập địa chỉ mới
  const fullname = document.getElementById('fullname').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const street = document.getElementById('street').value.trim();
  const district = document.getElementById('district').value.trim();
  const city = document.getElementById('city').value.trim();
  const note = document.getElementById('note').value.trim();
  
  if (!fullname || !phone || !street || !district || !city) {
    alert('Vui lòng điền đầy đủ thông tin địa chỉ!');
    return;
  }
  
  // Validate số điện thoại (10-11 số)
  const phoneRegex = /^0\d{9,10}$/;
  if (!phoneRegex.test(phone)) {
    alert('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại bắt đầu bằng 0 và có 10-11 chữ số.');
    return;
  }
  
  const shippingAddress = {
    fullname,
    phone,
    street,
    district,
    city,
    note
  };
  
  // Lấy giỏ hàng từ localStorage
  const cartData = JSON.parse(localStorage.getItem('bs_cart') || '[]');
  
  if (cartData.length === 0) {
    alert('Giỏ hàng của bạn đang trống!');
    window.location.href = 'index.html';
    return;
  }
  
  // Load thông tin sách từ BOOKS và tạo cart items đầy đủ
  const cart = cartData.map(item => {
    const book = BOOKS.find(b => b.id === item.id);
    return {
      id: item.id,
      title: book ? book.title : 'Sản phẩm',
      price: book ? book.price : 0,
      quantity: item.qty
    };
  });
  
  // Tính tổng tiền
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Tạo đơn hàng
  const order = {
    id: 'DH' + Date.now(),
    date: new Date().toLocaleString('vi-VN'),
    items: cart,
    total: total,
    shippingAddress: shippingAddress,
    paymentMethod: paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán trực tuyến',
    status: 'Đang xử lý'
  };
  
  // Lưu đơn hàng vào localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Xóa giỏ hàng
  localStorage.removeItem('bs_cart');
  
  // Hiển thị thông báo thành công
  checkoutForm.querySelector('.checkout-form > *:not(.success)').style.display = 'none';
  Array.from(checkoutForm.children).forEach(child => {
    if (child.id !== 'successCard') {
      child.style.display = 'none';
    }
  });
  successCard.style.display = 'block';
  
  // Lưu order ID để hiển thị chi tiết
  successCard.dataset.orderId = order.id;
});

// Xử lý nút "Xem đơn hàng"
viewOrderBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  const orderId = successCard.dataset.orderId;
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  
  if (order) {
    let itemsHtml = '';
    order.items.forEach(item => {
      itemsHtml += `
        <div class="order-item">
          <div class="order-item-info">
            <strong>${item.title}</strong><br>
            <span class="order-item-quantity">Số lượng: ${item.quantity}</span>
          </div>
          <div class="order-item-price">
            <strong>${(item.price * item.quantity).toLocaleString('vi-VN')}đ</strong><br>
            <span class="order-item-unit-price">${item.price.toLocaleString('vi-VN')}đ/cuốn</span>
          </div>
        </div>
      `;
    });
    
    orderDetails.innerHTML = `
      <h3>Chi tiết đơn hàng #${order.id}</h3>
      <p><strong>Ngày đặt:</strong> ${order.date}</p>
      <p><strong>Trạng thái:</strong> <span class="status-pending">${order.status}</span></p>
      
      <h4>Địa chỉ giao hàng:</h4>
      <p class="shipping-address">
        ${order.shippingAddress.fullname}<br>
        ${order.shippingAddress.phone}<br>
        ${order.shippingAddress.street}, ${order.shippingAddress.district}, ${order.shippingAddress.city}
        ${order.shippingAddress.note ? '<br><em>Ghi chú: ' + order.shippingAddress.note + '</em>' : ''}
      </p>
      
      <h4>Phương thức thanh toán:</h4>
      <p>${order.paymentMethod}</p>
      
      <h4>Sản phẩm:</h4>
      <div class="order-items-list">
        ${itemsHtml}
      </div>
      
      <div class="order-total">
        <strong>Tổng cộng: ${order.total.toLocaleString('vi-VN')}đ</strong>
      </div>
      
      <button onclick="window.location.href='index.html'" class="btn-continue-shopping">
        Tiếp tục mua sắm
      </button>
    `;
    
    orderDetails.classList.remove('hidden');
    viewOrderBtn.style.display = 'none';
  }
});

// Kiểm tra giỏ hàng khi load trang
window.addEventListener('DOMContentLoaded', function() {
  const cart = JSON.parse(localStorage.getItem('bs_cart') || '[]');
  
  if (cart.length === 0) {
    if (confirm('Giỏ hàng của bạn đang trống! Bạn có muốn quay lại trang chủ không?')) {
      window.location.href = 'index.html';
    }
  }
});
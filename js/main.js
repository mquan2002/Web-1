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
      <a class="btn" href="detail.html?id=${book.id}">Xem</a>
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
function populateCategories(selectEl){
  const cats = Array.from(new Set(BOOKS.map(b=>b.category)));
  cats.forEach(c=>{
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c;
    selectEl.appendChild(opt);
  });
}
function renderProducts(list){
  const grid = $('#product-grid');
  grid.innerHTML = '';
  list.forEach(b => grid.appendChild(createProductCard(b)));
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
  else if(sort === 'newest') list.sort((a,b)=>a.id.localeCompare(b.id)); // simple

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
        <button id="checkout" class="btn primary">Thanh toán (mô phỏng)</button>
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
    if(!auth){ if(confirm('Bạn cần đăng nhập để thanh toán. Đến trang đăng nhập?')) location.href='login.html'; return; }
    alert('Thanh toán mô phỏng thành công. Cám ơn bạn, ' + auth.username);
    saveCart([]); updateCartCount(); renderCart();
  });
}

/* ---------- Auth (simple) ---------- */
function initAuthPage(){
  document.getElementById('year5').textContent = new Date().getFullYear();
  $('#btn-register').addEventListener('click', ()=>{
    const email = $('#reg-username').value.trim();
    const pass = $('#reg-password').value;
    if(!email || !pass) return $('#auth-msg').textContent = 'Vui lòng nhập đầy đủ.';
    const users = getUsers();
    if(users.find(u=>u.username===email)) return $('#auth-msg').textContent = 'Tài khoản đã tồn tại.';
    users.push({username: email, password: pass});
    saveUsers(users);
    $('#auth-msg').textContent = 'Đăng ký thành công. Bạn có thể đăng nhập.';
    $('#reg-username').value=''; $('#reg-password').value='';
  });
  $('#btn-login').addEventListener('click', ()=>{
    const email = $('#login-username').value.trim();
    const pass = $('#login-password').value;
    const users = getUsers();
    const u = users.find(x=>x.username===email && x.password===pass);
    if(!u) return $('#auth-msg').textContent = 'Sai thông tin đăng nhập.';
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

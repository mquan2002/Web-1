// Load dữ liệu
let imports = JSON.parse(localStorage.getItem("imports") || "[]");

// Helper functions
const getProducts = () => JSON.parse(localStorage.getItem('bs_products') || '[]');
const saveProducts = (arr) => localStorage.setItem('bs_products', JSON.stringify(arr));

// HTML element
const form = document.getElementById("importForm");
const tableBody = document.querySelector("#importTable tbody");

function saveData() {
  localStorage.setItem("imports", JSON.stringify(imports));
}

// Hiển thị bảng
function renderTable() {
  tableBody.innerHTML = "";

  imports.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.date}</td>
      <td>${item.productId}</td>
      <td>${item.quantity}</td>
      <td>${item.price.toLocaleString()}</td>
      <td>${(item.quantity * item.price).toLocaleString()}</td>
      <td>
        <span class="badge" style="background:${item.completed?'#d1fae5':'#fff3cd'};color:${item.completed?'#065f46':'#856404'};padding:4px 8px;border-radius:4px;font-size:0.85rem">
          ${item.completed ? '✅ Đã nhập kho' : '⏳ Chưa hoàn thành'}
        </span>
      </td>
      <td>
        <button onclick="editImport(${item.id})" ${item.completed?'disabled':''}>✏️</button>
        <button onclick="deleteImport(${item.id})">🗑️</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

renderTable();

// Submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("importId").value;
  const date = document.getElementById("importDate").value;
  const productId = document.getElementById("productId").value.trim(); // Đổi thành string để match với bs_products
  const quantity = parseInt(document.getElementById("quantity").value);
  const price = parseInt(document.getElementById("importPrice").value);

  if (!id) {
    // Tạo ID tự tăng
    const newId = imports.length ? imports[imports.length - 1].id + 1 : 1;

    imports.push({
      id: newId,
      date,
      productId,
      quantity,
      price,
      completed: false,
    });
    
    alert('✅ Đã tạo phiếu nhập! Nhấn "Hoàn thành nhập kho" để cập nhật số lượng.');

  } else {
    // SỬA VÀ HOÀN THÀNH NHẬP KHO
    const imp = imports.find((x) => x.id == id);
    if (imp.completed) {
      alert("❌ Phiếu nhập này đã hoàn thành, không được sửa!");
      return;
    }

    imp.date = date;
    imp.productId = productId;
    imp.quantity = quantity;
    imp.price = price;
    imp.completed = true; // ✅ đánh dấu đã hoàn thành
    
    // ✅ CẬP NHẬT SỐ LƯỢNG TỒN KHO
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      // Cộng số lượng vào tồn kho
      product.stock = (product.stock || 0) + quantity;
      saveProducts(products);
      alert(`✅ Đã nhập ${quantity} sản phẩm vào kho!\nSố lượng tồn hiện tại: ${product.stock}`);
    } else {
      alert(`⚠️ Không tìm thấy sản phẩm ID: ${productId}. Vui lòng kiểm tra lại!`);
      return;
    }
  }

  saveData();
  renderTable();
  form.reset();
  document.getElementById("importId").value = "";
});

// Edit
function editImport(id) {
  const item = imports.find((x) => x.id === id);
  
  if(item.completed){
    alert('❌ Phiếu nhập đã hoàn thành, không thể sửa!');
    return;
  }

  document.getElementById("importId").value = item.id;
  document.getElementById("importDate").value = item.date;
  document.getElementById("productId").value = item.productId;
  document.getElementById("quantity").value = item.quantity;
  document.getElementById("importPrice").value = item.price;
}

// Delete
function deleteImport(id) {
  const item = imports.find(x => x.id === id);
  
  if(item.completed){
    if(!confirm('⚠️ Phiếu này đã nhập kho. Xóa sẽ KHÔNG trừ lại số lượng tồn.\nBạn có chắc muốn xóa?')) return;
  } else {
    if(!confirm("Xóa phiếu nhập này?")) return;
  }
  
  imports = imports.filter((x) => x.id !== id);
  saveData();
  renderTable();
  alert('✅ Đã xóa phiếu nhập!');
}
// Lấy dữ liệu từ bs_products thay vì books
const getProducts = () => JSON.parse(localStorage.getItem('bs_products') || '[]');
const saveProducts = (arr) => localStorage.setItem('bs_products', JSON.stringify(arr));

let profits = JSON.parse(localStorage.getItem("profits") || "{}");

const profitForm = document.getElementById("profitForm");
const profitTable = document.getElementById("profitTable");
const priceTable = document.getElementById("priceTable");

// --------------------- LƯU ------------------------
function saveProfits() {
  localStorage.setItem("profits", JSON.stringify(profits));
}

// ---------------- HIỂN THỊ BẢNG % LỢI NHUẬN ----------------
function renderProfitTable() {
  profitTable.innerHTML = "";

  Object.keys(profits).forEach((cat) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cat}</td>
      <td>${profits[cat]}%</td>
      <td>
        <button onclick="editProfit('${cat}')">✏️</button>
        <button onclick="deleteProfit('${cat}')">🗑️</button>
      </td>
    `;
    profitTable.appendChild(tr);
  });
}
renderProfitTable();

// ---------------- LƯU % LỢI NHUẬN ----------------
profitForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const cat = document.getElementById("category").value.trim();
  const percent = parseFloat(document.getElementById("percent").value);

  profits[cat] = percent;
  saveProfits();
  renderProfitTable();
  renderPriceTable();

  profitForm.reset();
  alert('✅ Đã lưu % lợi nhuận!');
});

// ---------------- SỬA ----------------
function editProfit(cat) {
  document.getElementById("category").value = cat;
  document.getElementById("percent").value = profits[cat];
}

// ---------------- XÓA ----------------
function deleteProfit(cat) {
  if(!confirm(`Xóa % lợi nhuận cho thể loại "${cat}"?`)) return;
  delete profits[cat];
  saveProfits();
  renderProfitTable();
  renderPriceTable();
  alert('✅ Đã xóa!');
}

// ---------------- HIỂN THỊ GIÁ BÁN ----------------
function renderPriceTable() {
  priceTable.innerHTML = "";
  
  const products = getProducts();
  
  if(products.length === 0){
    priceTable.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#666">Chưa có sản phẩm nào</td></tr>';
    return;
  }

  products.forEach((b) => {
    const cost = b.price; // giá vốn
    const percent = profits[b.category] || 0;
    const sellPrice = Math.round(cost + cost * (percent / 100)); // làm tròn

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.category}</td>
      <td>${cost.toLocaleString()}</td>
      <td>${percent}%</td>
      <td><strong style="color:#0f7b8a">${sellPrice.toLocaleString()}</strong></td>
    `;
    priceTable.appendChild(tr);
  });
}

renderPriceTable();
let books = JSON.parse(localStorage.getItem("books") || "[]");
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
});

// ---------------- SỬA ----------------
function editProfit(cat) {
  document.getElementById("category").value = cat;
  document.getElementById("percent").value = profits[cat];
}

// ---------------- XÓA ----------------
function deleteProfit(cat) {
  delete profits[cat];
  saveProfits();
  renderProfitTable();
  renderPriceTable();
}

// ---------------- HIỂN THỊ GIÁ BÁN ----------------
function renderPriceTable() {
  priceTable.innerHTML = "";

  books.forEach((b) => {
    const cost = b.price; // ✅ giá vốn = giá gốc (đúng yêu cầu)
    const percent = profits[b.category] || 0;
    const sellPrice = cost + cost * (percent / 100);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.category}</td>
      <td>${cost.toLocaleString()}</td>
      <td>${percent}%</td>
      <td>${sellPrice.toLocaleString()}</td>
    `;
    priceTable.appendChild(tr);
  });
}

renderPriceTable();

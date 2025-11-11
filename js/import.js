// Load dữ liệu
let imports = JSON.parse(localStorage.getItem("imports") || "[]");

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
        <button onclick="editImport(${item.id})">✏️</button>
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
  const productId = parseInt(document.getElementById("productId").value);
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

  } else {
    // CHỈ ĐƯỢC SỬA TRƯỚC KHI HOÀN THÀNH
    const imp = imports.find((x) => x.id == id);
    if (imp.completed) {
      alert("Phiếu nhập này đã hoàn thành, không được sửa!");
      return;
    }

    imp.date = date;
    imp.productId = productId;
    imp.quantity = quantity;
    imp.price = price;
    imp.completed = true; // ✅ đánh dấu đã hoàn thành
  }

  saveData();
  renderTable();
  form.reset();
  document.getElementById("importId").value = "";
});

// Edit
function editImport(id) {
  const item = imports.find((x) => x.id === id);

  document.getElementById("importId").value = item.id;
  document.getElementById("importDate").value = item.date;
  document.getElementById("productId").value = item.productId;
  document.getElementById("quantity").value = item.quantity;
  document.getElementById("importPrice").value = item.price;
}

// Delete
function deleteImport(id) {
  if (!confirm("Xóa phiếu nhập này?")) return;
  imports = imports.filter((x) => x.id !== id);
  saveData();
  renderTable();
}

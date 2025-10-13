document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");
  const tableBody = document.querySelector("#bookTable tbody");
  const logoutBtn = document.getElementById("logoutBtn");

  let books = JSON.parse(localStorage.getItem("books")) || [];

  const renderBooks = () => {
    tableBody.innerHTML = "";
    books.forEach((book, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.price.toLocaleString()} ₫</td>
        <td>${book.category}</td>
        <td><img src="${book.image}" alt="${book.title}" /></td>
        <td>
          <button class="action-btn btn-edit" data-index="${index}">Sửa</button>
          <button class="action-btn btn-delete" data-index="${index}">Xóa</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = form.bookId.value || Date.now();
    const newBook = {
      id,
      title: form.title.value.trim(),
      author: form.author.value.trim(),
      price: parseInt(form.price.value),
      category: form.category.value.trim(),
      image: form.image.value.trim() || "https://via.placeholder.com/100x150",
      description: form.description.value.trim(),
    };

    const index = books.findIndex(b => b.id == id);
    if (index >= 0) {
      books[index] = newBook; // update
    } else {
      books.push(newBook); // add new
    }

    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
    form.reset();
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const index = e.target.dataset.index;
      if (confirm("Bạn có chắc muốn xóa sách này?")) {
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
      }
    } else if (e.target.classList.contains("btn-edit")) {
      const index = e.target.dataset.index;
      const b = books[index];
      form.bookId.value = b.id;
      form.title.value = b.title;
      form.author.value = b.author;
      form.price.value = b.price;
      form.category.value = b.category;
      form.image.value = b.image;
      form.description.value = b.description;
    }
  });

  logoutBtn.addEventListener("click", () => {
    alert("Đăng xuất thành công!");
    window.location.href = "login.html";
  });

  renderBooks();
});

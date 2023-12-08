document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const bookList = document.getElementById("bookList");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = parseInt(document.getElementById("year").value);
    const isComplete = document.getElementById("isComplete").checked;

    if (!title || !author || !year) {
      alert("Seluruh Field Tidak Boleh Di Kosongkan !!!");
      return;
    }

    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    if (isTitleExists(title)) {
      alert("Judul buku sudah ada dalam daftar!");
    } else {
      saveBookToLocalStorage(newBook);
      renderBookshelf();
    }
  });

  const saveBookToLocalStorage = (book) => {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  };

  const isTitleExists = (title) => {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    return books.some((book) => book.title.toLowerCase() === title.toLowerCase());
  };

  const renderBookshelf = () => {
    const books = JSON.parse(localStorage.getItem("books")) || [];

    const completedBooksContainer = document.getElementById("completedBookList");
    const uncompletedBooksContainer = document.getElementById("uncompletedBookList");

    completedBooksContainer.innerHTML = "";
    uncompletedBooksContainer.innerHTML = "";

    let completedBooksCount = 0;
    let uncompletedBooksCount = 0;

    books.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book-item");
      const status = book.isComplete ? "completed-books" : "uncompleted-books";

      const html = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button id="changeBookStatus" class="green">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
          <button id="deleteBook" class="red">Hapus buku</button>
        </div>
      `;

      bookItem.innerHTML = html;

      bookItem.querySelector("#changeBookStatus").addEventListener("click", () => {
        changeBookStatus(book.id);
      });

      bookItem.querySelector("#deleteBook").addEventListener("click", () => {
        alert(`Apakah anda yakin ingin menghapus buku ${book.title}?`);
        deleteBook(book.id);
      });

      if (book.isComplete) {
        completedBooksContainer.appendChild(bookItem);
        completedBooksCount++;
      } else {
        uncompletedBooksContainer.appendChild(bookItem);
        uncompletedBooksCount++;
      }
    });

    document.querySelector(".completed-books .book-status").innerText = `Buku yang sudah selesai dibaca (${completedBooksCount})`;
    document.querySelector(".uncompleted-books .book-status").innerText = `Buku yang belum selesai dibaca (${uncompletedBooksCount})`;
  };

  const changeBookStatus = (bookId) => {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    books = books.map((book) => {
      if (book.id === bookId) {
        book.isComplete = !book.isComplete;
      }
      return book;
    });

    localStorage.setItem("books", JSON.stringify(books));
    renderBookshelf();
  };

  const deleteBook = (bookId) => {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    books = books.filter((book) => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));
    renderBookshelf();
  };

  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("keyup", (event) => {
    event.preventDefault();

    if (event.keyCode === 13) {
      searchBook(event.target.value);
    }
  });

  const searchBook = (keyword) => {
    const books = JSON.parse(localStorage.getItem("books")) || [];

    const filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(keyword.toLowerCase());
    });

    const completedBooksContainer = document.getElementById("completedBookList");
    const uncompletedBooksContainer = document.getElementById("uncompletedBookList");

    completedBooksContainer.innerHTML = "";
    uncompletedBooksContainer.innerHTML = "";

    let completedBooksCount = 0;
    let uncompletedBooksCount = 0;

    filteredBooks.forEach((book) => {
      const bookItem = document.createElement("div");
      bookItem.classList.add("book-item");
      const status = book.isComplete ? "completed-books" : "uncompleted-books";

      const html = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button id="changeBookStatus" class="green">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
          <button id="deleteBook" class="red">Hapus buku</button>
        </div>
      `;

      bookItem.innerHTML = html;

      bookItem.querySelector("#changeBookStatus").addEventListener("click", () => {
        changeBookStatus(book.id);
      });

      bookItem.querySelector("#deleteBook").addEventListener("click", () => {
        alert(`Apakah anda yakin ingin menghapus buku ${book.title}?`);
        deleteBook(book.id);
      });

      if (book.isComplete) {
        completedBooksContainer.appendChild(bookItem);
        completedBooksCount++;
      } else {
        uncompletedBooksContainer.appendChild(bookItem);
        uncompletedBooksCount++;
      }
    });

    document.querySelector(".completed-books .book-status").innerText = `Buku yang sudah selesai dibaca (${completedBooksCount})`;
    document.querySelector(".uncompleted-books .book-status").innerText = `Buku yang belum selesai dibaca (${uncompletedBooksCount})`;

    if (filteredBooks.length === 0) {
      completedBooksContainer.innerHTML = `<p class="empty">Buku tidak ditemukan</p>`;
      uncompletedBooksContainer.innerHTML = `<p class="empty">Buku tidak ditemukan</p>`;
    }

    searchInput.value = "";

    const searchResult = document.getElementById("search-result");

    searchResult.innerHTML = `
      Hasil pencarian untuk: ${keyword}
    `;

    searchResult.style.display = "block";

    return;
  };

  renderBookshelf();
});

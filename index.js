const apiUrl = "https://anapioficeandfire.com/api/books";
const localDbUrl = "db.json"; // Local fallback file
const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("search");
const toggleViewBtn = document.getElementById("toggleView");
let books = [];
let isGridView = false;

// Fetch books from API or fallback to local db.json
async function fetchBooks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API fetch failed");
        books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.warn("API fetch failed, falling back to local db.json:", error);
        try {
            const localResponse = await fetch(localDbUrl);
            if (!localResponse.ok) throw new Error("Local fetch failed");
            books = await localResponse.json();
            displayBooks(books);
        } catch (localError) {
            console.error("Error fetching local db.json:", localError);
            bookContainer.innerHTML = "<p>Failed to load books from both API and local source.</p>";
        }
    }
}

// Display books
function displayBooks(bookList) {
    bookContainer.innerHTML = "";
    bookList.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        const isLiked = localStorage.getItem(book.isbn) === "liked";
        bookDiv.innerHTML = `
            <h2>${book.name}</h2>
            <p>Author: ${book.authors[0]}</p>
            <p>ISBN: ${book.isbn || "N/A"}</p>
            <button class="like-btn ${isLiked ? "liked" : ""}" data-isbn="${book.isbn}">
                ${isLiked ? "Unlike" : "Like"}
            </button>
        `;
        bookContainer.appendChild(bookDiv);
    });
    addLikeListeners();
}

// Search functionality
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => book.name.toLowerCase().includes(query));
    displayBooks(filteredBooks);
});

// Toggle between list and grid view
toggleViewBtn.addEventListener("click", () => {
    isGridView = !isGridView;
    bookContainer.classList.toggle("grid-view", isGridView);
    bookContainer.classList.toggle("list-view", !isGridView);
    toggleViewBtn.textContent = isGridView ? "List View" : "Grid View";
});

// Like button functionality
function addLikeListeners() {
    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const isbn = btn.dataset.isbn;
            const isLiked = localStorage.getItem(isbn) === "liked";
            if (isLiked) {
                localStorage.removeItem(isbn);
                btn.textContent = "Like";
                btn.classList.remove("liked");
            } else {
                localStorage.setItem(isbn, "liked");
                btn.textContent = "Unlike";
                btn.classList.add("liked");
            }
        });
    });
}

// Initial setup
fetchBooks();
bookContainer.classList.add("list-view");
toggleViewBtn.textContent = "Grid View";
const apiUrl = "https://anapioficeandfire.com/api/books";
const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("search");
const toggleViewBtn = document.getElementById("toggleView");
let books = [];
let isGridView = false;

async function fetchBooks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API fetch failed");
        books = await response.json();
        
        books = books.map(book => ({
            ...book,
            likes: 0,
            isLiked: false
        }));
        displayBooks(books);
    } catch (apiError) {
        console.error("Error fetching books from API:", apiError);
        bookContainer.innerHTML = "<p>Failed to load books.</p>";
    }
}

function displayBooks(bookList) {
    bookContainer.innerHTML = "";
    bookList.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        const isLiked = book.isLiked || false;
        bookDiv.innerHTML = `
            <h2>${book.name}</h2>
            <p>Author: ${book.authors[0]}</p>
            <p>ISBN: ${book.isbn || "N/A"}</p>
            <p class="details" style="display: none;">Pages: ${book.numberOfPages}</p>
            <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${book.id}">
                ${isLiked ? 'Unlike' : 'Like'}
            </button>
        `;
        bookContainer.appendChild(bookDiv);
    });
    addLikeListeners();
    addHoverListeners();
}

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book => book.name.toLowerCase().includes(query));
    displayBooks(filteredBooks);
});

toggleViewBtn.addEventListener("click", () => {
    isGridView = !isGridView;
    bookContainer.classList.toggle("grid-view", isGridView);
    bookContainer.classList.toggle("list-view", !isGridView);
    toggleViewBtn.textContent = isGridView ? "List View" : "Grid View";
});

function addLikeListeners() {
    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const book = books.find(b => b.id == id);
            const currentLikes = book.likes || 0;
            const isCurrentlyLiked = book.isLiked || false;
            const newLikes = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;
            const newLikedState = !isCurrentlyLiked;

            
            book.likes = newLikes;
            book.isLiked = newLikedState;

            btn.classList.toggle("liked");
            btn.textContent = newLikedState ? 'Unlike' : 'Like';
        });
    });
}

function addHoverListeners() {
    const books = document.querySelectorAll(".book");
    books.forEach(book => {
        book.addEventListener("mouseover", showDetails);
        book.addEventListener("mouseout", hideDetails);
    });
}

function showDetails(event) {
    const details = event.currentTarget.querySelector(".details");
    details.style.display = "block";
}

function hideDetails(event) {
    const details = event.currentTarget.querySelector(".details");
    details.style.display = "none";
}

fetchBooks();
bookContainer.classList.add("list-view");
toggleViewBtn.textContent = "Grid View";
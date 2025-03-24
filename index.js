const apiUrl = "https://anapioficeandfire.com/api/books";
const localDbUrl = "http://localhost:3000/books"; // json-server endpoint
const bookContainer = document.getElementById("bookContainer");
const searchInput = document.getElementById("search");
const toggleViewBtn = document.getElementById("toggleView");
let books = [];
let isGridView = false;

async function fetchBooks() {
    try {
        const response = await fetch(localDbUrl); // Use json-server first
        if (!response.ok) throw new Error("Local fetch failed");
        books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.warn("Local fetch failed, trying API:", error);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("API fetch failed");
            books = await response.json();
            displayBooks(books);
        } catch (apiError) {
            console.error("Error fetching books:", apiError);
            bookContainer.innerHTML = "<p>Failed to load books.</p>";
        }
    }
}

function displayBooks(bookList) {
    bookContainer.innerHTML = "";
    bookList.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
        bookDiv.innerHTML = `
            <h2>${book.name}</h2>
            <p>Author: ${book.authors[0]}</p>
            <p>ISBN: ${book.isbn || "N/A"}</p>
            <p class="details" style="display: none;">Pages: ${book.numberOfPages}</p>
            <button class="like-btn" data-url="${book.url}">Likes: ${book.likes}</button>
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
        btn.addEventListener("click", async () => {
            const url = btn.dataset.url;
            const book = books.find(b => b.url === url);
            const newLikes = book.likes + 1;
            try {
                await fetch(`${localDbUrl}?url=${encodeURIComponent(url)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ likes: newLikes })
                });
                book.likes = newLikes;
                btn.textContent = `Likes: ${newLikes}`;
            } catch (error) {
                console.error("Error updating likes:", error);
            }
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
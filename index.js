// State management
let allBooks = [];
let currentView = 'list';

// Fetch books from API
function fetchBooks() {
    return fetch('https://anapioficeandfire.com/api/books')
        .then(response => response.json())
        .then(books => {
            allBooks = books.map(book => ({...book, liked: false}));
            // Save to json-server
            return fetch('http://localhost:3000/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(allBooks)
            });
        })
        .then(() => fetch('http://localhost:3000/books'))
        .then(response => response.json())
        .then(localBooks => {
            allBooks = localBooks;
            renderBooks(allBooks);
            return allBooks;
        });
}
// Render books based on current view
function renderBooks(books) {
    const main = document.querySelector('main');
    main.className = `${currentView}-view`;
    main.innerHTML = '';
    
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = `book-card ${book.liked ? 'liked' : ''}`;
        bookElement.innerHTML = `
            <h2>${book.name}</h2>
            <p>Author: ${book.authors[0]}</p>
            <p>Pages: ${book.numberOfPages}</p>
            <p>Released: ${book.released.split('T')[0]}</p>
            <button class="like-btn" data-id="${book.isbn}">
                ${book.liked ? 'Unlike' : 'Like'}
            </button>
        `;
        main.appendChild(bookElement);
    });
}

// Search books
function searchBooks(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredBooks = allBooks.filter(book => 
        book.name.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
}

// Toggle view between list and grid
function toggleView() {
    currentView = currentView === 'list' ? 'grid' : 'list';
    document.getElementById('view-toggle').textContent = 
        `Switch to ${currentView === 'list' ? 'Grid' : 'List'} View`;
    renderBooks(allBooks);
}

// Handle like button clicks
function handleLike(event) {
    if (event.target.className === 'like-btn') {
        const isbn = event.target.dataset.id;
        const book = allBooks.find(b => b.isbn === isbn);
        book.liked = !book.liked;
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ liked: book.liked })
        });
        renderBooks(allBooks);
    }
}
// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    
    // Search form submission
    document.getElementById('search-form').addEventListener('submit', searchBooks);
    
    // View toggle
    document.getElementById('view-toggle').addEventListener('click', toggleView);
    
    // Like buttons
    document.querySelector('main').addEventListener('click', handleLike);
});
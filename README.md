# Book-Explorer-App
Book Explorer App

A Single Page Application (SPA) built with HTML, CSS, and JavaScript that allows users to explore books from the "A Song of Ice and Fire" series. Users can search for books by title, toggle between list and grid views, like their favorite books, and view additional details on hover. The app fetches data from a public API and uses json-server for persistent like tracking.


Table of Contents
Features (#features)

File Structure (#file-structure)

Stretch Goals (#stretch-goals)


Features
Book List: Displays a collection of books fetched from the A Song of Ice and Fire API or a local db.json file.

Search: Filter books by title using real-time input.

View Toggle: Switch between list and grid layouts with a single click.

Like Functionality: Incrementally like books, with persistence via json-server.

Hover Details: Show additional book details (e.g., page count) on mouse hover.

Data Source: Uses a public API (https://anapioficeandfire.com/api/books) and db.json with 10 books, each having 3+ attributes (e.g., name, isbn, authors, likes).

Async JSON: All API/db interactions are asynchronous using fetch and JSON format.

Event Listeners: Includes 3 distinct event types with unique callbacks via .addEventListener():
input: Search filtering.

click: View toggling and liking.

mouseover: Showing book details.

Array Iteration: Uses filter for search and forEach for rendering and event binding.

DRY Code: Functions like displayBooks(), addLikeListeners(), and fetchBooks() keep code modular and reusable.


Project Files:

index.html

styles.css

index.js

db.json


File Structure

Book-Explorer-App/
├── index.html       # Single-page HTML structure
├── styles.css       # Styling for list/grid views and UI
├── index.js        # JavaScript logic for fetching, rendering, and interactivity
├── db.json          # Local data with 10 books, including likes
├── README.md        # Project documentation (this file)

db.json Details
Contains 10 books from the "A Song of Ice and Fire" series and related works.

Each book has an id, name, isbn, authors, numberOfPages, likes, and more.

Used with json-server for persistent like updates.

Stretch Goals
Implemented: Uses json-server to persist like counts, enhancing interactivity beyond localStorage.


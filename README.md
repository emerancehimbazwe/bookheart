# Bookheart

Bookheart is a responsive book discovery website that helps readers explore books, search for titles, and save their favorite books.

## Features

- Responsive homepage with book cards.
- Book data fetched from the Open Library API.
- Search books by title.
- Loading indicator while books are being fetched.
- Error message and retry option if a request fails.
- No-results message when a search returns no books.
- Add books to favorites and remove them from favorites.
- Save favorites in the browser using localStorage.
- About page.

## Technologies Used

- HTML
- CSS
- JavaScript (ES6+)
- JavaScript Fetch API and async/await
- Open Library Search API
- Vite
- Git and GitHub

## API

Bookheart uses the Open Library Search API:

https://openlibrary.org/search.json

The application requests book information, including titles, authors, publication years, and available cover IDs.

## Getting Started

### Prerequisites

Install Node.js and npm.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/emerancehimbazwe/bookheart.git
   ```

2. Open the project directory:

   ```bash
   cd bookheart
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Lab 3: Async JavaScript and API Integration

This lab introduces asynchronous JavaScript and API integration. The `src/fetchBooks.js` module uses `fetch` and `async/await` to retrieve book data from Open Library. The homepage displays API results and supports title searches, loading feedback, error handling, and empty search results.

## Author

Emerance Himbazwe

GitHub: https://github.com/emerancehimbazwe

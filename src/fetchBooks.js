
const API_URL = 'https://openlibrary.org/search.json'

const sampleBooks = [
  { id: 'local-1', title: 'Harry Potter and the Philosopher’s Stone', author: 'J. K. Rowling', year: 1997, coverId: null, category: 'Fantasy' },
  { id: 'local-2', title: 'The Hobbit', author: 'J. R. R. Tolkien', year: 1937, coverId: null, category: 'Adventure' },
  { id: 'local-3', title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, coverId: null, category: 'Classic Fiction' },
  { id: 'local-4', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, coverId: null, category: 'Classic Fiction' },
  { id: 'local-5', title: 'Little Women', author: 'Louisa May Alcott', year: 1868, coverId: null, category: 'Coming of Age' },
  { id: 'local-6', title: 'The Secret Garden', author: 'Frances Hodgson Burnett', year: 1911, coverId: null, category: "Children's Classics" },
  { id: 'local-7', title: 'Alice’s Adventures in Wonderland', author: 'Lewis Carroll', year: 1865, coverId: null, category: "Children's Classics" },
  { id: 'local-8', title: 'Treasure Island', author: 'Robert Louis Stevenson', year: 1883, coverId: null, category: 'Adventure' },
  { id: 'local-9', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', year: 1892, coverId: null, category: 'Mystery' },
  { id: 'local-10', title: 'Anne of Green Gables', author: 'L. M. Montgomery', year: 1908, coverId: null, category: 'Coming of Age' },
  { id: 'local-11', title: 'Frankenstein', author: 'Mary Shelley', year: 1818, coverId: null, category: 'Classic Fiction' },
  { id: 'local-12', title: 'The Call of the Wild', author: 'Jack London', year: 1903, coverId: null, category: 'Adventure' },
]

export async function fetchBooks(title = 'fiction') {
  const query = title.trim()

  try {
    const response = await fetch(
      `${API_URL}?title=${encodeURIComponent(query || 'fiction')}&limit=12`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (!response.ok) {
      throw new Error(`Open Library returned status ${response.status}`)
    }

    const data = await response.json()

    const apiBooks = (data.docs || [])
      .filter((book) => book.title)
      .map((book) => ({
        id: book.key,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown author',
        year: book.first_publish_year || 'Year unknown',
        coverId: book.cover_i || null,
        category: 'Books',
      }))

    if (apiBooks.length > 0) {
      return apiBooks
    }

    return getSampleBooks(query)
  } catch (error) {
    console.warn('Open Library unavailable. Showing sample books.', error)
    return getSampleBooks(query)
  }
}

function getSampleBooks(query) {
  if (!query || query.toLowerCase() === 'fiction') {
    return sampleBooks
  }

  return sampleBooks.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  )
}

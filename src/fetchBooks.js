
const API_URL = 'https://openlibrary.org/search.json'

const sampleBooks = [
  {
    id: 'local-1',
    title: 'Harry Potter and the Philosopher’s Stone',
    author: 'J. K. Rowling',
    year: 1997,
    coverId: null,
  },
  {
    id: 'local-2',
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    year: 1937,
    coverId: null,
  },
  {
    id: 'local-3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    coverId: null,
  },
  {
    id: 'local-4',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    coverId: null,
  },
  {
    id: 'local-5',
    title: 'Little Women',
    author: 'Louisa May Alcott',
    year: 1868,
    coverId: null,
  },
  {
    id: 'local-6',
    title: 'The Secret Garden',
    author: 'Frances Hodgson Burnett',
    year: 1911,
    coverId: null,
  },
]

export async function fetchBooks(title = 'fiction') {
  const query = title.trim().toLowerCase()

  try {
    const response = await fetch(
      `${API_URL}?title=${encodeURIComponent(title)}&limit=6`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch books from Open Library.')
    }

    const data = await response.json()

    const apiBooks = data.docs.map((book) => ({
      id: book.key,
      title: book.title || 'Untitled',
      author: book.author_name?.[0] || 'Unknown author',
      year: book.first_publish_year || 'Year unknown',
      coverId: book.cover_i || null,
    }))

    // Use real API results when available.
    if (apiBooks.length > 0) {
      return apiBooks
    }

    // If the API returns no results, try matching sample books.
    return getSampleBooks(query)
  } catch (error) {
    console.warn('Open Library unavailable. Using sample books.', error)

    // Keep the homepage usable if the API request fails.
    return getSampleBooks(query)
  }
}

function getSampleBooks(query) {
  if (!query || query === 'fiction') {
    return sampleBooks
  }

  return sampleBooks.filter((book) =>
    book.title.toLowerCase().includes(query)
  )
}


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
      }))

    if (apiBooks.length > 0) {
      return apiBooks
    }

    return getSampleBooks(query)
  } catch (error) {
    console.warn(
      'Open Library could not be reached. Showing sample books instead.',
      error
    )

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


const API_URL = 'https://openlibrary.org/search.json'

export async function fetchBooks(title = 'fiction') {
  try {
    const response = await fetch(
      `${API_URL}?title=${encodeURIComponent(title)}&limit=6`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch books from Open Library.')
    }

    const data = await response.json()

    return data.docs.map((book) => ({
      id: book.key,
      title: book.title || 'Untitled',
      author: book.author_name?.[0] || 'Unknown author',
      year: book.first_publish_year || 'Year unknown',
      coverId: book.cover_i || null,
    }))
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}

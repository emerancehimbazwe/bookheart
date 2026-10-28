
import './style.css'
import { getFavorites, addFavorite, removeFavorite } from './favorites.js'
import { fetchBooks } from './fetchBooks.js'

let books = []
let selectedCategory = 'All Books'
let searchTitle = ''
let isLoading = false
let errorMessage = ''

const categories = [
  'All Books',
  'Classic Fiction',
  'Coming of Age',
  'Adventure',
  'Mystery',
  "Children's Classics",
]

const categoryColors = [
  'bg-[#e6eadc]',
  'bg-[#eee3d4]',
  'bg-[#e1e5dc]',
  'bg-[#e9e1ed]',
  'bg-[#f0e6d4]',
  'bg-[#dfe9e6]',
]

const sampleCoverISBNs = {
  'Harry Potter and the Philosopher’s Stone': '9780590353427',
  'The Hobbit': '9780547928227',
  'Pride and Prejudice': '9780141439518',
  'The Great Gatsby': '9780743273565',
  'Little Women': '9780147514011',
  'The Secret Garden': '9780064401883',
}

function getCategory(book, index) {
  return categories[1 + (index % (categories.length - 1))]
}

function getCoverUrl(book) {
  if (book.coverId) {
    return `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
  }

  const isbn = book.isbn || sampleCoverISBNs[book.title]

  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
  }

  return ''
}

function renderBookCards() {
  const bookGrid = document.querySelector('#book-grid')
  const resultCount = document.querySelector('#result-count')

  if (isLoading) {
    bookGrid.innerHTML = `
      <div class="col-span-full py-12 text-center" role="status">
        <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#ddd0b8] border-t-[#69734d]"></div>
        <p class="mt-4 font-semibold">Loading books...</p>
      </div>
    `
    resultCount.textContent = 'Fetching books from Open Library...'
    return
  }

  if (errorMessage) {
    bookGrid.innerHTML = `
      <div class="col-span-full rounded-2xl bg-[#eee3d4] p-8 text-center">
        <p class="font-semibold">${errorMessage}</p>
        <button id="retry-button" type="button"
          class="mt-4 rounded-full bg-[#69734d] px-5 py-3 font-semibold text-white">
          Try Again
        </button>
      </div>
    `
    resultCount.textContent = ''

    document.querySelector('#retry-button').addEventListener('click', () => {
      loadBooks(searchTitle || 'fiction')
    })
    return
  }

  const filteredBooks = books.filter((book) => {
    const matchesCategory =
      selectedCategory === 'All Books' ||
      book.category === selectedCategory

    const matchesSearch =
      book.title.toLowerCase().includes(searchTitle.toLowerCase())

    return matchesCategory && matchesSearch
  })

  if (filteredBooks.length === 0) {
    bookGrid.innerHTML = `
      <p class="col-span-full py-12 text-center text-[#626456]">
        No results found. Try another book title or category.
      </p>
    `
  } else {
    bookGrid.innerHTML = filteredBooks.map((book) => {
      const isFavorite = getFavorites().some(
        (favorite) => String(favorite.id) === String(book.id)
      )

      const cover = getCoverUrl(book)

      return `
        <article class="rounded-2xl border border-[#ddd0b8] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
          <div class="mb-4 flex h-44 items-center justify-center overflow-hidden rounded-xl ${categoryColors[books.indexOf(book) % categoryColors.length]}">
            ${
              cover
                ? `<img
                    src="${cover}"
                    alt="Cover of ${book.title}"
                    class="h-full w-full object-contain"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                  >`
                : ''
            }
            <div
              class="h-full w-full flex-col items-center justify-center p-4 text-center"
              style="display: ${cover ? 'none' : 'flex'}"
              aria-label="Cover unavailable"
            >
              <span class="text-4xl font-bold text-[#69734d]" aria-hidden="true">B</span>
              <span class="mt-2 text-sm font-semibold text-[#34382b]">Bookheart</span>
            </div>
          </div>

          <p class="text-sm font-semibold uppercase text-[#69734d]">${book.category}</p>
          <h3 class="mt-2 text-xl font-bold">${book.title}</h3>
          <p class="mt-2 text-sm text-[#626456]">By ${book.author}</p>
          <p class="mt-2 text-sm text-[#626456]">First published: ${book.year}</p>

          <button
            type="button"
            data-favorite-id="${book.id}"
            class="mt-5 w-full rounded-full bg-[#69734d] px-5 py-3 font-semibold text-white transition hover:bg-[#34382b]"
          >
            ${isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
          </button>
        </article>
      `
    }).join('')
  }

  resultCount.textContent =
    `Showing ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'}`

  bookGrid.querySelectorAll('[data-favorite-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.favoriteId
      const book = books.find((item) => String(item.id) === String(id))

      if (!book) return

      const currentlyFavorite = getFavorites().some(
        (favorite) => String(favorite.id) === String(id)
      )

      if (currentlyFavorite) {
        removeFavorite(id)
      } else {
        addFavorite({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
        })
      }

      renderBookCards()
    })
  })
}

function renderCategories() {
  document.querySelector('#category-buttons').innerHTML =
    categories.map((category) => `
      <button
        type="button"
        data-category="${category}"
        aria-pressed="${selectedCategory === category}"
        class="rounded-full border border-[#69734d] px-5 py-3 text-sm font-semibold transition ${
          selectedCategory === category
            ? 'bg-[#69734d] text-white'
            : 'bg-[#fbf8f1] text-[#34382b] hover:bg-[#69734d] hover:text-white'
        }"
      >
        ${category}
      </button>
    `).join('')

  document.querySelectorAll('#category-buttons button').forEach((button) => {
    button.addEventListener('click', () => {
      selectedCategory = button.dataset.category
      renderCategories()
      renderBookCards()
    })
  })
}

async function loadBooks(title = 'fiction') {
  isLoading = true
  errorMessage = ''
  renderBookCards()

  try {
    const fetchedBooks = await fetchBooks(title)

    books = fetchedBooks.map((book, index) => ({
      ...book,
      category: getCategory(book, index),
      description: `Discover ${book.title}, written by ${book.author}.`,
    }))

    selectedCategory = 'All Books'
    renderCategories()
  } catch {
    errorMessage =
      'Unable to load books. Check your internet connection and try again.'
  } finally {
    isLoading = false
    renderBookCards()
  }
}

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-[#f3e8d5] text-[#34382b]">
    <header class="border-b border-[#ddd0b8] bg-[#fbf8f1]">
      <nav class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <a href="/" class="text-2xl font-bold">
          Book<span class="text-[#69734d]">heart</span>
        </a>
        <div class="flex flex-wrap items-center gap-4 text-sm font-medium sm:gap-6">
          <a href="/" class="text-[#69734d]">Home</a>
          <a href="#categories" class="hover:text-[#69734d]">Categories</a>
          <a href="/favorites.html" class="hover:text-[#69734d]">Favorites</a>
          <a href="/about.html" class="hover:text-[#69734d]">About</a>
        </div>
      </nav>
    </header>

    <main>
      <section class="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p class="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-[#69734d]">
            YOUR NEXT CHAPTER STARTS HERE
          </p>
          <h1 class="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Find a book that feels like <span class="text-[#69734d]">home.</span>
          </h1>
          <p class="mt-6 max-w-lg text-lg leading-8 text-[#626456]">
            Discover timeless classics, explore new stories, and build a reading list that is truly yours.
          </p>
          <a href="#discover" class="mt-8 inline-block rounded-full bg-[#69734d] px-7 py-3 font-semibold text-white hover:bg-[#34382b]">
            Explore Books
          </a>
        </div>

        <div class="flex min-h-64 items-center justify-center rounded-3xl bg-[#ddd0b8] p-8 sm:p-12">
          <div class="grid grid-cols-3 items-end gap-3" aria-label="Illustration of three books">
            <div class="flex h-44 w-20 items-center justify-center rounded-l-md bg-[#69734d] p-3 text-center text-sm font-bold text-white shadow-lg sm:h-52 sm:w-24">
              Little<br />Women
            </div>
            <div class="flex h-52 w-20 items-center justify-center rounded-md bg-[#34382b] p-3 text-center text-sm font-bold text-white shadow-lg sm:h-60 sm:w-24">
              Pride &amp;<br />Prejudice
            </div>
            <div class="flex h-36 w-20 items-center justify-center rounded-r-md bg-[#a5a984] p-3 text-center text-sm font-bold text-[#34382b] shadow-lg sm:h-44 sm:w-24">
              The Secret<br />Garden
            </div>
          </div>
        </div>
      </section>

      <section id="categories" class="bg-[#e9e4d6] px-5 py-12">
        <div class="mx-auto max-w-7xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-[#69734d]">FIND YOUR GENRE</p>
          <h2 class="mt-3 text-3xl font-bold">Explore Categories</h2>
          <p class="mt-3 max-w-2xl leading-7 text-[#626456]">
            Choose a category to find books that match your interests.
          </p>
          <div id="category-buttons" class="mt-6 flex flex-wrap gap-3"></div>
        </div>
      </section>

      <section id="discover" class="bg-[#fbf8f1] px-5 py-16">
        <div class="mx-auto max-w-7xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-[#69734d]">YOUR READING CORNER</p>
          <h2 class="mt-3 text-3xl font-bold sm:text-4xl">Discover Your Next Read</h2>
          <p class="mt-4 max-w-2xl leading-7 text-[#626456]">
            Explore real book information from the Open Library catalogue.
          </p>

          <form id="search-form" class="mt-6 flex flex-col gap-3 sm:flex-row">
            <label for="book-search" class="sr-only">Search books by title</label>
            <input
              id="book-search"
              type="search"
              placeholder="Search books by title..."
              class="min-w-0 flex-1 rounded-full border border-[#ddd0b8] bg-white px-5 py-3 outline-none focus:ring-2 focus:ring-[#69734d]"
            />
            <button type="submit" class="rounded-full bg-[#69734d] px-7 py-3 font-semibold text-white hover:bg-[#34382b]">
              Search
            </button>
          </form>

          <p id="result-count" class="mt-5 text-sm font-semibold text-[#69734d]" aria-live="polite"></p>
          <div id="book-grid" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
        </div>
      </section>
    </main>

    <footer class="bg-[#34382b] px-5 py-8 text-center text-sm text-[#f3e8d5]">
      <p class="font-semibold">Bookheart — Every book opens a new world.</p>
      <p class="mt-2">Made for readers who love a good story.</p>
      <a href="#" class="mt-3 inline-block underline">Back to top</a>
    </footer>
  </div>
`

renderCategories()

document.querySelector('#search-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  const input = document.querySelector('#book-search')
  const title = input.value.trim()

  searchTitle = title
  await loadBooks(title || 'fiction')
})

loadBooks()


import './style.css'

const books = [
  {
    number: '01',
    category: 'Classic Fiction',
    title: 'Pride and Prejudice',
    description: 'A timeless story of love, family, and first impressions.',
    color: 'bg-[#e6eadc]',
  },
  {
    number: '02',
    category: 'Coming of Age',
    title: 'Little Women',
    description: 'Follow the March sisters through dreams, change, and growing up.',
    color: 'bg-[#eee3d4]',
  },
  {
    number: '03',
    category: 'Adventure',
    title: 'The Secret Garden',
    description: 'Discover a hidden garden and the joy of new beginnings.',
    color: 'bg-[#e1e5dc]',
  },
  {
    number: '04',
    category: 'Mystery',
    title: 'The Adventures of Sherlock Holmes',
    description: 'Join a brilliant detective as he solves intriguing mysteries.',
    color: 'bg-[#e9e1ed]',
  },
  {
    number: '05',
    category: 'Classic Fiction',
    title: 'The Great Gatsby',
    description: 'Explore ambition, dreams, and life in the Jazz Age.',
    color: 'bg-[#f0e6d4]',
  },
  {
    number: '06',
    category: "Children's Classics",
    title: 'Anne of Green Gables',
    description: 'Experience the adventures of an imaginative young girl.',
    color: 'bg-[#dfe9e6]',
  },
]

const categories = [
  'All Books',
  'Classic Fiction',
  'Coming of Age',
  'Adventure',
  'Mystery',
  "Children's Classics",
]

let selectedCategory = 'All Books'

function renderBookCards() {
  const filteredBooks =
    selectedCategory === 'All Books'
      ? books
      : books.filter((book) => book.category === selectedCategory)

  const bookGrid = document.querySelector('#book-grid')
  const resultCount = document.querySelector('#result-count')

  bookGrid.innerHTML = filteredBooks.map((book) => `
    <article class="rounded-2xl border border-[#ddd0b8] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div class="mb-4 flex h-36 items-center justify-center rounded-xl ${book.color} text-5xl font-bold text-[#69734d]" aria-hidden="true">
        ${book.number}
      </div>
      <p class="text-sm font-semibold uppercase text-[#69734d]">${book.category}</p>
      <h3 class="mt-2 text-xl font-bold">${book.title}</h3>
      <p class="mt-3 leading-6 text-[#626456]">${book.description}</p>
    </article>
  `).join('')

  resultCount.textContent = `Showing ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'}`
}

function renderCategories() {
  document.querySelector('#category-buttons').innerHTML = categories.map((category) => `
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

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-[#f3e8d5] text-[#34382b]">

    <!-- Navigation -->
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
      <!-- Hero -->
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

        <!-- Book illustration -->
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

      <!-- Interactive categories -->
      <section id="categories" class="bg-[#e9e4d6] px-5 py-12">
        <div class="mx-auto max-w-7xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-[#69734d]">
            FIND YOUR GENRE
          </p>

          <h2 class="mt-3 text-3xl font-bold">Explore Categories</h2>

          <p class="mt-3 max-w-2xl leading-7 text-[#626456]">
            Choose a category to find books that match your interests.
          </p>

          <div id="category-buttons" class="mt-6 flex flex-wrap gap-3"></div>
        </div>
      </section>

      <!-- Book collection -->
      <section id="discover" class="bg-[#fbf8f1] px-5 py-16">
        <div class="mx-auto max-w-7xl">
          <p class="text-sm font-bold uppercase tracking-[0.2em] text-[#69734d]">
            YOUR READING CORNER
          </p>

          <h2 class="mt-3 text-3xl font-bold sm:text-4xl">
            Discover Your Next Read
          </h2>

          <p class="mt-4 max-w-2xl leading-7 text-[#626456]">
            From beloved classics to unforgettable adventures, there is a story waiting for you.
          </p>

          <p id="result-count" class="mt-5 text-sm font-semibold text-[#69734d]" aria-live="polite"></p>

          <div id="book-grid" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"></div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-[#34382b] px-5 py-8 text-center text-sm text-[#f3e8d5]">
      <p class="font-semibold">Bookheart — Every book opens a new world.</p>
      <p class="mt-2">Made for readers who love a good story.</p>
      <a href="#" class="mt-3 inline-block underline">Back to top</a>
    </footer>

  </div>
`

renderCategories()
renderBookCards()

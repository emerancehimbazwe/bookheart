
const STORAGE_KEY = "bookheart-favorites";

export function getFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function addFavorite(book) {
  const favorites = getFavorites();

  if (!favorites.some(item => item.id === book.id)) {
    favorites.push(book);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }

  return getFavorites();
}

export function removeFavorite(bookId) {
  const favorites = getFavorites().filter(
    book => book.id !== bookId
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  return favorites;
}

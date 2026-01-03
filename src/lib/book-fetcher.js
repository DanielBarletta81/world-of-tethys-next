// 1. Google Books is the easiest way to get "Official" metadata without Amazon's red tape.
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=isbn:";

export async function fetchBookDescription(isbn) {
  if (!isbn) return null;

  try {
    const res = await fetch(`${GOOGLE_BOOKS_API}${isbn}`);
    const data = await res.json();

    if (data.totalItems > 0) {
      const book = data.items[0].volumeInfo;
      return {
        description: book.description, // The full description
        rating: book.averageRating,
        pageCount: book.pageCount,
        categories: book.categories
      };
    }
  } catch (error) {
    console.error("Failed to fetch book data:", error);
  }
  
  return null; // Fallback to local data if API fails
}
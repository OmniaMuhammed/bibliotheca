import { Book, LogEntry, LogActionType, APISearchResult } from './types';
import { INITIAL_BOOKS, INITIAL_LOGS } from './data/sampleBooks';

const STORAGE_BOOKS_KEY = 'bibliotheca_books_v1';
const STORAGE_LOGS_KEY = 'bibliotheca_logs_v1';

// Open Library API base endpoints
const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';

/**
 * 1. Data Store Management (LocalStorage)
 */
export function getStoredBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_BOOKS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_BOOKS_KEY, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load books from localStorage:', err);
    return INITIAL_BOOKS;
  }
}

export function saveStoredBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_BOOKS_KEY, JSON.stringify(books));
  } catch (err) {
    console.error('Failed to save books to localStorage:', err);
  }
}

export function getStoredLogs(): LogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load logs from localStorage:', err);
    return INITIAL_LOGS;
  }
}

export function saveStoredLogs(logs: LogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage:', err);
  }
}

export function logAction(action: LogActionType, details: string, book?: { id?: string; title?: string }): LogEntry {
  const logs = getStoredLogs();
  const newLog: LogEntry = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    action,
    bookId: book?.id,
    bookTitle: book?.title,
    timestamp: new Date().toISOString(),
    details
  };
  const updatedLogs = [newLog, ...logs];
  saveStoredLogs(updatedLogs);
  return newLog;
}

/**
 * 2. CRUD Operations
 */
export function createBook(bookData: Omit<Book, 'id' | 'addedDate'>): Book {
  const books = getStoredBooks();
  const newBook: Book = {
    ...bookData,
    id: 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    addedDate: new Date().toISOString()
  };
  const updated = [newBook, ...books];
  saveStoredBooks(updated);
  logAction('add', `Added "${newBook.title}" by ${newBook.author} to library catalog`, {
    id: newBook.id,
    title: newBook.title
  });
  return newBook;
}

export function updateBook(id: string, updates: Partial<Book>): Book | null {
  const books = getStoredBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return null;

  const prev = books[index];
  const updatedBook: Book = { ...prev, ...updates };
  books[index] = updatedBook;
  saveStoredBooks(books);

  let details = `Updated details for "${updatedBook.title}"`;
  if (updates.status && updates.status !== prev.status) {
    details = `Changed status of "${updatedBook.title}" from [${prev.status}] to [${updates.status}]`;
    logAction('status_change', details, { id: updatedBook.id, title: updatedBook.title });
  } else {
    logAction('update', details, { id: updatedBook.id, title: updatedBook.title });
  }

  return updatedBook;
}

export function deleteBook(id: string): boolean {
  const books = getStoredBooks();
  const target = books.find(b => b.id === id);
  if (!target) return false;

  const filtered = books.filter(b => b.id !== id);
  saveStoredBooks(filtered);
  logAction('delete', `Removed "${target.title}" (ID: ${id}) from the library catalog`, {
    id: target.id,
    title: target.title
  });
  return true;
}

export function clearAllLogs(): void {
  saveStoredLogs([]);
}

/**
 * 3. API Integration: Open Library API
 */
const apiCache = new Map<string, APISearchResult[]>();

export async function searchOpenLibrary(query: string, limit: number = 12): Promise<APISearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const cacheKey = `${cleanQuery}_${limit}`;
  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey)!;
  }

  try {
    const url = `${OPEN_LIBRARY_SEARCH_URL}?q=${encodeURIComponent(cleanQuery)}&limit=${limit}&fields=key,title,author_name,first_publish_year,isbn,cover_i,publisher,subject,number_of_pages_median,language`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Open Library API responded with status ${res.status}`);
    }
    const data = await res.json();
    const docs: APISearchResult[] = data.docs || [];
    apiCache.set(cacheKey, docs);
    return docs;
  } catch (error) {
    console.warn('Open Library API search failed, falling back to filtered local results or mock search:', error);
    // Fallback: search local sample books
    const fallbackResults = INITIAL_BOOKS
      .filter(b => 
        b.title.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        b.genre.toLowerCase().includes(cleanQuery.toLowerCase()) ||
        b.isbn.includes(cleanQuery)
      )
      .map(b => ({
        key: `/works/${b.id}`,
        title: b.title,
        author_name: [b.author],
        first_publish_year: parseInt(b.publishDate.split('-')[0]) || 2020,
        isbn: [b.isbn],
        publisher: b.publisher ? [b.publisher] : undefined,
        subject: [b.genre],
        number_of_pages_median: b.pages,
        language: [b.language]
      }));
    return fallbackResults;
  }
}

export async function fetchFeaturedBooks(): Promise<Book[]> {
  try {
    const results = await searchOpenLibrary('bestsellers literature programming', 8);
    if (results.length === 0) return INITIAL_BOOKS.slice(0, 8);

    return results.map((item, idx) => {
      const cover = item.cover_i 
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : INITIAL_BOOKS[idx % INITIAL_BOOKS.length]?.coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';

      return {
        id: `ol-${item.key?.replace('/works/', '') || idx}`,
        title: item.title,
        author: item.author_name ? item.author_name.join(', ') : 'Unknown Author',
        isbn: item.isbn ? item.isbn[0] : `OL-${100000 + idx}`,
        publishDate: item.first_publish_year ? `${item.first_publish_year}-01-01` : '2023-01-01',
        publisher: item.publisher ? item.publisher[0] : 'International Publishing',
        genre: item.subject && item.subject.length > 0 ? item.subject[0] : 'General Literature',
        description: `Featured masterpiece available in digital repository. Highlights key works by ${item.author_name?.[0] || 'renowned authors'}.`,
        coverImage: cover,
        pages: item.number_of_pages_median || 320,
        language: item.language ? item.language[0].toUpperCase() : 'ENG',
        addedDate: new Date().toISOString(),
        status: 'available',
        rating: 4.5
      };
    });
  } catch (err) {
    console.warn('Featured books fallback to curated list:', err);
    return INITIAL_BOOKS;
  }
}

/**
 * 4. Export / Import Utilities
 */
export function exportToCSV(logs: LogEntry[]): string {
  const headers = ['Log ID', 'Action', 'Book Title', 'Book ID', 'Timestamp', 'Details'];
  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${l.action}"`,
    `"${(l.bookTitle || '').replace(/"/g, '""')}"`,
    `"${l.bookId || ''}"`,
    `"${l.timestamp}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportLibraryToJSON(books: Book[], logs: LogEntry[]): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    stats: {
      totalBooks: books.length,
      totalLogs: logs.length
    },
    books,
    logs
  };
  return JSON.stringify(payload, null, 2);
}

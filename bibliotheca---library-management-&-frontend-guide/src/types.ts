export type BookStatus = 'available' | 'reading' | 'completed' | 'wishlist';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishDate: string;
  publisher?: string;
  genre: string;
  description: string;
  coverImage: string;
  pages: number;
  language: string;
  addedDate: string;
  status: BookStatus;
  rating?: number; // 1 to 5
  borrower?: string;
  location?: string;
  notes?: string;
}

export type LogActionType = 'add' | 'view' | 'update' | 'delete' | 'search' | 'export' | 'import' | 'status_change';

export interface LogEntry {
  id: string;
  action: LogActionType;
  bookId?: string;
  bookTitle?: string;
  timestamp: string;
  details: string;
}

export interface SearchFilterState {
  query: string;
  genre: string;
  status: 'all' | BookStatus;
  yearMin: string;
  yearMax: string;
  sortBy: 'addedDate' | 'title' | 'author' | 'publishDate' | 'rating' | 'pages';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'table';
}

export interface LogFilterState {
  search: string;
  action: 'all' | LogActionType;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  timestamp: number;
}

export interface APISearchResult {
  key?: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  publisher?: string[];
  subject?: string[];
  number_of_pages_median?: number;
  language?: string[];
  description?: string;
}

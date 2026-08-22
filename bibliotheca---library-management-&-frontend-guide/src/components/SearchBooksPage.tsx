import React, { useState, useEffect } from 'react';
import { Book, APISearchResult, BookStatus } from '../types';
import { searchOpenLibrary, createBook } from '../data';
import { GENRE_LIST } from '../data/sampleBooks';
import { 
  Search, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Check, 
  Star, 
  BookMarked, 
  Layers, 
  Calendar, 
  SlidersHorizontal,
  Download,
  Upload,
  ArrowUpDown,
  BookCheck
} from 'lucide-react';

interface SearchBooksPageProps {
  books: Book[];
  onOpenAddModal: () => void;
  onOpenEditModal: (book: Book) => void;
  onOpenDetailModal: (book: Book) => void;
  onOpenDeleteConfirm: (book: Book) => void;
  onBookAddedFromAPI: (book: Book) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
  initialQuery?: string;
}

export const SearchBooksPage: React.FC<SearchBooksPageProps> = ({
  books,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onOpenDeleteConfirm,
  onBookAddedFromAPI,
  onStatusChange,
  initialQuery = ''
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [searchTarget, setSearchTarget] = useState<'all' | 'title' | 'author' | 'isbn'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'addedDate' | 'title' | 'author' | 'publishDate' | 'rating' | 'pages'>('addedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Open Library API Search State
  const [isAPISearchActive, setIsAPISearchActive] = useState<boolean>(false);
  const [apiResults, setApiResults] = useState<APISearchResult[]>([]);
  const [isAPILoading, setIsAPILoading] = useState<boolean>(false);

  // Debounced API search when query changes
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setApiResults([]);
      setIsAPISearchActive(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAPILoading(true);
      setIsAPISearchActive(true);
      try {
        const results = await searchOpenLibrary(searchQuery, 8);
        setApiResults(results);
      } catch (err) {
        console.error('API search error:', err);
      } finally {
        setIsAPILoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter and sort local books
  const filteredBooks = books.filter((book) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      if (searchTarget === 'title' && !book.title.toLowerCase().includes(q)) return false;
      if (searchTarget === 'author' && !book.author.toLowerCase().includes(q)) return false;
      if (searchTarget === 'isbn' && !book.isbn.toLowerCase().includes(q)) return false;
      if (
        searchTarget === 'all' &&
        !book.title.toLowerCase().includes(q) &&
        !book.author.toLowerCase().includes(q) &&
        !book.genre.toLowerCase().includes(q) &&
        !book.isbn.toLowerCase().includes(q)
      ) {
        return false;
      }
    }

    if (selectedGenre !== 'All Genres' && book.genre !== selectedGenre) {
      return false;
    }

    if (selectedStatus !== 'all' && book.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  // Sort Books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'title') comparison = a.title.localeCompare(b.title);
    else if (sortBy === 'author') comparison = a.author.localeCompare(b.author);
    else if (sortBy === 'publishDate') comparison = a.publishDate.localeCompare(b.publishDate);
    else if (sortBy === 'rating') comparison = (a.rating || 0) - (b.rating || 0);
    else if (sortBy === 'pages') comparison = a.pages - b.pages;
    else comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Add API item to library
  const handleAddAPIResult = (item: APISearchResult) => {
    const author = item.author_name ? item.author_name.join(', ') : 'Unknown Author';
    const isbn = item.isbn ? item.isbn[0] : `OL-${Date.now().toString().slice(-6)}`;
    const cover = item.cover_i 
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';

    const newBook = createBook({
      title: item.title,
      author,
      isbn,
      publishDate: item.first_publish_year ? `${item.first_publish_year}-01-01` : '2023-01-01',
      publisher: item.publisher ? item.publisher[0] : 'Open Library Publisher',
      genre: item.subject && item.subject[0] ? item.subject[0] : 'General',
      description: `Discovered and imported via Open Library API. Indexed by ${author}.`,
      coverImage: cover,
      pages: item.number_of_pages_median || 300,
      language: item.language ? item.language[0].toUpperCase() : 'ENG',
      status: 'available',
      rating: 5,
      notes: 'Added from Open Library Search'
    });

    onBookAddedFromAPI(newBook);
  };

  const getStatusBadge = (status: BookStatus) => {
    switch (status) {
      case 'available':
        return <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-300">Available</span>;
      case 'reading':
        return <span className="badge bg-amber-100 text-amber-800 border border-amber-300">Reading</span>;
      case 'completed':
        return <span className="badge bg-purple-100 text-purple-800 border border-purple-300">Completed</span>;
      case 'wishlist':
        return <span className="badge bg-rose-100 text-rose-800 border border-rose-300">Wishlist</span>;
    }
  };

  return (
    <div id="search-page-container" className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Top Bar & Action Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
            Collection Management
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1C1E]">
            Search & Manage Books
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Full catalog curation with real-time Open Library API live indexing
          </p>
        </div>

        <button
          id="btn-open-create-book"
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-[#2D4F3E] hover:bg-[#233f32] text-white font-medium rounded-xl shadow-xs text-xs md:text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>+ Add New Book</span>
        </button>
      </div>

      {/* 2. Unified Bento Search & Filters Card */}
      <div className="bg-white rounded-2xl p-5 border border-[#F0EFEA] shadow-xs space-y-4">
        {/* Main Search Input */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, genre, or ISBN (queries Open Library automatically)..."
              className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-sm text-[#1A1C1E] bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs px-2 py-0.5 rounded bg-gray-100 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value as any)}
              className="text-sm rounded-xl py-3 px-3 border border-[#E0E0E0] bg-[#FAF9F6] text-[#2D3436] font-medium focus:ring-2 focus:ring-[#D4AF37] outline-none"
            >
              <option value="all">All Fields</option>
              <option value="title">Title Only</option>
              <option value="author">Author Only</option>
              <option value="isbn">ISBN Only</option>
            </select>

            <div className="flex bg-[#FAF9F6] p-1 rounded-xl border border-[#E0E0E0]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#1A1C1E] font-bold' : 'text-gray-400 hover:text-gray-700'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-xs text-[#1A1C1E] font-bold' : 'text-gray-400 hover:text-gray-700'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#F0EFEA]">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full text-xs rounded-lg py-2 px-2.5 border border-[#E0E0E0] bg-white font-medium text-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
            >
              {GENRE_LIST.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Reading Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs rounded-lg py-2 px-2.5 border border-[#E0E0E0] bg-white font-medium text-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
              <option value="wishlist">Wishlist</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs rounded-lg py-2 px-2.5 border border-[#E0E0E0] bg-white font-medium text-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
            >
              <option value="addedDate">Date Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
              <option value="publishDate">Publication Year</option>
              <option value="rating">Rating (Stars)</option>
              <option value="pages">Page Count</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Sort Order
            </label>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-full py-2 px-2.5 bg-[#FAF9F6] hover:bg-gray-100 border border-[#E0E0E0] rounded-lg text-xs font-semibold text-gray-700 flex items-center justify-center gap-2 transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Open Library API Results Drawer */}
      {isAPISearchActive && (
        <div className="bg-[#1A1C1E] text-white rounded-2xl p-5 border border-[#2D3436] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif font-bold text-base md:text-lg text-white">
                Open Library API Live Discoveries ({apiResults.length})
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Live Query: "{searchQuery}"
            </span>
          </div>

          {isAPILoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white/5 p-3 rounded-xl space-y-2 border border-white/5">
                  <div className="skeleton-box h-24 rounded-lg bg-white/10" />
                  <div className="skeleton-box h-3 bg-white/10" />
                  <div className="skeleton-box h-3 w-2/3 bg-white/10" />
                </div>
              ))}
            </div>
          ) : apiResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {apiResults.map((item, idx) => {
                const coverUrl = item.cover_i 
                  ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                  : 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
                const isSaved = books.some(b => b.title.toLowerCase() === item.title.toLowerCase());

                return (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-xl p-3 border border-white/10 flex flex-col justify-between space-y-2.5 hover:border-[#D4AF37]/40 transition-colors"
                  >
                    <div className="flex gap-3">
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="w-14 h-20 object-cover rounded-md flex-shrink-0 bg-black/40"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-serif font-bold text-white line-clamp-2 leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">
                          {item.author_name ? item.author_name.join(', ') : 'Unknown'}
                        </p>
                        <span className="text-[10px] text-[#D4AF37] font-mono font-bold block mt-1">
                          {item.first_publish_year || 'Classic'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddAPIResult(item)}
                      disabled={isSaved}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                        isSaved 
                          ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/50' 
                          : 'bg-[#2D4F3E] hover:bg-[#233f32] text-white border border-[#2D4F3E]'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>In Catalog</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>+ Import to Library</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-2">
              No additional external results found for "{searchQuery}".
            </p>
          )}
        </div>
      )}

      {/* 4. Local Catalog View Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-lg md:text-xl font-serif font-bold text-[#1A1C1E]">
            Catalog Index ({sortedBooks.length} of {books.length})
          </h2>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Showing {sortedBooks.length} records
        </span>
      </div>

      {/* 5. Books Content Display (Grid Mode vs. Table Mode) */}
      {sortedBooks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#F0EFEA] space-y-4">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-serif font-bold text-gray-700">No books found in this filter</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Try adjusting your search keywords, clear genre or status filters, or add a new book manually.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-[#2D4F3E] hover:bg-[#233f32] text-white rounded-xl text-xs font-semibold"
          >
            + Add New Book Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedBooks.map((book) => (
            <div
              key={book.id}
              className="book-card flex flex-col justify-between group"
            >
              <div className="book-cover-wrap relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute top-2.5 left-2.5">
                  {getStatusBadge(book.status)}
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="bg-[#1A1C1E]/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md shadow-xs">
                    {book.publishDate.split('-')[0]}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2.5 text-white">
                  <div className="w-8 h-1 bg-[#D4AF37] mb-1 rounded-full"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 truncate block">
                    {book.genre}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between space-y-3 bg-white">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      <span className="font-bold text-[11px] text-gray-700 ml-1">{book.rating || 5}/5</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{book.pages}p</span>
                  </div>

                  <h3 className="font-serif font-bold text-[#1A1C1E] text-base line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1 font-medium mt-0.5">
                    by {book.author}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Status Switcher & CRUD Actions */}
                <div className="pt-3 border-t border-[#F0EFEA] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 text-[11px] font-medium">Status:</span>
                    <select
                      value={book.status}
                      onChange={(e) => onStatusChange(book.id, e.target.value as BookStatus)}
                      className="text-xs py-1 px-2 rounded-lg border border-[#E0E0E0] bg-[#FAF9F6] font-medium text-gray-700 focus:outline-none"
                    >
                      <option value="available">Available</option>
                      <option value="reading">Reading</option>
                      <option value="completed">Completed</option>
                      <option value="wishlist">Wishlist</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenDetailModal(book)}
                      className="btn-bento-outline rounded-lg flex-1 text-xs py-1.5 flex items-center justify-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-600" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={() => onOpenEditModal(book)}
                      className="p-1.5 rounded-lg border border-[#E0E0E0] bg-white hover:bg-gray-50 text-blue-600 transition-colors"
                      title="Edit Book"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDeleteConfirm(book)}
                      className="p-1.5 rounded-lg border border-[#E0E0E0] bg-white hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Delete Book"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#F0EFEA] shadow-xs overflow-hidden">
          <div className="table-responsive overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#FAF9F6] border-b border-[#F0EFEA]">
                <tr className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  <th scope="col" className="py-3.5 px-4">Book</th>
                  <th scope="col" className="py-3.5 px-4">Author</th>
                  <th scope="col" className="py-3.5 px-4">Genre</th>
                  <th scope="col" className="py-3.5 px-4">Status</th>
                  <th scope="col" className="py-3.5 px-4">Year</th>
                  <th scope="col" className="py-3.5 px-4">Rating</th>
                  <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEA]">
                {sortedBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-[#FAF9F6]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded-lg shadow-xs flex-shrink-0 bg-gray-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div>
                          <div className="font-serif font-bold text-[#1A1C1E]">{book.title}</div>
                          <div className="text-[11px] text-gray-400 font-mono">ISBN: {book.isbn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-700">{book.author}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF9F6] text-[#856c1a] border border-[#F0EFEA]">
                        {book.genre}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(book.status)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">
                      {book.publishDate.split('-')[0]}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                        <span className="font-semibold text-xs text-gray-700">{book.rating || 5}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDetailModal(book)}
                          className="p-1.5 rounded-lg border border-[#E0E0E0] hover:bg-gray-100 text-gray-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(book)}
                          className="p-1.5 rounded-lg border border-[#E0E0E0] hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit Book"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDeleteConfirm(book)}
                          className="p-1.5 rounded-lg border border-[#E0E0E0] hover:bg-rose-50 text-rose-600 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

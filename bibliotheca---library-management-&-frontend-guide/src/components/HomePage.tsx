import React, { useState, useEffect } from 'react';
import { Book, LogEntry } from '../types';
import { fetchFeaturedBooks, createBook } from '../data';
import { 
  BookOpen, 
  BookmarkCheck, 
  Search, 
  Plus, 
  Sparkles, 
  Clock, 
  Library, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink,
  Printer,
  FileDown,
  BookMarked,
  Layers,
  Star,
  RefreshCw
} from 'lucide-react';

interface HomePageProps {
  books: Book[];
  logs: LogEntry[];
  onNavigateToSearch: (initialQuery?: string) => void;
  onNavigateToLog: () => void;
  onOpenAddModal: () => void;
  onOpenDetailModal: (book: Book) => void;
  onBookAddedFromFeatured: (book: Book) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  books,
  logs,
  onNavigateToSearch,
  onNavigateToLog,
  onOpenAddModal,
  onOpenDetailModal,
  onBookAddedFromFeatured
}) => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState<boolean>(true);
  const [quickSearchInput, setQuickSearchInput] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      setIsLoadingFeatured(true);
      try {
        const data = await fetchFeaturedBooks();
        if (isMounted) {
          setFeaturedBooks(data);
        }
      } catch (err) {
        console.error('Error fetching featured books:', err);
      } finally {
        if (isMounted) setIsLoadingFeatured(false);
      }
    };
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalBooksCount = books.length;
  const availableCount = books.filter(b => b.status === 'available').length;
  const readingCount = books.filter(b => b.status === 'reading').length;
  const completedCount = books.filter(b => b.status === 'completed').length;
  const wishlistCount = books.filter(b => b.status === 'wishlist').length;
  const uniqueAuthors = new Set(books.map(b => b.author)).size;

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      onNavigateToSearch(quickSearchInput.trim());
    } else {
      onNavigateToSearch();
    }
  };

  const handleAddFeaturedToLibrary = (item: Book) => {
    // Check if already in library
    const alreadyExists = books.some(b => b.title.toLowerCase() === item.title.toLowerCase());
    if (alreadyExists) {
      alert(`"${item.title}" is already in your library!`);
      return;
    }
    const created = createBook({
      title: item.title,
      author: item.author,
      isbn: item.isbn,
      publishDate: item.publishDate,
      publisher: item.publisher || 'Open Library Press',
      genre: item.genre || 'Literature',
      description: item.description,
      coverImage: item.coverImage,
      pages: item.pages,
      language: item.language,
      status: 'available',
      rating: 5,
      notes: 'Added from Open Library Featured Picks'
    });
    onBookAddedFromFeatured(created);
  };

  return (
    <div id="home-page-container" className="p-5 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Bento Header & Quick Operations */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
              Digital Library Dashboard
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1C1E]">
            Welcome Back, Instructor
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-0.5">
            Managing <span className="font-semibold text-slate-800">{totalBooksCount}</span> titles across {uniqueAuthors} distinct creators & digital collections.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateToSearch()}
            className="px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-xl shadow-xs text-xs md:text-sm font-medium text-[#2D3436] hover:bg-[#F8F7F4] transition-all flex items-center gap-2"
          >
            <Library className="w-4 h-4 text-slate-600" />
            <span>Browse Catalog</span>
          </button>

          <button
            id="hero-add-book-btn"
            onClick={onOpenAddModal}
            className="px-5 py-2.5 bg-[#2D4F3E] text-white rounded-xl shadow-sm text-xs md:text-sm font-medium hover:bg-[#233f32] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>+ Add New Book</span>
          </button>
        </div>
      </header>

      {/* 2. Quick Search Bento Bar */}
      <form onSubmit={handleQuickSearchSubmit} className="relative w-full">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={quickSearchInput}
            onChange={(e) => setQuickSearchInput(e.target.value)}
            placeholder="Search catalog or live Open Library API by Title, Author, or ISBN..."
            className="w-full bg-white text-[#1A1C1E] placeholder-gray-400 pl-12 pr-28 py-3.5 rounded-2xl border border-[#F0EFEA] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-xs text-sm transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 bg-[#1A1C1E] hover:bg-[#2D3436] text-white font-medium px-4 py-2 rounded-xl text-xs md:text-sm transition-all flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* 3. Bento Metric Tiles (4 Columns) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#F0EFEA] flex flex-col justify-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Total Collection</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-serif font-bold text-[#1A1C1E]">{totalBooksCount}</span>
            <span className="text-xs text-emerald-600 font-bold">+100% active</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Cataloged in database</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#F0EFEA] flex flex-col justify-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Reading Now</span>
            <BookmarkCheck className="w-4 h-4 text-[#D4AF37]" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-serif font-bold text-[#1A1C1E]">{readingCount}</span>
            <span className="text-xs text-amber-600 font-bold">in progress</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Active reading loans</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#F0EFEA] flex flex-col justify-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Available on Shelf</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-serif font-bold text-[#1A1C1E]">{availableCount}</span>
            <span className="text-xs text-emerald-600 font-bold">ready</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">On shelves for checkout</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-xs border border-[#F0EFEA] flex flex-col justify-center">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Completed / Wishlist</span>
            <Star className="w-4 h-4 text-purple-500" />
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-serif font-bold text-[#1A1C1E]">{completedCount + wishlistCount}</span>
            <span className="text-xs text-purple-600 font-bold">{completedCount} read / {wishlistCount} wish</span>
          </div>
          <span className="text-[11px] text-gray-400 mt-1">Archived & prospective reads</span>
        </div>
      </section>

      {/* 4. Bento Main Grid: Featured Collections + Recent Activity */}
      <section className="grid grid-cols-12 gap-6">
        {/* Left Bento: Featured Collections (8 Cols) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-xs border border-[#F0EFEA] p-6 flex flex-col justify-between space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-bold text-[#1A1C1E]">Featured Collections</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#856c1a] font-bold">
                  Open Library Live API
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Curated masterworks retrieved in real-time from the Open Library repository
              </p>
            </div>
            <button
              onClick={() => onNavigateToSearch()}
              className="text-xs text-[#D4AF37] hover:text-[#b89528] font-bold underline underline-offset-4 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Book Tiles in Bento Grid (4 Columns) */}
          {isLoadingFeatured ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col space-y-2">
                  <div className="skeleton-box aspect-[3/4] rounded-xl" />
                  <div className="skeleton-box h-4 w-3/4" />
                  <div className="skeleton-box h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              {featuredBooks.slice(0, 4).map((book) => {
                const isAlreadyInLibrary = books.some(b => b.title.toLowerCase() === book.title.toLowerCase());
                return (
                  <div
                    key={book.id}
                    className="flex flex-col group cursor-pointer justify-between"
                  >
                    <div>
                      <div className="aspect-[3/4] bg-[#F0EFEA] rounded-xl mb-2.5 overflow-hidden border border-gray-200 relative">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white">
                          <div className="w-8 h-1 bg-[#D4AF37] mb-1 rounded-full"></div>
                          <p className="text-[10px] uppercase font-bold tracking-wider opacity-90 truncate">
                            {book.genre || 'Classic Fiction'}
                          </p>
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-sm text-[#1A1C1E] line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{book.author}</p>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => onOpenDetailModal(book)}
                        className="flex-1 py-1.5 px-2 bg-white border border-[#E0E0E0] hover:bg-gray-50 rounded-lg text-[11px] font-semibold text-gray-700 transition-all text-center"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleAddFeaturedToLibrary(book)}
                        disabled={isAlreadyInLibrary}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
                          isAlreadyInLibrary
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#2D4F3E] text-white hover:bg-[#233f32]'
                        }`}
                      >
                        {isAlreadyInLibrary ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3 text-[#D4AF37]" />
                            <span>+ Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Secondary Discoveries Row if more exist */}
          {featuredBooks.length > 4 && (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Showing 4 of {featuredBooks.length} curated picks</span>
              <button
                onClick={() => onNavigateToSearch()}
                className="text-[#D4AF37] font-semibold hover:underline"
              >
                Search all online records →
              </button>
            </div>
          )}
        </div>

        {/* Right Bento: Recent Activity with Glow Dots (4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-xs border border-[#F0EFEA] p-6 overflow-hidden flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-serif font-bold text-[#1A1C1E]">Recent Activity</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            </div>

            <div className="space-y-4">
              {logs.slice(0, 4).map((log) => {
                const getDotColor = (action: string) => {
                  switch (action) {
                    case 'add': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]';
                    case 'search': return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]';
                    case 'update':
                    case 'status_change': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
                    case 'delete': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
                    default: return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]';
                  }
                };

                const dateObj = new Date(log.timestamp);
                const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={log.id} className="flex gap-3.5 items-start">
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${getDotColor(log.action)}`}></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2">
                        {log.details}
                      </p>
                      {log.bookTitle && (
                        <p className="text-[11px] text-gray-500 font-serif italic line-clamp-1 mt-0.5">
                          "{log.bookTitle}"
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5 font-mono">
                        {timeString} • {log.action}
                      </p>
                    </div>
                  </div>
                );
              })}

              {logs.length === 0 && (
                <div className="py-8 text-center text-xs text-gray-400">
                  No activity events registered yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onNavigateToLog}
              className="w-full py-2.5 bg-[#F8F7F4] hover:bg-gray-100 text-[#1A1C1E] text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-[#F0EFEA] text-center"
            >
              View Full History ({logs.length})
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

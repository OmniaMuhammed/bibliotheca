/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Book, LogEntry, ToastNotification, BookStatus } from './types';
import { 
  getStoredBooks, 
  getStoredLogs, 
  createBook, 
  updateBook, 
  deleteBook, 
  clearAllLogs,
  exportLibraryToJSON 
} from './data';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './components/HomePage';
import { SearchBooksPage } from './components/SearchBooksPage';
import { LogBookPage } from './components/LogBookPage';
import { ArabicTutorialView } from './components/ArabicTutorialView';
import { BookDetailModal } from './components/BookDetailModal';
import { BookFormModal } from './components/BookFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/ToastContainer';
import { 
  Menu, 
  Plus, 
  Search, 
  Download, 
  GraduationCap, 
  Library, 
  BookMarked,
  Sparkles,
  Command,
  FileSpreadsheet
} from 'lucide-react';

export default function App() {
  // Core Application State
  const [books, setBooks] = useState<Book[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'log' | 'tutorial'>('home');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState<string>('');

  // Modal States
  const [selectedBookForDetail, setSelectedBookForDetail] = useState<Book | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Initialize data from LocalStorage
  useEffect(() => {
    const loadedBooks = getStoredBooks();
    const loadedLogs = getStoredLogs();
    setBooks(loadedBooks);
    setLogs(loadedLogs);
  }, []);

  // Toast Notification System
  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'danger' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast: ToastNotification = {
      id,
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Keyboard Shortcuts (Ctrl+K for search, Ctrl+B for add book)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('search');
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setBookToEdit(null);
        setIsFormModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Handlers
  const handleSaveBook = (bookData: Omit<Book, 'id' | 'addedDate'>, editId?: string) => {
    if (editId) {
      // Update
      const updated = updateBook(editId, bookData);
      if (updated) {
        setBooks(getStoredBooks());
        setLogs(getStoredLogs());
        triggerToast('Book Updated', `"${updated.title}" has been successfully updated.`, 'success');
        if (selectedBookForDetail?.id === editId) {
          setSelectedBookForDetail(updated);
        }
      }
    } else {
      // Create
      const created = createBook(bookData);
      setBooks(getStoredBooks());
      setLogs(getStoredLogs());
      triggerToast('Book Added', `"${created.title}" was added to the library catalog.`, 'success');
    }
  };

  const handleDeleteBookConfirm = (id: string) => {
    const targetBook = books.find(b => b.id === id);
    const title = targetBook ? targetBook.title : 'Book';
    const ok = deleteBook(id);
    if (ok) {
      setBooks(getStoredBooks());
      setLogs(getStoredLogs());
      triggerToast('Book Removed', `"${title}" was removed from the collection.`, 'warning');
      if (selectedBookForDetail?.id === id) {
        setSelectedBookForDetail(null);
      }
    }
  };

  const handleStatusChange = (id: string, newStatus: BookStatus) => {
    const updated = updateBook(id, { status: newStatus });
    if (updated) {
      setBooks(getStoredBooks());
      setLogs(getStoredLogs());
      triggerToast('Status Changed', `Updated "${updated.title}" status to [${newStatus}].`, 'info');
      if (selectedBookForDetail?.id === id) {
        setSelectedBookForDetail(updated);
      }
    }
  };

  const handleBookAddedFromAPIOrFeatured = (newBook: Book) => {
    setBooks(getStoredBooks());
    setLogs(getStoredLogs());
    triggerToast('Added from Open Library', `"${newBook.title}" successfully added to your catalog.`, 'success');
  };

  const handleClearLogs = () => {
    clearAllLogs();
    setLogs([]);
    triggerToast('Logs Cleared', 'All activity audit records have been cleared.', 'info');
  };

  const handleExportFullJSON = () => {
    const content = exportLibraryToJSON(books, logs);
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bibliotheca-full-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Backup Exported', 'Downloaded full library catalog JSON backup.', 'success');
  };

  const handleNavigateToSearch = (query?: string) => {
    if (query) {
      setInitialSearchQuery(query);
    }
    setActiveTab('search');
  };

  const readingBooksCount = books.filter(b => b.status === 'reading').length;

  return (
    <div className="app-container font-sans bg-[#FAF9F6] text-[#2D3436]">
      {/* 1. Sidebar Navigation (NutriPlan Layout) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalBooks={books.length}
        readingCount={readingBooksCount}
        totalLogs={logs.length}
        onOpenAddModal={() => {
          setBookToEdit(null);
          setIsFormModalOpen(true);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <main className="main-content flex flex-col min-h-screen">
        {/* Top Navbar / Header Bar */}
        <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#F0EFEA] px-4 md:px-8 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">
                Workspace /
              </span>
              <span className="text-sm font-serif font-bold text-[#1A1C1E]">
                {activeTab === 'home' && 'Home Dashboard'}
                {activeTab === 'search' && 'Search & Catalog Management'}
                {activeTab === 'log' && 'Audit Log Book'}
                {activeTab === 'tutorial' && 'دليل الشرح البرمجي للمبتدئين'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Beginner Guide Toggle Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'tutorial' ? 'home' : 'tutorial')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all ${
                activeTab === 'tutorial'
                  ? 'bg-[#1A1C1E] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-[#E0E0E0]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline font-sans">الشرح البرمجي بالعربية</span>
              <span className="sm:hidden font-sans">الشرح</span>
            </button>

            {/* Export JSON Backup */}
            <button
              onClick={handleExportFullJSON}
              className="px-3 py-1.5 bg-white border border-[#E0E0E0] hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
              title="Download Full Catalog JSON Backup"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden md:inline">Backup JSON</span>
            </button>

            {/* Quick Add Button */}
            <button
              onClick={() => {
                setBookToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-[#2D4F3E] hover:bg-[#233f32] text-white text-xs rounded-xl font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Add Book</span>
            </button>
          </div>
        </header>

        {/* Page Content Routers */}
        <div className="flex-grow">
          {activeTab === 'home' && (
            <HomePage
              books={books}
              logs={logs}
              onNavigateToSearch={handleNavigateToSearch}
              onNavigateToLog={() => setActiveTab('log')}
              onOpenAddModal={() => {
                setBookToEdit(null);
                setIsFormModalOpen(true);
              }}
              onOpenDetailModal={(b) => setSelectedBookForDetail(b)}
              onBookAddedFromFeatured={handleBookAddedFromAPIOrFeatured}
            />
          )}

          {activeTab === 'search' && (
            <SearchBooksPage
              books={books}
              onOpenAddModal={() => {
                setBookToEdit(null);
                setIsFormModalOpen(true);
              }}
              onOpenEditModal={(b) => {
                setBookToEdit(b);
                setIsFormModalOpen(true);
              }}
              onOpenDetailModal={(b) => setSelectedBookForDetail(b)}
              onOpenDeleteConfirm={(b) => setBookToDelete(b)}
              onBookAddedFromAPI={handleBookAddedFromAPIOrFeatured}
              onStatusChange={handleStatusChange}
              initialQuery={initialSearchQuery}
            />
          )}

          {activeTab === 'log' && (
            <LogBookPage
              logs={logs}
              onClearLogs={handleClearLogs}
            />
          )}

          {activeTab === 'tutorial' && (
            <ArabicTutorialView />
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-[#F0EFEA] py-6 px-4 md:px-8 text-center text-xs text-gray-500 mt-auto no-print">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Library className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-serif font-bold text-[#1A1C1E]">Bibliotheca Bento Management SPA</span>
              <span className="text-gray-300">•</span>
              <span>Inspired by NutriPlan Architecture</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-gray-400 font-mono">
              <span>Open Library API Connected</span>
              <span>•</span>
              <span>Local Storage Synchronized</span>
            </div>
          </div>
        </footer>
      </main>

      {/* 3. Global Modals & Dialogs */}
      <BookDetailModal
        book={selectedBookForDetail}
        onClose={() => setSelectedBookForDetail(null)}
        onEdit={(book) => {
          setBookToEdit(book);
          setIsFormModalOpen(true);
        }}
        onStatusChange={handleStatusChange}
      />

      <BookFormModal
        isOpen={isFormModalOpen}
        bookToEdit={bookToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setBookToEdit(null);
        }}
        onSave={handleSaveBook}
      />

      <DeleteConfirmModal
        book={bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleDeleteBookConfirm}
      />

      {/* 4. Global Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

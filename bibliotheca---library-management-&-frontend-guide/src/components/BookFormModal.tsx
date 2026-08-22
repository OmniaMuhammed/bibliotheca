import React, { useState, useEffect } from 'react';
import { Book, BookStatus } from '../types';
import { GENRE_LIST } from '../data/sampleBooks';
import { X, BookPlus, Edit3, Image as ImageIcon, Sparkles, Star } from 'lucide-react';

interface BookFormModalProps {
  isOpen: boolean;
  bookToEdit?: Book | null;
  onClose: () => void;
  onSave: (bookData: Omit<Book, 'id' | 'addedDate'>, editId?: string) => void;
}

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1532012164546-f432f2e3edd9?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800'
];

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  bookToEdit,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [publisher, setPublisher] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0]);
  const [pages, setPages] = useState<number>(300);
  const [language, setLanguage] = useState('English');
  const [status, setStatus] = useState<BookStatus>('available');
  const [rating, setRating] = useState<number>(5);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setIsbn(bookToEdit.isbn || '');
      setPublishDate(bookToEdit.publishDate || '2023-01-01');
      setPublisher(bookToEdit.publisher || '');
      setGenre(bookToEdit.genre || 'Fiction');
      setDescription(bookToEdit.description || '');
      setCoverImage(bookToEdit.coverImage || COVER_PRESETS[0]);
      setPages(bookToEdit.pages || 250);
      setLanguage(bookToEdit.language || 'English');
      setStatus(bookToEdit.status || 'available');
      setRating(bookToEdit.rating || 5);
      setLocation(bookToEdit.location || '');
      setNotes(bookToEdit.notes || '');
    } else {
      // Default new book state
      setTitle('');
      setAuthor('');
      setIsbn(`978-${Math.floor(1000000000 + Math.random() * 9000000000).toString().slice(0, 10)}`);
      setPublishDate(new Date().toISOString().split('T')[0]);
      setPublisher('');
      setGenre('Fiction');
      setDescription('');
      setCoverImage(COVER_PRESETS[Math.floor(Math.random() * COVER_PRESETS.length)]);
      setPages(320);
      setLanguage('English');
      setStatus('available');
      setRating(5);
      setLocation('Main Section A-1');
      setNotes('');
    }
    setErrors({});
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Book title is required';
    if (!author.trim()) errs.author = 'Author name is required';
    if (!isbn.trim()) errs.isbn = 'ISBN identifier is required';
    if (pages <= 0) errs.pages = 'Page count must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        publishDate: publishDate || new Date().toISOString().split('T')[0],
        publisher: publisher.trim() || 'Independent Press',
        genre,
        description: description.trim() || 'No description provided.',
        coverImage: coverImage.trim() || COVER_PRESETS[0],
        pages: Number(pages) || 250,
        language: language.trim() || 'English',
        status,
        rating: Number(rating) || 5,
        location: location.trim(),
        notes: notes.trim()
      },
      bookToEdit?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#F0EFEA] bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            {bookToEdit ? (
              <Edit3 className="w-5 h-5 text-[#D4AF37]" />
            ) : (
              <BookPlus className="w-5 h-5 text-[#D4AF37]" />
            )}
            <h3 className="font-serif font-bold text-[#1A1C1E] text-base">
              {bookToEdit ? 'Update Book Record' : 'Add New Book to Catalog'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Book Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Great Gatsby"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border ${errors.title ? 'border-rose-500 bg-rose-50/50' : 'border-[#E0E0E0]'} focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-[#1A1C1E]`}
                required
              />
              {errors.title && <div className="text-rose-500 text-xs mt-1">{errors.title}</div>}
            </div>

            {/* Author */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Author Name *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. F. Scott Fitzgerald"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border ${errors.author ? 'border-rose-500 bg-rose-50/50' : 'border-[#E0E0E0]'} focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-[#1A1C1E]`}
                required
              />
              {errors.author && <div className="text-rose-500 text-xs mt-1">{errors.author}</div>}
            </div>

            {/* Genre */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Genre / Classification
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-[#FAF9F6] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {GENRE_LIST.filter(g => g !== 'All Genres').map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* ISBN */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                ISBN Code *
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="978-3-16-148410-0"
                className={`w-full px-3.5 py-2 text-sm rounded-xl border font-mono ${errors.isbn ? 'border-rose-500 bg-rose-50/50' : 'border-[#E0E0E0]'} focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-[#1A1C1E]`}
                required
              />
              {errors.isbn && <div className="text-rose-500 text-xs mt-1">{errors.isbn}</div>}
            </div>

            {/* Publish Date */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Publication Date
              </label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Publisher */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Publisher
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. Penguin Classics"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Pages & Language */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Pages
                </label>
                <input
                  type="number"
                  min={1}
                  value={pages}
                  onChange={(e) => setPages(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>

            {/* Reading Status */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-[#FAF9F6] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="available">Available on Shelf</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed Reading</option>
                <option value="wishlist">On Wishlist</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-gray-300 hover:text-[#D4AF37] focus:outline-none transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#1A1C1E]">{rating} Stars</span>
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Cover Image URL (or pick a preset below)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
                <img
                  src={coverImage}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded-xl border border-[#E0E0E0] flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = COVER_PRESETS[0];
                  }}
                />
              </div>

              {/* Cover Presets */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-gray-400 font-medium">Presets:</span>
                {COVER_PRESETS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCoverImage(preset)}
                    className={`w-7 h-7 rounded-lg overflow-hidden border ${
                      coverImage === preset ? 'ring-2 ring-[#D4AF37] border-[#D4AF37]' : 'border-gray-200 opacity-70 hover:opacity-100'
                    } transition-all`}
                  >
                    <img src={preset} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Physical Location */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Library Shelf / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Shelf B-12"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Description & Synopsis
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary or key takeaways of the book..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Librarian / Reader Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Personal notes, quotes, or acquisition details..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E0E0E0] bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F0EFEA]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E0E0E0] hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#2D4F3E] hover:bg-[#233f32] text-white font-semibold rounded-xl text-xs shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{bookToEdit ? 'Save Changes' : 'Add Book to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { Book, BookStatus } from '../types';
import { 
  X, 
  BookOpen, 
  Calendar, 
  Layers, 
  Globe, 
  Hash, 
  Building2, 
  Star, 
  Edit3, 
  MapPin, 
  StickyNote,
  Clock
} from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onEdit,
  onStatusChange
}) => {
  if (!book) return null;

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs font-bold text-[#1A1C1E] ml-1">{rating} / 5</span>
      </div>
    );
  };

  const getStatusBadge = (status: BookStatus) => {
    switch (status) {
      case 'available':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">Available</span>;
      case 'reading':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Currently Reading</span>;
      case 'completed':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">Completed</span>;
      case 'wishlist':
        return <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">Wishlist</span>;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#F0EFEA] animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#F0EFEA] bg-[#FAF9F6]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-[#1A1C1E] text-base">Book Specifications & Record</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Book Cover Image */}
            <div className="w-full sm:w-44 flex-shrink-0">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#F0EFEA] bg-gray-100 aspect-[2/3] relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>

              {/* Status Switcher in Modal */}
              <div className="mt-3.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Update Status:
                </label>
                <select
                  value={book.status}
                  onChange={(e) => onStatusChange(book.id, e.target.value as BookStatus)}
                  className="w-full text-xs rounded-xl py-2 px-2.5 border border-[#E0E0E0] bg-[#FAF9F6] font-medium text-gray-700 focus:outline-none"
                >
                  <option value="available">Available on Shelf</option>
                  <option value="reading">Currently Reading</option>
                  <option value="completed">Completed Reading</option>
                  <option value="wishlist">On Wishlist</option>
                </select>
              </div>
            </div>

            {/* Book Metadata */}
            <div className="flex-grow space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#856c1a] bg-[#FAF9F6] border border-[#F0EFEA] px-2.5 py-0.5 rounded-lg">
                    {book.genre}
                  </span>
                  {getStatusBadge(book.status)}
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#1A1C1E] leading-snug">
                  {book.title}
                </h2>
                <p className="text-xs md:text-sm font-semibold text-gray-600 mt-1">
                  by {book.author}
                </p>
              </div>

              {/* Rating */}
              <div>{renderStars(book.rating)}</div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#F0EFEA]">
                <div className="flex items-center gap-2 text-gray-600">
                  <Hash className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">ISBN</span>
                    <span className="font-mono font-medium text-[#1A1C1E]">{book.isbn}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Publish Date</span>
                    <span className="font-medium text-[#1A1C1E]">{book.publishDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Layers className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Pages & Language</span>
                    <span className="font-medium text-[#1A1C1E]">{book.pages} pages ({book.language})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Publisher</span>
                    <span className="font-medium text-[#1A1C1E]">{book.publisher || 'N/A'}</span>
                  </div>
                </div>

                {book.location && (
                  <div className="flex items-center gap-2 text-gray-600 col-span-2">
                    <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <div>
                      <span className="text-gray-400 block text-[10px] font-bold uppercase">Physical Location</span>
                      <span className="font-medium text-[#1A1C1E]">{book.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2 border-t border-[#F0EFEA]">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Description & Synopsis
            </h4>
            <p className="text-xs md:text-sm text-[#2D3436] leading-relaxed bg-[#FAF9F6] p-4 rounded-2xl border border-[#F0EFEA]">
              {book.description || 'No description provided for this volume.'}
            </p>
          </div>

          {/* Librarian Notes */}
          {book.notes && (
            <div className="space-y-1 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <StickyNote className="w-3.5 h-3.5 text-amber-700" />
                <span>Curation Notes</span>
              </div>
              <p className="text-amber-800">{book.notes}</p>
            </div>
          )}

          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Cataloged into system on {new Date(book.addedDate).toLocaleString()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F0EFEA] bg-[#FAF9F6]">
          <button
            onClick={() => {
              onClose();
              onEdit(book);
            }}
            className="px-4 py-2 bg-[#2D4F3E] hover:bg-[#233f32] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Edit3 className="w-4 h-4 text-[#D4AF37]" />
            <span>Edit Book Details</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E0E0E0] hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

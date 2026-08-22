import React from 'react';
import { Book } from '../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  book: Book | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  book,
  onClose,
  onConfirm
}) => {
  if (!book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F0EFEA] animate-in fade-in zoom-in-95 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#1A1C1E] text-base">Remove Book from Library?</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-[#1A1C1E] font-serif">"{book.title}"</strong> by {book.author}? 
          This action will be recorded in your system activity log.
        </p>

        <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#F0EFEA] flex items-center gap-3">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-10 h-14 object-cover rounded-lg shadow-xs flex-shrink-0 bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="min-w-0 text-xs">
            <div className="font-serif font-bold text-[#1A1C1E] truncate">{book.title}</div>
            <div className="text-gray-500 truncate">{book.author}</div>
            <div className="text-gray-400 font-mono text-[10px]">ISBN: {book.isbn}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E0E0E0] hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(book.id);
              onClose();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
          >
            Yes, Delete Book
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  BookOpen, 
  Home, 
  Search, 
  ClipboardList, 
  GraduationCap, 
  PlusCircle, 
  BookMarked,
  X,
  Library,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'search' | 'log' | 'tutorial';
  setActiveTab: (tab: 'home' | 'search' | 'log' | 'tutorial') => void;
  totalBooks: number;
  readingCount: number;
  totalLogs: number;
  onOpenAddModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  totalBooks,
  readingCount,
  totalLogs,
  onOpenAddModal,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      labelAr: 'الرئيسية',
      icon: Home,
      badge: `${totalBooks} Books`,
      badgeClass: 'bg-primary/20 text-primary-200'
    },
    {
      id: 'search' as const,
      label: 'Search Books',
      labelAr: 'البحث والعمليات (CRUD)',
      icon: Search,
      badge: readingCount > 0 ? `${readingCount} Reading` : 'CRUD',
      badgeClass: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'log' as const,
      label: 'Log Book',
      labelAr: 'سجل النشاط (Logs)',
      icon: ClipboardList,
      badge: `${totalLogs} logs`,
      badgeClass: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'tutorial' as const,
      label: 'Instructor Guide',
      labelAr: 'شرح المبتدئين بالعربية',
      icon: GraduationCap,
      badge: 'Arabic Guide',
      badgeClass: 'bg-purple-500/30 text-purple-200'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`sidebar fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col justify-between p-4 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '280px' }}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 md:p-5 border-b border-[#2D3436] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-10 bg-[#D4AF37] rounded-xs shadow-inner relative flex-shrink-0">
                <div className="absolute inset-x-1 top-2 h-0.5 bg-[#1A1C1E] opacity-25"></div>
                <div className="absolute inset-x-1 top-4 h-0.5 bg-[#1A1C1E] opacity-25"></div>
                <div className="absolute inset-x-1 bottom-2 h-0.5 bg-[#1A1C1E] opacity-25"></div>
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-white tracking-tight">
                  Biblio<span className="text-[#D4AF37]">Tech</span>
                </h1>
                <p className="text-[11px] text-gray-400 font-medium">Digital Catalog & Bento Portal</p>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Add Book */}
          <div className="px-4 py-3">
            <button
              id="sidebar-add-book-btn"
              onClick={() => {
                onOpenAddModal();
                if (isOpenMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2D4F3E] hover:bg-[#233f32] text-white font-medium text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>+ Add New Book</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 pb-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isOpenMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group text-left ${
                    isActive
                      ? 'bg-[#D4AF37]/10 text-[#D4AF37] font-semibold border border-[#D4AF37]/20 shadow-xs'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-[#D4AF37]' : 'text-gray-400'
                    }`} />
                    <span className={isActive ? 'text-[#D4AF37]' : 'text-gray-300'}>{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/5 text-gray-400'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#2D3436] space-y-3">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-semibold text-gray-200">Open Library Live</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Connected to Open Library API with instant catalog sync & local storage.
            </p>
          </div>
          <div className="text-[10px] text-gray-500 text-center">
            © 2024 Library Instructor Portal
          </div>
        </div>
      </aside>
    </>
  );
};

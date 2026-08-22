import React, { useState } from 'react';
import { LogEntry, LogActionType } from '../types';
import { exportToCSV } from '../data';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  AlertOctagon, 
  Sparkles, 
  Calendar,
  Layers,
  FileSpreadsheet,
  FileCode,
  Printer
} from 'lucide-react';

interface LogBookPageProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const LogBookPage: React.FC<LogBookPageProps> = ({ logs, onClearLogs }) => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState<boolean>(false);

  // Statistics
  const totalLogs = logs.length;
  const addCount = logs.filter(l => l.action === 'add').length;
  const updateCount = logs.filter(l => l.action === 'update' || l.action === 'status_change').length;
  const deleteCount = logs.filter(l => l.action === 'delete').length;
  const searchCount = logs.filter(l => l.action === 'search').length;

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    // Action filter
    if (actionFilter !== 'all' && log.action !== actionFilter) {
      return false;
    }

    // Search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      const matchTitle = log.bookTitle ? log.bookTitle.toLowerCase().includes(q) : false;
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      if (!matchTitle && !matchDetails && !matchAction) return false;
    }

    // Date range filter
    if (dateFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diffMs = now.getTime() - logDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (dateFilter === 'today' && diffDays > 1) return false;
      if (dateFilter === 'week' && diffDays > 7) return false;
      if (dateFilter === 'month' && diffDays > 30) return false;
    }

    return true;
  });

  // Export handlers
  const handleDownloadCSV = () => {
    const csvContent = exportToCSV(filteredLogs);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bibliotheca-activity-logs-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bibliotheca-activity-logs-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: LogActionType) => {
    switch (action) {
      case 'add':
        return <span className="badge bg-emerald-100 text-emerald-800 border border-emerald-300">ADD</span>;
      case 'update':
        return <span className="badge bg-blue-100 text-blue-800 border border-blue-300">UPDATE</span>;
      case 'delete':
        return <span className="badge bg-rose-100 text-rose-800 border border-rose-300">DELETE</span>;
      case 'status_change':
        return <span className="badge bg-amber-100 text-amber-800 border border-amber-300">STATUS</span>;
      case 'search':
        return <span className="badge bg-purple-100 text-purple-800 border border-purple-300">SEARCH</span>;
      case 'export':
        return <span className="badge bg-indigo-100 text-indigo-800 border border-indigo-300">EXPORT</span>;
      case 'import':
        return <span className="badge bg-cyan-100 text-cyan-800 border border-cyan-300">IMPORT</span>;
      default:
        return <span className="badge bg-slate-100 text-slate-800">ACTION</span>;
    }
  };

  return (
    <div id="log-page-container" className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
            System Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1C1E] flex items-center gap-2.5">
            <span>Activity Log Book</span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-sans font-bold border border-emerald-200">
              Live Audit Trail
            </span>
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            Chronological audit trail of all library catalog changes, loan updates, and API searches
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="dropdown">
            <button
              className="px-4 py-2.5 bg-white border border-[#E0E0E0] rounded-xl text-xs font-semibold text-[#2D3436] hover:bg-[#FAF9F6] shadow-xs flex items-center gap-2 transition-all dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span>Export Audit Data</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-xl border-[#F0EFEA] rounded-xl p-1.5">
              <li>
                <button onClick={handleDownloadCSV} className="dropdown-item text-xs flex items-center gap-2 py-2 rounded-lg hover:bg-[#FAF9F6]">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Download as CSV Spreadsheet</span>
                </button>
              </li>
              <li>
                <button onClick={handleDownloadJSON} className="dropdown-item text-xs flex items-center gap-2 py-2 rounded-lg hover:bg-[#FAF9F6]">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span>Download as JSON File</span>
                </button>
              </li>
              <li><hr className="dropdown-divider my-1 border-[#F0EFEA]" /></li>
              <li>
                <button onClick={() => window.print()} className="dropdown-item text-xs flex items-center gap-2 py-2 rounded-lg hover:bg-[#FAF9F6]">
                  <Printer className="w-4 h-4 text-gray-600" />
                  <span>Print Activity Report</span>
                </button>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setIsConfirmClearOpen(true)}
            disabled={logs.length === 0}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Log</span>
          </button>
        </div>
      </div>

      {/* 2. Bento Log Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-[#F0EFEA] shadow-xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Total Actions
          </span>
          <div className="text-2xl font-serif font-bold text-[#1A1C1E] mt-1">{totalLogs}</div>
          <span className="text-[10px] text-gray-400 font-medium">All registered events</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#F0EFEA] shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
            Books Added
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-1">{addCount}</div>
          <span className="text-[10px] text-gray-400 font-medium">Additions & Imports</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#F0EFEA] shadow-xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">
            Updates & Status
          </span>
          <div className="text-2xl font-serif font-bold text-blue-700 mt-1">{updateCount}</div>
          <span className="text-[10px] text-gray-400 font-medium">Catalog edits</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#F0EFEA] shadow-xs">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block">
            Deleted Books
          </span>
          <div className="text-2xl font-serif font-bold text-rose-700 mt-1">{deleteCount}</div>
          <span className="text-[10px] text-gray-400 font-medium">Removed titles</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#F0EFEA] shadow-xs col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest block">
            Search Lookups
          </span>
          <div className="text-2xl font-serif font-bold text-purple-700 mt-1">{searchCount}</div>
          <span className="text-[10px] text-gray-400 font-medium">API queries</span>
        </div>
      </div>

      {/* 3. Bento Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#F0EFEA] shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search logs by title or action details..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-[#E0E0E0] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white text-[#1A1C1E]"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full text-xs rounded-xl py-2 px-3 border border-[#E0E0E0] bg-[#FAF9F6] text-gray-700 font-medium focus:ring-2 focus:ring-[#D4AF37] outline-none"
            >
              <option value="all">All Action Types</option>
              <option value="add">Add Actions</option>
              <option value="update">Update Actions</option>
              <option value="status_change">Status Changes</option>
              <option value="delete">Delete Actions</option>
              <option value="search">Search Actions</option>
              <option value="export">Export Actions</option>
            </select>
          </div>

          <div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full text-xs rounded-xl py-2 px-3 border border-[#E0E0E0] bg-[#FAF9F6] text-gray-700 font-medium focus:ring-2 focus:ring-[#D4AF37] outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Past 24 Hours</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Logs List Display */}
      <div className="bg-white rounded-2xl border border-[#F0EFEA] shadow-xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="font-serif font-bold text-gray-700 text-sm">No activity logs match your filter</h4>
            <p className="text-xs text-gray-500">
              Perform an action such as adding a book, editing a status, or searching to register event logs.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F0EFEA]">
            {filteredLogs.map((log) => {
              const dateObj = new Date(log.timestamp);
              const formattedDate = dateObj.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });

              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-[#FAF9F6]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">{getActionBadge(log.action)}</div>
                    <div>
                      <div className="text-xs md:text-sm font-semibold text-[#1A1C1E]">
                        {log.details}
                      </div>
                      {log.bookTitle && (
                        <div className="text-xs text-gray-500 font-serif italic mt-0.5">
                          Target Title: "{log.bookTitle}"
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400 font-mono mt-1">
                        ID: {log.id}
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right flex-shrink-0 text-xs text-gray-500 font-mono">
                    <div>{formattedDate}</div>
                    <div className="text-gray-400 text-[11px]">{formattedTime}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Clear Modal */}
      {isConfirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="text-lg font-bold">Clear All Activity Logs?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              This action will permanently erase all {logs.length} logged events from your local database. 
              You will not be able to recover this history unless you exported a backup.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConfirmClearOpen(false)}
                className="btn btn-outline-secondary btn-sm px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearLogs();
                  setIsConfirmClearOpen(false);
                }}
                className="btn btn-danger btn-sm px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Yes, Clear All Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

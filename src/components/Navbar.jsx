import React from 'react';
import { 
  Search, 
  X, 
  Menu, 
  Plus, 
  Bell, 
  Sparkles,
  Command,
  GraduationCap
} from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  setMobileOpen, 
  onOpenAddModal, 
  activeSubject,
  filteredCount
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090a0f]/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <GraduationCap className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span className="font-semibold text-zinc-200">Portal</span>
          <span>/</span>
          <span className="text-zinc-400 font-medium truncate max-w-[180px]">
            {activeSubject === 'all' 
              ? 'All Resources' 
              : activeSubject === 'favorites'
                ? 'Bookmarks'
                : activeSubject?.name || 'Subject'}
          </span>
        </div>
      </div>

      {/* Center: Global Instant Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-violet-400 transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, PPTs, formulas, tutorials, professors..."
            className="w-full pl-10 pr-16 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800/90 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
          />

          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-[10px] text-zinc-400 font-mono">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Fall 2026 Active
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Resource</span>
        </button>
      </div>
    </header>
  );
}

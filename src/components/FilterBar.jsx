import React from 'react';
import { 
  Filter, 
  FileText, 
  Presentation, 
  Video, 
  BookMarked, 
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';

export default function FilterBar({ 
  selectedType, 
  setSelectedType, 
  sortBy, 
  setSortBy, 
  typeCounts,
  onResetFilters,
  hasActiveFilters
}) {
  const filterOptions = [
    { id: 'ALL', label: 'All Items', icon: Filter, count: typeCounts.ALL },
    { id: 'PDF', label: 'PDF Notes', icon: FileText, count: typeCounts.PDF, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { id: 'PPT', label: 'PPT Slides', icon: Presentation, count: typeCounts.PPT, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'Video', label: 'Video Lectures', icon: Video, count: typeCounts.Video, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'Guide', label: 'Guides & Cheatsheets', icon: BookMarked, count: typeCounts.Guide, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 py-3 border-b border-zinc-800/60 mb-6">
      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
        {filterOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => setSelectedType(opt.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25 border border-violet-500/50 scale-[1.02]'
                  : 'bg-zinc-900/80 text-zinc-300 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
              <span 
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {opt.count || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort & Reset Actions */}
      <div className="flex items-center gap-2.5 self-end md:self-auto flex-shrink-0">
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            title="Reset active filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-400 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-xs text-zinc-200 font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="newest" className="bg-zinc-900 text-zinc-200">Newest First</option>
            <option value="oldest" className="bg-zinc-900 text-zinc-200">Oldest First</option>
            <option value="title" className="bg-zinc-900 text-zinc-200">Alphabetical (A-Z)</option>
            <option value="size" className="bg-zinc-900 text-zinc-200">File Size / Length</option>
          </select>
        </div>
      </div>
    </div>
  );
}

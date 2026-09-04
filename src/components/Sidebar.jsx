import React from 'react';
import { 
  BookOpen, 
  Binary, 
  Calculator, 
  Atom, 
  Cpu, 
  BrainCircuit, 
  Globe, 
  Layers, 
  Sparkles, 
  PlusCircle, 
  HardDrive,
  X,
  BookmarkCheck,
  ChevronRight,
  Upload,
  Eye,
  Activity,
  Gauge,
  Bug,
  Zap,
  Brain,
  Bot
} from 'lucide-react';

const iconMap = {
  Binary: Binary,
  Calculator: Calculator,
  Atom: Atom,
  Cpu: Cpu,
  BrainCircuit: BrainCircuit,
  Globe: Globe,
  Layers: Layers,
  Activity: Activity,
  Gauge: Gauge,
  Bug: Bug,
  Zap: Zap,
  Brain: Brain,
  Bot: Bot
};

export default function Sidebar({ 
  subjects, 
  activeSubjectId, 
  onSelectSubject, 
  mobileOpen, 
  setMobileOpen,
  onOpenAddModal,
  totalFilesCount,
  totalTutorialsCount,
  favoriteCount,
  activeTab
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0f17]/95 border-r border-zinc-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding & Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-zinc-800/80">
          <div 
            onClick={() => {
              onSelectSubject('all');
              setMobileOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Padhle Ladle
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-violet-500/20 text-violet-400 rounded-md border border-violet-500/30">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">Academic Knowledge Base</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <div className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
              Main Navigation
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => {
                  onSelectSubject('all');
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubjectId === 'all'
                    ? 'bg-violet-600/15 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeSubjectId === 'all' ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800/70 text-zinc-400'}`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>All Resources</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 font-mono">
                  {totalFilesCount + totalTutorialsCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectSubject('favorites');
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubjectId === 'favorites'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeSubjectId === 'favorites' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800/70 text-zinc-400'}`}>
                    <BookmarkCheck className="w-4 h-4" />
                  </div>
                  <span>Saved Bookmarks</span>
                </div>
                {favoriteCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {favoriteCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  onSelectSubject('viewer');
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubjectId === 'viewer'
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeSubjectId === 'viewer' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800/70 text-zinc-400'}`}>
                    <Eye className="w-4 h-4" />
                  </div>
                  <span>Read-Only Viewer</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/90 text-indigo-400 font-mono border border-indigo-500/20">
                  Read
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectSubject('admin_upload');
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSubjectId === 'admin_upload'
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${activeSubjectId === 'admin_upload' ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800/70 text-zinc-400'}`}>
                    <Upload className="w-4 h-4" />
                  </div>
                  <span>Admin Drag & Drop</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono border border-violet-500/20">
                  Admin
                </span>
              </button>
            </nav>
          </div>

          {/* Subjects List */}
          <div>
            <div className="flex items-center justify-between px-2.5 pb-2">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-300 uppercase">
                Enrolled Subjects
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/60 px-1.5 py-0.5 rounded">
                {subjects.length} courses
              </span>
            </div>

            <nav className="space-y-1">
              {subjects.map((subj) => {
                const IconComponent = iconMap[subj.icon] || BookOpen;
                const isActive = activeSubjectId === subj.id;
                const totalItems = (subj.files?.length || 0) + (subj.tutorials?.length || 0);

                return (
                  <button
                    key={subj.id}
                    onClick={() => {
                      onSelectSubject(subj.id);
                      setMobileOpen(false);
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-zinc-800/90 text-white border border-zinc-700 shadow-md shadow-black/30'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className={`p-1.5 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-violet-500/20 text-violet-300' 
                            : 'bg-zinc-800/70 text-zinc-400 group-hover:text-zinc-200'
                        }`}
                        style={{ color: isActive ? subj.accentColor : undefined }}
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                      </div>
                      <div className="text-left truncate">
                        <div className="truncate text-xs font-semibold leading-tight">
                          {subj.name}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {subj.code}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className="text-[11px] text-zinc-400 font-mono px-1.5 py-0.5 rounded bg-zinc-900/60 border border-zinc-800/60">
                        {totalItems}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Quick Upload CTA & Storage Card */}
        <div className="p-3.5 border-t border-zinc-800/80 bg-zinc-950/40 space-y-3">
          <button
            onClick={onOpenAddModal}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/30 active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload New Resource</span>
          </button>

          {/* Mini Storage Indicator */}
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60 text-xs">
            <div className="flex items-center justify-between text-zinc-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px]">
                <HardDrive className="w-3 h-3 text-violet-400" />
                Cloud Synced
              </span>
              <span className="font-mono text-[10px] text-emerald-400 font-semibold">Active</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-emerald-400 h-full w-[24%]" />
            </div>
            <div className="flex justify-between items-center mt-1 text-[10px] text-zinc-400 font-mono">
              <span>{totalFilesCount} PDFs/PPTs</span>
              <span>{totalTutorialsCount} Guides</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

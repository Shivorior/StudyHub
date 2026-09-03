import React from 'react';
import StatsOverview from './StatsOverview';
import FilterBar from './FilterBar';
import FileCard from './FileCard';
import TutorialCard from './TutorialCard';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Binary, 
  Calculator, 
  Atom, 
  Cpu, 
  BrainCircuit, 
  Globe,
  Layers,
  Search,
  CheckCircle,
  FileQuestion,
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

export default function HomeOverview({ 
  subjects, 
  onSelectSubject, 
  allFiles, 
  allTutorials, 
  filteredFiles, 
  filteredTutorials,
  selectedType, 
  setSelectedType, 
  sortBy, 
  setSortBy, 
  onPreviewFile, 
  onDownloadFile, 
  onWatchTutorial, 
  bookmarks, 
  onToggleBookmark,
  onOpenAddModal,
  searchQuery,
  typeCounts,
  onResetFilters
}) {
  const totalFiles = allFiles.length;
  const totalTutorials = allTutorials.length;
  const totalPdfs = allFiles.filter(f => f.type === 'PDF').length;
  const totalPpts = allFiles.filter(f => f.type === 'PPT').length;

  const hasActiveFilters = selectedType !== 'ALL' || searchQuery.trim() !== '';
  const totalDisplayItems = filteredFiles.length + filteredTutorials.length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-violet-950/40 via-zinc-900 to-zinc-950 border border-violet-500/20 shadow-2xl shadow-violet-950/20">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Curated Academic Repository • Fall Semester</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Centralized Hub for Class Notes, PPTs & Video Tutorials
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
            Instant access to all lecture presentations, downloadable PDF cheat-sheets, and in-depth video walkthroughs categorized by subject.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all active:scale-[0.98]"
            >
              + Upload New Resource
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('all-resources-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition-all"
            >
              Browse All Materials ↓
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Counters */}
      <StatsOverview
        totalSubjects={subjects.length}
        totalFiles={totalFiles}
        totalTutorials={totalTutorials}
        totalPdfs={totalPdfs}
        totalPpts={totalPpts}
      />

      {/* Quick Jump: Subjects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Browse by Subject
            </h2>
            <p className="text-xs text-zinc-400">
              Select a course to view dedicated notes, slides, and video lectures
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subj) => {
            const Icon = iconMap[subj.icon] || BookOpen;
            const fileCount = subj.files?.length || 0;
            const tutorialCount = subj.tutorials?.length || 0;

            return (
              <div
                key={subj.id}
                onClick={() => onSelectSubject(subj.id)}
                className="group glass-card p-5 rounded-2xl border border-zinc-800/80 hover:border-violet-500/40 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-zinc-800 group-hover:scale-110 transition-transform"
                      style={{ color: subj.accentColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                      {subj.code}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-100 group-hover:text-violet-300 transition-colors mb-1.5">
                    {subj.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {subj.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                    <span>{fileCount} Files</span>
                    <span>•</span>
                    <span>{tutorialCount} Tutorials</span>
                  </div>

                  <span className="flex items-center gap-1 text-violet-400 font-semibold group-hover:translate-x-0.5 transition-transform text-[11px]">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Instant Search Section */}
      <div id="all-resources-section" className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>All Learning Resources</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                {totalDisplayItems} results
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Filter by type (PDF, PPT, Video, Guide) or search across lectures
            </p>
          </div>
        </div>

        <FilterBar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          typeCounts={typeCounts}
          onResetFilters={onResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Empty State if No Matches */}
        {totalDisplayItems === 0 && (
          <div className="glass-card rounded-2xl p-12 text-center border border-zinc-800 my-6">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-500">
              <FileQuestion className="w-7 h-7 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold text-zinc-200 mb-1">
              No matching resources found
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-5">
              We couldn't find any class files or tutorials matching "{searchQuery}". Try adjusting your search query or reset the type filters.
            </p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Section 1: Class Notes & PPTs */}
        {filteredFiles.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Class Notes & Slide Decks</span>
                <span className="text-xs font-mono text-zinc-400">
                  ({filteredFiles.length})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  subjectName={file.subjectName}
                  subjectCode={file.subjectCode}
                  onPreview={onPreviewFile}
                  onDownload={onDownloadFile}
                  isBookmarked={bookmarks.has(file.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Tutorials & Video Guides */}
        {filteredTutorials.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span>Tutorials, Guides & Video Lectures</span>
                <span className="text-xs font-mono text-zinc-400">
                  ({filteredTutorials.length})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTutorials.map((tut) => (
                <TutorialCard
                  key={tut.id}
                  tutorial={tut}
                  subjectName={tut.subjectName}
                  subjectCode={tut.subjectCode}
                  onWatch={onWatchTutorial}
                  isBookmarked={bookmarks.has(tut.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

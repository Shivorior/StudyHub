import React, { useState } from 'react';
import FileCard from './FileCard';
import TutorialCard from './TutorialCard';
import FilterBar from './FilterBar';
import { 
  ArrowLeft, 
  FileText, 
  Video, 
  User, 
  Calendar, 
  Sparkles, 
  Plus, 
  Binary, 
  Calculator, 
  Atom, 
  Cpu, 
  BrainCircuit, 
  Globe, 
  Layers,
  Search,
  BookOpen,
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

export default function SubjectDetail({ 
  subject, 
  onBack, 
  onPreviewFile, 
  onDownloadFile, 
  onWatchTutorial, 
  bookmarks, 
  onToggleBookmark, 
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  onResetFilters
}) {
  const [activeTab, setActiveTab] = useState('files'); // 'files' | 'tutorials'

  const Icon = iconMap[subject.icon] || BookOpen;
  const files = subject.files || [];
  const tutorials = subject.tutorials || [];

  // Filter files
  const filteredFiles = files.filter(f => {
    const matchesSearch = searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.summary && f.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.tags && f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = selectedType === 'ALL' || selectedType === f.type;
    return matchesSearch && matchesType;
  });

  // Filter tutorials
  const filteredTutorials = tutorials.filter(t => {
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = selectedType === 'ALL' || selectedType === t.type;
    return matchesSearch && matchesType;
  });

  // Type counts for filter bar inside this subject
  const typeCounts = {
    ALL: files.length + tutorials.length,
    PDF: files.filter(f => f.type === 'PDF').length,
    PPT: files.filter(f => f.type === 'PPT').length,
    Video: tutorials.filter(t => t.type === 'Video').length,
    Guide: tutorials.filter(t => t.type === 'Guide').length
  };

  const hasActiveFilters = selectedType !== 'ALL' || searchQuery.trim() !== '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button & Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Courses</span>
      </button>

      {/* Subject Header Card */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 shadow-xl">
        {/* Glow Accent */}
        <div 
          className="absolute -right-12 -top-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: subject.accentColor || '#8b5cf6' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-900 border border-zinc-800 shadow-inner flex-shrink-0"
              style={{ color: subject.accentColor }}
            >
              <Icon className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {subject.code}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {subject.semester || 'Fall 2026'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {subject.name}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                {subject.description}
              </p>

              {subject.instructor && (
                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Instructors: <strong className="text-zinc-300">{subject.instructor}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Header Action Button */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 flex-shrink-0">
            <button
              onClick={() => onOpenAddModal(subject.id)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource to {subject.code}</span>
            </button>

            <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-2">
              <span>{files.length} Notes/Slides</span>
              <span>•</span>
              <span>{tutorials.length} Tutorials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation (Tab 1: Class Files vs Tab 2: Tutorials & Guides) */}
      <div className="flex items-center gap-3 border-b border-zinc-800/80">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'files'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Class Files (PDFs & PPTs)</span>
          <span 
            className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              activeTab === 'files' ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {files.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tutorials')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'tutorials'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Tutorials & Guides</span>
          <span 
            className={`px-2 py-0.5 rounded-full text-xs font-mono ${
              activeTab === 'tutorials' ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {tutorials.length}
          </span>
        </button>
      </div>

      {/* Filter and Sort bar */}
      <FilterBar
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        typeCounts={typeCounts}
        onResetFilters={onResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Tab 1 Content: Class Files (PDFs & PPTs) */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          {filteredFiles.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-zinc-800">
              <FileQuestion className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-zinc-200 mb-1">
                No class files match your filter
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                No lecture notes or PPT slides match the current keyword or filter criteria.
              </p>
              <button
                onClick={onResetFilters}
                className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  subjectName={subject.name}
                  subjectCode={subject.code}
                  onPreview={onPreviewFile}
                  onDownload={onDownloadFile}
                  isBookmarked={bookmarks.has(file.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2 Content: Tutorials & Guides */}
      {activeTab === 'tutorials' && (
        <div className="space-y-4">
          {filteredTutorials.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-zinc-800">
              <Video className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-zinc-200 mb-1">
                No tutorials match your filter
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                No videos or written tutorials match your active filter.
              </p>
              <button
                onClick={onResetFilters}
                className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTutorials.map((tut) => (
                <TutorialCard
                  key={tut.id}
                  tutorial={tut}
                  subjectName={subject.name}
                  subjectCode={subject.code}
                  onWatch={onWatchTutorial}
                  isBookmarked={bookmarks.has(tut.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { 
  FileText, 
  Presentation, 
  Download, 
  Eye, 
  Calendar, 
  Layers, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function FileCard({ 
  file, 
  subjectName, 
  subjectCode, 
  onPreview, 
  onDownload, 
  isBookmarked, 
  onToggleBookmark 
}) {
  const isPdf = file.type === 'PDF';

  return (
    <div className="group relative glass-card rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between">
      {/* Glow Effect Accent */}
      <div 
        className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isPdf 
            ? 'bg-gradient-to-r from-rose-500/10 via-transparent to-red-500/10' 
            : 'bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/10'
        }`} 
      />

      <div>
        {/* Top Badges & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide border ${
                isPdf
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {isPdf ? (
                <FileText className="w-3.5 h-3.5" />
              ) : (
                <Presentation className="w-3.5 h-3.5" />
              )}
              <span>{file.type}</span>
            </span>

            {file.week && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 text-[10px] font-mono border border-zinc-700/50">
                {file.week}
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(file.id, 'file')}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark file'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-400/30 text-amber-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* File Name */}
        <h3 className="font-semibold text-zinc-100 text-sm sm:text-base leading-snug group-hover:text-violet-300 transition-colors line-clamp-2 mb-2">
          {file.name}
        </h3>

        {/* File Description / Summary */}
        {file.summary && (
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
            {file.summary}
          </p>
        )}

        {/* Subject & Author Info */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-3">
          {subjectName && (
            <span className="font-medium text-zinc-400">
              {subjectCode || subjectName}
            </span>
          )}
          {file.author && (
            <>
              <span>•</span>
              <span className="truncate">{file.author}</span>
            </>
          )}
        </div>

        {/* Meta Info (Pages/Slides, Size, Date) */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/60 mb-4">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-zinc-400" />
            {isPdf ? `${file.pages || 24} Pages` : `${file.slides || 30} Slides`}
          </span>
          <span>•</span>
          <span className="font-semibold text-zinc-300">{file.size}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-zinc-400">
            <Calendar className="w-3 h-3 text-zinc-400" />
            {file.uploadedAt}
          </span>
        </div>

        {/* Tags */}
        {file.tags && file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {file.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] bg-zinc-800/60 text-zinc-400 border border-zinc-700/40"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={() => onPreview(file)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700/60 transition-all active:scale-[0.98]"
        >
          <Eye className="w-3.5 h-3.5 text-violet-400" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => onDownload(file)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold border border-violet-500/30 hover:border-violet-500 transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Play, 
  Video, 
  BookMarked, 
  Clock, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck,
  ListOrdered
} from 'lucide-react';

export default function TutorialCard({ 
  tutorial, 
  subjectName, 
  subjectCode, 
  onWatch, 
  isBookmarked, 
  onToggleBookmark 
}) {
  const isVideo = tutorial.type === 'Video';

  return (
    <div className="group relative glass-card rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between">
      {/* Top Banner / Thumbnail */}
      <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
        {tutorial.thumbnail ? (
          <img
            src={tutorial.thumbnail}
            alt={tutorial.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-95"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
            {isVideo ? <Video className="w-12 h-12 text-zinc-600" /> : <BookMarked className="w-12 h-12 text-zinc-600" />}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-[#0f111a]/40 to-transparent" />

        {/* Play Button Overlay for Videos */}
        {isVideo && (
          <button
            onClick={() => onWatch(tutorial)}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-violet-600/90 hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-black/60 group-hover:scale-110 transition-all active:scale-95"
            aria-label="Play video"
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </button>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide backdrop-blur-md border ${
              isVideo
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isVideo ? <Video className="w-3.5 h-3.5" /> : <BookMarked className="w-3.5 h-3.5" />}
            <span>{tutorial.type}</span>
          </span>

          {subjectCode && (
            <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 text-[10px] font-mono border border-zinc-700/40">
              {subjectCode}
            </span>
          )}
        </div>

        {/* Bookmark & Duration */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => onToggleBookmark(tutorial.id, 'tutorial')}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
              isBookmarked
                ? 'text-amber-400 bg-black/70 border-amber-500/40'
                : 'text-zinc-300 bg-black/50 border-white/10 hover:text-white hover:bg-black/70'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark tutorial'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-400/30 text-amber-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Duration bottom-right tag */}
        <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[11px] text-zinc-200 font-mono flex items-center gap-1 border border-white/10">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span>{tutorial.duration}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-semibold text-zinc-100 text-sm sm:text-base leading-snug group-hover:text-violet-300 transition-colors line-clamp-2 mb-2">
            {tutorial.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3">
            {tutorial.description}
          </p>

          {/* Steps Preview for Guides */}
          {tutorial.steps && tutorial.steps.length > 0 && (
            <div className="mb-3.5 p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <ListOrdered className="w-3 h-3" />
                Key Steps Included:
              </div>
              {tutorial.steps.slice(0, 2).map((step, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-zinc-400">
                  <span className="text-zinc-400 font-mono text-[10px]">{idx + 1}.</span>
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Instructor & Upload date */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 mb-3">
            <User className="w-3 h-3 text-zinc-400" />
            <span className="truncate">{tutorial.instructor}</span>
            <span>•</span>
            <span className="font-mono text-zinc-400">{tutorial.uploadedAt}</span>
          </div>

          {/* Tags */}
          {tutorial.tags && tutorial.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tutorial.tags.map((tag, idx) => (
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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/60">
          <button
            onClick={() => onWatch(tutorial)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all active:scale-[0.98]"
          >
            {isVideo ? <Play className="w-3.5 h-3.5 fill-white" /> : <BookMarked className="w-3.5 h-3.5" />}
            <span>{isVideo ? 'Watch Video' : 'Read Guide'}</span>
          </button>

          <a
            href={tutorial.externalUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/60 transition-all active:scale-[0.98]"
          >
            <span>External Link</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    </div>
  );
}

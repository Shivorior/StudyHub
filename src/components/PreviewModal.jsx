import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Presentation, 
  Video, 
  BookMarked, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ExternalLink,
  CheckCircle,
  Copy,
  Sparkles,
  Share2
} from 'lucide-react';

export default function PreviewModal({ 
  item, 
  isOpen, 
  onClose, 
  onDownload, 
  onShowToast 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!isOpen || !item) return null;

  const isFile = !!item.type && (item.type === 'PDF' || item.type === 'PPT');
  const isPdf = item.type === 'PDF';
  const isPpt = item.type === 'PPT';
  const isVideo = item.type === 'Video';
  const isGuide = item.type === 'Guide';

  const totalPages = isPdf ? (item.pages || 42) : (item.slides || 36);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    onShowToast?.('Share link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl h-[90vh] max-h-[900px] flex flex-col rounded-3xl bg-[#0e101a] border border-zinc-700/80 shadow-2xl shadow-black z-10 modal-animate overflow-hidden">
        {/* Top App Bar */}
        <div className="h-16 px-4 sm:px-6 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-zinc-800 text-violet-400 flex-shrink-0">
              {isPdf && <FileText className="w-5 h-5 text-rose-400" />}
              {isPpt && <Presentation className="w-5 h-5 text-amber-400" />}
              {isVideo && <Video className="w-5 h-5 text-sky-400" />}
              {isGuide && <BookMarked className="w-5 h-5 text-emerald-400" />}
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-sm sm:text-base text-zinc-100 truncate">
                {item.name || item.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <span>{item.type}</span>
                <span>•</span>
                <span>{item.size || item.duration}</span>
                {item.author && (
                  <>
                    <span>•</span>
                    <span className="truncate">{item.author}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Share resource"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {isFile && (
              <button
                onClick={() => onDownload(item)}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Viewport */}
        <div className="flex-1 bg-[#090a0f] overflow-y-auto flex flex-col items-center justify-center p-4 sm:p-6 relative">
          {/* PDF PREVIEW MODE */}
          {isPdf && (
            <div 
              className="w-full max-w-3xl bg-white text-zinc-900 rounded-2xl shadow-2xl p-6 sm:p-10 transition-transform duration-150 overflow-y-auto min-h-[500px]"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* PDF Header Mockup */}
              <div className="border-b-2 border-zinc-900 pb-4 mb-6 flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-violet-700 uppercase">
                    ACADEMIC COURSEWARE • DEPARTMENT OF COMPUTER SCIENCE
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-950 mt-1">
                    {item.name.replace(/\.pdf$/i, '')}
                  </h1>
                  <p className="text-xs text-zinc-600 mt-1">
                    Instructor: {item.author || 'Department Faculty'} • Week: {item.week || 'Module 1'} • Term: Fall 2026
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-zinc-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>

              {/* PDF Body Mockup */}
              <div className="space-y-4 text-xs sm:text-sm text-zinc-800 leading-relaxed font-serif">
                <div className="p-3.5 rounded-lg bg-zinc-100 border border-zinc-300 font-sans text-xs">
                  <strong className="text-zinc-900 block mb-1">Abstract & Core Theorems:</strong>
                  {item.summary || "This technical lecture document details foundational principles, formal proofs, structural invariants, and algorithmic optimization strategies."}
                </div>

                <h3 className="font-sans font-bold text-base text-zinc-950 pt-2 border-b border-zinc-200">
                  Section {currentPage}.1 — Theoretical Formulations & Boundary Conditions
                </h3>

                <p>
                  Let G = (V, E) be a connected, weighted graph with vertices V and edges E. We denote the minimum cut partition as (S, V \ S). By applying the max-flow min-cut theorem, the capacity of the minimum s-t cut is mathematically equivalent to the maximum feasible throughput network flow.
                </p>

                {/* Mathematical Equation Box */}
                <div className="py-3 px-4 rounded bg-zinc-50 border-l-4 border-violet-600 font-mono text-xs my-3 text-zinc-900">
                  {"f(x) = ∑ [α_i · K(x_i, x)] + β_0,  where α_i ≥ 0"}
                </div>

                <p>
                  As derived in theorem {currentPage}.4, whenever the invariant condition holds across all recursive traversal steps, the tree height remains bounded strictly by O(log n). This logarithmic guarantee ensures optimal operational access without worst-case degradation.
                </p>

                {/* Code Snippet */}
                <div className="p-3 rounded-lg bg-zinc-900 text-zinc-100 font-mono text-xs">
                  <span className="text-violet-400 font-semibold">// Algorithmic Invariant Check</span>
                  <br />
                  function verifyInvariants(node, blackCount = 0) &#123;
                  <br />
                  &nbsp;&nbsp;if (!node) return blackCount + 1;
                  <br />
                  &nbsp;&nbsp;if (node.color === 'RED' &amp;&amp; node.parent?.color === 'RED') throw Error("Red Violation");
                  <br />
                  &nbsp;&nbsp;return verifyInvariants(node.left, node.color === 'BLACK' ? blackCount + 1 : blackCount);
                  <br />
                  &#125;
                </div>
              </div>
            </div>
          )}

          {/* PPT PREVIEW MODE */}
          {isPpt && (
            <div 
              className="w-full max-w-3xl aspect-[16/9] bg-gradient-to-br from-zinc-900 via-[#131722] to-zinc-950 rounded-2xl border border-zinc-700 p-8 sm:p-12 shadow-2xl flex flex-col justify-between"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                    SLIDE DECK • SLIDE {currentPage} OF {totalPages}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {item.author || 'Academic Staff'}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                  {currentPage === 1 ? item.name.replace(/\.pptx?$/i, '') : `Key Concept: Optimization Module #${currentPage}`}
                </h1>

                <p className="text-sm sm:text-base text-zinc-300 mb-6">
                  {item.summary || "Core architectural breakdown and real-world system implementations."}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <h4 className="text-xs font-bold text-amber-400 mb-1">Key Takeaway A</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Linear scale throughput achievable through asynchronous worker thread pooling and non-blocking I/O.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                    <h4 className="text-xs font-bold text-amber-400 mb-1">Key Takeaway B</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Cache-line alignment reduces CPU bus contention by 42% on multi-core architectures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-zinc-500 font-mono pt-4 border-t border-zinc-800/80">
                <span>{item.week || 'Fall Semester 2026'}</span>
                <span>Confidential Academic Distribution</span>
              </div>
            </div>
          )}

          {/* VIDEO TUTORIAL MODE */}
          {isVideo && (
            <div className="w-full max-w-4xl h-full flex flex-col">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
                {item.videoUrl ? (
                  <iframe
                    src={item.videoUrl}
                    title={item.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    No video embed provided.
                  </div>
                )}
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {item.duration}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>Instructor: <strong className="text-zinc-200">{item.instructor}</strong></span>
                  <span>•</span>
                  <span>Published: {item.uploadedAt}</span>
                </div>
              </div>
            </div>
          )}

          {/* GUIDE / CHEATSHEET MODE */}
          {isGuide && (
            <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl border border-zinc-800 p-6 sm:p-8 text-left shadow-2xl overflow-y-auto max-h-full">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Interactive Walkthrough Guide
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {item.title}
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                  {item.duration}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                {item.description}
              </p>

              {item.steps && item.steps.length > 0 && (
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                    Recommended Study Progression:
                  </h4>
                  {item.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs font-mono text-zinc-400 block mb-1">Quick Reference Shell / Command:</span>
                <code className="text-xs font-mono text-violet-300">
                  $ curl -sSL https://portal.padhleladle.edu/cheatsheets/{item.id} | less
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Pagination & Zoom Controls (Only for PDF & PPT) */}
        {isFile && (
          <div className="h-14 px-6 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300 flex-shrink-0">
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-zinc-300">
                {isPdf ? 'Page' : 'Slide'} <strong className="text-white">{currentPage}</strong> / {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage >= totalPages}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(z => Math.max(70, z - 10))}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-zinc-400 text-[11px] w-12 text-center">
                {zoomLevel}%
              </span>

              <button
                onClick={() => setZoomLevel(z => Math.min(130, z + 10))}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

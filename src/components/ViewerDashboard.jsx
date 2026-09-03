import React from 'react';
import { Download, Eye, FileText, BookOpen, Layers } from 'lucide-react';

export default function ViewerDashboard({ subjects = [], onPreview, onDownload }) {
  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto text-white animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white tracking-tight">Class Resource Portal</h1>
          <p className="text-slate-400 text-sm">Select a subject to view notes and tutorial sheets. Read-only access.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{subjects.length} Subjects Enrolled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-indigo-400 truncate">{subject.name}</h2>
                {subject.code && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {subject.code}
                  </span>
                )}
              </div>
              
              {/* Files Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Class Files</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{(subject.files || []).length}</span>
                </div>
                {(subject.files || []).map((file, idx) => (
                  <div key={file.id || idx} className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-lg mb-2 hover:bg-slate-800 transition-colors">
                    <span className="text-sm truncate max-w-[150px] text-slate-200" title={file.name || file.title}>
                      {file.title || file.name}
                    </span>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button 
                        onClick={() => onPreview ? onPreview(file) : null}
                        title="Preview" 
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload ? onDownload(file) : null}
                        title="Download" 
                        className="p-1.5 hover:bg-slate-700 rounded text-indigo-400 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tutorial Sheets Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tutorial Sheets</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{(subject.tutorials || []).length}</span>
                </div>
                {(subject.tutorials || []).map((tut, idx) => (
                  <div key={tut.id || idx} className="flex items-center justify-between bg-slate-800/60 p-2.5 rounded-lg mb-2 hover:bg-slate-800 transition-colors">
                    <span className="text-sm truncate max-w-[150px] text-slate-200" title={tut.title}>
                      {tut.title}
                    </span>
                    <div className="flex space-x-2 flex-shrink-0">
                      <button 
                        onClick={() => onPreview ? onPreview(tut) : null}
                        title="View Tutorial" 
                        className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload ? onDownload(tut) : null}
                        title="Download Sheet" 
                        className="p-1.5 hover:bg-slate-700 rounded text-indigo-400 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

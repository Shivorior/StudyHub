import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function UploadZone({ subjects = [], onFileUpload, onShowToast }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetSubjectId, setTargetSubjectId] = useState(subjects[0]?.id || 'dsa');
  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadedSuccess(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadedSuccess(false);
    }
  };

  const handleConfirmUpload = () => {
    if (!selectedFile) return;

    const fileName = selectedFile.name;
    const isPpt = fileName.toLowerCase().endsWith('.ppt') || fileName.toLowerCase().endsWith('.pptx');
    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    const detectedType = isPpt ? 'PPT' : (isPdf ? 'PDF' : 'PDF');

    const formattedSize = selectedFile.size 
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` 
      : '3.5 MB';

    const newFileObject = {
      id: `drag-drop-${Date.now()}`,
      name: fileName,
      type: detectedType,
      size: formattedSize,
      uploadedAt: new Date().toISOString().split('T')[0],
      week: 'Week 6',
      author: 'Admin Upload',
      pages: detectedType === 'PDF' ? 24 : undefined,
      slides: detectedType === 'PPT' ? 30 : undefined,
      summary: `Uploaded via Admin Drag-and-Drop portal: ${fileName}`,
      tags: ['Admin', 'Upload', detectedType],
      downloadUrl: '#',
      previewUrl: '#'
    };

    if (onFileUpload) {
      onFileUpload(targetSubjectId, 'file', newFileObject);
    }

    setUploadedSuccess(true);
    if (onShowToast) {
      onShowToast(`Uploaded "${fileName}" to ${targetSubjectId.toUpperCase()}!`);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-2xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 text-white shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Upload Class Resource</h2>
            <p className="text-xs text-slate-400">Admin drag-and-drop ingestion interface</p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Admin View
        </span>
      </div>

      <p className="text-xs text-slate-400 mb-5">
        Upload lecture notes, presentation slide decks, or tutorial handouts for enrolled students.
      </p>

      {/* Target Subject Selector */}
      {subjects && subjects.length > 0 && (
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Destination Subject:
          </label>
          <select
            value={targetSubjectId}
            onChange={(e) => setTargetSubjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                {s.code} — {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-500/15 scale-[1.01]' 
            : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800/80 hover:border-slate-600'
        }`}
      >
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          onChange={handleFileSelect}
        />
        <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
          <Upload className="w-12 h-12 text-indigo-400 mb-3 transition-transform group-hover:scale-110" />
          <p className="text-sm font-medium text-slate-300">
            Drag and drop your PDF, PPT, or file here, or <span className="text-indigo-400 underline font-semibold">browse</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">Supports PDF, PPT, DOCX up to 50MB</p>
        </label>
      </div>

      {/* Selected File Card */}
      {selectedFile && (
        <div className="mt-5 p-4 rounded-xl bg-slate-800 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-slate-100 truncate block max-w-xs sm:max-w-sm">
                {selectedFile.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          <button 
            onClick={handleConfirmUpload}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Confirm Upload</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Success Notification */}
      {uploadedSuccess && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>File successfully ingested into curriculum! Check the subject portal or read-only viewer to see it live.</span>
        </div>
      )}
    </div>
  );
}

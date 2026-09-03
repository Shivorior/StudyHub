import React, { useState, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Presentation, 
  Video, 
  BookMarked, 
  Check, 
  Sparkles,
  Link2,
  Tag,
  Clock,
  HardDrive
} from 'lucide-react';

export default function AddResourceModal({ 
  isOpen, 
  onClose, 
  subjects, 
  initialSubjectId, 
  onAddResource 
}) {
  const [subjectId, setSubjectId] = useState(initialSubjectId || subjects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('file'); // 'file' | 'tutorial'
  const [resourceType, setResourceType] = useState('PDF'); // 'PDF' | 'PPT' | 'Video' | 'Guide'
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [sizeOrDuration, setSizeOrDuration] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [week, setWeek] = useState('Week 5');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialSubjectId) {
      setSubjectId(initialSubjectId);
    } else if (subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id);
    }
  }, [initialSubjectId, subjects]);

  // Sync category and resourceType
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (cat === 'file') {
      setResourceType('PDF');
      setSizeOrDuration('5.2 MB');
    } else {
      setResourceType('Video');
      setSizeOrDuration('32 mins');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Resource title is required';
    if (!subjectId) newErrors.subjectId = 'Please select a course';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tagList = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (category === 'file') {
      const newFile = {
        id: `custom-f-${Date.now()}`,
        name: title.trim().endsWith(`.${resourceType.toLowerCase()}`) 
          ? title.trim() 
          : `${title.trim()}.${resourceType === 'PDF' ? 'pdf' : 'pptx'}`,
        type: resourceType,
        size: sizeOrDuration.trim() || '4.8 MB',
        uploadedAt: new Date().toISOString().split('T')[0],
        week: week.trim() || 'Week 5',
        author: author.trim() || 'Class Contributor',
        pages: resourceType === 'PDF' ? 28 : undefined,
        slides: resourceType === 'PPT' ? 32 : undefined,
        summary: summary.trim() || 'Class notes and materials uploaded via portal.',
        tags: tagList.length > 0 ? tagList : ['Lecture', 'Notes'],
        downloadUrl: url.trim() || '#',
        previewUrl: url.trim() || '#'
      };
      onAddResource(subjectId, 'file', newFile);
    } else {
      const newTutorial = {
        id: `custom-t-${Date.now()}`,
        title: title.trim(),
        type: resourceType,
        duration: sizeOrDuration.trim() || (resourceType === 'Video' ? '30 mins' : '10 min read'),
        instructor: author.trim() || 'Guest Speaker',
        uploadedAt: new Date().toISOString().split('T')[0],
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
        videoUrl: url.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        externalUrl: url.trim() || 'https://youtube.com',
        description: summary.trim() || 'Comprehensive tutorial and reference guide uploaded via portal.',
        tags: tagList.length > 0 ? tagList : ['Tutorial', 'Guide'],
        steps: resourceType === 'Guide' ? [
          'Review the core theoretical prerequisites',
          'Execute step-by-step problem breakdown',
          'Test with practice midterm questions'
        ] : undefined
      };
      onAddResource(subjectId, 'tutorial', newTutorial);
    }

    // Reset form
    setTitle('');
    setUrl('');
    setAuthor('');
    setSizeOrDuration('');
    setSummary('');
    setTags('');
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#0f121d] border border-zinc-700/80 shadow-2xl shadow-black/80 z-10 modal-animate overflow-hidden">
        {/* Header with gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400" />

        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Add New Academic Resource
              </h2>
              <p className="text-xs text-zinc-400">
                Upload or link lecture slides, PDF notes, or video tutorials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Subject Select */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Subject / Course <span className="text-rose-400">*</span>
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id} className="bg-zinc-900 text-zinc-200">
                  {subj.code} — {subj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Toggle */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Resource Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCategoryChange('file')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                  category === 'file'
                    ? 'bg-violet-600/20 text-violet-300 border-violet-500/50 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Class File (PDF / PPT)</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('tutorial')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                  category === 'tutorial'
                    ? 'bg-violet-600/20 text-violet-300 border-violet-500/50 shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Tutorial / Guide</span>
              </button>
            </div>
          </div>

          {/* Resource Specific Format */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Format Type
            </label>
            <div className="flex gap-2">
              {category === 'file' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setResourceType('PDF')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      resourceType === 'PDF'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Document</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResourceType('PPT')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      resourceType === 'PPT'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>PPT Slide Deck</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setResourceType('Video')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      resourceType === 'Video'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Lecture</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResourceType('Guide')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      resourceType === 'Guide'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800'
                    }`}
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>Interactive Guide</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                category === 'file' 
                  ? 'e.g., Lecture 08: Distributed Consensus Algorithms.pdf' 
                  : 'e.g., Complete Crash Course on Raft & Paxos Protocols'
              }
              className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 ${
                errors.title 
                  ? 'border-rose-500 focus:ring-rose-500' 
                  : 'border-zinc-700/80 focus:border-violet-500 focus:ring-violet-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-[11px] text-rose-400 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* URL & Size/Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Link or Embed URL</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={category === 'file' ? 'https://example.com/notes.pdf' : 'https://youtube.com/embed/...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
                {category === 'file' ? <HardDrive className="w-3.5 h-3.5 text-zinc-400" /> : <Clock className="w-3.5 h-3.5 text-zinc-400" />}
                <span>{category === 'file' ? 'Estimated Size' : 'Duration'}</span>
              </label>
              <input
                type="text"
                value={sizeOrDuration}
                onChange={(e) => setSizeOrDuration(e.target.value)}
                placeholder={category === 'file' ? 'e.g., 6.4 MB' : 'e.g., 35 mins'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Instructor & Week */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Instructor / Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g., Prof. Linus Torvalds"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Curriculum Week / Module
              </label>
              <input
                type="text"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="e.g., Week 6"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Summary / Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Summary / Key Concepts
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief highlights of topics covered in this lecture..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., Algorithms, MidtermReview, Graphs"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700/80 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Add to Curriculum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

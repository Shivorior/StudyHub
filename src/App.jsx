import React, { useState, useEffect } from 'react';
import { Shield, Lock, X, Upload, FileText, Download, Eye, ChevronRight, Clock, Search } from 'lucide-react';
import subjectsData from './data/subjects.json';

export default function App() {
  const [subjects, setSubjects] = useState(subjectsData);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [viewMode, setViewMode] = useState('viewer'); 

  // Navigation state
  const [selectedBranch, setSelectedBranch] = useState('EIC');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [activeTab, setActiveTab] = useState('files');
  const [searchQuery, setSearchQuery] = useState('');

  // Preview Modal state
  const [previewItem, setPreviewItem] = useState(null);

  // Second Year Engineering Branches
  const branches = [
    { id: 'EIC', name: 'Electronics Instrumentation & Control (EIC)' },
    { id: 'CSE', name: 'Computer Science & Engineering (CSE)' },
    { id: 'ECE', name: 'Electronics & Communication (ECE)' },
    { id: 'MECH', name: 'Mechanical Engineering (MECH)' },
    { id: 'CIVIL', name: 'Civil Engineering (CIVIL)' }
  ];

  // Listen to URL Hash changes (e.g., typing yoursite.com/#admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    // Check on initial page load if hash is already #admin
    if (window.location.hash === '#admin') {
      setIsAdminOpen(true);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Secret keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A on macOS)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        window.location.hash = '#admin';
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When closing the admin modal without logging in, clear the hash so it doesn't loop
  const handleCloseAdminModal = () => {
    setIsAdminOpen(false);
    if (!isAuthenticated) {
      window.location.hash = '';
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'shivay123') {
      setIsAuthenticated(true);
      setViewMode('admin');
      setIsAdminOpen(false);
      setPasswordInput('');
    } else {
      alert('Incorrect Password');
    }
  };

  const currentSubjectData = subjects.find(s => s.id === selectedSubject) || subjects[0] || { name: 'Subject', files: [], tutorials: [] };

  const filteredFiles = (currentSubjectData.files || []).filter(file => {
    const title = (file.title || file.name || '').toLowerCase();
    const desc = (file.description || file.summary || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const filteredTutorials = (currentSubjectData.tutorials || []).filter(tut => {
    const title = (tut.title || tut.name || '').toLowerCase();
    const desc = (tut.description || tut.summary || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-500 selection:text-white">
      {/* Apple-style Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-md border-b border-[#d2d2d7]/60 px-8 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">S</div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">StudyHub.</h1>
            <p className="text-[11px] text-[#86868b]">Second Year Academic Portal</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {viewMode === 'admin' && (
            <button 
              onClick={() => {
                setViewMode('viewer');
                window.location.hash = '';
              }}
              className="text-xs font-medium bg-[#e8e8ed] hover:bg-[#d2d2d7] px-3.5 py-1.5 rounded-full transition"
            >
              Exit Admin
            </button>
          )}
          {/* Subtle Admin Icon Link */}
          <a 
            href="#admin"
            className="p-2 text-[#86868b] hover:text-[#1d1d1f] transition rounded-full"
            title="Admin Access"
          >
            <Shield className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {viewMode === 'viewer' ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-2">Second Year Curriculum</h2>
              <p className="text-[#86868b] text-sm mb-6">Select your engineering branch to access curriculum materials.</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {branches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition shadow-sm ${
                      selectedBranch === branch.id 
                        ? 'bg-[#1d1d1f] text-white' 
                        : 'bg-white/80 border border-[#d2d2d7] text-[#1d1d1f] hover:bg-white'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedBranch !== 'EIC' ? (
              <div className="bg-white/60 backdrop-blur-xl border border-[#d2d2d7] rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-2">Coming Soon</h3>
                <p className="text-[#86868b] text-sm">
                  Resources for this branch are currently being prepared. Check back shortly or switch to the EIC branch for active material.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Subjects Menu */}
                <div className="lg:col-span-1 space-y-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] px-3 mb-3">EIC Subjects</h3>
                  {subjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject.id);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-300 origin-left hover:scale-105 active:scale-95 hover:z-20 hover:shadow-lg ${
                        selectedSubject === subject.id
                          ? 'bg-[#0071e3] text-white shadow-md shadow-[#0071e3]/25 scale-105 z-10'
                          : 'bg-white/70 hover:bg-white text-[#1d1d1f] border border-[#d2d2d7]/60 hover:border-[#86868b]/60'
                      }`}
                    >
                      <span className="truncate pr-2">{subject.name}</span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${selectedSubject === subject.id ? 'text-white translate-x-0.5' : 'text-[#86868b]'}`} />
                    </button>
                  ))}
                </div>

                {/* Right Column: Content Viewer */}
                <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-[#d2d2d7] rounded-3xl p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#f5f5f7]">
                    <div>
                      <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">{currentSubjectData.name}</h3>
                      <p className="text-xs text-[#86868b] mt-1">Preview items in-browser or download them instantly.</p>
                    </div>

                    <div className="flex bg-[#f5f5f7] p-1 rounded-xl border border-[#d2d2d7]">
                      <button
                        onClick={() => setActiveTab('files')}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                          activeTab === 'files' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                        }`}
                      >
                        Class PPTs & Notes ({(currentSubjectData.files || []).length})
                      </button>
                      <button
                        onClick={() => setActiveTab('tutorials')}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                          activeTab === 'tutorials' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                        }`}
                      >
                        Tutorial Sheets ({(currentSubjectData.tutorials || []).length})
                      </button>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder={`Search notes, PPTs, or tutorial sheets in ${currentSubjectData.name}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition shadow-inner"
                    />
                  </div>

                  <div className="space-y-3">
                    {activeTab === 'files' ? (
                      filteredFiles.length > 0 ? (
                        filteredFiles.map((file, idx) => (
                          <div key={idx} className="bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] p-4 rounded-2xl border border-[#d2d2d7]/50 transition flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <FileText className="w-4 h-4 text-[#0071e3]" />
                                <h4 className="text-sm font-semibold text-[#1d1d1f]">{file.title || file.name}</h4>
                              </div>
                              {(file.description || file.summary) && (
                                <p className="text-xs text-[#86868b] ml-6">{file.description || file.summary}</p>
                              )}
                              <div className="flex items-center space-x-3 ml-6 mt-2 text-[10px] text-[#86868b]">
                                {file.size && <span>{file.size}</span>}
                                {(file.instructor || file.author) && <span>• {file.instructor || file.author}</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => setPreviewItem(file)}
                                className="px-3 py-2 bg-white hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                                <span>Preview</span>
                              </button>
                              <a href={file.url || file.downloadUrl || '#'} download className="p-2 bg-white hover:bg-[#e8e8ed] text-[#0071e3] rounded-xl shadow-sm transition" title="Download">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#86868b] text-center py-10">No matching class files found for your search.</p>
                      )
                    ) : (
                      filteredTutorials.length > 0 ? (
                        filteredTutorials.map((tut, idx) => (
                          <div key={idx} className="bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] p-4 rounded-2xl border border-[#d2d2d7]/50 transition flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <FileText className="w-4 h-4 text-[#34c759]" />
                                <h4 className="text-sm font-semibold text-[#1d1d1f]">{tut.title || tut.name}</h4>
                              </div>
                              {(tut.description || tut.summary) && (
                                <p className="text-xs text-[#86868b] ml-6">{tut.description || tut.summary}</p>
                              )}
                              <div className="flex items-center space-x-3 ml-6 mt-2 text-[10px] text-[#86868b]">
                                {tut.size && <span>{tut.size}</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => setPreviewItem(tut)}
                                className="px-3 py-2 bg-white hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#34c759]" />
                                <span>Preview</span>
                              </button>
                              <a href={tut.url || tut.downloadUrl || '#'} download className="p-2 bg-white hover:bg-[#e8e8ed] text-[#34c759] rounded-xl shadow-sm transition" title="Download Sheet">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#86868b] text-center py-10">No matching tutorial practice sheets found for your search.</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AppleAdminDashboard subjects={subjects} setSubjects={setSubjects} />
        )}
      </main>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-white border border-[#d2d2d7] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="px-6 py-4 border-b border-[#d2d2d7] flex items-center justify-between bg-[#f5f5f7]/80">
              <div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] truncate max-w-md">{previewItem.title || previewItem.name}</h3>
                <p className="text-[11px] text-[#86868b]">In-browser document preview mode</p>
              </div>
              <div className="flex items-center space-x-3">
                <a href={previewItem.url || previewItem.downloadUrl || '#'} download className="px-3.5 py-1.5 bg-[#0071e3] text-white text-xs font-medium rounded-full shadow-sm hover:bg-[#0077ed] transition flex items-center space-x-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button onClick={() => setPreviewItem(null)} className="p-1.5 bg-[#e8e8ed] hover:bg-[#d2d2d7] text-[#1d1d1f] rounded-full transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#e8e8ed]/40 flex items-center justify-center p-4">
              {((previewItem.url && previewItem.url !== '#') || (previewItem.previewUrl && previewItem.previewUrl !== '#')) ? (
                <iframe src={previewItem.url && previewItem.url !== '#' ? previewItem.url : previewItem.previewUrl} title={previewItem.title || previewItem.name} className="w-full h-full rounded-2xl border border-[#d2d2d7] bg-white" />
              ) : (
                <div className="text-center p-8 max-w-sm">
                  <FileText className="w-12 h-12 text-[#86868b] mx-auto mb-3" />
                  <h4 className="font-semibold text-base mb-1">Previewing: {previewItem.title || previewItem.name}</h4>
                  <p className="text-xs text-[#86868b] mb-4">{previewItem.description || previewItem.summary || 'Class academic resource material.'}</p>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-mono text-xs mb-5">
                    {previewItem.size || '3.2 MB'} • {previewItem.type || 'PDF'}
                  </div>
                  <br />
                  <button onClick={() => setPreviewItem(null)} className="px-4 py-2 bg-[#1d1d1f] text-white text-xs font-medium rounded-full">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Modal triggered by typing #admin in URL or clicking shield */}
      {isAdminOpen && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl border border-[#d2d2d7] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={handleCloseAdminModal}
              className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] p-1 bg-[#f5f5f7] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl tracking-tight">Admin Codeword Detected</h3>
              <p className="text-xs text-[#86868b] mt-1">Enter your password to unlock resource publishing.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
                autoFocus
              />
              <button 
                type="submit"
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-[#0071e3]/20"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Dashboard Component
function AppleAdminDashboard({ subjects, setSubjects }) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [resourceType, setResourceType] = useState('files');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileUrl, setFileUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert('Please enter a title');

    const updatedSubjects = subjects.map((subj) => {
      if (subj.id === selectedSubject) {
        const newItem = { 
          title, 
          name: title,
          description, 
          summary: description,
          instructor, 
          author: instructor,
          type: 'PDF', 
          size: fileSize, 
          url: fileUrl || '#',
          downloadUrl: fileUrl || '#'
        };
        return { ...subj, [resourceType]: [...(subj[resourceType] || []), newItem] };
      }
      return subj;
    });

    setSubjects(updatedSubjects);
    alert('Resource added successfully to EIC branch portal!');
    setTitle('');
    setDescription('');
    setInstructor('');
    setFileUrl('');
  };

  return (
    <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-2xl border border-[#d2d2d7] rounded-3xl p-8 shadow-xl">
      <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-[#f5f5f7]">
        <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">EIC Resource Publisher</h2>
          <p className="text-xs text-[#86868b]">Upload materials directly to EIC subjects.</p>
        </div>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Target Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Category</label>
            <select 
              value={resourceType} 
              onChange={(e) => setResourceType(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
            >
              <option value="files">Class PPTs & Notes</option>
              <option value="tutorials">Tutorial Practice Sheet</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">File Size</label>
            <input 
              type="text" 
              value={fileSize} 
              onChange={(e) => setFileSize(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Resource Title</label>
          <input 
            type="text" 
            placeholder="e.g., Tutorial Sheet 2 / Lecture Slides" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Instructor / Author</label>
            <input 
              type="text" 
              placeholder="e.g., Prof. Smith" 
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Direct File URL</label>
            <input 
              type="text" 
              placeholder="https://..." 
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Description / Topics</label>
          <textarea 
            placeholder="Add summary notes or topics covered..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="2"
            className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition resize-none"
          />
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) setTitle(e.dataTransfer.files[0].name); }}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
            isDragging ? 'border-[#0071e3] bg-[#0071e3]/5' : 'border-[#d2d2d7] bg-[#f5f5f7]/40 hover:border-[#86868b]'
          }`}
        >
          <Upload className="w-6 h-6 text-[#0071e3] mx-auto mb-2" />
          <p className="text-xs text-[#1d1d1f] font-medium">Drag & drop asset here or browse</p>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3.5 rounded-2xl text-sm transition shadow-lg shadow-[#0071e3]/20"
        >
          Publish to EIC Curriculum
        </button>
      </form>
    </div>
  );
}

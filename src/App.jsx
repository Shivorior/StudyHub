import React, { useState, useEffect } from 'react';
import { Lock, X, Upload, FileText, Download, Eye, ChevronRight, Clock, Search, Trash2, Edit3, PlusCircle } from 'lucide-react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore';

// Static branch subjects list
const EIC_SUBJECTS = [
  { id: 'analog', name: 'Analog Devices and Circuits' },
  { id: 'signals', name: 'Mathematics for Signals' },
  { id: 'digital', name: 'Digital Electronics' },
  { id: 'mst', name: 'Measurement Science and Techniques' },
  { id: 'buggy', name: 'EDP (Buggy)' },
  { id: 'dsa', name: 'Data Structures & Algorithms' },
  { id: 'maths', name: 'Mathematics & Linear Algebra' },
  { id: 'physics', name: 'Physics for Engineers' },
  { id: 'os', name: 'Operating Systems & Architecture' },
  { id: 'ml', name: 'Machine Learning & Neural Nets' },
  { id: 'web', name: 'Full-Stack Web Development' },
  { id: 'aptitude', name: 'Aptitude Skills' },
  { id: 'ai', name: 'AI for Engineers' }
];

export function parseDriveLink(inputUrl) {
  if (!inputUrl) return { downloadUrl: '#', previewUrl: '#' };
  const match = inputUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || inputUrl.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    return {
      downloadUrl: `https://drive.usercontent.google.com/download?id=${fileId}&export=download`,
      previewUrl: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }
  return { downloadUrl: inputUrl, previewUrl: inputUrl };
}

export default function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [viewMode, setViewMode] = useState('viewer'); 

  // Viewer state
  const [selectedBranch, setSelectedBranch] = useState('EIC');
  const [selectedSubject, setSelectedSubject] = useState(EIC_SUBJECTS[0].id);
  const [activeTab, setActiveTab] = useState('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  const branches = [
    { id: 'EIC', name: 'Electronics Instrumentation & Control (EIC)' },
    { id: 'CSE', name: 'Computer Science & Engineering (CSE)' },
    { id: 'ECE', name: 'Electronics & Communication (ECE)' },
    { id: 'MECH', name: 'Mechanical Engineering (MECH)' },
    { id: 'CIVIL', name: 'Civil Engineering (CIVIL)' }
  ];

  // Fetch all resources live from Firestore
  const fetchResources = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'resources'));
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResources(items);
    } catch (err) {
      console.error("Firestore read error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Hash listener for #admin codeword
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    if (window.location.hash === '#admin') setIsAdminOpen(true);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

  const currentSubjectData = EIC_SUBJECTS.find(s => s.id === selectedSubject) || EIC_SUBJECTS[0];

  // Filter items matching active subject & category
  const activeSubjectResources = resources.filter(r => r.subjectId === selectedSubject);
  const subjectFiles = activeSubjectResources.filter(r => r.category === 'files');
  const subjectTutorials = activeSubjectResources.filter(r => r.category === 'tutorials');

  const filteredDisplayItems = (activeTab === 'files' ? subjectFiles : subjectTutorials).filter(item =>
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans selection:bg-blue-500 selection:text-white">
      <header className="sticky top-0 z-40 bg-[#f5f5f7]/80 backdrop-blur-md border-b border-[#d2d2d7]/60 px-8 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs">S</div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-[#1d1d1f]">StudyHub.</h1>
            <p className="text-[11px] text-[#86868b]">Second Year Academic Portal</p>
          </div>
        </div>
        
        {viewMode === 'admin' && (
          <button 
            onClick={() => {
              setViewMode('viewer');
              window.location.hash = '';
            }}
            className="text-xs font-medium bg-[#1d1d1f] text-white hover:bg-black px-4 py-2 rounded-full transition shadow-sm"
          >
            Exit Admin Panel
          </button>
        )}
      </header>

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
                  Resources for this branch are currently being prepared. Switch to the EIC branch for active material.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Subjects Menu */}
                <div className="lg:col-span-1 space-y-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] px-3 mb-3">EIC Subjects</h3>
                  {EIC_SUBJECTS.map(subject => (
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

                {/* Content Viewer */}
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
                        Class PPTs & Notes ({subjectFiles.length})
                      </button>
                      <button
                        onClick={() => setActiveTab('tutorials')}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
                          activeTab === 'tutorials' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
                        }`}
                      >
                        Tutorial Sheets ({subjectTutorials.length})
                      </button>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder={`Search in ${currentSubjectData.name}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition shadow-inner"
                    />
                  </div>

                  {loading ? (
                    <p className="text-xs text-[#86868b] text-center py-10">Loading synced files...</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredDisplayItems.length > 0 ? (
                        filteredDisplayItems.map((item) => (
                          <div key={item.id} className="bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] p-4 rounded-2xl border border-[#d2d2d7]/50 transition flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <FileText className={`w-4 h-4 ${item.category === 'files' ? 'text-[#0071e3]' : 'text-[#34c759]'}`} />
                                <h4 className="text-sm font-semibold text-[#1d1d1f]">{item.title}</h4>
                              </div>
                              {item.description && <p className="text-xs text-[#86868b] ml-6">{item.description}</p>}
                              <div className="flex items-center space-x-3 ml-6 mt-2 text-[10px] text-[#86868b]">
                                {item.size && <span>{item.size}</span>}
                                {item.instructor && <span>• {item.instructor}</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => setPreviewItem(item)}
                                className="px-3 py-2 bg-white hover:bg-[#e8e8ed] text-[#1d1d1f] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                                <span>Preview</span>
                              </button>
                              <a href={item.downloadUrl || item.url} download className="p-2 bg-white hover:bg-[#e8e8ed] text-[#0071e3] rounded-xl shadow-sm transition" title="Download">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#86868b] text-center py-10">No materials uploaded here yet.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <AppleAdminSuite 
            resources={resources} 
            onDataChange={fetchResources} 
          />
        )}
      </main>

      {/* In-Browser Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8">
          <div className="bg-white border border-[#d2d2d7] rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="px-6 py-4 border-b border-[#d2d2d7] flex items-center justify-between bg-[#f5f5f7]/80">
              <div>
                <h3 className="text-sm font-semibold text-[#1d1d1f] truncate max-w-md">{previewItem.title}</h3>
                <p className="text-[11px] text-[#86868b]">In-browser document preview mode</p>
              </div>
              <div className="flex items-center space-x-3">
                <a href={previewItem.downloadUrl || previewItem.url} download className="px-3.5 py-1.5 bg-[#0071e3] text-white text-xs font-medium rounded-full shadow-sm hover:bg-[#0077ed] transition flex items-center space-x-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button onClick={() => setPreviewItem(null)} className="p-1.5 bg-[#e8e8ed] hover:bg-[#d2d2d7] text-[#1d1d1f] rounded-full transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#e8e8ed]/40 flex items-center justify-center p-4">
              <iframe 
                src={previewItem.previewUrl || previewItem.url} 
                title={previewItem.title} 
                className="w-full h-full rounded-2xl border border-[#d2d2d7] bg-white" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {isAdminOpen && !isAuthenticated && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl border border-[#d2d2d7] rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] p-1 bg-[#f5f5f7] rounded-full">
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl tracking-tight">Admin Authorization</h3>
              <p className="text-xs text-[#86868b] mt-1">Enter your password to unlock the admin suite.</p>
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
              <button type="submit" className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-[#0071e3]/20">
                Continue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Management Suite connected directly to Firestore
function AppleAdminSuite({ resources, onDataChange }) {
  const [adminTab, setAdminTab] = useState('upload');
  const [manageSearch, setManageSearch] = useState('');

  // Form states
  const [selectedSubject, setSelectedSubject] = useState(EIC_SUBJECTS[0].id);
  const [resourceType, setResourceType] = useState('files');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit target
  const [editingTarget, setEditingTarget] = useState(null);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!title || !fileUrl) return alert('Please provide both a title and a file URL');

    try {
      setIsSubmitting(true);
      const { downloadUrl, previewUrl } = parseDriveLink(fileUrl);
      const subjectObj = EIC_SUBJECTS.find(s => s.id === selectedSubject);

      await addDoc(collection(db, 'resources'), {
        title,
        description,
        instructor,
        size: fileSize || 'PDF Document',
        url: fileUrl,
        downloadUrl,
        previewUrl,
        subjectId: selectedSubject,
        subjectName: subjectObj ? subjectObj.name : selectedSubject,
        category: resourceType,
        createdAt: Date.now()
      });

      alert('Resource permanently saved to Firestore database!');
      setTitle('');
      setDescription('');
      setInstructor('');
      setFileSize('');
      setFileUrl('');
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Failed to save to database. Check Firestore permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (resource) => {
    if (confirm(`Permanently delete "${resource.title}" from the database?`)) {
      try {
        await deleteDoc(doc(db, 'resources', resource.id));
        alert('File record deleted!');
        onDataChange();
      } catch (err) {
        console.error(err);
        alert('Failed to delete.');
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const { downloadUrl, previewUrl } = parseDriveLink(editingTarget.url);
      const docRef = doc(db, 'resources', editingTarget.id);

      await updateDoc(docRef, {
        title: editingTarget.title,
        description: editingTarget.description,
        instructor: editingTarget.instructor,
        size: editingTarget.size,
        url: editingTarget.url,
        downloadUrl,
        previewUrl
      });

      setEditingTarget(null);
      alert('Record updated!');
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Failed to update.');
    }
  };

  const filteredResources = resources.filter(res => 
    (res.title || '').toLowerCase().includes(manageSearch.toLowerCase()) ||
    (res.subjectName || '').toLowerCase().includes(manageSearch.toLowerCase()) ||
    (res.description && res.description.toLowerCase().includes(manageSearch.toLowerCase()))
  );

  return (
    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-2xl border border-[#d2d2d7] rounded-3xl p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#f5f5f7]">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">Live Database Management</h2>
          <p className="text-xs text-[#86868b]">All changes persist immediately for every student across the web.</p>
        </div>

        <div className="flex bg-[#f5f5f7] p-1 rounded-xl border border-[#d2d2d7]">
          <button
            onClick={() => setAdminTab('upload')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'upload' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setAdminTab('edit')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'edit' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#34c759]" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setAdminTab('delete')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'delete' ? 'bg-white text-[#1d1d1f] shadow-sm' : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {adminTab === 'upload' && (
        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Target Subject</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
            >
              {EIC_SUBJECTS.map(s => (
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
                placeholder="e.g., 4.2 MB"
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
              placeholder="e.g., Tutorial Sheet 1 / Op-Amps Derivation" 
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
                placeholder="e.g., Prof. Sharma" 
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Google Drive Share Link</label>
              <input 
                type="text" 
                placeholder="https://drive.google.com/..." 
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Description / Topics Covered</label>
            <textarea 
              placeholder="Add summary notes or problem numbers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3.5 rounded-2xl text-sm transition shadow-lg shadow-[#0071e3]/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving to Database...' : 'Publish to Live Database'}
          </button>
        </form>
      )}

      {(adminTab === 'edit' || adminTab === 'delete') && (
        <div>
          <div className="relative mb-6">
            <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder={`Search database records to ${adminTab}...`}
              value={manageSearch}
              onChange={(e) => setManageSearch(e.target.value)}
              className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] transition shadow-inner"
            />
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredResources.length > 0 ? (
              filteredResources.map((res) => (
                <div key={res.id} className="bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] p-4 rounded-2xl border border-[#d2d2d7]/50 transition flex items-center justify-between">
                  <div className="pr-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${res.category === 'files' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-[#34c759]/10 text-[#34c759]'}`}>
                        {res.category === 'files' ? 'PPT/Notes' : 'Tutorial'}
                      </span>
                      <h4 className="text-sm font-semibold text-[#1d1d1f] truncate max-w-sm">{res.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#86868b]">{res.subjectName} • {res.size || 'PDF'}</p>
                  </div>

                  <div className="shrink-0">
                    {adminTab === 'edit' ? (
                      <button
                        onClick={() => setEditingTarget({ ...res })}
                        className="px-3 py-2 bg-white hover:bg-[#e8e8ed] text-[#0071e3] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(res)}
                        className="px-3 py-2 bg-white hover:bg-[#ff3b30]/10 text-[#ff3b30] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#86868b] text-center py-10">No matching database records found.</p>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#d2d2d7] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setEditingTarget(null)} 
              className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] p-1 bg-[#f5f5f7] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-lg tracking-tight mb-1">Edit File Details</h3>
            <p className="text-xs text-[#86868b] mb-6">Subject: {editingTarget.subjectName}</p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Title</label>
                <input 
                  type="text" 
                  value={editingTarget.title}
                  onChange={(e) => setEditingTarget({ ...editingTarget, title: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Instructor</label>
                  <input 
                    type="text" 
                    value={editingTarget.instructor || ''}
                    onChange={(e) => setEditingTarget({ ...editingTarget, instructor: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Size</label>
                  <input 
                    type="text" 
                    value={editingTarget.size || ''}
                    onChange={(e) => setEditingTarget({ ...editingTarget, size: e.target.value })}
                    className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Google Drive Link</label>
                <input 
                  type="text" 
                  value={editingTarget.url || ''}
                  onChange={(e) => setEditingTarget({ ...editingTarget, url: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={editingTarget.description || ''}
                  onChange={(e) => setEditingTarget({ ...editingTarget, description: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0071e3] resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingTarget(null)}
                  className="w-1/2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium py-3 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3 rounded-xl text-xs transition shadow-md shadow-[#0071e3]/20"
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

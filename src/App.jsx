import React, { useState, useEffect } from 'react';
import { 
  Lock, X, Upload, FileText, Download, Eye, ChevronRight, Clock, 
  Search, Trash2, Edit3, PlusCircle, BookOpen, GitBranch, Moon, Sun, 
  Bookmark, Star, ArrowDownToLine, Sparkles 
} from 'lucide-react';
import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const SEED_BRANCHES = [
  { branchCode: 'EIC', name: 'Electronics Instrumentation & Control (EIC)' },
  { branchCode: 'CSE', name: 'Computer Science & Engineering (CSE)' },
  { branchCode: 'ECE', name: 'Electronics & Communication (ECE)' },
  { branchCode: 'MECH', name: 'Mechanical Engineering (MECH)' },
  { branchCode: 'CIVIL', name: 'Civil Engineering (CIVIL)' }
];

const INITIAL_EIC_SUBJECTS = [
  "Analog Devices and Circuits",
  "Mathematics for Signals",
  "Digital Electronics",
  "Measurement Science and Techniques",
  "EDP (Buggy)",
  "Data Structures & Algorithms",
  "Mathematics & Linear Algebra",
  "Physics for Engineers",
  "Operating Systems & Architecture",
  "Machine Learning & Neural Nets",
  "Full-Stack Web Development",
  "Aptitude Skills",
  "Environmental Science (EVS)",
  "Control Systems Engineering",
  "Microprocessors & Microcontrollers",
  "Transducers & Sensors"
];

// Helper: Timeout wrapper to prevent eternal hanging on network drops
const withTimeout = (promise, ms = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database request timed out. Please check your internet or Firebase rules.')), ms)
    )
  ]);
};

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
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState('viewer'); 

  // Feature 1: Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    return (localStorage.getItem('padhleladle_theme') || localStorage.getItem('flowstate_theme') || localStorage.getItem('studyhub_theme')) === 'dark';
  });

  // Feature 2: Bookmarks / Favorites Drawer
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('padhleladle_bookmarks') || localStorage.getItem('flowstate_bookmarks') || localStorage.getItem('studyhub_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(false);

  // Viewer state
  const [selectedBranch, setSelectedBranch] = useState('EIC');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [activeTab, setActiveTab] = useState('files');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('padhleladle_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleBookmark = (item) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.id === item.id);
      const updated = exists ? prev.filter(b => b.id !== item.id) : [...prev, item];
      localStorage.setItem('padhleladle_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Feature 3: Download All Current Tab Items
  const handleDownloadAll = (itemsToDownload) => {
    if (!itemsToDownload || itemsToDownload.length === 0) return;
    if (confirm(`Download all ${itemsToDownload.length} files in this view?`)) {
      itemsToDownload.forEach((item, index) => {
        setTimeout(() => {
          const downloadLink = document.createElement('a');
          downloadLink.href = item.downloadUrl || item.url;
          downloadLink.setAttribute('download', item.title || 'document');
          downloadLink.setAttribute('target', '_blank');
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }, index * 400); // Stagger requests to avoid browser popup blockers
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resSnap, subjSnap, branchSnap] = await Promise.all([
        withTimeout(getDocs(collection(db, 'resources'))),
        withTimeout(getDocs(collection(db, 'subjects'))),
        withTimeout(getDocs(collection(db, 'branches')))
      ]);

      const loadedResources = resSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const loadedSubjects = subjSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      let loadedBranches = branchSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (loadedBranches.length === 0) {
        loadedBranches = SEED_BRANCHES.map((b, idx) => ({ id: `default-${idx}`, ...b }));
      }

      setResources(loadedResources);
      setSubjects(loadedSubjects);
      setBranches(loadedBranches);

      if (!selectedBranch && loadedBranches.length > 0) {
        setSelectedBranch(loadedBranches[0].branchCode);
      }
    } catch (err) {
      console.error("Firestore sync error: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const branchSubjs = subjects.filter(s => s.branchId === selectedBranch);
    if (branchSubjs.length > 0) {
      setSelectedSubject(branchSubjs[0].id);
    } else {
      setSelectedSubject('');
    }
    setSearchQuery('');
  }, [selectedBranch, subjects]);

  // Automatically keep user logged in across refreshes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
      if (user) {
        setViewMode('admin');
      }
    });
    return () => unsubscribe();
  }, []);

  // Hash listener for #parth! codeword
  useEffect(() => {
    const handleHashChange = () => {
      const hash = decodeURIComponent(window.location.hash);
      if (hash === '#parth!' || window.location.hash === '#parth!') {
        if (currentUser) {
          setViewMode('admin');
        } else {
          setIsAdminOpen(true);
        }
      }
    };

    const initialHash = decodeURIComponent(window.location.hash);
    if (initialHash === '#parth!' || window.location.hash === '#parth!') {
      if (currentUser) {
        setViewMode('admin');
      } else {
        setIsAdminOpen(true);
      }
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      setIsAuthenticated(true);
      setIsAdminOpen(false);
      setEmailInput('');
      setPasswordInput('');
    } catch (error) {
      alert('Invalid admin credentials: ' + (error.message || 'Please check your email and password.'));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Destroys the Firebase session
      setIsAuthenticated(false);
      setViewMode('viewer');
      window.history.replaceState(null, '', window.location.pathname);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const currentBranchSubjects = subjects.filter(s => s.branchId === selectedBranch);
  const currentSubjectData = currentBranchSubjects.find(s => s.id === selectedSubject);

  // Backwards-compatible resource matching
  const activeSubjectResources = resources.filter(r => 
    r.subjectId === selectedSubject || 
    (currentSubjectData && (r.subjectName === currentSubjectData.name || r.subjectId === currentSubjectData.name.toLowerCase()))
  );
  const subjectFiles = activeSubjectResources.filter(r => r.category === 'files');
  const subjectTutorials = activeSubjectResources.filter(r => r.category === 'tutorials');

  const filteredDisplayItems = (activeTab === 'files' ? subjectFiles : subjectTutorials).filter(item =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#121214] text-[#f5f5f7] selection:bg-[#0071e3]' : 'bg-[#f5f5f7] text-[#1d1d1f] selection:bg-blue-500 selection:text-white'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center transition-colors ${
        darkMode ? 'bg-[#121214]/80 border-white/10' : 'bg-[#f5f5f7]/80 border-[#d2d2d7]/60'
      }`}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center space-x-3 text-left group focus:outline-none transition-transform active:scale-95"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
            darkMode ? 'bg-white text-black group-hover:bg-[#0071e3] group-hover:text-white' : 'bg-black text-white group-hover:bg-[#0071e3]'
          }`}>
            PL
          </div>
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight transition-colors group-hover:text-[#0071e3]">
              Padhle Ladle
            </h1>
            <p className="text-[11px] text-[#86868b]">Second Year Engineering</p>
          </div>
        </button>

        <div className="flex items-center space-x-2.5">
          {/* Favorites Drawer Toggle */}
          <button
            onClick={() => setIsBookmarkDrawerOpen(true)}
            className={`p-2 rounded-xl transition relative flex items-center justify-center ${
              darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-black'
            }`}
            title="Saved Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#0071e3] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl transition flex items-center justify-center ${
              darkMode ? 'bg-white/5 hover:bg-white/10 text-amber-400' : 'bg-black/5 hover:bg-black/10 text-neutral-600'
            }`}
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {viewMode === 'admin' && (
            <button 
              onClick={handleLogout}
              className="text-xs font-medium bg-[#0071e3] text-white hover:bg-[#0077ed] px-4 py-2 rounded-full transition shadow-sm ml-2"
            >
              Log Out & Exit Admin
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {viewMode === 'viewer' ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-semibold tracking-tight mb-2">Second Year Curriculum</h2>
              <p className={`text-sm mb-6 ${darkMode ? 'text-neutral-400' : 'text-[#86868b]'}`}>
                Select your engineering branch to access curriculum materials.
              </p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {branches.map(branch => (
                  <button
                    key={branch.id || branch.branchCode}
                    onClick={() => setSelectedBranch(branch.branchCode)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition shadow-sm ${
                      selectedBranch === branch.branchCode 
                        ? (darkMode ? 'bg-white text-black' : 'bg-[#1d1d1f] text-white')
                        : (darkMode ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10' : 'bg-white/80 border border-[#d2d2d7] text-[#1d1d1f] hover:bg-white')
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>

            {currentBranchSubjects.length === 0 ? (
              <div className={`border rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm ${
                darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-[#d2d2d7]'
              }`}>
                <div className="w-14 h-14 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-2">Coming Soon</h3>
                <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-[#86868b]'}`}>
                  No subjects have been configured for {selectedBranch} yet. Add them in the Admin Panel.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Subjects Navigation */}
                <div className="lg:col-span-1 space-y-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#86868b] px-3 mb-3">{selectedBranch} Subjects</h3>
                  {currentBranchSubjects.map(subject => (
                    <button
                      key={subject.id}
                      onClick={() => {
                        setSelectedSubject(subject.id);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-medium transition-all duration-300 origin-left hover:scale-105 active:scale-95 hover:z-20 hover:shadow-lg flex items-center justify-between border ${
                        selectedSubject === subject.id
                          ? 'bg-[#0071e3] text-white border-[#0071e3] shadow-md shadow-[#0071e3]/25 scale-105 z-10'
                          : darkMode 
                            ? 'bg-white/5 border-white/5 hover:bg-white/10 text-white' 
                            : 'bg-white/70 hover:bg-white text-[#1d1d1f] border-[#d2d2d7]/60 hover:border-[#86868b]/60'
                      }`}
                    >
                      <span className="truncate pr-2">{subject.name}</span>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${selectedSubject === subject.id ? 'text-white translate-x-0.5' : 'text-[#86868b]'}`} />
                    </button>
                  ))}
                </div>

                {/* Content Viewer */}
                <div className={`lg:col-span-3 backdrop-blur-xl border rounded-3xl p-8 shadow-sm ${
                  darkMode ? 'bg-[#1a1a1e]/80 border-white/10' : 'bg-white/80 border-[#d2d2d7]'
                }`}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b ${
                    darkMode ? 'border-white/10' : 'border-[#f5f5f7]'
                  }`}>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight">{currentSubjectData ? currentSubjectData.name : 'Select a Subject'}</h3>
                      <p className="text-xs text-[#86868b] mt-1">Preview items in-browser or download them instantly.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Download All Action */}
                      {filteredDisplayItems.length > 0 && (
                        <button
                          onClick={() => handleDownloadAll(filteredDisplayItems)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition ${
                            darkMode 
                              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' 
                              : 'bg-white border-[#d2d2d7] hover:bg-[#f5f5f7] text-[#1d1d1f]'
                          }`}
                          title="Download all items shown in this tab"
                        >
                          <ArrowDownToLine className="w-3.5 h-3.5 text-[#0071e3]" />
                          <span className="hidden md:inline">Download Tab</span>
                        </button>
                      )}

                      <div className={`flex p-1 rounded-xl border ${
                        darkMode ? 'bg-black/30 border-white/10' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                      }`}>
                        <button
                          onClick={() => setActiveTab('files')}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'files' 
                              ? (darkMode ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                              : 'text-[#86868b] hover:text-current'
                          }`}
                        >
                          Notes ({subjectFiles.length})
                        </button>
                        <button
                          onClick={() => setActiveTab('tutorials')}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'tutorials' 
                              ? (darkMode ? 'bg-white/15 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                              : 'text-[#86868b] hover:text-current'
                          }`}
                        >
                          Sheets ({subjectTutorials.length})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder={`Search in ${currentSubjectData ? currentSubjectData.name : ''}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none focus:border-[#0071e3] transition shadow-inner ${
                        darkMode 
                          ? 'bg-black/20 border-white/10 text-white placeholder-neutral-500' 
                          : 'bg-[#f5f5f7] border-[#d2d2d7] text-[#1d1d1f]'
                      }`}
                    />
                  </div>

                  {loading ? (
                    <p className="text-xs text-[#86868b] text-center py-10">Loading synced files...</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredDisplayItems.length > 0 ? (
                        filteredDisplayItems.map((item) => {
                          const isBookmarked = bookmarks.some(b => b.id === item.id);
                          return (
                            <div 
                              key={item.id} 
                              className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                                darkMode 
                                  ? 'bg-white/[0.03] hover:bg-white/[0.06] border-white/5' 
                                  : 'bg-[#f5f5f7]/60 hover:bg-[#f5f5f7] border-[#d2d2d7]/50'
                              }`}
                            >
                              <div className="pr-3">
                                <div className="flex items-center space-x-2 mb-1">
                                  <FileText className={`w-4 h-4 ${item.category === 'files' ? 'text-[#0071e3]' : 'text-[#34c759]'}`} />
                                  <h4 className="text-sm font-semibold">{item.title}</h4>
                                </div>
                                {item.description && <p className="text-xs text-[#86868b] ml-6">{item.description}</p>}
                                <div className="flex items-center space-x-3 ml-6 mt-2 text-[10px] text-[#86868b]">
                                  {item.size && <span>{item.size}</span>}
                                  {item.instructor && <span>• {item.instructor}</span>}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0">
                                {/* Star Bookmark Button */}
                                <button
                                  onClick={() => toggleBookmark(item)}
                                  className={`p-2 rounded-xl transition ${
                                    isBookmarked 
                                      ? 'text-amber-400 bg-amber-400/10' 
                                      : (darkMode ? 'text-neutral-500 hover:text-white hover:bg-white/5' : 'text-neutral-400 hover:text-black hover:bg-black/5')
                                  }`}
                                  title={isBookmarked ? "Remove Bookmark" : "Bookmark Resource"}
                                >
                                  <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                                </button>

                                <button
                                  onClick={() => setPreviewItem(item)}
                                  className={`px-3 py-2 text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5 ${
                                    darkMode 
                                      ? 'bg-white/10 hover:bg-white/15 text-white' 
                                      : 'bg-white hover:bg-[#e8e8ed] text-[#1d1d1f]'
                                  }`}
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                                  <span>Preview</span>
                                </button>
                                
                                <a 
                                  href={item.downloadUrl || item.url} 
                                  download 
                                  className={`p-2 text-[#0071e3] rounded-xl shadow-sm transition ${
                                    darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white hover:bg-[#e8e8ed]'
                                  }`} 
                                  title="Download"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          );
                        })
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
            subjects={subjects}
            branches={branches}
            darkMode={darkMode}
            onDataChange={fetchData} 
          />
        )}
      </main>

      {/* Bookmarks Drawer */}
      {isBookmarkDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className={`w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between transition-transform duration-300 ${
            darkMode ? 'bg-[#1c1c1f] text-white border-l border-white/10' : 'bg-white text-[#1d1d1f] border-l border-[#d2d2d7]'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center space-x-2">
                  <Bookmark className="w-4 h-4 text-[#0071e3]" />
                  <h3 className="font-semibold text-base">Quick Bookmarks ({bookmarks.length})</h3>
                </div>
                <button 
                  onClick={() => setIsBookmarkDrawerOpen(false)}
                  className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {bookmarks.length === 0 ? (
                <div className="text-center py-16 text-[#86868b]">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No bookmarks saved yet.</p>
                  <p className="text-[10px] mt-1">Star items in subjects to access them quickly here.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1">
                  {bookmarks.map((b) => (
                    <div 
                      key={b.id} 
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        darkMode ? 'bg-white/5 border-white/5' : 'bg-[#f5f5f7] border-[#d2d2d7]/60'
                      }`}
                    >
                      <div className="pr-2 truncate">
                        <p className="text-xs font-semibold truncate">{b.title}</p>
                        <p className="text-[10px] text-[#86868b] mt-0.5">{b.subjectName || 'Study Material'}</p>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setPreviewItem(b);
                            setIsBookmarkDrawerOpen(false);
                          }}
                          className={`p-1.5 rounded-lg text-xs ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-black/5'}`}
                          title="Preview"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0071e3]" />
                        </button>
                        <a
                          href={b.downloadUrl || b.url}
                          download
                          className={`p-1.5 rounded-lg text-xs text-[#0071e3] ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-black/5'}`}
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => toggleBookmark(b)}
                          className="p-1.5 text-neutral-400 hover:text-[#ff3b30] transition"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {bookmarks.length > 0 && (
              <button
                onClick={() => handleDownloadAll(bookmarks)}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All Saved Bookmarks</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* In-Browser Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-8">
          <div className={`border rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative ${
            darkMode ? 'bg-[#1c1c1f] border-white/10' : 'bg-white border-[#d2d2d7]'
          }`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              darkMode ? 'bg-black/20 border-white/10' : 'bg-[#f5f5f7]/80 border-[#d2d2d7]'
            }`}>
              <div>
                <h3 className="text-sm font-semibold truncate max-w-md">{previewItem.title}</h3>
                <p className="text-[11px] text-[#86868b]">In-browser document preview mode</p>
              </div>
              <div className="flex items-center space-x-3">
                <a href={previewItem.downloadUrl || previewItem.url} download className="px-3.5 py-1.5 bg-[#0071e3] text-white text-xs font-medium rounded-full shadow-sm hover:bg-[#0077ed] transition flex items-center space-x-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button 
                  onClick={() => setPreviewItem(null)} 
                  className={`p-1.5 rounded-full transition ${darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-[#e8e8ed] hover:bg-[#d2d2d7] text-[#1d1d1f]'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-black/5 flex items-center justify-center p-4">
              <iframe 
                src={previewItem.previewUrl || previewItem.url} 
                title={previewItem.title} 
                className="w-full h-full rounded-2xl border border-[#d2d2d7] bg-white" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Auth Modal */}
      {isAdminOpen && !currentUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`border rounded-3xl p-8 max-w-sm w-full shadow-2xl relative ${
            darkMode ? 'bg-[#1c1c1f] border-white/10' : 'bg-white/90 border-[#d2d2d7]'
          }`}>
            <button 
              onClick={() => setIsAdminOpen(false)} 
              className={`absolute top-5 right-5 p-1 rounded-full ${darkMode ? 'text-neutral-400 hover:text-white bg-white/10' : 'text-[#86868b] hover:text-[#1d1d1f] bg-[#f5f5f7]'}`}
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#0071e3]/10 text-[#0071e3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-xl tracking-tight">Admin Authorization</h3>
              <p className="text-xs text-[#86868b] mt-1">Sign in with Firebase Admin credentials.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email"
                placeholder="Admin Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition ${
                  darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
                autoFocus
                required
              />
              <input 
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0071e3] transition ${
                  darkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
                required
              />
              <button type="submit" className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3 rounded-xl text-sm transition shadow-lg shadow-[#0071e3]/20">
                Sign In to Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin Management Suite
function AppleAdminSuite({ resources, subjects, branches, darkMode, onDataChange }) {
  const [adminTab, setAdminTab] = useState('upload');
  const [manageSearch, setManageSearch] = useState('');

  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchFullName, setNewBranchFullName] = useState('');
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  const [targetBranchForSubject, setTargetBranchForSubject] = useState(branches[0]?.branchCode || 'EIC');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.branchCode || 'EIC');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [resourceType, setResourceType] = useState('files');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingTarget, setEditingTarget] = useState(null);

  const branchSubjects = subjects.filter(s => s.branchId === selectedBranch);

  useEffect(() => {
    if (branchSubjects.length > 0 && !branchSubjects.some(s => s.id === selectedSubject)) {
      setSelectedSubject(branchSubjects[0].id);
    } else if (branchSubjects.length === 0) {
      setSelectedSubject('');
    }
  }, [selectedBranch, subjects]);

  const handleAddBranch = async (e) => {
    e.preventDefault();
    const code = newBranchCode.trim().toUpperCase();
    const name = newBranchFullName.trim();
    if (!code || !name) return alert('Please enter both branch code and name.');

    if (branches.some(b => b.branchCode === code)) {
      return alert(`Branch code "${code}" already exists.`);
    }

    try {
      setIsAddingBranch(true);
      await withTimeout(addDoc(collection(db, 'branches'), {
        branchCode: code,
        name: `${name} (${code})`,
        createdAt: Date.now()
      }));
      setNewBranchCode('');
      setNewBranchFullName('');
      alert(`Branch ${code} added!`);
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Failed to add branch: ' + err.message);
    } finally {
      setIsAddingBranch(false);
    }
  };

  const handleDeleteBranch = async (branch) => {
    if (confirm(`Delete branch "${branch.name}"?`)) {
      try {
        if (branch.id && !branch.id.startsWith('default-')) {
          await withTimeout(deleteDoc(doc(db, 'branches', branch.id)));
        } else {
          const remaining = branches.filter(b => b.branchCode !== branch.branchCode);
          for (const b of remaining) {
            await addDoc(collection(db, 'branches'), {
              branchCode: b.branchCode,
              name: b.name,
              createdAt: Date.now()
            });
          }
        }
        alert('Branch deleted!');
        onDataChange();
      } catch (err) {
        console.error(err);
        alert('Failed to delete branch: ' + err.message);
      }
    }
  };

  const handleSeedEIC = async () => {
    if (!confirm('Add the 16 standard EIC curriculum subjects to the database?')) return;
    try {
      setIsSeeding(true);
      for (const subjName of INITIAL_EIC_SUBJECTS) {
        const exists = subjects.some(s => s.branchId === 'EIC' && s.name.toLowerCase() === subjName.toLowerCase());
        if (!exists) {
          await addDoc(collection(db, 'subjects'), {
            name: subjName,
            branchId: 'EIC',
            createdAt: Date.now()
          });
        }
      }
      alert('Standard EIC curriculum subjects added successfully!');
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Error seeding subjects: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return alert('Please enter a subject name');

    try {
      setIsAddingSubject(true);
      await withTimeout(addDoc(collection(db, 'subjects'), {
        name: newSubjectName.trim(),
        branchId: targetBranchForSubject,
        createdAt: Date.now()
      }));
      setNewSubjectName('');
      alert(`Subject added to ${targetBranchForSubject}!`);
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Failed to add subject: ' + err.message);
    } finally {
      setIsAddingSubject(false);
    }
  };

  const handleDeleteSubject = async (subject) => {
    const hasFiles = resources.some(r => r.subjectId === subject.id || r.subjectName === subject.name);
    const confirmMsg = hasFiles 
      ? `Warning: "${subject.name}" contains uploaded resources. Deleting it will leave those resources inaccessible. Delete anyway?`
      : `Delete subject "${subject.name}"?`;

    if (confirm(confirmMsg)) {
      try {
        await withTimeout(deleteDoc(doc(db, 'subjects', subject.id)));
        alert('Subject deleted!');
        onDataChange();
      } catch (err) {
        console.error(err);
        alert('Failed to delete subject: ' + err.message);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubject) return alert('Please select a subject or create one first.');
    if (!title || !fileUrl) return alert('Please provide both a title and a file URL');

    try {
      setIsSubmitting(true);
      const { downloadUrl, previewUrl } = parseDriveLink(fileUrl);
      const subjectObj = subjects.find(s => s.id === selectedSubject);

      await withTimeout(addDoc(collection(db, 'resources'), {
        title,
        description,
        instructor,
        size: fileSize || 'PDF Document',
        url: fileUrl,
        downloadUrl,
        previewUrl,
        branchId: selectedBranch,
        subjectId: selectedSubject,
        subjectName: subjectObj ? subjectObj.name : 'Unknown Subject',
        category: resourceType,
        createdAt: Date.now()
      }));

      alert('Resource permanently saved to database!');
      setTitle('');
      setDescription('');
      setInstructor('');
      setFileSize('');
      setFileUrl('');
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Failed to save resource: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (resource) => {
    if (confirm(`Permanently delete "${resource.title}"?`)) {
      try {
        await withTimeout(deleteDoc(doc(db, 'resources', resource.id)));
        alert('File record deleted!');
        onDataChange();
      } catch (err) {
        console.error(err);
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const { downloadUrl, previewUrl } = parseDriveLink(editingTarget.url);
      const docRef = doc(db, 'resources', editingTarget.id);

      await withTimeout(updateDoc(docRef, {
        title: editingTarget.title,
        description: editingTarget.description,
        instructor: editingTarget.instructor,
        size: editingTarget.size,
        url: editingTarget.url,
        downloadUrl,
        previewUrl
      }));

      setEditingTarget(null);
      alert('Record updated!');
      onDataChange();
    } catch (err) {
      console.error(err);
      alert('Failed to update: ' + err.message);
    }
  };

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(manageSearch.toLowerCase()) ||
    res.subjectName?.toLowerCase().includes(manageSearch.toLowerCase()) ||
    (res.description && res.description.toLowerCase().includes(manageSearch.toLowerCase()))
  );

  return (
    <div className={`max-w-3xl mx-auto border rounded-3xl p-8 shadow-xl ${
      darkMode ? 'bg-[#1c1c1f] border-white/10 text-white' : 'bg-white/90 border-[#d2d2d7]'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b ${
        darkMode ? 'border-white/10' : 'border-[#f5f5f7]'
      }`}>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Live Database Management</h2>
          <p className="text-xs text-[#86868b]">Control branches, subjects, and study materials in real-time.</p>
        </div>

        <div className={`flex p-1 rounded-xl border flex-wrap gap-1 ${
          darkMode ? 'bg-black/30 border-white/10' : 'bg-[#f5f5f7] border-[#d2d2d7]'
        }`}>
          <button
            onClick={() => setAdminTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'upload' 
                ? (darkMode ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                : 'text-[#86868b] hover:text-current'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#0071e3]" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => setAdminTab('branches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'branches' 
                ? (darkMode ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                : 'text-[#86868b] hover:text-current'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-[#5856d6]" />
            <span>Branches</span>
          </button>
          <button
            onClick={() => setAdminTab('subjects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'subjects' 
                ? (darkMode ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                : 'text-[#86868b] hover:text-current'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#ff9500]" />
            <span>Subjects</span>
          </button>
          <button
            onClick={() => setAdminTab('edit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'edit' 
                ? (darkMode ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                : 'text-[#86868b] hover:text-current'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-[#34c759]" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setAdminTab('delete')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
              adminTab === 'delete' 
                ? (darkMode ? 'bg-white/20 text-white shadow-sm' : 'bg-white text-[#1d1d1f] shadow-sm')
                : 'text-[#86868b] hover:text-current'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-[#ff3b30]" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {adminTab === 'branches' && (
        <div className="space-y-6">
          <form onSubmit={handleAddBranch} className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-[#f5f5f7]/80 border-[#d2d2d7]/80'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider">Add New Engineering Branch</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#86868b] block mb-1">Code</label>
                <input 
                  type="text" 
                  placeholder="e.g., CHEM"
                  value={newBranchCode}
                  onChange={(e) => setNewBranchCode(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none uppercase ${
                    darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-[#d2d2d7]'
                  }`}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#86868b] block mb-1">Full Branch Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Chemical Engineering"
                  value={newBranchFullName}
                  onChange={(e) => setNewBranchFullName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none ${
                    darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-[#d2d2d7]'
                  }`}
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isAddingBranch}
              className="w-full bg-[#5856d6] hover:bg-[#4b48be] text-white font-medium py-2.5 rounded-xl text-xs transition shadow-md shadow-[#5856d6]/20 disabled:opacity-50"
            >
              {isAddingBranch ? 'Adding Branch...' : 'Create Branch'}
            </button>
          </form>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {branches.map(b => (
              <div key={b.id || b.branchCode} className={`p-3 rounded-xl border flex items-center justify-between transition ${
                darkMode ? 'bg-white/5 border-white/5' : 'bg-[#f5f5f7]/60 border-[#d2d2d7]/50'
              }`}>
                <div className="flex items-center space-x-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#5856d6] text-white">{b.branchCode}</span>
                  <span className="text-xs font-medium">{b.name}</span>
                </div>
                <button 
                  onClick={() => handleDeleteBranch(b)}
                  className="p-1.5 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {adminTab === 'subjects' && (
        <div className="space-y-6">
          <form onSubmit={handleAddSubject} className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-white/[0.03] border-white/10' : 'bg-[#f5f5f7]/80 border-[#d2d2d7]/80'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider">Add New Subject</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#86868b] block mb-1">Select Branch</label>
                <select 
                  value={targetBranchForSubject} 
                  onChange={(e) => setTargetBranchForSubject(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none ${
                    darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-[#d2d2d7]'
                  }`}
                >
                  {branches.map(b => (
                    <option key={b.id || b.branchCode} value={b.branchCode}>{b.branchCode}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-[#86868b] block mb-1">Subject Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Thermodynamics / Signal Processing"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none ${
                    darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-white border-[#d2d2d7]'
                  }`}
                  required
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isAddingSubject}
              className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-2.5 rounded-xl text-xs transition shadow-md shadow-[#0071e3]/20 disabled:opacity-50"
            >
              {isAddingSubject ? 'Adding Subject...' : 'Add Subject to Branch'}
            </button>
          </form>

          {/* Quick populate button if EIC has few/no subjects */}
          {subjects.filter(s => s.branchId === 'EIC').length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#0071e3] flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick Setup: EIC Curriculum</span>
                </h4>
                <p className="text-[11px] text-[#86868b] mt-0.5">Pre-populate all 16 standard EIC subjects with one click.</p>
              </div>
              <button 
                onClick={handleSeedEIC} 
                disabled={isSeeding}
                className="px-3 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium rounded-xl transition shadow-sm disabled:opacity-50 shrink-0"
              >
                {isSeeding ? 'Populating...' : 'Populate EIC Subjects'}
              </button>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#86868b]">Configured Subjects ({subjects.length})</h3>
              {subjects.filter(s => s.branchId === 'EIC').length > 0 && (
                <button 
                  onClick={handleSeedEIC}
                  disabled={isSeeding}
                  className="text-[11px] text-[#0071e3] hover:underline font-medium"
                >
                  + Add missing standard EIC subjects
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {subjects.length > 0 ? (
                subjects.map(s => (
                  <div key={s.id} className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    darkMode ? 'bg-white/5 border-white/5' : 'bg-[#f5f5f7]/60 border-[#d2d2d7]/50'
                  }`}>
                    <div className="flex items-center space-x-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${darkMode ? 'bg-white text-black' : 'bg-[#1d1d1f] text-white'}`}>{s.branchId}</span>
                      <span className="text-xs font-medium">{s.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteSubject(s)}
                      className="p-1.5 text-[#ff3b30] hover:bg-[#ff3b30]/10 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#86868b] text-center py-6">No subjects created yet. Add one above.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {adminTab === 'upload' && (
        <form onSubmit={handleUploadSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Target Branch</label>
              <select 
                value={selectedBranch} 
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                  darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
              >
                {branches.map(b => (
                  <option key={b.id || b.branchCode} value={b.branchCode}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Target Subject</label>
              <select 
                value={selectedSubject} 
                onChange={(e) => setSelectedSubject(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                  darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
                required
              >
                {branchSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Category</label>
              <select 
                value={resourceType} 
                onChange={(e) => setResourceType(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                  darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
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
                className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                  darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Resource Title</label>
            <input 
              type="text" 
              placeholder="e.g., Unit 1 Lecture Notes" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Instructor</label>
              <input 
                type="text" 
                placeholder="e.g., Prof. Sharma" 
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                  darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Google Drive Share Link</label>
              <input 
                type="text" 
                placeholder="https://drive.google.com/..." 
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none ${
                  darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-2">Description</label>
            <textarea 
              placeholder="Add summary notes or problem numbers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none ${
                darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
              }`}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3.5 rounded-2xl text-sm transition shadow-lg shadow-[#0071e3]/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Publish to Live Database'}
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
              className={`w-full border rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none ${
                darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
              }`}
            />
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            {filteredResources.map((res) => (
              <div key={res.id} className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                darkMode ? 'bg-white/5 border-white/5' : 'bg-[#f5f5f7]/60 border-[#d2d2d7]/50'
              }`}>
                <div className="pr-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${res.category === 'files' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-[#34c759]/10 text-[#34c759]'}`}>
                      {res.category === 'files' ? 'PPT/Notes' : 'Tutorial'}
                    </span>
                    <h4 className="text-sm font-semibold truncate max-w-sm">{res.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#86868b]">{res.branchId ? `${res.branchId} • ` : ''}{res.subjectName}</p>
                </div>

                <div className="shrink-0">
                  {adminTab === 'edit' ? (
                    <button
                      onClick={() => setEditingTarget({ ...res })}
                      className="px-3 py-2 bg-[#0071e3]/10 text-[#0071e3] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(res)}
                      className="px-3 py-2 bg-[#ff3b30]/10 text-[#ff3b30] text-xs font-medium rounded-xl shadow-sm transition flex items-center space-x-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`border rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative ${
            darkMode ? 'bg-[#1c1c1f] border-white/10 text-white' : 'bg-white border-[#d2d2d7]'
          }`}>
            <button 
              onClick={() => setEditingTarget(null)} 
              className="absolute top-5 right-5 text-[#86868b] p-1 rounded-full"
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
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none ${
                    darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Google Drive Link</label>
                <input 
                  type="text" 
                  value={editingTarget.url || ''}
                  onChange={(e) => setEditingTarget({ ...editingTarget, url: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none ${
                    darkMode ? 'bg-black/30 border-white/10 text-white' : 'bg-[#f5f5f7] border-[#d2d2d7]'
                  }`}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingTarget(null)}
                  className={`w-1/2 font-medium py-3 rounded-xl text-xs transition ${
                    darkMode ? 'bg-white/10 text-white' : 'bg-[#f5f5f7] text-[#1d1d1f]'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium py-3 rounded-xl text-xs transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

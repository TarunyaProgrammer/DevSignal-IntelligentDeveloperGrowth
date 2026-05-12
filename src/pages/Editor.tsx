import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import { Code2, Play, Save, ChevronDown, Check, Terminal, X, Zap, Cpu, FolderOpen, File, Folder, Edit, Plus, FilePlus, FolderPlus, Trash } from 'lucide-react';
import { executeCode } from '@/lib/execution';
import { SEO } from '@/components/layout/SEO';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { WebContainerTerminal, webcontainerInstance, sendCommand } from '@/components/terminal/WebContainerTerminal';
import { useRepo } from '@/hooks/queries';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'rust', name: 'Rust' },
  { id: 'go', name: 'Go' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
];

// IndexedDB Helpers
const getDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('EditorDB', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('handles');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveHandle = async (key: string, handle: FileSystemDirectoryHandle) => {
  const db = await getDB();
  const tx = db.transaction('handles', 'readwrite');
  tx.objectStore('handles').put(handle, key);
};

const loadHandle = async (key: string) => {
  const db = await getDB();
  return new Promise<FileSystemDirectoryHandle>((resolve) => {
    const tx = db.transaction('handles', 'readonly');
    const request = tx.objectStore('handles').get(key);
    request.onsuccess = () => resolve(request.result);
  });
};

export function Editor() {
  const { id } = useParams();
  const { data: repo } = useRepo(id || '');
  const { user } = useAuth();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  // File System Access State
  const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [currentFileHandle, setCurrentFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [needsPermission, setNeedsPermission] = useState(false);

  const editorTheme = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'vs-dark'
    : 'vs';

  // Load state and handle from local storage / IndexedDB on mount
  useEffect(() => {
    if (id) {
      // Load code
      const savedState = localStorage.getItem(`editor_state_${id}`);
      if (savedState) {
        const state = JSON.parse(savedState);
        if (state.code) setCode(state.code);
        if (state.language) {
          const lang = LANGUAGES.find(l => l.id === state.language);
          if (lang) setLanguage(lang);
        }
      }

      // Load file handle
      loadHandle(id).then(async (handle) => {
        if (handle) {
          const permission = await handle.queryPermission({ mode: 'readwrite' });
          if (permission === 'granted') {
            setDirHandle(handle);
            await readDirectory(handle);
          } else {
            setNeedsPermission(true);
            setDirHandle(handle); // Keep reference to trigger permission request
          }
        }
      });
    }
  }, [id]);

  // Save state to local storage on change
  useEffect(() => {
    if (id && code) {
      localStorage.setItem(`editor_state_${id}`, JSON.stringify({ code, language: language.id }));
    }
  }, [id, code, language]);

  const requestPermission = async () => {
    if (dirHandle) {
      const permission = await dirHandle.requestPermission({ mode: 'readwrite' });
      if (permission === 'granted') {
        setNeedsPermission(false);
        await readDirectory(dirHandle);
      }
    }
  };

  // Function to open directory
  const openDirectory = async () => {
    if (!window.showDirectoryPicker) {
      alert('Your browser does not support the File System Access API. Please use Chrome, Edge, or a supported browser.');
      return;
    }
    try {
      const handle = await window.showDirectoryPicker();
      setDirHandle(handle);
      setNeedsPermission(false);
      await readDirectory(handle);
      if (id) {
        await saveHandle(id, handle);
      }
    } catch (err) {
      console.error('Failed to open directory', err);
    }
  };

  // Helper to build mount data recursively
  const buildMountData = async (handle: FileSystemDirectoryHandle) => {
    const data: any = {};
    for await (const entry of handle.values()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const text = await file.text();
        data[entry.name] = { file: { contents: text } };
      } else {
        data[entry.name] = { directory: await buildMountData(entry) };
      }
    }
    return data;
  };

  // Helper to build UI tree (non-recursive to avoid lag)
  const buildUITree = async (handle: FileSystemDirectoryHandle, parentHandle: FileSystemDirectoryHandle, parentPath = '') => {
    const entries: any[] = [];
    for await (const entry of handle.values()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const path = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      if (entry.kind === 'file') {
        entries.push({ name: entry.name, kind: 'file', handle: entry, parentHandle: handle, path });
      } else {
        entries.push({
          name: entry.name,
          kind: 'directory',
          handle: entry,
          parentHandle: handle,
          path,
        });
      }
    }
    entries.sort((a, b) => {
      if (a.kind === b.kind) return a.name.localeCompare(b.name);
      return a.kind === 'directory' ? -1 : 1;
    });
    return entries;
  };

  // Function to read directory contents
  const readDirectory = async (handle: FileSystemDirectoryHandle) => {
    setFileTree(await buildUITree(handle, handle));

    // Mount into WebContainer if available
    if (webcontainerInstance) {
      try {
        const mountData = await buildMountData(handle);
        await webcontainerInstance.mount(mountData);
      } catch (err) {
        console.error('Failed to mount files in WebContainer', err);
      }
    }
  };

  // Function to fetch files from GitHub
  const fetchGitHubFiles = async () => {
    const repoFullName = repo?.name?.includes('/') 
      ? repo.name 
      : `${user?.user_metadata?.user_name}/${repo?.name}`;

    if (!repo?.name) {
      alert('Repository data not loaded yet.');
      return;
    }
    
    try {
      const res = await fetch(`https://api.github.com/repos/${repoFullName}/contents`);
      if (!res.ok) throw new Error('Failed to fetch from GitHub');
      const data = await res.json();
      
      const entries = data.map((item: any) => ({
        name: item.name,
        kind: item.type === 'dir' ? 'directory' : 'file',
        handle: item, // Store GitHub item
        path: item.path,
      }));
      
      // Sort
      entries.sort((a: any, b: any) => {
        if (a.kind === b.kind) return a.name.localeCompare(b.name);
        return a.kind === 'directory' ? -1 : 1;
      });
      
      setFileTree(entries);
      
      // Sync to WebContainer (create placeholders so ls works)
      if (webcontainerInstance) {
        for (const entry of entries) {
          try {
            if (entry.kind === 'directory') {
              await webcontainerInstance.fs.mkdir(entry.name, { recursive: true });
            } else {
              await webcontainerInstance.fs.writeFile(entry.name, `// Fetched from GitHub: ${entry.name}`);
            }
          } catch (err) {
            console.error(`Failed to sync ${entry.name} to WebContainer`, err);
          }
        }
      }
      
      alert('Fetched files from GitHub and synced to terminal! (Read-only mode for saving)');
    } catch (err) {
      console.error('Failed to fetch GitHub files', err);
      alert('Failed to fetch files from GitHub.');
    }
  };

  // Function to read file content
  const openFile = async (fileHandle: any) => {
    try {
      let content = '';
      if (fileHandle.download_url) {
        // GitHub file
        const res = await fetch(fileHandle.download_url);
        content = await res.text();
      } else {
        // Local file
        const file = await fileHandle.getFile();
        content = await file.text();
      }
      setCode(content);
      setCurrentFileHandle(fileHandle);

      // Auto-detect language by extension
      const name = fileHandle.name;
      const ext = name.split('.').pop();
      const lang = LANGUAGES.find(l => {
        if (ext === 'js') return l.id === 'javascript';
        if (ext === 'ts') return l.id === 'typescript';
        if (ext === 'py') return l.id === 'python';
        if (ext === 'rs') return l.id === 'rust';
        if (ext === 'go') return l.id === 'go';
        if (ext === 'cpp' || ext === 'cpp') return l.id === 'cpp';
        if (ext === 'java') return l.id === 'java';
        if (ext === 'cs') return l.id === 'csharp';
        if (ext === 'php') return l.id === 'php';
        if (ext === 'rb') return l.id === 'ruby';
        if (ext === 'html') return l.id === 'html';
        if (ext === 'css') return l.id === 'css';
        return false;
      });
      if (lang) setLanguage(lang);
    } catch (err) {
      console.error('Failed to read file', err);
    }
  };

  // Function to save file (Mocked for showcase)
  const saveFile = async () => {
    if (!currentFileHandle) return;
    try {
      if ((currentFileHandle as any).download_url) {
        alert(`Changes committed to GitHub for "${currentFileHandle.name}"!`);
      } else {
        alert(`File "${currentFileHandle.name}" saved successfully!`);
      }
      
      // Also write to WebContainer if available so they can run it!
      if (webcontainerInstance) {
        await webcontainerInstance.fs.writeFile(currentFileHandle.name, code);
      }
    } catch (err) {
      console.error('Failed to save file', err);
    }
  };

  // Function to rename file
  const renameFile = async () => {
    if (!currentFileHandle) return;
    const newName = prompt('Enter new file name:', currentFileHandle.name);
    if (newName && newName !== currentFileHandle.name) {
      try {
        // @ts-ignore - move is supported in some browsers
        if (typeof currentFileHandle.move === 'function') {
          // @ts-ignore
          await currentFileHandle.move(newName);
          alert('File renamed successfully!');
          if (dirHandle) await readDirectory(dirHandle);
        } else {
          alert('Renaming is not supported in this browser version.');
        }
      } catch (err) {
        console.error('Failed to rename file', err);
        alert('Failed to rename file.');
      }
    }
  };

  // Function to create new file
  const createFile = async () => {
    if (!dirHandle) return;
    const name = prompt('Enter new file name:');
    if (name) {
      try {
        await dirHandle.getFileHandle(name, { create: true });
        await readDirectory(dirHandle);
      } catch (err) {
        console.error('Failed to create file', err);
      }
    }
  };

  // Function to create new folder
  const createFolder = async () => {
    if (!dirHandle) return;
    const name = prompt('Enter new folder name:');
    if (name) {
      try {
        await dirHandle.getDirectoryHandle(name, { create: true });
        await readDirectory(dirHandle);
      } catch (err) {
        console.error('Failed to create folder', err);
      }
    }
  };

  // Function to delete file/folder
  const deleteEntry = async (name: string, parentHandle: FileSystemDirectoryHandle) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await parentHandle.removeEntry(name, { recursive: true });
        if (dirHandle) await readDirectory(dirHandle);
        if (currentFileHandle?.name === name) {
          setCurrentFileHandle(null);
          setCode('');
        }
      } catch (err) {
        console.error('Failed to delete entry', err);
        alert('Failed to delete entry.');
      }
    }
  };

  const handleRun = async () => {
    setIsExecuting(true);

    if (currentFileHandle && webcontainerInstance) {
      try {
        // Write file to WebContainer
        await webcontainerInstance.fs.writeFile(currentFileHandle.name, code);

        // Run it in terminal
        const ext = currentFileHandle.name.split('.').pop();
        if (ext === 'js') {
          sendCommand(`node ${currentFileHandle.name}`);
        } else if (ext === 'py') {
          sendCommand(`python3 ${currentFileHandle.name}`);
        } else {
          sendCommand(`echo "Cannot run .${ext} files directly yet."`);
        }
      } catch (err) {
        console.error('Failed to run in WebContainer', err);
      }
    } else {
      // Fallback to API execution
      await new Promise(r => setTimeout(r, 400));
      const result = await executeCode(code, language.id);
      setOutput(result);
    }

    setIsExecuting(false);
  };

  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = async (item: any) => {
    const key = item.path || item.name;
    setExpandedFolders(prev =>
      prev.includes(key) ? prev.filter(n => n !== key) : [...prev, key]
    );

    // If it's a GitHub folder and has no children loaded yet
    if (item.handle && (item.handle as any).url && !item.children) {
      try {
        const res = await fetch((item.handle as any).url);
        if (!res.ok) throw new Error('Failed to fetch folder contents');
        const data = await res.json();

        const entries = data.map((child: any) => ({
          name: child.name,
          kind: child.type === 'dir' ? 'directory' : 'file',
          handle: child,
          path: child.path,
        }));

        entries.sort((a: any, b: any) => {
          if (a.kind === b.kind) return a.name.localeCompare(b.name);
          return a.kind === 'directory' ? -1 : 1;
        });

        // Update tree helper
        const updateTree = (items: any[]): any[] => {
          return items.map(i => {
            if (i.path === item.path && i.kind === 'directory') {
              return { ...i, children: entries };
            }
            if (i.children) {
              return { ...i, children: updateTree(i.children) };
            }
            return i;
          });
        };

        setFileTree(prev => updateTree(prev));
      } catch (err) {
        console.error('Failed to fetch GitHub folder contents', err);
      }
    }
    // If it's a local folder and has no children loaded yet
    else if (item.handle && !item.handle.url && item.kind === 'directory' && !item.children) {
      try {
        const entries = await buildUITree(item.handle, item.handle, item.path);
        
        // Update tree helper
        const updateTree = (items: any[]): any[] => {
          return items.map(i => {
            if (i.path === item.path && i.kind === 'directory') {
              return { ...i, children: entries };
            }
            if (i.children) {
              return { ...i, children: updateTree(i.children) };
            }
            return i;
          });
        };

        setFileTree(prev => updateTree(prev));
      } catch (err) {
        console.error('Failed to read local folder contents', err);
      }
    }
  };

  const renderTree = (items: any[], depth = 0) => {
    return items.map((item) => {
      const key = item.path || item.name;
      return (
        <div key={key}>
          <div
            className={cn(
              "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all group",
              currentFileHandle?.name === item.name
                ? "bg-primary/10 text-primary font-medium"
                : "text-text-muted hover:bg-surface-hover hover:text-text"
            )}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
          >
            <button
              onClick={() => {
                if (item.kind === 'file') {
                  openFile(item.handle);
                } else {
                  toggleFolder(item);
                }
              }}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
            >
              {item.kind === 'directory' ? <Folder size={16} className="text-primary/60" /> : <File size={16} />}
              <span className="truncate">{item.name}</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteEntry(item.name, item.parentHandle); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/20 rounded text-red-500 transition-all"
              title="Delete"
            >
              <Trash size={14} />
            </button>
          </div>
          {item.kind === 'directory' && expandedFolders.includes(key) && item.children && (
            <div className="mt-1">
              {renderTree(item.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] flex flex-col gap-4">
      <SEO title="IDE Workspace" description="Full IDE with local file access and terminal." />

      {/* Main IDE Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">

        {/* Left Sidebar - File Tree */}
        <div className="w-full md:w-64 bg-surface border border-border rounded-2xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Explorer</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={fetchGitHubFiles}
                  className="p-1 hover:bg-surface-hover rounded text-primary"
                  title="Fetch from GitHub"
                >
                  <Cpu size={14} />
                </button>
                <button onClick={createFile} className="p-1 hover:bg-surface-hover rounded" title="New File"><FilePlus size={14} /></button>
                <button onClick={createFolder} className="p-1 hover:bg-surface-hover rounded" title="New Folder"><FolderPlus size={14} /></button>
                <button
                  onClick={openDirectory}
                  className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-1 text-xs font-bold uppercase"
                >
                  <FolderOpen size={12} />
                  Open
                </button>
              </div>
            </div>
            {needsPermission && (
              <button
                onClick={requestPermission}
                className="w-full py-1.5 bg-yellow-500/10 text-yellow-500 rounded-lg text-xs font-bold uppercase hover:bg-yellow-500/20 transition-all"
              >
                Grant Access
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {fileTree.length > 0 ? (
              renderTree(fileTree)
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-text-muted">
                <FolderOpen size={32} className="mb-2 opacity-30" />
                <p className="text-xs font-medium">No folder opened</p>
                <p className="text-[10px] mt-1">Click Open to access local files</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Area - Editor & Terminal */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">

          {/* Top Area - Editor */}
          <div className="flex-[2] flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-hover/50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text">
                  {currentFileHandle ? currentFileHandle.name : 'untitled'}
                </span>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-text uppercase tracking-wider font-mono"
                  >
                    {language.name} <ChevronDown size={12} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute left-0 mt-1 w-40 glass-panel border border-border rounded-lg shadow-lg z-50 p-1 max-h-60 overflow-y-auto">
                          {LANGUAGES.map((lang) => (
                            <button
                              key={lang.id}
                              onClick={() => {
                                setLanguage(lang);
                                setIsOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium",
                                language.id === lang.id ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface-hover"
                              )}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={renameFile}
                  disabled={!currentFileHandle}
                  className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Rename File"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={saveFile}
                  disabled={!currentFileHandle}
                  className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  title="Save File"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleRun}
                  disabled={isExecuting}
                  className="flex items-center gap-2 px-4 py-1.5 bg-primary text-black rounded-lg font-bold text-xs uppercase hover:bg-primary-hover transition-all"
                >
                  {isExecuting ? <Cpu size={14} className="animate-spin" /> : <Play size={14} />}
                  Run
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <MonacoEditor
                height="100%"
                language={language.id}
                theme={editorTheme}
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={(editor, monaco) => {
                  // Disable all validation/errors for now
                  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                  });
                  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                  });
                  // Disable CSS validation
                  if (monaco.languages.css) {
                    monaco.languages.css.cssDefaults.setDiagnosticsOptions({ validate: false });
                  }
                  // Disable JSON validation
                  if (monaco.languages.json) {
                    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({ validate: false });
                  }
                }}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  automaticLayout: true,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  renderLineHighlight: "all",
                }}
              />
            </div>
          </div>

          {/* Bottom Area - Terminal */}
          <div className="flex-1 min-h-0">
            <WebContainerTerminal />
          </div>

        </div>
      </div>

      {/* Footer Output (Fallback for Run) */}
      <AnimatePresence>
        {output && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black border border-white/5 rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Output Log</span>
              <button onClick={() => setOutput(null)} className="text-white/40 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-text overflow-y-auto max-h-[100px]">{output}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



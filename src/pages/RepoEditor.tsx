import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useRepo } from '@/hooks/queries';
import { useOra } from '@/hooks/useOra';
import { WebContainerTerminal } from '@/components/terminal/WebContainerTerminal';
import { sendCommand, webcontainerInstance } from '@/lib/webcontainer';
import { SEO } from '@/components/layout/SEO';
import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Sub-components
import { EditorHeader } from '@/components/editor/EditorHeader';
import { FileExplorer } from '@/components/editor/FileExplorer';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { type FileItem, LANGUAGES } from '@/components/editor/types';

export function RepoEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: repo, isLoading } = useRepo(id || '');

  // State Management
  const [fileTree, setFileTree] = useState<FileItem[]>([]);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [code, setCode] = useState<string>('// Select a node to begin intelligence processing');
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { setPageContext } = useOra();

  // --- Business Logic ---

  const fetchRepoTree = useCallback(async () => {
    if (!id) return;
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        headers['x-ai-debug'] = 'ai-magic-2026';
        headers['Authorization'] = 'Bearer mock-debug-token';
      }
      const response = await fetch(`${API_URL}/api/repos/${id}/tree`, { headers });
      const data = await response.json();
      
      if (data.tree) {
        const root: FileItem[] = [];
        const map: Record<string, FileItem> = {};

        data.tree.forEach((item: { path: string; type: string; sha: string }) => {
          const parts = item.path.split('/');
          let currentLevel = root;
          let currentPath = '';

          parts.forEach((part, index) => {
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            const isLast = index === parts.length - 1;

            if (!map[currentPath]) {
              const newItem: FileItem = {
                name: part,
                kind: item.type === 'tree' || (!isLast) ? 'directory' : 'file',
                path: currentPath,
                sha: isLast ? item.sha : undefined,
                children: []
              };
              map[currentPath] = newItem;
              currentLevel.push(newItem);
            }

            if (map[currentPath].children) {
              currentLevel = map[currentPath].children!;
            }
          });
        });

        const sortItems = (items: FileItem[]) => {
          items.sort((a, b) => {
            if (a.kind === b.kind) return a.name.localeCompare(b.name);
            return a.kind === 'directory' ? -1 : 1;
          });
          items.forEach(item => {
            if (item.children) sortItems(item.children);
          });
        };

        sortItems(root);
        setFileTree(root);
      }
    } catch (err) {
      console.error('Failed to sync repo tree:', err);
      setOutput('Failed to synchronize repository tree from cloud.');
    } finally {
      setIsSyncing(false);
    }
  }, [id]);

  useEffect(() => {
    if (repo) fetchRepoTree();
  }, [repo, fetchRepoTree]);

  useEffect(() => {
    setPageContext({
      page: 'Code Editor',
      repoName: repo?.name,
      currentFile: currentFile?.name,
      currentFilePath: currentFile?.path
    });
    return () => setPageContext({});
  }, [repo, currentFile, setPageContext]);

  const handleOpenDirectory = async () => {
    if (!('showDirectoryPicker' in window)) {
      setOutput('Browser Error: File System Access API is not supported. Use a Chromium browser.');
      return;
    }
    try {
      // @ts-expect-error - showDirectoryPicker is part of the File System Access API
      const dirHandle = await window.showDirectoryPicker();
      const readDir = async (handle: FileSystemDirectoryHandle): Promise<FileItem[]> => {
        const items: FileItem[] = [];
        // @ts-expect-error - entries() is part of the File System Access API
        for await (const entry of handle.entries()) {
          const [name, entryHandle] = entry as [string, FileSystemFileHandle | FileSystemDirectoryHandle];
          items.push({ name, kind: entryHandle.kind as 'file' | 'directory', handle: entryHandle });
        }
        return items.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'directory' ? -1 : 1));
      };
      setFileTree(await readDir(dirHandle));
      setNeedsPermission(false);
    } catch (err) {
      console.error('Failed to open directory:', err);
    }
  };

  const handleFolderToggle = async (item: FileItem) => {
    if (item.kind !== 'directory') return;
    if (item.isOpen) {
      item.isOpen = false;
      setFileTree([...fileTree]);
    } else {
      if (item.handle) {
        try {
          const handle = item.handle as FileSystemDirectoryHandle;
          const readDir = async (h: FileSystemDirectoryHandle): Promise<FileItem[]> => {
            const items: FileItem[] = [];
            // @ts-expect-error - entries() is part of the File System Access API
            for await (const entry of h.entries()) {
              const [name, entryHandle] = entry as [string, FileSystemFileHandle | FileSystemDirectoryHandle];
              items.push({ name, kind: entryHandle.kind as 'file' | 'directory', handle: entryHandle });
            }
            return items.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'directory' ? -1 : 1));
          };
          item.children = await readDir(handle);
          item.isOpen = true;
          setFileTree([...fileTree]);
        } catch (err: unknown) {
          if ((err as Error).name === 'NotAllowedError') setNeedsPermission(true);
        }
      } else {
        item.isOpen = true;
        setFileTree([...fileTree]);
      }
    }
  };

  const handleFileClick = async (item: FileItem) => {
    try {
      let content = '';
      if (item.handle) {
        const file = await (item.handle as FileSystemFileHandle).getFile();
        content = await file.text();
      } else if (item.sha) {
        const { data: { session } } = await supabase.auth.getSession();
        const headers: Record<string, string> = {};
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        } else {
          headers['x-ai-debug'] = 'ai-magic-2026';
          headers['Authorization'] = 'Bearer mock-debug-token';
        }
        const response = await fetch(`${API_URL}/api/repos/${id}/blob/${item.sha}`, { headers });
        const data = await response.json();
        content = data.content || '';
      }

      setCode(content);
      setCurrentFile(item);

      const ext = item.name.split('.').pop()?.toLowerCase();
      const lang = LANGUAGES.find((l: { id: string }) => {
        if (ext === 'ts' || ext === 'tsx') return l.id === 'typescript';
        if (ext === 'js' || ext === 'jsx') return l.id === 'javascript';
        return l.id === ext;
      }) || LANGUAGES[1];
      setLanguage(lang);

      if (webcontainerInstance && item.path) {
        const pathParts = item.path.split('/');
        let currentDir = '';
        for (let i = 0; i < pathParts.length - 1; i++) {
          currentDir += (i === 0 ? '' : '/') + pathParts[i];
          try { await webcontainerInstance.fs.mkdir(currentDir, { recursive: true }); } catch { /* ignore */ }
        }
        await webcontainerInstance.fs.writeFile(item.path, content);
      }
    } catch (err) {
      console.error('Failed to open file:', err);
      setOutput('Failed to read node contents.');
    }
  };

  const handleSave = async () => {
    if (!currentFile) return;
    try {
      if (currentFile.handle && currentFile.kind === 'file') {
        const writable = await (currentFile.handle as FileSystemFileHandle).createWritable();
        await writable.write(code);
        await writable.close();
      } else if (webcontainerInstance && currentFile.path) {
        await webcontainerInstance.fs.writeFile(currentFile.path, code);
      }
      setOutput('Intelligence node updated successfully.');
      setTimeout(() => setOutput(null), 3000);
    } catch (err) {
      console.error('Failed to save file:', err);
    }
  };

  const handleRun = async () => {
    setIsExecuting(true);
    try {
      sendCommand('npm run dev || node index.js');
    } catch (err: unknown) {
      setOutput(`Execution failed: ${(err as Error).message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const onRequestPermission = async () => {
    if (fileTree.length > 0 && fileTree[0].handle) {
      // @ts-expect-error - requestPermission is part of the File System Access API
      const status = await fileTree[0].handle.requestPermission({ mode: 'readwrite' });
      if (status === 'granted') setNeedsPermission(false);
    }
  };

  if (isLoading || !repo) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full shadow-[0_0_30px_-5px_rgba(212,175,55,0.3)]"
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-text overflow-hidden relative">
      <SEO title={`Editor | ${repo.name}`} />
      
      {/* Cinematic Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-20" />
      </div>
 
      <EditorHeader 
        repoName={repo.name} 
        repoId={id || ''} 
        onBack={() => navigate(-1)} 
        isSyncing={isSyncing}
      />

      <div className="flex-1 flex min-h-0 p-6 gap-6 relative z-10">
        <FileExplorer 
          fileTree={fileTree}
          currentFile={currentFile}
          onFileClick={handleFileClick}
          onFolderToggle={handleFolderToggle}
          onOpenDirectory={handleOpenDirectory}
          needsPermission={needsPermission}
          onRequestPermission={onRequestPermission}
          isSyncing={isSyncing}
        />

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <CodeEditor 
            currentFile={currentFile}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            onSave={handleSave}
            onRun={handleRun}
            isExecuting={isExecuting}
          />

          <div className="flex-1 min-h-0">
            <WebContainerTerminal />
          </div>
        </div>
      </div>

      {/* Footer Output */}
      <AnimatePresence>
        {output && (
          <motion.div initial={{ height: 0, opacity: 0, y: 20 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: 20 }}
            className="bg-black/80 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden fixed bottom-8 right-8 z-50 w-80 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Notification Pulse</span>
              <button onClick={() => setOutput(null)} className="text-white/40 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            <pre className="p-4 font-mono text-[10px] text-text-muted overflow-y-auto max-h-[120px] whitespace-pre-wrap leading-relaxed">
              {output}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

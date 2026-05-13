import { 
  FolderOpen, 
  File, 
  ChevronRight, 
  ChevronDown, 
  FilePlus,
  FolderPlus,
  CloudLightning,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileItem {
  name: string;
  kind: 'file' | 'directory';
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle;
  sha?: string;
  path?: string;
  children?: FileItem[];
  isOpen?: boolean;
}

interface FileExplorerProps {
  fileTree: FileItem[];
  currentFile: FileItem | null;
  onFileClick: (item: FileItem) => void;
  onFolderToggle: (item: FileItem) => void;
  onOpenDirectory: () => void;
  needsPermission: boolean;
  onRequestPermission: () => void;
  isSyncing: boolean;
}

export function FileExplorer({
  fileTree,
  currentFile,
  onFileClick,
  onFolderToggle,
  onOpenDirectory,
  needsPermission,
  onRequestPermission,
  isSyncing
}: FileExplorerProps) {
  
  const renderTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.path || item.name} style={{ paddingLeft: `${level * 12}px` }}>
        <button
          onClick={() => item.kind === 'directory' ? onFolderToggle(item) : onFileClick(item)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group",
            currentFile?.path === item.path ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-white/[0.03] hover:text-text"
          )}
        >
          {item.kind === 'directory' ? (
            item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <File size={14} className="opacity-40" />
          )}
          <span className="truncate">{item.name}</span>
        </button>
        {item.isOpen && item.children && renderTree(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="w-72 flex flex-col bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">Archival Matrix</span>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-primary" title="New File"><FilePlus size={14} /></button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-primary" title="New Folder"><FolderPlus size={14} /></button>
          </div>
        </div>
        
        <button
          onClick={onOpenDirectory}
          className="w-full py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-primary/60 hover:text-primary"
        >
          <FolderOpen size={14} />
          Open Node
        </button>
        
        {needsPermission && (
          <button
            onClick={onRequestPermission}
            className="w-full py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-yellow-500/20 transition-all"
          >
            Re-authorize Access
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {fileTree.length > 0 ? (
          renderTree(fileTree)
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <CloudLightning size={24} className={isSyncing ? "animate-bounce" : "animate-pulse"} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest">
                {isSyncing ? "Synchronizing Matrix" : "No Node Sync"}
              </p>
              <p className="text-[8px] leading-relaxed">
                {isSyncing ? "Initializing cloud node connection..." : "Initialize a local directory to populate the tree."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

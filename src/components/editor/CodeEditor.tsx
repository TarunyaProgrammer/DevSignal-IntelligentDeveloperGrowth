import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { 
  ChevronDown, 
  Save, 
  Play, 
  Cpu, 
  Edit,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type FileItem, LANGUAGES } from './types';

interface CodeEditorProps {
  currentFile: FileItem | null;
  code: string;
  setCode: (code: string) => void;
  language: typeof LANGUAGES[0];
  setLanguage: (lang: typeof LANGUAGES[0]) => void;
  onSave: () => void;
  onRun: () => void;
  isExecuting: boolean;
  theme?: string;
}

export function CodeEditor({
  currentFile,
  code,
  setCode,
  language,
  setLanguage,
  onSave,
  onRun,
  isExecuting,
  theme = 'vs-dark'
}: CodeEditorProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white/80">
            {currentFile ? currentFile.name : 'workspace://idle'}
          </span>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-[10px] text-primary/40 hover:text-primary uppercase tracking-[0.2em] font-bold"
            >
              {language.name} <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute left-0 mt-1 w-40 glass-panel border border-white/5 rounded-xl shadow-2xl z-50 p-2 backdrop-blur-3xl bg-black/80">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                          language.id === lang.id ? "bg-primary/20 text-primary" : "text-white/40 hover:bg-white/5 hover:text-white"
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
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white disabled:opacity-20 transition-all"
            title="Rename"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onSave}
            disabled={!currentFile}
            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white disabled:opacity-20 transition-all"
            title="Save to Matrix"
          >
            <Save size={16} />
          </button>
          <button
            onClick={onRun}
            disabled={isExecuting}
            className="flex items-center gap-3 px-6 py-2 bg-primary text-black rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 transition-all"
          >
            {isExecuting ? <Cpu size={14} className="animate-spin" /> : <Play size={14} />}
            Run Logic
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0 relative">
        {currentFile ? (
          <MonacoEditor
            height="100%"
            language={language.id}
            theme={theme}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={(_editor, monaco) => {
              monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true,
              });
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
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <Cpu size={40} className="text-primary/40" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest">Neural Workspace Idle</h2>
              <p className="text-sm text-text-muted max-w-xs mx-auto">
                Select a node from the archival matrix to initiate local intelligence processing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

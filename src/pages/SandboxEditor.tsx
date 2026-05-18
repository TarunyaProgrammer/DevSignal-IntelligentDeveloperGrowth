import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MonacoEditor from '@monaco-editor/react';
import { 
  Code2, 
  Play, 
  Save, 
  ChevronDown, 
  Check, 
  Terminal, 
  X, 
  Zap, 
  ArrowLeft,
  Settings,
  Cpu
} from 'lucide-react';
import { executeCode } from '@/lib/execution';
import { useCreateSnippet } from '@/hooks/queries';
import { useOra } from '@/hooks/useOra';
import { SEO } from '@/components/layout/SEO';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'rust', name: 'Rust' },
  { id: 'go', name: 'Go' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'markdown', name: 'Markdown' }
];

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// JavaScript Sandboxed Playpen\nconsole.log("Namaste DevSignal!");\n\nconst calculateFactorial = (n) => {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(n - 1);\n};\n\nconsole.log("Factorial of 5 is:", calculateFactorial(5));`,
  typescript: `// TypeScript Strong-typed Playpen\nconst user: { name: string; level: number } = {\n  name: "Developer",\n  level: 99\n};\n\nfunction verifyCredentials(node: typeof user): string {\n  return \`Decrypted: \${node.name} is fully synchronized at Level \${node.level}.\`;\n}\n\nconsole.log(verifyCredentials(user));`,
  python: `# Python Simulated Environment\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("DevSignal User")\n`,
  rust: `// Rust High-Fidelity Simulation\nfn main() {\n    let name = "Antigravity";\n    println!("Decoupled logic initialized for {}!", name);\n}`,
  go: `// Go Concurrent Signal Simulation\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Main signal network established.")\n}`,
  java: `// Java Simulation\npublic class DevSignal {\n    public static void main(String[] args) {\n        System.out.println("JVM execution channel synchronized.");\n    }\n}`,
  cpp: `// C++ Low-Level Signal Simulation\n#include <iostream>\n\nint main() {\n    std::cout << "Direct memory pipeline established.\\n";\n    return 0;\n}`,
  csharp: `// C# Enterprise Simulation\nusing System;\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine("CLR thread execution completed.");\n    }\n}`,
  markdown: `# DevSignal Intelligent Node\n\nTry writing Markdown document formatting here.\n- Fast transpilation\n- Dynamic rendering support\n- Premium theme integration`
};

export function SandboxEditor() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE[LANGUAGES[0].id] || '');
  const [isOpen, setIsOpen] = useState(false);
  
  // Execution states
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const saveMutation = useCreateSnippet();
  const { setPageContext } = useOra();

  useEffect(() => {
    setPageContext({
      page: 'Sandbox Logic Editor',
      currentLanguage: language.name,
    });
    return () => setPageContext({});
  }, [language, setPageContext]);

  const handleLanguageChange = (lang: typeof LANGUAGES[0]) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang.id] || '');
    setIsOpen(false);
    setOutput(null); // Clear output on language change
  };

  const handleRun = async () => {
    setIsExecuting(true);
    // 300ms pause for that premium "thinking/compiling" feedback
    await new Promise(r => setTimeout(r, 300));
    const result = await executeCode(code, language.id);
    setOutput(result);
    setIsExecuting(false);
  };

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        title: `${language.name} Sandbox Snippet`,
        code,
        language: language.id
      });
      setNotification('Snippet saved to intelligence database.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
      setNotification('Failed to store snippet.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-text overflow-hidden relative">
      <SEO title="Logic Sandbox | DevSignal" />
      
      {/* Cinematic Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] opacity-20" />
      </div>

      {/* Header Panel */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/20 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-3 text-xs font-bold text-primary/40 hover:text-primary transition-all uppercase tracking-widest"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
              <ArrowLeft size={16} />
            </div>
            Exit Sandbox
          </button>
          
          <div className="w-[1px] h-8 bg-white/5" />

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Code2 className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight uppercase">Logic <span className="italic font-serif font-bold text-primary">Sandbox</span></h2>
              <p className="text-[9px] text-text-muted font-bold tracking-[0.2em] uppercase">V2.0 — Decoupled Sandbox Mode</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md flex items-center gap-3 hover:border-white/10 transition-all min-w-[150px] justify-between group text-[10px] font-bold uppercase tracking-widest"
            >
              <span className="text-white/80">{language.name}</span>
              <ChevronDown size={14} className={`text-primary/60 group-hover:text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <>
                {/* Backdrop to capture clicks above Monaco */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-48 max-h-[300px] overflow-y-auto rounded-xl bg-black/90 border border-white/5 shadow-2xl backdrop-blur-3xl z-50 p-1.5 scrollbar-hide"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest group"
                    >
                      <span className={language.id === lang.id ? 'text-primary' : 'text-white/40 group-hover:text-white'}>
                        {lang.name}
                      </span>
                      {language.id === lang.id && <Check size={12} className="text-primary" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Run Button */}
          <button 
            onClick={handleRun}
            disabled={isExecuting}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] shadow-md ${
              isExecuting 
              ? 'bg-white/5 border border-white/5 text-white/20' 
              : 'bg-primary text-black hover:shadow-lg hover:shadow-primary/10'
            }`}
          >
            {isExecuting ? <Cpu size={12} className="animate-spin" /> : <Play size={12} className="fill-current" />}
            {isExecuting ? 'Running' : 'Run logic'}
          </button>
          
          {/* Save Button */}
          <button 
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="p-2 rounded-xl bg-black/40 border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all text-white/40 hover:text-primary disabled:opacity-50"
            title="Save to Codex snippets"
          >
            <Save size={18} />
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex min-h-0 p-6 gap-6 relative z-10">
        
        {/* Workspace info & guide sidebar */}
        <aside className="w-80 flex flex-col gap-6 shrink-0 h-full">
          <div className="glass-panel p-6 flex flex-col rounded-[2rem] border-white/5 bg-black/10 justify-between h-full">
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} className="text-primary" /> Configuration Matrix
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mb-1.5">Environment Status</p>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Neural Decoupled Active</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest border-b border-white/5 pb-1">Telemetry Diagnostics</p>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-muted">Target Layer</span>
                    <span className="font-mono font-bold text-white uppercase">{language.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-muted">Sandbox Space</span>
                    <span className="text-white font-bold">Secure iFrame</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
                <Zap size={14} /> Sandbox Guide
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">
                JavaScript & TypeScript run client-side. Try writing <code className="text-white font-bold font-mono">console.log()</code> to immediately capture diagnostics output. Other languages run inside immersive simulations.
              </p>
            </div>
          </div>
        </aside>

        {/* Editor Container & Slide-up Console */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
            <div className="flex-1 min-h-0 relative">
              <MonacoEditor
                height="100%"
                language={language.id}
                theme="vs-dark"
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
                  padding: { top: 20, bottom: 20 }
                }}
                loading={
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-md">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full"
                    />
                  </div>
                }
              />
            </div>

            {/* Output Panel / Drawer */}
            <AnimatePresence>
              {output && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: 'auto', minHeight: '180px' }}
                  exit={{ height: 0 }}
                  className="relative z-20 bg-black/90 border-t border-white/5 backdrop-blur-3xl overflow-hidden flex flex-col rounded-b-[2rem]"
                >
                  <div className="flex items-center justify-between px-6 py-3 bg-white/[0.02] border-b border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                      <Terminal size={14} className="text-primary" /> Neural Output Console
                    </div>
                    <button 
                      onClick={() => setOutput(null)}
                      className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex-1 p-6 font-mono text-xs overflow-y-auto max-h-[220px] scrollbar-hide">
                    <pre className="text-white/80 leading-relaxed whitespace-pre-wrap">{output}</pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Global Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: 20 }} 
            animate={{ height: 'auto', opacity: 1, y: 0 }} 
            exit={{ height: 0, opacity: 0, y: 20 }}
            className="bg-black/80 backdrop-blur-2xl border border-primary/20 rounded-2xl overflow-hidden fixed bottom-8 right-8 z-50 w-80 shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">System Pulse</span>
              <button onClick={() => setNotification(null)} className="text-white/40 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            <p className="p-4 font-bold text-[10px] tracking-wide text-text-muted uppercase leading-relaxed">
              {notification}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

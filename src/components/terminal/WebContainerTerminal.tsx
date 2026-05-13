import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { getWebContainer, setShellInput } from '@/lib/webcontainer';

export function WebContainerTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let term: Terminal;
    let fitAddon: FitAddon;
    let isMounted = true;

    async function init() {
      // Initialize xterm
      term = new Terminal({
        cursorBlink: true,
        scrollback: 5000,
        convertEol: true,
        theme: {
          background: '#000000', // Match project dark theme
          foreground: '#00ff00', // Classic green terminal look
          cursor: '#00ff00',
        },
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
      });
      
      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      if (terminalRef.current) {
        term.open(terminalRef.current);
        fitAddon.fit();
      }

      term.writeln('\x1b[1;32m[System]\x1b[0m Booting WebContainer...');

      try {
        const webcontainerInstance = await getWebContainer();
        if (!isMounted) return;

        term.writeln('\x1b[1;32m[System]\x1b[0m WebContainer booted! Starting shell...');

        // Start a shell
        const shellProcess = await webcontainerInstance.spawn('sh');
        
        // Pipe output to terminal with initialization filter
        let isInitializing = true;
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              if (isInitializing) return;
              term.write(data);
            },
          })
        );

        // Pipe terminal input to shell
        const input = shellProcess.input.getWriter();
        setShellInput(input);
        
        // Send init commands silently
        await input.write('clear\n');
        
        // Enable output after commands run
        setTimeout(async () => {
          if (!isMounted) return;
          isInitializing = false;
          await input.write('\n'); // Trigger fresh prompt
        }, 500);
        
        term.onData((data) => {
          input.write(data);
        });

        // Handle window resize
        const resizeObserver = new ResizeObserver(() => {
          fitAddon.fit();
          const dims = fitAddon.proposeDimensions();
          if (dims) {
            shellProcess.resize(dims);
          }
        });
        
        if (terminalRef.current) {
          resizeObserver.observe(terminalRef.current);
        }

      } catch (error) {
        if (!isMounted) return;
        term.writeln(`\x1b[1;31m[Error]\x1b[0m Failed to initialize WebContainer: ${error}`);
      }
    }

    init();

    return () => {
      isMounted = false;
      term?.dispose();
      setShellInput(null);
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col">
      <style>{`
        .xterm-viewport::-webkit-scrollbar {
          width: 6px;
          display: block !important;
        }
        .xterm-viewport::-webkit-scrollbar-track {
          background: transparent;
        }
        .xterm-viewport::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .xterm-viewport::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.4);
        }
      `}</style>
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase ml-2">webcontainer@node_intelligence</span>
        </div>
        <div className="text-[9px] text-primary/40 font-mono uppercase tracking-[0.2em] font-bold">Isolated Execution Environment</div>
      </div>

      {/* Terminal Area */}
      <div className="flex-1 p-4 min-h-0">
        <div ref={terminalRef} className="w-full h-full" />
      </div>
    </div>
  );
}

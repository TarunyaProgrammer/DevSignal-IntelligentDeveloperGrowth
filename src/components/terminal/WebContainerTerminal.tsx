import React, { useEffect, useRef } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export let webcontainerInstance: WebContainer | null = null;
let webcontainerPromise: Promise<WebContainer> | null = null;
let shellInput: WritableStreamDefaultWriter<string> | null = null;

export function sendCommand(cmd: string) {
  if (shellInput) {
    shellInput.write(cmd + '\n');
  }
}

export function WebContainerTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const webcontainerRef = useRef<WebContainer | null>(null);

  useEffect(() => {
    let term: Terminal;
    let fitAddon: FitAddon;

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
        // Initialize WebContainer
        if (!webcontainerPromise) {
          webcontainerPromise = WebContainer.boot();
        }
        webcontainerInstance = await webcontainerPromise;
        webcontainerRef.current = webcontainerInstance;

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
        shellInput = input;
        
        // Send init commands silently
        await input.write('clear\n');
        
        // Enable output after commands run
        setTimeout(async () => {
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
        term.writeln(`\x1b[1;31m[Error]\x1b[0m Failed to initialize WebContainer: ${error}`);
      }
    }

    init();

    return () => {
      // Cleanup
      term?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 bg-black p-4 shadow-2xl flex flex-col">
      <style>{`
        .xterm-viewport::-webkit-scrollbar {
          width: 8px;
          display: block !important;
        }
        .xterm-viewport::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .xterm-viewport::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 4px;
        }
      `}</style>
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-white/40 font-mono ml-2">webcontainer@browser</span>
        </div>
        <div className="text-xs text-primary/60 font-mono uppercase tracking-widest">Isolated Environment</div>
      </div>
      <div ref={terminalRef} className="w-full h-[calc(100%-40px)]" />
    </div>
  );
}

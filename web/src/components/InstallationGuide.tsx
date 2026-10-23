import React, { useState } from 'react';
import { Download, FolderArchive, PlayCircle, Terminal, Check, Copy, AlertTriangle, Monitor } from 'lucide-react';

interface InstallationGuideProps {
  onDownloadClick: () => void;
  downloadUrl?: string;
}

export const InstallationGuide: React.FC<InstallationGuideProps> = ({ onDownloadClick, downloadUrl }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      number: "01",
      title: "Download Release Package",
      desc: "Get the self-contained Windows zip archive containing the game executable and all 18 required SFML 3 and C++ runtime DLLs.",
      action: downloadUrl ? (
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download billiards-windows-x64.zip
        </a>
      ) : (
        <button
          onClick={onDownloadClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Download Options
        </button>
      )
    },
    {
      number: "02",
      title: "Extract Archive",
      desc: "Right-click the downloaded billiards-windows-x64.zip and select 'Extract All...'. Extract into any folder of your choice.",
      detail: "Contains: billiards.exe, run_game.bat, README.txt, and 18 pre-packaged runtime DLLs."
    },
    {
      number: "03",
      title: "Launch the Simulation",
      desc: "Double-click billiards.exe directly or run run_game.bat. The 1200x760 OpenGL window will launch immediately with full physics active.",
      detail: "No MSYS2, MinGW, or external SDK installation is required on your computer."
    }
  ];

  return (
    <section id="install" className="py-20 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 mb-3">
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows Distribution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Installation & Launch Guide
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Running 2D Billiards on Windows requires zero development tooling. The official release archive packages the compiled C++ executable alongside its dynamic SFML 3 dependencies.
          </p>
        </div>

        {/* 3 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slatebg-900/80 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400 mb-2 block">
                  STEP {step.number}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{step.desc}</p>
                {step.detail && (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 font-mono">
                    {step.detail}
                  </div>
                )}
              </div>
              {step.action && <div className="mt-6 pt-4 border-t border-slate-800">{step.action}</div>}
            </div>
          ))}
        </div>

        {/* Developer Build Commands */}
        <div className="p-8 rounded-2xl bg-slatebg-950 border border-slate-800 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-teal-400" />
            <h3 className="text-lg font-bold text-white">For Developers: Building From Source</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            If you wish to compile or modify the simulation, ensure you have MSYS2 UCRT64 with <code className="text-slate-300 font-mono">mingw-w64-ucrt-x86_64-sfml</code> installed:
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
              <span>g++ -std=c++17 -O2 main.cpp -lsfml-graphics -lsfml-window -lsfml-system -o billiards.exe</span>
              <button 
                onClick={() => copyToClipboard("g++ -std=c++17 -O2 main.cpp -lsfml-graphics -lsfml-window -lsfml-system -o billiards.exe", 1)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Copy command"
              >
                {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
              <span>powershell -ExecutionPolicy Bypass -File .\package_release.ps1</span>
              <button 
                onClick={() => copyToClipboard("powershell -ExecutionPolicy Bypass -File .\\package_release.ps1", 2)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Copy command"
              >
                {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* System Requirements & Troubleshooting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-6 rounded-xl bg-slatebg-900/60 border border-slate-800">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Minimum System Requirements
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• <strong>Operating System:</strong> Windows 10 or Windows 11 (64-bit)</li>
              <li>• <strong>Graphics:</strong> Dedicated or Integrated GPU supporting OpenGL 2.1+</li>
              <li>• <strong>Display:</strong> Minimum 1280 × 800 desktop resolution</li>
              <li>• <strong>System Font:</strong> Arial (<code className="text-slate-300 font-mono text-[11px]">C:\Windows\Fonts\arial.ttf</code>)</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slatebg-900/60 border border-slate-800">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Troubleshooting Notes
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• <strong>Window closes immediately:</strong> Check that <code className="text-slate-300 font-mono text-[11px]">C:\Windows\Fonts\arial.ttf</code> exists on your drive.</li>
              <li>• <strong>SmartScreen popup:</strong> Click "More info" and "Run anyway" for newly unzipped open-source binaries.</li>
              <li>• <strong>Antivirus false-positive:</strong> Pre-compiled MinGW binaries are clean open-source builds; you can verify hashes or re-compile locally.</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

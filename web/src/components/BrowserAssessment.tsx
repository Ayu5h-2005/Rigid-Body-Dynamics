import React from 'react';
import { Compass, ShieldCheck, AlertCircle, FileCode, Server } from 'lucide-react';

export const BrowserAssessment: React.FC = () => {
  return (
    <section className="py-20 border-b border-slate-800 bg-slatebg-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Architecture Transparency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Browser Playability Assessment (Phase 6)
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            As a scientific research project comparing physical collision algorithms, authenticity is paramount. Here is a technical breakdown of browser feasibility and why the native Windows release is the primary validated target.
          </p>
        </div>

        {/* Detailed Assessment Card */}
        <div className="p-8 rounded-2xl bg-slatebg-900/80 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Native Status */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-semibold block">CURRENT REALITY</span>
              <h3 className="text-xl font-bold text-white">Native C++ Windows Target</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The game executable is compiled to a 64-bit native Windows PE binary using MinGW-w64 UCRT and dynamically linked with SFML 3. It utilizes direct desktop OpenGL contexts and native OS threads.
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300">
                Verified: billiards.exe (486 KB)
              </div>
            </div>

            {/* Column 2: Technical Constraints */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-amber-400 font-semibold block">WASM / EMSCRIPTEN BOTTLENECKS</span>
              <h3 className="text-xl font-bold text-white">Technical Porting Assessment</h3>
              <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>SFML 3 Toolchain:</strong> SFML 3 modernized its windowing and OpenGL abstraction. Mainstream Emscripten ports exist only for legacy SFML 2.x; upstream SFML 3 WebGL support is still in development.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Hardcoded OS Font Path:</strong> <code className="text-slate-300 font-mono">main.cpp:78</code> reads <code className="text-slate-300 font-mono">C:/Windows/Fonts/arial.ttf</code>. In WebAssembly MEMFS, no Windows drive exists without virtual filesystem pre-loading.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Event Loop Refactoring:</strong> The synchronous while loop must be rearchitected for browser microtasks via <code className="text-slate-300 font-mono">emscripten_set_main_loop</code>.</span>
                </li>
              </ul>
            </div>

            {/* Column 3: No Faking Policy */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-cyan-400 font-semibold block">RESEARCH INTEGRITY</span>
              <h3 className="text-xl font-bold text-white">No Faked Web Demonstrations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In strict accordance with project principles: We do not substitute an unverified JavaScript or canvas approximation and falsely claim it matches the C++ engine. The physics and collision algorithms run accurately inside the native Windows release package.
              </p>
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>100% genuine C++ simulation verified.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

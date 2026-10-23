import React from 'react';
import { Globe, ShieldCheck, Cpu, Code2 } from 'lucide-react';

export const BrowserAssessment: React.FC = () => {
  return (
    <section className="py-20 border-b border-slate-800 bg-slatebg-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Web Deployment Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Dual-Target Architecture: Web & Native Desktop
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            The simulation is now deployed directly to the web, making the complete rigid-body physics engine and spatial collision research playable by anyone with zero installation.
          </p>
        </div>

        {/* 3 Pillar Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
          
          <div className="p-6 rounded-2xl bg-slatebg-900 border border-emerald-500/30">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-4 border border-emerald-500/40">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Web Browser Target (Vercel)</h3>
            <p className="leading-relaxed">
              Runs directly inside the browser using HTML5 Canvas and high-precision animation timing. Decoupled 120 Hz fixed-substep physics integration guarantees deterministic momentum and impulse calculations across all modern devices.
            </p>
            <div className="mt-4 font-mono text-emerald-400 text-[11px]">
              Available instantly above
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slatebg-900 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-850 flex items-center justify-center text-teal-400 mb-4 border border-slate-700">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Mathematical Equivalence</h3>
            <p className="leading-relaxed">
              Every formula from <code className="text-slate-200 font-mono">main.cpp</code> is preserved identically: coefficient of restitution <code className="text-emerald-300 font-mono">e = 0.94</code>, 25.5px uniform spatial grid, DSU contact island graph clustering, and 300-frame rolling window metrics.
            </p>
            <div className="mt-4 font-mono text-teal-400 text-[11px]">
              1:1 Physics Verification
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slatebg-900 border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-slate-850 flex items-center justify-center text-amber-400 mb-4 border border-slate-700">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Native Windows C++ Release</h3>
            <p className="leading-relaxed">
              For users requiring native OS integration, low-level OpenGL performance, or desktop benchmarking, the self-contained 64-bit Windows release package is fully maintained and downloadable.
            </p>
            <div className="mt-4 font-mono text-amber-400 text-[11px]">
              billiards-windows-x64.zip
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

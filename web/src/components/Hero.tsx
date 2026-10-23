import React from 'react';
import { Download, Eye } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface HeroProps {
  onDownloadClick: () => void;
  downloadUrl?: string;
  onOpenScreenshot: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onDownloadClick, downloadUrl, onOpenScreenshot }) => {
  const repoUrl = "https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence";

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                SFML 3.0 Native Engine
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                C++17 Rigid Body Dynamics
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-cyan-950/50 text-cyan-300 border border-cyan-800/40">
                Contact Islands (DSU)
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              2D Billiards <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Rigid Body Dynamics
              </span> <br />
              & Spatial Collision Research
            </h1>

            {/* Concise Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              An empirical physics simulation comparing classical all-pairs collision checking against a uniform spatial-grid broadphase. Featuring Newtonian impulse solvers, temporal contact coherence, and connected-component contact island identification.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all text-sm group"
                >
                  <Download className="w-4 h-4 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Windows Release (x64)</span>
                </a>
              ) : (
                <button
                  onClick={onDownloadClick}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all text-sm group"
                >
                  <Download className="w-4 h-4 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Download Windows Release (x64)</span>
                </button>
              )}

              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all text-sm"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source Code</span>
              </a>

              <button
                onClick={onOpenScreenshot}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl font-medium text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>View Running App</span>
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Fixed Timestep</span>
                <span className="font-mono font-semibold text-emerald-400 text-sm">120 Hz (dt = 8.33ms)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Rolling Window</span>
                <span className="font-mono font-semibold text-teal-300 text-sm">300 Active Frames</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Broadphase</span>
                <span className="font-mono font-semibold text-cyan-300 text-sm">25.5px Spatial Grid</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block mb-1">Impulse Restitution</span>
                <span className="font-mono font-semibold text-amber-300 text-sm">e = 0.94 Equal Mass</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Billiards Card & Actual Screenshot Preview */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl p-1 bg-gradient-to-b from-emerald-500/20 via-slate-800/40 to-slate-900/80 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                
                {/* Window Title Bar */}
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="ml-2 font-mono text-slate-300">billiards.exe (Native SFML 3)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono">60 FPS</span>
                </div>

                {/* Actual Screenshot */}
                <div 
                  onClick={onOpenScreenshot}
                  className="relative cursor-pointer overflow-hidden aspect-[1200/760] bg-felt-900 flex items-center justify-center group-hover:opacity-95 transition-opacity"
                >
                  <img
                    src="/game_screenshot.png"
                    alt="2D Billiards SFML 3 Application Window"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="text-xs text-slate-300">
                        <span className="font-semibold text-emerald-400">Genuine Execution:</span> Research mode with contact islands & impulse vectors
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-200 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                        <Eye className="w-3 h-3" /> Expand
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Key Info */}
                <div className="p-4 bg-slate-900/90 text-xs border-t border-slate-800 flex items-center justify-between text-slate-400">
                  <span>Resolution: <strong className="text-slate-200 font-mono">1200 × 760</strong></span>
                  <span>Balls: <strong className="text-slate-200 font-mono">9 (1 Cue + 8 Target)</strong></span>
                  <span>Pockets: <strong className="text-slate-200 font-mono">6 Standard</strong></span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

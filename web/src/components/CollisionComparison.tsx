import React from 'react';
import { GitCompare, CheckCircle2, AlertCircle, ArrowRight, Grid, Minimize2 } from 'lucide-react';

export const CollisionComparison: React.FC = () => {
  return (
    <section id="comparison" className="py-20 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 mb-3">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Algorithm Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Baseline vs. Spatial-Grid Collision Detection
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            In physical simulations, determining which bodies are touching requires spatial testing. The project compares the brute-force baseline approach with an efficient spatial-grid partitioning scheme.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Baseline Card */}
          <div className="p-8 rounded-2xl bg-slatebg-900/80 border border-slate-800 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-600/30">
                  BASELINE ALGORITHM
                </span>
                <span className="text-xs font-mono text-slate-400">O(N²) Complexity</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Exhaustive All-Pairs Checking</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Checks the Euclidean distance between every distinct ball pair on the table unconditionally, regardless of how far apart they are.
              </p>

              {/* Math & Logic Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Mathematical Formula</span>
                  <div className="font-mono text-sm text-amber-300">
                    Pairs Checked = N × (N - 1) / 2
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">9 Active Balls (Standard Billiards)</span>
                  <div className="font-mono text-sm text-slate-200">
                    9 × 8 / 2 = <strong className="text-amber-400">36 distance checks</strong> per sub-step
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Trivial implementation with zero spatial memory overhead</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Fast for tiny N (&lt; 10 balls) where branch prediction dominates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-rose-300">Checks distant balls that have zero probability of touching</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-rose-300">Scales quadratically: 100 balls require 4,950 checks/step</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
              Toggle in game with [B] key
            </div>
          </div>

          {/* Proposed Card */}
          <div className="p-8 rounded-2xl bg-slatebg-900/90 border border-emerald-500/40 relative flex flex-col justify-between shadow-xl shadow-emerald-950/20">
            <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-400 text-slate-950 shadow-md">
              RECOMMENDED / PROPOSED
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  PROPOSED ALGORITHM
                </span>
                <span className="text-xs font-mono text-emerald-400">O(N) Broadphase</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Uniform Spatial Grid Broadphase</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Partitions the 790×570 pool table into uniform square cells. Balls are mapped to coordinates, and tests are restricted exclusively to immediately adjacent cells.
              </p>

              {/* Math & Logic Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/40">
                  <span className="text-xs text-slate-400 block mb-1">Cell Dimension Formula (main.cpp:471)</span>
                  <div className="font-mono text-sm text-emerald-300">
                    cellSize = 2 × R + 1.5 = 25.5 px
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-900/40">
                  <span className="text-xs text-slate-400 block mb-1">Candidate Neighborhood Test (main.cpp:501)</span>
                  <div className="font-mono text-sm text-slate-200">
                    3 × 3 neighborhood (current cell + 8 surrounding neighbors)
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Dramatically prunes candidate pairs when balls are dispersed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Deduplicates cross-cell pairings via <code className="font-mono text-emerald-300">std::unique</code></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Caches temporal contact pairs across frames to prevent tunneling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200">Linear O(N) scaling suitable for high-density particle systems</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-emerald-400/80 font-mono">
              Toggle in game with [B] key
            </div>
          </div>

        </div>

        {/* Conceptual Grid Diagram */}
        <div className="p-6 rounded-2xl bg-slatebg-950 border border-slate-800 text-xs text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <span className="font-mono text-emerald-400 text-xs block mb-1">SPATIAL INDEXING</span>
              <h4 className="text-base font-bold text-white mb-2">How 2D Hashing Operates</h4>
              <p className="leading-relaxed">
                Because balls have radius <code className="text-slate-200 font-mono">R = 12px</code>, two overlapping balls can never be farther than <code className="text-slate-200 font-mono">24px</code> apart. With cell size <code className="text-slate-200 font-mono">25.5px</code>, any potential collision must occur within the same cell or in one of the 8 immediate neighbors.
              </p>
            </div>

            <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
              <div className="text-slate-400">// main.cpp snippet (SFML 3)</div>
              <div><span className="text-teal-400">auto</span> cellFor = [cellSize](sf::Vector2f pos) -&gt; Cell &#123;</div>
              <div className="pl-4">
                <span className="text-teal-400">return</span> &#123; 
                <span className="text-amber-300">static_cast</span>&lt;<span className="text-cyan-300">int</span>&gt;(std::floor(pos.x / cellSize)),
                <span className="text-amber-300">static_cast</span>&lt;<span className="text-cyan-300">int</span>&gt;(std::floor(pos.y / cellSize)) &#125;;
              </div>
              <div>&#125;;</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

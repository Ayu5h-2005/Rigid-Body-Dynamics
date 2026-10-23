import React from 'react';
import { Target, Zap, Network, Layers, GitCompare, Activity } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 mb-3">
            <Target className="w-3.5 h-3.5" />
            <span>Problem Formulation & Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Rigid Body Mechanics in 2D Billiards
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            In physical billiards simulation, multiple spherical bodies interact under instantaneous momentum transfer, elastic cushion reflections, and sustained cluster stacking. This project addresses the core computational bottlenecks of rigid-body simulations.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-slatebg-900/70 border border-slate-800 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Impulse-Based Solver</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Computes equal-mass Newtonian impulses along the contact normal using coefficient of restitution <code className="text-emerald-300 font-mono text-xs">e = 0.94</code>. Applies instantaneous velocity jumps with positional penetration offset correction.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-400">
              J = -(1 + e)(v_rel · n) / 2
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-slatebg-900/70 border border-slate-800 hover:border-teal-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-5 group-hover:scale-110 transition-transform">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Contact Island DSU</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects connected clusters of touching balls using Disjoint Set Union (Union-Find) with path compression. Groups balls into independent physical sub-problems for multi-body resting stability.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-400">
              Cluster threshold: d ≤ 2R + 1.5px
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-slatebg-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Spatial Grid Broadphase</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subdivides table into 25.5px cells (slightly larger than ball diameter 24px). Hashed balls only test collision candidates against their own cell and 8 adjacent neighbors, eliminating distant pair checks.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-400">
              Cell = (⌊x/S⌋, ⌊y/S⌋), S = 2R + 1.5
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-slatebg-900/70 border border-slate-800 hover:border-amber-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Temporal Coherence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Caches active and near-contact ball pairs from frame to frame. Prevents high-speed tunneling across discrete 120 Hz timesteps and accelerates continuous multi-ball resting contacts.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs text-slate-400">
              Persistent contact candidate caching
            </div>
          </div>

        </div>

        {/* Detailed Mechanics Overview */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-slatebg-900/90 to-slatebg-850/90 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Fixed Timestep Accumulator
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The physics engine runs at a dedicated <strong className="text-slate-200">120 Hz</strong> (<code className="text-emerald-300 font-mono text-xs">dt = 1/120s</code>), completely decoupled from the 60 FPS graphics render loop. An accumulator prevents spiral-of-death drops while ensuring deterministic trajectory integration.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                Table Cushion & Pocket Mechanics
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Table dimensions (<strong className="text-slate-200">790 × 570</strong> px at offset 30, 100) are bounded by four elastic cushions with a <code className="text-teal-300 font-mono text-xs">0.94×</code> damping factor. Six circular pockets with 19px capture radius sink balls and halt velocity upon entry.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Empirical Research Window
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                A rolling <strong className="text-slate-200">300-frame averaging window</strong> continuously accumulates collision check counts and physics execution duration in milliseconds. Toggling algorithms with <code className="text-cyan-300 font-mono text-xs">B</code> resets the window to provide unbiased benchmark comparisons.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { MousePointer, ArrowUp, ArrowDown, KeyRound, Play, Pause, RefreshCw, Eye, Sparkles } from 'lucide-react';

export const GameplayControls: React.FC = () => {
  const controls = [
    {
      key: "Left Mouse Click",
      action: "Aim & Shoot",
      category: "Table Interaction",
      desc: "Click anywhere on the table when all balls are stationary. The cue stick aligns from the cue ball towards your cursor and fires with the active shot power.",
      icon: <MousePointer className="w-4 h-4 text-emerald-400" />
    },
    {
      key: "UP / DOWN Arrows",
      action: "Adjust Shot Power",
      category: "Power Control",
      desc: "Increases or decreases shot impulse by 30 units per keypress, clamped between 100 and 800 (default 420). Live power bar on the HUD updates dynamically.",
      icon: <ArrowUp className="w-4 h-4 text-emerald-400" />
    },
    {
      key: "B Key",
      action: "Toggle Collision Algorithm",
      category: "Research Toggle",
      desc: "Toggles between BASELINE (All-Pairs checking) and PROPOSED (Uniform Spatial Grid). Instantly resets the 300-frame rolling measurement window for fair comparison.",
      icon: <KeyRound className="w-4 h-4 text-amber-400" />
    },
    {
      key: "R Key",
      action: "Research Overlay Mode",
      category: "Visualization",
      desc: "Activates mathematical overlays: yellow contact normal arrows, red equal-and-opposite impulse vectors, and colored contact island boundary rings.",
      icon: <Eye className="w-4 h-4 text-cyan-400" />
    },
    {
      key: "P Key",
      action: "Play Mode",
      category: "Game View",
      desc: "Switches to clean recreational play mode, hiding technical vector overlays and island halos while retaining the live dashboard and full physics simulation.",
      icon: <Play className="w-4 h-4 text-teal-400" />
    },
    {
      key: "SPACEBAR",
      action: "Pause / Resume",
      category: "Time Control",
      desc: "Halts the physics accumulator and ball kinematics mid-motion without losing velocities, enabling inspection of frozen contact points and vectors.",
      icon: <Pause className="w-4 h-4 text-slate-300" />
    },
    {
      key: "BACKSPACE",
      action: "Reset Table",
      category: "Scene Control",
      desc: "Clears pockets, resets the cue ball, re-racks all 8 colored target balls in their initial triangular/grid formation, and clears contact caches.",
      icon: <RefreshCw className="w-4 h-4 text-rose-400" />
    },
    {
      key: "ESC Key",
      action: "Exit Game",
      category: "Application",
      desc: "Closes the SFML render window and gracefully terminates the application.",
      icon: <KeyRound className="w-4 h-4 text-slate-400" />
    }
  ];

  return (
    <section id="controls" className="py-20 border-b border-slate-800 bg-slatebg-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive User Interface</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Gameplay & Research Controls
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Every keyboard binding and mouse action mapped in <code className="text-emerald-300 font-mono text-xs">main.cpp</code> is fully documented below. The simulation provides seamless on-the-fly toggling between recreational play and rigorous scientific visualization.
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {controls.map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slatebg-850/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                    {item.category}
                  </span>
                  {item.icon}
                </div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 font-mono text-xs font-bold text-emerald-300 mb-2">
                  {item.key}
                </div>
                <h4 className="text-base font-semibold text-white mb-2">{item.action}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Overlays Legend */}
        <div className="mt-12 p-6 rounded-2xl bg-slatebg-950/80 border border-slate-800">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            Research Mode Visual Overlay Key (from C++ Source)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400">
            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 mt-0.5 shrink-0 shadow-sm shadow-amber-400/50"></span>
              <div>
                <strong className="text-slate-200 block text-sm mb-0.5">Yellow Normal Vector</strong>
                Renders along the line connecting the centers of two colliding spheres, showing collision line of impact and contact point.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 mt-0.5 shrink-0 shadow-sm shadow-rose-500/50"></span>
              <div>
                <strong className="text-slate-200 block text-sm mb-0.5">Red Impulse Vectors (±J)</strong>
                Renders equal-and-opposite impulse force vectors originating from each ball center labeled <code className="font-mono text-[10px] text-rose-300">IMPULSE A</code> and <code className="font-mono text-[10px] text-rose-300">IMPULSE B</code>.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-teal-400 mt-0.5 shrink-0 shadow-sm shadow-teal-400/50"></span>
              <div>
                <strong className="text-slate-200 block text-sm mb-0.5">Colored Contact Rings</strong>
                Visualizes Disjoint Set Union (DSU) connected components. Balls belonging to the same touching cluster share matching halo ring colors.
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Gauge, Activity, ShieldAlert, BarChart3, Clock, CheckCircle } from 'lucide-react';

export const PerformanceMetrics: React.FC = () => {
  const verifiedParameters = [
    {
      label: "Measurement Window",
      value: "300",
      unit: "Active Frames",
      source: "main.cpp:105",
      desc: "Fixed averaging window for both physics ms/frame and collision checks per frame before rolling over."
    },
    {
      label: "Physics Timestep (dt)",
      value: "1 / 120",
      unit: "seconds (120 Hz)",
      source: "main.cpp:191",
      desc: "Fixed sub-stepping interval ensuring numerical stability and prevention of momentum drift."
    },
    {
      label: "Render Framerate",
      value: "60",
      unit: "FPS Capped",
      source: "main.cpp:74",
      desc: "Hardware display sync rate configured via window.setFramerateLimit(60)."
    },
    {
      label: "Coefficient of Restitution",
      value: "0.94",
      unit: "e",
      source: "main.cpp:581",
      desc: "Impulse scaling factor -(1 + e) * v_rel / 2 applied to colliding ball velocities."
    },
    {
      label: "Spatial Cell Size",
      value: "25.5",
      unit: "pixels",
      source: "main.cpp:471",
      desc: "Computed as 2 * R + 1.5, allowing any overlapping pair to be captured in 3x3 neighbor queries."
    },
    {
      label: "Velocity Friction Decay",
      value: "0.997",
      unit: "per step",
      source: "main.cpp:407",
      desc: "Sub-step linear drag attenuation applied to balls moving above the 4.0 px/s cutoff."
    },
    {
      label: "Cushion Damping",
      value: "0.94",
      unit: "multiplier",
      source: "main.cpp:425",
      desc: "Normal velocity attenuation applied whenever a ball bounces off any of the 4 table cushions."
    },
    {
      label: "Pocket Capture Radius",
      value: "19.0",
      unit: "pixels",
      source: "main.cpp:619",
      desc: "Sink distance threshold tested against the 6 pocket centers at corners and side rails."
    }
  ];

  return (
    <section id="performance" className="py-20 border-b border-slate-800 bg-slatebg-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 mb-3">
            <Gauge className="w-3.5 h-3.5" />
            <span>Empirical Measurements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Verified Research Parameters & Metrics
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            All data below is extracted directly from the verified C++ implementation in <code className="text-emerald-300 font-mono text-xs">main.cpp</code>. This project reports strict, uninflated metrics without speculative multipliers.
          </p>
        </div>

        {/* Verified Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {verifiedParameters.map((param, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slatebg-850 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono">{param.source}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tight">
                  {param.value} <span className="text-xs font-normal text-slate-400 font-sans">{param.unit}</span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mt-2 mb-1">{param.label}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{param.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Live HUD Telemetry Explainer */}
        <div className="p-8 rounded-2xl bg-slatebg-950 border border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-emerald-400 font-mono text-xs font-semibold">
            <Activity className="w-4 h-4" />
            <span>LIVE DASHBOARD TELEMETRY IN BILLIARDS.EXE</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">What the Simulation Displays In Real-Time</h3>
          <p className="text-sm text-slate-300 max-w-3xl mb-6">
            The right-side HUD panel in the game window (<code className="text-emerald-300 font-mono text-xs">main.cpp:1000-1090</code>) tracks telemetry per frame and displays rolling averages over 300 active rendered frames:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-slate-200 text-sm block mb-1">Collision Checks Counter</strong>
              <p className="text-slate-400">
                Number of Euclidean distance evaluations performed in the current frame. Baseline begins at 36 checks with 9 active balls; Proposed prunes this based on cell dispersion.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-slate-200 text-sm block mb-1">Active & Cached Contacts</strong>
              <p className="text-slate-400">
                <code className="text-emerald-300 font-mono">Active contacts</code> counts intersecting pairs (<code className="font-mono text-slate-300">&lt; 2R</code>). <code className="text-amber-300 font-mono">Cached contacts</code> counts pairs persisting from previous frame under temporal coherence.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-slate-200 text-sm block mb-1">Contact Islands Count</strong>
              <p className="text-slate-400">
                Identifies disjoint clusters of touching balls using Union-Find. Isolated balls are excluded; only clusters with <code className="text-slate-300 font-mono">≥ 2 balls</code> receive island IDs.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

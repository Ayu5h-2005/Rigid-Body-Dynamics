import React from 'react';
import { Cpu, Code2, Layers, Binary, ShieldCheck } from 'lucide-react';

export const TechStack: React.FC = () => {
  const technologies = [
    {
      name: "C++17 Standard",
      category: "Core Simulation Engine",
      role: "High-performance native physics, deterministic mathematical calculations, and fixed-interval sub-stepping.",
      version: "ISO/IEC 14882:2017"
    },
    {
      name: "SFML 3.0",
      category: "Multimedia & Rendering",
      role: "Next-generation Simple and Fast Multimedia Library providing modern OpenGL context, windowing, and 2D graphics primitives.",
      version: "v3.0.0 (UCRT64)"
    },
    {
      name: "MinGW-w64 UCRT",
      category: "Toolchain & Runtime",
      role: "Modern Universal C Runtime toolchain with GCC 16.2.0 compiling 64-bit native PE32+ Windows binaries.",
      version: "GCC 16.2.0 (MSYS2)"
    },
    {
      name: "CMake & Batch Scripts",
      category: "Build Orchestration",
      role: "Cross-platform CMakeLists.txt and automated packaging scripts for reproducible distribution.",
      version: "CMake 3.20+"
    },
    {
      name: "React 18 & TypeScript",
      category: "Web Distribution",
      role: "Declarative, type-safe web presentation architecture deployed on Vercel edge networks.",
      version: "React 18.3 / TS 5.7"
    },
    {
      name: "Tailwind CSS & Vite 6",
      category: "Design & Bundling",
      role: "Custom billiards-palette design system with lightning-fast Vite ES-module production builds.",
      version: "Vite 6 / Tailwind 3.4"
    }
  ];

  return (
    <section id="stack" className="py-20 border-b border-slate-800 bg-slatebg-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Toolchain</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Verified Technology Stack
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            The project pairs a native C++17 desktop physics engine with a production-ready modern web interface.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slatebg-850 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    {tech.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {tech.version}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tech.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

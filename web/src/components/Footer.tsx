import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  const repoUrl = "https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence";

  return (
    <footer className="py-12 border-t border-slate-800 bg-slatebg-950 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-base">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              2D Billiards Simulation & Research
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              An academic and experimental physics project investigating impulse dynamics, contact island partitioning, and uniform spatial grid acceleration built with C++17 and SFML 3.
            </p>
            <div className="pt-2 text-slate-400 text-[11px]">
              Authored by <strong className="text-slate-300">Ayush Thakare</strong> (PCCOE Pune).
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <span className="font-semibold text-white block text-sm mb-3">Project Navigation</span>
            <ul className="space-y-1.5">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About & Mechanics</a></li>
              <li><a href="#controls" className="hover:text-emerald-400 transition-colors">Controls & Keybindings</a></li>
              <li><a href="#comparison" className="hover:text-emerald-400 transition-colors">Algorithm Comparison</a></li>
              <li><a href="#performance" className="hover:text-emerald-400 transition-colors">Verified Metrics</a></li>
              <li><a href="#install" className="hover:text-emerald-400 transition-colors">Installation Guide</a></li>
            </ul>
          </div>

          {/* Source & Credits */}
          <div className="space-y-2">
            <span className="font-semibold text-white block text-sm mb-3">Repository & Credits</span>
            <ul className="space-y-1.5">
              <li>
                <a 
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.sfml-dev.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>SFML 3.0 Library</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Ayu5h-2005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Ayush Thakare Profile</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Ayush Thakare. Released under open-source research and educational licensing.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with React, TypeScript & Tailwind CSS for Vercel deployment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

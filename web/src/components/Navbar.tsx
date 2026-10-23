import React, { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface NavbarProps {
  onDownloadClick: () => void;
  downloadUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onDownloadClick, downloadUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const repoUrl = "https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence";

  return (
    <header className="sticky top-0 z-50 bg-slatebg-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-felt-800 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50 group-hover:border-emerald-400 transition-colors">
              <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm ring-2 ring-emerald-400/50"></span>
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                2D Billiards <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600/40 text-emerald-300 font-mono">SFML 3</span>
              </div>
              <p className="text-xs text-slate-400 -mt-0.5">Rigid Body Dynamics & Spatial Grid Research</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#game" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Play Game
            </a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#controls" className="hover:text-emerald-400 transition-colors">Controls</a>
            <a href="#comparison" className="hover:text-emerald-400 transition-colors">Algorithm Comparison</a>
            <a href="#performance" className="hover:text-emerald-400 transition-colors">Research & Metrics</a>
            <a href="#install" className="hover:text-emerald-400 transition-colors">Installation</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-900 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                download
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download v1.0</span>
              </a>
            ) : (
              <button
                onClick={onDownloadClick}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md shadow-emerald-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Release</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slatebg-900/95 px-4 pt-2 pb-6 space-y-3">
          <a
            href="#game"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-400 font-bold py-1"
          >
            Play Online Now
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            About Project
          </a>
          <a
            href="#controls"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Gameplay & Controls
          </a>
          <a
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Algorithm Comparison
          </a>
          <a
            href="#performance"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Performance & Metrics
          </a>
          <a
            href="#install"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Installation Guide
          </a>
          <a
            href="#stack"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Tech Stack
          </a>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2 text-sm rounded-lg bg-slate-800 text-slate-200"
            >
              <GithubIcon className="w-4 h-4" /> View Source on GitHub
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadClick();
              }}
              className="flex items-center justify-center gap-2 py-2 text-sm rounded-lg font-semibold bg-emerald-400 text-slate-950"
            >
              <Download className="w-4 h-4" /> Download Windows Release
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

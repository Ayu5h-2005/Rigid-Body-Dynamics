import React, { useState } from 'react';
import { X, Download, Terminal, Copy, Check, ExternalLink, Info } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl?: string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, downloadUrl }) => {
  const [copied, setCopied] = useState(false);
  const repoReleasesUrl = "https://github.com/Ayu5h-2005/Rigid-body-dynamics-impulse-based-solvers-contact-island-identification-and-temporal-coherence/releases";
  const buildCommand = "powershell -ExecutionPolicy Bypass -File .\\package_release.ps1";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(buildCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-slatebg-900 border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Download Game Release</h3>
            <p className="text-xs text-slate-400">Windows 10 / 11 64-bit (x64) Portable Build</p>
          </div>
        </div>

        {/* Notice on VITE_GAME_DOWNLOAD_URL */}
        {downloadUrl ? (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">Direct Download Available</strong>
              Configured via <code className="font-mono text-emerald-200">VITE_GAME_DOWNLOAD_URL</code>.
              <div className="mt-3">
                <a
                  href={downloadUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-emerald-400 text-slate-950 hover:bg-emerald-300 transition-colors"
                >
                  <Download className="w-4 h-4" /> Start Direct Download
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">Release Distribution Link Pending</strong>
              The environment variable <code className="font-mono text-amber-300">VITE_GAME_DOWNLOAD_URL</code> has not yet been set to a hosted release asset URL. You can download directly from GitHub Releases or build the package locally.
            </div>
          </div>
        )}

        {/* Option 1: GitHub Releases */}
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-slate-300" />
                Option 1: Official GitHub Releases
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Recommended</span>
            </div>
            <p className="text-slate-400 mb-3">
              Check the repository's Releases tab for pre-built <code className="text-slate-300 font-mono">billiards-windows-x64.zip</code> binaries uploaded by the repository owner.
            </p>
            <a
              href={repoReleasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <span>Open GitHub Releases</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Option 2: Local Packaging Script */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                Option 2: Generate Release Package Locally
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Local Build</span>
            </div>
            <p className="text-slate-400 mb-3">
              If you have cloned the repository, execute the packaging script in PowerShell to generate <code className="text-slate-300 font-mono">release/billiards-windows-x64.zip</code> bundled with all 18 DLLs:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-teal-300">
              <span className="truncate mr-2">{buildCommand}</span>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0"
                title="Copy command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer info for Repo Owners */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>For Repository Owners: Set <code className="font-mono text-slate-400">VITE_GAME_DOWNLOAD_URL</code> in Vercel settings.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded text-slate-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};

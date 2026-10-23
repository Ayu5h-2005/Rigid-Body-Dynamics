import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BilliardsGame } from './components/BilliardsGame';
import { AboutSection } from './components/AboutSection';
import { GameplayControls } from './components/GameplayControls';
import { CollisionComparison } from './components/CollisionComparison';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { InstallationGuide } from './components/InstallationGuide';
import { TechStack } from './components/TechStack';
import { BrowserAssessment } from './components/BrowserAssessment';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { ScreenshotModal } from './components/ScreenshotModal';

export const App: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [screenshotModalOpen, setScreenshotModalOpen] = useState(false);

  // Environment variable for download URL
  const downloadUrl = import.meta.env.VITE_GAME_DOWNLOAD_URL || undefined;

  const handleDownloadClick = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    } else {
      setDownloadModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slatebg-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Navigation */}
      <Navbar 
        onDownloadClick={handleDownloadClick} 
        downloadUrl={downloadUrl} 
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onDownloadClick={handleDownloadClick} 
          downloadUrl={downloadUrl}
          onOpenScreenshot={() => setScreenshotModalOpen(true)}
        />

        {/* Playable Game Section (Direct in Browser) */}
        <section id="game" className="py-8 bg-slatebg-950 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Direct Web Execution Active
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Play 2D Billiards in Your Browser
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-1">
                Aim with your mouse or finger, click to shoot, and toggle between Baseline and Spatial-Grid algorithms live.
              </p>
            </div>

            <BilliardsGame />
          </div>
        </section>

        {/* About Physics Mechanics */}
        <AboutSection />

        {/* Detailed Controls */}
        <GameplayControls />

        {/* Baseline vs Spatial Grid Comparison */}
        <CollisionComparison />

        {/* Verified Research Metrics */}
        <PerformanceMetrics />

        {/* Standalone Windows Release & Developer Guide */}
        <InstallationGuide 
          onDownloadClick={handleDownloadClick}
          downloadUrl={downloadUrl}
        />

        {/* Technology Stack */}
        <TechStack />

        {/* Technical Architecture Assessment */}
        <BrowserAssessment />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <DownloadModal 
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        downloadUrl={downloadUrl}
      />

      <ScreenshotModal 
        isOpen={screenshotModalOpen}
        onClose={() => setScreenshotModalOpen(false)}
      />
    </div>
  );
};

export default App;

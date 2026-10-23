import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
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
        <Hero 
          onDownloadClick={handleDownloadClick} 
          downloadUrl={downloadUrl}
          onOpenScreenshot={() => setScreenshotModalOpen(true)}
        />

        <AboutSection />

        <GameplayControls />

        <CollisionComparison />

        <PerformanceMetrics />

        <InstallationGuide 
          onDownloadClick={handleDownloadClick}
          downloadUrl={downloadUrl}
        />

        <TechStack />

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

// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CreateMystery from './components/CreateMystery';
import InvestigationRoom from './components/InvestigationRoom';
import EvidenceModal from './components/EvidenceModal';
import DebriefModal from './components/DebriefModal';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'create' | 'investigate'
  const [activeMystery, setActiveMystery] = useState(null);
  const [recentMysteries, setRecentMysteries] = useState([]);
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [debriefData, setDebriefData] = useState(null);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [presetData, setPresetData] = useState(null);

  // Fetch recent cases on initial mount
  useEffect(() => {
    loadRecentCases();
  }, []);

  const loadRecentCases = async () => {
    try {
      const list = await api.listMysteries();
      if (Array.isArray(list)) {
        setRecentMysteries(list);
      }
    } catch (err) {
      console.warn('Could not load recent mysteries:', err.message);
    }
  };

  const handleStartNew = () => {
    setPresetData(null);
    setErrorMessage('');
    setView('create');
  };

  const handleSelectPreset = (preset) => {
    setPresetData(preset);
    setErrorMessage('');
    setView('create');
  };

  const handleGenerateMystery = async ({ scenario, category, difficulty }) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const generated = await api.generateMystery({ scenario, category, difficulty });
      setActiveMystery(generated);
      setHasSubmitted(false);
      setDebriefData(null);
      setIsDebriefOpen(false);
      setView('investigate');
      loadRecentCases();
    } catch (err) {
      console.error('Failed to generate mystery:', err);
      setErrorMessage(err.message || 'Failed to generate investigation with Gemini. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMystery = async (id) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const mystery = await api.getMystery(id);
      setActiveMystery(mystery);
      setHasSubmitted(false);
      setDebriefData(null);
      setIsDebriefOpen(false);
      setView('investigate');
    } catch (err) {
      setErrorMessage('Failed to open case dossier: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAccusation = async (selectedSuspectId) => {
    if (!activeMystery?._id) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const evaluation = await api.submitAnswer(activeMystery._id, selectedSuspectId);
      setDebriefData(evaluation);
      setHasSubmitted(true);
      setIsDebriefOpen(true);
    } catch (err) {
      setErrorMessage('Failed to submit accusation: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = () => {
    setIsDebriefOpen(false);
    setDebriefData(null);
    setActiveMystery(null);
    setHasSubmitted(false);
    setView('create');
  };

  return (
    <div className="app-container">
      <Navbar
        currentView={view}
        onNavigate={(newView) => {
          setErrorMessage('');
          setView(newView);
        }}
        activeMystery={activeMystery}
      />

      {errorMessage && (
        <div className="global-error-banner">
          <span className="error-icon">⚠️</span>
          <span>{errorMessage}</span>
          <button className="error-close" onClick={() => setErrorMessage('')}>
            ✕
          </button>
        </div>
      )}

      <main className="main-content">
        {view === 'home' && (
          <Home
            onStartNew={handleStartNew}
            onSelectPreset={handleSelectPreset}
            recentMysteries={recentMysteries}
            onSelectMystery={handleSelectMystery}
          />
        )}

        {view === 'create' && (
          <CreateMystery
            onSubmit={handleGenerateMystery}
            initialScenario={presetData?.prompt || ''}
            initialCategory={presetData?.category || 'murder'}
            initialDifficulty={presetData?.difficulty || 'medium'}
            isLoading={isLoading}
          />
        )}

        {view === 'investigate' && (
          <InvestigationRoom
            mystery={activeMystery}
            onSelectEvidence={(evidence) => setActiveEvidence(evidence)}
            onSubmitAccusation={handleSubmitAccusation}
            isSubmitting={isSubmitting}
            hasSubmitted={hasSubmitted}
            onViewDebrief={() => setIsDebriefOpen(true)}
          />
        )}
      </main>

      {/* Evidence Inspection Modal */}
      {activeEvidence && (
        <EvidenceModal
          evidence={activeEvidence}
          suspects={activeMystery?.suspects || []}
          onClose={() => setActiveEvidence(null)}
        />
      )}

      {/* Case Debrief & Solution Modal */}
      {isDebriefOpen && (
        <DebriefModal
          result={debriefData}
          mystery={activeMystery}
          onPlayAgain={handlePlayAgain}
          onClose={() => setIsDebriefOpen(false)}
        />
      )}
    </div>
  );
}

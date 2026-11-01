// client/src/components/CreateMystery.jsx
import React, { useState } from 'react';

const CATEGORIES = [
  { id: 'murder', label: 'Murder Mystery', icon: '🩸', desc: 'A fatal crime with motives and alibis' },
  { id: 'theft', label: 'Heist & Theft', icon: '💎', desc: 'Stolen artifacts, vault breaks, or breaches' },
  { id: 'missing', label: 'Missing Person', icon: '🕵️', desc: 'A sudden disappearance with hidden traces' },
  { id: 'suspicious', label: 'Suspicious Incident', icon: '⚠️', desc: 'Sabotage, espionage, or blackmail' },
  { id: 'general', label: 'General Mystery', icon: '📜', desc: 'Puzzles, ancient relics, and secret societies' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Rookie (Easy)', desc: 'Obvious alibi conflicts & direct evidence trails' },
  { id: 'medium', label: 'Detective (Medium)', desc: 'Balanced clues with clever red herrings' },
  { id: 'hard', label: 'Master (Hard)', desc: 'Subtle contradictions requiring forensic analysis' },
];

const RANDOM_PROMPTS = [
  'A billionaire art collector is found locked inside his soundproof basement vault with no oxygen. The digital keypad was wiped, and four guests were staying at the estate.',
  'During a lunar eclipse, an antique ruby necklace was replaced with a glass replica in the museum exhibit hall while the laser grid experienced a 30-second glitch.',
  'A luxury sleeper train arrives at the station with the locomotive engineer missing and the emergency brakes disabled from inside the private VIP carriage.',
  'A renowned chef collapses in his three-star kitchen after tasting the special broth. Only three culinary assistants had access to the spice cabinet that evening.',
];

export default function CreateMystery({ onSubmit, initialScenario = '', initialCategory = 'murder', initialDifficulty = 'medium', isLoading }) {
  const [scenario, setScenario] = useState(initialScenario);
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [validationError, setValidationError] = useState('');

  const handleRandomPrompt = () => {
    const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setScenario(random);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!scenario.trim() || scenario.trim().length < 10) {
      setValidationError('Please provide a scenario description of at least 10 characters.');
      return;
    }
    setValidationError('');
    onSubmit({ scenario: scenario.trim(), category, difficulty });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="radar-spinner"></div>
        <h2 className="loading-title">COMMISSIONING CASE DOSSIER...</h2>
        <div className="loading-steps">
          <p className="loading-step active">⚡ Google Gemini AI is synthesizing the crime scene...</p>
          <p className="loading-step">👥 Generating suspects, motives, and contradictory alibis...</p>
          <p className="loading-step">💬 Fabricating WhatsApp logs & CCTV surveillance stills...</p>
          <p className="loading-step">🔒 Encrypting & securing the culprit in server vault...</p>
        </div>
        <p className="loading-note">This usually takes about 5 to 10 seconds. Preparing evidence locker...</p>
      </div>
    );
  }

  return (
    <div className="create-mystery-container">
      <div className="form-card">
        <div className="form-header">
          <span className="case-badge">CASE GENERATION PROTOCOL</span>
          <h2>Create New Investigation</h2>
          <p>Describe your crime scenario or let our AI generate a unique case file from your imagination.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Scenario Input */}
          <div className="form-group">
            <div className="label-row">
              <label htmlFor="scenario-input">Incident Scenario / Premise</label>
              <button type="button" className="btn-text-action" onClick={handleRandomPrompt}>
                🎲 Roll Random Premise
              </button>
            </div>
            <textarea
              id="scenario-input"
              className="scenario-textarea"
              rows="5"
              placeholder="e.g. A wealthy wine maker is found dead in his cellar on the night of the harvest festival. Three family members had keys to the cellar door..."
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value);
                if (validationError) setValidationError('');
              }}
            />
            <div className="char-count">{scenario.length} / 2000 characters (min. 10)</div>
            {validationError && <div className="form-error">{validationError}</div>}
          </div>

          {/* Category Selector */}
          <div className="form-group">
            <label>Case Category</label>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  className={`category-pill ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <div className="cat-details">
                    <span className="cat-label">{cat.label}</span>
                    <span className="cat-desc">{cat.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="form-group">
            <label>Investigation Difficulty</label>
            <div className="difficulty-grid">
              {DIFFICULTIES.map((diff) => (
                <button
                  type="button"
                  key={diff.id}
                  className={`diff-pill ${difficulty === diff.id ? 'active' : ''}`}
                  onClick={() => setDifficulty(diff.id)}
                >
                  <span className="diff-label">{diff.label}</span>
                  <span className="diff-desc">{diff.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit-case">
              <span>🚀 GENERATE INVESTIGATION</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


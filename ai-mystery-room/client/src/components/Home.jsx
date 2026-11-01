// client/src/components/Home.jsx
import React from 'react';

const PRESET_SCENARIOS = [
  {
    title: 'The Blackwood Vault Heist',
    category: 'theft',
    difficulty: 'medium',
    prompt:
      'A priceless 50-carat blue diamond vanishes from the underground vault of Lord Blackwood during his midnight gala. Only three trusted associates possessed the biometric override codes.',
    badge: '💎 High-Stakes Heist',
  },
  {
    title: 'Poison at the Tech Summit',
    category: 'murder',
    difficulty: 'hard',
    prompt:
      'The CEO of an AI quantum startup collapses during his keynote address after sipping from a sealed water flask. The chief scientist, lead investor, and co-founder all stood near the podium backstage.',
    badge: '🩸 Murder Mystery',
  },
  {
    title: 'The Vanishing Cryptographer',
    category: 'missing',
    difficulty: 'medium',
    prompt:
      'A top defense cryptographer disappears from a high-security submarine bunker without a trace. Her terminal was left logged into an encrypted channel, and strange WhatsApp chats were discovered.',
    badge: '🕵️ Missing Person',
  },
];

export default function Home({ onStartNew, onSelectPreset, recentMysteries, onSelectMystery }) {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="tape-banner">CRIME SCENE INVESTIGATION // AUTHORIZED AGENTS ONLY</div>
        <h1 className="hero-title">
          BECOME THE <span className="highlight">DETECTIVE</span>.
          <br />
          SOLVE AI-GENERATED CRIMES.
        </h1>
        <p className="hero-subtitle">
          Feed any prompt or premise to Google Gemini. The AI constructs an internally consistent, logically airtight
          investigation with real suspects, fake WhatsApp conversations, time-stamped CCTV logs, and a single locked
          culprit. Can you crack the case?
        </p>

        <div className="hero-actions">
          <button className="btn-cta" onClick={onStartNew}>
            <span>⚡ CREATE CUSTOM CASE</span>
          </button>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works-section">
        <h2 className="section-title">THE INVESTIGATIVE PROCESS</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Craft the Scenario</h3>
            <p>Provide a short creative prompt or pick a preset. Choose your category and difficulty level.</p>
          </div>
          <div className="step-card">
            <div className="step-number">02</div>
            <h3>AI Builds the Case</h3>
            <p>Gemini engineers the crime scene, suspects, alibis, timelines, and pre-locks the true culprit.</p>
          </div>
          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Examine Evidence</h3>
            <p>Inspect WhatsApp threads, CCTV footage stills, witness statements, and spot contradictory alibis.</p>
          </div>
          <div className="step-card">
            <div className="step-number">04</div>
            <h3>Lock in Accusation</h3>
            <p>Accuse the suspect. The backend reveals whether you cracked the case or fell for a red herring.</p>
          </div>
        </div>
      </section>

      {/* Quick Play Presets */}
      <section className="presets-section">
        <h2 className="section-title">QUICK PLAY DOSSIERS</h2>
        <p className="section-desc">Launch into an investigation immediately using these ready-made case prompts:</p>
        <div className="presets-grid">
          {PRESET_SCENARIOS.map((preset, idx) => (
            <div key={idx} className="preset-card">
              <div className="preset-badge">{preset.badge}</div>
              <h3 className="preset-title">{preset.title}</h3>
              <p className="preset-prompt">"{preset.prompt}"</p>
              <div className="preset-footer">
                <span className="preset-difficulty">Difficulty: {preset.difficulty.toUpperCase()}</span>
                <button
                  className="btn-preset-play"
                  onClick={() => onSelectPreset(preset)}
                >
                  Investigate →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Cases */}
      {recentMysteries && recentMysteries.length > 0 && (
        <section className="recent-cases-section">
          <h2 className="section-title">ARCHIVED CASE FILES</h2>
          <div className="recent-cases-grid">
            {recentMysteries.map((m) => (
              <div key={m._id} className="case-file-card" onClick={() => onSelectMystery(m._id)}>
                <div className="case-file-header">
                  <span className="case-category">{m.category.toUpperCase()}</span>
                  <span className="case-difficulty">{m.difficulty.toUpperCase()}</span>
                </div>
                <h4 className="case-title">{m.title}</h4>
                <p className="case-incident">{m.incident?.description?.slice(0, 110)}...</p>
                <div className="case-meta">
                  <span>👥 {m.suspects?.length || 0} Suspects</span>
                  <span>🔍 {m.evidence?.length || 0} Clues</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


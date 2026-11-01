// client/src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ currentView, onNavigate, activeMystery }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => onNavigate('home')}>
          <div className="brand-badge">
            <span className="badge-icon">🕵️‍♂️</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">AI MYSTERY ROOM</span>
            <span className="brand-subtitle">FORENSIC INVESTIGATION HQ</span>
          </div>
        </div>

        <nav className="nav-actions">
          {activeMystery && (
            <button
              className={`nav-btn ${currentView === 'investigate' ? 'active' : ''}`}
              onClick={() => onNavigate('investigate')}
            >
              <span className="icon">📂</span>
              <span className="label">Current Case: {activeMystery.title.slice(0, 20)}...</span>
            </button>
          )}

          <button
            className={`nav-btn btn-primary ${currentView === 'create' ? 'active' : ''}`}
            onClick={() => onNavigate('create')}
          >
            <span className="icon">➕</span>
            <span className="label">New Case</span>
          </button>
        </nav>
      </div>
    </header>
  );
}


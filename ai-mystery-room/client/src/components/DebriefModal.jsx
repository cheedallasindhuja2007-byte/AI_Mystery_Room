// client/src/components/DebriefModal.jsx
import React from 'react';

export default function DebriefModal({ result, mystery, onPlayAgain, onClose }) {
  if (!result) return null;

  const {
    isCorrect,
    selectedSuspectName,
    actualCulpritName,
    actualCulpritRole,
    motive,
    explanation,
    keyEvidenceIds = [],
    misleadingClues = [],
  } = result;

  // Find key evidence objects to display titles
  const keyEvidences = (mystery?.evidence || []).filter((e) => keyEvidenceIds.includes(e.id));

  return (
    <div className="modal-backdrop">
      <div className="modal-content debrief-modal" onClick={(e) => e.stopPropagation()}>
        {/* Banner */}
        <div className={`debrief-banner ${isCorrect ? 'banner-success' : 'banner-failure'}`}>
          <div className="banner-icon">{isCorrect ? '🏆' : '⚠️'}</div>
          <div className="banner-text">
            <h2>{isCorrect ? 'CASE SOLVED! GUILTY VERDICT' : 'CASE UNSOLVED! WRONG ACCUSATION'}</h2>
            <p>
              {isCorrect
                ? 'Your sharp deductions correctly pierced through the lies and uncovered the true perpetrator!'
                : `You accused ${selectedSuspectName}, but they were innocent! The actual culprit was ${actualCulpritName}.`}
            </p>
          </div>
        </div>

        <div className="debrief-body">
          {/* Culprit Dossier */}
          <div className="culprit-card">
            <h3>PERPETRATOR FILE</h3>
            <div className="culprit-info">
              <span className="culprit-avatar">👤</span>
              <div>
                <h4>
                  {actualCulpritName} {actualCulpritRole && `— ${actualCulpritRole}`}
                </h4>
                <p className="culprit-motive">
                  <strong>True Motive:</strong> {motive}
                </p>
              </div>
            </div>
          </div>

          {/* The Smoking Gun */}
          {keyEvidences.length > 0 && (
            <div className="debrief-section">
              <h3>🔑 THE SMOKING GUN (CRITICAL CLUES)</h3>
              <p className="debrief-sub">These clues directly connected the culprit to the crime:</p>
              <div className="key-evidence-list">
                {keyEvidences.map((e) => (
                  <div key={e.id} className="key-evidence-item">
                    <span className="key-icon">⚡</span>
                    <div>
                      <strong>{e.title}</strong>
                      <p>{e.description || e.relevance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Herrings Explained */}
          {misleadingClues && misleadingClues.length > 0 && (
            <div className="debrief-section">
              <h3>🎭 RED HERRINGS UNMASKED</h3>
              <p className="debrief-sub">Why innocent suspects appeared guilty:</p>
              <ul className="misleading-list">
                {misleadingClues.map((clue, idx) => (
                  <li key={idx}>"{clue}"</li>
                ))}
              </ul>
            </div>
          )}

          {/* Complete Case Revelation */}
          {explanation && (
            <div className="debrief-section narrative-section">
              <h3>📖 FULL CRIME NARRATIVE</h3>
              <div className="narrative-box">
                <p>{explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="debrief-footer">
          <button className="btn-secondary" onClick={onClose}>
            Review Case Board
          </button>
          <button className="btn-primary" onClick={onPlayAgain}>
            ⚡ Investigate Another Mystery
          </button>
        </div>
      </div>
    </div>
  );
}


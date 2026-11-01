// client/src/components/InvestigationRoom.jsx
import React, { useState } from 'react';

export default function InvestigationRoom({
  mystery,
  onSelectEvidence,
  onSubmitAccusation,
  isSubmitting,
  hasSubmitted,
  onViewDebrief,
}) {
  const [activeTab, setActiveTab] = useState('suspects');
  const [evidenceFilter, setEvidenceFilter] = useState('all');
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [confirmAccusationModal, setConfirmAccusationModal] = useState(false);

  if (!mystery) {
    return (
      <div className="room-empty">
        <h2>No case dossier currently active.</h2>
        <p>Please select or generate a mystery to begin investigating.</p>
      </div>
    );
  }

  const { title, category, difficulty, incident, suspects = [], timeline = [], evidence = [] } = mystery;

  // Filter evidence
  const filteredEvidence =
    evidenceFilter === 'all'
      ? evidence
      : evidence.filter((e) => e.type?.toLowerCase() === evidenceFilter.toLowerCase());

  const selectedSuspect = suspects.find((s) => s.id === selectedSuspectId);

  const handleConfirmSubmit = () => {
    if (!selectedSuspectId) return;
    setConfirmAccusationModal(false);
    onSubmitAccusation(selectedSuspectId);
  };

  return (
    <div className="investigation-room">
      {/* Case Header Dossier */}
      <section className="case-header-card">
        <div className="case-header-top">
          <div className="badges-row">
            <span className="badge category-badge">📁 {category?.toUpperCase() || 'GENERAL'}</span>
            <span className="badge difficulty-badge">🎯 DIFFICULTY: {difficulty?.toUpperCase() || 'MEDIUM'}</span>
            {hasSubmitted && <span className="badge solved-badge">⚖️ CASE CLOSED</span>}
          </div>
          {hasSubmitted && (
            <button className="btn-view-results" onClick={onViewDebrief}>
              📋 View Case Debrief & Solution
            </button>
          )}
        </div>

        <h1 className="case-main-title">{title}</h1>

        <div className="incident-grid">
          <div className="incident-box">
            <div className="incident-meta">
              <span>📍 Location: <strong>{incident?.location || 'Unspecified'}</strong></span>
              <span>🕒 Date & Time: <strong>{incident?.dateTime || 'Recent'}</strong></span>
            </div>
            <p className="incident-desc">{incident?.description}</p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="room-tabs">
        <button
          className={`tab-btn ${activeTab === 'suspects' ? 'active' : ''}`}
          onClick={() => setActiveTab('suspects')}
        >
          <span>👥 Suspects ({suspects.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          <span>🔍 Evidence Locker ({evidence.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <span>⏱️ Timeline ({timeline.length})</span>
        </button>
        <button
          className={`tab-btn tab-accusation ${activeTab === 'accusation' ? 'active' : ''}`}
          onClick={() => setActiveTab('accusation')}
        >
          <span>⚖️ Accuse Culprit</span>
        </button>
      </div>

      {/* TAB 1: SUSPECTS */}
      {activeTab === 'suspects' && (
        <section className="tab-pane suspects-pane">
          <div className="pane-header">
            <h2>Person of Interest Dossiers</h2>
            <p>Every suspect has a motive and an alibi. Compare their statements against the verified timeline.</p>
          </div>

          <div className="suspects-grid">
            {suspects.map((suspect) => {
              const isSelected = selectedSuspectId === suspect.id;
              return (
                <div
                  key={suspect.id}
                  className={`suspect-card ${isSelected ? 'selected-suspect' : ''}`}
                >
                  <div className="suspect-card-header">
                    <div className="suspect-avatar">👤</div>
                    <div className="suspect-identity">
                      <h3>{suspect.name}</h3>
                      <span className="suspect-occupation">
                        {suspect.occupation} {suspect.age && `• Age ${suspect.age}`}
                      </span>
                    </div>
                  </div>

                  <div className="suspect-card-body">
                    <div className="suspect-field">
                      <strong>Background:</strong>
                      <p>{suspect.background}</p>
                    </div>

                    <div className="suspect-field alibi-field">
                      <strong>Claimed Alibi:</strong>
                      <p>"{suspect.alibi}"</p>
                    </div>

                    <div className="suspect-field motive-field">
                      <strong>Potential Motive:</strong>
                      <p>{suspect.motive}</p>
                    </div>

                    {suspect.personality && (
                      <div className="suspect-field">
                        <strong>Demeanor:</strong>
                        <p>{suspect.personality}</p>
                      </div>
                    )}
                  </div>

                  <div className="suspect-card-actions">
                    <button
                      className={`btn-accuse-select ${isSelected ? 'selected' : ''}`}
                      disabled={hasSubmitted}
                      onClick={() => {
                        setSelectedSuspectId(suspect.id);
                        setActiveTab('accusation');
                      }}
                    >
                      {hasSubmitted
                        ? 'Case Concluded'
                        : isSelected
                        ? '✓ Suspect Selected'
                        : 'Accuse This Person'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: EVIDENCE LOCKER */}
      {activeTab === 'evidence' && (
        <section className="tab-pane evidence-pane">
          <div className="pane-header">
            <h2>Forensic Evidence Locker</h2>
            <p>Click on any evidence file to inspect chats, surveillance frames, photos, and police logs.</p>
          </div>

          {/* Evidence Filter Tabs */}
          <div className="evidence-filter-bar">
            {['all', 'chat', 'cctv', 'image', 'document', 'statement'].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${evidenceFilter === filter ? 'active' : ''}`}
                onClick={() => setEvidenceFilter(filter)}
              >
                {filter === 'all' && 'All Evidence'}
                {filter === 'chat' && '💬 WhatsApp Chats'}
                {filter === 'cctv' && '📹 CCTV Feeds'}
                {filter === 'image' && '📸 Photos'}
                {filter === 'document' && '📑 Documents'}
                {filter === 'statement' && '⚖️ Statements'}
              </button>
            ))}
          </div>

          <div className="evidence-grid">
            {filteredEvidence.map((clue) => {
              const clueSuspects = suspects.filter((s) => (clue.relatedSuspectIds || []).includes(s.id));
              return (
                <div
                  key={clue.id}
                  className={`clue-card clue-${clue.type}`}
                  onClick={() => onSelectEvidence(clue)}
                >
                  <div className="clue-card-badge">
                    <span>
                      {clue.type === 'chat' && '💬 CHAT'}
                      {clue.type === 'cctv' && '📹 CCTV'}
                      {clue.type === 'image' && '📸 PHOTO'}
                      {clue.type === 'document' && '📑 DOC'}
                      {clue.type === 'statement' && '⚖️ TESTIMONY'}
                    </span>
                    {clue.timestamp && <span className="clue-time">{clue.timestamp}</span>}
                  </div>

                  <h3 className="clue-title">{clue.title}</h3>
                  <p className="clue-description">{clue.description?.slice(0, 110)}...</p>

                  {clueSuspects.length > 0 && (
                    <div className="clue-mentions">
                      {clueSuspects.map((s) => (
                        <span key={s.id} className="mention-tag">
                          @{s.name.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="clue-action-hint">Click to Inspect File →</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 3: CRIME TIMELINE */}
      {activeTab === 'timeline' && (
        <section className="tab-pane timeline-pane">
          <div className="pane-header">
            <h2>Chronological Crime Timeline</h2>
            <p>Verified series of events surrounding the incident. Cross-check alibis against these timestamps.</p>
          </div>

          <div className="timeline-tracker">
            {timeline.map((entry, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                </div>
                <div className="timeline-content">
                  <span className="timeline-time">{entry.time || `Event #${idx + 1}`}</span>
                  <p className="timeline-event-text">{entry.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: ACCUSATION HUB */}
      {activeTab === 'accusation' && (
        <section className="tab-pane accusation-pane">
          <div className="pane-header">
            <h2>The Grand Accusation</h2>
            <p>
              Review all clues carefully before submitting. Once filed, your choice is evaluated by the server and
              cannot be undone!
            </p>
          </div>

          {hasSubmitted ? (
            <div className="already-submitted-card">
              <h3>Investigation Concluded</h3>
              <p>Your accusation has already been filed and evaluated.</p>
              <button className="btn-primary" onClick={onViewDebrief}>
                View Full Debrief & Motive
              </button>
            </div>
          ) : (
            <div className="accusation-box">
              <label>Select the Suspect You Are Charging with the Crime:</label>

              <div className="suspect-selection-grid">
                {suspects.map((s) => (
                  <div
                    key={s.id}
                    className={`suspect-select-card ${selectedSuspectId === s.id ? 'active' : ''}`}
                    onClick={() => setSelectedSuspectId(s.id)}
                  >
                    <div className="radio-circle">
                      {selectedSuspectId === s.id && <div className="inner-dot"></div>}
                    </div>
                    <div className="suspect-select-info">
                      <h4>{s.name}</h4>
                      <span>{s.occupation}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSuspect && (
                <div className="accusation-summary-box">
                  <h3>Accusation Summary</h3>
                  <p>
                    You are formally charging <strong>{selectedSuspect.name}</strong> ({selectedSuspect.occupation})
                    with the crime.
                  </p>
                  <p className="alibi-reminder">
                    Their Claimed Alibi: <em>"{selectedSuspect.alibi}"</em>
                  </p>
                </div>
              )}

              <div className="accusation-actions">
                <button
                  className="btn-submit-charge"
                  disabled={!selectedSuspectId || isSubmitting}
                  onClick={() => setConfirmAccusationModal(true)}
                >
                  {isSubmitting ? 'Evaluating Case...' : '⚡ FILE FORMAL ACCUSATION'}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Confirmation Modal before final submission */}
      {confirmAccusationModal && (
        <div className="modal-backdrop">
          <div className="modal-content confirmation-modal">
            <h2>⚠️ Confirm Formal Accusation</h2>
            <p>
              Are you sure you want to accuse <strong>{selectedSuspect?.name}</strong>?
            </p>
            <p className="confirm-warning">
              This action is permanent. The server will evaluate your deduction against the pre-locked truth.
            </p>
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmAccusationModal(false)}
              >
                Continue Investigating
              </button>
              <button className="btn-danger" onClick={handleConfirmSubmit}>
                Yes, Lock In Accusation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


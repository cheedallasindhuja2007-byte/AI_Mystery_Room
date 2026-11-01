// client/src/components/EvidenceModal.jsx
import React from 'react';

export default function EvidenceModal({ evidence, suspects = [], onClose }) {
  if (!evidence) return null;

  const relatedSuspects = suspects.filter((s) => (evidence.relatedSuspectIds || []).includes(s.id));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content evidence-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="evidence-type-tag">
            <span className="type-icon">
              {evidence.type === 'chat' && '💬 WHATSAPP CHAT LOG'}
              {evidence.type === 'cctv' && '📹 CCTV SURVEILLANCE FEED'}
              {evidence.type === 'image' && '📸 CRIME SCENE PHOTOGRAPH'}
              {evidence.type === 'document' && '📑 OFFICIAL RECORD / LOG'}
              {evidence.type === 'statement' && '⚖️ SWORN TESTIMONY'}
            </span>
          </div>
          <button className="btn-close-modal" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <h2 className="evidence-modal-title">{evidence.title}</h2>
          <p className="evidence-modal-desc">{evidence.description}</p>

          {/* Render based on evidence type */}
          {evidence.type === 'chat' && (
            <div className="chat-window">
              <div className="chat-header">
                <span className="chat-avatar">📱</span>
                <div className="chat-title-info">
                  <strong>Encrypted Message Transcript</strong>
                  <span className="chat-status">Decrypted via Forensic Subpoena</span>
                </div>
              </div>
              <div className="chat-messages">
                {evidence.content?.messages && evidence.content.messages.length > 0 ? (
                  evidence.content.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`chat-bubble ${i % 2 === 0 ? 'bubble-in' : 'bubble-out'}`}
                    >
                      <div className="msg-sender">{msg.sender}</div>
                      <div className="msg-text">{msg.message}</div>
                      <div className="msg-time">{msg.time}</div>
                    </div>
                  ))
                ) : (
                  <div className="chat-bubble bubble-in">
                    <div className="msg-text">{evidence.content?.text || 'No message transcripts available.'}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {evidence.type === 'cctv' && (
            <div className="cctv-screen">
              <div className="cctv-overlay">
                <span className="cctv-rec-dot">● REC</span>
                <span className="cctv-cam-id">FEED: {evidence.content?.metadata || 'CAM-03 CORRIDOR'}</span>
                <span className="cctv-time">{evidence.timestamp || '23:45:12'}</span>
              </div>
              <div className="cctv-viewport">
                <div className="scanlines"></div>
                <div className="cctv-visual-icon">📹</div>
                <p className="cctv-log-text">
                  {evidence.content?.text || evidence.description}
                </p>
              </div>
              <div className="cctv-footer">
                <span>SPEED: 1.0X</span>
                <span>STATUS: ARCHIVED CLIP</span>
              </div>
            </div>
          )}

          {evidence.type === 'image' && (
            <div className="photo-card">
              <div className="photo-tag">EVIDENCE MARKER #{evidence.id.toUpperCase()}</div>
              <div className="photo-display">
                <span className="photo-icon">📷</span>
                <p className="photo-caption">{evidence.content?.text || evidence.description}</p>
              </div>
              {evidence.content?.metadata && (
                <div className="photo-meta">Metadata: {evidence.content.metadata}</div>
              )}
            </div>
          )}

          {(evidence.type === 'document' || evidence.type === 'statement') && (
            <div className="document-sheet">
              <div className="doc-watermark">CONFIDENTIAL POLICE FILE</div>
              <div className="doc-content">
                <h4>FORENSIC EXHIBIT: {evidence.title}</h4>
                <div className="doc-text">
                  {evidence.content?.text || evidence.description}
                </div>
                {evidence.timestamp && (
                  <div className="doc-date">RECORDED AT: {evidence.timestamp}</div>
                )}
              </div>
            </div>
          )}

          {/* Implicated / Related Suspects */}
          {relatedSuspects.length > 0 && (
            <div className="related-suspects-box">
              <h4>Directly Implicates / Mentions:</h4>
              <div className="related-suspects-pills">
                {relatedSuspects.map((s) => (
                  <span key={s.id} className="suspect-tag">
                    👤 {s.name} ({s.occupation})
                  </span>
                ))}
              </div>
            </div>
          )}

          {evidence.relevance && (
            <div className="evidence-relevance-note">
              <strong>🕵️ Detective Notebook Note:</strong> {evidence.relevance}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-modal-close" onClick={onClose}>
            Back to Case Locker
          </button>
        </div>
      </div>
    </div>
  );
}


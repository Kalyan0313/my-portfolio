import React from 'react';
import { X, Share2, Check } from 'lucide-react';
import type { EngineeringNote } from '../../types';
import { useModalEscape, useCopyToClipboard } from '../../hooks';

interface NoteModalProps {
  note: EngineeringNote | null;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onShowToast }) => {
  useModalEscape(Boolean(note), onClose);
  const [copied, copyLink] = useCopyToClipboard(2500);

  if (!note) return null;

  const handleShare = async () => {
    const url = `${window.location.origin}/#/note/${note.id}`;
    const success = await copyLink(url);
    if (success && onShowToast) {
      onShowToast(`Copied article link to clipboard!`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'rgba(5, 5, 5, 0.90)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#0A0A0A',
            borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '3px 8px',
                background: 'var(--accent-green-subtle)',
                border: '1px solid var(--accent-green-border)',
                color: 'var(--accent-green)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              {note.topic}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.40)' }}>
              {note.date || 'Technical Note'} • {note.readTime}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleShare}
              aria-label="Share article"
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: copied ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.70)',
                padding: '6px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close Note"
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: '#FFFFFF',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 1.4,
                marginBottom: '12px'
              }}
            >
              {note.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.7, margin: 0 }}>
              {note.summary}
            </p>
          </div>

          {/* Key Takeaways */}
          <div style={{ padding: '20px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              [ KEY ENGINEERING TAKEAWAYS ]
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {note.keyTakeaways.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.70)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--accent-green)' }}>&gt;</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          {note.contentSections.map((sec, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                {sec.heading}
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.75, margin: 0 }}>
                {sec.text}
              </p>
              {sec.codeSnippet && (
                <div style={{ marginTop: '8px' }}>
                  {sec.codeSnippet.caption && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-green)', display: 'block', marginBottom: '4px' }}>
                      // {sec.codeSnippet.caption}
                    </span>
                  )}
                  <pre className="code-box">
                    <code>{sec.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.40)', textTransform: 'uppercase' }}>Tags:</span>
              {note.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--accent-green)',
                    background: 'var(--accent-green-subtle)',
                    border: '1px solid var(--accent-green-border)',
                    padding: '2px 8px'
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#0A0A0A',
            borderTop: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.40)' }}>
            [ ESC TO CLOSE ]
          </span>
          <button
            onClick={onClose}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              color: '#FFFFFF',
              padding: '6px 14px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

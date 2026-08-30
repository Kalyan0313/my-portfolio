import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Share2, Check, Maximize2, Minimize2, List } from 'lucide-react';
import mermaid from 'mermaid';
import type { EngineeringNote } from '../../types';
import { useModalEscape, useCopyToClipboard } from '../../hooks';
import { fireCyberpunkConfetti } from '../../utils/confetti';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    darkMode: true,
    background: '#080808',
    primaryColor: 'rgba(245, 158, 11, 0.20)',
    primaryTextColor: '#FFFFFF',
    primaryBorderColor: '#F59E0B',
    lineColor: '#10B981',
    secondaryColor: '#111827',
    tertiaryColor: '#0A0A0A',
    fontFamily: 'var(--font-mono, monospace)',
    fontSize: '13px'
  }
});

interface NoteModalProps {
  note: EngineeringNote | null;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onShowToast }) => {
  useModalEscape(Boolean(note), onClose);
  const [copied, copyLink] = useCopyToClipboard(2500);

  // Reader Preferences State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(15); // Default 15px
  const [readingProgress, setReadingProgress] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Extract Table of Contents from markdown or html
  const tocItems = useMemo<TocItem[]>(() => {
    if (!note) return [];

    const items: TocItem[] = [];
    const sourceText = note.contentMarkdown || '';

    // Match markdown headings (# Heading, ## Heading)
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(sourceText)) !== null) {
      const level = match[1].length;
      const rawTitle = match[2].trim().replace(/\*\*/g, '').replace(/`/g, '');
      const slug = rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Avoid duplicate or very long entries
      if (rawTitle.length < 80) {
        items.push({
          id: slug,
          title: rawTitle,
          level
        });
      }
    }

    return items;
  }, [note]);

  // Track Reading Scroll Progress
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const totalScrollable = scrollHeight - clientHeight;

    if (totalScrollable > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100));
      setReadingProgress(progress);
    }
  };

  // Attach 1-Click Copy Buttons to Pre/Code blocks
  useEffect(() => {
    if (!note || !contentAreaRef.current) return;

    const preElements = contentAreaRef.current.querySelectorAll('pre');
    preElements.forEach((pre) => {
      // Prevent duplicate copy button insertion
      if (pre.querySelector('.code-copy-btn')) return;

      const button = document.createElement('button');
      button.className = 'code-copy-btn';
      button.textContent = 'COPY';
      button.title = 'Copy code snippet';

      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        const codeText = pre.querySelector('code')?.innerText || pre.innerText;
        try {
          await navigator.clipboard.writeText(codeText);
          button.textContent = 'COPIED';
          button.classList.add('copied');
          setTimeout(() => {
            button.textContent = 'COPY';
            button.classList.remove('copied');
          }, 2000);
        } catch {
          button.textContent = 'ERROR';
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });

    // Render any Mermaid Flowcharts / Architecture Diagrams
    const mermaidNodes = contentAreaRef.current.querySelectorAll<HTMLElement>('.mermaid');
    if (mermaidNodes.length > 0) {
      try {
        mermaid.run({
          nodes: Array.from(mermaidNodes),
        });
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }
  }, [note, fontSize]);

  if (!note) return null;

  const handleShare = async () => {
    const url = `${window.location.origin}/#/note/${note.id}`;
    const success = await copyLink(url);
    if (success) {
      fireCyberpunkConfetti();
      if (onShowToast) {
        onShowToast(`Copied article link to clipboard!`);
      }
    }
  };

  const scrollToHeading = (id: string, title: string) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    let targetEl: HTMLElement | null = null;
    if (id) {
      try {
        targetEl = container.querySelector(`#${CSS.escape(id)}`) || document.getElementById(id);
      } catch {
        targetEl = document.getElementById(id);
      }
    }

    if (!targetEl && contentAreaRef.current) {
      const headings = contentAreaRef.current.querySelectorAll('h1, h2, h3, h4');
      for (const h of Array.from(headings)) {
        const text = (h.textContent || '').trim().toLowerCase();
        if (text.includes(title.toLowerCase()) || title.toLowerCase().includes(text)) {
          targetEl = h as HTMLElement;
          break;
        }
      }
    }

    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const currentScroll = container.scrollTop;
      const targetScrollTop = currentScroll + (targetRect.top - containerRect.top) - 75;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
      setIsTocOpen(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isFullScreen ? 0 : '1rem',
        backgroundColor: 'rgba(5, 5, 5, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overscrollBehavior: 'contain'
      }}
      onClick={onClose}
    >
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        data-lenis-prevent="true"
        style={{
          width: '100%',
          maxWidth: isFullScreen ? '100vw' : '960px',
          height: isFullScreen ? '100vh' : '92vh',
          maxHeight: isFullScreen ? '100vh' : '92vh',
          backgroundColor: '#080808',
          border: isFullScreen ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'max-width 0.2s ease, height 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Reading Progress Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            zIndex: 30
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${readingProgress}%`,
              background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.8)',
              transition: 'width 0.1s linear'
            }}
          />
        </div>

        {/* Sticky Header & Reader Controls Toolbar */}
        <div
          style={{
            position: 'sticky',
            top: '3px',
            zIndex: 20,
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {/* Left Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
              {note.date} • {note.readTime}
            </span>
          </div>

          {/* Right Reader Controls Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Outline / TOC Toggle */}
            {tocItems.length > 0 && (
              <button
                onClick={() => setIsTocOpen(!isTocOpen)}
                aria-label="Table of Contents"
                style={{
                  background: isTocOpen ? 'var(--accent-green-subtle)' : 'none',
                  border: isTocOpen ? '1px solid var(--accent-green)' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: isTocOpen ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.70)',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <List size={13} />
                <span>Outline ({tocItems.length})</span>
              </button>
            )}

            {/* Font Size Adjusters */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <button
                onClick={() => setFontSize((s) => Math.max(13, s - 1))}
                aria-label="Decrease Font Size"
                style={{
                  background: 'none',
                  border: 'none',
                  borderRight: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255, 255, 255, 0.70)',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px'
                }}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(20, s + 1))}
                aria-label="Increase Font Size"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.70)',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px'
                }}
              >
                A+
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              aria-label={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: isFullScreen ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.70)',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>

            {/* Share Link */}
            <button
              onClick={handleShare}
              aria-label="Share article"
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: copied ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.70)',
                padding: '5px 10px',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Note"
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: '#FFFFFF',
                padding: '5px 7px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Interactive Slide-Over Table of Contents Drawer */}
        {isTocOpen && tocItems.length > 0 && (
          <div
            style={{
              position: 'sticky',
              top: '55px',
              zIndex: 15,
              backgroundColor: '#050505',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '16px 24px',
              maxHeight: '260px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-green)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
                [ TABLE OF CONTENTS ]
              </span>
              <button
                onClick={() => setIsTocOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.40)', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              >
                [ CLOSE ]
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {tocItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToHeading(item.id, item.title)}
                  style={{
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.70)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                    padding: '4px 0',
                    paddingLeft: item.level > 1 ? `${(item.level - 1) * 14}px` : '0',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-green)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.70)')}
                >
                  <span style={{ color: 'var(--accent-green)', marginRight: '6px' }}>&gt;</span>
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reader Body (Constrained Golden-Ratio Reading Width for Optimum Legibility) */}
        <div
          ref={contentAreaRef}
          style={{
            maxWidth: '760px',
            width: '100%',
            margin: '0 auto',
            padding: isFullScreen ? '48px 32px 80px' : '36px 24px 60px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}
        >
          {/* Article Header */}
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(22px, 3.5vw, 28px)',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
                lineHeight: 1.35,
                margin: '0 0 16px 0'
              }}
            >
              {note.title}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: `${fontSize}px`,
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.7,
                margin: 0
              }}
            >
              {note.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          {note.keyTakeaways && note.keyTakeaways.length > 0 && (
            <div style={{ padding: '20px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.10)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.10em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                [ KEY TAKEAWAYS ]
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {note.keyTakeaways.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: `${fontSize - 1}px`, color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-green)' }}>&gt;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compiled Markdown Body with Dynamic Font Scaling */}
          {note.htmlContent ? (
            <div
              className="blog-markdown-content"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: note.htmlContent }}
            />
          ) : (
            note.contentSections?.map((sec, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  {sec.heading}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: `${fontSize}px`, color: 'rgba(255, 255, 255, 0.70)', lineHeight: 1.8, margin: 0 }}>
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
            ))
          )}

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
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
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '12px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.40)' }}>
            [ ESC TO CLOSE ]
          </span>
          <button
            onClick={onClose}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              color: '#FFFFFF',
              padding: '5px 14px',
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

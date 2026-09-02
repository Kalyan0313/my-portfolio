import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../ui';

export const GithubSection: React.FC = () => {
  return (
    <section id="github" className="section">
      <div className="container">
        <div
          style={{
            padding: '2.5rem 2rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <GithubIcon width={20} height={20} style={{ color: 'var(--accent-cyan)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--accent-cyan)'
                }}
              >
                Open Source & Public Repositories
              </span>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              More of my code on GitHub
            </h3>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
              I build, experiment, and learn in public. Explore complete repositories, backend boilerplate templates, real-time WebSocket implementations, and frontend projects on my profile.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href="https://github.com/ZairoXcode"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <GithubIcon width={18} height={18} />
              <span>Visit GitHub Profile</span>
              <ArrowUpRight size={16} />
            </a>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-faint)',
                textAlign: 'center'
              }}
            >
              @ZairoXcode on GitHub
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

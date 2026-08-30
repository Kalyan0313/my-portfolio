import React from 'react';
import { profileData } from '../../data';

export const About: React.FC = () => {
  return (
    <section
      id="about"
      style={{
        width: '100%',
        background: 'var(--bg-dark)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '120px var(--pad-x)'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p className="section-tag">[ ABOUT ]</p>
        <h2 className="section-heading" style={{ marginBottom: '64px' }}>About Me</h2>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', marginBottom: '48px' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {profileData.bioParagraphs.map((para, idx) => (
            <p
              key={idx}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                lineHeight: 1.8,
                letterSpacing: 0,
                color: 'rgba(255,255,255,0.75)',
                margin: 0
              }}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Links List */}
        <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.40)',
                textTransform: 'uppercase',
                minWidth: '90px'
              }}
            >
              [GITHUB]
            </span>
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s'
              }}
            >
              github.com/Kalyan0313
            </a>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.40)',
                textTransform: 'uppercase',
                minWidth: '90px'
              }}
            >
              [LINKEDIN]
            </span>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s'
              }}
            >
              linkedin.com/in/kalyan-mahato-366444244
            </a>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.40)',
                textTransform: 'uppercase',
                minWidth: '90px'
              }}
            >
              [EMAIL]
            </span>
            <a
              href={`mailto:${profileData.email}`}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s'
              }}
            >
              {profileData.email}
            </a>
          </div>

          {profileData.phone && (
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.40)',
                  textTransform: 'uppercase',
                  minWidth: '90px'
                }}
              >
                [PHONE]
              </span>
              <a
                href={`tel:${profileData.phone.replace(/\s+/g, '')}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                  transition: 'color 0.2s'
                }}
              >
                {profileData.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

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

      </div>
    </section>
  );
};

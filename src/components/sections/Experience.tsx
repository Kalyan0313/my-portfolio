import React from 'react';
import { experienceData } from '../../data';

export const Experience: React.FC = () => {
  return (
    <section
      id="experience"
      style={{
        width: '100%',
        background: 'var(--bg-deep)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '120px var(--pad-x)'
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <p className="section-tag">[ EXPERIENCE ]</p>
        <h2 className="section-heading">Engineering Experience</h2>
        <div className="section-divider" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {experienceData.map((exp, idx) => (
            <div
              key={exp.id}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.015)',
                padding: '32px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-green)' }}>
                      [0{idx + 1}]
                    </span>
                    <h3
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '16px',
                        fontWeight: 700,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        margin: 0
                      }}
                    >
                      {exp.role}
                    </h3>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--accent-lime)',
                      margin: '6px 0 0 32px'
                    }}
                  >
                    {exp.company}
                  </p>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.40)'
                  }}
                >
                  {exp.period} • {exp.location}
                </span>
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.65)',
                  margin: '0 0 20px 0'
                }}
              >
                {exp.overview}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {exp.contributions.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.60)',
                      lineHeight: 1.6
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}>&gt;</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.10em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.50)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      padding: '3px 8px'
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

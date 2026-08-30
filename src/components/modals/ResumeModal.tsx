import React from 'react';
import { X, Printer } from 'lucide-react';
import { profileData, experienceData, projectsData } from '../../data';
import { useModalEscape } from '../../hooks';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useModalEscape(isOpen, onClose);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
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
          maxHeight: '92vh',
          backgroundColor: '#0A0A0A',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
        className="resume-sheet"
      >
        {/* Sticky Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#0A0A0A',
            borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          className="no-print"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-green)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
            [ RESUME PREVIEW ] — {profileData.name}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'var(--accent-green)',
                color: '#0A0A0A',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close Resume"
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.20)',
                color: '#FFFFFF',
                padding: '5px',
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

        {/* Content Body */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '20px' }}>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: '28px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' }}>
              {profileData.name}
            </h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--accent-green)', margin: '4px 0 12px 0' }}>
              {profileData.role}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.60)' }}>
              <span>{profileData.email}</span>
              {profileData.phone && (
                <>
                  <span>•</span>
                  <span>{profileData.phone}</span>
                </>
              )}
              <span>•</span>
              <span>github.com/Kalyan0313</span>
              <span>•</span>
              <span>linkedin.com/in/kalyan-mahato-366444244</span>
              <span>•</span>
              <span>{profileData.location}</span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.12em', color: 'var(--accent-green)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              [ SUMMARY ]
            </span>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.7, margin: 0 }}>
              Full Stack Software Developer with core expertise in JavaScript and TypeScript ecosystems. Experienced in architecting multi-tenant web platforms, building real-time telemetry systems using Socket.IO and WebSockets, designing resilient RESTful APIs with Node.js and Express, and optimizing query throughput across MongoDB, PostgreSQL, and Redis caching layers.
            </p>
          </div>

          {/* Skills */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.12em', color: 'var(--accent-green)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              [ TECHNICAL SKILLS ]
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
              <div><strong style={{ color: '#FFFFFF' }}>Languages: </strong><span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>JavaScript (ES6+), TypeScript, C++, SQL, HTML5, CSS3</span></div>
              <div><strong style={{ color: '#FFFFFF' }}>Frontend: </strong><span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>React.js, Next.js, Redux, Redux Toolkit, Tailwind CSS, Bootstrap</span></div>
              <div><strong style={{ color: '#FFFFFF' }}>Backend &amp; APIs: </strong><span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Node.js, Express.js, REST APIs, Socket.IO, JWT Auth, Multi-Tenancy</span></div>
              <div><strong style={{ color: '#FFFFFF' }}>Databases &amp; Caching: </strong><span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>MongoDB, PostgreSQL, MySQL, Redis (Cache-Aside, TTL Invalidation)</span></div>
              <div><strong style={{ color: '#FFFFFF' }}>DevOps &amp; Tools: </strong><span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>Git, GitHub, Docker, Postman, Swagger / OpenAPI, Linux CLI</span></div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.12em', color: 'var(--accent-green)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              [ EXPERIENCE ]
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {experienceData.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: '#FFFFFF', margin: 0, textTransform: 'uppercase' }}>
                      {exp.role} <span style={{ fontWeight: 400, color: 'var(--accent-lime)' }}>| {exp.company}</span>
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.40)' }}>
                      {exp.period}
                    </span>
                  </div>
                  <ul style={{ margin: '6px 0 0 18px', padding: 0, fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6 }}>
                    {exp.contributions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects */}
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.12em', color: 'var(--accent-green)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              [ KEY PROJECTS ]
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {projectsData.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      {proj.title}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-green)' }}>
                      {proj.technologies.slice(0, 4).join(' • ')}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.60)', margin: '4px 0', lineHeight: 1.5 }}>
                    {proj.shortDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

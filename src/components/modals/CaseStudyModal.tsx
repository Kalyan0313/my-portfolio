import React from 'react';
import { X, Layers, Database, Radio, Lightbulb } from 'lucide-react';
import type { Project } from '../../types';
import { useModalEscape } from '../../hooks';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ project, onClose }) => {
  useModalEscape(Boolean(project), onClose);

  if (!project || !project.caseStudy) return null;
  const { caseStudy } = project;

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
          maxWidth: '920px',
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
        {/* Sticky Header */}
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
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--accent-green)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}
            >
              // ARCHITECTURAL CASE STUDY
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '18px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginTop: '2px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
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

        {/* Modal Body */}
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Image preview in modal */}
          {project.image && (
            <div
              style={{
                width: '100%',
                aspectRatio: '16 / 9',
                maxHeight: '440px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#060606',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          )}

          {/* Subtitle & Stack */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, marginBottom: '16px' }}>
              {project.tagline}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-green)',
                    background: 'var(--accent-green-subtle)',
                    border: '1px solid var(--accent-green-border)',
                    padding: '4px 10px'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Overview & Problem */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-green)', display: 'block', marginBottom: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                [ SYSTEM OVERVIEW ]
              </span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.65, margin: 0 }}>
                {caseStudy.overview}
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-lime)', display: 'block', marginBottom: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                [ PROBLEM STATEMENT ]
              </span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.65, margin: 0 }}>
                {caseStudy.problem}
              </p>
            </div>
          </div>

          {/* System Architecture */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} style={{ color: 'var(--accent-green)' }} />
              [ System Architecture &amp; Data Pipeline ]
            </h3>
            <div style={{ padding: '20px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.10)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                {caseStudy.systemArchitecture.title}
              </h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.65, margin: 0 }}>
                {caseStudy.systemArchitecture.description}
              </p>
              {caseStudy.systemArchitecture.diagramDescription && (
                <pre className="code-box" style={{ fontSize: '12px', color: 'var(--accent-lime)', marginTop: '8px' }}>
                  <code>{caseStudy.systemArchitecture.diagramDescription}</code>
                </pre>
              )}
            </div>
          </div>

          {/* Technical Decisions */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={16} style={{ color: 'var(--accent-green)' }} />
              [ Engineering Decisions &amp; Trade-Offs ]
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {caseStudy.technicalDecisions.map((dec, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-green)', textTransform: 'uppercase' }}>
                      Topic: {dec.topic}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '2px 8px' }}>
                      Choice: {dec.choice}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.6, margin: 0 }}>
                    <strong>Rationale: </strong>{dec.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Database Entities & APIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={15} style={{ color: 'var(--accent-green)' }} />
                [ Data Entities ]
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {caseStudy.databaseDesign.modelsOrEntities.map((entity) => (
                  <div key={entity.name} style={{ padding: '12px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-green)', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                      {entity.name}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.50)' }}>
                      {entity.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={15} style={{ color: 'var(--accent-green)' }} />
                [ API &amp; WebSocket Endpoints ]
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {caseStudy.apiAndRealtime.endpointsOrEvents.map((ep, i) => (
                  <div key={i} style={{ padding: '12px', backgroundColor: '#030303', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-green)', background: 'var(--accent-green-subtle)', border: '1px solid var(--accent-green-border)', padding: '1px 6px' }}>
                        {ep.type}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#FFFFFF' }}>
                        {ep.name}
                      </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.50)' }}>
                      {ep.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#0A0A0A',
            borderTop: '1px solid rgba(255, 255, 255, 0.10)',
            padding: '16px 24px',
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

import React, { useState } from 'react';
import { projectsData } from '../../data';
import type { Project } from '../../types';

export interface ProjectsProps {
  onSelectCaseStudy: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onSelectCaseStudy }) => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const activeProject = projectsData[activeProjectIndex] || projectsData[0];

  return (
    <section
      id="works"
      className="flex-col-md-row"
      style={{
        width: '100%',
        background: 'var(--bg-dark)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        minHeight: '700px'
      }}
    >
      {/* Left Sidebar List */}
      <div className="works-sidebar">
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.20em',
            color: 'var(--accent-green)',
            textTransform: 'uppercase',
            marginBottom: '40px'
          }}
        >
          [ WORK ]
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {projectsData.map((project, idx) => {
            const isActive = activeProjectIndex === idx;
            return (
              <button
                key={project.id}
                onClick={() => setActiveProjectIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: 0
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    letterSpacing: '0.12em',
                    color: isActive ? 'var(--accent-green)' : 'rgba(255,255,255,0.40)',
                    minWidth: '30px',
                    flexShrink: 0,
                    transition: 'color 0.2s'
                  }}
                >
                  [0{idx + 1}]
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--accent-green)' : 'rgba(255,255,255,0.40)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'color 0.2s'
                  }}
                >
                  {project.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Project Detail Showcase */}
      <div
        style={{
          flex: 1,
          background: 'var(--bg-deep)',
          padding: '48px var(--pad-x)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Project Image / Architecture Preview Canvas */}
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            marginBottom: '28px',
            overflow: 'hidden',
            background: '#060606',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {activeProject.image ? (
            <img
              src={activeProject.image}
              alt={activeProject.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                filter: 'brightness(0.96) contrast(1.03)'
              }}
            />
          ) : (
            <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  color: 'var(--accent-green)',
                  textTransform: 'uppercase'
                }}
              >
                // SYSTEM OVERVIEW & ARCHITECTURE
              </span>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: '#FFFFFF', textTransform: 'uppercase' }}>
                {activeProject.tagline}
              </h4>
            </div>
          )}

          {/* Top subtle overlay badge */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#FFFFFF',
                background: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '3px 8px'
              }}
            >
              [0{activeProjectIndex + 1} / 0{projectsData.length}]
            </span>
          </div>
        </div>

        {/* Project Header Info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                marginBottom: '8px'
              }}
            >
              {activeProject.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '640px'
              }}
            >
              {activeProject.shortDescription}
            </p>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.12em',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              paddingTop: '2px'
            }}
          >
            {activeProject.badge}
          </span>
        </div>

        {/* Technologies Box Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
          {activeProject.technologies.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '4px 10px'
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: 'auto' }}>
          <button
            onClick={() => onSelectCaseStudy(activeProject)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-green)',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              transition: 'opacity 0.2s'
            }}
          >
            [VIEW CASE STUDY ↗]
          </button>

          {activeProject.githubUrl && (
            <a
              href={activeProject.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s'
              }}
            >
              [SOURCE ↗]
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

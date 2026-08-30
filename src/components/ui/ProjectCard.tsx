import React from 'react';
import { ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onSelectCaseStudy: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectCaseStudy }) => {
  return (
    <article
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        backgroundColor: 'var(--bg-surface)',
        position: 'relative'
      }}
    >
      {/* Top Banner & Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginBottom: '0.2rem'
            }}
          >
            {project.badge || 'Featured Project'}
          </span>
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            {project.title}
          </h3>
        </div>
      </div>

      {/* Tagline / Subtitle */}
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
        {project.tagline}
      </p>

      {/* Short Description */}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {project.shortDescription}
      </p>

      {/* Engineering Highlights */}
      <div>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem'
          }}
        >
          Engineering Highlights:
        </span>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', margin: 0, padding: 0 }}>
          {project.highlights.slice(0, 3).map((hl, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}
            >
              <CheckCircle2
                size={14}
                style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: '0.15rem' }}
              />
              <span>{hl}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tech Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.4rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          marginTop: 'auto'
        }}
      >
        {project.technologies.map((tech) => (
          <span key={tech} className="tag">
            {tech}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <button
          onClick={() => onSelectCaseStudy(project)}
          className="btn btn-accent btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <BookOpen size={14} />
          <span>View Case Study</span>
          <ArrowRight size={14} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              aria-label={`View GitHub repository for ${project.title}`}
            >
              <GithubIcon width={14} height={14} />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

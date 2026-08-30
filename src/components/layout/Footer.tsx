import React from 'react';
import { profileData } from '../../data';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        width: '100%',
        background: 'var(--bg-dark)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '40px var(--pad-x)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          letterSpacing: '0.10em',
          color: 'rgba(255,255,255,0.40)',
          margin: 0
        }}
      >
        © 2026 {profileData.name} — {profileData.role}
      </p>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <a
          href={profileData.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.10em',
            color: 'rgba(255,255,255,0.40)',
            textTransform: 'uppercase',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-green)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)')}
        >
          GITHUB
        </a>

        <a
          href={profileData.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.10em',
            color: 'rgba(255,255,255,0.40)',
            textTransform: 'uppercase',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-green)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)')}
        >
          LINKEDIN
        </a>

        <a
          href={`mailto:${profileData.email}`}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            letterSpacing: '0.10em',
            color: 'rgba(255,255,255,0.40)',
            textTransform: 'uppercase',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-green)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)')}
        >
          EMAIL
        </a>

        {profileData.phone && (
          <a
            href={`tel:${profileData.phone.replace(/\s+/g, '')}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.10em',
              color: 'rgba(255,255,255,0.40)',
              textTransform: 'uppercase',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--accent-green)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)')}
          >
            CALL
          </a>
        )}
      </div>
    </footer>
  );
};

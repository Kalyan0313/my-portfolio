import React, { useState } from 'react';
import { Layers, Code2, Server, Layout, Terminal } from 'lucide-react';
import { profileData } from '../../data';

export interface HeroProps {
  onOpenResume: () => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onFilterChange }) => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const filterTabs = [
    {
      id: 'all',
      label: 'All Roles',
      roleTitle: profileData.role,
      statusRole: 'FULL STACK & BACKEND',
      icon: <Layers size={13} />
    },
    {
      id: 'fullstack',
      label: 'Node.js Full-Stack Developer',
      roleTitle: 'Node.js Full-Stack Developer',
      statusRole: 'NODE.JS FULL-STACK',
      icon: <Code2 size={13} />
    },
    {
      id: 'backend',
      label: 'Backend Developer',
      roleTitle: 'Backend Developer',
      statusRole: 'BACKEND DEVELOPER',
      icon: <Server size={13} />
    },
  ];

  const activeTab = filterTabs.find((tab) => tab.id === selectedTag) || filterTabs[0];

  const handleSelectTag = (tabId: string) => {
    setSelectedTag(tabId);
    if (onFilterChange) {
      onFilterChange(tabId);
    }
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Background Grid Matrix Pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Center Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          padding: '120px var(--pad-x) 60px calc(var(--pad-x) + 28px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            letterSpacing: '0.20em',
            color: 'var(--accent-green)',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}
        >
          Hey There —
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(58px, 10vw, 120px)',
            fontWeight: 400,
            letterSpacing: '-0.06em',
            lineHeight: 1,
            color: '#FFFFFF',
            margin: '0 0 16px'
          }}
        >
          {profileData.name}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 0 40px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 5.8vw, 72px)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              color: 'var(--accent-green)',
              margin: 0,
              lineHeight: 1,
              transition: 'color 0.2s ease'
            }}
          >
            {activeTab.roleTitle}
          </h2>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            color: 'rgba(255,255,255,0.50)',
            letterSpacing: 0,
            lineHeight: 1.6,
            maxWidth: '560px',
            margin: '0 0 48px'
          }}
        >
          {profileData.headline}
        </p>

        {/* Filter Pills with Proper Icons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelectTag(tab.id)}
              className={`pill-btn ${selectedTag === tab.id ? 'pill-btn-active' : 'pill-btn-inactive'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom 3-Column Status Strip */}
      <div
        className="flex-col-md-row"
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <div className="status-item">
          <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '18px' }}>◎</span>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.40)', margin: '0 0 4px' }}>
              BASED IN
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.10em', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              BANGALORE, INDIA
            </p>
          </div>
        </div>

        <div className="status-item">
          <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '18px' }}>◈</span>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.40)', margin: '0 0 4px' }}>
              ROLE
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.10em', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {activeTab.statusRole}
            </p>
          </div>
        </div>

        <div className="status-item">
          <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '18px' }}>✦</span>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.40)', margin: '0 0 4px' }}>
              STATUS
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '0.10em', fontWeight: 700, color: 'var(--accent-green)', margin: 0 }}>
              AVAILABLE FOR WORK
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

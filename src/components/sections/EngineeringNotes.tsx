import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, ArrowUpRight } from 'lucide-react';
import { engineeringNotesData } from '../../data';
import type { EngineeringNote } from '../../types';

export interface EngineeringNotesProps {
  onSelectNote: (note: EngineeringNote) => void;
}

export const EngineeringNotes: React.FC<EngineeringNotesProps> = ({ onSelectNote }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [showAll, setShowAll] = useState(false);

  // Compute unique topics with counts
  const topics = useMemo(() => {
    const counts: Record<string, number> = {};
    engineeringNotesData.forEach((note) => {
      counts[note.topic] = (counts[note.topic] || 0) + 1;
    });

    return [
      { name: 'ALL', count: engineeringNotesData.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count }))
    ];
  }, []);

  // Filter notes based on topic & search query
  const filteredNotes = useMemo(() => {
    return engineeringNotesData.filter((note) => {
      const matchesTopic = selectedTopic === 'ALL' || note.topic === selectedTopic;
      if (!matchesTopic) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = note.title.toLowerCase().includes(q);
      const inSummary = note.summary.toLowerCase().includes(q);
      const inTopic = note.topic.toLowerCase().includes(q);
      const inTags = note.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;

      return inTitle || inSummary || inTopic || inTags;
    });
  }, [selectedTopic, searchQuery]);

  // If user is searching or has selected a specific topic, automatically show all matching results
  // Otherwise, if on default landing view and !showAll, display only the first 3 articles
  const isFiltering = Boolean(searchQuery.trim() || selectedTopic !== 'ALL');
  const displayedNotes = isFiltering || showAll ? filteredNotes : filteredNotes.slice(0, 3);
  const hasMore = !isFiltering && filteredNotes.length > 3;

  return (
    <section
      id="notes"
      style={{
        width: '100%',
        background: 'var(--bg-dark)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '120px var(--pad-x)'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <p className="section-tag">[ NOTES &amp; BLOGS ]</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h2 className="section-heading" style={{ margin: '0 0 12px 0' }}>
              Tech Insights &amp; Articles
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.04em',
                maxWidth: '680px',
                margin: 0
              }}
            >
              Engineering write-ups, architectural deep-dives, and practical lessons on high-throughput systems, real-time pipelines, and scalable backend services.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--accent-green)',
              background: 'var(--accent-green-subtle)',
              border: '1px solid var(--accent-green-border)',
              padding: '6px 14px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}
          >
            <BookOpen size={14} />
            <span>{engineeringNotesData.length} Published Articles</span>
          </div>
        </div>

        {/* Search Bar & Topic Category Filters */}
        <div
          style={{
            marginTop: '40px',
            marginBottom: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px'
            }}
          >
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.40)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, keyword, or tech stack..."
              style={{
                width: '100%',
                padding: '12px 38px 12px 40px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                letterSpacing: '0.04em',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-green)';
                e.currentTarget.style.boxShadow = '0 0 12px var(--accent-green-glow)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.50)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Topic Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            {topics.map((t) => {
              const isActive = selectedTopic === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => setSelectedTopic(t.name)}
                  className={`pill-btn ${isActive ? 'pill-btn-active' : 'pill-btn-inactive'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    padding: '8px 14px'
                  }}
                >
                  <span>{t.name}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      opacity: isActive ? 0.9 : 0.6,
                      background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.10)',
                      padding: '1px 6px',
                      borderRadius: '2px'
                    }}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Status Line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
            marginBottom: '32px'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.45)',
              textTransform: 'uppercase'
            }}
          >
            Showing {displayedNotes.length} of {engineeringNotesData.length} articles
            {selectedTopic !== 'ALL' && ` in [${selectedTopic}]`}
            {searchQuery && ` matching "${searchQuery}"`}
            {!isFiltering && !showAll && ` (Latest 3)`}
          </span>

          {(selectedTopic !== 'ALL' || searchQuery || showAll) && (
            <button
              onClick={() => {
                setSelectedTopic('ALL');
                setSearchQuery('');
                setShowAll(false);
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                color: 'var(--accent-green)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              [ RESET FILTERS ]
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {displayedNotes.length > 0 ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '28px'
              }}
            >
              {displayedNotes.map((note) => (
                <article
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className="note-card"
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(255, 255, 255, 0.015)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: 0,
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  {/* Card Thumbnail Image Banner */}
                  {note.thumbnail && (
                    <div className="note-thumbnail-container">
                      <img
                        src={note.thumbnail}
                        alt={note.title}
                        className="note-thumbnail-img"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Card Body */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      padding: '18px 20px 20px'
                    }}
                  >
                    {/* Meta Top: Read Time, Date, Topic */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.40)'
                        }}
                      >
                        {note.date || 'Technical Note'}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.20)' }}>•</span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.40)'
                        }}
                      >
                        {note.readTime}
                      </span>
                    </div>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        padding: '3px 8px',
                        background: 'var(--accent-green-subtle)',
                        border: '1px solid var(--accent-green-border)',
                        color: 'var(--accent-green)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {note.topic}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="note-title"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '15px',
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: '#FFFFFF',
                      margin: '0 0 16px 0',
                      letterSpacing: '0.01em'
                    }}
                  >
                    {note.title}
                  </h3>

                  {/* Tags List */}
                  {note.tags && note.tags.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '16px'
                      }}
                    >
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10.5px',
                            color: 'rgba(255, 255, 255, 0.45)',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            padding: '2px 6px'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Link */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: 'auto',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        color: 'var(--accent-green)',
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      READ ARTICLE <ArrowUpRight size={13} />
                    </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View All / Show Less Toggle Button */}
            {hasMore && (
              <div
                style={{
                  marginTop: '40px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <button
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    background: showAll ? 'rgba(255, 255, 255, 0.04)' : 'var(--accent-green-subtle)',
                    border: '1px solid var(--accent-green)',
                    color: 'var(--accent-green)',
                    padding: '12px 28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-green)';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.boxShadow = '0 0 16px var(--accent-green-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = showAll ? 'rgba(255, 255, 255, 0.04)' : 'var(--accent-green-subtle)';
                    e.currentTarget.style.color = 'var(--accent-green)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {showAll ? (
                    <span>[ SHOW LESS ARTICLES ]</span>
                  ) : (
                    <span>[ VIEW ALL {filteredNotes.length} ARTICLES ]</span>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.01)'
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.60)',
                marginBottom: '16px'
              }}
            >
              No engineering articles found matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedTopic('ALL');
                setSearchQuery('');
              }}
              className="pill-btn pill-btn-active"
            >
              Show All Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

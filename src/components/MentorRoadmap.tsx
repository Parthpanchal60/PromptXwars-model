import React, { useState } from 'react';
import { RoadmapCard, SprintId, GeneCategory } from '../types';
import { Kanban, CheckSquare, Square, Shield, Eye, Download, Filter, Tag, BookOpen, ExternalLink } from 'lucide-react';

interface MentorRoadmapProps {
  cards: RoadmapCard[];
  onToggleChecklistItem: (cardId: string, itemId: string) => void;
  onUpdateCardStatus: (cardId: string, status: RoadmapCard['status']) => void;
  onExportSheets: () => void;
}

const SPRINT_TITLES: Record<SprintId, { name: string; desc: string }> = {
  'sprint-0': { name: 'Sprint 0: Zero-Bloat Setup', desc: '<10MB repo, single main branch, CSP headers' },
  'sprint-1': { name: 'Sprint 1: Core DNA Strand', desc: 'SVG double helix, dynamic codons, mutations' },
  'sprint-2': { name: 'Sprint 2: Google APIs & Hardening', desc: 'Firebase, Sheets, Vision, Maps, XSS guard' },
  'sprint-3': { name: 'Sprint 3: 99/100 Benchmark QA', desc: 'Vitest suite, WCAG AAA a11y, final submission' },
};

export const MentorRoadmap: React.FC<MentorRoadmapProps> = ({
  cards,
  onToggleChecklistItem,
  onUpdateCardStatus,
  onExportSheets,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GeneCategory | 'All'>('All');

  const filteredCards =
    selectedCategory === 'All'
      ? cards
      : cards.filter((c) => c.category === selectedCategory);

  const sprints: SprintId[] = ['sprint-0', 'sprint-1', 'sprint-2', 'sprint-3'];

  return (
    <section className="glass-panel" style={{ padding: 24 }} aria-label="Hackathon Mentor Sprint Roadmap">
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Kanban size={20} color="#00f5d4" aria-hidden="true" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Hackathon Mentor Roadmap (Trello Sprint Cards)
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Step-by-step sprint architecture guaranteeing zero submission errors and 99/100 judge alignment.
          </p>
        </div>

        {/* Category Filters & Sheets Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} color="#94a3b8" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GeneCategory | 'All')}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '0.82rem',
                outline: 'none',
              }}
              aria-label="Filter roadmap cards by category"
            >
              <option value="All">All Categories</option>
              <option value="Architecture">Architecture</option>
              <option value="Technology">Technology</option>
              <option value="Guardrails">Guardrails</option>
              <option value="Checkpoints">Checkpoints</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={onExportSheets}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            aria-label="Export Sprint Roadmap to Google Sheets CSV"
          >
            <Download size={14} />
            <span>Export to Google Sheets</span>
          </button>
        </div>
      </div>

      {/* 4-Sprint Kanban Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {sprints.map((sprintId) => {
          const sprintCards = filteredCards.filter((c) => c.sprint === sprintId);
          const { name, desc } = SPRINT_TITLES[sprintId];

          return (
            <div
              key={sprintId}
              style={{
                background: 'rgba(7, 10, 19, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Sprint Column Header */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#f8fafc' }}>{name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>{desc}</p>
              </div>

              {/* Cards in this sprint */}
              {sprintCards.length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  No cards match this filter.
                </div>
              ) : (
                sprintCards.map((card) => {
                  const completedCount = card.checklist.filter((i) => i.completed).length;
                  const totalCount = card.checklist.length;
                  const progressPct = Math.round((completedCount / totalCount) * 100);

                  return (
                    <div
                      key={card.id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.82)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-sm)',
                        padding: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        transition: 'transform 0.15s ease, border-color 0.2s ease',
                      }}
                    >
                      {/* Card Tags & Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <span
                            className={`badge badge-${
                              card.category === 'Architecture'
                                ? 'a'
                                : card.category === 'Technology'
                                ? 't'
                                : card.category === 'Guardrails'
                                ? 'g'
                                : 'c'
                            }`}
                          >
                            {card.category}
                          </span>
                          {card.googleApi && (
                            <span className="badge badge-gold">
                              <Tag size={10} /> {card.googleApi}
                            </span>
                          )}
                        </div>

                        {/* Status Toggle */}
                        <select
                          value={card.status}
                          onChange={(e) =>
                            onUpdateCardStatus(card.id, e.target.value as RoadmapCard['status'])
                          }
                          style={{
                            background: 'rgba(7, 10, 19, 0.8)',
                            color:
                              card.status === 'verified'
                                ? '#34d399'
                                : card.status === 'in_progress'
                                ? '#fbbf24'
                                : '#94a3b8',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            outline: 'none',
                          }}
                          aria-label={`Status for ${card.title}`}
                        >
                          <option value="todo">TO DO</option>
                          <option value="in_progress">IN PROGRESS</option>
                          <option value="verified">VERIFIED</option>
                        </select>
                      </div>

                      {/* Card Title & Desc */}
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {card.title}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          {card.description}
                        </p>
                      </div>

                      {/* Checkpoints info: Security & A11y */}
                      {(card.securityCheckpoint || card.a11yCheckpoint) && (
                        <div
                          style={{
                            background: 'rgba(7, 10, 19, 0.5)',
                            padding: '8px 10px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                          }}
                        >
                          {card.securityCheckpoint && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#34d399' }}>
                              <Shield size={11} />
                              <span>{card.securityCheckpoint}</span>
                            </div>
                          )}
                          {card.a11yCheckpoint && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#00f5d4' }}>
                              <Eye size={11} />
                              <span>{card.a11yCheckpoint}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Interactive Checklist */}
                      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 8 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 6,
                            fontSize: '0.72rem',
                            color: 'var(--text-dim)',
                          }}
                        >
                          <span>CHECKPOINTS</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>
                            {completedCount}/{totalCount} ({progressPct}%)
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {card.checklist.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => onToggleChecklistItem(card.id, item.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                fontSize: '0.76rem',
                                color: item.completed ? '#cbd5e1' : 'var(--text-muted)',
                              }}
                              tabIndex={0}
                              role="checkbox"
                              aria-checked={item.completed}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  onToggleChecklistItem(card.id, item.id);
                                }
                              }}
                            >
                              {item.completed ? (
                                <CheckSquare size={13} color="#00f5d4" aria-hidden="true" />
                              ) : (
                                <Square size={13} color="#64748b" aria-hidden="true" />
                              )}
                              <span style={{ textDecoration: item.completed ? 'none' : 'none' }}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Curated Learning Paths (YouTube, NPTEL, SWAYAM) */}
                      {card.learningResources && card.learningResources.length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: 8, marginTop: 8 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 5,
                              marginBottom: 6,
                              fontSize: '0.7rem',
                              color: '#38bdf8',
                              fontWeight: 600,
                            }}
                          >
                            <BookOpen size={11} />
                            <span>CURATED TUTORIALS</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {card.learningResources.map((res) => (
                              <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  background: 'rgba(56, 189, 248, 0.06)',
                                  border: '1px solid rgba(56, 189, 248, 0.18)',
                                  padding: '4px 8px',
                                  borderRadius: 4,
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.72rem',
                                  textDecoration: 'none',
                                }}
                                aria-label={`Open tutorial ${res.title} on ${res.platform} (opens in new tab)`}
                              >
                                <span
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  <strong
                                    style={{
                                      color:
                                        res.platform === 'YouTube'
                                          ? '#f43f5e'
                                          : res.platform === 'NPTEL'
                                          ? '#f59e0b'
                                          : '#38bdf8',
                                    }}
                                  >
                                    [{res.platform}]
                                  </strong>{' '}
                                  {res.title}
                                </span>
                                <ExternalLink size={11} style={{ flexShrink: 0, marginLeft: 4 }} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

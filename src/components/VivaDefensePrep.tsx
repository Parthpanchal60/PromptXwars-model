/**
 * Viva & Capstone Defense Preparation Component
 *
 * Provides students with tailored, examiner-level defense questions,
 * architectural rationale talking points, technical trade-off justifications,
 * and an interactive readiness tracker for academic defenses and hackathon evaluations.
 *
 * Accessibility & Standards:
 * - Semantic HTML (<section>, <article>, <header>)
 * - Keyboard-accessible accordion controls with aria-expanded and aria-controls
 * - WCAG AAA contrast via theme CSS variables
 * - Zero external dependencies
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Terminal,
} from 'lucide-react';
import { ProjectPlan, VivaCategory } from '../types';
import {
  generateVivaQuestions,
  filterVivaQuestions,
  calculateVivaReadiness,
} from '../utils/vivaDefenseEngine';

/**
 * Props for the VivaDefensePrep component.
 */
interface VivaDefensePrepProps {
  /** The current active project plan */
  plan: ProjectPlan;
}

const CATEGORIES: Array<VivaCategory | 'All'> = [
  'All',
  'Architecture & Design',
  'Security & Compliance',
  'Scalability & Performance',
  'Feasibility & Trade-offs',
  'Testing & Reliability',
];

/**
 * VivaDefensePrep renders an interactive defense cockpit for students.
 */
export const VivaDefensePrep: React.FC<VivaDefensePrepProps> = ({ plan }) => {
  const [selectedCategory, setSelectedCategory] = useState<VivaCategory | 'All'>('All');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());
  const [simulatedFocusId, setSimulatedFocusId] = useState<string | null>(null);

  // Generate domain-tailored defense questions based on project plan
  const allQuestions = useMemo(() => generateVivaQuestions(plan), [plan]);

  // Filtered list based on active category tab
  const filteredQuestions = useMemo(
    () => filterVivaQuestions(allQuestions, selectedCategory),
    [allQuestions, selectedCategory]
  );

  // Readiness calculation
  const readiness = useMemo(
    () => calculateVivaReadiness(practicedIds.size, allQuestions.length),
    [practicedIds.size, allQuestions.length]
  );

  /**
   * Toggle accordion expansion for a question card.
   */
  const handleToggleAccordion = useCallback((id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  }, []);

  /**
   * Toggle practiced status for a defense question.
   */
  const handleTogglePracticed = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPracticedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  }, []);

  /**
   * Select a random examiner drill-down question and expand it.
   */
  const handleSimulateDrillDown = useCallback(() => {
    if (allQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    const target = allQuestions[randomIndex];
    setSelectedCategory('All');
    setExpandedQuestionId(target.id);
    setSimulatedFocusId(target.id);

    // Smoothly clear highlight after a short notification window
    setTimeout(() => {
      setSimulatedFocusId(null);
    }, 4000);
  }, [allQuestions]);

  return (
    <section
      aria-labelledby="viva-defense-heading"
      className="glass-panel"
      style={{
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Header & Defense Readiness Cockpit */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 245, 212, 0.2))',
              padding: 10,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#a855f7',
            }}
          >
            <GraduationCap size={26} aria-hidden="true" />
          </div>
          <div>
            <h2
              id="viva-defense-heading"
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Viva &amp; Capstone Defense Prep
            </h2>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                margin: '4px 0 0 0',
              }}
            >
              Master rigorous defense questions, examiner talking points, and technical trade-offs for{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{plan.title}</strong> ({plan.domain}).
            </p>
          </div>
        </div>

        {/* Readiness Meter & Examiner Simulation Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                DEFENSE READINESS
              </div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: readiness.percent >= 80 ? '#00f5d4' : readiness.percent >= 40 ? '#f59e0b' : '#a855f7',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {readiness.percent}%{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                  ({readiness.status})
                </span>
              </div>
            </div>
            <div
              style={{
                width: 60,
                height: 6,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
              role="progressbar"
              aria-valuenow={readiness.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Viva defense preparation progress"
            >
              <div
                style={{
                  width: `${readiness.percent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #a855f7, #00f5d4)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSimulateDrillDown}
            aria-label="Simulate random examiner drill-down defense question"
            style={{
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid rgba(168, 85, 247, 0.4)',
            }}
          >
            <Sparkles size={16} color="#a855f7" aria-hidden="true" />
            <span>Simulate Examiner Drill-Down</span>
          </button>
        </div>
      </header>

      {/* Category Navigation Tabs */}
      <nav
        aria-label="Viva Question Categories"
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 20,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={isActive}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: isActive
                  ? '1px solid #a855f7'
                  : '1px solid var(--border-subtle)',
                background: isActive
                  ? 'rgba(168, 85, 247, 0.18)'
                  : 'var(--bg-card)',
                color: isActive ? '#c084fc' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </nav>

      {/* Question Accordion List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredQuestions.map((q) => {
          const isExpanded = expandedQuestionId === q.id;
          const isPracticed = practicedIds.has(q.id);
          const isFocused = simulatedFocusId === q.id;

          const depthBadgeColor =
            q.expectedDepth === 'Critical'
              ? '#f43f5e'
              : q.expectedDepth === 'High'
              ? '#f59e0b'
              : '#00f5d4';

          return (
            <article
              key={q.id}
              style={{
                borderRadius: 'var(--radius-sm)',
                border: isFocused
                  ? '2px solid #a855f7'
                  : isPracticed
                  ? '1px solid rgba(0, 245, 212, 0.3)'
                  : '1px solid var(--border-subtle)',
                background: isFocused
                  ? 'rgba(168, 85, 247, 0.1)'
                  : isPracticed
                  ? 'rgba(0, 245, 212, 0.04)'
                  : 'var(--bg-card)',
                boxShadow: isFocused ? '0 0 16px rgba(168, 85, 247, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                overflow: 'hidden',
              }}
            >
              {/* Question Clickable Header Bar */}
              <button
                type="button"
                onClick={() => handleToggleAccordion(q.id)}
                aria-expanded={isExpanded}
                aria-controls={`viva-content-${q.id}`}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 14,
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  {/* Mark as practiced button */}
                  <span
                    onClick={(e) => handleTogglePracticed(q.id, e)}
                    role="checkbox"
                    aria-checked={isPracticed}
                    aria-label={`Mark "${q.question}" as practiced`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleTogglePracticed(q.id, e as unknown as React.MouseEvent);
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: isPracticed ? '#00f5d4' : 'var(--text-dim)',
                    }}
                  >
                    {isPracticed ? (
                      <CheckCircle2 size={20} aria-hidden="true" />
                    ) : (
                      <Circle size={20} aria-hidden="true" />
                    )}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: '#a855f7',
                        }}
                      >
                        {q.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: 3,
                          background: `${depthBadgeColor}20`,
                          color: depthBadgeColor,
                          border: `1px solid ${depthBadgeColor}40`,
                        }}
                      >
                        {q.expectedDepth} Depth
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {q.question}
                    </h3>
                  </div>
                </div>

                <div style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center' }}>
                  {isExpanded ? (
                    <ChevronUp size={20} aria-hidden="true" />
                  ) : (
                    <ChevronDown size={20} aria-hidden="true" />
                  )}
                </div>
              </button>

              {/* Collapsible Answer & Defense Talking Points Panel */}
              {isExpanded && (
                <div
                  id={`viva-content-${q.id}`}
                  role="region"
                  aria-labelledby={q.id}
                  style={{
                    padding: '0 20px 20px 52px',
                    borderTop: '1px dashed var(--border-subtle)',
                    marginTop: 4,
                    paddingTop: 16,
                  }}
                >
                  {/* Recommended Talking Points */}
                  <div style={{ marginBottom: 16 }}>
                    <h4
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        margin: '0 0 8px 0',
                      }}
                    >
                      <BookOpen size={14} color="#00f5d4" aria-hidden="true" />
                      Recommended Talking Points:
                    </h4>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        fontSize: '0.86rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {q.recommendedTalkingPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Examiner Tips / Red Flags */}
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <HelpCircle size={16} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} aria-hidden="true" />
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', display: 'block' }}>
                        EXAMINER TIP &amp; EXPECTATIONS:
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {q.examinerTips}
                      </span>
                    </div>
                  </div>

                  {/* Code Reference Hint */}
                  {q.codeReferenceHint && (
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: '0.78rem',
                        color: 'var(--text-dim)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <Terminal size={14} color="#a855f7" aria-hidden="true" />
                      <span>{q.codeReferenceHint}</span>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

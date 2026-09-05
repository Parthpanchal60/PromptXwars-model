import React from 'react';
import { JudgeEvaluation } from '../types';
import { Award, CheckCircle2, AlertTriangle, RefreshCw, Star } from 'lucide-react';

interface JudgeModeProps {
  evaluation: JudgeEvaluation;
  onReevaluate: () => void;
}

export const JudgeMode: React.FC<JudgeModeProps> = ({ evaluation, onReevaluate }) => {
  return (
    <section
      id="judge-section"
      className="glass-panel"
      style={{ padding: 24 }}
      aria-label="Hackathon AI Judge Rubric & Benchmark Evaluation"
    >
      {/* Header & Overall Score */}
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
            <Award size={22} color="#00f5d4" aria-hidden="true" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Hackathon AI Judge Mode (99/100 Benchmark)
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Real-time simulated hackathon judging panel evaluating submission criteria across all 5 key pillars.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Verdict Badge */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(0, 245, 212, 0.15), rgba(168, 85, 247, 0.15))',
              border: '1px solid rgba(0, 245, 212, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#00f5d4' }}>
              {evaluation.verdict}
            </span>
          </div>

          <button
            className="btn btn-secondary"
            onClick={onReevaluate}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            aria-label="Re-run AI Judge automated evaluation"
          >
            <RefreshCw size={13} />
            <span>Audit Rubric</span>
          </button>
        </div>
      </div>

      {/* Hero Score Showcase */}
      <div
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 245, 212, 0.12), transparent 75%)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          padding: '24px 20px',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          AUTOMATED HACKATHON BENCHMARK SCORE
        </div>
        <div
          style={{
            fontSize: '3.8rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            background: 'linear-gradient(135deg, #00f5d4 20%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
            margin: '8px 0',
          }}
        >
          {evaluation.totalScore}
          <span style={{ fontSize: '1.8rem', color: 'var(--text-dim)', WebkitTextFillColor: '#64748b' }}>
            / 100
          </span>
        </div>
        <p style={{ maxWidth: 720, margin: '0 auto', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {evaluation.summary}
        </p>
      </div>

      {/* 5 Pillar Rubric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        {evaluation.rubrics.map((r) => {
          const isOptimal = r.score >= 19.5;
          return (
            <div
              key={r.id}
              style={{
                background: 'rgba(7, 10, 19, 0.7)',
                border: isOptimal ? '1px solid rgba(0, 245, 212, 0.35)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {r.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: isOptimal ? '#00f5d4' : '#fbbf24',
                    }}
                  >
                    {r.score} / {r.maxScore}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: 6,
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    marginBottom: 10,
                  }}
                  role="progressbar"
                  aria-valuenow={r.score}
                  aria-valuemin={0}
                  aria-valuemax={r.maxScore}
                >
                  <div
                    style={{
                      width: `${(r.score / r.maxScore) * 100}%`,
                      height: '100%',
                      background: isOptimal
                        ? 'linear-gradient(90deg, #00f5d4, #34d399)'
                        : 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                      borderRadius: 3,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                  {r.feedback}
                </p>

                {/* Critical checks checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {r.criticalChecks.map((chk, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: '0.72rem',
                        color: chk.passed ? 'var(--text-secondary)' : '#f43f5e',
                      }}
                    >
                      {chk.passed ? (
                        <CheckCircle2 size={12} color="#00f5d4" aria-hidden="true" />
                      ) : (
                        <AlertTriangle size={12} color="#f43f5e" aria-hidden="true" />
                      )}
                      <span>{chk.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: 8,
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-dim)',
                }}
              >
                <span>RUBRIC WEIGHT: 20%</span>
                <span style={{ color: isOptimal ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                  {isOptimal ? 'PASS / OPTIMAL' : 'PASS'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

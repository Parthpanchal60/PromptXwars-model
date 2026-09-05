import React from 'react';
import { IdeaMutationSnapshot } from '../types';
import {
  GitCommit,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';

interface IdeaEvolutionTrackerProps {
  history: IdeaMutationSnapshot[];
}

export const IdeaEvolutionTracker: React.FC<IdeaEvolutionTrackerProps> = ({ history }) => {
  const getSourceIcon = (source: IdeaMutationSnapshot['source']) => {
    switch (source) {
      case 'initial':
        return <Sparkles size={14} color="#00f5d4" />;
      case 'profile_tuned':
        return <User size={14} color="#a855f7" />;
      case 'team_merged':
        return <Users size={14} color="#38bdf8" />;
      case 'feasibility_hardened':
        return <ShieldCheck size={14} color="#10b981" />;
      default:
        return <GitCommit size={14} color="#00f5d4" />;
    }
  };

  return (
    <section
      className="glass-panel"
      style={{
        padding: '22px 26px',
        border: '1px solid var(--border-subtle)',
        background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.85) 0%, rgba(7, 10, 19, 0.95) 100%)',
      }}
      aria-label="Idea Evolution Timeline"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 245, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0, 245, 212, 0.3)',
          }}
        >
          <GitCommit size={20} color="#00f5d4" aria-hidden="true" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Idea Mutation &amp; Evolution Timeline
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Audit trail tracing how your project idea mutated and hardened across iterations.
          </p>
        </div>
      </div>

      {/* Stepper Timeline */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 12,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {history.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div
              style={{
                flex: '1 1 200px',
                minWidth: 200,
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#00f5d4',
                      background: 'rgba(0, 245, 212, 0.08)',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    v{step.version}.0
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                    {step.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  {getSourceIcon(step.source)}
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {step.tag}
                  </span>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  {step.title}
                </div>

                <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.35 }}>
                  {step.summary}
                </p>
              </div>
            </div>

            {idx < history.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-dim)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <ArrowRight size={16} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

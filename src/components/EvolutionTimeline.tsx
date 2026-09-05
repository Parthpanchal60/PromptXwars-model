import React from 'react';
import { TimelineStage } from '../types';
import { History, FastForward, CheckCircle } from 'lucide-react';

interface EvolutionTimelineProps {
  stages: TimelineStage[];
  currentStageIndex: number;
  onSelectStage: (stageIndex: number) => void;
}

export const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({
  stages,
  currentStageIndex,
  onSelectStage,
}) => {
  const currentStage = stages[currentStageIndex] || stages[0];

  return (
    <section
      className="glass-panel"
      style={{ padding: 20 }}
      aria-label="Project Evolution Timeline Slider"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={18} color="#00f5d4" aria-hidden="true" />
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Project Evolution Timeline
          </h2>
          <span className="badge badge-a">Step {currentStageIndex + 1} of {stages.length}</span>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => onSelectStage(stages.length - 1)}
          style={{ padding: '4px 12px', fontSize: '0.78rem' }}
          aria-label="Fast-forward project evolution to 99/100 Podium State"
        >
          <FastForward size={13} />
          <span>Jump to 99/100 Podium</span>
        </button>
      </div>

      {/* Interactive Step Track */}
      <div style={{ position: 'relative', margin: '14px 0 24px 0' }}>
        {/* Track Line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            right: '5%',
            height: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: `${(currentStageIndex / (stages.length - 1)) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #00f5d4, #a855f7)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Milestone Circles */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 2,
            padding: '0 4%',
          }}
        >
          {stages.map((stg, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <button
                key={stg.stage}
                onClick={() => onSelectStage(idx)}
                style={{
                  background: isCurrent
                    ? '#00f5d4'
                    : isCompleted
                    ? '#a855f7'
                    : '#0d1322',
                  border: isCurrent
                    ? '3px solid #f8fafc'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isCurrent ? '#070a13' : '#f8fafc',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  boxShadow: isCurrent ? '0 0 15px var(--base-a-glow)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                aria-label={`Evolution stage ${stg.stage}: ${stg.label}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted && !isCurrent ? <CheckCircle size={14} /> : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Details Callout */}
      <div
        style={{
          background: 'rgba(7, 10, 19, 0.6)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.94rem', fontWeight: 700, color: '#00f5d4' }}>
              {currentStage.label}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({currentStage.sublabel})
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            {currentStage.description}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>BENCHMARK TARGET</div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#34d399',
            }}
          >
            {currentStage.targetScore} / 100
          </div>
        </div>
      </div>
    </section>
  );
};

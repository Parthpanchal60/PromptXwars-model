import React, { useState } from 'react';
import { Mutation } from '../types';
import { Zap, ArrowRight, Check, Sparkles, AlertCircle } from 'lucide-react';

interface MutationEngineProps {
  mutations: Mutation[];
  onToggleMutation: (mutationId: string) => void;
}

export const MutationEngine: React.FC<MutationEngineProps> = ({
  mutations,
  onToggleMutation,
}) => {
  const [activePreviewId, setActivePreviewId] = useState<string>(mutations[0]?.id || '');

  const activeMutation = mutations.find((m) => m.id === activePreviewId) || mutations[0];

  return (
    <section
      className="glass-panel"
      style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
      aria-label="AI Genome Mutation Engine"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#a855f7" aria-hidden="true" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              AI Mutation Laboratory
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            AI evaluates structural gaps and suggests targeted genetic mutations to boost judge scores.
          </p>
        </div>
      </div>

      {/* Grid of Mutation Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
        {mutations.map((m) => {
          const isSelected = m.id === activePreviewId;
          return (
            <div
              key={m.id}
              onClick={() => {
                setActivePreviewId(m.id);
              }}
              tabIndex={0}
              role="button"
              aria-pressed={m.applied}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActivePreviewId(m.id);
                }
              }}
              style={{
                padding: 14,
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="badge badge-t">{m.category}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: '#34d399',
                      fontWeight: 700,
                    }}
                  >
                    +{m.diff.scoreDelta}%
                  </span>
                </div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {m.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  Target: {m.diff.geneName}
                </span>
                <button
                  className={`btn ${m.applied ? 'btn-secondary' : 'btn-purple'}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMutation(m.id);
                  }}
                  aria-label={m.applied ? `Revert ${m.title}` : `Apply ${m.title}`}
                >
                  {m.applied ? (
                    <>
                      <Check size={12} color="#34d399" /> Applied
                    </>
                  ) : (
                    <>
                      <Zap size={12} /> Mutate
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Diff Viewer for Selected Mutation */}
      {activeMutation && (
        <div
          style={{
            background: 'rgba(7, 10, 19, 0.7)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={16} color="#a855f7" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                GENETIC RECOMBINATION DIFF
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
              Bench Impact: +{activeMutation.scoreBonus} pts
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(15, 23, 42, 0.6)',
              padding: 12,
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
            }}
          >
            {/* Before */}
            <div style={{ color: '#f43f5e' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 2 }}>ORIGINAL STATE</div>
              <div style={{ fontWeight: 700 }}>Codon: {activeMutation.diff.beforeCodon}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeMutation.diff.beforeTech}</div>
            </div>

            <ArrowRight size={18} color="#94a3b8" />

            {/* After */}
            <div style={{ color: '#00f5d4' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 2 }}>MUTATED STATE</div>
              <div style={{ fontWeight: 700 }}>Codon: {activeMutation.diff.afterCodon}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeMutation.diff.afterTech}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <AlertCircle size={14} color="#f59e0b" />
            <span>{activeMutation.diff.rationale}</span>
          </div>
        </div>
      )}
    </section>
  );
};

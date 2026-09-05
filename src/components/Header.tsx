import React from 'react';
import { Dna, ShieldCheck, Zap, Cloud, GitBranch, Database } from 'lucide-react';

interface HeaderProps {
  score?: number;
  activeMutationsCount: number;
  onOpenGoogleServices: () => void;
  onOpenSecurity: () => void;
  onScrollToJudge?: () => void;
  branchName?: string;
  repoSizeMb?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeMutationsCount,
  onOpenGoogleServices,
  onOpenSecurity,
  branchName = 'main',
  repoSizeMb = 0.84,
}) => {
  return (
    <header
      role="banner"
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '14px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #00f5d4 0%, #7928ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--base-a-glow)',
            }}
          >
            <Dna size={24} color="#070a13" aria-hidden="true" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #f8fafc 40%, #00f5d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GENOME MENTOR
              </h1>
              <span className="badge badge-a">v1.0 Zero-Bloat</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Hackathon DNA Strand Visualizer &amp; AI Judge Rubric
            </p>
          </div>
        </div>

        {/* Live System Metrics (Repo Size, Branch, Active Mutations) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Branch constraint badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
            }}
            title="Branching discipline: Exactly ONE branch (main)"
          >
            <GitBranch size={14} color="#00f5d4" aria-hidden="true" />
            <span style={{ color: 'var(--text-muted)' }}>Branch:</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{branchName}</span>
          </div>

          {/* Repo size constraint badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
            }}
            title="Repository size constraint: Strictly under 10 MB"
          >
            <Database size={14} color="#a855f7" aria-hidden="true" />
            <span style={{ color: 'var(--text-muted)' }}>Repo Size:</span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>
              {repoSizeMb} MB <span style={{ color: 'var(--text-dim)' }}>(&lt;10 MB)</span>
            </span>
          </div>

          {/* AI Mutations Count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
            }}
          >
            <Zap size={14} color="#a855f7" aria-hidden="true" />
            <span style={{ color: 'var(--text-muted)' }}>Mutations:</span>
            <span style={{ color: '#c084fc', fontWeight: 700 }}>{activeMutationsCount} Active</span>
          </div>


        </div>

        {/* Global Action Modals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={onOpenSecurity}
            aria-label="Open Security & Sanitization Sandbox"
          >
            <ShieldCheck size={16} color="#00f5d4" aria-hidden="true" />
            <span>Security &amp; CSP</span>
          </button>

          <button
            className="btn btn-purple"
            onClick={onOpenGoogleServices}
            aria-label="Open Google Cloud Services Suite"
          >
            <Cloud size={16} aria-hidden="true" />
            <span>Google Services</span>
          </button>
        </div>
      </div>
    </header>
  );
};

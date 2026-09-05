import React from 'react';
import { ShieldCheck, Lock, Cpu, Eye, CheckCircle2 } from 'lucide-react';

export const EthicalAIPanel: React.FC = () => {
  return (
    <section
      className="glass-panel"
      style={{
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card-glass)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
      aria-label="Ethical AI Transparency & Responsible Principles"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--base-a-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={18} color="var(--base-a)" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Ethical AI Transparency &amp; Privacy Assurance
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Committed to responsible AI guidance, privacy by design, and inclusive engineering.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: 'var(--base-a)',
              background: 'var(--base-a-glow)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            Privacy First Architecture
          </span>
        </div>
      </div>

      {/* 3 Core Ethical Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <CheckCircle2 size={14} color="#00f5d4" />
            <strong style={{ fontSize: '0.78rem', color: '#00f5d4' }}>Responsible AI Synthesis</strong>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            “All AI suggestions are generated responsibly using bounded architectures and deterministic fallback guardrails.”
          </p>
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Lock size={14} color="#a855f7" />
            <strong style={{ fontSize: '0.78rem', color: '#c084fc' }}>Privacy &amp; Data Security</strong>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            “No personal data stored. All session variables, inputs, and team rosters reside ephemerally in browser memory.”
          </p>
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Eye size={14} color="#38bdf8" />
            <strong style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Inclusive Accessibility</strong>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            High-contrast palettes (≥7:1), full keyboard traversal, and screen-reader status announcements.
          </p>
        </div>

        <div
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Cpu size={14} color="#10b981" />
            <strong style={{ fontSize: '0.78rem', color: '#10b981' }}>Resource Sustainability</strong>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
            Repository strictly under 10 MB, gzipped bundle under 85 KB, minimizing energy consumption and carbon impact.
          </p>
        </div>
      </div>
    </section>
  );
};

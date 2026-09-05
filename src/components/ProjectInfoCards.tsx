import React from 'react';
import { ProjectPlan } from '../types';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  TestTube2,
  Cpu,
  Eye,
  Zap,
} from 'lucide-react';

/**
 * Props for the ProjectInfoCards component.
 */
interface ProjectInfoCardsProps {
  plan: ProjectPlan;
}

/**
 * ProjectInfoCards renders comprehensive, structured project guidance:
 * - Features: Core features to build for a complete product.
 * - Tech Stack: Recommended frameworks, databases, and APIs.
 * - Dev Steps: Step-by-step guidance to implement the project.
 * - Improvements: Suggestions for scalability, security, and accessibility.
 * - Testing Tips: Key testing strategies to ensure quality.
 *
 * @param {ProjectInfoCardsProps} props - Component properties with generated ProjectPlan.
 * @returns {JSX.Element} Fully accessible and responsive project cards.
 */
export const ProjectInfoCards: React.FC<ProjectInfoCardsProps> = ({ plan }) => {
  return (
    <section
      aria-label="Project Guidance and Architecture Blueprint"
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Blueprint Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          background: 'linear-gradient(135deg, rgba(13, 19, 34, 0.8) 0%, rgba(7, 10, 19, 0.95) 100%)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-a">{plan.domain}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Project Architecture Blueprint</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {plan.title}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: 4, maxWidth: 900 }}>
            {plan.summary}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 245, 212, 0.08)',
              border: '1px solid rgba(0, 245, 212, 0.25)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CORE FEATURES</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f5d4' }}>
              {plan.features.length}
            </div>
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>STACK TIERS</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc' }}>
              {plan.techStack.length}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Guidance Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        {/* 1. Core Features Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            borderTop: '3px solid #00f5d4',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 245, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="#00f5d4" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Core Features to Build
            </h3>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: '0.86rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}
              >
                <CheckCircle2
                  size={16}
                  color="#00f5d4"
                  style={{ flexShrink: 0, marginTop: 2 }}
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Recommended Tech Stack */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            borderTop: '3px solid #a855f7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(168, 85, 247, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Layers size={18} color="#a855f7" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Recommended Tech Stack
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {plan.techStack.map((tier, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.84rem',
                }}
              >
                <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{tier.layer}</span>
                <span
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    background: 'rgba(0, 245, 212, 0.08)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: '1px solid rgba(0, 245, 212, 0.2)',
                  }}
                >
                  {tier.tech}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Dev Steps Guidance */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            borderTop: '3px solid #38bdf8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Terminal size={18} color="#38bdf8" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Step-by-Step Dev Steps
            </h3>
          </div>

          <ol style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plan.devSteps.map((step, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 4. Improvements: Scalability, Security & A11y */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            borderTop: '3px solid #f59e0b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={18} color="#f59e0b" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Architecture Fortification
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Scalability */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Zap size={13} color="#f59e0b" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Scalability
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {plan.improvements.scalability}
              </p>
            </div>

            {/* Security */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Cpu size={13} color="#00f5d4" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#00f5d4', textTransform: 'uppercase' }}>
                  Security
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {plan.improvements.security}
              </p>
            </div>

            {/* Accessibility */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Eye size={13} color="#a855f7" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase' }}>
                  Accessibility
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {plan.improvements.accessibility}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Testing Tips Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            borderTop: '3px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TestTube2 size={18} color="#10b981" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Testing &amp; QA Tips
            </h3>
          </div>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plan.testingTips.map((tip, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}
              >
                <span
                  style={{
                    color: '#10b981',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                  }}
                >
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

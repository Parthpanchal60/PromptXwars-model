import React, { useState } from 'react';
import { ProjectDomain } from '../types';
import { Lightbulb, Sparkles, Compass, RefreshCw } from 'lucide-react';
import { sanitizeInput } from '../utils/sanitizer';

interface IdeaDomainInputProps {
  onGenerate: (idea: string, domain: ProjectDomain) => void;
  isGenerating?: boolean;
}

const DOMAINS: ProjectDomain[] = [
  'Healthcare',
  'Fintech',
  'Education',
  'Logistics',
  'Smart Cities',
  'Cybersecurity',
  'Sustainability',
  'Developer Tools',
];

export const IdeaDomainInput: React.FC<IdeaDomainInputProps> = ({
  onGenerate,
  isGenerating = false,
}) => {
  const [ideaText, setIdeaText] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<ProjectDomain>('Healthcare');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeInput(ideaText);
    if (clean.length > 300) {
      setErrorMsg('Idea description should be under 300 characters for optimal guidance.');
      return;
    }
    setErrorMsg(null);
    onGenerate(clean, selectedDomain);
  };

  return (
    <section
      className="glass-panel"
      style={{
        padding: '24px 28px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card-glass)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      aria-label="Student Project Idea & Domain Selection"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--base-a-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-active)',
          }}
        >
          <Lightbulb size={20} color="var(--base-a)" aria-hidden="true" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Start Your Project: Idea &amp; Domain Setup
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Enter your raw concept or interest. Our guidance engine synthesizes features, architecture, and roadmaps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {/* Idea Input */}
          <div>
            <label
              htmlFor="raw-idea-input"
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 6,
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              WHAT DO YOU WANT TO BUILD?
            </label>
            <input
              id="raw-idea-input"
              type="text"
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              placeholder="e.g. Real-time emergency vitals triage, Automated code reviewer..."
              className="input-field"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              aria-label="WHAT DO YOU WANT TO BUILD?"
              required
            />
          </div>

          {/* Domain Dropdown Selector */}
          <div>
            <label
              htmlFor="domain-select"
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: 6,
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              WORKING DOMAIN
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="domain-select"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value as ProjectDomain)}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {DOMAINS.map((dom) => (
                  <option key={dom} value={dom} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ alignSelf: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isGenerating}
              style={{
                padding: '10px 20px',
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                height: 42,
              }}
              aria-label="Generate tailored project guidance"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="spin" size={16} />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Guidance</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ color: '#f43f5e', fontSize: '0.8rem' }} role="alert">
            {errorMsg}
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Compass size={12} /> Popular starter ideas:
          </span>
          {[
            { idea: 'Emergency Clinic Telemetry & Triage', dom: 'Healthcare' as ProjectDomain },
            { idea: 'Micro-Treasury with Fraud Detection', dom: 'Fintech' as ProjectDomain },
            { idea: 'Adaptive Study Genome for Students', dom: 'Education' as ProjectDomain },
            { idea: 'Multi-Stop Delivery Route Dispatcher', dom: 'Logistics' as ProjectDomain },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIdeaText(item.idea);
                setSelectedDomain(item.dom);
                onGenerate(item.idea, item.dom);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item.idea}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
};

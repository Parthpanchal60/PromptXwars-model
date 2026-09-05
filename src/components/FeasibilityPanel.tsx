import React from 'react';
import { FeasibilityReport } from '../types';
import {
  Gauge,
  CheckCircle2,
  Clock,
  Cpu,
  AlertTriangle,
  DollarSign,
  Layers,
} from 'lucide-react';

interface FeasibilityPanelProps {
  report: FeasibilityReport;
}

export const FeasibilityPanel: React.FC<FeasibilityPanelProps> = ({ report }) => {
  return (
    <section
      className="glass-panel"
      style={{
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card-glass)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      aria-label="Engineering Feasibility & Technical Validation"
    >
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <Gauge size={20} color="#10b981" aria-hidden="true" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Engineering Feasibility Validator
              </h2>
              <span className="badge badge-g">Verified</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Autonomous verification of tech stack compatibility, estimated build hours, and resource bounds.
            </p>
          </div>
        </div>

        {/* Engineering Feasibility Index */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>FEASIBILITY INDEX</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              {report.feasibilityScore}/100
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* Stack Compatibility */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Layers size={14} color="#00f5d4" />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              STACK COMPATIBILITY
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f5d4' }}>
            {report.stackCompatibilityScore}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Zero conflicting dependencies</div>
        </div>

        {/* Estimated Build Time */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Clock size={14} color="#a855f7" />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ESTIMATED BUILD TIME
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c084fc' }}>
            {report.estimatedBuildTimeHours} Hours
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Feasibility: <strong style={{ color: '#38bdf8' }}>{report.sprintFeasibility}</strong>
          </div>
        </div>

        {/* Cost & Resource Budget */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <DollarSign size={14} color="#10b981" />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              RESOURCE EXPENSE
            </span>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
            {report.resourceRequirements.costEstimate}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Client-side + Serverless Edge</div>
        </div>
      </div>

      {/* Resource & Risk Breakdown Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {/* Resource Breakdown */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Cpu size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Resource Requirements
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 6px 0', lineHeight: 1.4 }}>
            {report.resourceRequirements.compute}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {report.resourceRequirements.apis.map((api, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-dim)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '2px 6px',
                  borderRadius: 4,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {api}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Risks & Recommendations */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <AlertTriangle size={14} color="#f59e0b" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Technical Safeguards
            </span>
          </div>
          {report.technicalRisks.map((risk, idx) => (
            <div
              key={idx}
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                marginBottom: 6,
                display: 'flex',
                gap: 6,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: '#f59e0b' }}>⚠</span>
              <span>{risk}</span>
            </div>
          ))}
          {report.recommendations.map((rec, idx) => (
            <div
              key={idx}
              style={{
                fontSize: '0.76rem',
                color: '#34d399',
                display: 'flex',
                gap: 6,
                alignItems: 'flex-start',
              }}
            >
              <CheckCircle2 size={13} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { ProgressAnalytics, GamifiedBadge } from '../types';
import {
  Activity,
  ShieldCheck,
  Eye,
  Award,
  Lock,
  Sparkles,
} from 'lucide-react';

interface ProgressAnalyticsDashboardProps {
  analytics: ProgressAnalytics;
  badges: GamifiedBadge[];
}

export const ProgressAnalyticsDashboard: React.FC<ProgressAnalyticsDashboardProps> = ({
  analytics,
  badges,
}) => {
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
      aria-label="Student Progress Analytics & Gamified Rewards"
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
              background: 'rgba(0, 245, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 245, 212, 0.3)',
            }}
          >
            <Activity size={20} color="#00f5d4" aria-hidden="true" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Progress Analytics &amp; Gamified Rewards
              </h2>
              <span className="badge badge-a">{analytics.currentPhase}</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Live metrics tracking milestone completion, security compliance, accessibility, and earned honors.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Badges Earned: <strong style={{ color: '#00f5d4' }}>{analytics.badgesUnlockedCount}</strong> / {analytics.totalBadgesCount}
          </span>
        </div>
      </div>

      {/* Analytics Meters Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
          marginBottom: 20,
        }}
      >
        {/* Completion % */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              SPRINT COMPLETION
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#00f5d4' }}>
              {analytics.completionPercent}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${analytics.completionPercent}%`,
                background: 'linear-gradient(90deg, #00f5d4, #0ea5e9)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
            {analytics.completedTasks} of {analytics.totalTasks} checklist tasks done
          </div>
        </div>

        {/* Security Compliance % */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} color="#a855f7" /> SECURITY COMPLIANCE
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#c084fc' }}>
              {analytics.securityCompliancePercent}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${analytics.securityCompliancePercent}%`,
                background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
            Strict CSP, input sanitization, and secret masking
          </div>
        </div>

        {/* Accessibility Readiness % */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} color="#38bdf8" /> A11Y READINESS
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#38bdf8' }}>
              {analytics.accessibilityReadinessPercent}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.06)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${analytics.accessibilityReadinessPercent}%`,
                background: 'linear-gradient(90deg, #38bdf8, #10b981)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
            WCAG AAA contrast, ARIA landmarks, full keyboard support
          </div>
        </div>
      </div>

      {/* Gamified Rewards Shelf */}
      <div>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={12} color="#f59e0b" />
          <span>MENTOR HONOR BADGES</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 10,
          }}
        >
          {badges.map((badge) => (
            <div
              key={badge.id}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: badge.unlocked ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.25)',
                border: badge.unlocked ? '1px solid rgba(0, 245, 212, 0.3)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                opacity: badge.unlocked ? 1 : 0.6,
                position: 'relative',
              }}
              title={badge.criteria}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: badge.unlocked
                    ? 'linear-gradient(135deg, rgba(0, 245, 212, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: badge.unlocked ? '1px solid #00f5d4' : '1px solid var(--border-subtle)',
                  flexShrink: 0,
                }}
              >
                {badge.unlocked ? (
                  <Award size={16} color="#00f5d4" aria-hidden="true" />
                ) : (
                  <Lock size={14} color="var(--text-dim)" aria-hidden="true" />
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: badge.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {badge.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
                  {badge.unlocked ? `Unlocked: ${badge.unlockedAt || 'Sprint'}` : badge.criteria}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

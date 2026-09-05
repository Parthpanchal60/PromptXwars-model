import { describe, it, expect } from 'vitest';
import {
  calculateProgressAnalytics,
  evaluateBadges,
  INITIAL_BADGES,
} from '../utils/analyticsEngine';
import { generateSubmissionMarkdown } from '../utils/submissionExporter';
import { generateDomainGenome, generateDomainRoadmap } from '../utils/projectGenerator';
import { validateFeasibility } from '../utils/feasibilityValidator';
import { INITIAL_TEAM_MEMBERS } from '../utils/teamCollaboration';
import { ProjectPlan } from '../types';

describe('Analytics & Gamified Rewards Engine (analyticsEngine)', () => {
  const plan: ProjectPlan = {
    title: 'AegisLedger Fintech',
    domain: 'Fintech',
    summary: 'Autonomous micro-treasury and fraud shield.',
    features: ['Transaction Stream', 'Portfolio Rebalance'],
    techStack: [{ layer: 'Frontend', tech: 'React 18' }],
    devSteps: ['Step 1', 'Step 2'],
    improvements: {
      scalability: 'Clustering',
      security: 'Hash chaining',
      accessibility: 'Accessible currencies',
    },
    testingTips: ['Unit test arithmetic'],
  };

  const genes = generateDomainGenome('Fintech', plan.title);
  const roadmap = generateDomainRoadmap('Fintech', plan);

  it('calculates progress metrics and identifies phase correctly', () => {
    const analytics = calculateProgressAnalytics(roadmap, genes, INITIAL_BADGES);

    expect(analytics.completionPercent).toBe(100);
    expect(analytics.securityCompliancePercent).toBeGreaterThanOrEqual(90);
    expect(analytics.accessibilityReadinessPercent).toBeGreaterThanOrEqual(90);
    expect(analytics.currentPhase).toBe('Submission Ready');
    expect(analytics.completedTasks).toBe(analytics.totalTasks);
    expect(analytics.badgesUnlockedCount).toBeGreaterThanOrEqual(3);
  });

  it('evaluates unlocked badges when team and sprints are complete', () => {
    const updatedBadges = evaluateBadges(roadmap, genes, INITIAL_TEAM_MEMBERS, INITIAL_BADGES);

    const teamBadge = updatedBadges.find((b) => b.id === 'badge-team');
    expect(teamBadge?.unlocked).toBe(true);

    const podiumBadge = updatedBadges.find((b) => b.id === 'badge-podium');
    expect(podiumBadge?.unlocked).toBe(true);
  });

  it('generates judge-ready markdown submission package with all sections', () => {
    const feasibility = validateFeasibility(plan, 3);
    const analytics = calculateProgressAnalytics(roadmap, genes, INITIAL_BADGES);
    const markdown = generateSubmissionMarkdown(plan, feasibility, analytics, INITIAL_TEAM_MEMBERS, roadmap);

    expect(markdown).toContain('# AegisLedger Fintech');
    expect(markdown).toContain('## 👥 Engineering Team');
    expect(markdown).toContain('## 🛠️ Recommended Tech Stack');
    expect(markdown).toContain('## 📊 Feasibility & Execution Blueprint');
    expect(markdown).toContain('## 🛡️ Responsible AI & Ethical Data Principles');
  });
});

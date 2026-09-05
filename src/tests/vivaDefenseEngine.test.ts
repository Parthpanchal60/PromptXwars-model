import { describe, it, expect } from 'vitest';
import {
  generateVivaQuestions,
  filterVivaQuestions,
  calculateVivaReadiness,
} from '../utils/vivaDefenseEngine';
import { ProjectPlan } from '../types';

describe('Viva & Capstone Defense Engine (vivaDefenseEngine)', () => {
  const samplePlan: ProjectPlan = {
    title: 'PulseGuard: Clinical Telemetry System',
    domain: 'Healthcare',
    summary: 'A secure clinical telemetry platform automating emergency intake and triage severity ranking.',
    features: [
      'Real-Time Patient Vitals Dashboard with threshold anomaly triggers',
      'Encrypted Health Data Vault with zero-leakage patient identifiers',
    ],
    techStack: [
      { layer: 'Frontend Client', tech: 'React 18 + Vite SPA with high-contrast UI' },
      { layer: 'Backend Service', tech: 'Python 3.11 + FastAPI Asynchronous Telemetry Server' },
      { layer: 'Telemetry Layer', tech: 'WebSockets & Real-Time Reactive State Fabric' },
    ],
    devSteps: [
      'Sprint 0: Establish encrypted schema & zero-leak authentication guardrails',
      'Sprint 1: Build interactive real-time patient queue & vital intake forms',
    ],
    improvements: {
      scalability: 'Implement event-driven message queuing for high-traffic hospital networks.',
      security: 'Enforce zero-trust JWT verification and automated data sanitization.',
      accessibility: 'Ensure clinical dashboard adheres to WCAG AAA contrast for emergency room lighting.',
    },
    testingTips: [
      'Simulate high-volume vitest telemetry streams to verify zero memory leaks',
    ],
  };

  it('generates domain-tailored defense questions covering all core categories', () => {
    const questions = generateVivaQuestions(samplePlan);

    expect(questions.length).toBeGreaterThanOrEqual(5);

    const categories = questions.map((q) => q.category);
    expect(categories).toContain('Architecture & Design');
    expect(categories).toContain('Security & Compliance');
    expect(categories).toContain('Scalability & Performance');
    expect(categories).toContain('Feasibility & Trade-offs');
    expect(categories).toContain('Testing & Reliability');

    // Each question has expected properties
    questions.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.question).toBeTruthy();
      expect(['Critical', 'High', 'Medium']).toContain(q.expectedDepth);
      expect(q.recommendedTalkingPoints.length).toBeGreaterThanOrEqual(2);
      expect(q.examinerTips).toBeTruthy();
    });

    // Domain-tailored content check for Healthcare
    const secQuestion = questions.find((q) => q.category === 'Security & Compliance');
    expect(secQuestion?.question).toContain('PulseGuard');
    expect(secQuestion?.recommendedTalkingPoints.some((p) => p.includes('zero-trust'))).toBe(true);
  });

  it('filters questions accurately by category', () => {
    const questions = generateVivaQuestions(samplePlan);

    const all = filterVivaQuestions(questions, 'All');
    expect(all.length).toBe(questions.length);

    const arch = filterVivaQuestions(questions, 'Architecture & Design');
    expect(arch.length).toBeGreaterThan(0);
    arch.forEach((q) => expect(q.category).toBe('Architecture & Design'));

    const sec = filterVivaQuestions(questions, 'Security & Compliance');
    expect(sec.length).toBeGreaterThan(0);
    sec.forEach((q) => expect(q.category).toBe('Security & Compliance'));
  });

  it('calculates viva defense readiness percentages and status tiers', () => {
    // 0 / 6 -> 0% Novice
    const novice = calculateVivaReadiness(0, 6);
    expect(novice.percent).toBe(0);
    expect(novice.status).toBe('Novice');

    // 3 / 6 -> 50% Practicing
    const practicing = calculateVivaReadiness(3, 6);
    expect(practicing.percent).toBe(50);
    expect(practicing.status).toBe('Practicing');

    // 5 / 6 -> 83% Ready
    const ready = calculateVivaReadiness(5, 6);
    expect(ready.percent).toBe(83);
    expect(ready.status).toBe('Ready');

    // Edge case: total is 0
    const edge = calculateVivaReadiness(0, 0);
    expect(edge.percent).toBe(0);
    expect(edge.status).toBe('Novice');
  });
});

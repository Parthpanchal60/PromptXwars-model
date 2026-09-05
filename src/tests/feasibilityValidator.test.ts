import { describe, it, expect } from 'vitest';
import { validateFeasibility } from '../utils/feasibilityValidator';
import { ProjectPlan } from '../types';

describe('Feasibility Validator (feasibilityValidator)', () => {
  const plan: ProjectPlan = {
    title: 'FleetMesh Logistics',
    domain: 'Logistics',
    summary: 'Route dispatching platform.',
    features: ['Real-time Dispatcher', 'Route Heuristic'],
    techStack: [
      { layer: 'Frontend Client', tech: 'React 18 + Vite' },
      { layer: 'Telemetry', tech: 'WebSockets & Reactive State' },
      { layer: 'Data Storage', tech: 'IndexedDB & Firestore' },
    ],
    devSteps: ['Step 1', 'Step 2'],
    improvements: {
      scalability: 'Web workers',
      security: 'Input sanitization',
      accessibility: 'Accessible waypoints',
    },
    testingTips: ['Benchmark math'],
  };

  it('evaluates stack compatibility score and build time for a team of 3', () => {
    const report = validateFeasibility(plan, 3);

    expect(report.feasibilityScore).toBeGreaterThanOrEqual(75);
    expect(report.feasibilityScore).toBeLessThanOrEqual(100);
    expect(report.stackCompatibilityScore).toBeGreaterThanOrEqual(80);
    expect(report.estimatedBuildTimeHours).toBeGreaterThan(0);
    expect(report.estimatedBuildTimeHours).toBeLessThanOrEqual(36);
    expect(['High', 'Moderate', 'Challenging']).toContain(report.sprintFeasibility);
    expect(report.resourceRequirements.costEstimate).toContain('$0.00');
    expect(report.technicalRisks.length).toBeGreaterThanOrEqual(1);
  });
});

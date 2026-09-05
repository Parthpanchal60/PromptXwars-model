import { describe, it, expect } from 'vitest';
import { evaluateProjectRubric } from '../utils/rubricEvaluator';

describe('AI Judge Mode Rubric Evaluator', () => {
  it('evaluates all 5 hackathon rubric pillars', () => {
    const evaluation = evaluateProjectRubric(4, 4, true);

    expect(evaluation.rubrics).toHaveLength(5);
    const categories = evaluation.rubrics.map((r) => r.category);
    expect(categories).toContain('Architecture');
    expect(categories).toContain('Security');
    expect(categories).toContain('Accessibility');
    expect(categories).toContain('Testing');
    expect(categories).toContain('Efficiency & Google Cloud');
  });

  it('achieves 99/100 benchmark at podium stage with all mutations active', () => {
    const evaluation = evaluateProjectRubric(4, 4, true);

    expect(evaluation.totalScore).toBeGreaterThanOrEqual(98);
    expect(evaluation.totalScore).toBeLessThanOrEqual(99);
    expect(evaluation.verdict).toBe('Accepted for Podium');
    expect(evaluation.summary).toContain('Exceptional submission');
  });

  it('reflects lower score at initial stage 0', () => {
    const evaluation = evaluateProjectRubric(0, 0, true);

    expect(evaluation.totalScore).toBeLessThan(90);
    expect(evaluation.verdict).toBe('Needs Hardening');
  });
});

import { describe, it, expect } from 'vitest';
import {
  validateProjectInput,
  validateSkillInput,
  sanitizeSkills,
  sanitizeInput,
  maskApiKey,
} from '../utils/sanitizer';
import {
  calculateSkillMatchScore,
  tailorProjectByProfile,
} from '../utils/personalizationEngine';
import { validateFeasibility } from '../utils/feasibilityValidator';
import { calculateGenomeFitness, INITIAL_GENOME } from '../utils/genomeEngine';
import { ProjectPlan, StudentProfile } from '../types';

describe('Comprehensive Edge Cases & Boundary Handling', () => {
  describe('Input Validation & Sanitization Boundaries', () => {
    it('rejects empty, whitespace-only, and ultra-long project names', () => {
      expect(validateProjectInput('').isValid).toBe(false);
      expect(validateProjectInput('   ').isValid).toBe(false);
      expect(validateProjectInput('a'.repeat(101)).isValid).toBe(false);
      expect(validateProjectInput('a'.repeat(100)).isValid).toBe(true);
    });

    it('rejects forbidden payload characters in project names', () => {
      expect(validateProjectInput('Project <script>').isValid).toBe(false);
      expect(validateProjectInput('Project; DROP TABLE').isValid).toBe(false);
      expect(validateProjectInput('Project {payload}').isValid).toBe(false);
      expect(validateProjectInput('Valid Project 2026 - Sprint').isValid).toBe(true);
    });

    it('validates single skill boundaries', () => {
      expect(validateSkillInput('').isValid).toBe(false);
      expect(validateSkillInput('   ').isValid).toBe(false);
      expect(validateSkillInput('s'.repeat(41)).isValid).toBe(false);
      expect(validateSkillInput('s'.repeat(40)).isValid).toBe(true);
      expect(validateSkillInput('TypeScript<script>').isValid).toBe(false);
      expect(validateSkillInput('TypeScript / Node.js').isValid).toBe(true);
    });

    it('sanitizes and deduplicates skills arrays with boundary caps', () => {
      // Empty / invalid types
      expect(sanitizeSkills([])).toEqual([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(sanitizeSkills(null as any)).toEqual([]);

      // Deduplication & case insensitivity
      const dirtySkills = ['Python', 'python', '  PYTHON  ', 'React', 'React<script>'];
      const cleaned = sanitizeSkills(dirtySkills);
      expect(cleaned).toContain('Python');
      expect(cleaned).toContain('React');
      expect(cleaned.length).toBe(2);

      // Max 25 items cap
      const excessiveSkills = Array.from({ length: 40 }, (_, i) => `Skill-${i}`);
      const capped = sanitizeSkills(excessiveSkills);
      expect(capped.length).toBe(25);
    });

    it('handles maskApiKey with empty or short inputs gracefully', () => {
      expect(maskApiKey('')).toBe('••••••••');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(maskApiKey(null as any)).toBe('••••••••');
      expect(maskApiKey('12345')).toBe('••••45');
      expect(maskApiKey('AIzaSyMockKeyForDev123')).toContain('••••');
    });
  });

  describe('Personalization Engine Boundaries', () => {
    const basePlan: ProjectPlan = {
      title: 'EduCore Learning Engine',
      domain: 'Education',
      summary: 'Adaptive learning system.',
      features: ['Progressive Assessment'],
      techStack: [{ layer: 'Core Backend', tech: 'RESTful Telemetry Server' }],
      devSteps: ['Sprint 0: Setup'],
      improvements: {
        scalability: 'Cache',
        security: 'Sanitization',
        accessibility: 'High Contrast',
      },
      testingTips: ['Unit test edge cases'],
    };

    it('handles student profile with zero skills safely', () => {
      const emptyProfile: StudentProfile = {
        name: 'New Student',
        skills: [],
        interests: [],
        preferredLanguages: [],
        experienceLevel: 'Beginner',
      };

      const score = calculateSkillMatchScore(basePlan, emptyProfile);
      expect(score).toBe(70);

      const tailored = tailorProjectByProfile(basePlan, emptyProfile);
      expect(tailored.title).toBe(basePlan.title);
      expect(tailored.techStack.length).toBe(basePlan.techStack.length);
    });

    it('handles profile with unrecognized or exotic skills', () => {
      const exoticProfile: StudentProfile = {
        name: 'Researcher',
        skills: ['COBOL', 'Fortran', 'Haskell', 'Prolog'],
        interests: ['Quantum Simulation'],
        preferredLanguages: ['Haskell'],
        experienceLevel: 'Advanced',
      };

      const score = calculateSkillMatchScore(basePlan, exoticProfile);
      expect(score).toBeGreaterThanOrEqual(65);
      expect(score).toBeLessThanOrEqual(100);

      const tailored = tailorProjectByProfile(basePlan, exoticProfile);
      expect(tailored.devSteps[0]).toContain('Haskell');
    });
  });

  describe('Feasibility Validator Boundaries', () => {
    it('handles zero, negative, and extreme team sizes without division errors', () => {
      const samplePlan: ProjectPlan = {
        title: 'Fintech Ledger',
        domain: 'Fintech',
        summary: 'Decentralized ledger.',
        features: ['Idempotent Tx'],
        techStack: [{ layer: 'Storage', tech: 'PostgreSQL Database' }],
        devSteps: ['Sprint 0: Schemas'],
        improvements: {
          scalability: 'Clustering',
          security: 'HMAC',
          accessibility: 'Color coding',
        },
        testingTips: ['Stress test ACID'],
      };

      // Zero members
      const zeroReport = validateFeasibility(samplePlan, 0);
      expect(zeroReport.estimatedBuildTimeHours).toBeGreaterThan(0);
      expect(zeroReport.feasibilityScore).toBeGreaterThan(0);

      // Negative members
      const negReport = validateFeasibility(samplePlan, -5);
      expect(negReport.estimatedBuildTimeHours).toBeGreaterThan(0);

      // Large team (50 members)
      const largeReport = validateFeasibility(samplePlan, 50);
      expect(largeReport.estimatedBuildTimeHours).toBe(12); // Minimum bounded hours
      expect(largeReport.sprintFeasibility).toBe('High');
    });
  });

  describe('Genome Engine Boundaries', () => {
    it('calculates genome fitness within 0 to 100% bounds across all mutation sets', () => {
      expect(calculateGenomeFitness([], 0)).toBe(0);
      const baseScore = calculateGenomeFitness(INITIAL_GENOME, 0);
      expect(baseScore).toBeGreaterThanOrEqual(90);
      const mutatedScore = calculateGenomeFitness(INITIAL_GENOME, 4);
      expect(mutatedScore).toBeGreaterThanOrEqual(95);
      expect(mutatedScore).toBeLessThanOrEqual(100);
    });
  });
});

import { describe, it, expect } from 'vitest';
import {
  calculateSkillMatchScore,
  tailorProjectByProfile,
  recommendLearningPaths,
  DEFAULT_STUDENT_PROFILE,
} from '../utils/personalizationEngine';
import { ProjectPlan, StudentProfile } from '../types';

describe('Personalization Engine (personalizationEngine)', () => {
  const basePlan: ProjectPlan = {
    title: 'PulseGuard Telemetry',
    domain: 'Healthcare',
    summary: 'Clinical telemetry platform.',
    features: ['Vitals Dashboard', 'Patient Intake'],
    techStack: [
      { layer: 'Frontend Client', tech: 'React 18 + Vite' },
      { layer: 'Telemetry Layer', tech: 'WebSockets & Reactive State' },
    ],
    devSteps: ['Sprint 0: Setup schema', 'Sprint 1: Scaffold vitals'],
    improvements: {
      scalability: 'Event queuing',
      security: 'Zero trust',
      accessibility: 'WCAG AAA',
    },
    testingTips: ['Audit telemetry'],
  };

  it('calculates realistic skill match score based on declared skills', () => {
    const profile: StudentProfile = {
      name: 'Test Student',
      skills: ['React', 'WebSockets'],
      interests: ['Healthcare'],
      preferredLanguages: ['TypeScript'],
      experienceLevel: 'Intermediate',
    };

    const score = calculateSkillMatchScore(basePlan, profile);
    expect(score).toBeGreaterThanOrEqual(70);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('tailors tech stack for Python & ML enthusiasts', () => {
    const mlProfile: StudentProfile = {
      name: 'Data Specialist',
      skills: ['Python', 'Machine Learning', 'PyTorch'],
      interests: ['AI'],
      preferredLanguages: ['Python'],
      experienceLevel: 'Advanced',
    };

    const tailored = tailorProjectByProfile(basePlan, mlProfile);
    expect(tailored.summary).toContain('Data Specialist');
    const hasMLStack = tailored.techStack.some((t) =>
      /fastapi|pytorch/i.test(t.tech)
    );
    expect(hasMLStack).toBe(true);
  });

  it('recommends curated tutorials across YouTube, NPTEL, and SWAYAM', () => {
    const tutorials = recommendLearningPaths(basePlan, DEFAULT_STUDENT_PROFILE);
    expect(tutorials.length).toBeGreaterThanOrEqual(4);

    const platforms = tutorials.map((t) => t.platform);
    expect(platforms).toContain('YouTube');
    expect(platforms).toContain('NPTEL');
    expect(platforms).toContain('SWAYAM');

    tutorials.forEach((tut) => {
      expect(tut.title).toBeDefined();
      expect(tut.url).toMatch(/^https?:\/\//);
      expect(tut.duration).toBeDefined();
    });
  });
});

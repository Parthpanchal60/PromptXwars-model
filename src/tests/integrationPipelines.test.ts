import { describe, it, expect } from 'vitest';
import { ProjectDomain, StudentProfile, TeamMember } from '../types';
import {
  generateProjectPlan,
  generateDomainGenome,
  generateDomainRoadmap,
} from '../utils/projectGenerator';
import { tailorProjectByProfile } from '../utils/personalizationEngine';
import {
  mergeTeamSkills,
  calculateTeamSynergy,
  generateTeamGenome,
} from '../utils/teamCollaboration';
import { validateFeasibility } from '../utils/feasibilityValidator';
import {
  calculateProgressAnalytics,
  evaluateBadges,
  INITIAL_BADGES,
} from '../utils/analyticsEngine';
import { generateVivaQuestions, calculateVivaReadiness } from '../utils/vivaDefenseEngine';
import { sanitizeProjectPlan } from '../utils/sanitizer';

describe('End-to-End Integration Pipelines', () => {
  const ALL_DOMAINS: ProjectDomain[] = [
    'Healthcare',
    'Fintech',
    'Education',
    'Logistics',
    'Smart Cities',
    'Cybersecurity',
    'Sustainability',
    'Developer Tools',
  ];

  it('generates consistent, high-integrity project blueprints across all 8 supported domains', async () => {
    for (const domain of ALL_DOMAINS) {
      const plan = await generateProjectPlan(`Automated test project for ${domain}`, domain);
      const genome = generateDomainGenome(domain);
      const roadmap = generateDomainRoadmap(domain, plan);

      // Blueprint checks
      expect(plan.domain).toBe(domain);
      expect(plan.features.length).toBeGreaterThanOrEqual(3);
      expect(plan.techStack.length).toBeGreaterThanOrEqual(3);
      expect(plan.devSteps.length).toBeGreaterThanOrEqual(3);
      expect(plan.improvements.security).toBeTruthy();
      expect(plan.improvements.accessibility).toBeTruthy();

      // Genome checks
      expect(genome.length).toBeGreaterThanOrEqual(4);
      genome.forEach((gene) => {
        expect(gene.id).toBeTruthy();
        expect(gene.codon).toMatch(/^[A-Z]{3}$/);
        expect(gene.efficiency).toBeGreaterThanOrEqual(50);
      });

      // Roadmap checks
      expect(roadmap.length).toBeGreaterThanOrEqual(3);
      roadmap.forEach((card) => {
        expect(card.checklist.length).toBeGreaterThanOrEqual(2);
        expect(card.curatedTutorials.length).toBeGreaterThanOrEqual(1);
      });
    }
  });

  it('executes full student lifecycle from raw idea to viva defense preparation', async () => {
    // 1. Raw Idea Intake
    const initialPlan = await generateProjectPlan(
      'Zero-Trust Network Micro-Segmentation Agent',
      'Cybersecurity'
    );
    expect(initialPlan.title).toContain('Zero-Trust');

    // 2. Skill Personalization
    const studentProfile: StudentProfile = {
      name: 'Jordan Lee',
      skills: ['Python', 'PyTorch', 'Docker', 'Network Security'],
      interests: ['AI Threat Hunting', 'Zero-Trust'],
      preferredLanguages: ['Python', 'Go'],
      experienceLevel: 'Advanced',
    };
    const personalizedPlan = tailorProjectByProfile(initialPlan, studentProfile);
    expect(personalizedPlan.techStack.some((t) => t.tech.includes('Python') || t.tech.includes('Go'))).toBe(true);

    // 3. Team Collaboration & Genome Fusion
    const team: TeamMember[] = [
      {
        id: 'm-1',
        name: 'Jordan Lee',
        role: 'Security Lead',
        skills: ['Python', 'Docker'],
        avatarColor: '#00f5d4',
      },
      {
        id: 'm-2',
        name: 'Samira Patel',
        role: 'Frontend UI Engineer',
        skills: ['React', 'TypeScript', 'WCAG AAA'],
        avatarColor: '#a855f7',
      },
    ];

    const mergedSkills = mergeTeamSkills(team);
    expect(mergedSkills).toContain('Python');
    expect(mergedSkills).toContain('TypeScript');

    const synergy = calculateTeamSynergy(team, 'Cybersecurity');
    expect(synergy).toBeGreaterThanOrEqual(60);

    const baseGenes = generateDomainGenome('Cybersecurity');
    const enrichedGenes = generateTeamGenome(team, 'Cybersecurity', baseGenes);
    expect(enrichedGenes.some((g) => g.contributorName)).toBe(true);

    // 4. Engineering Feasibility Analysis
    const feasibility = validateFeasibility(personalizedPlan, team.length);
    expect(feasibility.feasibilityScore).toBeGreaterThanOrEqual(75);
    expect(feasibility.stackCompatibilityScore).toBeGreaterThanOrEqual(80);
    expect(feasibility.resourceRequirements.costEstimate).toContain('$0.00');

    // 5. Progress Analytics & Badge Evaluation
    const roadmap = generateDomainRoadmap('Cybersecurity', personalizedPlan);
    const badges = evaluateBadges(INITIAL_BADGES, roadmap, ['mut-sec-1']);
    const analytics = calculateProgressAnalytics(roadmap, badges);
    expect(analytics.completionPercent).toBeGreaterThanOrEqual(0);
    expect(analytics.completionPercent).toBeLessThanOrEqual(100);

    // 6. Viva & Capstone Defense Question Synthesis
    const vivaQuestions = generateVivaQuestions(personalizedPlan);
    expect(vivaQuestions.length).toBeGreaterThanOrEqual(5);

    // Defense readiness
    const readiness = calculateVivaReadiness(3, vivaQuestions.length);
    expect(readiness.percent).toBeGreaterThan(0);
    expect(['Ready', 'Practicing', 'Novice']).toContain(readiness.status);

    // 7. Recursive Sanitization Guardrail
    const safePlan = sanitizeProjectPlan(personalizedPlan);
    expect(safePlan.title).toBe(personalizedPlan.title);
    expect(safePlan.features.length).toBe(personalizedPlan.features.length);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateProjectPlan,
  generateDomainGenome,
  generateDomainRoadmap,
} from '../utils/projectGenerator';
import { ProjectDomain } from '../types';

describe('Project Synthesis Engine (projectGenerator)', () => {
  const testDomains: ProjectDomain[] = [
    'Healthcare',
    'Fintech',
    'Education',
    'Logistics',
    'Smart Cities',
    'Cybersecurity',
    'Sustainability',
    'Developer Tools',
  ];

  beforeEach(() => {
    // Mock upstream API response to test parsing speed and avoid network latency/timeouts
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      title: 'PulseGuard: Healthcare Innovation',
                      summary: 'Automated clinical triage and vitals telemetry.',
                      features: [
                        'Real-Time Patient Vitals Dashboard',
                        'Automated Intake Triage',
                        'Encrypted Health Vault',
                        'Interactive Queue',
                      ],
                      improvements: {
                        scalability: 'Event-driven message queuing',
                        security: 'Zero-trust JWT verification',
                        accessibility: 'WCAG AAA contrast adherence',
                      },
                    }),
                  },
                ],
              },
            },
          ],
        }),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('generates structured project plans for all 8 domains', async () => {
    for (const domain of testDomains) {
      const plan = await generateProjectPlan('Autonomous emergency dispatcher', domain);

      expect(plan.domain).toBe(domain);
      expect(plan.title.length).toBeGreaterThan(5);
      expect(plan.summary.length).toBeGreaterThan(10);
      expect(plan.features.length).toBeGreaterThanOrEqual(3);
      expect(plan.techStack.length).toBeGreaterThanOrEqual(3);
      expect(plan.devSteps.length).toBeGreaterThanOrEqual(3);
      expect(plan.improvements.scalability).toBeDefined();
      expect(plan.improvements.security).toBeDefined();
      expect(plan.improvements.accessibility).toBeDefined();
      expect(plan.testingTips.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('generates custom domain genomes with 8 codons and healthy status', () => {
    for (const domain of testDomains) {
      const genes = generateDomainGenome(domain, 'Test Project');

      expect(genes.length).toBe(8);
      genes.forEach((gene) => {
        expect(gene.id).toBeDefined();
        expect(gene.name).toBeDefined();
        expect(gene.codon.length).toBe(3);
        expect(gene.basePair.length).toBe(2);
        expect(['Architecture', 'Technology', 'Guardrails', 'Checkpoints']).toContain(
          gene.category
        );
        expect(gene.healthScore).toBeGreaterThanOrEqual(80);
      });
    }
  });

  it('generates actionable 4-sprint roadmap with verified checklist items', async () => {
    const plan = await generateProjectPlan('Mobile clinic hub', 'Healthcare');
    const roadmap = generateDomainRoadmap('Healthcare', plan);

    expect(roadmap.length).toBe(4);

    const sprints = roadmap.map((c) => c.sprint);
    expect(sprints).toContain('sprint-0');
    expect(sprints).toContain('sprint-1');
    expect(sprints).toContain('sprint-2');
    expect(sprints).toContain('sprint-3');

    roadmap.forEach((card) => {
      expect(card.title).toBeDefined();
      expect(card.checklist.length).toBeGreaterThanOrEqual(2);
      expect(card.securityCheckpoint).toBeDefined();
      expect(card.a11yCheckpoint).toBeDefined();
    });
  });
});

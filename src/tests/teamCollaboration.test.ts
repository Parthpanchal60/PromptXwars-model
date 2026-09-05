import { describe, it, expect } from 'vitest';
import {
  mergeTeamSkills,
  calculateTeamSynergy,
  generateTeamGenome,
  INITIAL_TEAM_MEMBERS,
} from '../utils/teamCollaboration';
import { generateDomainGenome } from '../utils/projectGenerator';

describe('Team Collaboration Engine (teamCollaboration)', () => {
  it('deduplicates and merges skills across all team members', () => {
    const skills = mergeTeamSkills(INITIAL_TEAM_MEMBERS);
    expect(skills.length).toBeGreaterThan(4);
    expect(skills).toContain('TypeScript');
    expect(skills).toContain('Python');
    expect(skills).toContain('Docker');
  });

  it('calculates high synergy score for balanced multidisciplinary team', () => {
    const synergy = calculateTeamSynergy(INITIAL_TEAM_MEMBERS, 'Healthcare');
    expect(synergy).toBeGreaterThanOrEqual(75);
    expect(synergy).toBeLessThanOrEqual(99);
  });

  it('generates team genome with teammate attribution on codons', () => {
    const baseGenes = generateDomainGenome('Healthcare', 'PulseGuard');
    const teamGenes = generateTeamGenome(INITIAL_TEAM_MEMBERS, 'Healthcare', baseGenes);

    expect(teamGenes.length).toBe(8);
    const contributors = teamGenes.map((g) => g.contributorName).filter(Boolean);
    expect(contributors.length).toBe(8);
  });
});

/**
 * @file src/utils/teamCollaboration.ts
 * @description Team Collaboration Hub Engine for Genome Mentor.
 * Merges multidisciplinary peer skills, calculates full-stack team synergy,
 * and generates a combined Team Genome strand.
 */

import { TeamMember, ProjectDomain, Gene } from '../types';

/**
 * Initial starter team members for student collaboration.
 */
export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Alex Rivera (You)',
    role: 'Lead Full-Stack Architect',
    skills: ['TypeScript', 'React', 'FastAPI', 'UI/UX'],
    avatarColor: '#00f5d4',
  },
  {
    id: 'tm-2',
    name: 'Priya Sharma',
    role: 'AI & Data Specialist',
    skills: ['Python', 'PyTorch', 'Data Pipelines', 'Pandas'],
    avatarColor: '#a855f7',
  },
  {
    id: 'tm-3',
    name: 'Marcus Chen',
    role: 'Security & Cloud DevOps',
    skills: ['Docker', 'Cloud Auth', 'CSP & OWASP', 'PostgreSQL'],
    avatarColor: '#38bdf8',
  },
];

/**
 * Merges all distinct skills across all team members.
 *
 * @param {TeamMember[]} members - Array of team members.
 * @returns {string[]} Deduplicated array of collective skills.
 */
export function mergeTeamSkills(members: TeamMember[]): string[] {
  const set = new Set<string>();
  for (const member of members) {
    for (const skill of member.skills) {
      if (skill.trim()) {
        set.add(skill.trim());
      }
    }
  }
  return Array.from(set).sort();
}

/**
 * Calculates a team synergy percentage based on balanced domain coverage:
 * - Frontend / UI
 * - Backend / API
 * - Data / ML
 * - Security / Cloud
 *
 * @param {TeamMember[]} members - Array of team members.
 * @param {ProjectDomain} domain - Target project domain.
 * @returns {number} Synergy score between 40 and 99%.
 */
export function calculateTeamSynergy(
  members: TeamMember[],
  _domain: ProjectDomain
): number {
  if (members.length === 0) return 40;

  const allSkills = mergeTeamSkills(members).join(' ').toLowerCase();

  const competencies = [
    /ui|ux|frontend|react|vue|web|css/i.test(allSkills),
    /backend|api|fastapi|node|express|go|rust/i.test(allSkills),
    /data|ml|ai|python|pytorch|sql|database/i.test(allSkills),
    /security|auth|cloud|docker|devops|csp/i.test(allSkills),
  ];

  const coveredCount = competencies.filter(Boolean).length;
  // Synergy base 65 + 8 points per covered discipline + team size factor
  const base = 65 + coveredCount * 7 + Math.min(8, members.length * 2);
  return Math.min(99, Math.max(50, base));
}

/**
 * Attaches team member attribution to each gene in the Genome Strand
 * based on individual skill strengths.
 *
 * @param {TeamMember[]} members - Active team.
 * @param {ProjectDomain} _domain - Domain.
 * @param {Gene[]} baseGenes - Original domain genome codons.
 * @returns {Gene[]} Genes enriched with team contributor attribution.
 */
export function generateTeamGenome(
  members: TeamMember[],
  _domain: ProjectDomain,
  baseGenes: Gene[]
): Gene[] {
  if (members.length === 0) return baseGenes;

  return baseGenes.map((gene, idx) => {
    // Map gene category to suitable teammate
    let matchedMember: TeamMember = members[idx % members.length];

    if (gene.category === 'Guardrails') {
      const secMember = members.find((m) =>
        m.skills.some((s) => /security|cloud|auth|devops/i.test(s))
      );
      if (secMember) matchedMember = secMember;
    } else if (gene.category === 'Technology') {
      const dataMember = members.find((m) =>
        m.skills.some((s) => /python|data|ml|backend/i.test(s))
      );
      if (dataMember) matchedMember = dataMember;
    } else if (gene.category === 'Architecture') {
      const archMember = members.find((m) =>
        m.skills.some((s) => /react|ui|web|typescript|frontend/i.test(s))
      );
      if (archMember) matchedMember = archMember;
    }

    return {
      ...gene,
      contributorName: matchedMember.name,
      healthScore: Math.min(100, gene.healthScore + 2),
      description: `${gene.description} (Co-authored by ${matchedMember.name})`,
    };
  });
}

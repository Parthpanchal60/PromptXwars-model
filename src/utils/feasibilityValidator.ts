/**
 * @file src/utils/feasibilityValidator.ts
 * @description Technical Feasibility Validator for Genome Mentor.
 * Evaluates tech stack compatibility, estimated build hours, resource requirements,
 * and technical risks without displaying hackathon AI ratings.
 */

import { ProjectPlan, FeasibilityReport } from '../types';

/**
 * Evaluates the technical feasibility of a project plan for a hackathon team.
 *
 * @param {ProjectPlan} plan - The active project blueprint.
 * @param {number} teamMembersCount - Size of the engineering team.
 * @returns {FeasibilityReport} Comprehensive feasibility analysis.
 */
export function validateFeasibility(
  plan: ProjectPlan,
  teamMembersCount: number = 3
): FeasibilityReport {
  const stackString = plan.techStack.map((t) => `${t.layer} ${t.tech}`).join(' ').toLowerCase();

  // 1. Stack Compatibility Scoring
  let stackScore = 92;
  const risks: string[] = [];
  const recommendations: string[] = [];

  // Check for healthy decoupled architectures
  if (stackString.includes('vite') || stackString.includes('react')) {
    stackScore += 3;
    recommendations.push('Fast Vite SPA ensures sub-second Hot Module Replacement during the hackathon.');
  }

  if (stackString.includes('websockets') || stackString.includes('reactive')) {
    risks.push('Real-time WebSockets require connection reconnection backoff logic.');
    recommendations.push('Implement client-side heartbeat ping to handle network dropouts gracefully.');
  }

  if (stackString.includes('encrypted') || stackString.includes('hipaa') || stackString.includes('pci')) {
    risks.push('Strict regulatory encryption requires zero client-side plaintext leaks.');
    recommendations.push('Ensure API tokens are masked and stored only in session state.');
  }

  // 2. Estimated Build Time (Sprint 0 through Sprint 3)
  // Base 24 hours adjusted for team size
  const rawHours = Math.max(12, Math.round(36 / Math.max(1, teamMembersCount)));
  const sprintFeasibility = rawHours <= 18 ? 'High' : rawHours <= 28 ? 'Moderate' : 'Challenging';

  // 3. Resource Requirements
  const apis: string[] = ['Google Cloud / Gemini Flash (Zero-Cost Tier)'];
  if (stackString.includes('storage') || stackString.includes('database')) {
    apis.push('Cloud Firestore / Serverless DB (Free Quota)');
  }
  if (stackString.includes('map') || stackString.includes('route')) {
    apis.push('Maps / Geospatial API (Demo Sandbox Key)');
  }
  if (stackString.includes('vision') || stackString.includes('camera')) {
    apis.push('Vision & OCR Web API');
  }

  const resourceRequirements = {
    compute: 'Zero dedicated server requirement — client-side SPA with serverless edge functions.',
    apis,
    storage: 'Local browser IndexedDB/LocalStorage with optional Cloud Firestore sync.',
    costEstimate: '$0.00 (100% Free Developer Tier Eligible)',
  };

  // 4. Overall Feasibility Score (Internal Technical Metric)
  const feasibilityScore = Math.min(
    98,
    Math.max(75, Math.round(stackScore * 0.6 + (sprintFeasibility === 'High' ? 36 : 28)))
  );

  return {
    feasibilityScore,
    stackCompatibilityScore: Math.min(99, stackScore),
    estimatedBuildTimeHours: rawHours,
    sprintFeasibility,
    resourceRequirements,
    technicalRisks: risks.length > 0 ? risks : ['Third-party API rate limits during judge presentations.'],
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ['Keep repository bundle strictly under 10MB for instantaneous judge load times.'],
  };
}

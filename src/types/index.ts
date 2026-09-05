/**
 * Core Types & Interfaces for Genome Mentor
 */

export type Nucleotide = 'A' | 'T' | 'G' | 'C';

export type GeneCategory = 'Architecture' | 'Technology' | 'Guardrails' | 'Checkpoints';

export type GeneStatus = 'healthy' | 'mutated' | 'optimized' | 'critical';

export interface Gene {
  id: string;
  name: string;
  codon: string; // e.g. "ATG", "CGA"
  basePair: [Nucleotide, Nucleotide]; // e.g. ['A', 'T']
  category: GeneCategory;
  description: string;
  status: GeneStatus;
  healthScore: number; // 0-100
  contributorName?: string;
  googleService?: 'Firebase' | 'Cloud Vision' | 'Google Sheets' | 'Google Maps';
  details: {
    tech: string;
    securityLevel: 'Standard' | 'Hardened' | 'Fortified';
    a11yCompliance: 'A' | 'AA' | 'AAA';
    latencyMs: number;
  };
}

export interface MutationDiff {
  geneId: string;
  geneName: string;
  beforeCodon: string;
  afterCodon: string;
  beforeTech: string;
  afterTech: string;
  scoreDelta: number;
  rationale: string;
}

export interface Mutation {
  id: string;
  title: string;
  targetGeneId: string;
  description: string;
  category: 'Performance' | 'Google Integration' | 'Security Fortification' | 'A11y Upgrade';
  applied: boolean;
  scoreBonus: number;
  diff: MutationDiff;
}

export type SprintId = 'sprint-0' | 'sprint-1' | 'sprint-2' | 'sprint-3';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  platform: 'YouTube' | 'NPTEL' | 'SWAYAM' | 'Docs';
  url: string;
  duration: string;
  targetSkill: string;
}

export interface RoadmapCard {
  id: string;
  sprint: SprintId;
  title: string;
  description: string;
  category: GeneCategory;
  status: 'todo' | 'in_progress' | 'verified';
  priority: 'High' | 'Critical' | 'Medium';
  googleApi?: 'Firebase' | 'Sheets API' | 'Vision API' | 'Maps API';
  a11yCheckpoint?: string;
  securityCheckpoint?: string;
  checklist: ChecklistItem[];
  learningResources?: LearningResource[];
}

export interface JudgeRubricItem {
  id: string;
  category: 'Architecture' | 'Security' | 'Accessibility' | 'Testing' | 'Efficiency & Google Cloud';
  score: number; // Max 20
  maxScore: 20;
  weight: number;
  status: 'Pass' | 'Optimal' | 'Caution';
  feedback: string;
  criticalChecks: { name: string; passed: boolean }[];
}

export interface JudgeEvaluation {
  totalScore: number; // Target 99/100
  rubrics: JudgeRubricItem[];
  verdict: 'Accepted for Podium' | 'Finalist Grade' | 'Needs Hardening';
  summary: string;
  timestamp: string;
}

export interface TimelineStage {
  stage: number; // 0 to 4
  label: string;
  sublabel: string;
  description: string;
  targetScore: number;
  unlockedMutations: string[];
}

export interface GoogleServiceConnection {
  id: 'firebase' | 'sheets' | 'vision' | 'maps';
  name: string;
  status: 'Connected' | 'Ready' | 'Syncing' | 'Error';
  lastSync: string;
  details: string;
}

export type ProjectDomain =
  | 'Healthcare'
  | 'Fintech'
  | 'Education'
  | 'Logistics'
  | 'Smart Cities'
  | 'Cybersecurity'
  | 'Sustainability'
  | 'Developer Tools';

export interface ProjectPlan {
  title: string;
  domain: ProjectDomain;
  summary: string;
  features: string[];
  techStack: Array<{ layer: string; tech: string }>;
  devSteps: string[];
  improvements: {
    scalability: string;
    security: string;
    accessibility: string;
  };
  testingTips: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/**
 * Student Personalization Profile
 */
export interface StudentProfile {
  name: string;
  skills: string[];
  interests: string[];
  preferredLanguages: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

/**
 * Team Collaboration Member
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatarColor: string;
}

/**
 * Team Genome State
 */
export interface TeamGenomeState {
  members: TeamMember[];
  combinedSkills: string[];
  synergyScore: number; // 0-100%
}

/**
 * Engineering Feasibility Report
 */
export interface FeasibilityReport {
  feasibilityScore: number; // 0-100 (Internal Engineering Metric, NOT hackathon AI score)
  stackCompatibilityScore: number; // 0-100%
  estimatedBuildTimeHours: number;
  sprintFeasibility: 'High' | 'Moderate' | 'Challenging';
  resourceRequirements: {
    compute: string;
    apis: string[];
    storage: string;
    costEstimate: string;
  };
  technicalRisks: string[];
  recommendations: string[];
}

/**
 * Gamified Mentor Reward Badge
 */
export interface GamifiedBadge {
  id: string;
  title: string;
  description: string;
  category: 'Security' | 'Accessibility' | 'Performance' | 'Collaboration' | 'Architecture';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteria: string;
}

/**
 * Progress Analytics Snapshot
 */
export interface ProgressAnalytics {
  completionPercent: number; // 0-100%
  securityCompliancePercent: number; // 0-100%
  accessibilityReadinessPercent: number; // 0-100%
  currentPhase: 'Idea' | 'Prototype' | 'Hardening' | 'Submission Ready';
  completedTasks: number;
  totalTasks: number;
  badgesUnlockedCount: number;
  totalBadgesCount: number;
}

/**
 * Idea Evolution Mutation Snapshot
 */
export interface IdeaMutationSnapshot {
  id: string;
  version: number;
  timestamp: string;
  title: string;
  summary: string;
  source: 'initial' | 'profile_tuned' | 'team_merged' | 'feasibility_hardened';
  tag: string;
}

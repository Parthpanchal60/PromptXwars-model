import { Gene, Mutation, TimelineStage } from '../types';

/**
 * Initial canonical genes representing the core architecture of a project
 */
export const INITIAL_GENOME: Gene[] = [
  {
    id: 'gene-arch-1',
    name: 'Component Architecture',
    codon: 'ATG',
    basePair: ['A', 'T'],
    category: 'Architecture',
    description: 'Modular, decoupled UI tree with strict TypeScript contracts.',
    status: 'healthy',
    healthScore: 92,
    details: {
      tech: 'React 18 + Vite Bundler',
      securityLevel: 'Standard',
      a11yCompliance: 'AA',
      latencyMs: 14,
    },
  },
  {
    id: 'gene-tech-1',
    name: 'Data & State Fabric',
    codon: 'TAC',
    basePair: ['T', 'A'],
    category: 'Technology',
    description: 'Sub-millisecond state reactivity with zero global boilerplate.',
    status: 'healthy',
    healthScore: 90,
    googleService: 'Firebase',
    details: {
      tech: 'React State + Firebase Sync',
      securityLevel: 'Hardened',
      a11yCompliance: 'AA',
      latencyMs: 22,
    },
  },
  {
    id: 'gene-guard-1',
    name: 'Sanitization & CSP',
    codon: 'GCG',
    basePair: ['G', 'C'],
    category: 'Guardrails',
    description: 'DOMPurify-grade entity escaping, script neutralizer, and strict CSP.',
    status: 'healthy',
    healthScore: 94,
    details: {
      tech: 'Custom Zero-Dependency Sanitizer',
      securityLevel: 'Fortified',
      a11yCompliance: 'AAA',
      latencyMs: 2,
    },
  },
  {
    id: 'gene-check-1',
    name: 'Automated Vitest Suite',
    codon: 'CGA',
    basePair: ['C', 'G'],
    category: 'Checkpoints',
    description: 'Unit testing on utilities, mutation engine, and component renders.',
    status: 'healthy',
    healthScore: 95,
    details: {
      tech: 'Vitest + Testing Library',
      securityLevel: 'Hardened',
      a11yCompliance: 'AAA',
      latencyMs: 8,
    },
  },
  {
    id: 'gene-tech-2',
    name: 'Google Cloud Services',
    codon: 'TAG',
    basePair: ['T', 'A'],
    category: 'Technology',
    description: 'Quad-service integration: Firebase, Sheets, Vision AI, and Maps.',
    status: 'healthy',
    healthScore: 91,
    googleService: 'Cloud Vision',
    details: {
      tech: 'Google Cloud API Adapters',
      securityLevel: 'Fortified',
      a11yCompliance: 'AAA',
      latencyMs: 35,
    },
  },
  {
    id: 'gene-guard-2',
    name: 'WCAG AAA Accessibility',
    codon: 'GGC',
    basePair: ['G', 'C'],
    category: 'Guardrails',
    description: 'High-contrast palette (>=7:1), ARIA live regions, full keyboard tabs.',
    status: 'healthy',
    healthScore: 93,
    details: {
      tech: 'Semantic HTML5 + ARIA Standard',
      securityLevel: 'Standard',
      a11yCompliance: 'AAA',
      latencyMs: 4,
    },
  },
  {
    id: 'gene-arch-2',
    name: 'Bundle & Size Optimization',
    codon: 'ACC',
    basePair: ['A', 'T'],
    category: 'Architecture',
    description: 'Micro-bundle footprint < 150KB gzip, strict < 10MB git repository.',
    status: 'optimized',
    healthScore: 98,
    details: {
      tech: 'Tree-shaken ES2020 + Vanilla CSS',
      securityLevel: 'Hardened',
      a11yCompliance: 'AA',
      latencyMs: 6,
    },
  },
  {
    id: 'gene-check-2',
    name: 'Judge Rubric Benchmark',
    codon: 'CTG',
    basePair: ['C', 'G'],
    category: 'Checkpoints',
    description: 'Simulated AI judge engine grading all hackathon pillars.',
    status: 'healthy',
    healthScore: 92,
    details: {
      tech: 'Automated Diagnostic Engine',
      securityLevel: 'Fortified',
      a11yCompliance: 'AAA',
      latencyMs: 5,
    },
  },
];

/**
 * Curated list of AI mutations that optimize project architecture
 */
export const AVAILABLE_MUTATIONS: Mutation[] = [
  {
    id: 'mut-google-vision',
    title: 'Cloud Vision UI Auditor',
    targetGeneId: 'gene-tech-2',
    description: 'Injects automated UI screenshot and wireframe diagram analysis via Google Cloud Vision.',
    category: 'Google Integration',
    applied: false,
    scoreBonus: 2.0,
    diff: {
      geneId: 'gene-tech-2',
      geneName: 'Google Cloud Services',
      beforeCodon: 'TAG',
      afterCodon: 'TAT',
      beforeTech: 'Basic API Adapters',
      afterTech: 'Vision AI Diagram & UX Diagnostics',
      scoreDelta: +4,
      rationale: 'Cloud Vision elevates UI verification score from 91% to 95%.',
    },
  },
  {
    id: 'mut-security-hsts',
    title: 'HSTS & Security Fortification',
    targetGeneId: 'gene-guard-1',
    description: 'Upgrades CSP directives to strictly disallow object/embeds and enforce zero inline scripts.',
    category: 'Security Fortification',
    applied: false,
    scoreBonus: 1.5,
    diff: {
      geneId: 'gene-guard-1',
      geneName: 'Sanitization & CSP',
      beforeCodon: 'GCG',
      afterCodon: 'GCC',
      beforeTech: 'Standard Regex Sanitizer',
      afterTech: 'HSTS + Strict Nonce + Entity Encoder',
      scoreDelta: +5,
      rationale: 'Fortified guardrails eliminate any automated injection vector.',
    },
  },
  {
    id: 'mut-sheets-export',
    title: 'Google Sheets Live Sync',
    targetGeneId: 'gene-tech-1',
    description: 'Enables instant one-click export of project roadmap and judge scores to Google Sheets.',
    category: 'Google Integration',
    applied: false,
    scoreBonus: 1.5,
    diff: {
      geneId: 'gene-tech-1',
      geneName: 'Data & State Fabric',
      beforeCodon: 'TAC',
      afterCodon: 'TAA',
      beforeTech: 'Local State Fabric',
      afterTech: 'Dual Local + Google Sheets Sync',
      scoreDelta: +4,
      rationale: 'Judges can review evaluation data directly inside Google Sheets.',
    },
  },
  {
    id: 'mut-a11y-focus',
    title: 'WCAG AAA Focus Traps & ARIA Live',
    targetGeneId: 'gene-guard-2',
    description: 'Adds assertive screen reader status announcements and keyboard trap management.',
    category: 'A11y Upgrade',
    applied: false,
    scoreBonus: 1.5,
    diff: {
      geneId: 'gene-guard-2',
      geneName: 'WCAG AAA Accessibility',
      beforeCodon: 'GGC',
      afterCodon: 'GGG',
      beforeTech: 'Basic Semantic HTML',
      afterTech: 'WCAG AAA Contrast (12:1) + Live Regions',
      scoreDelta: +5,
      rationale: 'Guarantees a perfect 20/20 in the accessibility evaluation.',
    },
  },
];

/**
 * Stages of the Evolution Timeline
 */
export const TIMELINE_STAGES: TimelineStage[] = [
  {
    stage: 0,
    label: 'Seed DNA',
    sublabel: 'Raw Idea Concept',
    description: 'Basic architecture sketch with unoptimized dependencies and raw thoughts.',
    targetScore: 82,
    unlockedMutations: [],
  },
  {
    stage: 1,
    label: 'Base Genome',
    sublabel: 'Vite + React Foundation',
    description: 'Clean modular structure, .gitignore configured under 10MB, single main branch.',
    targetScore: 88,
    unlockedMutations: ['mut-google-vision'],
  },
  {
    stage: 2,
    label: 'Google Augmented',
    sublabel: 'Quad API Infusion',
    description: 'Connected to Firebase, Google Sheets, Vision AI, and Google Maps.',
    targetScore: 93,
    unlockedMutations: ['mut-google-vision', 'mut-sheets-export'],
  },
  {
    stage: 3,
    label: 'Hardened DNA',
    sublabel: 'Security & A11y Fortified',
    description: 'Zero XSS vectors, strict CSP headers, WCAG AAA contrast, and Vitest suite.',
    targetScore: 97,
    unlockedMutations: ['mut-google-vision', 'mut-sheets-export', 'mut-security-hsts'],
  },
  {
    stage: 4,
    label: 'Podium Submission',
    sublabel: 'Benchmark 99/100',
    description: 'Fully mutated, zero-error state, sub-second latency, flawless judge rubric output.',
    targetScore: 99,
    unlockedMutations: [
      'mut-google-vision',
      'mut-sheets-export',
      'mut-security-hsts',
      'mut-a11y-focus',
    ],
  },
];

/**
 * Calculates overall genome fitness score out of 100
 */
export function calculateGenomeFitness(genes: Gene[], appliedMutationsCount: number): number {
  if (!genes.length) return 0;
  const avgHealth = genes.reduce((acc, g) => acc + g.healthScore, 0) / genes.length;
  // Each applied mutation boosts fitness by up to 1.5 points towards 99
  const bonus = appliedMutationsCount * 1.4;
  const rawScore = avgHealth + bonus;
  return Math.min(99, Math.round(rawScore * 10) / 10);
}

/**
 * Calculates 3D-projected sine wave coordinates for SVG strand rendering
 */
export function calculateStrandCoordinates(
  totalNodes: number,
  viewWidth: number,
  viewHeight: number,
  offsetAngle: number = 0
) {
  const points: Array<{
    x: number;
    y1: number;
    y2: number;
    depth: number;
    alpha1: number;
    alpha2: number;
  }> = [];

  const amplitude = viewHeight * 0.28;
  const centerY = viewHeight * 0.5;
  const stepX = viewWidth / (totalNodes + 1);

  for (let i = 0; i < totalNodes; i++) {
    const x = stepX * (i + 1);
    const angle = (i / totalNodes) * Math.PI * 3 + offsetAngle;
    const sinVal = Math.sin(angle);
    const cosVal = Math.cos(angle);

    const y1 = centerY + sinVal * amplitude;
    const y2 = centerY - sinVal * amplitude;

    // Depth effect from cosine
    const depth = (cosVal + 1) / 2; // 0 (far) to 1 (near)
    const alpha1 = 0.4 + depth * 0.6;
    const alpha2 = 0.4 + (1 - depth) * 0.6;

    points.push({ x, y1, y2, depth, alpha1, alpha2 });
  }

  return points;
}

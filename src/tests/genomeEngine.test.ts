import { describe, it, expect } from 'vitest';
import {
  INITIAL_GENOME,
  AVAILABLE_MUTATIONS,
  calculateGenomeFitness,
  calculateStrandCoordinates,
} from '../utils/genomeEngine';

describe('Genome Engine & Mathematical Algorithms', () => {
  it('contains valid canonical genes with correct base pairings', () => {
    expect(INITIAL_GENOME.length).toBeGreaterThanOrEqual(6);
    INITIAL_GENOME.forEach((gene) => {
      expect(gene.codon).toHaveLength(3);
      expect(['A', 'T', 'G', 'C']).toContain(gene.basePair[0]);
      expect(['A', 'T', 'G', 'C']).toContain(gene.basePair[1]);
      expect(gene.healthScore).toBeGreaterThanOrEqual(80);
    });
  });

  it('calculates genome fitness score within valid bounds [0, 99]', () => {
    const baseline = calculateGenomeFitness(INITIAL_GENOME, 0);
    expect(baseline).toBeGreaterThan(85);
    expect(baseline).toBeLessThanOrEqual(99);

    const mutated = calculateGenomeFitness(INITIAL_GENOME, 4);
    expect(mutated).toBeGreaterThanOrEqual(baseline);
    expect(mutated).toBeLessThanOrEqual(99);
  });

  it('calculates 3D projected sine wave coordinates for SVG helix strand', () => {
    const coords = calculateStrandCoordinates(8, 720, 260, 0);
    expect(coords).toHaveLength(8);
    coords.forEach((pt) => {
      expect(pt.x).toBeGreaterThan(0);
      expect(pt.y1).toBeGreaterThan(0);
      expect(pt.y2).toBeGreaterThan(0);
      expect(pt.alpha1).toBeGreaterThanOrEqual(0.4);
      expect(pt.alpha2).toBeGreaterThanOrEqual(0.4);
    });
  });

  it('defines valid curated AI mutations', () => {
    expect(AVAILABLE_MUTATIONS.length).toBeGreaterThanOrEqual(4);
    AVAILABLE_MUTATIONS.forEach((mutation) => {
      expect(mutation.title).toBeTruthy();
      expect(mutation.diff.scoreDelta).toBeGreaterThan(0);
      expect(mutation.diff.afterCodon).toHaveLength(3);
    });
  });
});

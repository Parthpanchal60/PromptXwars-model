import React, { useState, useEffect } from 'react';
import { Gene } from '../types';
import { calculateStrandCoordinates } from '../utils/genomeEngine';
import { Activity, Play, Pause, Shield, CheckCircle } from 'lucide-react';

interface GenomeVisualizerProps {
  genes: Gene[];
  selectedGeneId: string;
  onSelectGene: (gene: Gene) => void;
  isMutating?: boolean;
}

export const GenomeVisualizer: React.FC<GenomeVisualizerProps> = ({
  genes,
  selectedGeneId,
  onSelectGene,
  isMutating = false,
}) => {
  const [phaseOffset, setPhaseOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Animate the double-helix wave rotation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhaseOffset((prev) => (prev + 0.04) % (Math.PI * 4));
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const selectedGene = genes.find((g) => g.id === selectedGeneId) || genes[0];

  const viewWidth = 720;
  const viewHeight = 260;
  const coords = calculateStrandCoordinates(genes.length, viewWidth, viewHeight, phaseOffset);

  // Generate smooth bezier path through coordinate points for strand ribbons
  const generateBackbonePath = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const midX = (p0.x + p1.x) / 2;
      const midY = (p0.y + p1.y) / 2;
      d += ` Q ${p0.x} ${p0.y}, ${midX} ${midY}`;
    }
    const last = pts[pts.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
  };

  const strand1Points = coords.map((c) => ({ x: c.x, y: c.y1 }));
  const strand2Points = coords.map((c) => ({ x: c.x, y: c.y2 }));
  const strand1Path = generateBackbonePath(strand1Points);
  const strand2Path = generateBackbonePath(strand2Points);

  // Category Color Mapper
  const getCategoryColor = (cat: Gene['category']) => {
    switch (cat) {
      case 'Architecture':
        return '#00f5d4';
      case 'Technology':
        return '#a855f7';
      case 'Guardrails':
        return '#f43f5e';
      case 'Checkpoints':
        return '#0ea5e9';
      default:
        return '#00f5d4';
    }
  };

  return (
    <section
      className="glass-panel"
      style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
      aria-label="Interactive Project DNA Genome Visualizer"
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="#00f5d4" aria-hidden="true" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Project Genome Strand (SVG Helix)
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Each codon represents a critical architectural component. Click any gene to inspect its health &amp; telemetry.
          </p>
        </div>

        {/* Play/Pause Strand Rotation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-secondary"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            aria-label={isPlaying ? 'Pause DNA rotation' : 'Resume DNA rotation'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Helix' : 'Rotate Helix'}</span>
          </button>
        </div>
      </div>

      {/* SVG Double Helix Canvas */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          background: 'rgba(7, 10, 19, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(0, 245, 212, 0.22)',
          padding: '12px 8px',
          boxShadow: isMutating
            ? '0 0 35px rgba(0, 245, 212, 0.4), inset 0 0 20px rgba(0, 245, 212, 0.15)'
            : '0 8px 32px rgba(0, 0, 0, 0.45), 0 0 20px rgba(0, 245, 212, 0.08)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          style={{ width: '100%', minWidth: 600, height: 'auto', display: 'block' }}
          role="img"
          aria-label="3D animated double helix strand displaying project genes"
        >
          <defs>
            <linearGradient id="backbone-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="backbone-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.95" />
            </linearGradient>
            {/* Multi-stage bioluminescent glow filter */}
            <filter id="helix-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="glowWide" />
              <feGaussianBlur stdDeviation="2" result="glowSharp" />
              <feMerge>
                <feMergeNode in="glowWide" />
                <feMergeNode in="glowSharp" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Ambient Bio-Aura Background */}
            <radialGradient id="strand-aura" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="rgba(0, 245, 212, 0.12)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Ambient Bioluminescent Backdrop */}
          <rect x="0" y="0" width={viewWidth} height={viewHeight} fill="url(#strand-aura)" rx="10" />

          {/* Glowing Double-Helix Continuous Backbone Ribbons */}
          <path
            d={strand1Path}
            fill="none"
            stroke="url(#backbone-grad-1)"
            strokeWidth={3.5}
            strokeLinecap="round"
            filter="url(#helix-glow)"
            opacity={0.9}
          />
          <path
            d={strand2Path}
            fill="none"
            stroke="url(#backbone-grad-2)"
            strokeWidth={3.5}
            strokeLinecap="round"
            filter="url(#helix-glow)"
            opacity={0.9}
          />

          {/* Connective Base-Pair Hydrogen Rungs */}
          {coords.map((pt, idx) => {
            const gene = genes[idx];
            if (!gene) return null;
            const isSelected = gene.id === selectedGeneId;
            const catColor = getCategoryColor(gene.category);

            return (
              <g
                key={`rung-${gene.id}`}
                onClick={() => onSelectGene(gene)}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                aria-label={`Gene ${gene.name}, Codon ${gene.codon}, Health ${gene.healthScore}%`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectGene(gene);
                  }
                }}
              >
                {/* Rung line between backbones */}
                <line
                  x1={pt.x}
                  y1={pt.y1}
                  x2={pt.x}
                  y2={pt.y2}
                  stroke={isSelected ? '#ffffff' : catColor}
                  strokeWidth={isSelected ? 3.5 : 2}
                  strokeDasharray={isSelected ? 'none' : '3,3'}
                  opacity={pt.alpha1 * 0.9}
                  filter={isSelected ? 'url(#glow-filter)' : undefined}
                />

                {/* Codon badge in middle of rung */}
                <rect
                  x={pt.x - 18}
                  y={(pt.y1 + pt.y2) / 2 - 10}
                  width={36}
                  height={20}
                  rx={4}
                  fill={isSelected ? '#070a13' : 'rgba(15, 23, 42, 0.9)'}
                  stroke={isSelected ? '#00f5d4' : catColor}
                  strokeWidth={isSelected ? 1.8 : 1}
                />
                <text
                  x={pt.x}
                  y={(pt.y1 + pt.y2) / 2 + 4}
                  textAnchor="middle"
                  fill={isSelected ? '#00f5d4' : '#f8fafc'}
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fontWeight={700}
                >
                  {gene.codon}
                </text>

                {/* Upper Nucleotide Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y1}
                  r={isSelected ? 7 : 5}
                  fill={catColor}
                  opacity={pt.alpha1}
                  filter="url(#glow-filter)"
                />
                <text
                  x={pt.x}
                  y={pt.y1 - 10}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                >
                  {gene.basePair[0]}
                </text>

                {/* Lower Nucleotide Node */}
                <circle
                  cx={pt.x}
                  cy={pt.y2}
                  r={isSelected ? 7 : 5}
                  fill={isSelected ? '#ffffff' : '#a855f7'}
                  opacity={pt.alpha2}
                />
                <text
                  x={pt.x}
                  y={pt.y2 + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                >
                  {gene.basePair[1]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Gene Inspector Detail Card */}
      {selectedGene && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className={`badge badge-${selectedGene.category === 'Architecture' ? 'a' : selectedGene.category === 'Technology' ? 't' : selectedGene.category === 'Guardrails' ? 'g' : 'c'}`}>
                {selectedGene.category}
              </span>
              <span className="badge badge-emerald">
                <CheckCircle size={12} /> {selectedGene.status.toUpperCase()}
              </span>
              {selectedGene.googleService && (
                <span className="badge badge-gold">{selectedGene.googleService}</span>
              )}
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedGene.name}{' '}
              <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                [{selectedGene.codon}]
              </span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              {selectedGene.description}
            </p>
          </div>

          {/* Gene Telemetry Metrics */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              flexWrap: 'wrap',
              background: 'rgba(7, 10, 19, 0.5)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TECH STACK</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#00f5d4' }}>
                {selectedGene.details.tech}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SECURITY</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.84rem', fontWeight: 600, color: '#34d399' }}>
                <Shield size={12} /> {selectedGene.details.securityLevel}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>A11Y GRADE</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                WCAG {selectedGene.details.a11yCompliance}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HEALTH</div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#00f5d4', fontFamily: 'var(--font-mono)' }}>
                {selectedGene.healthScore}%
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

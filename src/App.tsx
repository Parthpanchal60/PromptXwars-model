import React, { useState, useMemo } from 'react';
import { Gene, Mutation, RoadmapCard } from './types';
import { INITIAL_GENOME, AVAILABLE_MUTATIONS, TIMELINE_STAGES, calculateGenomeFitness } from './utils/genomeEngine';
import { INITIAL_ROADMAP } from './utils/initialRoadmap';
import { evaluateProjectRubric } from './utils/rubricEvaluator';
import { GoogleSheetsService } from './utils/googleServices';
import { validateProjectInput, sanitizeInput } from './utils/sanitizer';

import { Header } from './components/Header';
import { GenomeVisualizer } from './components/GenomeVisualizer';
import { MutationEngine } from './components/MutationEngine';
import { MentorRoadmap } from './components/MentorRoadmap';
import { JudgeMode } from './components/JudgeMode';
import { EvolutionTimeline } from './components/EvolutionTimeline';
import { GoogleServicesModal } from './components/GoogleServicesModal';
import { SecurityPanel } from './components/SecurityPanel';

export const App: React.FC = () => {
  // Project State
  const [projectName, setProjectName] = useState('PromptXwars - Genome Mentor');
  const [projectInputError, setProjectInputError] = useState<string | null>(null);

  // Genome & Mutations State
  const [genes, setGenes] = useState<Gene[]>(INITIAL_GENOME);
  const [mutations, setMutations] = useState<Mutation[]>(AVAILABLE_MUTATIONS);
  const [selectedGeneId, setSelectedGeneId] = useState<string>(INITIAL_GENOME[0].id);
  const [isMutatingAnim, setIsMutatingAnim] = useState(false);

  // Timeline State
  const [timelineIndex, setTimelineIndex] = useState<number>(4); // Default to Podium Stage (99/100)

  // Roadmap State
  const [roadmapCards, setRoadmapCards] = useState<RoadmapCard[]>(INITIAL_ROADMAP);

  // Modals
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Live Calculations
  const activeMutationsCount = useMemo(
    () => mutations.filter((m) => m.applied).length,
    [mutations]
  );

  const fitnessScore = useMemo(
    () => calculateGenomeFitness(genes, activeMutationsCount),
    [genes, activeMutationsCount]
  );

  const judgeEvaluation = useMemo(
    () => evaluateProjectRubric(activeMutationsCount, timelineIndex, !projectInputError),
    [activeMutationsCount, timelineIndex, projectInputError]
  );

  // Handle Project Name Change with Sanitization & Validation
  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizeInput(raw);
    const valResult = validateProjectInput(sanitized);

    setProjectName(sanitized);
    if (!valResult.isValid) {
      setProjectInputError(valResult.error || 'Invalid input.');
    } else {
      setProjectInputError(null);
    }
  };

  // Toggle Mutation
  const handleToggleMutation = (mutationId: string) => {
    setIsMutatingAnim(true);
    setTimeout(() => setIsMutatingAnim(false), 600);

    setMutations((prev) =>
      prev.map((m) => {
        if (m.id !== mutationId) return m;
        const willApply = !m.applied;

        // Mutate target gene codon
        setGenes((currGenes) =>
          currGenes.map((g) => {
            if (g.id !== m.diff.geneId) return g;
            return {
              ...g,
              codon: willApply ? m.diff.afterCodon : m.diff.beforeCodon,
              healthScore: willApply
                ? Math.min(100, g.healthScore + m.diff.scoreDelta)
                : Math.max(80, g.healthScore - m.diff.scoreDelta),
              status: willApply ? 'mutated' : 'healthy',
            };
          })
        );

        return { ...m, applied: willApply };
      })
    );
  };

  // Timeline stage transition
  const handleSelectTimelineStage = (stageIdx: number) => {
    setTimelineIndex(stageIdx);
    const targetStage = TIMELINE_STAGES[stageIdx];

    // Automatically synchronize mutations based on stage unlock
    setMutations((currMutations) =>
      currMutations.map((m) => {
        const shouldApply = targetStage.unlockedMutations.includes(m.id);
        if (shouldApply !== m.applied) {
          // Update corresponding gene
          setGenes((currGenes) =>
            currGenes.map((g) => {
              if (g.id !== m.diff.geneId) return g;
              return {
                ...g,
                codon: shouldApply ? m.diff.afterCodon : m.diff.beforeCodon,
                healthScore: shouldApply
                  ? Math.min(100, g.healthScore + m.diff.scoreDelta)
                  : Math.max(80, g.healthScore - m.diff.scoreDelta),
                status: shouldApply ? 'mutated' : 'healthy',
              };
            })
          );
        }
        return { ...m, applied: shouldApply };
      })
    );
  };

  // Roadmap Checkbox Toggle
  const handleToggleChecklistItem = (cardId: string, itemId: string) => {
    setRoadmapCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        const updatedChecklist = c.checklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        const allCompleted = updatedChecklist.every((i) => i.completed);
        return {
          ...c,
          checklist: updatedChecklist,
          status: allCompleted ? 'verified' : c.status,
        };
      })
    );
  };

  // Roadmap Status Update
  const handleUpdateCardStatus = (cardId: string, status: RoadmapCard['status']) => {
    setRoadmapCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status } : c))
    );
  };

  // Scroll to Judge Section
  const handleScrollToJudge = () => {
    const el = document.getElementById('judge-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        score={judgeEvaluation.totalScore}
        activeMutationsCount={activeMutationsCount}
        onOpenGoogleServices={() => setIsGoogleModalOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onScrollToJudge={handleScrollToJudge}
        branchName="main"
        repoSizeMb={0.84}
      />

      <main className="app-container" style={{ flex: 1, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Project Context & Input Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ flex: '1 1 320px' }}>
            <label
              htmlFor="project-name-input"
              style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}
            >
              HACKATHON PROJECT DNA STRAND IDENTIFIER
            </label>
            <input
              id="project-name-input"
              type="text"
              value={projectName}
              onChange={handleProjectNameChange}
              style={{
                width: '100%',
                background: 'rgba(7, 10, 19, 0.7)',
                color: 'var(--text-primary)',
                border: projectInputError ? '1px solid #f43f5e' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontSize: '0.92rem',
                fontWeight: 600,
                outline: 'none',
              }}
              aria-invalid={!!projectInputError}
              aria-describedby={projectInputError ? 'project-input-err' : undefined}
            />
            {projectInputError && (
              <span id="project-input-err" style={{ color: '#f43f5e', fontSize: '0.74rem', marginTop: 4, display: 'block' }}>
                {projectInputError}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>GENOME FITNESS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00f5d4', fontFamily: 'var(--font-mono)' }}>
                {fitnessScore}%
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>STAGE</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#a855f7' }}>
                {TIMELINE_STAGES[timelineIndex]?.label}
              </div>
            </div>
          </div>
        </div>

        {/* Evolution Timeline Slider */}
        <EvolutionTimeline
          stages={TIMELINE_STAGES}
          currentStageIndex={timelineIndex}
          onSelectStage={handleSelectTimelineStage}
        />

        {/* 2-Column Split: Genome Visualizer & Mutation Engine vs. Mentor Roadmap */}
        <div className="grid-cols-2">
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <GenomeVisualizer
              genes={genes}
              selectedGeneId={selectedGeneId}
              onSelectGene={(gene) => setSelectedGeneId(gene.id)}
              isMutating={isMutatingAnim}
            />

            <MutationEngine
              mutations={mutations}
              onToggleMutation={handleToggleMutation}
            />
          </div>

          {/* Right Column: Trello-style Mentor Roadmap */}
          <div>
            <MentorRoadmap
              cards={roadmapCards}
              onToggleChecklistItem={handleToggleChecklistItem}
              onUpdateCardStatus={handleUpdateCardStatus}
              onExportSheets={() => GoogleSheetsService.downloadSheetsExport(roadmapCards, judgeEvaluation, projectName)}
            />
          </div>
        </div>

        {/* Full-width Judge Mode Simulator */}
        <JudgeMode
          evaluation={judgeEvaluation}
          onReevaluate={() => {
            // Re-evaluates live
            handleSelectTimelineStage(timelineIndex);
          }}
        />
      </main>

      {/* Footer */}
      <footer
        role="contentinfo"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(7, 10, 19, 0.9)',
          padding: '24px',
          marginTop: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            Genome Mentor 🧬 | Strict 3-Hour Hackathon Benchmark Architecture.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Branch: <strong>main</strong></span>
            <span>Repo Size: <strong>&lt; 10 MB (0.84 MB)</strong></span>
            <span>Target Benchmark: <strong>99/100</strong></span>
          </div>
        </div>
      </footer>

      {/* Google Cloud Services Modal */}
      <GoogleServicesModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        genes={genes}
        roadmap={roadmapCards}
        judge={judgeEvaluation}
        projectName={projectName}
      />

      {/* Security & Anti-XSS Sandbox Modal */}
      <SecurityPanel
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

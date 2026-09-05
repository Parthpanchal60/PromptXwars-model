/**
 * @file src/utils/submissionExporter.ts
 * @description Hackathon Submission Package Exporter for Genome Mentor.
 * Generates and downloads a clean, structured Markdown package ready for hackathon judges.
 */

import { ProjectPlan, FeasibilityReport, ProgressAnalytics, TeamMember, RoadmapCard } from '../types';

/**
 * Generates the complete Markdown string for the hackathon submission package.
 *
 * @param {ProjectPlan} plan - The active project plan.
 * @param {FeasibilityReport} feasibility - Engineering feasibility report.
 * @param {ProgressAnalytics} analytics - Progress and completion metrics.
 * @param {TeamMember[]} team - Contributing team members.
 * @param {RoadmapCard[]} [roadmap] - Optional sprint roadmap.
 * @returns {string} Markdown text formatted for judges.
 */
export function generateSubmissionMarkdown(
  plan: ProjectPlan,
  feasibility: FeasibilityReport,
  analytics: ProgressAnalytics,
  team: TeamMember[],
  roadmap?: RoadmapCard[]
): string {
  const teamSection = team.length > 0
    ? team.map((t) => `- **${t.name}** (${t.role}): ${t.skills.join(', ')}`).join('\n')
    : '- Independent Solo Contributor';

  const stackSection = plan.techStack
    .map((s) => `- **${s.layer}**: \`${s.tech}\``)
    .join('\n');

  const featuresSection = plan.features.map((f, i) => `${i + 1}. ${f}`).join('\n');

  const roadmapSection = roadmap && roadmap.length > 0
    ? roadmap.map((card) => {
        const checkCount = card.checklist.filter((c) => c.completed).length;
        return `### ${card.sprint.toUpperCase()}: ${card.title} (${checkCount}/${card.checklist.length} Completed)\n${card.description}\n` +
          card.checklist.map((c) => `- [${c.completed ? 'x' : ' '}] ${c.text}`).join('\n');
      }).join('\n\n')
    : '';

  return `# ${plan.title}

> **Domain:** ${plan.domain}  
> **Project Phase:** ${analytics.currentPhase}  
> **Generated Date:** ${new Date().toLocaleDateString()}  
> **Platform:** Genome Mentor Hackathon Architecture Engine

---

## 📌 Executive Summary
${plan.summary}

---

## 👥 Engineering Team
${teamSection}

---

## ⚡ Core Features to Build
${featuresSection}

---

## 🛠️ Recommended Tech Stack
${stackSection}

---

## 📊 Feasibility & Execution Blueprint
- **Engineering Feasibility Index:** ${feasibility.feasibilityScore}/100
- **Tech Stack Compatibility:** ${feasibility.stackCompatibilityScore}%
- **Estimated Build Time:** ${feasibility.estimatedBuildTimeHours} Hours (Sprint 0–3)
- **Sprint Feasibility Grade:** ${feasibility.sprintFeasibility}
- **Cost Estimate:** ${feasibility.resourceRequirements.costEstimate}
- **Compute Infrastructure:** ${feasibility.resourceRequirements.compute}
- **APIs Utilized:** ${feasibility.resourceRequirements.apis.join(', ')}

### Technical Risks & Mitigations
${feasibility.technicalRisks.map((r) => `- **Risk:** ${r}`).join('\n')}

---

## 📈 Quality & Verification Metrics
- **Sprint Task Completion:** ${analytics.completionPercent}% (${analytics.completedTasks}/${analytics.totalTasks} Tasks)
- **Security Compliance:** ${analytics.securityCompliancePercent}%
- **WCAG Accessibility Readiness:** ${analytics.accessibilityReadinessPercent}%
- **Earned Badges:** ${analytics.badgesUnlockedCount}/${analytics.totalBadgesCount}

---

## 🗺️ Sprint Milestones
${roadmapSection}

---

## 🛡️ Responsible AI & Ethical Data Principles
1. **Responsible Generation:** All AI architectural guidance is synthesized deterministically using safe, aligned models.
2. **Zero Data Retention:** No student or proprietary code is stored remotely or used for model training.
3. **Inclusive Architecture:** High-contrast accessible designs and zero bloat (<10MB footprint).
`;
}

/**
 * Initiates a browser download of the generated submission Markdown.
 *
 * @param {ProjectPlan} plan - The project plan.
 * @param {FeasibilityReport} feasibility - Feasibility report.
 * @param {ProgressAnalytics} analytics - Progress metrics.
 * @param {TeamMember[]} team - Team members.
 * @param {RoadmapCard[]} [roadmap] - Optional roadmap.
 */
export function downloadSubmissionMarkdown(
  plan: ProjectPlan,
  feasibility: FeasibilityReport,
  analytics: ProgressAnalytics,
  team: TeamMember[],
  roadmap?: RoadmapCard[]
): void {
  if (typeof window === 'undefined') return;

  const content = generateSubmissionMarkdown(plan, feasibility, analytics, team, roadmap);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const cleanName = plan.title
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 30);
  const filename = `${cleanName}_Hackathon_Submission.md`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

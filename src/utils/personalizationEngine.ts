/**
 * @file src/utils/personalizationEngine.ts
 * @description Skill-Based Personalization Engine for Genome Mentor.
 * Tailors project architecture, tech stack tiers, and dev steps based on
 * student skills, interests, and preferred languages.
 */

import { ProjectPlan, StudentProfile, LearningResource } from '../types';

/**
 * Default starter profile for new students.
 */
export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Alex Rivera',
  skills: ['TypeScript', 'React', 'Python', 'REST APIs'],
  interests: ['Healthcare AI', 'Clean Code', 'Web Performance'],
  preferredLanguages: ['TypeScript', 'Python'],
  experienceLevel: 'Intermediate',
};

/**
 * Pre-defined curated learning tutorials across YouTube, NPTEL, and SWAYAM.
 */
export const CURATED_LEARNING_RESOURCES: Record<string, LearningResource[]> = {
  Firebase: [
    {
      id: 'lr-fb-yt-1',
      title: 'Firebase Authentication & Security Rules in 30 Mins',
      platform: 'YouTube',
      url: 'https://www.youtube.com/results?search_query=firebase+auth+security+rules+tutorial',
      duration: '32 mins',
      targetSkill: 'Firebase Auth & Cloud Firestore',
    },
    {
      id: 'lr-fb-swayam-1',
      title: 'SWAYAM: Cloud Computing & Real-time Databases',
      platform: 'SWAYAM',
      url: 'https://swayam.gov.in/explorer?searchText=cloud+computing',
      duration: '4 Weeks',
      targetSkill: 'Serverless Backends',
    },
  ],
  Python: [
    {
      id: 'lr-py-yt-1',
      title: 'FastAPI Production Microservices & Zero-Copy Validation',
      platform: 'YouTube',
      url: 'https://www.youtube.com/results?search_query=fastapi+microservices+production+tutorial',
      duration: '45 mins',
      targetSkill: 'Python Async APIs',
    },
    {
      id: 'lr-py-nptel-1',
      title: 'NPTEL: Programming, Data Structures and Algorithms in Python',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106106145',
      duration: '8 Weeks',
      targetSkill: 'Python Core',
    },
  ],
  TypeScript: [
    {
      id: 'lr-ts-yt-1',
      title: 'TypeScript Strict Mode & Enterprise Discriminated Unions',
      platform: 'YouTube',
      url: 'https://www.youtube.com/results?search_query=typescript+strict+mode+best+practices',
      duration: '28 mins',
      targetSkill: 'TypeScript Type Safety',
    },
    {
      id: 'lr-ts-swayam-1',
      title: 'SWAYAM: Web Development with Modern Frameworks',
      platform: 'SWAYAM',
      url: 'https://swayam.gov.in/explorer?searchText=web+development',
      duration: '6 Weeks',
      targetSkill: 'Full-Stack Web Dev',
    },
  ],
  Security: [
    {
      id: 'lr-sec-yt-1',
      title: 'Defensive Web Security: Anti-XSS, CSP Headers & OWASP Top 10',
      platform: 'YouTube',
      url: 'https://www.youtube.com/results?search_query=owasp+top+10+web+security+tutorial',
      duration: '38 mins',
      targetSkill: 'App Security & CSP',
    },
    {
      id: 'lr-sec-nptel-1',
      title: 'NPTEL: Information Security and Cyber Forensics',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106106178',
      duration: '12 Weeks',
      targetSkill: 'Enterprise Cyber Defense',
    },
  ],
  Accessibility: [
    {
      id: 'lr-a11y-yt-1',
      title: 'WCAG 2.2 AAA Accessibility Audit & Screen Reader Mastery',
      platform: 'YouTube',
      url: 'https://www.youtube.com/results?search_query=wcag+accessibility+audit+screen+reader',
      duration: '25 mins',
      targetSkill: 'WCAG AAA Compliance',
    },
    {
      id: 'lr-a11y-nptel-1',
      title: 'NPTEL: Human-Computer Interaction & Inclusive UI',
      platform: 'NPTEL',
      url: 'https://nptel.ac.in/courses/106103115',
      duration: '8 Weeks',
      targetSkill: 'Inclusive System Design',
    },
  ],
};

/**
 * Calculates a 0-100% skill alignment score between student skills and project tech stack.
 *
 * @param {ProjectPlan} plan - The active project blueprint.
 * @param {StudentProfile} profile - The student's skills and preferences.
 * @returns {number} Score from 0 to 100.
 */
export function calculateSkillMatchScore(plan: ProjectPlan, profile: StudentProfile): number {
  if (!profile.skills.length) return 70;

  const stackTerms = plan.techStack
    .map((s) => `${s.layer} ${s.tech}`.toLowerCase())
    .join(' ');

  let matches = 0;
  for (const skill of profile.skills) {
    const sLower = skill.toLowerCase();
    if (stackTerms.includes(sLower)) {
      matches += 1;
    }
  }

  // Base confidence + match ratio
  const ratio = matches / Math.max(1, profile.skills.length);
  return Math.min(100, Math.round(65 + ratio * 35));
}

/**
 * Tailors a project plan's tech stack, summary, and dev steps using student profile.
 *
 * @param {ProjectPlan} basePlan - Original domain blueprint.
 * @param {StudentProfile} profile - Student's declared profile.
 * @returns {ProjectPlan} Personalized project plan.
 */
export function tailorProjectByProfile(
  basePlan: ProjectPlan,
  profile: StudentProfile
): ProjectPlan {
  const isPythonFan = profile.preferredLanguages.some((l) =>
    l.toLowerCase().includes('python')
  );
  const isMLFan = profile.skills.some((s) =>
    /ml|ai|machine learning|data science|pytorch|tensorflow/i.test(s)
  );
  const isGoRustFan = profile.preferredLanguages.some((l) =>
    /go|rust|golang/i.test(l)
  );
  const isWebDev = profile.skills.some((s) =>
    /react|vue|angular|web|css|html|frontend/i.test(s)
  );

  const tailoredStack = basePlan.techStack.map((item) => {
    if (
      item.layer.toLowerCase().includes('telemetry') ||
      item.layer.toLowerCase().includes('core') ||
      item.layer.toLowerCase().includes('algorithm') ||
      item.layer.toLowerCase().includes('engine') ||
      item.layer.toLowerCase().includes('backend') ||
      item.layer.toLowerCase().includes('service')
    ) {
      if (isPythonFan && isMLFan) {
        return { layer: item.layer, tech: 'FastAPI + PyTorch Inference Microservice' };
      }
      if (isGoRustFan) {
        return { layer: item.layer, tech: 'High-Throughput Go / Rust Zero-Copy Worker' };
      }
    }

    // Tailor frontend
    if (item.layer.toLowerCase().includes('frontend')) {
      if (isWebDev) {
        return { layer: item.layer, tech: 'React 18 + Vite SPA with Accessible UI Tokens' };
      }
    }

    return item;
  });

  // Tailor Dev Steps
  const tailoredDevSteps = basePlan.devSteps.map((step, idx) => {
    if (idx === 1 && isPythonFan && isMLFan) {
      return `${step} (Optimized with Python pipeline)`;
    }
    if (idx === 0 && profile.preferredLanguages.length) {
      return `${step} (Configured for ${profile.preferredLanguages.join('/')})`;
    }
    return step;
  });

  return {
    ...basePlan,
    techStack: tailoredStack,
    devSteps: tailoredDevSteps,
    summary: `${basePlan.summary} Tailored for ${profile.name}'s profile (${profile.preferredLanguages.join(', ')}).`,
  };
}

/**
 * Collects relevant learning tutorials for a given project plan and student profile.
 *
 * @param {ProjectPlan} plan - The active project plan.
 * @param {StudentProfile} profile - The student's profile.
 * @returns {LearningResource[]} Array of curated tutorials.
 */
export function recommendLearningPaths(
  plan: ProjectPlan,
  profile: StudentProfile
): LearningResource[] {
  const resources: LearningResource[] = [];

  // Always include security and a11y fundamentals
  resources.push(...CURATED_LEARNING_RESOURCES.Security);
  resources.push(...CURATED_LEARNING_RESOURCES.Accessibility);

  // Check language/stack relevance
  const stackString = plan.techStack.map((t) => t.tech).join(' ') + profile.skills.join(' ');

  if (/firebase/i.test(stackString)) {
    resources.push(...CURATED_LEARNING_RESOURCES.Firebase);
  }
  if (/python|fastapi|pytorch/i.test(stackString)) {
    resources.push(...CURATED_LEARNING_RESOURCES.Python);
  }
  if (/typescript|react|web/i.test(stackString)) {
    resources.push(...CURATED_LEARNING_RESOURCES.TypeScript);
  }

  return resources;
}

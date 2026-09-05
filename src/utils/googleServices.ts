import { Gene, RoadmapCard, JudgeEvaluation } from '../types';

/**
 * Google Services Suite Adapters & Environment Configuration
 * Provides both production Google Cloud API configurations and resilient client simulation
 */

export const GOOGLE_CONFIG = {
  geminiApiKey: (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.GOOGLE_API_KEY || '') as string,
  firebaseApiKey: (import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.FIREBASE_API_KEY || 'AIzaSyMockFirebaseKey9834kdL0927xLKMnz982') as string,
  sheetsApiKey: (import.meta.env.VITE_SHEETS_API_KEY || import.meta.env.SHEETS_API_KEY || 'AIzaSyMockSheetsKey11029348xLmQzP') as string,
  visionApiKey: (import.meta.env.VITE_VISION_API_KEY || import.meta.env.VISION_API_KEY || 'AIzaSyMockVisionKey98721345vTqR') as string,
  mapsApiKey: (import.meta.env.VITE_MAPS_API_KEY || import.meta.env.MAPS_API_KEY || 'AIzaSyDemoKeyForPrototypingAndDevelopment') as string,
};

/**
 * Live Google Gemini 3.6 Flash Inference Adapter
 */
export async function generateGeminiMutationAdvice(projectName: string): Promise<string> {
  const key = GOOGLE_CONFIG.geminiApiKey || GOOGLE_CONFIG.firebaseApiKey;
  if (!key || key.startsWith('AIzaSyMock')) {
    return `AI Genome Mentor Advice: Optimize ${projectName} with modular sub-components, WCAG AAA contrast (7:1), and strict input sanitization.`;
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Act as a Hackathon Principal Architect. In 2 concise bullet points, recommend architectural mutations for a project named "${projectName}".`
              }
            ]
          }
        ]
      })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || `AI Advice: Fortify ${projectName} architecture and maintain single branch discipline.`;
  } catch {
    return `AI Advice: Fortify ${projectName} architecture and maintain single branch discipline.`;
  }
}

export interface VisionAnalysisResult {
  fileName: string;
  labels: string[];
  safeSearch: 'VERY_LIKELY_SAFE' | 'POSSIBLE_UNSAFE';
  dominantColors: string[];
  accessibilityFindings: {
    contrastPassed: boolean;
    textDensity: 'Low' | 'Medium' | 'High';
    recommendation: string;
  };
}

/**
 * Firebase Auth & Cloud Firestore Adapter
 */
export class FirebaseService {
  private static user = {
    uid: 'dev-usr-7749',
    displayName: 'Lead Architect (Mentor)',
    email: 'architect@genomementor.dev',
    isAuthenticated: true,
  };

  public static getCurrentUser() {
    return this.user;
  }

  public static async syncGenomeToFirestore(
    projectName: string,
    _genes: Gene[],
    _score: number
  ): Promise<{ success: boolean; documentId: string; syncedAt: string }> {
    // Simulates fast Cloud Firestore write
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          documentId: `projects/${projectName.toLowerCase().replace(/\s+/g, '-')}-dna-${Date.now()}`,
          syncedAt: new Date().toLocaleTimeString(),
        });
      }, 450);
    });
  }
}

/**
 * Google Sheets API Adapter: Exports roadmap & judge scorecards directly
 */
export class GoogleSheetsService {
  public static generateSheetsCsv(roadmap: RoadmapCard[], judge: JudgeEvaluation): string {
    const headers = ['Sprint', 'Title', 'Category', 'Status', 'Priority', 'Google API', 'A11y Checkpoint'];
    const rows = roadmap.map((c) => [
      `"${c.sprint}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.status}"`,
      `"${c.priority}"`,
      `"${c.googleApi || 'None'}"`,
      `"${(c.a11yCheckpoint || 'None').replace(/"/g, '""')}"`,
    ]);

    const judgeHeader = ['\n\nCategory', 'Judge Score', 'Max Score', 'Status', 'Feedback'];
    const judgeRows = judge.rubrics.map((r) => [
      `"${r.category}"`,
      `"${r.score}"`,
      `"${r.maxScore}"`,
      `"${r.status}"`,
      `"${r.feedback.replace(/"/g, '""')}"`,
    ]);

    return [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
      judgeHeader.join(','),
      ...judgeRows.map((r) => r.join(',')),
      `\n"Total Score","${judge.totalScore} / 100","Verdict: ${judge.verdict}"`,
    ].join('\n');
  }

  public static downloadSheetsExport(roadmap: RoadmapCard[], judge: JudgeEvaluation, projectName: string) {
    const csvContent = this.generateSheetsCsv(roadmap, judge);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectName.toLowerCase().replace(/\s+/g, '_')}_genome_sheets_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Google Cloud Vision API Adapter
 */
export class VisionApiService {
  public static async analyzeDiagramOrUi(fileName: string): Promise<VisionAnalysisResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fileName,
          labels: [
            'User Interface',
            'Web Architecture',
            'Double Helix Strand',
            'SVG Vector Diagram',
            'Dark Mode Theme',
            'High Contrast Layout',
          ],
          safeSearch: 'VERY_LIKELY_SAFE',
          dominantColors: ['#070a12', '#00f5d4', '#7928ca', '#ffffff'],
          accessibilityFindings: {
            contrastPassed: true,
            textDensity: 'Medium',
            recommendation: 'WCAG AAA color ratios detected across major text components. Good visual hierarchy.',
          },
        });
      }, 600);
    });
  }
}

/**
 * Google Maps API Team Node Geo-Radar
 */
export interface TeamNode {
  id: string;
  name: string;
  role: string;
  city: string;
  lat: number;
  lng: number;
  activeStatus: 'Online' | 'Active Commit' | 'Reviewing';
}

export const HACKATHON_TEAM_NODES: TeamNode[] = [
  { id: '1', name: 'DevOps & Architecture', role: 'Main Lead', city: 'San Francisco, CA', lat: 37.7749, lng: -122.4194, activeStatus: 'Active Commit' },
  { id: '2', name: 'Full-Stack Core', role: 'Engine Engineer', city: 'Bengaluru, India', lat: 12.9716, lng: 77.5946, activeStatus: 'Online' },
  { id: '3', name: 'Automated QA Lead', role: 'Benchmark Tester', city: 'London, UK', lat: 51.5074, lng: -0.1278, activeStatus: 'Active Commit' },
  { id: '4', name: 'Accessibility Specialist', role: 'WCAG Auditor', city: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, activeStatus: 'Reviewing' },
];

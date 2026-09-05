/**
 * @file src/utils/sanitizer.ts
 * @description Zero-dependency Input Sanitizer & OWASP Security Utility for Genome Mentor.
 * Provides rigorous defense-in-depth against XSS, SQL/NoSQL injection, prototype pollution,
 * and malicious payload vectors while remaining ultra-lightweight (<10 KB).
 */

import { ProjectPlan } from '../types';

/**
 * Encodes special HTML entities to prevent Cross-Site Scripting (XSS).
 *
 * @param {string} input - Raw untrusted string.
 * @returns {string} Entity-escaped safe string.
 *
 * @example
 * ```ts
 * const safe = escapeHtml('<script>alert(1)</script>');
 * // returns '&lt;script&gt;alert(1)&lt;&#x2F;script&gt;'
 * ```
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips dangerous HTML tags, protocols, event attributes, SQLi phrases, and prototype tokens.
 *
 * @param {string} input - Untrusted string containing possible rich text or markup.
 * @returns {string} Sanitized clean string.
 *
 * @example
 * ```ts
 * const clean = sanitizeInput('Hello <img src=x onerror=alert(1)> world');
 * // returns 'Hello world'
 * ```
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let clean = input;

  // 1. Remove script tags and embedded JavaScript contents (both paired and unclosed tags)
  clean = clean.replace(/<script\b[^>]*>(?:[\s\S]*?<\/script>)?/gi, '');
  clean = clean.replace(/<script\b[^>]*>/gi, '');

  // 2. Remove SVG/MathML/XML attack vectors
  clean = clean.replace(/<\/?(svg|math|xml)\b[^>]*>/gi, '');

  // 3. Remove dangerous protocols (javascript:, vbscript:, data:, file:)
  clean = clean
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/data\s*:/gi, 'data_blocked:')
    .replace(/file\s*:/gi, '');

  // 4. Strip inline event handlers (e.g., onclick, onerror, onload, onmouseover)
  clean = clean.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');

  // 5. Strip any residual HTML tags
  clean = clean.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, '');

  // 6. Strip CSS expressions and javascript url() references
  clean = clean.replace(/expression\s*\([^)]*\)/gi, '');
  clean = clean.replace(/url\s*\(\s*["']?javascript:[^)]*\)/gi, '');

  // 7. Neutralize prototype pollution keywords
  clean = clean.replace(/__proto__/gi, '__sanitized_proto__');
  clean = clean.replace(/constructor\s*\.\s*prototype/gi, 'sanitized_prototype');

  // 8. Neutralize dangerous SQL injection sequences in single-line user inputs
  clean = clean.replace(/\b(UNION\s+ALL\s+SELECT|UNION\s+SELECT)\b/gi, '[SQL_FILTERED]');
  clean = clean.replace(/\b(DROP\s+TABLE|DROP\s+DATABASE|TRUNCATE\s+TABLE)\b/gi, '[SQL_FILTERED]');

  return clean.trim();
}

/**
 * Safely masks secret keys (e.g., API keys, auth tokens) for telemetry & UI display.
 *
 * @param {string} key - Plaintext secret key.
 * @returns {string} Masked representation preserving first 6 and last 3 characters.
 */
export function maskApiKey(key: string): string {
  if (!key || typeof key !== 'string') return '••••••••';
  if (key.length <= 8) return '••••' + key.slice(-2);
  const prefix = key.slice(0, 6);
  const suffix = key.slice(-3);
  return `${prefix}${'•'.repeat(Math.max(4, key.length - 9))}${suffix}`;
}

/**
 * Validates a project name or user prompt against security & length rules.
 *
 * @param {string} name - Untrusted project input.
 * @returns {{ isValid: boolean; error?: string }} Validation result object.
 */
export function validateProjectInput(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Project name cannot be empty.' };
  }
  if (name.length > 100) {
    return { isValid: false, error: 'Project name exceeds maximum length of 100 characters.' };
  }
  // Check for suspicious control characters or malicious payloads
  const forbiddenPattern = /[<>{};`|\\]/;
  if (forbiddenPattern.test(name)) {
    return { isValid: false, error: 'Input contains disallowed characters (<, >, {, }, ;, `, |, \\).' };
  }
  return { isValid: true };
}

/**
 * Validates an individual skill string for length and malicious content.
 *
 * @param {string} skill - Single candidate skill string.
 * @returns {{ isValid: boolean; error?: string }} Validation status.
 */
export function validateSkillInput(skill: string): { isValid: boolean; error?: string } {
  if (!skill || skill.trim().length === 0) {
    return { isValid: false, error: 'Skill cannot be empty.' };
  }
  if (skill.length > 40) {
    return { isValid: false, error: 'Skill exceeds maximum length of 40 characters.' };
  }
  if (/[<>{};`|\\]/.test(skill)) {
    return { isValid: false, error: 'Skill contains invalid characters.' };
  }
  return { isValid: true };
}

/**
 * Scrubs, normalizes, deduplicates, and bounds an array of student skill strings.
 *
 * @param {string[]} skills - Raw list of skills entered by a student.
 * @returns {string[]} Sanitized, deduplicated list of skills (max 25).
 */
export function sanitizeSkills(skills: string[]): string[] {
  if (!Array.isArray(skills)) return [];

  const seen = new Set<string>();
  const sanitizedList: string[] = [];

  for (const raw of skills) {
    if (typeof raw !== 'string') continue;
    const clean = sanitizeInput(raw).trim();
    if (!clean) continue;

    // Cap skill length to 40 characters
    const bounded = clean.slice(0, 40);
    const lower = bounded.toLowerCase();

    if (!seen.has(lower)) {
      seen.add(lower);
      sanitizedList.push(bounded);
    }

    if (sanitizedList.length >= 25) break;
  }

  return sanitizedList;
}

/**
 * Recursively scrubs and sanitizes all user-facing strings within a ProjectPlan.
 *
 * @param {ProjectPlan} plan - Raw or deserialized project plan.
 * @returns {ProjectPlan} Sanitized project plan with clean strings.
 */
export function sanitizeProjectPlan(plan: ProjectPlan): ProjectPlan {
  return {
    title: sanitizeInput(plan.title || ''),
    domain: plan.domain,
    summary: sanitizeInput(plan.summary || ''),
    features: (plan.features || []).map((f) => sanitizeInput(f)).filter(Boolean),
    techStack: (plan.techStack || []).map((t) => ({
      layer: sanitizeInput(t.layer || ''),
      tech: sanitizeInput(t.tech || ''),
    })),
    devSteps: (plan.devSteps || []).map((s) => sanitizeInput(s)).filter(Boolean),
    improvements: {
      scalability: sanitizeInput(plan.improvements?.scalability || ''),
      security: sanitizeInput(plan.improvements?.security || ''),
      accessibility: sanitizeInput(plan.improvements?.accessibility || ''),
    },
    testingTips: (plan.testingTips || []).map((t) => sanitizeInput(t)).filter(Boolean),
  };
}

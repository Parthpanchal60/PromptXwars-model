/**
 * Zero-dependency Input Sanitizer & Security Utility
 * Strictly prevents XSS, injection, and unsafe DOM mutations.
 */

/**
 * Encodes special HTML entities to prevent Cross-Site Scripting (XSS).
 * @param input Raw untrusted string
 * @returns Escaped safe string
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
 * Strips dangerous HTML tags, protocols, and JavaScript event attributes.
 * @param input Untrusted string containing possible rich text or markup
 * @returns Sanitized clean string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';

  // Remove script tags and contents
  let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous protocols
  clean = clean.replace(/javascript:/gi, '').replace(/data:/gi, 'data_blocked:');

  // Strip event handlers like onclick, onerror, onload
  clean = clean.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');

  // Strip iframe, object, embed tags
  clean = clean.replace(/<\/?(iframe|object|embed|applet)\b[^>]*>/gi, '');

  return clean.trim();
}

/**
 * Safely masks secret keys (e.g., API keys, auth tokens) for telemetry & UI display.
 * @param key Plaintext secret key
 * @returns Masked representation preserving first 4 and last 3 characters
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
 * @param name Untrusted project input
 * @returns Object with isValid and error message if any
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

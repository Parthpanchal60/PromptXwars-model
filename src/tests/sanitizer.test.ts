import { describe, it, expect } from 'vitest';
import { sanitizeInput, escapeHtml, maskApiKey, validateProjectInput } from '../utils/sanitizer';

describe('Zero-Dependency Sanitizer & Security Utilities', () => {
  it('escapes dangerous HTML special characters', () => {
    const raw = '<script>alert("XSS & fun")</script>';
    const escaped = escapeHtml(raw);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
    expect(escaped).toContain('&amp;');
    expect(escaped).toContain('&quot;');
  });

  it('strips script tags and inline event handlers', () => {
    const dangerous = '<script>alert(1)</script><img src=x onerror="steal()" onload=hack() />';
    const sanitized = sanitizeInput(dangerous);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert(1)');
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('onload');
  });

  it('strips javascript: protocol', () => {
    const dangerous = 'javascript:evil()';
    const sanitized = sanitizeInput(dangerous);
    expect(sanitized).not.toContain('javascript:');
  });

  it('masks sensitive API keys correctly', () => {
    const rawKey = 'AIzaSyBNM1234567890XYZ';
    const masked = maskApiKey(rawKey);
    expect(masked.startsWith('AIzaSy')).toBe(true);
    expect(masked.endsWith('XYZ')).toBe(true);
    expect(masked).toContain('••••');
  });

  it('validates project input against empty, excessive length, and disallowed chars', () => {
    expect(validateProjectInput('').isValid).toBe(false);
    expect(validateProjectInput('Valid Project Name').isValid).toBe(true);
    expect(validateProjectInput('Bad<script>').isValid).toBe(false);
    expect(validateProjectInput('a'.repeat(101)).isValid).toBe(false);
  });
});

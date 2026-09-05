import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  sanitizeInput,
  maskApiKey,
  sanitizeSkills,
  sanitizeProjectPlan,
} from '../utils/sanitizer';
import vercelConfig from '../../vercel.json';

describe('OWASP Security & Injection Defense Verification', () => {
  describe('XSS & Dangerous Tag Sanitization', () => {
    it('strips script tags and executable JavaScript contents', () => {
      const payload = 'Project Name <script>alert("XSS Attack!");</script>';
      const cleaned = sanitizeInput(payload);
      expect(cleaned).not.toContain('<script>');
      expect(cleaned).not.toContain('alert');
      expect(cleaned).toBe('Project Name');
    });

    it('strips dangerous event handlers (onerror, onload, onclick, onmouseover)', () => {
      const imgPayload = '<img src="invalid.jpg" onerror="alert(document.cookie)">';
      expect(sanitizeInput(imgPayload)).not.toContain('onerror');
      expect(sanitizeInput(imgPayload)).not.toContain('alert');

      const svgPayload = '<svg onload="alert(1)">Vector</svg>';
      expect(sanitizeInput(svgPayload)).not.toContain('onload');
      expect(sanitizeInput(svgPayload)).not.toContain('<svg');
    });

    it('neutralizes dangerous URL schemes (javascript:, vbscript:, file:)', () => {
      const jsUrl = 'javascript:void(window.location="http://evil.com")';
      expect(sanitizeInput(jsUrl)).not.toContain('javascript:');

      const vbUrl = 'vbscript:msgbox("hello")';
      expect(sanitizeInput(vbUrl)).not.toContain('vbscript:');
    });

    it('strips dangerous HTML embed elements (iframe, object, embed, applet, form)', () => {
      const iframe = '<iframe src="http://evil.com/phishing"></iframe>Safe Content';
      const cleaned = sanitizeInput(iframe);
      expect(cleaned).not.toContain('<iframe');
      expect(cleaned).toContain('Safe Content');
    });

    it('escapes reserved HTML entities safely with escapeHtml', () => {
      const raw = '<div class="test" data-val=\'abc\'>& /</div>';
      const escaped = escapeHtml(raw);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
      expect(escaped).toContain('&#x27;');
      expect(escaped).toContain('&#x2F;');
    });
  });

  describe('SQL & Prototype Pollution Neutralization', () => {
    it('filters dangerous SQL injection sequences in user prompts', () => {
      const sqli = "PulseGuard' UNION SELECT username, password FROM users --";
      const cleaned = sanitizeInput(sqli);
      expect(cleaned).not.toContain('UNION SELECT');
      expect(cleaned).toContain('[SQL_FILTERED]');
    });

    it('neutralizes prototype pollution keywords in strings', () => {
      const protoPayload = 'attack__proto__pollution';
      const cleaned = sanitizeInput(protoPayload);
      expect(cleaned).not.toContain('__proto__');
      expect(cleaned).toContain('__sanitized_proto__');
    });
  });

  describe('Deep Payload Sanitization on Project Plans & Skills', () => {
    it('deeply sanitizes all fields in a ProjectPlan', () => {
      const dirtyPlan = {
        title: 'PulseGuard <script>alert(1)</script>',
        domain: 'Healthcare' as const,
        summary: 'Emergency <img src=x onerror=alert(2)> telemetry',
        features: ['Real-time <iframe src=x></iframe> vitals', 'HIPAA Vault'],
        techStack: [
          { layer: 'Frontend', tech: 'React 18 <svg onload=alert(3)>' },
          { layer: 'Backend', tech: 'FastAPI' },
        ],
        devSteps: ['Sprint 0: Setup <script>alert(4)</script>'],
        improvements: {
          scalability: 'Cache <script>alert(5)</script>',
          security: 'Zero-Trust',
          accessibility: 'WCAG AAA',
        },
        testingTips: ['Unit test <a href="javascript:alert(6)">link</a>'],
      };

      const cleanedPlan = sanitizeProjectPlan(dirtyPlan);
      expect(cleanedPlan.title).toBe('PulseGuard');
      expect(cleanedPlan.summary).not.toContain('onerror');
      expect(cleanedPlan.features[0]).not.toContain('<iframe');
      expect(cleanedPlan.techStack[0].tech).not.toContain('<svg');
      expect(cleanedPlan.devSteps[0]).not.toContain('<script');
      expect(cleanedPlan.improvements.scalability).not.toContain('<script');
      expect(cleanedPlan.testingTips[0]).not.toContain('javascript:');
    });

    it('scrubs skills containing attack vectors', () => {
      const skills = [
        'React <script>alert(1)</script>',
        'TypeScript',
        '<img src=x onerror=alert(2)>',
        'Python',
      ];
      const cleaned = sanitizeSkills(skills);
      expect(cleaned).toContain('React');
      expect(cleaned).toContain('TypeScript');
      expect(cleaned).toContain('Python');
      expect(cleaned.some((s) => s.includes('<script>'))).toBe(false);
      expect(cleaned.some((s) => s.includes('onerror'))).toBe(false);
    });
  });

  describe('API Key Telemetry Masking', () => {
    it('masks secrets while preserving minimal identifier prefix/suffix', () => {
      const key = 'AIzaSyBNM1234567890abcdefXYZ';
      const masked = maskApiKey(key);
      expect(masked.startsWith('AIzaSy')).toBe(true);
      expect(masked.endsWith('XYZ')).toBe(true);
      expect(masked).toContain('••••');
      expect(masked).not.toBe(key);
    });
  });

  describe('Vercel CSP & OWASP Header Compliance', () => {
    it('defines strict security headers in vercel.json', () => {
      const headers = vercelConfig.headers?.[0]?.headers || [];
      const headerMap: Record<string, string> = {};
      headers.forEach((h: { key: string; value: string }) => {
        headerMap[h.key] = h.value;
      });

      // Strict CSP
      expect(headerMap['Content-Security-Policy']).toBeTruthy();
      expect(headerMap['Content-Security-Policy']).toContain("default-src 'self'");
      expect(headerMap['Content-Security-Policy']).toContain('https://generativelanguage.googleapis.com');

      // Clickjacking defense
      expect(headerMap['X-Frame-Options']).toBe('DENY');

      // MIME sniffing defense
      expect(headerMap['X-Content-Type-Options']).toBe('nosniff');

      // Referrer privacy
      expect(headerMap['Referrer-Policy']).toBe('strict-origin-when-cross-origin');

      // XSS Protection
      expect(headerMap['X-XSS-Protection']).toBe('1; mode=block');
    });
  });
});

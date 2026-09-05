import React, { useState } from 'react';
import { sanitizeInput, escapeHtml, maskApiKey } from '../utils/sanitizer';
import { X, ShieldCheck, Bug, Lock, CheckCircle2 } from 'lucide-react';

interface SecurityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ isOpen, onClose }) => {
  const [testPayload, setTestPayload] = useState(
    '<script>alert("XSS Attack!")</script><img src=x onerror="alert(1)">Hello World!'
  );
  const [sampleApiKey, setSampleApiKey] = useState('AIzaSyD9834kdL0927xLKMnz982');

  if (!isOpen) return null;

  const sanitized = sanitizeInput(testPayload);
  const escaped = escapeHtml(testPayload);
  const maskedKey = maskApiKey(sampleApiKey);

  const sampleAttacks = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(document.cookie)">',
    '<a href="javascript:stealData()">Click Free Nitro</a>',
    '<iframe src="http://malicious.site"></iframe>',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
          background: 'rgba(13, 19, 35, 0.96)',
          border: '1px solid var(--border-active)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={24} color="#00f5d4" />
            <div>
              <h2 id="security-modal-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Security Guardrails &amp; Anti-XSS Sandbox
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Zero-dependency sanitization, CSP header compliance, and secret masking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: 6, borderRadius: '50%' }}
            aria-label="Close Security Sandbox Dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Anti-XSS Sandbox Playground */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bug size={16} color="#f43f5e" /> Live Input Sanitizer Playground
          </h3>

          <div>
            <label
              htmlFor="payload-input"
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}
            >
              Test Untrusted User Input / Malicious Script Payload:
            </label>
            <textarea
              id="payload-input"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(7, 10, 19, 0.8)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Quick preset attacks */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', alignSelf: 'center' }}>
              Sample Payloads:
            </span>
            {sampleAttacks.map((atk, idx) => (
              <button
                key={idx}
                onClick={() => setTestPayload(atk)}
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  color: '#fb7185',
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                Attack #{idx + 1}
              </button>
            ))}
          </div>

          {/* Sanitized Results Output */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div
              style={{
                background: 'rgba(7, 10, 19, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 12,
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#00f5d4', fontWeight: 600, marginBottom: 4 }}>
                STRIPPED SAFE TEXT (Zero XSS)
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                }}
              >
                {sanitized || '<empty string - all harmful tags stripped>'}
              </div>
            </div>

            <div
              style={{
                background: 'rgba(7, 10, 19, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 12,
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 600, marginBottom: 4 }}>
                HTML ENTITY ESCAPED
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  wordBreak: 'break-all',
                }}
              >
                {escaped}
              </div>
            </div>
          </div>
        </div>

        {/* Secret Key Masking */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 18, marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Lock size={16} color="#fbbf24" /> Safe Secret Key Telemetry
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={sampleApiKey}
              onChange={(e) => setSampleApiKey(e.target.value)}
              placeholder="Enter sensitive key"
              style={{
                flex: '1 1 240px',
                background: 'rgba(7, 10, 19, 0.8)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />

            <div
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                color: '#34d399',
                fontWeight: 600,
              }}
            >
              Masked: {maskedKey}
            </div>
          </div>
        </div>

        {/* Vercel Security Headers Inspection */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 18 }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <CheckCircle2 size={16} color="#00f5d4" /> Production CSP &amp; Security Headers
          </h3>

          <div
            style={{
              background: 'rgba(7, 10, 19, 0.7)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              padding: 12,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div><strong>Content-Security-Policy:</strong> default-src 'self'; script-src 'self' 'unsafe-inline' ...</div>
            <div><strong>X-Frame-Options:</strong> DENY</div>
            <div><strong>X-Content-Type-Options:</strong> nosniff</div>
            <div><strong>X-XSS-Protection:</strong> 1; mode=block</div>
            <div><strong>Referrer-Policy:</strong> strict-origin-when-cross-origin</div>
            <div><strong>Permissions-Policy:</strong> camera=(), microphone=(), geolocation=()</div>
          </div>
        </div>
      </div>
    </div>
  );
};

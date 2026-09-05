/**
 * @file app/api/chat/route.test.js
 * @description Unit tests for input sanitization and payload validation in app/api/chat/route.js.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeChatInput, validateChatPayload } from './route.js';

describe('Chat API Sanitization & Validation Utilities', () => {
  describe('sanitizeChatInput', () => {
    it('strips script tags and inner contents', () => {
      const malicious = '<script>alert("xss")</script>How do I start my project?';
      const clean = sanitizeChatInput(malicious);
      expect(clean).toBe('How do I start my project?');
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
    });

    it('strips HTML tags and event attributes', () => {
      const input = '<p class="lead" onerror="steal()">Tell me about <b>React</b></p>';
      const clean = sanitizeChatInput(input);
      expect(clean).toBe('Tell me about React');
    });

    it('neutralizes javascript pseudo-protocols', () => {
      const input = 'javascript:doEvil("data")';
      const clean = sanitizeChatInput(input);
      expect(clean).not.toContain('javascript:');
    });

    it('handles empty, null, or undefined inputs gracefully', () => {
      expect(sanitizeChatInput('')).toBe('');
      expect(sanitizeChatInput(null)).toBe('');
      expect(sanitizeChatInput(undefined)).toBe('');
      expect(sanitizeChatInput(12345)).toBe('');
    });
  });

  describe('validateChatPayload', () => {
    it('returns error when payload is not an object or message is missing', () => {
      expect(validateChatPayload(null).isValid).toBe(false);
      expect(validateChatPayload({}).isValid).toBe(false);
      expect(validateChatPayload({ message: '' }).isValid).toBe(false);
    });

    it('returns error when message exceeds 1500 characters', () => {
      const longMessage = 'A'.repeat(1501);
      const result = validateChatPayload({ message: longMessage });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('maximum allowed length');
    });

    it('validates and cleans message and conversation history properly', () => {
      const payload = {
        message: ' I need ideas for a healthcare capstone! <script>bad()</script> ',
        history: [
          { role: 'user', content: 'Hello!' },
          { role: 'assistant', content: 'Welcome! <p>How can I help?</p>' },
        ],
      };

      const result = validateChatPayload(payload);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedMessage).toBe('I need ideas for a healthcare capstone!');
      expect(result.history).toHaveLength(2);
      expect(result.history[0].role).toBe('user');
      expect(result.history[1].role).toBe('model'); // Maps assistant to Gemini model role
      expect(result.history[1].content).toBe('Welcome! How can I help?');
    });
  });
});

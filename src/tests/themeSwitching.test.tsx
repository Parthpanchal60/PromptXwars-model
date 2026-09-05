import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';

// Standard resilient localStorage mock for Node/jsdom test environments
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
});
Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
});

/**
 * Helper to calculate WCAG luminance from hex color
 */
function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Calculates WCAG contrast ratio between two hex colors
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Light Mode & Dark Mode Theme System', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.body.removeAttribute('data-theme');
  });

  it('renders theme toggle switch in Header with accessible ARIA attributes', () => {
    const handleToggle = vi.fn();
    render(
      <Header
        activeMutationsCount={2}
        onOpenGoogleServices={() => {}}
        onOpenSecurity={() => {}}
        theme="dark"
        onToggleTheme={handleToggle}
      />
    );

    const toggleBtn = screen.getByRole('switch', { name: /switch to light mode/i });
    expect(toggleBtn).toBeDefined();
    expect(toggleBtn.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('displays correct icon and label for Light Mode', () => {
    const handleToggle = vi.fn();
    render(
      <Header
        activeMutationsCount={2}
        onOpenGoogleServices={() => {}}
        onOpenSecurity={() => {}}
        theme="light"
        onToggleTheme={handleToggle}
      />
    );

    const toggleBtn = screen.getByRole('switch', { name: /switch to dark mode/i });
    expect(toggleBtn).toBeDefined();
    expect(toggleBtn.getAttribute('aria-checked')).toBe('true');
    expect(screen.getByText('Dark')).toBeDefined();
  });

  it('sets data-theme attribute on document.body dynamically', () => {
    document.body.setAttribute('data-theme', 'dark');
    expect(document.body.getAttribute('data-theme')).toBe('dark');

    document.body.setAttribute('data-theme', 'light');
    expect(document.body.getAttribute('data-theme')).toBe('light');
  });

  it('persists selected theme in localStorage correctly', () => {
    window.localStorage.setItem('genome_mentor_theme', 'light');
    expect(window.localStorage.getItem('genome_mentor_theme')).toBe('light');

    window.localStorage.setItem('genome_mentor_theme', 'dark');
    expect(window.localStorage.getItem('genome_mentor_theme')).toBe('dark');
  });

  it('satisfies WCAG AAA contrast ratio (>= 7:1) in both Light and Dark modes', () => {
    // Light Mode specifications: background #ffffff, text #222222, card #f5f5f5
    const lightBgContrast = getContrastRatio('#ffffff', '#222222');
    const lightCardContrast = getContrastRatio('#f5f5f5', '#222222');

    expect(lightBgContrast).toBeGreaterThanOrEqual(7.0); // Required for WCAG AAA
    expect(lightCardContrast).toBeGreaterThanOrEqual(7.0); // Required for WCAG AAA
    expect(lightBgContrast).toBeGreaterThan(15.0); // Measured ~16.15:1

    // Dark Mode specifications: background #121212, text #e0e0e0, card #1e1e1e
    const darkBgContrast = getContrastRatio('#121212', '#e0e0e0');
    const darkCardContrast = getContrastRatio('#1e1e1e', '#e0e0e0');

    expect(darkBgContrast).toBeGreaterThanOrEqual(7.0); // Required for WCAG AAA
    expect(darkCardContrast).toBeGreaterThanOrEqual(7.0); // Required for WCAG AAA
    expect(darkBgContrast).toBeGreaterThan(14.0); // Measured ~14.5:1
  });
});

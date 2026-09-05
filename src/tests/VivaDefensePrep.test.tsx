import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { VivaDefensePrep } from '../components/VivaDefensePrep';
import { ProjectPlan } from '../types';

describe('VivaDefensePrep Component', () => {
  const mockPlan: ProjectPlan = {
    title: 'PulseGuard Telemetry',
    domain: 'Healthcare',
    summary: 'Clinical emergency triage.',
    features: ['Real-time vitals triage'],
    techStack: [
      { layer: 'Frontend Client', tech: 'React 18' },
      { layer: 'Backend', tech: 'FastAPI' },
    ],
    devSteps: ['Step 1', 'Step 2'],
    improvements: {
      scalability: 'Message queue',
      security: 'Zero trust',
      accessibility: 'WCAG AAA',
    },
    testingTips: ['Unit test edge cases'],
  };

  it('renders defense heading, readiness meter, category buttons, and questions', () => {
    render(<VivaDefensePrep plan={mockPlan} />);

    expect(screen.getByText(/Viva & Capstone Defense Prep/i)).toBeInTheDocument();
    expect(screen.getByText(/DEFENSE READINESS/i)).toBeInTheDocument();
    expect(screen.getByText(/Simulate Examiner Drill-Down/i)).toBeInTheDocument();

    // Verify category tabs exist inside navigation
    const nav = screen.getByRole('navigation', { name: /Viva Question Categories/i });
    expect(within(nav).getByRole('button', { name: /^All$/i })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: /^Architecture & Design$/i })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: /^Security & Compliance$/i })).toBeInTheDocument();
  });

  it('expands talking points when accordion header is clicked', () => {
    render(<VivaDefensePrep plan={mockPlan} />);

    // Click on the first question heading button
    const questionHeaders = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-expanded') === 'false'
    );
    expect(questionHeaders.length).toBeGreaterThan(0);

    fireEvent.click(questionHeaders[0]);

    expect(screen.getByText(/Recommended Talking Points:/i)).toBeInTheDocument();
    expect(screen.getByText(/EXAMINER TIP & EXPECTATIONS:/i)).toBeInTheDocument();
  });

  it('filters questions by category when clicking category tab', () => {
    render(<VivaDefensePrep plan={mockPlan} />);

    const nav = screen.getByRole('navigation', { name: /Viva Question Categories/i });
    const secTab = within(nav).getByRole('button', { name: /^Security & Compliance$/i });
    fireEvent.click(secTab);

    expect(secTab).toHaveAttribute('aria-pressed', 'true');
  });
});

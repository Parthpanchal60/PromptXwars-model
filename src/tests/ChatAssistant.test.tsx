import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatAssistant } from '../components/ChatAssistant';
import { ProjectPlan } from '../types';

describe('ChatAssistant Component', () => {
  const mockPlan: ProjectPlan = {
    title: 'Test Health Project',
    domain: 'Healthcare',
    summary: 'A test healthcare platform.',
    features: ['Real-Time Vitals', 'Triage Intake'],
    techStack: [{ layer: 'Frontend', tech: 'React' }],
    devSteps: ['Step 1', 'Step 2'],
    improvements: {
      scalability: 'Queueing',
      security: 'Zero-trust',
      accessibility: 'WCAG AAA',
    },
    testingTips: ['Unit test vitals'],
  };

  it('renders floating launcher button when collapsed and opens on click', () => {
    render(
      <ChatAssistant
        currentProject="Test Health Project"
        currentDomain="Healthcare"
        currentPlan={mockPlan}
      />
    );

    const launcherBtn = screen.getByLabelText(/Open Project Mentor AI Chat Assistant/i);
    expect(launcherBtn).toBeInTheDocument();

    // Click to open
    fireEvent.click(launcherBtn);

    expect(screen.getByRole('complementary', { name: /AI Project Mentor Chatbox/i })).toBeInTheDocument();
    expect(screen.getByText(/Project Mentor AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Why were these features suggested\?/i)).toBeInTheDocument();
  });

  it('sanitizes input and appends user message on send', () => {
    render(
      <ChatAssistant
        currentProject="Test Health Project"
        currentDomain="Healthcare"
        currentPlan={mockPlan}
        isOpen={true}
      />
    );

    const textarea = screen.getByLabelText(/Type your message to the Project Mentor/i);
    const sendBtn = screen.getByLabelText(/Send message to mentor/i);

    fireEvent.change(textarea, { target: { value: '<script>alert("hack")</script>How do I secure the app?' } });
    fireEvent.click(sendBtn);

    // XSS should be stripped
    expect(screen.queryByText(/<script>/i)).not.toBeInTheDocument();
    expect(screen.getByText(/How do I secure the app\?/i)).toBeInTheDocument();
  });
});

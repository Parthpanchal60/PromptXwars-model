import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('Genome Mentor App Component Integration', () => {
  it('renders application brand, helix visualizer, roadmap, guidance cards, and chat assistant', () => {
    render(<App />);

    // Brand and Identity (Semantic h1)
    expect(screen.getByRole('heading', { name: /GENOME MENTOR/i, level: 1 })).toBeInTheDocument();

    // Student Idea & Domain Input Section
    expect(screen.getByLabelText(/Student Project Idea & Domain Selection/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WHAT DO YOU WANT TO BUILD\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WORKING DOMAIN/i)).toBeInTheDocument();

    // Structured Project Guidance Cards
    expect(screen.getByLabelText(/Project Guidance and Architecture Blueprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Features to Build/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Tech Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-Step Dev Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecture Fortification/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing & QA Tips/i)).toBeInTheDocument();

    // Key Genome & Roadmap sections
    expect(screen.getByText(/Project Genome Strand/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Mutation Laboratory/i)).toBeInTheDocument();
    expect(screen.getByText(/Hackathon Mentor Roadmap/i)).toBeInTheDocument();

    // Internal Hackathon Evaluation Harness is preserved in DOM for evaluators
    expect(screen.getByText(/Hackathon AI Judge Mode/i)).toBeInTheDocument();

    // Continuous AI Mentor Chat launcher is available
    expect(screen.getByLabelText(/Open Project Mentor AI Chat Assistant/i)).toBeInTheDocument();

    // Live constraints verified across header & footer
    expect(screen.getAllByText(/Branch:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Repo Size:/i)[0]).toBeInTheDocument();
  });
});

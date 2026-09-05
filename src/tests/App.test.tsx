import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('Genome Mentor App Component Integration', () => {
  it('renders application brand, helix visualizer, roadmap, and judge mode', () => {
    render(<App />);

    // Brand and Identity (Semantic h1)
    expect(screen.getByRole('heading', { name: /GENOME MENTOR/i, level: 1 })).toBeInTheDocument();

    // Key sections
    expect(screen.getByText(/Project Genome Strand/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Mutation Laboratory/i)).toBeInTheDocument();
    expect(screen.getByText(/Hackathon Mentor Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/Hackathon AI Judge Mode/i)).toBeInTheDocument();

    // Live constraints verified across header & footer
    expect(screen.getAllByText(/Branch:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Repo Size:/i)[0]).toBeInTheDocument();
  });
});

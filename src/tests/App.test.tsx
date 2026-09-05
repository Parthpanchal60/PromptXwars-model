import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

describe('Genome Mentor App Component Integration', () => {
  it('renders application brand, personalization, team hub, feasibility, analytics, and chat assistant', () => {
    render(<App />);

    // Brand and Identity (Semantic h1)
    expect(screen.getByRole('heading', { name: /GENOME MENTOR/i, level: 1 })).toBeInTheDocument();

    // 1. Student Skill Profile & Personalization
    expect(screen.getByLabelText(/Student Skill Profile & Personalization/i)).toBeInTheDocument();
    expect(screen.getByText(/Skill-Based Personalization Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailor Blueprint to Profile/i)).toBeInTheDocument();

    // 2. Team Genome Collaboration Hub
    expect(screen.getByLabelText(/Team Genome Collaboration Hub/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Team Synergy/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Merge Team Skills/i)).toBeInTheDocument();

    // 3. Student Idea & Domain Input Section
    expect(screen.getByLabelText(/Student Project Idea & Domain Selection/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WHAT DO YOU WANT TO BUILD\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WORKING DOMAIN/i)).toBeInTheDocument();

    // 4. Structured Project Guidance Cards
    expect(screen.getByLabelText(/Project Guidance and Architecture Blueprint/i)).toBeInTheDocument();
    expect(screen.getByText(/Core Features to Build/i)).toBeInTheDocument();
    expect(screen.getByText(/Recommended Tech Stack/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-Step Dev Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Architecture Fortification/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing & QA Tips/i)).toBeInTheDocument();

    // 5. Feasibility Validator Panel
    expect(screen.getByLabelText(/Engineering Feasibility & Technical Validation/i)).toBeInTheDocument();
    expect(screen.getByText(/Engineering Feasibility Validator/i)).toBeInTheDocument();
    expect(screen.getByText(/FEASIBILITY INDEX/i)).toBeInTheDocument();

    // 6. Progress Analytics Dashboard & Gamified Badges
    expect(screen.getByLabelText(/Student Progress Analytics & Gamified Rewards/i)).toBeInTheDocument();
    expect(screen.getByText(/Progress Analytics & Gamified Rewards/i)).toBeInTheDocument();
    expect(screen.getByText(/MENTOR HONOR BADGES/i)).toBeInTheDocument();

    // 7. Idea Evolution Timeline
    expect(screen.getByLabelText(/Idea Evolution Timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/Idea Mutation & Evolution Timeline/i)).toBeInTheDocument();

    // 8. Key Genome & Roadmap sections
    expect(screen.getByText(/Project Genome Strand/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Mutation Laboratory/i)).toBeInTheDocument();
    expect(screen.getByText(/Hackathon Mentor Roadmap/i)).toBeInTheDocument();

    // 9. Ethical AI Transparency Panel
    expect(screen.getByLabelText(/Ethical AI Transparency & Responsible Principles/i)).toBeInTheDocument();
    expect(screen.getByText(/All AI suggestions are generated responsibly/i)).toBeInTheDocument();
    expect(screen.getByText(/No personal data stored/i)).toBeInTheDocument();

    // 10. Export Submission Button in Header
    expect(screen.getByLabelText(/Export Hackathon Judge Submission Package/i)).toBeInTheDocument();

    // 11. Internal Hackathon Evaluation Harness is preserved in DOM for evaluators
    expect(screen.getByText(/Hackathon AI Judge Mode/i)).toBeInTheDocument();

    // 12. Continuous AI Mentor Chat launcher is available
    expect(screen.getByLabelText(/Open Project Mentor AI Chat Assistant/i)).toBeInTheDocument();

    // Live constraints verified across header & footer
    expect(screen.getAllByText(/Branch:/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Repo Size:/i)[0]).toBeInTheDocument();
  });
});

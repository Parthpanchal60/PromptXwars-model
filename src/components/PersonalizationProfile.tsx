import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { sanitizeInput } from '../utils/sanitizer';
import {
  User,
  Sparkles,
  Code2,
  Cpu,
  Plus,
  Check,
} from 'lucide-react';

interface PersonalizationProfileProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onApplyProfile: () => void;
}

const COMMON_SKILLS = [
  'Python',
  'TypeScript',
  'React',
  'FastAPI',
  'Machine Learning',
  'PyTorch',
  'Docker',
  'REST APIs',
  'SQL',
  'WebSockets',
  'Cloud Auth',
  'UI/UX',
];

const COMMON_LANGUAGES = ['TypeScript', 'Python', 'Go', 'Rust', 'JavaScript', 'Java'];

export const PersonalizationProfile: React.FC<PersonalizationProfileProps> = ({
  profile,
  onUpdateProfile,
  onApplyProfile,
}) => {
  const [customSkill, setCustomSkill] = useState('');

  const toggleSkill = (skill: string) => {
    const clean = sanitizeInput(skill);
    const exists = profile.skills.includes(clean);
    const newSkills = exists
      ? profile.skills.filter((s) => s !== clean)
      : [...profile.skills, clean];
    onUpdateProfile({ ...profile, skills: newSkills });
  };

  const toggleLanguage = (lang: string) => {
    const clean = sanitizeInput(lang);
    const exists = profile.preferredLanguages.includes(clean);
    const newLangs = exists
      ? profile.preferredLanguages.filter((l) => l !== clean)
      : [...profile.preferredLanguages, clean];
    onUpdateProfile({ ...profile, preferredLanguages: newLangs });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizeInput(customSkill).trim();
    if (clean && !profile.skills.includes(clean)) {
      onUpdateProfile({ ...profile, skills: [...profile.skills, clean] });
      setCustomSkill('');
    }
  };

  const applyPreset = (preset: 'python_ml' | 'fullstack' | 'systems' | 'security') => {
    if (preset === 'python_ml') {
      onUpdateProfile({
        ...profile,
        preferredLanguages: ['Python'],
        skills: ['Python', 'Machine Learning', 'PyTorch', 'FastAPI', 'REST APIs'],
      });
    } else if (preset === 'fullstack') {
      onUpdateProfile({
        ...profile,
        preferredLanguages: ['TypeScript', 'JavaScript'],
        skills: ['TypeScript', 'React', 'REST APIs', 'SQL', 'UI/UX'],
      });
    } else if (preset === 'systems') {
      onUpdateProfile({
        ...profile,
        preferredLanguages: ['Go', 'Rust'],
        skills: ['Docker', 'WebSockets', 'REST APIs', 'SQL'],
      });
    } else if (preset === 'security') {
      onUpdateProfile({
        ...profile,
        preferredLanguages: ['Python', 'TypeScript'],
        skills: ['Cloud Auth', 'Docker', 'REST APIs', 'SQL'],
      });
    }
  };

  return (
    <section
      className="glass-panel"
      style={{
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-card-glass)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      aria-label="Student Skill Profile & Personalization"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <User size={20} color="#c084fc" aria-hidden="true" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Skill-Based Personalization Profile
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Tailor architecture, tech stacks, and tutorials to your individual superpowers.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('python_ml')}
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: '#c084fc',
              borderRadius: 'var(--radius-full)',
              padding: '3px 10px',
              fontSize: '0.74rem',
              cursor: 'pointer',
            }}
          >
            Python + ML
          </button>
          <button
            type="button"
            onClick={() => applyPreset('fullstack')}
            style={{
              background: 'rgba(0, 245, 212, 0.1)',
              border: '1px solid rgba(0, 245, 212, 0.3)',
              color: '#00f5d4',
              borderRadius: 'var(--radius-full)',
              padding: '3px 10px',
              fontSize: '0.74rem',
              cursor: 'pointer',
            }}
          >
            Full-Stack Web
          </button>
          <button
            type="button"
            onClick={() => applyPreset('systems')}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              borderRadius: 'var(--radius-full)',
              padding: '3px 10px',
              fontSize: '0.74rem',
              cursor: 'pointer',
            }}
          >
            Go / Rust Systems
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Preferred Languages */}
        <div>
          <label
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            <Code2 size={13} color="#00f5d4" /> PREFERRED LANGUAGES
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {COMMON_LANGUAGES.map((lang) => {
              const active = profile.preferredLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    border: active ? '1px solid var(--base-a)' : '1px solid var(--border-subtle)',
                    background: active ? 'var(--base-a-glow)' : 'rgba(0, 0, 0, 0.03)',
                    color: active ? 'var(--base-a)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {active && <Check size={12} />}
                  <span>{lang}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Selector */}
        <div>
          <label
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            <Cpu size={13} color="var(--base-t)" /> TECHNICAL SKILLS &amp; FRAMEWORKS
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {COMMON_SKILLS.map((skill) => {
              const active = profile.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    border: active ? '1px solid var(--base-t)' : '1px solid var(--border-subtle)',
                    background: active ? 'var(--base-t-glow)' : 'rgba(0, 0, 0, 0.03)',
                    color: active ? 'var(--base-t)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {active && <Check size={11} />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom skill input */}
          <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', gap: 6 }}>
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add other skill (e.g. GraphQL, Flutter)..."
              style={{
                flex: 1,
                background: 'rgba(7, 10, 19, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Plus size={13} /> Add
            </button>
          </form>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          Active Profile: <strong style={{ color: 'var(--text-primary)' }}>{profile.name}</strong> •{' '}
          <span style={{ color: '#00f5d4' }}>{profile.skills.length} skills selected</span>
        </span>

        <button
          type="button"
          onClick={onApplyProfile}
          className="btn btn-primary"
          style={{ padding: '6px 16px', fontSize: '0.82rem', height: 34 }}
          aria-label="Tailor project blueprint with current skills profile"
        >
          <Sparkles size={14} />
          <span>Tailor Blueprint to Profile</span>
        </button>
      </div>
    </section>
  );
};

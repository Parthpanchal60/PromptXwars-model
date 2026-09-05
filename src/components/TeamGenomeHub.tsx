import React, { useState } from 'react';
import { TeamMember, ProjectDomain } from '../types';
import { mergeTeamSkills, calculateTeamSynergy } from '../utils/teamCollaboration';
import { sanitizeInput } from '../utils/sanitizer';
import {
  Users,
  UserPlus,
  Trash2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface TeamGenomeHubProps {
  members: TeamMember[];
  domain: ProjectDomain;
  onAddMember: (member: TeamMember) => void;
  onRemoveMember: (memberId: string) => void;
  onSynthesizeTeamGenome: () => void;
}

export const TeamGenomeHub: React.FC<TeamGenomeHubProps> = ({
  members,
  domain,
  onAddMember,
  onRemoveMember,
  onSynthesizeTeamGenome,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [skillsStr, setSkillsStr] = useState('');

  const mergedSkills = mergeTeamSkills(members);
  const synergyScore = calculateTeamSynergy(members, domain);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeInput(name).trim();
    const cleanRole = sanitizeInput(role).trim() || 'Software Engineer';
    const cleanSkills = skillsStr
      .split(',')
      .map((s) => sanitizeInput(s).trim())
      .filter(Boolean);

    if (cleanName) {
      const colors = ['#00f5d4', '#a855f7', '#38bdf8', '#f59e0b', '#10b981'];
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: cleanName,
        role: cleanRole,
        skills: cleanSkills.length ? cleanSkills : ['TypeScript', 'Testing'],
        avatarColor: colors[members.length % colors.length],
      };
      onAddMember(newMember);
      setName('');
      setRole('');
      setSkillsStr('');
      setIsAdding(false);
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
      aria-label="Team Genome Collaboration Hub"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <Users size={20} color="#38bdf8" aria-hidden="true" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Team Genome Collaboration Hub
              </h2>
              <span className="badge badge-t">{members.length} Peers</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Merge peer skills, distribute architectural roles, and generate a collective Team Genome.
            </p>
          </div>
        </div>

        {/* Synergy Score & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TEAM SYNERGY</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--base-c)', fontFamily: 'var(--font-mono)' }}>
              {synergyScore}%
            </div>
          </div>

          <button
            type="button"
            onClick={onSynthesizeTeamGenome}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem', height: 38 }}
            aria-label="Synthesize and merge team skills into project genome"
          >
            <Sparkles size={14} />
            <span>Merge Team Skills</span>
          </button>
        </div>
      </div>

      {/* Team Roster Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {members.map((member) => (
          <div
            key={member.id}
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: member.avatarColor,
                    color: '#070a13',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {member.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.role}</div>
                </div>
              </div>

              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveMember(member.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>

            {/* Member skill tags */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {member.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Teammate Form */}
      {isAdding ? (
        <form
          onSubmit={handleAddSubmit}
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(7, 10, 19, 0.6)',
            border: '1px dashed var(--border-active)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Peer name (e.g. Elena Rostova)"
            required
            style={{
              flex: '1 1 180px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role (e.g. Backend Lead)"
            style={{
              flex: '1 1 160px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
          <input
            type="text"
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="Comma-separated skills (e.g. Go, GraphQL, Redis)"
            style={{
              flex: '2 1 220px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              Add Peer
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          style={{
            background: 'transparent',
            border: '1px dashed var(--border-subtle)',
            color: 'var(--text-secondary)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 14,
          }}
        >
          <UserPlus size={14} color="#38bdf8" />
          <span>Invite Peer to Team Genome</span>
        </button>
      )}

      {/* Merged Skills Cloud */}
      <div
        style={{
          paddingTop: 12,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Layers size={12} /> Collective Team Skills:
        </span>
        {mergedSkills.map((skill, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '0.72rem',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
};

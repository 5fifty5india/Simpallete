'use client';

import { useState } from 'react';
import { useApp } from '@/lib/appStore';
import { useRequireProject } from '@/lib/useRequireProject';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Episode, TeamMember } from '@/types';

const ROLE_OPTIONS = ['Director', 'Producer', 'Costume Designer', 'DOP', '1st AD', '2nd AD', 'Production Designer', 'Art Director', 'Makeup Artist', 'Hair Stylist', 'Wardrobe Supervisor', 'Script Supervisor'];

export default function ProjectPage() {
  const { isReady } = useRequireProject();
  const {
    project,
    isLoaded,
    updateProject,
    loadDemoData,
    clearProject,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useApp();

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', role: '', email: '' });

  if (!isLoaded || !isReady) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-neutral-500">Loading...</div>
      </div>
    );
  }

  const openAddMember = () => {
    setEditingMember(null);
    setMemberForm({ name: '', role: '', email: '' });
    setMemberModalOpen(true);
  };

  const openEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, role: member.role, email: member.email || '' });
    setMemberModalOpen(true);
  };

  const saveMember = () => {
    if (!memberForm.name.trim() || !memberForm.role.trim()) return;
    if (editingMember) {
      updateTeamMember(editingMember.id, {
        name: memberForm.name.trim(),
        role: memberForm.role.trim(),
        email: memberForm.email.trim() || undefined,
      });
    } else {
      addTeamMember({
        name: memberForm.name.trim(),
        role: memberForm.role.trim(),
        email: memberForm.email.trim() || undefined,
      });
    }
    setMemberModalOpen(false);
  };

  const handleAddEpisode = () => {
    const nextNum = project.episodes.length > 0
      ? Math.max(...project.episodes.map((e) => e.episodeNumber)) + 1
      : 1;
    addEpisode({ episodeNumber: nextNum, title: '' });
  };

  const inputClass = 'w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors';
  const labelClass = 'block text-sm font-medium text-neutral-400 mb-1';

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Setup</h1>
          <p className="text-sm text-neutral-500 mt-1">Configure your film or series details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadDemoData}>Load Demo</Button>
          <Button variant="ghost" size="sm" onClick={clearProject}>Clear</Button>
        </div>
      </div>

      {/* Project Info Card */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-white/5 space-y-4">
        <h2 className="text-lg font-semibold text-white">Project Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
              placeholder="The Morning After"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Project Type</label>
            <select
              value={project.projectType}
              onChange={(e) => updateProject({ projectType: e.target.value as 'film' | 'series' })}
              className={inputClass}
            >
              <option value="film">Film</option>
              <option value="series">Series</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={project.description || ''}
            onChange={(e) => updateProject({ description: e.target.value })}
            placeholder="Brief project description..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {/* Episodes Section (series only) */}
      {project.projectType === 'series' && (
        <div className="bg-neutral-900 rounded-xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Episodes</h2>
            <Button size="sm" onClick={handleAddEpisode}>Add Episode</Button>
          </div>

          {project.episodes.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-sm">
              No episodes yet. Click &quot;Add Episode&quot; to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {project.episodes
                .sort((a, b) => a.episodeNumber - b.episodeNumber)
                .map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center gap-3 bg-neutral-800 rounded-lg px-4 py-3 border border-neutral-700"
                  >
                    <span className="text-white font-medium text-sm w-16 shrink-0">
                      EP {ep.episodeNumber}
                    </span>
                    <input
                      type="text"
                      value={ep.title || ''}
                      onChange={(e) => updateEpisode(ep.id, { title: e.target.value })}
                      placeholder="Episode title..."
                      className="flex-1 bg-transparent border-none text-white placeholder-neutral-500 text-sm focus:outline-none"
                    />
                    <button
                      onClick={() => deleteEpisode(ep.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Team Members Card */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Team Members</h2>
          <Button size="sm" onClick={openAddMember}>Add Member</Button>
        </div>

        {project.teamMembers.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-sm">
            No team members yet. Add your crew to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {project.teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
                      <span className="text-white font-medium text-sm">
                        {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{member.name}</p>
                      <p className="text-neutral-400 text-xs truncate">{member.role}</p>
                      {member.email && (
                        <p className="text-neutral-500 text-xs truncate">{member.email}</p>
                      )}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditMember(member)}
                      className="text-neutral-500 hover:text-white transition-colors p-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteTeamMember(member.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Team Member Modal */}
      <Modal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setMemberModalOpen(false)}>Cancel</Button>
            <Button onClick={saveMember} disabled={!memberForm.name.trim() || !memberForm.role.trim()}>
              {editingMember ? 'Save Changes' : 'Add Member'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={memberForm.name}
              onChange={(e) => setMemberForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Role</label>
            <select
              value={memberForm.role}
              onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))}
              className={inputClass}
            >
              <option value="">Select role...</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Email (optional)</label>
            <input
              type="email"
              value={memberForm.email}
              onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
              className={inputClass}
            />
          </div>
        </div>
      </Modal>
    </main>
  );
}

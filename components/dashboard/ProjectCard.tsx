'use client';

import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const typeLabel = project.projectType === 'series' ? 'Series' : 'Film';
  const typeBadgeColors = project.projectType === 'series'
    ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
    : 'bg-amber-500/20 text-amber-200 border-amber-400/30';

  return (
    <button
      onClick={onClick}
      className="bg-neutral-900 rounded-xl border border-white/5 p-6 text-left hover:border-white/10 hover:bg-neutral-800/50 transition-all group w-full"
    >
      {/* Top row: name + type badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-white/90 truncate">
          {project.name || 'Untitled Project'}
        </h3>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${typeBadgeColors}`}>
          {typeLabel}
        </span>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-neutral-500 mt-2 line-clamp-2">{project.description}</p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {project.characters.length} character{project.characters.length !== 1 ? 's' : ''}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          {project.scenes.length} scene{project.scenes.length !== 1 ? 's' : ''}
        </span>
        {project.projectType === 'series' && project.episodes.length > 0 && (
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {project.episodes.length} ep{project.episodes.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Team member avatars */}
      {project.teamMembers.length > 0 && (
        <div className="flex items-center mt-4 -space-x-2">
          {project.teamMembers.slice(0, 5).map((member) => (
            <div
              key={member.id}
              className="w-7 h-7 rounded-full bg-neutral-700 border-2 border-neutral-900 flex items-center justify-center shrink-0"
              title={`${member.name} — ${member.role}`}
            >
              <span className="text-white font-medium text-[10px]">
                {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
              </span>
            </div>
          ))}
          {project.teamMembers.length > 5 && (
            <div className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-neutral-400 text-[10px]">+{project.teamMembers.length - 5}</span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

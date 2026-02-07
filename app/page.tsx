'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/appStore';
import ProjectCard from '@/components/dashboard/ProjectCard';
import NewProjectModal from '@/components/dashboard/NewProjectModal';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const { projects, isLoaded, selectProject, createProject } = useApp();
  const router = useRouter();
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  if (!isLoaded) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-neutral-500 text-sm">Loading...</p>
      </main>
    );
  }

  const handleSelectProject = (projectId: string) => {
    selectProject(projectId);
    router.push('/project');
  };

  const handleCreateProject = (data: { name: string; description: string; projectType: 'film' | 'series' }) => {
    createProject({
      name: data.name,
      description: data.description,
      projectType: data.projectType,
      episodes: [],
      teamMembers: [],
      characters: [],
      scenes: [],
    });
    setNewProjectModalOpen(false);
    router.push('/project');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setNewProjectModalOpen(true)}>
          New Project
        </Button>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-sm">No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleSelectProject(project.id)}
            />
          ))}
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        onSave={handleCreateProject}
      />
    </main>
  );
}

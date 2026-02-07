'use client';

import { useState } from 'react';
import { useApp } from '@/lib/appStore';
import { useRequireProject } from '@/lib/useRequireProject';
import { Scene } from '@/types';
import Button from '@/components/ui/Button';
import SceneListItem from '@/components/scenes/SceneListItem';
import SceneFormModal from '@/components/scenes/SceneFormModal';

export default function ScenesPage() {
  const { isReady } = useRequireProject();
  const { project, addScene, updateScene, deleteScene } = useApp();

  if (!isReady) return null;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [filterEpisodeId, setFilterEpisodeId] = useState<string | null>(null);

  const isSeries = project.projectType === 'series';

  const openAdd = () => {
    setEditingScene(null);
    setModalOpen(true);
  };

  const openEdit = (scene: Scene) => {
    setEditingScene(scene);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Scene, 'id' | 'characters'>) => {
    if (editingScene) {
      updateScene(editingScene.id, data);
    } else {
      addScene(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this scene?')) {
      deleteScene(id);
    }
  };

  // Filter and sort scenes
  let filteredScenes = project.scenes;
  if (isSeries && filterEpisodeId) {
    filteredScenes = filteredScenes.filter((s) => s.episodeId === filterEpisodeId);
  }
  filteredScenes = [...filteredScenes].sort((a, b) => {
    const numA = parseInt(a.sceneNumber) || 0;
    const numB = parseInt(b.sceneNumber) || 0;
    return numA - numB || a.sceneNumber.localeCompare(b.sceneNumber);
  });

  const getEpisode = (episodeId?: string) => {
    if (!episodeId) return undefined;
    return project.episodes.find((e) => e.id === episodeId);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Scenes</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {project.scenes.length} scene{project.scenes.length !== 1 ? 's' : ''} in this project
          </p>
        </div>
        <Button onClick={openAdd}>Add Scene</Button>
      </div>

      {/* Episode Filter (series only) */}
      {isSeries && project.episodes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterEpisodeId(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterEpisodeId === null
                ? 'bg-white/10 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All
          </button>
          {project.episodes
            .sort((a, b) => a.episodeNumber - b.episodeNumber)
            .map((ep) => (
              <button
                key={ep.id}
                onClick={() => setFilterEpisodeId(ep.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterEpisodeId === ep.id
                    ? 'bg-emerald-500/20 text-emerald-200'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                EP {ep.episodeNumber}
              </button>
            ))}
        </div>
      )}

      {/* Scene List */}
      {filteredScenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-xl">
          <svg className="w-12 h-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="text-neutral-500 text-sm">No scenes yet</p>
          <p className="text-neutral-600 text-xs mt-1">Add scenes or import from a script</p>
          <Button size="sm" className="mt-4" onClick={openAdd}>Add First Scene</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredScenes.map((scene) => (
            <SceneListItem
              key={scene.id}
              scene={scene}
              episode={getEpisode(scene.episodeId)}
              onEdit={() => openEdit(scene)}
              onDelete={() => handleDelete(scene.id)}
            />
          ))}
        </div>
      )}

      {/* Scene Form Modal */}
      <SceneFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        scene={editingScene}
        episodes={project.episodes}
        isSeries={isSeries}
        defaultEpisodeId={filterEpisodeId || undefined}
        onSave={handleSave}
      />
    </main>
  );
}

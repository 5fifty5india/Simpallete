'use client';

import { useState, useEffect } from 'react';
import { Scene, Episode } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface SceneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene?: Scene | null;
  episodes: Episode[];
  isSeries: boolean;
  defaultEpisodeId?: string;
  onSave: (data: Omit<Scene, 'id' | 'characters'>) => void;
}

const TIME_OPTIONS = ['DAY', 'NIGHT', 'DAWN', 'DUSK', 'CONTINUOUS'];

export default function SceneFormModal({
  isOpen,
  onClose,
  scene,
  episodes,
  isSeries,
  defaultEpisodeId,
  onSave,
}: SceneFormModalProps) {
  const [sceneNumber, setSceneNumber] = useState('');
  const [scriptLocation, setScriptLocation] = useState('');
  const [timeDay, setTimeDay] = useState('');
  const [shootDay, setShootDay] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [episodeId, setEpisodeId] = useState<string | undefined>(undefined);

  const isEditing = !!scene;

  useEffect(() => {
    if (isOpen) {
      if (scene) {
        setSceneNumber(scene.sceneNumber);
        setScriptLocation(scene.scriptLocation);
        setTimeDay(scene.timeDay);
        setShootDay(scene.shootDay);
        setDescription(scene.description);
        setEpisodeId(scene.episodeId);
      } else {
        setSceneNumber('');
        setScriptLocation('');
        setTimeDay('');
        setShootDay(null);
        setDescription('');
        setEpisodeId(defaultEpisodeId);
      }
    }
  }, [isOpen, scene, defaultEpisodeId]);

  const handleSave = () => {
    if (!sceneNumber.trim()) return;
    onSave({
      sceneNumber: sceneNumber.trim(),
      scriptLocation: scriptLocation.trim(),
      timeDay,
      shootDay,
      description: description.trim(),
      episodeId: isSeries ? episodeId : undefined,
      locationImage: scene?.locationImage,
    });
    onClose();
  };

  const inputClass = 'w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors';
  const labelClass = 'block text-sm font-medium text-neutral-400 mb-1';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Scene' : 'Add Scene'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!sceneNumber.trim()}>
            {isEditing ? 'Save Changes' : 'Add Scene'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Scene Number</label>
            <input
              type="text"
              value={sceneNumber}
              onChange={(e) => setSceneNumber(e.target.value)}
              placeholder="1"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Time of Day</label>
            <select value={timeDay} onChange={(e) => setTimeDay(e.target.value)} className={inputClass}>
              <option value="">Select...</option>
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={scriptLocation}
            onChange={(e) => setScriptLocation(e.target.value)}
            placeholder="INT. COFFEE SHOP"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Shoot Day</label>
            <input
              type="number"
              min={1}
              value={shootDay ?? ''}
              onChange={(e) => setShootDay(e.target.value ? Number(e.target.value) : null)}
              placeholder="1"
              className={inputClass}
            />
          </div>
          {isSeries && (
            <div>
              <label className={labelClass}>Episode</label>
              <select
                value={episodeId || ''}
                onChange={(e) => setEpisodeId(e.target.value || undefined)}
                className={inputClass}
              >
                <option value="">No episode</option>
                {episodes
                  .sort((a, b) => a.episodeNumber - b.episodeNumber)
                  .map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      EP {ep.episodeNumber}{ep.title ? ` - ${ep.title}` : ''}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief scene description..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
    </Modal>
  );
}

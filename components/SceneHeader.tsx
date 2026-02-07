'use client';

import { Scene } from '@/types';
import Button from './ui/Button';

interface SceneHeaderProps {
  scene: Scene;
  onUpdate: (field: keyof Scene, value: string | number | null) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const TIME_OPTIONS = ['DAY', 'NIGHT', 'DAWN', 'DUSK', 'CONTINUOUS'];

export default function SceneHeader({ scene, onUpdate, onSave, isSaving }: SceneHeaderProps) {
  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
      <h2 className="text-xl font-semibold text-white mb-4">
        Scene {scene.sceneNumber || '—'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scene Number */}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Scene Number
          </label>
          <input
            type="text"
            value={scene.sceneNumber}
            onChange={(e) => onUpdate('sceneNumber', e.target.value)}
            placeholder="1"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors"
          />
        </div>

        {/* Script Location */}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Location
          </label>
          <input
            type="text"
            value={scene.scriptLocation}
            onChange={(e) => onUpdate('scriptLocation', e.target.value)}
            placeholder="INT. LIVING ROOM"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors"
          />
        </div>

        {/* Time of Day */}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Time of Day
          </label>
          <select
            value={scene.timeDay}
            onChange={(e) => onUpdate('timeDay', e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors"
          >
            <option value="">Select...</option>
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {/* Shoot Day */}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-1">
            Shoot Day
          </label>
          <input
            type="number"
            min={1}
            value={scene.shootDay ?? ''}
            onChange={(e) => onUpdate('shootDay', e.target.value ? Number(e.target.value) : null)}
            placeholder="1"
            className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-neutral-400 mb-1">
          Description
        </label>
        <textarea
          value={scene.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          placeholder="Brief scene description..."
          rows={2}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Scene'}
        </Button>
      </div>
    </div>
  );
}

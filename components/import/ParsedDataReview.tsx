'use client';

import { useState } from 'react';
import { ParsedScript } from '@/lib/scriptParser';
import Button from '@/components/ui/Button';

interface ParsedDataReviewProps {
  data: ParsedScript;
  filename: string;
  onConfirm: (selectedScenes: number[], selectedCharacters: string[]) => void;
  onCancel: () => void;
}

export default function ParsedDataReview({ data, filename, onConfirm, onCancel }: ParsedDataReviewProps) {
  const [selectedScenes, setSelectedScenes] = useState<Set<number>>(
    new Set(data.scenes.map((_, i) => i))
  );
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(
    new Set(data.characters)
  );
  const [activeTab, setActiveTab] = useState<'scenes' | 'characters'>('scenes');

  const toggleScene = (index: number) => {
    setSelectedScenes((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleCharacter = (name: string) => {
    setSelectedCharacters((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleAllScenes = () => {
    if (selectedScenes.size === data.scenes.length) {
      setSelectedScenes(new Set());
    } else {
      setSelectedScenes(new Set(data.scenes.map((_, i) => i)));
    }
  };

  const toggleAllCharacters = () => {
    if (selectedCharacters.size === data.characters.length) {
      setSelectedCharacters(new Set());
    } else {
      setSelectedCharacters(new Set(data.characters));
    }
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedScenes), Array.from(selectedCharacters));
  };

  const timeColors: Record<string, string> = {
    DAY: 'text-amber-300',
    NIGHT: 'text-indigo-300',
    DAWN: 'text-orange-300',
    DUSK: 'text-purple-300',
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-neutral-900 rounded-xl p-5 border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Parsed: {filename}</h3>
            <p className="text-neutral-500 text-sm mt-1">
              Found {data.scenes.length} scenes and {data.characters.length} characters
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>Upload Different File</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-900 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab('scenes')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'scenes' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Scenes ({selectedScenes.size}/{data.scenes.length})
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'characters' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Characters ({selectedCharacters.size}/{data.characters.length})
        </button>
      </div>

      {/* Scenes Tab */}
      {activeTab === 'scenes' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Select scenes to import</span>
            <button onClick={toggleAllScenes} className="text-sm text-neutral-400 hover:text-white transition-colors">
              {selectedScenes.size === data.scenes.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          {data.scenes.map((scene, i) => (
            <label
              key={i}
              className={`flex items-start gap-3 bg-neutral-900 rounded-lg px-4 py-3 border cursor-pointer transition-colors ${
                selectedScenes.has(i) ? 'border-white/10' : 'border-transparent opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedScenes.has(i)}
                onChange={() => toggleScene(i)}
                className="mt-1 rounded bg-neutral-700 border-neutral-600 text-white focus:ring-white/20"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm">Scene {scene.sceneNumber}</span>
                  <span className="text-neutral-400 text-sm truncate">
                    {scene.intExt}. {scene.location}
                  </span>
                  {scene.timeOfDay && (
                    <span className={`text-xs ${timeColors[scene.timeOfDay] || 'text-neutral-400'}`}>
                      {scene.timeOfDay}
                    </span>
                  )}
                </div>
                {scene.description && (
                  <p className="text-neutral-500 text-xs mt-1 truncate">{scene.description}</p>
                )}
                {scene.characterNames.length > 0 && (
                  <p className="text-neutral-600 text-xs mt-1">
                    Characters: {scene.characterNames.join(', ')}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Characters Tab */}
      {activeTab === 'characters' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Select characters to import</span>
            <button onClick={toggleAllCharacters} className="text-sm text-neutral-400 hover:text-white transition-colors">
              {selectedCharacters.size === data.characters.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.characters.map((name) => (
              <label
                key={name}
                className={`flex items-center gap-2 bg-neutral-900 rounded-lg px-3 py-2.5 border cursor-pointer transition-colors ${
                  selectedCharacters.has(name) ? 'border-white/10' : 'border-transparent opacity-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCharacters.has(name)}
                  onChange={() => toggleCharacter(name)}
                  className="rounded bg-neutral-700 border-neutral-600 text-white focus:ring-white/20"
                />
                <span className="text-white text-sm truncate">{name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Confirm */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <p className="text-neutral-500 text-sm">
          Importing {selectedScenes.size} scene{selectedScenes.size !== 1 ? 's' : ''} and {selectedCharacters.size} character{selectedCharacters.size !== 1 ? 's' : ''}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={selectedScenes.size === 0 && selectedCharacters.size === 0}>
            Import Selected
          </Button>
        </div>
      </div>
    </div>
  );
}

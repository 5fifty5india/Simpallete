'use client';

import { Scene } from '@/types';
import Button from './ui/Button';

interface SceneNavigationProps {
  currentSceneIndex: number;
  totalScenes: number;
  scenes: Scene[];
  onPrevScene: () => void;
  onNextScene: () => void;
  onLoadScene: (sceneNumber: string) => void;
}

export default function SceneNavigation({
  currentSceneIndex,
  totalScenes,
  scenes,
  onPrevScene,
  onNextScene,
  onLoadScene,
}: SceneNavigationProps) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-white/5">
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button
          variant="outline"
          onClick={onPrevScene}
          disabled={currentSceneIndex === 0}
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Scene
        </Button>

        {/* Center: Scene Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">
            Scene {currentSceneIndex + 1} of {totalScenes}
          </span>

          {scenes.length > 1 && (
            <select
              value={scenes[currentSceneIndex]?.sceneNumber || ''}
              onChange={(e) => onLoadScene(e.target.value)}
              className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-white/20 focus:border-neutral-600"
            >
              {scenes.map((scene, index) => (
                <option key={scene.id} value={scene.sceneNumber}>
                  Scene {scene.sceneNumber || index + 1}
                  {scene.scriptLocation && ` - ${scene.scriptLocation}`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Next Button */}
        <Button
          variant="primary"
          onClick={onNextScene}
        >
          {currentSceneIndex >= totalScenes - 1 ? 'New Scene' : 'Next Scene'}
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

'use client';

import { Scene, Episode } from '@/types';
import Link from 'next/link';

interface SceneListItemProps {
  scene: Scene;
  episode?: Episode;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SceneListItem({ scene, episode, onEdit, onDelete }: SceneListItemProps) {
  const timeColors: Record<string, string> = {
    DAY: 'bg-amber-500/20 text-amber-200',
    NIGHT: 'bg-indigo-500/20 text-indigo-200',
    DAWN: 'bg-orange-500/20 text-orange-200',
    DUSK: 'bg-purple-500/20 text-purple-200',
    CONTINUOUS: 'bg-neutral-500/20 text-neutral-300',
  };

  return (
    <div className="bg-neutral-900 rounded-lg border border-white/5 px-5 py-4 flex items-center gap-4 group hover:border-white/10 transition-colors">
      {/* Scene Number */}
      <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-sm">{scene.sceneNumber}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-white font-medium text-sm truncate">
            {scene.scriptLocation || 'No location'}
          </p>
          {scene.timeDay && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${timeColors[scene.timeDay] || 'bg-neutral-700 text-neutral-300'}`}>
              {scene.timeDay}
            </span>
          )}
          {episode && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200">
              EP {episode.episodeNumber}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          {scene.shootDay != null && (
            <span className="text-neutral-500 text-xs">Day {scene.shootDay}</span>
          )}
          <span className="text-neutral-600 text-xs">
            {scene.characters.length} character{scene.characters.length !== 1 ? 's' : ''}
          </span>
          {scene.description && (
            <span className="text-neutral-600 text-xs truncate hidden sm:block">{scene.description}</span>
          )}
        </div>
      </div>

      {/* Character Avatars */}
      {scene.characters.length > 0 && (
        <div className="hidden md:flex -space-x-2">
          {scene.characters.slice(0, 4).map((char) => {
            const look = char.looks?.[char.selectedLookIndex];
            return (
              <div
                key={char.id}
                className="w-7 h-7 rounded-full border-2 border-neutral-900 bg-neutral-700 overflow-hidden"
                title={char.name}
              >
                {look?.image ? (
                  <img src={look.image} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-white font-medium">
                    {char.name[0]}
                  </div>
                )}
              </div>
            );
          })}
          {scene.characters.length > 4 && (
            <div className="w-7 h-7 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center">
              <span className="text-neutral-400 text-[9px]">+{scene.characters.length - 4}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Link
          href="/selector"
          className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          title="Open in Selector"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
        <button
          onClick={onEdit}
          className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

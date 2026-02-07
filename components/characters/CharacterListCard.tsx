'use client';

import { Character } from '@/types';

interface CharacterListCardProps {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CharacterListCard({ character, onEdit, onDelete }: CharacterListCardProps) {
  const castLabel = character.castType === 'A' ? 'Lead' : character.castType === 'B' ? 'Supporting' : 'BG';
  const castColors = character.castType === 'A'
    ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30'
    : character.castType === 'B'
    ? 'bg-blue-500/20 text-blue-200 border-blue-400/30'
    : 'bg-white/20 text-white/90 border-white/30';

  const firstLook = character.looks[0];

  return (
    <div className="bg-neutral-900 rounded-xl border border-white/5 overflow-hidden group">
      {/* Image Area */}
      <div className="aspect-[3/2] bg-neutral-800 relative overflow-hidden">
        {firstLook ? (
          <img
            src={firstLook.image}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}

        {/* Look count badge */}
        {character.looks.length > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
            {character.looks.length} {character.looks.length === 1 ? 'look' : 'looks'}
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute top-2 left-2 right-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${castColors}`}>
            {castLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium text-sm">{character.name}</h3>
            <p className="text-neutral-500 text-xs mt-0.5">{character.gender}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* Look thumbnails */}
        {character.looks.length > 0 && (
          <div className="flex gap-1 mt-3">
            {character.looks.slice(0, 5).map((look) => (
              <div key={look.id} className="w-8 h-8 rounded-md overflow-hidden bg-neutral-800 shrink-0">
                <img src={look.image} alt={look.name} className="w-full h-full object-cover" />
              </div>
            ))}
            {character.looks.length > 5 && (
              <div className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center shrink-0">
                <span className="text-neutral-400 text-[10px]">+{character.looks.length - 5}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

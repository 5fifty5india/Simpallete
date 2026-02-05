'use client';

import { SceneCharacter } from '@/types';
import CharacterCard from './CharacterCard';

interface CharacterGridProps {
  characters: SceneCharacter[];
  onPrevLook: (characterId: string) => void;
  onNextLook: (characterId: string) => void;
  onRemove: (characterId: string) => void;
  onImageClick: (imageUrl: string, characterName: string) => void;
  onAddCharacters: () => void;
}

export default function CharacterGrid({
  characters,
  onPrevLook,
  onNextLook,
  onRemove,
  onImageClick,
  onAddCharacters,
}: CharacterGridProps) {
  return (
    <div className="relative -mt-24 z-10">
      {/* Character Grid or Empty State */}
      {characters.length === 0 ? (
        <div
          onClick={onAddCharacters}
          className="flex items-center justify-center py-16 border border-dashed border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-700 transition-colors bg-neutral-900/50"
        >
          <div className="text-center">
            <p className="text-neutral-500 text-sm">No characters yet</p>
            <p className="text-neutral-600 text-xs mt-1">Click to add</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onPrevLook={() => onPrevLook(character.id)}
              onNextLook={() => onNextLook(character.id)}
              onRemove={() => onRemove(character.id)}
              onImageClick={onImageClick}
            />
          ))}

          {/* Add more button */}
          <div
            onClick={onAddCharacters}
            className="aspect-[2/3] rounded-xl border border-dashed border-neutral-800 flex items-center justify-center cursor-pointer hover:border-neutral-600 hover:bg-neutral-900/50 transition-all"
          >
            <svg className="w-8 h-8 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

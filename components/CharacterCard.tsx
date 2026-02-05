'use client';

import { SceneCharacter } from '@/types';

interface CharacterCardProps {
  character: SceneCharacter;
  onPrevLook: () => void;
  onNextLook: () => void;
  onRemove: () => void;
  onImageClick: (imageUrl: string, characterName: string) => void;
}

export default function CharacterCard({
  character,
  onPrevLook,
  onNextLook,
  onRemove,
  onImageClick,
}: CharacterCardProps) {
  const hasLooks = character.looks && character.looks.length > 0;
  const currentLook = hasLooks ? character.looks[character.selectedLookIndex] : null;
  const hasMultipleLooks = hasLooks && character.looks.length > 1;

  return (
    <div className="flex flex-col">
      {/* Image Card */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer">
        {/* Full Image */}
        {currentLook ? (
          <img
            src={currentLook.image}
            alt={`${character.name} - ${currentLook.name}`}
            className="w-full h-full object-cover"
            onClick={() => onImageClick(currentLook.image, character.name)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Gradient Overlay - Only on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Top Section - Visible on Hover */}
        <div className="absolute top-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center justify-between">
            {/* Cast Type Badge */}
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm ${
              character.castType === 'A'
                ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30'
                : character.castType === 'B'
                ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                : 'bg-white/20 text-white/90 border border-white/30'
            }`}>
              {character.castType === 'A' ? 'Lead' : character.castType === 'B' ? 'Supporting' : 'BG'}
            </span>

            {/* Remove Button */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="w-6 h-6 rounded-full bg-black/30 hover:bg-red-500/50 backdrop-blur-sm flex items-center justify-center transition-all duration-200"
              aria-label="Remove character"
            >
              <svg className="w-3 h-3 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Section - Visible on Hover (Look info & Navigation) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {/* Look Name & Counter */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/90 text-xs truncate">
              {currentLook ? currentLook.name : 'No looks'}
            </p>
            {hasLooks && (
              <span className="text-white/60 text-[10px] ml-2 whitespace-nowrap">
                {character.selectedLookIndex + 1}/{character.looks.length}
              </span>
            )}
          </div>

          {/* Navigation Arrows */}
          {hasMultipleLooks && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onPrevLook(); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200"
                aria-label="Previous look"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Look dots indicator */}
              <div className="flex items-center gap-1">
                {character.looks.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1 h-1 rounded-full transition-all duration-200 ${
                      idx === character.selectedLookIndex
                        ? 'bg-white w-2'
                        : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onNextLook(); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200"
                aria-label="Next look"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Character Name - Outside card */}
      <h3 className="font-medium text-neutral-300 text-sm text-center mt-2 truncate px-1">
        {character.name}
      </h3>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Scene, SceneCharacter } from '@/types';

interface PresenterModeProps {
  scenes: Scene[];
  initialSceneIndex: number;
  onExit: (currentIndex: number) => void;
  onUpdateNotes: (sceneId: string, notes: string) => void;
  onNextLook: (sceneId: string, characterId: string) => void;
  onPrevLook: (sceneId: string, characterId: string) => void;
  onSetLook: (sceneId: string, characterId: string, lookIndex: number) => void;
}

export default function PresenterMode({
  scenes,
  initialSceneIndex,
  onExit,
  onUpdateNotes,
  onNextLook,
  onPrevLook,
  onSetLook,
}: PresenterModeProps) {
  const [currentIndex, setCurrentIndex] = useState(initialSceneIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [carouselCharacter, setCarouselCharacter] = useState<SceneCharacter | null>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const scene = scenes[currentIndex];

  // Auto-hide controls after inactivity
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!showNotes) setShowControls(false);
    }, 3000);
  }, [showNotes]);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [resetHideTimer]);

  // Keep controls visible when notes are open
  useEffect(() => {
    if (showNotes) {
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    } else {
      resetHideTimer();
    }
  }, [showNotes, resetHideTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Don't hijack arrows when typing in notes
      if (document.activeElement === notesRef.current) {
        if (e.key === 'Escape') {
          notesRef.current?.blur();
          setShowNotes(false);
        }
        return;
      }

      // Close carousel on Escape
      if (e.key === 'Escape' && carouselCharacter) {
        setCarouselCharacter(null);
        return;
      }

      if (e.key === 'ArrowLeft') {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((i) => Math.min(scenes.length - 1, i + 1));
      } else if (e.key === 'Escape') {
        onExit(currentIndex);
      }
    };

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [scenes.length, currentIndex, onExit, carouselCharacter]);

  const handleOpenCarousel = useCallback((character: SceneCharacter) => {
    if (character.looks && character.looks.length > 1) {
      setCarouselCharacter(character);
    }
  }, []);

  const handleSelectLook = useCallback((sceneId: string, characterId: string, lookIndex: number) => {
    onSetLook(sceneId, characterId, lookIndex);
    setCarouselCharacter(null);
  }, [onSetLook]);

  if (!scene) return null;

  const hasLocation = !!scene.locationImage;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950 flex flex-col"
      onMouseMove={resetHideTimer}
    >
      {/* Top bar */}
      <div className={`absolute top-0 left-0 right-0 z-10 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
          {/* Prev */}
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="p-2 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scene label */}
          <div className="text-center">
            <p className="text-white/90 text-sm font-medium">
              Scene {scene.sceneNumber || '\u2014'}
              {scene.scriptLocation && <span className="text-white/40"> &mdash; </span>}
              {scene.scriptLocation && <span className="text-white/60">{scene.scriptLocation}</span>}
              {scene.timeDay && <span className="text-white/40"> &mdash; </span>}
              {scene.timeDay && <span className="text-white/50">{scene.timeDay}</span>}
            </p>
          </div>

          {/* Next + Exit */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentIndex((i) => Math.min(scenes.length - 1, i + 1))}
              disabled={currentIndex >= scenes.length - 1}
              className="p-2 text-white/60 hover:text-white disabled:opacity-20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={() => onExit(currentIndex)}
              className="ml-2 px-3 py-1.5 text-xs text-white/60 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main content — scrollable */}
      <div className="flex-1 overflow-y-auto pt-14">
        {/* Location image — full width with gradient fade */}
        {hasLocation ? (
          <div className="relative w-full">
            <img
              src={scene.locationImage}
              alt={scene.scriptLocation || 'Location'}
              className="w-full h-[40vh] min-h-[280px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950">
            <p className="text-neutral-700 text-sm">No location image</p>
          </div>
        )}

        {/* Description — floats above gradient */}
        {scene.description && (
          <p className="relative z-10 text-neutral-400 text-sm italic text-center max-w-2xl mx-auto px-6 -mt-8 mb-4 leading-relaxed">
            &ldquo;{scene.description}&rdquo;
          </p>
        )}

        {/* Character grid — overlaps location image */}
        {scene.characters.length > 0 ? (
          <div className="relative -mt-20 z-10 px-6 sm:px-8 lg:px-12 pb-32 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {scene.characters.map((char) => (
                <PresenterCharacterCard
                  key={char.id}
                  character={char}
                  onOpenCarousel={handleOpenCarousel}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-20">
            <p className="text-neutral-700 text-sm">No characters in this scene</p>
          </div>
        )}
      </div>

      {/* Bottom area — notes + footer */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-6">
          {/* Notes toggle + area */}
          <div className="max-w-2xl mx-auto mb-3">
            <button
              onClick={() => setShowNotes((v) => !v)}
              className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors mb-2"
            >
              <svg className={`w-3 h-3 transition-transform ${showNotes ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Notes
              {scene.presenterNotes && !showNotes && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              )}
            </button>

            {showNotes && (
              <textarea
                ref={notesRef}
                value={scene.presenterNotes || ''}
                onChange={(e) => onUpdateNotes(scene.id, e.target.value)}
                placeholder="Add notes for this scene..."
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-600 resize-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-colors"
              />
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-neutral-600 text-xs">
            Scene {currentIndex + 1} of {scenes.length}
            {scene.shootDay != null && <span> &bull; Day {scene.shootDay}</span>}
          </p>
        </div>
      </div>

      {/* Look Carousel Popup */}
      {carouselCharacter && (
        <LookCarousel
          character={carouselCharacter}
          sceneId={scene.id}
          onSelectLook={handleSelectLook}
          onClose={() => setCarouselCharacter(null)}
        />
      )}
    </div>
  );
}

// ── Presenter Character Card ────────────────────────────────

function PresenterCharacterCard({
  character,
  onOpenCarousel,
}: {
  character: SceneCharacter;
  onOpenCarousel: (character: SceneCharacter) => void;
}) {
  const hasLooks = character.looks && character.looks.length > 0;
  const currentLook = hasLooks ? character.looks[character.selectedLookIndex] : null;
  const hasMultiple = hasLooks && character.looks.length > 1;

  return (
    <div className="flex flex-col">
      {/* Card */}
      <div
        className={`relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg group ${hasMultiple ? 'cursor-pointer' : ''}`}
        onClick={() => hasMultiple && onOpenCarousel(character)}
      >
        {currentLook ? (
          <img
            src={currentLook.image}
            alt={`${character.name} - ${currentLook.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Look counter badge */}
        {hasLooks && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white/80 text-[10px] px-1.5 py-0.5 rounded-full">
            {character.selectedLookIndex + 1}/{character.looks.length}
          </div>
        )}

        {/* Look name at bottom */}
        {currentLook && (
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-white/90 text-xs truncate">{currentLook.name}</p>
          </div>
        )}

        {/* Tap hint for multiple looks */}
        {hasMultiple && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white/90 text-xs font-medium">Change Look</p>
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-neutral-300 text-sm font-medium mt-2 text-center truncate px-1">{character.name}</p>
    </div>
  );
}

// ── Look Carousel Popup ─────────────────────────────────────

function LookCarousel({
  character,
  sceneId,
  onSelectLook,
  onClose,
}: {
  character: SceneCharacter;
  sceneId: string;
  onSelectLook: (sceneId: string, characterId: string, lookIndex: number) => void;
  onClose: () => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState(character.selectedLookIndex);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Character name */}
        <h3 className="text-white text-lg font-semibold text-center mb-6">
          {character.name}
          <span className="text-neutral-500 text-sm font-normal ml-2">
            {character.looks.length} look{character.looks.length !== 1 ? 's' : ''}
          </span>
        </h3>

        {/* Carousel row */}
        <div className="flex items-center gap-2 h-[380px] sm:h-[420px]">
          {character.looks.map((look, index) => {
            const isExpanded = index === expandedIndex;
            const isSelected = index === character.selectedLookIndex;

            return (
              <div
                key={look.id}
                className="relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out"
                style={{
                  flex: isExpanded ? '3 1 0%' : '0.5 1 0%',
                  minWidth: isExpanded ? undefined : '48px',
                }}
                onMouseEnter={() => setExpandedIndex(index)}
                onClick={() => {
                  if (isExpanded) {
                    onSelectLook(sceneId, character.id, index);
                  } else {
                    setExpandedIndex(index);
                  }
                }}
              >
                <img
                  src={look.image}
                  alt={look.name}
                  className="w-full h-full object-cover"
                />

                {/* Gradient at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Selected checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <svg className="w-3.5 h-3.5 text-neutral-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Look info — visible when expanded */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-white font-medium text-sm">{look.name}</p>
                  {look.description && (
                    <p className="text-white/60 text-xs mt-1 line-clamp-2">{look.description}</p>
                  )}
                  {isExpanded && (
                    <p className="text-white/40 text-[10px] mt-2">
                      {isSelected ? 'Currently selected' : 'Click to select'}
                    </p>
                  )}
                </div>

                {/* Collapsed index label */}
                {!isExpanded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/60 text-xs font-medium">{index + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-neutral-600 text-xs text-center mt-4">
          Hover to preview &middot; Click to select &middot; Esc to cancel
        </p>
      </div>
    </div>
  );
}

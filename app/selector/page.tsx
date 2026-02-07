'use client';

import { useState, useCallback, useMemo } from 'react';
import { useApp } from '@/lib/appStore';
import { useRequireProject } from '@/lib/useRequireProject';
import SceneNavigation from '@/components/SceneNavigation';
import SceneHeader from '@/components/SceneHeader';
import LocationImage from '@/components/LocationImage';
import CharacterGrid from '@/components/CharacterGrid';
import AddCharactersModal from '@/components/AddCharactersModal';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import PresenterMode from '@/components/PresenterMode';
import { exportScenesToPdf, PdfSortOrder } from '@/lib/exportPdf';
import { Scene } from '@/types';

export default function SelectorPage() {
  const { isReady } = useRequireProject();
  const {
    project,
    updateScene,
    addScene,
    addCharactersToScene,
    removeCharacterFromScene,
    nextLook,
    prevLook,
    setCharacterLook,
  } = useApp();

  if (!isReady) return null;

  const scenes = project.scenes;
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);

  // Clamp index to valid range
  const safeIndex = Math.min(currentSceneIndex, Math.max(0, scenes.length - 1));
  const currentScene = scenes[safeIndex];

  // Scene navigation — local UI state
  const goToPrevScene = useCallback(() => {
    setCurrentSceneIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToNextScene = useCallback(() => {
    if (safeIndex >= scenes.length - 1) {
      // Create a new empty scene
      const newNum = String(scenes.length + 1);
      addScene({
        sceneNumber: newNum,
        scriptLocation: '',
        timeDay: '',
        shootDay: null,
        description: '',
      });
      setCurrentSceneIndex(scenes.length); // will be the new last index
    } else {
      setCurrentSceneIndex((i) => i + 1);
    }
  }, [safeIndex, scenes.length, addScene]);

  const loadScene = useCallback((sceneNumber: string) => {
    const idx = scenes.findIndex((s) => s.sceneNumber === sceneNumber);
    if (idx !== -1) setCurrentSceneIndex(idx);
  }, [scenes]);

  // Scene editing — delegate to global store
  const handleUpdateField = useCallback((field: keyof Scene, value: string | number | null) => {
    if (!currentScene) return;
    updateScene(currentScene.id, { [field]: value });
  }, [currentScene, updateScene]);

  const handleSetLocationImage = useCallback((image: string | undefined) => {
    if (!currentScene) return;
    updateScene(currentScene.id, { locationImage: image });
  }, [currentScene, updateScene]);

  const handleSave = useCallback(() => {
    // Placeholder — data is auto-persisted to localStorage
    alert('Scene saved!');
  }, []);

  // Character management — scoped to current scene
  const handleAddCharacters = useCallback((characterIds: string[]) => {
    if (!currentScene) return;
    addCharactersToScene(currentScene.id, characterIds);
  }, [currentScene, addCharactersToScene]);

  const handleRemoveCharacter = useCallback((characterId: string) => {
    if (!currentScene) return;
    removeCharacterFromScene(currentScene.id, characterId);
  }, [currentScene, removeCharacterFromScene]);

  const handleNextLook = useCallback((characterId: string) => {
    if (!currentScene) return;
    nextLook(currentScene.id, characterId);
  }, [currentScene, nextLook]);

  const handlePrevLook = useCallback((characterId: string) => {
    if (!currentScene) return;
    prevLook(currentScene.id, characterId);
  }, [currentScene, prevLook]);

  // Available characters = project characters not in current scene
  const availableCharacters = useMemo(() => {
    if (!currentScene) return project.characters;
    const inScene = new Set(currentScene.characters.map((c) => c.id));
    return project.characters.filter((c) => !inScene.has(c.id));
  }, [project.characters, currentScene]);

  const handleImageClick = (imageUrl: string, characterName: string) => {
    setPreviewImage({ url: imageUrl, title: characterName });
  };

  const handlePresenterExit = useCallback((returnIndex: number) => {
    setPresenterMode(false);
    setCurrentSceneIndex(returnIndex);
  }, []);

  const handlePresenterUpdateNotes = useCallback((sceneId: string, notes: string) => {
    updateScene(sceneId, { presenterNotes: notes });
  }, [updateScene]);

  const handlePresenterNextLook = useCallback((sceneId: string, characterId: string) => {
    nextLook(sceneId, characterId);
  }, [nextLook]);

  const handlePresenterPrevLook = useCallback((sceneId: string, characterId: string) => {
    prevLook(sceneId, characterId);
  }, [prevLook]);

  const handlePresenterSetLook = useCallback((sceneId: string, characterId: string, lookIndex: number) => {
    setCharacterLook(sceneId, characterId, lookIndex);
  }, [setCharacterLook]);

  const handleExportPdf = async (sortOrder: PdfSortOrder) => {
    setShowExportMenu(false);
    setIsExporting(true);
    try {
      await exportScenesToPdf(scenes, sortOrder);
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Empty state
  if (scenes.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-xl">
          <svg className="w-12 h-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <p className="text-neutral-500 text-sm">No scenes in this project</p>
          <p className="text-neutral-600 text-xs mt-1">Add scenes from the Scenes page or import a script</p>
        </div>
      </main>
    );
  }

  return (
    <div>
      {/* Selector Sub-header with Export */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Palette Selector</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPresenterMode(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-white/70 text-sm font-medium rounded-lg border border-white/10 hover:border-white/30 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Present
          </button>
          <div className="relative">
          <button
            onClick={() => !isExporting && setShowExportMenu((v) => !v)}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Exporting…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>

          {showExportMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
              <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-neutral-900 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                <button
                  onClick={() => handleExportPdf('scene-number')}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  By Scene Number
                </button>
                <button
                  onClick={() => handleExportPdf('shoot-day')}
                  className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  By Shoot Day
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Scene Navigation & Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <SceneNavigation
            currentSceneIndex={safeIndex}
            totalScenes={scenes.length}
            scenes={scenes}
            onPrevScene={goToPrevScene}
            onNextScene={goToNextScene}
            onLoadScene={loadScene}
          />

          {currentScene && (
            <SceneHeader
              scene={currentScene}
              onUpdate={handleUpdateField}
              onSave={handleSave}
            />
          )}
        </div>

        {/* Location Image - Full width hero */}
        {currentScene && (
          <LocationImage
            image={currentScene.locationImage}
            onImageChange={handleSetLocationImage}
          />
        )}

        {/* Character Grid - Overlaps location */}
        {currentScene && (
          <div className="px-4 sm:px-6 lg:px-8 pb-12">
            <CharacterGrid
              characters={currentScene.characters}
              onPrevLook={handlePrevLook}
              onNextLook={handleNextLook}
              onRemove={handleRemoveCharacter}
              onImageClick={handleImageClick}
              onAddCharacters={() => setIsAddModalOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Add Characters Modal */}
      <AddCharactersModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableCharacters={availableCharacters}
        onAdd={handleAddCharacters}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          isOpen={true}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage.url}
          title={previewImage.title}
        />
      )}

      {/* Presenter Mode */}
      {presenterMode && (
        <PresenterMode
          scenes={scenes}
          initialSceneIndex={safeIndex}
          onExit={handlePresenterExit}
          onUpdateNotes={handlePresenterUpdateNotes}
          onNextLook={handlePresenterNextLook}
          onPrevLook={handlePresenterPrevLook}
          onSetLook={handlePresenterSetLook}
        />
      )}
    </div>
  );
}

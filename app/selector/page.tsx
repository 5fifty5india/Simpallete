'use client';

import { useState } from 'react';
import { SceneProvider, useScene } from '@/lib/sceneStore';
import SceneNavigation from '@/components/SceneNavigation';
import SceneHeader from '@/components/SceneHeader';
import LocationImage from '@/components/LocationImage';
import CharacterGrid from '@/components/CharacterGrid';
import AddCharactersModal from '@/components/AddCharactersModal';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import { Scene } from '@/types';

function SelectorContent() {
  const {
    currentSceneIndex,
    scenes,
    currentScene,
    goToPrevScene,
    goToNextScene,
    loadScene,
    updateSceneField,
    setLocationImage,
    saveScene,
    addCharactersToScene,
    removeCharacterFromScene,
    nextLook,
    prevLook,
    getAvailableCharacters,
  } = useScene();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  const handleImageClick = (imageUrl: string, characterName: string) => {
    setPreviewImage({ url: imageUrl, title: characterName });
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <header className="bg-neutral-900/80 backdrop-blur-sm border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-neutral-900 font-bold text-sm">SP</span>
              </div>
              <h1 className="text-xl font-bold text-white">Simpalette</h1>
            </div>
            <nav className="flex items-center gap-4">
              <span className="text-sm text-neutral-500">Palette Selector</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Scene Navigation & Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <SceneNavigation
            currentSceneIndex={currentSceneIndex}
            totalScenes={scenes.length}
            scenes={scenes}
            onPrevScene={goToPrevScene}
            onNextScene={goToNextScene}
            onLoadScene={loadScene}
          />

          <SceneHeader
            scene={currentScene}
            onUpdate={updateSceneField}
            onSave={saveScene}
          />
        </div>

        {/* Location Image - Full width hero */}
        <LocationImage
          image={currentScene.locationImage}
          onImageChange={setLocationImage}
        />

        {/* Character Grid - Overlaps location */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <CharacterGrid
            characters={currentScene.characters}
            onPrevLook={prevLook}
            onNextLook={nextLook}
            onRemove={removeCharacterFromScene}
            onImageClick={handleImageClick}
            onAddCharacters={() => setIsAddModalOpen(true)}
          />
        </div>
      </main>

      {/* Add Characters Modal */}
      <AddCharactersModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        availableCharacters={getAvailableCharacters()}
        onAdd={addCharactersToScene}
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
    </div>
  );
}

export default function SelectorPage() {
  return (
    <SceneProvider>
      <SelectorContent />
    </SceneProvider>
  );
}

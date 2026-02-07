'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Scene, SceneCharacter, Character } from '@/types';
import { mockCharacters, mockScenes } from '@/data/mockData';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function createEmptyScene(sceneNumber: string): Scene {
  return {
    id: generateId(),
    sceneNumber,
    scriptLocation: '',
    timeDay: '',
    shootDay: null,
    description: '',
    locationImage: undefined,
    characters: [],
  };
}

interface SceneContextType {
  // State
  currentSceneIndex: number;
  scenes: Scene[];
  allCharacters: Character[];

  // Computed
  currentScene: Scene;

  // Scene Navigation
  goToPrevScene: () => void;
  goToNextScene: () => void;
  loadScene: (sceneNumber: string) => void;

  // Scene Editing
  updateSceneField: (field: keyof Scene, value: string) => void;
  setLocationImage: (image: string | undefined) => void;
  saveScene: () => void;

  // Character Management
  addCharactersToScene: (characterIds: string[]) => void;
  removeCharacterFromScene: (characterId: string) => void;
  nextLook: (characterId: string) => void;
  prevLook: (characterId: string) => void;

  // Helpers
  getAvailableCharacters: () => Character[];
}

const SceneContext = createContext<SceneContextType | null>(null);

export function SceneProvider({ children }: { children: ReactNode }) {
  const [scenes, setScenes] = useState<Scene[]>(mockScenes);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [allCharacters] = useState<Character[]>(mockCharacters);

  const currentScene = scenes[currentSceneIndex];

  // Update the current scene in the scenes array
  const updateCurrentScene = useCallback((updater: (scene: Scene) => Scene) => {
    setScenes((prev) => {
      const newScenes = [...prev];
      newScenes[currentSceneIndex] = updater(newScenes[currentSceneIndex]);
      return newScenes;
    });
  }, [currentSceneIndex]);

  // Scene Navigation
  const goToPrevScene = useCallback(() => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  }, [currentSceneIndex]);

  const goToNextScene = useCallback(() => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
    } else {
      // Create new scene
      const newSceneNumber = String(scenes.length + 1);
      setScenes((prev) => [...prev, createEmptyScene(newSceneNumber)]);
      setCurrentSceneIndex(scenes.length);
    }
  }, [currentSceneIndex, scenes.length]);

  const loadScene = useCallback((sceneNumber: string) => {
    const index = scenes.findIndex((s) => s.sceneNumber === sceneNumber);
    if (index !== -1) {
      setCurrentSceneIndex(index);
    }
  }, [scenes]);

  // Scene Editing
  const updateSceneField = useCallback((field: keyof Scene, value: string) => {
    updateCurrentScene((scene) => ({
      ...scene,
      [field]: value,
    }));
  }, [updateCurrentScene]);

  const setLocationImage = useCallback((image: string | undefined) => {
    updateCurrentScene((scene) => ({
      ...scene,
      locationImage: image,
    }));
  }, [updateCurrentScene]);

  const saveScene = useCallback(() => {
    // In a real app, this would persist to database
    // For now, just log that we "saved"
    console.log('Scene saved:', currentScene);
    alert('Scene saved!');
  }, [currentScene]);

  // Character Management
  const addCharactersToScene = useCallback((characterIds: string[]) => {
    updateCurrentScene((scene) => {
      const newCharacters: SceneCharacter[] = characterIds
        .map((id) => {
          const character = allCharacters.find((c) => c.id === id);
          if (!character) return null;
          return {
            ...character,
            selectedLookIndex: 0,
          };
        })
        .filter((c): c is SceneCharacter => c !== null);

      return {
        ...scene,
        characters: [...scene.characters, ...newCharacters],
      };
    });
  }, [allCharacters, updateCurrentScene]);

  const removeCharacterFromScene = useCallback((characterId: string) => {
    updateCurrentScene((scene) => ({
      ...scene,
      characters: scene.characters.filter((c) => c.id !== characterId),
    }));
  }, [updateCurrentScene]);

  const nextLook = useCallback((characterId: string) => {
    updateCurrentScene((scene) => ({
      ...scene,
      characters: scene.characters.map((char) => {
        if (char.id !== characterId) return char;
        const nextIndex = char.selectedLookIndex < char.looks.length - 1
          ? char.selectedLookIndex + 1
          : 0; // Wrap to first
        return { ...char, selectedLookIndex: nextIndex };
      }),
    }));
  }, [updateCurrentScene]);

  const prevLook = useCallback((characterId: string) => {
    updateCurrentScene((scene) => ({
      ...scene,
      characters: scene.characters.map((char) => {
        if (char.id !== characterId) return char;
        const prevIndex = char.selectedLookIndex > 0
          ? char.selectedLookIndex - 1
          : char.looks.length - 1; // Wrap to last
        return { ...char, selectedLookIndex: prevIndex };
      }),
    }));
  }, [updateCurrentScene]);

  // Helpers
  const getAvailableCharacters = useCallback(() => {
    const sceneCharacterIds = new Set(currentScene.characters.map((c) => c.id));
    return allCharacters.filter((c) => !sceneCharacterIds.has(c.id));
  }, [allCharacters, currentScene.characters]);

  const value: SceneContextType = {
    currentSceneIndex,
    scenes,
    allCharacters,
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
  };

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

export function useScene() {
  const context = useContext(SceneContext);
  if (!context) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}

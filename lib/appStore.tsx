'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Project, Character, Look, Scene, SceneCharacter, Episode, TeamMember } from '@/types';
import { mockCharacters, mockScenes, mockProjects } from '@/data/mockData';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const LEGACY_STORAGE_KEY = 'simpalette_project';
const STORAGE_KEY = 'simpalette_projects';

function createEmptyProject(): Project {
  return {
    id: generateId(),
    name: '',
    description: '',
    projectType: 'film',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  };
}

function createDemoProject(): Project {
  return {
    id: 'proj-demo',
    name: 'The Morning After',
    description: 'A romantic drama set in modern-day New York',
    projectType: 'film',
    episodes: [],
    teamMembers: [
      { id: 'tm-1', name: 'Alex Rivera', role: 'Director', email: 'alex@example.com' },
      { id: 'tm-2', name: 'Priya Sharma', role: 'Costume Designer', email: 'priya@example.com' },
      { id: 'tm-3', name: 'Marcus Lee', role: 'DOP', email: 'marcus@example.com' },
      { id: 'tm-4', name: 'Sofia Chen', role: 'Producer', email: 'sofia@example.com' },
      { id: 'tm-5', name: 'James Okafor', role: '1st AD', email: 'james@example.com' },
    ],
    characters: mockCharacters,
    scenes: mockScenes,
  };
}

// ── Context Type ───────────────────────────────────────────────

interface AppContextType {
  project: Project;
  isLoaded: boolean;

  // Multi-project
  projects: Project[];
  activeProjectId: string | null;
  selectProject: (projectId: string) => void;
  createProject: (data: Omit<Project, 'id'>) => string;
  deleteProject: (projectId: string) => void;
  deselectProject: () => void;

  // Project
  updateProject: (fields: Partial<Pick<Project, 'name' | 'description' | 'projectType'>>) => void;
  loadDemoData: () => void;
  clearProject: () => void;

  // Episodes
  addEpisode: (episode: Omit<Episode, 'id'>) => void;
  updateEpisode: (id: string, updates: Partial<Omit<Episode, 'id'>>) => void;
  deleteEpisode: (id: string) => void;

  // Team Members
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  updateTeamMember: (id: string, updates: Partial<Omit<TeamMember, 'id'>>) => void;
  deleteTeamMember: (id: string) => void;

  // Characters
  addCharacter: (character: Omit<Character, 'id'>) => void;
  updateCharacter: (id: string, updates: Partial<Omit<Character, 'id'>>) => void;
  deleteCharacter: (id: string) => void;

  // Looks
  addLook: (characterId: string, look: Omit<Look, 'id'>) => void;
  updateLook: (characterId: string, lookId: string, updates: Partial<Omit<Look, 'id'>>) => void;
  deleteLook: (characterId: string, lookId: string) => void;

  // Scenes
  addScene: (scene: Omit<Scene, 'id' | 'characters'>) => void;
  updateScene: (id: string, updates: Partial<Omit<Scene, 'id' | 'characters'>>) => void;
  deleteScene: (id: string) => void;

  // Scene-Character relationships
  addCharactersToScene: (sceneId: string, characterIds: string[]) => void;
  removeCharacterFromScene: (sceneId: string, characterId: string) => void;
  setCharacterLook: (sceneId: string, characterId: string, lookIndex: number) => void;
  nextLook: (sceneId: string, characterId: string) => void;
  prevLook: (sceneId: string, characterId: string) => void;

  // Import
  importScriptData: (data: {
    characters: Omit<Character, 'id' | 'looks'>[];
    scenes: Omit<Scene, 'id' | 'characters'>[];
    characterSceneMap: Record<string, string[]>;
  }) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project>(createEmptyProject);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const loadedProjects: Project[] = parsed.projects || [];
        const loadedActiveId: string | null = parsed.activeProjectId || null;
        setProjects(loadedProjects);
        setActiveProjectId(loadedActiveId);
        if (loadedActiveId) {
          const active = loadedProjects.find((p: Project) => p.id === loadedActiveId);
          if (active) setProject(active);
        }
      } else {
        // Try legacy single-project key
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const migrated: Project = {
            ...createEmptyProject(),
            ...parsed,
            episodes: parsed.episodes || [],
            teamMembers: parsed.teamMembers || [],
          };
          setProjects([migrated]);
        } else {
          // Fresh install — load demo projects
          setProjects(mockProjects);
        }
      }
    } catch {
      setProjects(mockProjects);
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const updatedProjects = activeProjectId
        ? projects.map((p) => (p.id === activeProjectId ? project : p))
        : projects;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        projects: updatedProjects,
        activeProjectId,
      }));
    } catch {
      // localStorage full or unavailable
    }
  }, [project, projects, activeProjectId, isLoaded]);

  // Helper to update project
  const update = useCallback((updater: (p: Project) => Project) => {
    setProject(updater);
  }, []);

  // ── Multi-project ──

  const selectProject = useCallback((projectId: string) => {
    setProjects((prev) => {
      const found = prev.find((p) => p.id === projectId);
      if (found) {
        setProject(found);
        setActiveProjectId(projectId);
      }
      return prev;
    });
  }, []);

  const createNewProject = useCallback((data: Omit<Project, 'id'>): string => {
    const newId = generateId();
    const newProject: Project = { ...data, id: newId };
    setProjects((prev) => [...prev, newProject]);
    setProject(newProject);
    setActiveProjectId(newId);
    return newId;
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setActiveProjectId((prevId) => {
      if (prevId === projectId) {
        setProject(createEmptyProject());
        return null;
      }
      return prevId;
    });
  }, []);

  const deselectProject = useCallback(() => {
    if (activeProjectId) {
      setProjects((prev) => prev.map((p) => (p.id === activeProjectId ? project : p)));
    }
    setActiveProjectId(null);
  }, [activeProjectId, project]);

  // ── Project ──

  const updateProject = useCallback((fields: Partial<Pick<Project, 'name' | 'description' | 'projectType'>>) => {
    update((p) => ({ ...p, ...fields }));
  }, [update]);

  const loadDemoData = useCallback(() => {
    const demo = createDemoProject();
    setProject((prev) => ({ ...demo, id: prev.id }));
  }, []);

  const clearProject = useCallback(() => {
    setProject((prev) => ({ ...createEmptyProject(), id: prev.id }));
  }, []);

  // ── Episodes ──

  const addEpisode = useCallback((episode: Omit<Episode, 'id'>) => {
    update((p) => ({
      ...p,
      episodes: [...p.episodes, { ...episode, id: generateId() }],
    }));
  }, [update]);

  const updateEpisode = useCallback((id: string, updates: Partial<Omit<Episode, 'id'>>) => {
    update((p) => ({
      ...p,
      episodes: p.episodes.map((ep) => ep.id === id ? { ...ep, ...updates } : ep),
    }));
  }, [update]);

  const deleteEpisode = useCallback((id: string) => {
    update((p) => ({
      ...p,
      episodes: p.episodes.filter((ep) => ep.id !== id),
      scenes: p.scenes.map((s) => s.episodeId === id ? { ...s, episodeId: undefined } : s),
    }));
  }, [update]);

  // ── Team Members ──

  const addTeamMember = useCallback((member: Omit<TeamMember, 'id'>) => {
    update((p) => ({
      ...p,
      teamMembers: [...p.teamMembers, { ...member, id: generateId() }],
    }));
  }, [update]);

  const updateTeamMember = useCallback((id: string, updates: Partial<Omit<TeamMember, 'id'>>) => {
    update((p) => ({
      ...p,
      teamMembers: p.teamMembers.map((m) => m.id === id ? { ...m, ...updates } : m),
    }));
  }, [update]);

  const deleteTeamMember = useCallback((id: string) => {
    update((p) => ({
      ...p,
      teamMembers: p.teamMembers.filter((m) => m.id !== id),
    }));
  }, [update]);

  // ── Characters ──

  const addCharacter = useCallback((character: Omit<Character, 'id'>) => {
    update((p) => ({
      ...p,
      characters: [...p.characters, { ...character, id: generateId() }],
    }));
  }, [update]);

  const updateCharacter = useCallback((id: string, updates: Partial<Omit<Character, 'id'>>) => {
    update((p) => ({
      ...p,
      characters: p.characters.map((c) => c.id === id ? { ...c, ...updates } : c),
    }));
  }, [update]);

  const deleteCharacter = useCallback((id: string) => {
    update((p) => ({
      ...p,
      characters: p.characters.filter((c) => c.id !== id),
      scenes: p.scenes.map((s) => ({
        ...s,
        characters: s.characters.filter((sc) => sc.id !== id),
      })),
    }));
  }, [update]);

  // ── Looks ──

  const addLook = useCallback((characterId: string, look: Omit<Look, 'id'>) => {
    const newLook = { ...look, id: generateId() };
    update((p) => ({
      ...p,
      characters: p.characters.map((c) =>
        c.id === characterId ? { ...c, looks: [...c.looks, newLook] } : c
      ),
    }));
  }, [update]);

  const updateLook = useCallback((characterId: string, lookId: string, updates: Partial<Omit<Look, 'id'>>) => {
    update((p) => ({
      ...p,
      characters: p.characters.map((c) =>
        c.id === characterId
          ? { ...c, looks: c.looks.map((l) => l.id === lookId ? { ...l, ...updates } : l) }
          : c
      ),
    }));
  }, [update]);

  const deleteLook = useCallback((characterId: string, lookId: string) => {
    update((p) => ({
      ...p,
      characters: p.characters.map((c) =>
        c.id === characterId
          ? { ...c, looks: c.looks.filter((l) => l.id !== lookId) }
          : c
      ),
    }));
  }, [update]);

  // ── Scenes ──

  const addScene = useCallback((scene: Omit<Scene, 'id' | 'characters'>) => {
    update((p) => ({
      ...p,
      scenes: [...p.scenes, { ...scene, id: generateId(), characters: [] }],
    }));
  }, [update]);

  const updateScene = useCallback((id: string, updates: Partial<Omit<Scene, 'id' | 'characters'>>) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.map((s) => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [update]);

  const deleteScene = useCallback((id: string) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.filter((s) => s.id !== id),
    }));
  }, [update]);

  // ── Scene-Character Relationships ──

  const addCharactersToScene = useCallback((sceneId: string, characterIds: string[]) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.map((s) => {
        if (s.id !== sceneId) return s;
        const newChars: SceneCharacter[] = characterIds
          .map((cid) => {
            const char = p.characters.find((c) => c.id === cid);
            if (!char || s.characters.some((sc) => sc.id === cid)) return null;
            return { ...char, selectedLookIndex: 0 };
          })
          .filter((c): c is SceneCharacter => c !== null);
        return { ...s, characters: [...s.characters, ...newChars] };
      }),
    }));
  }, [update]);

  const removeCharacterFromScene = useCallback((sceneId: string, characterId: string) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.map((s) =>
        s.id === sceneId
          ? { ...s, characters: s.characters.filter((c) => c.id !== characterId) }
          : s
      ),
    }));
  }, [update]);

  const setCharacterLook = useCallback((sceneId: string, characterId: string, lookIndex: number) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              characters: s.characters.map((c) =>
                c.id === characterId ? { ...c, selectedLookIndex: lookIndex } : c
              ),
            }
          : s
      ),
    }));
  }, [update]);

  const nextLook = useCallback((sceneId: string, characterId: string) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              characters: s.characters.map((c) => {
                if (c.id !== characterId) return c;
                const next = c.selectedLookIndex < c.looks.length - 1 ? c.selectedLookIndex + 1 : 0;
                return { ...c, selectedLookIndex: next };
              }),
            }
          : s
      ),
    }));
  }, [update]);

  const prevLook = useCallback((sceneId: string, characterId: string) => {
    update((p) => ({
      ...p,
      scenes: p.scenes.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              characters: s.characters.map((c) => {
                if (c.id !== characterId) return c;
                const prev = c.selectedLookIndex > 0 ? c.selectedLookIndex - 1 : c.looks.length - 1;
                return { ...c, selectedLookIndex: prev };
              }),
            }
          : s
      ),
    }));
  }, [update]);

  // ── Import ──

  const importScriptData = useCallback((data: {
    characters: Omit<Character, 'id' | 'looks'>[];
    scenes: Omit<Scene, 'id' | 'characters'>[];
    characterSceneMap: Record<string, string[]>;
  }) => {
    update((p) => {
      const existingNames = new Set(p.characters.map((c) => c.name.toLowerCase()));
      const newCharacters: Character[] = data.characters
        .filter((c) => !existingNames.has(c.name.toLowerCase()))
        .map((c) => ({ ...c, id: generateId(), looks: [] }));

      const allCharacters = [...p.characters, ...newCharacters];

      const newScenes: Scene[] = data.scenes.map((s) => {
        const sceneId = generateId();
        const sceneCharNames = data.characterSceneMap[s.sceneNumber] || [];
        const sceneChars: SceneCharacter[] = sceneCharNames
          .map((name) => {
            const char = allCharacters.find((c) => c.name.toLowerCase() === name.toLowerCase());
            if (!char) return null;
            return { ...char, selectedLookIndex: 0 };
          })
          .filter((c): c is SceneCharacter => c !== null);

        return { ...s, id: sceneId, characters: sceneChars };
      });

      return {
        ...p,
        characters: allCharacters,
        scenes: [...p.scenes, ...newScenes],
      };
    });
  }, [update]);

  const value: AppContextType = {
    project,
    isLoaded,
    projects,
    activeProjectId,
    selectProject,
    createProject: createNewProject,
    deleteProject,
    deselectProject,
    updateProject,
    loadDemoData,
    clearProject,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addLook,
    updateLook,
    deleteLook,
    addScene,
    updateScene,
    deleteScene,
    addCharactersToScene,
    removeCharacterFromScene,
    setCharacterLook,
    nextLook,
    prevLook,
    importScriptData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

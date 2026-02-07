export interface Look {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
  castType: 'A' | 'B' | 'C';
  looks: Look[];
}

export interface SceneCharacter extends Character {
  selectedLookIndex: number;
}

export interface Scene {
  id: string;
  sceneNumber: string;
  scriptLocation: string;
  timeDay: string;
  shootDay: number | null;
  description: string;
  locationImage?: string;
  characters: SceneCharacter[];
  episodeId?: string;
  presenterNotes?: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  projectType: 'film' | 'series';
  episodes: Episode[];
  teamMembers: TeamMember[];
  characters: Character[];
  scenes: Scene[];
}

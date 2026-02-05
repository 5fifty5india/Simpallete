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
  shootDay: string;
  description: string;
  locationImage?: string;
  characters: SceneCharacter[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  projectType: 'film' | 'series';
  characters: Character[];
  scenes: Scene[];
}

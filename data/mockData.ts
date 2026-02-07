import { Character, Scene, SceneCharacter, Project } from '@/types';

// Demo costume images using placeholder URLs
const PLACEHOLDER_IMAGES = {
  john: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop',
  ],
  sarah: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop',
  ],
  mike: [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=400&fit=crop',
  ],
  emma: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop',
  ],
};

// Location reference images
const LOCATION_IMAGES = {
  coffeeShop: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=400&fit=crop',
  rooftop: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=400&fit=crop',
  apartment: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=400&fit=crop',
};

export const mockCharacters: Character[] = [
  {
    id: 'char-1',
    name: 'John Miller',
    gender: 'Male',
    castType: 'A',
    looks: [
      { id: 'look-1-1', name: 'Casual Day', image: PLACEHOLDER_IMAGES.john[0], description: 'Everyday casual wear' },
      { id: 'look-1-2', name: 'Business Suit', image: PLACEHOLDER_IMAGES.john[1], description: 'Formal business attire' },
      { id: 'look-1-3', name: 'Evening Wear', image: PLACEHOLDER_IMAGES.john[2], description: 'Black tie event outfit' },
    ],
  },
  {
    id: 'char-2',
    name: 'Sarah Chen',
    gender: 'Female',
    castType: 'A',
    looks: [
      { id: 'look-2-1', name: 'Office Attire', image: PLACEHOLDER_IMAGES.sarah[0], description: 'Professional office look' },
      { id: 'look-2-2', name: 'Weekend Casual', image: PLACEHOLDER_IMAGES.sarah[1], description: 'Relaxed weekend style' },
    ],
  },
  {
    id: 'char-3',
    name: 'Mike Rodriguez',
    gender: 'Male',
    castType: 'B',
    looks: [
      { id: 'look-3-1', name: 'Street Style', image: PLACEHOLDER_IMAGES.mike[0], description: 'Urban street fashion' },
      { id: 'look-3-2', name: 'Gym Wear', image: PLACEHOLDER_IMAGES.mike[1], description: 'Athletic workout clothes' },
      { id: 'look-3-3', name: 'Smart Casual', image: PLACEHOLDER_IMAGES.mike[2], description: 'Business casual blend' },
      { id: 'look-3-4', name: 'Formal', image: PLACEHOLDER_IMAGES.mike[3], description: 'Suit and tie' },
    ],
  },
  {
    id: 'char-4',
    name: 'Emma Wilson',
    gender: 'Female',
    castType: 'B',
    looks: [
      { id: 'look-4-1', name: 'Boho Chic', image: PLACEHOLDER_IMAGES.emma[0], description: 'Bohemian inspired style' },
      { id: 'look-4-2', name: 'Minimalist', image: PLACEHOLDER_IMAGES.emma[1], description: 'Clean minimal aesthetic' },
      { id: 'look-4-3', name: 'Glamour', image: PLACEHOLDER_IMAGES.emma[2], description: 'Red carpet ready' },
    ],
  },
];

// Helper to turn a Character into a SceneCharacter with a selected look
function asSceneChar(char: Character, lookIndex = 0): SceneCharacter {
  return { ...char, selectedLookIndex: lookIndex };
}

export const mockScenes: Scene[] = [
  {
    id: 'scene-1',
    sceneNumber: '1',
    scriptLocation: 'INT. COFFEE SHOP',
    timeDay: 'DAY',
    shootDay: 'Day 1',
    description: 'John and Sarah meet for the first time at a busy downtown coffee shop.',
    locationImage: LOCATION_IMAGES.coffeeShop,
    characters: [
      asSceneChar(mockCharacters[0], 0), // John - Casual Day
      asSceneChar(mockCharacters[1], 0), // Sarah - Office Attire
      asSceneChar(mockCharacters[2], 2), // Mike - Smart Casual
    ],
  },
  {
    id: 'scene-2',
    sceneNumber: '2',
    scriptLocation: 'EXT. ROOFTOP BAR',
    timeDay: 'NIGHT',
    shootDay: 'Day 2',
    description: 'The group reunites at a trendy rooftop bar overlooking the city skyline.',
    locationImage: LOCATION_IMAGES.rooftop,
    characters: [
      asSceneChar(mockCharacters[0], 2), // John - Evening Wear
      asSceneChar(mockCharacters[1], 1), // Sarah - Weekend Casual
      asSceneChar(mockCharacters[2], 3), // Mike - Formal
      asSceneChar(mockCharacters[3], 2), // Emma - Glamour
    ],
  },
  {
    id: 'scene-3',
    sceneNumber: '3',
    scriptLocation: 'INT. SARAH\'S APARTMENT',
    timeDay: 'DAWN',
    shootDay: 'Day 3',
    description: 'The morning after. Sarah discovers a handwritten note left on the kitchen counter.',
    locationImage: LOCATION_IMAGES.apartment,
    characters: [
      asSceneChar(mockCharacters[1], 1), // Sarah - Weekend Casual
      asSceneChar(mockCharacters[3], 1), // Emma - Minimalist
    ],
  },
];

export const mockProject: Project = {
  id: 'proj-1',
  name: 'The Morning After',
  description: 'A romantic drama set in modern-day New York',
  projectType: 'film',
  characters: mockCharacters,
  scenes: mockScenes,
};

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
    shootDay: 1,
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
    shootDay: 2,
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
    shootDay: 3,
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
  episodes: [],
  teamMembers: [],
  characters: mockCharacters,
  scenes: mockScenes,
};

// ── Multi-project demo data ──────────────────────────────────

export const mockProjects: Project[] = [
  {
    id: 'proj-demo-1',
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
  },
  {
    id: 'proj-demo-2',
    name: 'Crown & Thorns',
    description: 'A period drama following the fall of a fictional European dynasty',
    projectType: 'series',
    episodes: [
      { id: 'ep-ct-1', episodeNumber: 1, title: 'The Coronation' },
      { id: 'ep-ct-2', episodeNumber: 2, title: 'Whispers in Court' },
      { id: 'ep-ct-3', episodeNumber: 3, title: 'The Betrayal' },
    ],
    teamMembers: [
      { id: 'tm-ct-1', name: 'Helena Voss', role: 'Director' },
      { id: 'tm-ct-2', name: 'Tobias Grant', role: 'Costume Designer' },
      { id: 'tm-ct-3', name: 'Yuki Tanaka', role: 'Producer' },
      { id: 'tm-ct-4', name: 'Liam O\'Brien', role: 'Production Designer' },
    ],
    characters: [
      { id: 'char-ct-1', name: 'Queen Elara', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-ct-2', name: 'Prince Aldric', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-ct-3', name: 'Lady Morwen', gender: 'Female', castType: 'B', looks: [] },
      { id: 'char-ct-4', name: 'Captain Hale', gender: 'Male', castType: 'B', looks: [] },
      { id: 'char-ct-5', name: 'The Cardinal', gender: 'Male', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  {
    id: 'proj-demo-3',
    name: 'Signal Lost',
    description: 'A sci-fi thriller about a deep space crew who discovers an impossible transmission',
    projectType: 'film',
    episodes: [],
    teamMembers: [
      { id: 'tm-sl-1', name: 'Jordan Park', role: 'Director' },
      { id: 'tm-sl-2', name: 'Amira Hassan', role: 'Costume Designer' },
      { id: 'tm-sl-3', name: 'Viktor Novak', role: 'DOP' },
    ],
    characters: [
      { id: 'char-sl-1', name: 'Commander Reyes', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-sl-2', name: 'Dr. Okonkwo', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-sl-3', name: 'Pilot Zhao', gender: 'Female', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  {
    id: 'proj-demo-4',
    name: 'Flat 4B',
    description: 'A workplace comedy set in a chaotic London advertising agency',
    projectType: 'series',
    episodes: [
      { id: 'ep-fb-1', episodeNumber: 1, title: 'The Pitch' },
      { id: 'ep-fb-2', episodeNumber: 2, title: 'Going Viral' },
      { id: 'ep-fb-3', episodeNumber: 3, title: 'Client Dinner' },
      { id: 'ep-fb-4', episodeNumber: 4, title: 'The Rebrand' },
      { id: 'ep-fb-5', episodeNumber: 5, title: 'Awards Night' },
      { id: 'ep-fb-6', episodeNumber: 6, title: 'Series Wrap' },
    ],
    teamMembers: [
      { id: 'tm-fb-1', name: 'Chloe Barnes', role: 'Director' },
      { id: 'tm-fb-2', name: 'Raj Mehta', role: 'Costume Designer' },
      { id: 'tm-fb-3', name: 'Dani Kowalski', role: 'Producer' },
      { id: 'tm-fb-4', name: 'Finn MacAllister', role: '1st AD' },
      { id: 'tm-fb-5', name: 'Nkechi Eze', role: 'Makeup Artist' },
      { id: 'tm-fb-6', name: 'Tom Hartley', role: 'DOP' },
    ],
    characters: [
      { id: 'char-fb-1', name: 'Bea Lawson', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-fb-2', name: 'Marcus Webb', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-fb-3', name: 'Suki Patel', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-fb-4', name: 'Dave', gender: 'Male', castType: 'B', looks: [] },
      { id: 'char-fb-5', name: 'Janet from HR', gender: 'Female', castType: 'B', looks: [] },
      { id: 'char-fb-6', name: 'The Intern', gender: 'Non-binary', castType: 'C', looks: [] },
      { id: 'char-fb-7', name: 'Phil the Boss', gender: 'Male', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  {
    id: 'proj-demo-5',
    name: 'Neon District',
    description: 'A cyberpunk action film set in a rain-soaked megacity in 2087',
    projectType: 'film',
    episodes: [],
    teamMembers: [
      { id: 'tm-nd-1', name: 'Kai Nakamura', role: 'Director' },
      { id: 'tm-nd-2', name: 'Zara Osei', role: 'Costume Designer' },
    ],
    characters: [
      { id: 'char-nd-1', name: 'Kira Voss', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-nd-2', name: 'Jax', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-nd-3', name: 'The Broker', gender: 'Other', castType: 'B', looks: [] },
      { id: 'char-nd-4', name: 'Officer Chen', gender: 'Male', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  {
    id: 'proj-demo-6',
    name: 'Little Wonders',
    description: 'A heartfelt children\'s series about a group of kids who discover a hidden treehouse library',
    projectType: 'series',
    episodes: [
      { id: 'ep-lw-1', episodeNumber: 1, title: 'The Secret Door' },
      { id: 'ep-lw-2', episodeNumber: 2, title: 'A Book That Bites' },
      { id: 'ep-lw-3', episodeNumber: 3, title: 'The Map Upstairs' },
      { id: 'ep-lw-4', episodeNumber: 4, title: 'Rainy Day Rules' },
      { id: 'ep-lw-5', episodeNumber: 5, title: 'The Missing Page' },
      { id: 'ep-lw-6', episodeNumber: 6, title: 'Fort Blanket' },
      { id: 'ep-lw-7', episodeNumber: 7, title: 'Star Watchers' },
      { id: 'ep-lw-8', episodeNumber: 8, title: 'The Last Chapter' },
    ],
    teamMembers: [
      { id: 'tm-lw-1', name: 'Maren Solberg', role: 'Director' },
      { id: 'tm-lw-2', name: 'Ines Moreau', role: 'Costume Designer' },
      { id: 'tm-lw-3', name: 'Ethan Caldwell', role: 'Producer' },
    ],
    characters: [
      { id: 'char-lw-1', name: 'Lily', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-lw-2', name: 'Sam', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-lw-3', name: 'Ravi', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-lw-4', name: 'Freya', gender: 'Female', castType: 'B', looks: [] },
      { id: 'char-lw-5', name: 'Mr. Finch', gender: 'Male', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  {
    id: 'proj-demo-7',
    name: 'Borderline',
    description: 'A gritty crime thriller following a detective on both sides of a border town',
    projectType: 'film',
    episodes: [],
    teamMembers: [
      { id: 'tm-bl-1', name: 'Diego Salazar', role: 'Director' },
      { id: 'tm-bl-2', name: 'Nina Volkov', role: 'Costume Designer' },
      { id: 'tm-bl-3', name: 'Oscar Bianchi', role: 'DOP' },
      { id: 'tm-bl-4', name: 'Rosa Delgado', role: 'Producer' },
    ],
    characters: [
      { id: 'char-bl-1', name: 'Detective Mara Ruiz', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-bl-2', name: 'Tomás Aguilar', gender: 'Male', castType: 'A', looks: [] },
      { id: 'char-bl-3', name: 'The Fixer', gender: 'Male', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  {
    id: 'proj-demo-8',
    name: 'The Last Garden',
    description: 'An environmental drama about a botanist fighting to save the world\'s oldest rainforest',
    projectType: 'film',
    episodes: [],
    teamMembers: [
      { id: 'tm-lg-1', name: 'Ada Mensah', role: 'Director' },
      { id: 'tm-lg-2', name: 'Leo Tanaka', role: 'Costume Designer' },
    ],
    characters: [
      { id: 'char-lg-1', name: 'Dr. Ava Osei', gender: 'Female', castType: 'A', looks: [] },
      { id: 'char-lg-2', name: 'Mateo Silva', gender: 'Male', castType: 'B', looks: [] },
    ],
    scenes: [],
  },
  // ── Empty dummy projects ───────────────────────────────────
  {
    id: 'proj-demo-9',
    name: 'Untitled Horror Project',
    description: '',
    projectType: 'film',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  },
  {
    id: 'proj-demo-10',
    name: 'Season 2 — TBD',
    description: '',
    projectType: 'series',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  },
  {
    id: 'proj-demo-11',
    name: 'Midnight Express Remake',
    description: '',
    projectType: 'film',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  },
  {
    id: 'proj-demo-12',
    name: 'Pilot — Uncharted Waters',
    description: '',
    projectType: 'series',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  },
  {
    id: 'proj-demo-13',
    name: 'Commercial — Autumn Collection',
    description: '',
    projectType: 'film',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  },
  {
    id: 'proj-demo-14',
    name: 'Music Video — Echoes',
    description: '',
    projectType: 'film',
    episodes: [],
    teamMembers: [],
    characters: [],
    scenes: [],
  },
];

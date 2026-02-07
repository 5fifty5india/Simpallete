import { Character, Scene } from '@/types';

export interface ParsedScene {
  sceneNumber: string;
  intExt: string;
  location: string;
  timeOfDay: string;
  description: string;
  characterNames: string[];
}

export interface ParsedScript {
  scenes: ParsedScene[];
  characters: string[];
}

const EXCLUDED_TERMS = new Set([
  'FADE IN', 'FADE OUT', 'FADE TO BLACK', 'CUT TO', 'SMASH CUT TO',
  'DISSOLVE TO', 'CONTINUED', 'THE END', 'TITLE CARD', 'SUPER',
  'INTERCUT', 'FLASHBACK', 'END FLASHBACK', 'MONTAGE', 'END MONTAGE',
  'SERIES OF SHOTS', 'BACK TO SCENE', 'CONTINUOUS', 'LATER', 'MOMENTS LATER',
  'MORE', 'CONT\'D', 'PRE-LAP', 'PRELAP', 'MATCH CUT TO', 'JUMP CUT TO',
  'TIME CUT', 'FREEZE FRAME', 'TITLE SEQUENCE', 'END TITLE SEQUENCE',
]);

// Scene heading: optional number, then INT/EXT, then location, optionally - TIME
const SCENE_HEADING_RE = /^(\d+[A-Z]?\.?\s+)?((?:INT|EXT|INT\.?\s*\/\s*EXT)\.?\s+)(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i;

// Character name: ALL CAPS, possibly with (V.O.), (O.S.), (CONT'D) etc.
const CHARACTER_NAME_RE = /^([A-Z][A-Z\s.'\-]+?)(?:\s*\(.*?\))?\s*$/;

function isCharacterName(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 40) return false;
  if (!CHARACTER_NAME_RE.test(trimmed)) return false;

  const name = trimmed.replace(/\s*\(.*?\)\s*$/, '').trim();
  if (EXCLUDED_TERMS.has(name)) return false;
  // Must have at least one letter
  if (!/[A-Z]/.test(name)) return false;
  // Should not be a scene heading
  if (SCENE_HEADING_RE.test(trimmed)) return false;

  return true;
}

function extractCharacterName(line: string): string {
  return line.trim().replace(/\s*\(.*?\)\s*$/, '').trim();
}

export function parseScript(text: string): ParsedScript {
  const lines = text.split(/\r?\n/);
  const scenes: ParsedScene[] = [];
  const allCharacters = new Set<string>();
  let currentScene: ParsedScene | null = null;
  let autoSceneNum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for scene heading
    const headingMatch = trimmed.match(SCENE_HEADING_RE);
    if (headingMatch) {
      // Save previous scene
      if (currentScene) scenes.push(currentScene);

      const rawNum = headingMatch[1]?.trim().replace(/\.\s*$/, '') || '';
      autoSceneNum++;
      const sceneNum = rawNum || String(autoSceneNum);
      const intExt = headingMatch[2].trim().replace(/\.\s*$/, '');
      const location = headingMatch[3].trim();
      const timeOfDay = (headingMatch[4] || '').trim().toUpperCase();

      currentScene = {
        sceneNumber: sceneNum,
        intExt,
        location,
        timeOfDay,
        description: '',
        characterNames: [],
      };
      continue;
    }

    if (!currentScene) continue;

    // Check for character name
    if (isCharacterName(trimmed)) {
      const name = extractCharacterName(trimmed);
      if (name && !currentScene.characterNames.includes(name)) {
        currentScene.characterNames.push(name);
      }
      allCharacters.add(name);
      continue;
    }

    // Action/description lines (non-empty, not dialogue indent)
    if (trimmed && !line.startsWith('    ') && !line.startsWith('\t')) {
      if (currentScene.description.length < 500) {
        const sep = currentScene.description ? ' ' : '';
        currentScene.description += sep + trimmed;
      }
    }
  }

  // Push last scene
  if (currentScene) scenes.push(currentScene);

  return {
    scenes,
    characters: Array.from(allCharacters).sort(),
  };
}

export function parseFdx(xmlText: string): ParsedScript {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const paragraphs = doc.querySelectorAll('Paragraph');

  const scenes: ParsedScene[] = [];
  const allCharacters = new Set<string>();
  let currentScene: ParsedScene | null = null;
  let autoSceneNum = 0;

  paragraphs.forEach((para) => {
    const type = para.getAttribute('Type') || '';
    const textEls = para.querySelectorAll('Text');
    const text = Array.from(textEls).map((t) => t.textContent || '').join('').trim();

    if (!text) return;

    if (type === 'Scene Heading') {
      if (currentScene) scenes.push(currentScene);

      autoSceneNum++;
      const headingMatch = text.match(SCENE_HEADING_RE);
      if (headingMatch) {
        const rawNum = headingMatch[1]?.trim().replace(/\.\s*$/, '') || '';
        currentScene = {
          sceneNumber: rawNum || String(autoSceneNum),
          intExt: headingMatch[2].trim().replace(/\.\s*$/, ''),
          location: headingMatch[3].trim(),
          timeOfDay: (headingMatch[4] || '').trim().toUpperCase(),
          description: '',
          characterNames: [],
        };
      } else {
        currentScene = {
          sceneNumber: String(autoSceneNum),
          intExt: '',
          location: text,
          timeOfDay: '',
          description: '',
          characterNames: [],
        };
      }
    } else if (type === 'Character' && currentScene) {
      const name = extractCharacterName(text);
      if (name && !EXCLUDED_TERMS.has(name)) {
        if (!currentScene.characterNames.includes(name)) {
          currentScene.characterNames.push(name);
        }
        allCharacters.add(name);
      }
    } else if (type === 'Action' && currentScene) {
      if (currentScene.description.length < 500) {
        const sep = currentScene.description ? ' ' : '';
        currentScene.description += sep + text;
      }
    }
  });

  if (currentScene) scenes.push(currentScene);

  return {
    scenes,
    characters: Array.from(allCharacters).sort(),
  };
}

// Convert parsed data to the import format expected by AppProvider
export function convertToImportData(parsed: ParsedScript) {
  const characters: Omit<Character, 'id' | 'looks'>[] = parsed.characters.map((name) => ({
    name,
    gender: 'Other' as const,
    castType: 'C' as const,
  }));

  const scenes: Omit<Scene, 'id' | 'characters'>[] = parsed.scenes.map((ps) => ({
    sceneNumber: ps.sceneNumber,
    scriptLocation: `${ps.intExt}${ps.intExt ? '. ' : ''}${ps.location}`,
    timeDay: ps.timeOfDay,
    shootDay: null,
    description: ps.description.substring(0, 200),
  }));

  const characterSceneMap: Record<string, string[]> = {};
  parsed.scenes.forEach((ps) => {
    characterSceneMap[ps.sceneNumber] = ps.characterNames;
  });

  return { characters, scenes, characterSceneMap };
}

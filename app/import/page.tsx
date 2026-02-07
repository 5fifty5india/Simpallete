'use client';

import { useState } from 'react';
import { useApp } from '@/lib/appStore';
import { useRequireProject } from '@/lib/useRequireProject';
import { parseScript, parseFdx, convertToImportData, ParsedScript } from '@/lib/scriptParser';
import ScriptUploader from '@/components/import/ScriptUploader';
import ParsedDataReview from '@/components/import/ParsedDataReview';

export default function ImportPage() {
  const { isReady } = useRequireProject();
  const { importScriptData } = useApp();

  if (!isReady) return null;
  const [parsedData, setParsedData] = useState<ParsedScript | null>(null);
  const [filename, setFilename] = useState('');
  const [importDone, setImportDone] = useState(false);

  const handleFileLoaded = (content: string, name: string) => {
    setFilename(name);
    setImportDone(false);

    const isFdx = name.toLowerCase().endsWith('.fdx');
    const parsed = isFdx ? parseFdx(content) : parseScript(content);

    if (parsed.scenes.length === 0 && parsed.characters.length === 0) {
      alert('No scenes or characters found in the script. Make sure it follows standard screenplay formatting.');
      return;
    }

    setParsedData(parsed);
  };

  const handleConfirm = (selectedSceneIndices: number[], selectedCharacters: string[]) => {
    if (!parsedData) return;

    // Filter to only selected items
    const filteredParsed: ParsedScript = {
      scenes: parsedData.scenes.filter((_, i) => selectedSceneIndices.includes(i)),
      characters: selectedCharacters,
    };

    // Also filter character-scene map to only include selected characters
    const importData = convertToImportData(filteredParsed);

    // Filter character-scene map entries to selected characters only
    for (const sceneNum of Object.keys(importData.characterSceneMap)) {
      importData.characterSceneMap[sceneNum] = importData.characterSceneMap[sceneNum]
        .filter((name) => selectedCharacters.includes(name));
    }

    importScriptData(importData);
    setImportDone(true);
    setParsedData(null);
  };

  const handleReset = () => {
    setParsedData(null);
    setFilename('');
    setImportDone(false);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Import Script</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Upload a screenplay to auto-extract scenes and characters
        </p>
      </div>

      {/* Success Message */}
      {importDone && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-emerald-200 font-medium text-sm">Import complete!</p>
              <p className="text-emerald-300/60 text-xs mt-0.5">
                Scenes and characters have been added to your project. Visit the Characters and Scenes pages to review.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload or Review */}
      {parsedData ? (
        <ParsedDataReview
          data={parsedData}
          filename={filename}
          onConfirm={handleConfirm}
          onCancel={handleReset}
        />
      ) : (
        <ScriptUploader onFileLoaded={handleFileLoaded} />
      )}

      {/* Format Help */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-white/5">
        <h3 className="text-white font-medium text-sm mb-3">Screenplay Format Guide</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-neutral-400 font-medium">Scene Headings</p>
            <p className="text-neutral-500 text-xs mt-1">
              Lines starting with INT. or EXT. followed by location and time of day
            </p>
            <code className="text-neutral-300 text-xs block mt-1 bg-neutral-800 rounded px-2 py-1">
              INT. COFFEE SHOP - DAY
            </code>
          </div>
          <div>
            <p className="text-neutral-400 font-medium">Character Names</p>
            <p className="text-neutral-500 text-xs mt-1">
              ALL CAPS names on their own line before dialogue
            </p>
            <code className="text-neutral-300 text-xs block mt-1 bg-neutral-800 rounded px-2 py-1">
              JOHN
            </code>
          </div>
          <div>
            <p className="text-neutral-400 font-medium">Supported Formats</p>
            <p className="text-neutral-500 text-xs mt-1">
              Plain text (.txt), Fountain (.fountain), Final Draft (.fdx)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

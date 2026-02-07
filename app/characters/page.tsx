'use client';

import { useState } from 'react';
import { useApp } from '@/lib/appStore';
import { useRequireProject } from '@/lib/useRequireProject';
import { Character } from '@/types';
import Button from '@/components/ui/Button';
import CharacterListCard from '@/components/characters/CharacterListCard';
import CharacterFormModal from '@/components/characters/CharacterFormModal';

export default function CharactersPage() {
  const { isReady } = useRequireProject();
  const { project, addCharacter, updateCharacter, deleteCharacter, addLook, updateLook, deleteLook } = useApp();

  if (!isReady) return null;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChar, setEditingChar] = useState<Character | null>(null);

  const openAdd = () => {
    setEditingChar(null);
    setModalOpen(true);
  };

  const openEdit = (char: Character) => {
    setEditingChar(char);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Character, 'id'>) => {
    if (editingChar) {
      updateCharacter(editingChar.id, data);
    } else {
      addCharacter(data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this character? They will be removed from all scenes.')) {
      deleteCharacter(id);
    }
  };

  // Group by cast type
  const leads = project.characters.filter((c) => c.castType === 'A');
  const supporting = project.characters.filter((c) => c.castType === 'B');
  const background = project.characters.filter((c) => c.castType === 'C');

  const renderGroup = (label: string, chars: Character[]) => {
    if (chars.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">{label}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {chars.map((char) => (
            <CharacterListCard
              key={char.id}
              character={char}
              onEdit={() => openEdit(char)}
              onDelete={() => handleDelete(char.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Characters</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {project.characters.length} character{project.characters.length !== 1 ? 's' : ''} in this project
          </p>
        </div>
        <Button onClick={openAdd}>Add Character</Button>
      </div>

      {/* Character Grid by Cast Type */}
      {project.characters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-xl">
          <svg className="w-12 h-12 text-neutral-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-neutral-500 text-sm">No characters yet</p>
          <p className="text-neutral-600 text-xs mt-1">Add characters or import from a script</p>
          <Button size="sm" className="mt-4" onClick={openAdd}>Add First Character</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {renderGroup('Lead Cast', leads)}
          {renderGroup('Supporting Cast', supporting)}
          {renderGroup('Background', background)}
        </div>
      )}

      {/* Character Form Modal */}
      <CharacterFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        character={editingChar}
        onSave={handleSave}
        onAddLook={addLook}
        onUpdateLook={updateLook}
        onDeleteLook={deleteLook}
      />
    </main>
  );
}

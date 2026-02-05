'use client';

import { useState } from 'react';
import { Character } from '@/types';
import Modal from './ui/Modal';
import Button from './ui/Button';

interface AddCharactersModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableCharacters: Character[];
  onAdd: (characterIds: string[]) => void;
}

export default function AddCharactersModal({
  isOpen,
  onClose,
  availableCharacters,
  onAdd,
}: AddCharactersModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleAdd = () => {
    onAdd(Array.from(selectedIds));
    setSelectedIds(new Set());
    onClose();
  };

  const handleClose = () => {
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Characters to Scene"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={selectedIds.size === 0}>
            Add Selected ({selectedIds.size})
          </Button>
        </div>
      }
    >
      {availableCharacters.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <p>All characters are already in this scene</p>
        </div>
      ) : (
        <div className="space-y-2">
          {availableCharacters.map((character) => (
            <label
              key={character.id}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedIds.has(character.id)
                  ? 'border-white/30 bg-white/5'
                  : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(character.id)}
                onChange={() => toggleSelection(character.id)}
                className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-white focus:ring-white/20 focus:ring-offset-neutral-900"
              />
              <div className="ml-3 flex-1">
                <p className="font-medium text-white">{character.name}</p>
                <p className="text-sm text-neutral-500">
                  {character.gender} · {character.castType === 'A' ? 'Lead' : character.castType === 'B' ? 'Supporting' : 'Background'}
                  {character.looks.length > 0 && ` · ${character.looks.length} look${character.looks.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              {character.looks.length > 0 && character.looks[0].image && (
                <img
                  src={character.looks[0].image}
                  alt={character.name}
                  className="w-12 h-12 rounded-lg object-cover ml-3"
                />
              )}
            </label>
          ))}
        </div>
      )}
    </Modal>
  );
}

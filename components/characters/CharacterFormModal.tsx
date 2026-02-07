'use client';

import { useState, useEffect } from 'react';
import { Character, Look } from '@/types';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LookManager from './LookManager';

interface CharacterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  character?: Character | null;
  onSave: (data: Omit<Character, 'id'>) => void;
  onAddLook?: (characterId: string, look: Omit<Look, 'id'>) => void;
  onUpdateLook?: (characterId: string, lookId: string, updates: Partial<Omit<Look, 'id'>>) => void;
  onDeleteLook?: (characterId: string, lookId: string) => void;
}

export default function CharacterFormModal({
  isOpen,
  onClose,
  character,
  onSave,
  onAddLook,
  onUpdateLook,
  onDeleteLook,
}: CharacterFormModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Character['gender']>('Male');
  const [castType, setCastType] = useState<Character['castType']>('A');
  const [pendingLooks, setPendingLooks] = useState<Look[]>([]);

  const isEditing = !!character;

  useEffect(() => {
    if (isOpen) {
      if (character) {
        setName(character.name);
        setGender(character.gender);
        setCastType(character.castType);
        setPendingLooks([]);
      } else {
        setName('');
        setGender('Male');
        setCastType('A');
        setPendingLooks([]);
      }
    }
  }, [isOpen, character]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      gender,
      castType,
      looks: isEditing ? character!.looks : pendingLooks,
    });
    onClose();
  };

  const handleAddPendingLook = (look: Omit<Look, 'id'>) => {
    if (isEditing && onAddLook) {
      onAddLook(character!.id, look);
    } else {
      setPendingLooks((prev) => [...prev, { ...look, id: `pending-${Date.now()}-${Math.random()}` }]);
    }
  };

  const handleUpdatePendingLook = (lookId: string, updates: Partial<Omit<Look, 'id'>>) => {
    if (isEditing && onUpdateLook) {
      onUpdateLook(character!.id, lookId, updates);
    } else {
      setPendingLooks((prev) => prev.map((l) => l.id === lookId ? { ...l, ...updates } : l));
    }
  };

  const handleDeletePendingLook = (lookId: string) => {
    if (isEditing && onDeleteLook) {
      onDeleteLook(character!.id, lookId);
    } else {
      setPendingLooks((prev) => prev.filter((l) => l.id !== lookId));
    }
  };

  const displayedLooks = isEditing ? character!.looks : pendingLooks;

  const inputClass = 'w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:border-neutral-600 transition-colors';
  const labelClass = 'block text-sm font-medium text-neutral-400 mb-1';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Character' : 'Add Character'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEditing ? 'Save Changes' : 'Add Character'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Character name"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value as Character['gender'])} className={inputClass}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Cast Type</label>
            <select value={castType} onChange={(e) => setCastType(e.target.value as Character['castType'])} className={inputClass}>
              <option value="A">Lead (Cast A)</option>
              <option value="B">Supporting (Cast B)</option>
              <option value="C">Background (Cast C)</option>
            </select>
          </div>
        </div>

        <hr className="border-neutral-800" />

        <LookManager
          looks={displayedLooks}
          onAddLook={handleAddPendingLook}
          onUpdateLook={handleUpdatePendingLook}
          onDeleteLook={handleDeletePendingLook}
        />
      </div>
    </Modal>
  );
}

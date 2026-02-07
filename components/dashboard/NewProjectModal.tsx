'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; projectType: 'film' | 'series' }) => void;
}

export default function NewProjectModal({ isOpen, onClose, onSave }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<'film' | 'series'>('film');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), projectType });
    setName('');
    setDescription('');
    setProjectType('film');
  };

  const labelClass = 'block text-sm font-medium text-neutral-400 mb-1';
  const inputClass = 'w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Project"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>Create Project</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. The Morning After"
            className={inputClass}
            autoFocus
          />
        </div>

        <div>
          <label className={labelClass}>Project Type</label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as 'film' | 'series')}
            className={inputClass}
          >
            <option value="film">Film</option>
            <option value="series">Series</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the project..."
            rows={3}
            className={inputClass + ' resize-none'}
          />
        </div>
      </div>
    </Modal>
  );
}

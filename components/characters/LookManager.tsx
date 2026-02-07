'use client';

import { useState, useRef, useCallback } from 'react';
import { Look } from '@/types';

interface LookManagerProps {
  looks: Look[];
  onAddLook: (look: Omit<Look, 'id'>) => void;
  onUpdateLook: (lookId: string, updates: Partial<Omit<Look, 'id'>>) => void;
  onDeleteLook: (lookId: string) => void;
}

export default function LookManager({ looks, onAddLook, onUpdateLook, onDeleteLook }: LookManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    let nextNumber = looks.length + 1;

    fileArray.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const image = ev.target?.result as string;
        onAddLook({ name: `Look ${nextNumber}`, image });
      };
      reader.readAsDataURL(file);
      nextNumber++;
    });
  }, [looks.length, onAddLook]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-400">Costume Looks</label>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
          isDragging
            ? 'border-white/30 bg-white/5'
            : 'border-neutral-700 hover:border-neutral-500'
        }`}
      >
        <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-neutral-400">Drop photos here or click to browse</p>
        <p className="text-xs text-neutral-600">Supports multiple images, max 5MB each</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Look grid */}
      {looks.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {looks.map((look, index) => (
            <div
              key={look.id}
              className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden group relative"
            >
              {/* Thumbnail */}
              <div className="aspect-square relative overflow-hidden">
                <img src={look.image} alt={look.name} className="w-full h-full object-cover" />
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => onDeleteLook(look.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm text-neutral-400 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="p-2.5 space-y-1.5">
                <span className="text-xs font-medium text-neutral-300">Look {index + 1}</span>
                <textarea
                  value={look.description || ''}
                  onChange={(e) => onUpdateLook(look.id, { description: e.target.value })}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-white placeholder-neutral-600 resize-none focus:ring-1 focus:ring-white/20 focus:border-neutral-600 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

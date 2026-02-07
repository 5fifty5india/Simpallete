'use client';

import { useRef, useState, DragEvent } from 'react';

interface ScriptUploaderProps {
  onFileLoaded: (content: string, filename: string) => void;
}

const ACCEPTED_EXTENSIONS = ['.txt', '.fountain', '.fdx'];

export default function ScriptUploader({ onFileLoaded }: ScriptUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      alert('Supported formats: .txt, .fountain, .fdx');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
        ${isDragging
          ? 'border-white/30 bg-neutral-800/50'
          : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.fountain,.fdx"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
        className="hidden"
      />

      <svg className="w-12 h-12 text-neutral-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>

      <p className="text-white font-medium">
        {isDragging ? 'Drop your script here' : 'Upload a screenplay'}
      </p>
      <p className="text-neutral-500 text-sm mt-2">
        Drag and drop or click to browse
      </p>
      <p className="text-neutral-600 text-xs mt-3">
        Supports .txt, .fountain, and .fdx (Final Draft) formats
      </p>
    </div>
  );
}

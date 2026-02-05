'use client';

import { useRef, useState, DragEvent } from 'react';

interface LocationImageProps {
  image?: string;
  onImageChange: (image: string | undefined) => void;
}

export default function LocationImage({ image, onImageChange }: LocationImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(undefined);
  };

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {image ? (
        <div className="relative group">
          <img
            src={image}
            alt="Location reference"
            className="w-full h-[320px] object-cover"
          />
          {/* Gradient fade at bottom for overlap effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

          {/* Hover controls */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={handleClick}
              className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-white transition-colors"
            >
              Change
            </button>
            <button
              onClick={handleRemove}
              className="bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-black/70 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            h-[200px] cursor-pointer transition-all
            flex flex-col items-center justify-center
            bg-gradient-to-b from-neutral-900 to-neutral-950
            ${isDragging ? 'from-neutral-800 to-neutral-900' : ''}
          `}
        >
          <svg
            className={`w-10 h-10 mb-2 ${isDragging ? 'text-neutral-400' : 'text-neutral-600'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-neutral-500 text-sm">
            {isDragging ? 'Drop image' : 'Add location image'}
          </p>
        </div>
      )}
    </div>
  );
}

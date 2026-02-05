'use client';

import Modal from './ui/Modal';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export default function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title,
}: ImagePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h3 className="text-white text-xl font-semibold mb-4 text-center">{title}</h3>

        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

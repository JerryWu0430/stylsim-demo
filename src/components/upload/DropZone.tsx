'use client';

import { useCallback, useState } from 'react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export function DropZone({ onFilesSelected, isUploading }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
      e.target.value = '';
    },
    [onFilesSelected]
  );

  return (
    <div
      className={`
        relative p-12 md:p-16 text-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isDragging ? 'bg-zinc-100 scale-[1.01]' : 'bg-transparent hover:bg-zinc-50/50'}
        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      {/* Subtle border animation */}
      <div
        className={`
          absolute inset-4 rounded-2xl border-2 border-dashed transition-all duration-500
          ${isDragging ? 'border-zinc-400 scale-[1.02]' : 'border-zinc-200 hover:border-zinc-300'}
        `}
      />

      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
        disabled={isUploading}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Icon with subtle animation */}
        <div
          className={`
            w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center
            transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${isDragging ? 'scale-110 bg-zinc-200' : 'group-hover:scale-105'}
          `}
        >
          <svg
            className={`w-7 h-7 transition-all duration-500 ${isDragging ? 'text-zinc-700 -translate-y-1' : 'text-zinc-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-medium text-zinc-800 tracking-tight">
            {isDragging ? 'Drop to upload' : 'Drop your images here'}
          </p>
          <p className="text-sm text-zinc-500">
            or <span className="text-zinc-700 font-medium underline underline-offset-2">browse files</span>
          </p>
        </div>

        {/* Format hints */}
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="px-2 py-1 rounded-md bg-zinc-100">JPG</span>
          <span className="px-2 py-1 rounded-md bg-zinc-100">PNG</span>
          <span className="px-2 py-1 rounded-md bg-zinc-100">WebP</span>
          <span className="text-zinc-300">|</span>
          <span>Max 20 images</span>
        </div>

        {isUploading && (
          <div className="flex items-center gap-3 text-sm text-zinc-600 mt-2">
            <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            Uploading...
          </div>
        )}
      </div>
    </div>
  );
}

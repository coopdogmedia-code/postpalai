"use client";

import { useCallback, useState } from "react";

interface VideoUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function VideoUpload({ onFileSelect, disabled = false }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ["video/mp4", "video/quicktime", "video/webm", "video/mov"];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      return "Please upload MP4, MOV, or WebM";
    }

    if (file.size > maxSize) {
      return "File must be under 100MB";
    }

    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center w-full h-40
          border-2 border-dashed rounded-xl cursor-pointer
          transition-colors
          ${isDragging ? "border-white bg-zinc-800/50" : "border-zinc-700 hover:border-zinc-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex flex-col items-center gap-2 text-center px-4">
          <div className="text-3xl">📁</div>
          <p className="text-sm font-medium text-zinc-200">
            Drop a video here or click to browse
          </p>
          <p className="text-xs text-zinc-500">
            MP4, MOV, WebM • Max 100MB • Works with any platform
          </p>
        </div>
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          onChange={handleInputChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </label>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
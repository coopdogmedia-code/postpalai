"use client";

import { useState } from "react";
import { VideoUpload } from "./VideoUpload";
import { UrlInput } from "../../app/analyze/UrlInput";
import { TranscriptInput } from "../../app/analyze/TranscriptInput";

type InputMode = "upload" | "url" | "transcript";

interface AnalyzeInputProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  onTranscriptSubmit: (transcript: string) => void;
  disabled?: boolean;
  urlError?: string;
}

export function AnalyzeInput({
  onFileSelect,
  onUrlSubmit,
  onTranscriptSubmit,
  disabled = false,
  urlError,
}: AnalyzeInputProps) {
  const [mode, setMode] = useState<InputMode>("upload");

  return (
    <div className="w-full max-w-xl space-y-6">
      {/* Primary: File Upload */}
      {mode === "upload" && (
        <>
          <VideoUpload onFileSelect={onFileSelect} disabled={disabled} />
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-500">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setMode("url")}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Paste a YouTube link instead
            </button>
            <button
              onClick={() => setMode("transcript")}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Or paste a transcript (fastest)
            </button>
          </div>
        </>
      )}

      {/* Secondary: URL Input */}
      {mode === "url" && (
        <>
          <UrlInput
            value=""
            onChange={() => {}}
            error={urlError}
            onSubmit={() => {}}
            disabled={disabled}
            onUrlSubmit={onUrlSubmit}
          />
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-500">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setMode("upload")}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Upload a video file
            </button>
            <button
              onClick={() => setMode("transcript")}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Or paste a transcript (fastest)
            </button>
          </div>
        </>
      )}

      {/* Tertiary: Transcript */}
      {mode === "transcript" && (
        <>
          <TranscriptInput onSubmit={onTranscriptSubmit} disabled={disabled} />
          
          <div className="flex items-center gap-4 pt-2">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-500">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setMode("upload")}
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Upload a video file
            </button>
            <button
              onClick={() => setMode("url")}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Or paste a YouTube link
            </button>
          </div>
        </>
      )}
    </div>
  );
}
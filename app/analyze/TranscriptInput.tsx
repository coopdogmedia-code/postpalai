"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface TranscriptInputProps {
  onSubmit: (transcript: string) => void;
  disabled?: boolean;
}

export function TranscriptInput({ onSubmit, disabled = false }: TranscriptInputProps) {
  const [transcript, setTranscript] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (transcript.trim().length < 20) return;
    onSubmit(transcript.trim());
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        Or paste a transcript instead →
      </button>
    );
  }

  return (
    <div className="w-full space-y-3">
      <label className="block text-sm font-medium text-zinc-300">
        Paste transcript
      </label>
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste the video transcript here..."
        disabled={disabled}
        rows={5}
        className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 resize-none"
      />
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(false)}
          className="text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Back
        </button>
        <Button
          onClick={handleSubmit}
          disabled={disabled || transcript.trim().length < 20}
          variant="primary"
        >
          Analyze Transcript
        </Button>
      </div>
      <p className="text-xs text-zinc-500">
        Fastest option • No file upload needed • Works offline
      </p>
    </div>
  );
}
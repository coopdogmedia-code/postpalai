"use client";

import { useState, useCallback } from "react";
import { ModeSelector } from "@/components/analyze/ModeSelector";
import { UrlInput } from "@/components/analyze/UrlInput";
import { LoadingState } from "@/components/analyze/LoadingState";
import { ViralResults } from "@/components/analyze/ViralResults";
import { OwnResults } from "@/components/analyze/OwnResults";

type AnalyzeState = "idle" | "loading" | "success" | "error";
type Mode = "viral" | "own";

interface AnalysisResponse {
  mode: Mode;
  title: string;
  platform: string;
  videoId: string;
  transcript_length: number;
  blueprint: Record<string, unknown>;
}

export default function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>("idle");
  const [mode, setMode] = useState<Mode>("viral");
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleSubmit = useCallback(
    async (url: string) => {
      setState("loading");
      setError(undefined);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, mode }),
        });

        const data = await response.json();

        if (!response.ok) {
          setState("error");
          setError(data.error || data.message || "Analysis failed.");
          return;
        }

        setResult(data);
        setState("success");
      } catch {
        setState("error");
        setError("Network error. Please try again.");
      }
    },
    [mode]
  );

  const handleReset = useCallback(() => {
    setState("idle");
    setError(undefined);
    setResult(null);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
            Analyze a Short
          </h1>
          {state !== "success" && (
            <p className="text-sm text-zinc-500">
              Paste a YouTube Shorts link. Get a structural breakdown.
            </p>
          )}
        </div>

        {(state === "idle" || state === "error") && (
          <div className="w-full flex flex-col items-center gap-6">
            <ModeSelector mode={mode} onModeChange={setMode} />
            <UrlInput onSubmit={handleSubmit} error={error} disabled={false} />
            <p className="text-xs text-zinc-600 text-center max-w-md">
              YouTube Shorts only for now. The video must have captions
              available (most do).
            </p>
          </div>
        )}

        {state === "loading" && <LoadingState mode={mode} />}

        {state === "success" && result && (
          <div className="w-full">
            {result.mode === "viral" ? (
              <ViralResults
                title={result.title}
                blueprint={result.blueprint}
                onReset={handleReset}
              />
            ) : (
              <OwnResults
                title={result.title}
                blueprint={result.blueprint}
                onReset={handleReset}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

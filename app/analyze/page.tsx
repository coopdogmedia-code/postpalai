"use client";

import { useState, useCallback } from "react";
import { AnalyzeInput } from "@/components/analyze/AnalyzeInput";
import { LoadingState } from "@/components/analyze/LoadingState";
import { BlueprintResults } from "@/components/analyze/BlueprintResults";

type AnalyzeState = "idle" | "loading" | "success" | "error";

interface BlueprintData {
  title: string;
  platform: "youtube" | "tiktok" | "instagram" | "unknown";
  summary: string;
  hooks: string[];
  outline: string[];
  notes: string[];
}

export default function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>("idle");
  const [error, setError] = useState<string | undefined>();
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [sourceLabel, setSourceLabel] = useState("");

  const handleError = (message: string) => {
    setState("error");
    setError(message);
  };

  const handleSuccess = (data: BlueprintData, source: string) => {
    setBlueprint(data);
    setSourceLabel(source);
    setState("success");
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setState("loading");
    setError(undefined);
    setSourceLabel(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/analyze/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        handleError(data.error || "Failed to analyze video");
        return;
      }

      handleSuccess(data, file.name);
    } catch (err) {
      console.error("Upload error:", err);
      handleError("Network error. Please try again.");
    }
  }, []);

  const handleUrlSubmit = useCallback(async (url: string) => {
    setState("loading");
    setError(undefined);
    setSourceLabel(url);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        handleError(data.error || "Failed to analyze video");
        return;
      }

      handleSuccess(data, url);
    } catch (err) {
      console.error("URL error:", err);
      handleError("Network error. Please try again.");
    }
  }, []);

  const handleTranscriptSubmit = useCallback(async (transcript: string) => {
    setState("loading");
    setError(undefined);
    setSourceLabel("Pasted transcript");

    try {
      const response = await fetch("/api/analyze/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (!response.ok) {
        handleError(data.error || "Failed to analyze transcript");
        return;
      }

      handleSuccess(data, "Pasted transcript");
    } catch (err) {
      console.error("Transcript error:", err);
      handleError("Network error. Please try again.");
    }
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setError(undefined);
    setBlueprint(null);
    setSourceLabel("");
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
            Analyze a Video
          </h1>
          {(state === "idle" || state === "error") && (
            <p className="text-sm text-zinc-500">
              Upload a video, paste a link, or drop in a transcript
            </p>
          )}
        </div>

        {(state === "idle" || state === "error") && (
          <>
            <AnalyzeInput
              onFileSelect={handleFileSelect}
              onUrlSubmit={handleUrlSubmit}
              onTranscriptSubmit={handleTranscriptSubmit}
              disabled={false}
              urlError={error}
            />
            {error && state === "error" && (
              <p className="mt-4 text-sm text-red-400">{error}</p>
            )}
          </>
        )}

        {state === "loading" && <LoadingState />}

        {state === "success" && blueprint && (
          <BlueprintResults
            url={sourceLabel}
            blueprint={blueprint}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
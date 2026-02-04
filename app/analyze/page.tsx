"use client";

import { useState, useCallback } from "react";
import { UrlInput } from "@/components/analyze/UrlInput";
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

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AnalyzePage() {
  const [state, setState] = useState<AnalyzeState>("idle");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");

  const handleAnalyze = useCallback(async () => {
    setError(undefined);

    if (!url.trim()) {
      setError("Enter a video URL");
      return;
    }

    if (!isValidUrl(url.trim())) {
      setError("Enter a valid URL");
      return;
    }

    setState("loading");
    setAnalyzedUrl(url.trim());

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setState("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setBlueprint(data);
      setState("success");
    } catch (err) {
      console.error("Analyze error:", err);
      setState("error");
      setError("Network error. Please check your connection and try again.");
    }
  }, [url]);

  const handleReset = useCallback(() => {
    setState("idle");
    setUrl("");
    setError(undefined);
    setBlueprint(null);
    setAnalyzedUrl("");
  }, []);

  const handleUrlChange = useCallback(
    (value: string) => {
      setUrl(value);
      if (error) setError(undefined);
      if (state === "error") setState("idle");
    },
    [error, state]
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
            Analyze a Video
          </h1>
          {(state === "idle" || state === "error") && (
            <p className="text-sm text-zinc-500">
              Paste a link to reverse-engineer its viral mechanics
            </p>
          )}
        </div>

        {(state === "idle" || state === "error") && (
          <UrlInput
            value={url}
            onChange={handleUrlChange}
            error={error}
            onSubmit={handleAnalyze}
            disabled={false}
          />
        )}

        {state === "loading" && <LoadingState />}

        {state === "success" && blueprint && (
          <BlueprintResults
            url={analyzedUrl}
            blueprint={blueprint}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
"use client";

type Mode = "viral" | "own";

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="w-full max-w-md">
      <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-1">
        <button
          onClick={() => onModeChange("viral")}
          className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            mode === "viral"
              ? "bg-zinc-100 text-zinc-900"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Analyze a Viral Short
        </button>
        <button
          onClick={() => onModeChange("own")}
          className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
            mode === "own"
              ? "bg-zinc-100 text-zinc-900"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Analyze Your Own Short
        </button>
      </div>
      <p className="text-xs text-zinc-500 text-center mt-3">
        {mode === "viral"
          ? "Understand why a video worked structurally so you can reuse the framework."
          : "Get a blunt structural diagnosis of your video and what to fix first."}
      </p>
    </div>
  );
}

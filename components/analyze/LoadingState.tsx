type Mode = "viral" | "own";

interface LoadingStateProps {
  mode: Mode;
}

export function LoadingState({ mode }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-zinc-100 rounded-full animate-spin" />
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-zinc-200">
          {mode === "viral" ? "Analyzing structure..." : "Diagnosing your video..."}
        </p>
        <p className="text-xs text-zinc-500">
          Fetching transcript → Mapping beats → Building analysis
        </p>
      </div>
    </div>
  );
}

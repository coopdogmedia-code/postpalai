export function LoadingState() {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
        </div>
  
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-zinc-200">Analyzing video...</p>
          <p className="text-xs text-zinc-500">
            Extracting hooks, structure, and mechanics
          </p>
        </div>
      </div>
    );
  }
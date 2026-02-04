interface ProgressProps {
    value: number;
    max?: number;
    className?: string;
  }
  
  export function Progress({ value, max = 100, className = "" }: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
    return (
      <div
        className={`h-2 w-full bg-zinc-800 rounded-full overflow-hidden ${className}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full bg-white rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
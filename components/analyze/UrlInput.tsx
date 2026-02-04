import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onSubmit: () => void;
  disabled?: boolean;
}

export function UrlInput({
  value,
  onChange,
  error,
  onSubmit,
  disabled = false,
}: UrlInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-xl space-y-3">
      <label
        htmlFor="video-url"
        className="block text-sm font-medium text-zinc-300"
      >
        Paste a short-form video URL
      </label>

      <div className="flex gap-3">
        <Input
          id="video-url"
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://youtube.com/shorts/..."
          aria-invalid={!!error}
          aria-describedby={error ? "url-error" : undefined}
          disabled={disabled}
        />

        <Button onClick={onSubmit} disabled={disabled} variant="primary">
          Analyze
        </Button>
      </div>

      {error && (
        <p id="url-error" className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-zinc-500">
        Supported: YouTube Shorts • TikTok • Instagram Reels
      </p>
    </div>
  );
}
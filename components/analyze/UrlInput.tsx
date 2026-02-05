"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  error?: string;
  disabled?: boolean;
}

export function UrlInput({ onSubmit, error: externalError, disabled = false }: UrlInputProps) {
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState<string | undefined>();

  const error = externalError || localError;

  const isValidUrl = (str: string): boolean => {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    setLocalError(undefined);

    if (!value.trim()) {
      setLocalError("Enter a video URL");
      return;
    }

    if (!isValidUrl(value.trim())) {
      setLocalError("Enter a valid URL");
      return;
    }

    onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) handleSubmit();
  };

  return (
    <div className="w-full max-w-xl space-y-3">
      <div className="flex gap-3">
        <Input
          type="url"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (localError) setLocalError(undefined);
          }}
          onKeyDown={handleKeyDown}
          placeholder="https://youtube.com/shorts/..."
          aria-invalid={!!error}
          disabled={disabled}
        />
        <Button onClick={handleSubmit} disabled={disabled} variant="primary">
          Analyze
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

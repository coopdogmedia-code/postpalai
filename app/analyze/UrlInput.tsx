"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface UrlInputProps {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  onSubmit?: () => void;
  onUrlSubmit?: (url: string) => void;
  disabled?: boolean;
}

export function UrlInput({
  value: controlledValue,
  onChange: controlledOnChange,
  error: externalError,
  onSubmit,
  onUrlSubmit,
  disabled = false,
}: UrlInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const [internalError, setInternalError] = useState<string | undefined>();

  const value = controlledValue ?? internalValue;
  const error = externalError ?? internalError;

  const handleChange = (newValue: string) => {
    if (controlledOnChange) {
      controlledOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
    if (internalError) setInternalError(undefined);
  };

  const isValidUrl = (str: string): boolean => {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!value.trim()) {
      setInternalError("Enter a video URL");
      return;
    }

    if (!isValidUrl(value.trim())) {
      setInternalError("Enter a valid URL");
      return;
    }

    if (onUrlSubmit) {
      onUrlSubmit(value.trim());
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full space-y-3">
      <label
        htmlFor="video-url"
        className="block text-sm font-medium text-zinc-300"
      >
        Paste a YouTube Shorts link
      </label>

      <div className="flex gap-3">
        <Input
          id="video-url"
          type="url"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://youtube.com/shorts/..."
          aria-invalid={!!error}
          aria-describedby={error ? "url-error" : undefined}
          disabled={disabled}
        />

        <Button onClick={handleSubmit} disabled={disabled} variant="primary">
          Analyze
        </Button>
      </div>

      {error && (
        <p id="url-error" className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-zinc-500">
        YouTube Shorts only • Other platforms: upload video
      </p>
    </div>
  );
}
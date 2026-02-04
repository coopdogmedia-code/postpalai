"use client";

import { useState } from "react";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 0,
  onChange,
  className = "",
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;

  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="h-2 bg-zinc-800 rounded-full">
        <div
          className="h-full bg-white rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-valuenow={currentValue}
        aria-valuemin={min}
        aria-valuemax={max}
      />
    </div>
  );
}
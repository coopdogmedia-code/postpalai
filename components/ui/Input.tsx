import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  "aria-invalid"?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", "aria-invalid": ariaInvalid, ...props }, ref) => {
    const base =
      "w-full rounded-lg bg-zinc-900 border px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors";

    const stateStyles = ariaInvalid
      ? "border-red-500 focus:ring-red-500"
      : "border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500";

    return (
      <input
        ref={ref}
        className={`${base} ${stateStyles} ${className}`}
        aria-invalid={ariaInvalid}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
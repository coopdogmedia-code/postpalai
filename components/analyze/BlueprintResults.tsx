import { Button } from "@/components/ui/Button";

interface BlueprintData {
  title: string;
  platform: "youtube" | "tiktok" | "instagram" | "unknown";
  summary: string;
  hooks: string[];
  outline: string[];
  notes: string[];
}

interface BlueprintResultsProps {
  url: string;
  blueprint: BlueprintData;
  onReset: () => void;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      title={`Copy ${label}`}
    >
      Copy
    </button>
  );
}

export function BlueprintResults({
  url,
  blueprint,
  onReset,
}: BlueprintResultsProps) {
  const platformLabel =
    blueprint.platform.charAt(0).toUpperCase() + blueprint.platform.slice(1);

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide px-2 py-1 bg-zinc-800 rounded">
            {platformLabel}
          </span>
        </div>
        <h2 className="text-xl font-semibold text-zinc-100">{blueprint.title}</h2>
        <p className="text-sm text-zinc-500 truncate">Source: {url}</p>
      </div>

      {/* Summary */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
            Summary
          </h3>
          <CopyButton text={blueprint.summary} label="summary" />
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          {blueprint.summary}
        </p>
      </section>

      {/* Hook Variations */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
            Hook Variations
          </h3>
          <CopyButton text={blueprint.hooks.join("\n")} label="hooks" />
        </div>
        <ul className="space-y-2">
          {blueprint.hooks.map((hook, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm text-zinc-300 bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
            >
              <span className="text-zinc-500 font-mono shrink-0">
                {index + 1}.
              </span>
              <span>{hook}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Structure Outline */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
            Structure Outline
          </h3>
          <CopyButton text={blueprint.outline.join("\n")} label="outline" />
        </div>
        <ul className="space-y-2">
          {blueprint.outline.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm text-zinc-300">
              <span className="text-zinc-500 font-mono shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Why It Worked / Notes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-wide">
            Why It Worked
          </h3>
          <CopyButton text={blueprint.notes.join("\n")} label="notes" />
        </div>
        <ul className="space-y-2">
          {blueprint.notes.map((note, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm text-zinc-400 leading-relaxed"
            >
              <span className="text-zinc-600">•</span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-zinc-800">
        <Button variant="secondary" onClick={onReset}>
          Analyze another
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const fullText = `# ${blueprint.title}\n\nPlatform: ${platformLabel}\nSource: ${url}\n\n## Summary\n${blueprint.summary}\n\n## Hook Variations\n${blueprint.hooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}\n\n## Structure Outline\n${blueprint.outline.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n## Why It Worked\n${blueprint.notes.map((n) => `• ${n}`).join("\n")}`;
            navigator.clipboard.writeText(fullText);
          }}
        >
          Export Blueprint
        </Button>
      </div>
    </div>
  );
}
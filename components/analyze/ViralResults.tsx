"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ViralResultsProps {
  title: string;
  blueprint: Record<string, unknown>;
  onReset: () => void;
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
    >
      {copied ? "Copied" : label || "Copy"}
    </button>
  );
}

function SectionHeader({
  title,
  copyText,
}: {
  title: string;
  copyText?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
        {title}
      </h3>
      {copyText && <CopyButton text={copyText} />}
    </div>
  );
}

export function ViralResults({ title, blueprint, onReset }: ViralResultsProps) {
  const bp = blueprint as {
    hook_breakdown?: {
      hook_quote?: string;
      hook_type?: string;
      why_it_stops_scroll?: string;
      timing_seconds?: number;
    };
    structural_beats?: {
      timestamp?: string;
      label?: string;
      description?: string;
    }[];
    retention_mechanics?: {
      open_loops?: string[];
      pattern_interrupts?: string[];
      intentionally_avoided?: string[];
      viewer_reward?: string;
    };
    reusable_framework?: string[];
    confidence_notes?: string[];
  };

  const hook = bp.hook_breakdown;
  const beats = bp.structural_beats || [];
  const retention = bp.retention_mechanics;
  const framework = bp.reusable_framework || [];
  const confidence = bp.confidence_notes || [];

  const buildFullExport = () => {
    let text = `VIRAL ANALYSIS: ${title}\n\n`;

    if (hook) {
      text += `HOOK BREAKDOWN\n`;
      text += `Quote: "${hook.hook_quote}"\n`;
      text += `Type: ${hook.hook_type}\n`;
      text += `Why it works: ${hook.why_it_stops_scroll}\n`;
      text += `Timing: ${hook.timing_seconds}s\n\n`;
    }

    if (beats.length > 0) {
      text += `STRUCTURAL BEATS\n`;
      beats.forEach((b) => {
        text += `${b.timestamp} [${b.label}] ${b.description}\n`;
      });
      text += `\n`;
    }

    if (retention) {
      text += `RETENTION MECHANICS\n`;
      if (retention.open_loops?.length)
        text += `Open loops: ${retention.open_loops.join("; ")}\n`;
      if (retention.pattern_interrupts?.length)
        text += `Pattern interrupts: ${retention.pattern_interrupts.join("; ")}\n`;
      if (retention.intentionally_avoided?.length)
        text += `Intentionally avoided: ${retention.intentionally_avoided.join("; ")}\n`;
      if (retention.viewer_reward)
        text += `Viewer reward: ${retention.viewer_reward}\n`;
      text += `\n`;
    }

    if (framework.length > 0) {
      text += `REUSABLE FRAMEWORK\n`;
      framework.forEach((f, i) => {
        text += `${i + 1}. ${f}\n`;
      });
      text += `\n`;
    }

    if (confidence.length > 0) {
      text += `CONFIDENCE NOTES\n`;
      confidence.forEach((c) => {
        text += `• ${c}\n`;
      });
    }

    return text;
  };

  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div>
        <p className="text-xs font-medium text-emerald-400 mb-1">
          VIRAL ANALYSIS
        </p>
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
      </div>

      {/* Hook Breakdown */}
      {hook && (
        <section className="space-y-3">
          <SectionHeader
            title="Hook Breakdown"
            copyText={`"${hook.hook_quote}" — ${hook.hook_type}: ${hook.why_it_stops_scroll}`}
          />
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-zinc-500 mb-1">What was said</p>
              <p className="text-sm text-zinc-100 italic">
                &ldquo;{hook.hook_quote}&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Hook type</p>
                <p className="text-sm text-zinc-200">{hook.hook_type}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Timing</p>
                <p className="text-sm text-zinc-200">
                  {hook.timing_seconds}s into video
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Why it stops the scroll</p>
              <p className="text-sm text-zinc-300">{hook.why_it_stops_scroll}</p>
            </div>
          </div>
        </section>
      )}

      {/* Structural Beats */}
      {beats.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            title="Structural Beats"
            copyText={beats
              .map((b) => `${b.timestamp} [${b.label}] ${b.description}`)
              .join("\n")}
          />
          <div className="space-y-2">
            {beats.map((beat, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 flex gap-3"
              >
                <div className="flex-shrink-0 w-20">
                  <p className="text-xs font-mono text-zinc-500">
                    {beat.timestamp}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-zinc-300 mb-0.5">
                    {beat.label}
                  </p>
                  <p className="text-sm text-zinc-400">{beat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Retention Mechanics */}
      {retention && (
        <section className="space-y-3">
          <SectionHeader title="Retention Mechanics" />
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-4">
            {retention.open_loops && retention.open_loops.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-1">
                  Open loops
                </p>
                {retention.open_loops.map((loop, i) => (
                  <p key={i} className="text-sm text-zinc-300 mb-1">
                    • {loop}
                  </p>
                ))}
              </div>
            )}
            {retention.pattern_interrupts &&
              retention.pattern_interrupts.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-1">
                    Pattern interrupts
                  </p>
                  {retention.pattern_interrupts.map((pi, i) => (
                    <p key={i} className="text-sm text-zinc-300 mb-1">
                      • {pi}
                    </p>
                  ))}
                </div>
              )}
            {retention.intentionally_avoided &&
              retention.intentionally_avoided.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-1">
                    Intentionally avoided
                  </p>
                  {retention.intentionally_avoided.map((item, i) => (
                    <p key={i} className="text-sm text-zinc-300 mb-1">
                      • {item}
                    </p>
                  ))}
                </div>
              )}
            {retention.viewer_reward && (
              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-1">
                  Viewer reward
                </p>
                <p className="text-sm text-zinc-300">
                  {retention.viewer_reward}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reusable Framework */}
      {framework.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            title="Reusable Framework"
            copyText={framework.map((f, i) => `${i + 1}. ${f}`).join("\n")}
          />
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            {framework.map((step, i) => (
              <p key={i} className="text-sm text-zinc-300 mb-2 last:mb-0">
                <span className="text-zinc-500 font-mono text-xs mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Confidence Notes */}
      {confidence.length > 0 && (
        <section className="space-y-3">
          <SectionHeader title="Confidence Notes" />
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
            {confidence.map((note, i) => (
              <p key={i} className="text-xs text-zinc-500 mb-1 last:mb-0">
                ⚠ {note}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
        <Button onClick={onReset} variant="primary">
          Analyze another
        </Button>
        <CopyButton text={buildFullExport()} label="Export as text" />
      </div>
    </div>
  );
}

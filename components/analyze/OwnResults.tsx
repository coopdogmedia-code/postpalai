"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface OwnResultsProps {
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

export function OwnResults({ title, blueprint, onReset }: OwnResultsProps) {
  const bp = blueprint as {
    hook_diagnosis?: {
      hook_quote?: string;
      timing_seconds?: number;
      expected_window?: string;
      verdict?: string;
      fix?: string;
    };
    structure_diagnosis?: {
      timestamp?: string;
      label?: string;
      issue?: string;
    }[];
    payoff_check?: {
      what_viewer_gets?: string;
      is_clear?: boolean;
      matches_hook_promise?: boolean;
      assessment?: string;
    };
    fix_priority?: {
      fix?: string;
      why?: string;
      example?: string;
    }[];
    confidence_notes?: string[];
  };

  const hook = bp.hook_diagnosis;
  const structure = bp.structure_diagnosis || [];
  const payoff = bp.payoff_check;
  const fixes = bp.fix_priority || [];
  const confidence = bp.confidence_notes || [];

  const buildFullExport = () => {
    let text = `STRUCTURAL DIAGNOSIS: ${title}\n\n`;

    if (hook) {
      text += `HOOK DIAGNOSIS\n`;
      text += `Quote: "${hook.hook_quote}"\n`;
      text += `Timing: ${hook.timing_seconds}s (expected: ${hook.expected_window})\n`;
      text += `Verdict: ${hook.verdict}\n`;
      text += `Fix: ${hook.fix}\n\n`;
    }

    if (structure.length > 0) {
      text += `STRUCTURE DIAGNOSIS\n`;
      structure.forEach((s) => {
        text += `${s.timestamp} [${s.label}] ${s.issue}\n`;
      });
      text += `\n`;
    }

    if (payoff) {
      text += `PAYOFF CHECK\n`;
      text += `Viewer gets: ${payoff.what_viewer_gets}\n`;
      text += `Clear: ${payoff.is_clear ? "Yes" : "No"}\n`;
      text += `Matches hook: ${payoff.matches_hook_promise ? "Yes" : "No"}\n`;
      text += `Assessment: ${payoff.assessment}\n\n`;
    }

    if (fixes.length > 0) {
      text += `FIX PRIORITY\n`;
      fixes.forEach((f, i) => {
        text += `${i + 1}. ${f.fix}\n   Why: ${f.why}\n   Example: ${f.example}\n`;
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
        <p className="text-xs font-medium text-amber-400 mb-1">
          STRUCTURAL DIAGNOSIS
        </p>
        <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
      </div>

      {/* Hook Diagnosis */}
      {hook && (
        <section className="space-y-3">
          <SectionHeader title="Hook Diagnosis" />
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Your opening</p>
              <p className="text-sm text-zinc-100 italic">
                &ldquo;{hook.hook_quote}&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Your timing</p>
                <p className="text-sm text-zinc-200">
                  {hook.timing_seconds}s
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Expected window</p>
                <p className="text-sm text-zinc-200">
                  {hook.expected_window}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Verdict</p>
              <p className="text-sm text-zinc-300">{hook.verdict}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Fix</p>
              <p className="text-sm text-zinc-200">{hook.fix}</p>
            </div>
          </div>
        </section>
      )}

      {/* Structure Diagnosis */}
      {structure.length > 0 && (
        <section className="space-y-3">
          <SectionHeader title="Structure Diagnosis" />
          <div className="space-y-2">
            {structure.map((beat, i) => {
              const hasIssue =
                beat.issue &&
                beat.issue.toLowerCase() !== "no issue" &&
                beat.issue.toLowerCase() !== "no issue.";
              return (
                <div
                  key={i}
                  className={`border rounded-lg p-3 flex gap-3 ${
                    hasIssue
                      ? "bg-red-950/20 border-red-900/30"
                      : "bg-zinc-900/50 border-zinc-800"
                  }`}
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
                    <p
                      className={`text-sm ${
                        hasIssue ? "text-red-300" : "text-zinc-500"
                      }`}
                    >
                      {beat.issue}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Payoff Check */}
      {payoff && (
        <section className="space-y-3">
          <SectionHeader title="Payoff Check" />
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-zinc-500 mb-1">
                What the viewer gets
              </p>
              <p className="text-sm text-zinc-300">
                {payoff.what_viewer_gets}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    payoff.is_clear ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <p className="text-sm text-zinc-300">
                  {payoff.is_clear ? "Payoff is clear" : "Payoff is unclear"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    payoff.matches_hook_promise
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />
                <p className="text-sm text-zinc-300">
                  {payoff.matches_hook_promise
                    ? "Matches hook promise"
                    : "Doesn't match hook"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Assessment</p>
              <p className="text-sm text-zinc-300">{payoff.assessment}</p>
            </div>
          </div>
        </section>
      )}

      {/* Fix Priority */}
      {fixes.length > 0 && (
        <section className="space-y-3">
          <SectionHeader
            title="Fix Priority"
            copyText={fixes
              .map(
                (f, i) =>
                  `${i + 1}. ${f.fix}\n   Why: ${f.why}\n   Example: ${f.example}`
              )
              .join("\n")}
          />
          <div className="space-y-3">
            {fixes.map((fix, i) => (
              <div
                key={i}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium text-zinc-100">
                      {fix.fix}
                    </p>
                    <p className="text-sm text-zinc-400">
                      <span className="text-zinc-500">Why:</span> {fix.why}
                    </p>
                    <div className="bg-zinc-800/50 rounded-md p-2">
                      <p className="text-sm text-zinc-300">
                        <span className="text-zinc-500">Example:</span>{" "}
                        {fix.example}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

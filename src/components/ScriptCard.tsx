"use client";

import { useState } from "react";
import type { ScriptVariant } from "@/lib/types";

interface Props {
  variant: ScriptVariant;
  subjectLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

export function ScriptCard({
  variant,
  subjectLabel,
  copyLabel,
  copiedLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = variant.subject
      ? `${subjectLabel}: ${variant.subject}\n\n${variant.body}`
      : variant.body;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
          {variant.label}
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      {variant.subject ? (
        <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800/80">
          <span className="font-medium text-slate-500 dark:text-slate-400">
            {subjectLabel}:{" "}
          </span>
          <span className="text-slate-800 dark:text-slate-100">{variant.subject}</span>
        </p>
      ) : null}
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {variant.body}
      </pre>
    </article>
  );
}

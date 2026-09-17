"use client";

import { useState } from "react";
import type { ScriptVariant } from "@/lib/types";

interface Props {
  variant: ScriptVariant;
  subjectLabel: string;
  copyLabel: string;
  copiedLabel: string;
  downloadLabel: string;
}

function buildText(variant: ScriptVariant, subjectLabel: string): string {
  return variant.subject
    ? `${subjectLabel}: ${variant.subject}\n\n${variant.body}`
    : variant.body;
}

function safeFilename(label: string): string {
  const base = label
    .trim()
    .replace(/[^\w\u4e00-\u9fff-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "script"}.txt`;
}

export function ScriptCard({
  variant,
  subjectLabel,
  copyLabel,
  copiedLabel,
  downloadLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = buildText(variant, subjectLabel);
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

  function handleDownload() {
    const text = buildText(variant, subjectLabel);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeFilename(variant.label);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const btnClass =
    "shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-950 dark:hover:text-indigo-300";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
          {variant.label}
        </h3>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={handleDownload} className={btnClass}>
            {downloadLabel}
          </button>
          <button type="button" onClick={handleCopy} className={btnClass}>
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
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

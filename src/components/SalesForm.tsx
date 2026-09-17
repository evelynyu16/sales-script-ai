"use client";

import { useEffect, useMemo, useState } from "react";
import { t } from "@/lib/i18n";
import type {
  Channel,
  GenerateResponse,
  Goal,
  Lang,
  ScriptVariant,
  Tone,
} from "@/lib/types";
import { ScriptCard } from "./ScriptCard";

const CHANNELS: Channel[] = ["email", "linkedin", "sms", "phone"];
const TONES: Tone[] = ["professional", "friendly", "direct"];
const GOALS: Goal[] = ["first_touch", "follow_up", "objection", "meeting_ask"];

const DRAFT_KEY = "salesscript-draft-v1";

const CHANNELS_SET = new Set<string>(["email", "linkedin", "sms", "phone"]);
const TONES_SET = new Set<string>(["professional", "friendly", "direct"]);
const GOALS_SET = new Set<string>([
  "first_touch",
  "follow_up",
  "objection",
  "meeting_ask",
]);

type Draft = {
  lang: Lang;
  leadNotes: string;
  productOffer: string;
  channel: Channel;
  tone: Tone;
  goal: Goal;
};

function loadDraft(): Partial<Draft> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function SalesForm() {
  const [lang, setLang] = useState<Lang>("en");
  const c = useMemo(() => t(lang), [lang]);

  const [leadNotes, setLeadNotes] = useState("");
  const [productOffer, setProductOffer] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [tone, setTone] = useState<Tone>("professional");
  const [goal, setGoal] = useState<Goal>("first_touch");
  const [draftReady, setDraftReady] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<ScriptVariant[]>([]);

  // Restore draft once on mount (client-only)
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.lang === "en" || draft.lang === "zh") setLang(draft.lang);
      if (typeof draft.leadNotes === "string") setLeadNotes(draft.leadNotes);
      if (typeof draft.productOffer === "string")
        setProductOffer(draft.productOffer);
      if (draft.channel && CHANNELS_SET.has(draft.channel))
        setChannel(draft.channel);
      if (draft.tone && TONES_SET.has(draft.tone)) setTone(draft.tone);
      if (draft.goal && GOALS_SET.has(draft.goal)) setGoal(draft.goal);
    }
    setDraftReady(true);
  }, []);

  // Persist draft whenever fields change (after restore)
  useEffect(() => {
    if (!draftReady) return;
    const draft: Draft = {
      lang,
      leadNotes,
      productOffer,
      channel,
      tone,
      goal,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota / private mode
    }
  }, [draftReady, lang, leadNotes, productOffer, channel, tone, goal]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leadNotes.trim()) {
      setError(c.leadNotesRequired);
      return;
    }
    setLoading(true);
    setError(null);
    setVariants([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadNotes: leadNotes.trim(),
          productOffer: productOffer.trim() || undefined,
          channel,
          tone,
          goal,
          lang,
        }),
      });
      const data = (await res.json()) as GenerateResponse & {
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (data.code === "CONFIG") {
          setError(c.errorConfig);
        } else {
          setError(data.error || c.errorGeneric);
        }
        return;
      }
      setVariants(data.variants || []);
    } catch {
      setError(c.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            AI Sales Follow-up Assistant
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {c.title}
          </h1>
          <p className="mt-2 max-w-xl text-slate-600 dark:text-slate-400">
            {c.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              lang === "en"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("zh")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              lang === "zh"
                ? "bg-indigo-600 text-white"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            中文
          </button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {c.leadNotes} <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={6}
              value={leadNotes}
              onChange={(e) => setLeadNotes(e.target.value)}
              placeholder={c.leadNotesHint}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {c.productOffer}
            </label>
            <input
              type="text"
              value={productOffer}
              onChange={(e) => setProductOffer(e.target.value)}
              placeholder={c.productOfferHint}
              className={selectClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {c.channel}
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
                className={selectClass}
              >
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {c.channels[ch]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {c.tone}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className={selectClass}
              >
                {TONES.map((to) => (
                  <option key={to} value={to}>
                    {c.tones[to]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {c.goal}
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className={selectClass}
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {c.goals[g]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {c.generating}
              </>
            ) : (
              c.generate
            )}
          </button>
        </form>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {c.results}
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                />
              ))}
            </div>
          ) : variants.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-400">
              <svg
                className="mb-3 h-10 w-10 text-slate-300 dark:text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              {c.emptyState}
            </div>
          ) : (
            variants.map((v, idx) => (
              <ScriptCard
                key={`${v.label}-${idx}`}
                variant={v}
                subjectLabel={c.subject}
                copyLabel={c.copy}
                copiedLabel={c.copied}
                downloadLabel={c.download}
              />
            ))
          )}
        </section>
      </div>

      <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500">
        {c.footer}
      </p>
    </div>
  );
}

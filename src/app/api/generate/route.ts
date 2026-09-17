import { NextRequest, NextResponse } from "next/server";
import type {
  Channel,
  GenerateRequest,
  GenerateResponse,
  Goal,
  Lang,
  ScriptVariant,
  Tone,
} from "@/lib/types";

const CHANNELS: Channel[] = ["email", "linkedin", "sms", "phone"];
const TONES: Tone[] = ["professional", "friendly", "direct"];
const GOALS: Goal[] = ["first_touch", "follow_up", "objection", "meeting_ask"];
const LANGS: Lang[] = ["en", "zh"];

function isValidBody(body: unknown): body is GenerateRequest {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.leadNotes === "string" &&
    b.leadNotes.trim().length > 0 &&
    (b.productOffer === undefined || typeof b.productOffer === "string") &&
    CHANNELS.includes(b.channel as Channel) &&
    TONES.includes(b.tone as Tone) &&
    GOALS.includes(b.goal as Goal) &&
    LANGS.includes(b.lang as Lang)
  );
}

function buildSystemPrompt(lang: Lang): string {
  const langRule =
    lang === "zh"
      ? "Write ALL script content in Simplified Chinese."
      : "Write ALL script content in English.";

  return `You are an expert B2B/B2C sales copywriter. Generate concise, natural outreach scripts.
${langRule}
Return ONLY valid JSON with this shape (no markdown fences):
{
  "variants": [
    { "label": "Variant A", "subject": "optional email subject", "body": "script text" },
    { "label": "Variant B", "subject": "optional", "body": "..." },
    { "label": "Variant C", "subject": "optional", "body": "..." }
  ]
}
Rules:
- Provide 2 or 3 variants with distinct angles.
- Include "subject" ONLY when channel is email; omit it otherwise.
- Keep SMS under ~320 characters; phone scripts as short talk tracks; LinkedIn DMs concise; emails 3–6 short paragraphs max.
- No placeholders like [Name] unless the lead notes lack a name — then use a natural greeting.
- Do not invent false claims about the product.`;
}

function buildUserPrompt(req: GenerateRequest): string {
  return [
    `Channel: ${req.channel}`,
    `Tone: ${req.tone}`,
    `Goal: ${req.goal}`,
    `Product/offer: ${req.productOffer?.trim() || "(not specified — keep general)"}`,
    `Lead/customer notes:\n${req.leadNotes.trim()}`,
  ].join("\n");
}

function parseVariants(raw: string): ScriptVariant[] {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Model returned non-JSON");
  const parsed = JSON.parse(jsonMatch[0]) as GenerateResponse;
  if (!Array.isArray(parsed.variants) || parsed.variants.length < 1) {
    throw new Error("No variants in model response");
  }
  return parsed.variants
    .slice(0, 3)
    .map((v, i) => ({
      label: (v.label || `Variant ${String.fromCharCode(65 + i)}`).trim(),
      subject: v.subject?.trim() || undefined,
      body: (v.body || "").trim(),
    }))
    .filter((v) => v.body.length > 0);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isValidBody(body)) {
    return NextResponse.json(
      { error: "Invalid request. leadNotes is required; channel/tone/goal/lang must be valid." },
      { status: 400 }
    );
  }

  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = (process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1").replace(
    /\/$/,
    ""
  );
  const model = process.env.LLM_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    return NextResponse.json(
      { error: "LLM_API_KEY is not configured", code: "CONFIG" },
      { status: 503 }
    );
  }

  try {
    const llmRes = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(body.lang) },
          { role: "user", content: buildUserPrompt(body) },
        ],
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text().catch(() => "");
      console.error("LLM error", llmRes.status, errText.slice(0, 500));
      return NextResponse.json(
        { error: `LLM request failed (${llmRes.status})` },
        { status: 502 }
      );
    }

    const data = (await llmRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty LLM response" }, { status: 502 });
    }

    const variants = parseVariants(content);
    if (variants.length === 0) {
      return NextResponse.json({ error: "Could not parse scripts" }, { status: 502 });
    }

    // Strip subject for non-email channels
    const cleaned =
      body.channel === "email"
        ? variants
        : variants.map(({ label, body }) => ({ label, body }));

    return NextResponse.json({ variants: cleaned } satisfies GenerateResponse);
  } catch (err) {
    console.error("Generate failed", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}

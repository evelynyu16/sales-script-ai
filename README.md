# SalesScript AI

A personal portfolio project: an AI sales follow-up assistant that turns messy lead notes into ready-to-send outreach scripts.

## The problem

Sales follow-ups are repetitive but high-stakes. You already know the lead — who they are, what they said, what you're pitching — yet writing a clear email, LinkedIn DM, SMS, or phone opener still takes time. Generic templates ignore context; blank pages stall the next touch.

**SalesScript AI** takes that context and generates 2–3 channel-aware script variants (plus an email subject when relevant) so you can edit and send faster.

## Why English + 中文

I work across English- and Chinese-speaking contexts. The UI toggles between **EN** and **中文**, and generated scripts follow the selected language so the same workflow works for both audiences.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- OpenAI-compatible LLM API (**Groq** by default; **Gemini** also works via its OpenAI-compatible endpoint)
- Client-side draft memory via `localStorage` (no account / no server-side storage of form input)

## Features

- Lead notes (required), optional product/offer, channel, tone, and goal
- Channels: email, LinkedIn DM, SMS, phone
- Goals: first touch, follow-up, objection handling, meeting ask
- Copy or download each variant as a `.txt` file
- Remembers your form draft in the browser between visits
- Loading and error states (including missing API key)

## Local setup

```bash
git clone https://github.com/evelynyu16/sales-script-ai.git
cd sales-script-ai
cp .env.example .env.local
# edit .env.local and set LLM_API_KEY
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable       | Default                                      | Notes                          |
|----------------|----------------------------------------------|--------------------------------|
| `LLM_API_KEY`  | _(required)_                                 | Never commit real keys         |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1`             | OpenAI-compatible base URL     |
| `LLM_MODEL`    | `llama-3.3-70b-versatile`                    | Model id                       |

## Free API key options

You can run this locally (or on Vercel) with a free-tier key from either provider.

### Groq (default)

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key
3. In `.env.local`:

```env
LLM_API_KEY=gsk_...
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=llama-3.3-70b-versatile
```

### Google Gemini (OpenAI-compatible)

1. Get a key from [Google AI Studio](https://aistudio.google.com/apikey)
2. In `.env.local`:

```env
LLM_API_KEY=your_gemini_key
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
LLM_MODEL=gemini-2.0-flash
```

## Deploy on Vercel

1. Fork or push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add `LLM_API_KEY`, `LLM_BASE_URL`, and `LLM_MODEL` under Project Settings → Environment Variables
4. Deploy

The generate endpoint is `POST /api/generate`. Keep the API key server-side only — never expose it to the client.

## Possible next steps (not built)

- Rate limits / freemium caps
- Saved history or templates
- CRM paste helpers
- Shared tone guidelines for a team

This is an MVP portfolio demo — no payments, no user accounts, no production usage claims.

## License

MIT

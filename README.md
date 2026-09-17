# SalesScript AI

AI Sales Follow-up Assistant — paste lead/customer context and generate outreach, follow-up, objection-handling, and meeting-ask scripts for **email**, **LinkedIn DM**, **SMS**, and **phone**.

UI supports **English + 中文** (toggle in the header).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- OpenAI-compatible LLM API (Groq by default; Gemini also works)

## Local setup

```bash
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

### Groq (default)

1. Sign up at [https://console.groq.com](https://console.groq.com)
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

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the same env vars (`LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`) in Project Settings → Environment Variables
4. Deploy

Serverless route: `POST /api/generate`. Keep the API key server-side only — never expose it to the client.

## Features (MVP)

- Lead notes (required), product/offer, channel, tone, goal
- 2–3 script variants + email subject line when channel is email
- Copy-to-clipboard per variant
- Loading and error states (including missing API key)

## Future freemium ideas (not built)

- Daily free generations + paid higher limits
- Saved script history / templates per workspace
- CRM paste helpers (HubSpot / Salesforce snippet)
- Team shared tone guidelines
- A/B score tips on variants

No payments in this MVP.

## License

MIT

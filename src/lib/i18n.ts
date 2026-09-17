import type { Channel, Goal, Lang, Tone } from "./types";

export const copy = {
  en: {
    title: "SalesScript AI",
    subtitle: "Paste lead context → get outreach, follow-up & objection scripts in seconds.",
    leadNotes: "Lead / customer notes",
    leadNotesHint: "Who they are, what they said, pain points, last touch…",
    leadNotesRequired: "Lead notes are required.",
    productOffer: "Product / offer",
    productOfferHint: "Optional — what you're pitching",
    channel: "Channel",
    tone: "Tone",
    goal: "Goal",
    generate: "Generate scripts",
    generating: "Generating…",
    results: "Script variants",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    subject: "Subject",
    errorGeneric: "Something went wrong. Please try again.",
    errorConfig: "LLM is not configured. Set LLM_API_KEY in .env.local.",
    emptyState: "Your generated scripts will appear here.",
    channels: {
      email: "Email",
      linkedin: "LinkedIn DM",
      sms: "SMS",
      phone: "Phone",
    } satisfies Record<Channel, string>,
    tones: {
      professional: "Professional",
      friendly: "Friendly",
      direct: "Direct",
    } satisfies Record<Tone, string>,
    goals: {
      first_touch: "First touch",
      follow_up: "Follow-up",
      objection: "Objection handling",
      meeting_ask: "Meeting ask",
    } satisfies Record<Goal, string>,
    footer: "MVP · Free API keys via Groq or Gemini · No data stored",
  },
  zh: {
    title: "SalesScript AI",
    subtitle: "粘贴客户线索 → 几秒生成触达 / 跟进 / 异议处理话术。",
    leadNotes: "线索 / 客户备注",
    leadNotesHint: "对方是谁、说过什么、痛点、上次沟通…",
    leadNotesRequired: "请填写线索备注。",
    productOffer: "产品 / 方案",
    productOfferHint: "可选 — 你要推销的内容",
    channel: "渠道",
    tone: "语气",
    goal: "目标",
    generate: "生成话术",
    generating: "生成中…",
    results: "话术方案",
    copy: "复制",
    copied: "已复制！",
    download: "下载",
    subject: "主题",
    errorGeneric: "出错了，请重试。",
    errorConfig: "未配置 LLM。请在 .env.local 中设置 LLM_API_KEY。",
    emptyState: "生成的话术将显示在这里。",
    channels: {
      email: "邮件",
      linkedin: "LinkedIn 私信",
      sms: "短信",
      phone: "电话",
    } satisfies Record<Channel, string>,
    tones: {
      professional: "专业",
      friendly: "友好",
      direct: "直接",
    } satisfies Record<Tone, string>,
    goals: {
      first_touch: "首次触达",
      follow_up: "跟进",
      objection: "异议处理",
      meeting_ask: "约会议",
    } satisfies Record<Goal, string>,
    footer: "MVP · 可用 Groq / Gemini 免费 API · 不存储数据",
  },
} as const;

export type Copy = (typeof copy)[Lang];

export function t(lang: Lang): Copy {
  return copy[lang];
}

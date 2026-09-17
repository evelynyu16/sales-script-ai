export type Channel = "email" | "linkedin" | "sms" | "phone";
export type Tone = "professional" | "friendly" | "direct";
export type Goal = "first_touch" | "follow_up" | "objection" | "meeting_ask";
export type Lang = "en" | "zh";

export interface GenerateRequest {
  leadNotes: string;
  productOffer?: string;
  channel: Channel;
  tone: Tone;
  goal: Goal;
  lang: Lang;
}

export interface ScriptVariant {
  label: string;
  subject?: string;
  body: string;
}

export interface GenerateResponse {
  variants: ScriptVariant[];
}

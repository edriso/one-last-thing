import { z } from 'zod';

export const ACCENTS = ['#c98a5c', '#b98a9a', '#8a9ab0', '#9a9a7e'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  tidySecs: z.number().int().min(30).max(180),
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  /** Tomorrow's one intention, keyed by the day it was set (a date string). */
  intentionsByDay: z.record(z.string(), z.string()),
});
export type PersistedState = z.infer<typeof persistedStateSchema>;

/** The ritual's phase. */
export type Phase = 'intro' | 'tidy' | 'intention' | 'done';

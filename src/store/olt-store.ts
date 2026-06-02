import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Accent, Settings } from '@/types/domain';

interface OltState {
  settings: Settings;
  intentionsByDay: Record<string, string>;
  saveIntention: (dayKey: string, text: string) => void;
  setTidySecs: (n: number) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useOltStore = create<OltState>((set) => ({
  settings: initial.settings,
  intentionsByDay: initial.intentionsByDay,
  saveIntention: (dayKey, text) =>
    set({ intentionsByDay: repository.setIntention(dayKey, text).intentionsByDay }),
  setTidySecs: (tidySecs) => set({ settings: repository.setSettings({ tidySecs }).settings }),
  setAccent: (accent) => set({ settings: repository.setSettings({ accent }).settings }),
}));

import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  } as Storage;
}

describe('repository', () => {
  let repo: Repository;
  let storage: Storage;
  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });

  it('returns defaults when empty', () => {
    expect(repo.getState().settings.tidySecs).toBe(60);
    expect(repo.getState().intentionsByDay).toEqual({});
  });
  it('falls back to defaults on corrupt or wrong-shape data', () => {
    storage.setItem('olt-v1', 'nope');
    expect(repo.getState().settings.accent).toBe('#c98a5c');
    storage.setItem('olt-v1', JSON.stringify({ version: 1, settings: { tidySecs: 999 } }));
    expect(repo.getState().settings.tidySecs).toBe(60);
  });
  it('saves an intention per day and round-trips settings', () => {
    repo.setIntention('Mon Mar 09 2026', 'call the dentist');
    expect(repo.getState().intentionsByDay['Mon Mar 09 2026']).toBe('call the dentist');
    repo.setSettings({ tidySecs: 90 });
    expect(repo.getState().settings.tidySecs).toBe(90);
  });
});

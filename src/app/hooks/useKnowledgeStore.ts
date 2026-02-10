'use client';

type KnowledgeStore = {
  regions: Record<string, unknown>;
  myths: Record<string, unknown>;
};

const KEY = 'tethys_knowledge_v1';

export function loadKnowledge(): KnowledgeStore {
  if (typeof window === 'undefined') return { regions: {}, myths: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { regions: {}, myths: {} };
    return JSON.parse(raw) ?? { regions: {}, myths: {} };
  } catch {
    return { regions: {}, myths: {} };
  }
}

export function saveKnowledge(data: KnowledgeStore) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}
// World of Tethys || D.C. Barletta

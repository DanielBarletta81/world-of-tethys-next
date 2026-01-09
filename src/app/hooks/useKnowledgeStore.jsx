'use client';

const KEY = 'tethys_knowledge_v1';

export function loadKnowledge() {
  if (typeof window === 'undefined') return { regions: {}, myths: {} };
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { regions: {}, myths: {} };
  } catch {
    return { regions: {}, myths: {} };
  }
}

export function saveKnowledge(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}
// World of Tethys || D.C. Barletta

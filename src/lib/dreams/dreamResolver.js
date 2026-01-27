// Dream resolver (JS version) — decides if a dream should trigger locally.
export function shouldDream({ stillness = 0, idleMinutes = 0, path = "mystic", lastDreamAt }) {
  if (stillness < 0.85) return false;
  if (idleMinutes < 6) return false;
  if (path === "city") return false;

  const cooldownMinutes = path === "mystic" ? 12 * 60 : 24 * 60;
  if (lastDreamAt && Date.now() - lastDreamAt < cooldownMinutes * 60 * 1000) return false;

  const chance = path === "mystic" ? 0.6 : 0.25;
  return Math.random() < chance;
}

export function getDreamCooldownMinutes(path = "mystic") {
  return path === "mystic" ? 12 * 60 : 24 * 60;
}

// World of Tethys || D.C. Barletta

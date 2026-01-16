import { bffFetch } from './bff';

export async function fetchPlayerBootstrap() {
  return bffFetch('/api/player/bootstrap');
}

export async function savePlayerSnapshot(payload) {
  return bffFetch('/api/player/snapshot', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function logPlayerEvent(event) {
  return bffFetch('/api/player/events', {
    method: 'POST',
    body: JSON.stringify(event)
  });
}

export async function logPlayerRumor(entry) {
  return bffFetch('/api/player/rumors', {
    method: 'POST',
    body: JSON.stringify(entry)
  });
}

export async function logPlayerDaily(entry) {
  return bffFetch('/api/player/daily', {
    method: 'POST',
    body: JSON.stringify(entry)
  });
}

export async function upsertPlayerCreature(creature) {
  return bffFetch('/api/player/creatures', {
    method: 'POST',
    body: JSON.stringify(creature)
  });
}

export async function deletePlayerCreature(creatureId) {
  return bffFetch(`/api/player/creatures/${creatureId}`, {
    method: 'DELETE'
  });
}

export async function fetchStarterTemplate(templateId) {
  const params = templateId ? `?templateId=${encodeURIComponent(templateId)}` : '';
  return bffFetch(`/api/templates/starter${params}`);
}

export async function fetchPlayerProfile() {
  return bffFetch('/api/player/profile');
}

export async function fetchPlayerEvents(limit = 100) {
  return bffFetch(`/api/player/events?limit=${encodeURIComponent(limit)}`);
}

export async function fetchPlayerRumors(limit = 100) {
  return bffFetch(`/api/player/rumors?limit=${encodeURIComponent(limit)}`);
}

export async function fetchPlayerDaily(limit = 30) {
  return bffFetch(`/api/player/daily?limit=${encodeURIComponent(limit)}`);
}

export async function fetchPlayerDailyByDate(dateKey) {
  return bffFetch(`/api/player/daily?date=${encodeURIComponent(dateKey)}`);
}

export async function fetchPlayerCreatures(limit = 200) {
  return bffFetch(`/api/player/creatures?limit=${encodeURIComponent(limit)}`);
}

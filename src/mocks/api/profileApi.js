import { profiles } from '../data/profiles';
import { intentStates } from '../data/intentStates';
import { withMockDelay } from './config';

export async function getProfileBySlug(slug) {
  return withMockDelay(profiles.find((profile) => profile.slug === slug) || null);
}

export async function updateProfile(profileId, patch) {
  return withMockDelay({ id: profileId, ...patch });
}

export async function createIntentState(payload) {
  return withMockDelay({ id: `intent_${intentStates.length + 1}`, ...payload });
}

export async function updateIntentState(id, patch) {
  return withMockDelay({ id, ...patch });
}

export async function getProfileIntentStates(slug) {
  const profile = profiles.find((entry) => entry.slug === slug);
  if (!profile) return withMockDelay([]);
  return withMockDelay(intentStates.filter((intent) => intent.profileId === profile.id && intent.isActive));
}

export async function addIntentPrompt(intentStateId, prompt) {
  return withMockDelay({ intentStateId, prompt: { id: `prompt_${Date.now()}`, text: prompt } });
}

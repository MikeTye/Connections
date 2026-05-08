import { profiles } from '../data/profiles';
import { intentStates } from '../data/intentStates';
import { withMockDelay } from './config';

export async function discoverProfiles(filters = {}) {
  const { cityRegion, interests = [], intentType } = filters;

  const cards = profiles
    .filter((profile) => profile.discoverable)
    .filter((profile) => (!cityRegion ? true : profile.cityRegion === cityRegion))
    .filter((profile) => (interests.length ? interests.every((i) => profile.interests.includes(i)) : true))
    .filter((profile) => {
      if (!intentType) return true;
      return intentStates.some((intent) => intent.profileId === profile.id && intent.intentType === intentType && intent.isActive);
    })
    .map((profile) => ({ id: profile.id, slug: profile.slug, headline: profile.headline, cityRegion: profile.cityRegion }));

  return withMockDelay(cards);
}

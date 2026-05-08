import { shareLinks } from '../data/shareLinks';
import { withMockDelay } from './config';

export async function listShareLinks(profileId) {
  return withMockDelay(shareLinks.filter((link) => link.profileId === profileId));
}

export async function createShareLink(payload) {
  return withMockDelay({ id: `link_${shareLinks.length + 1}`, viewCount: 0, revokedAt: null, ...payload });
}

export async function revokeShareLink(linkId) {
  return withMockDelay({ id: linkId, revokedAt: new Date().toISOString() });
}

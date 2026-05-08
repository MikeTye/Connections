import { introRequests } from '../data/introRequests';
import { withMockDelay } from './config';

export async function submitStructuredIntro(payload) {
  return withMockDelay({ id: `intro_${introRequests.length + 1}`, status: 'pending', ...payload });
}

export async function getIntroInbox(targetProfileId) {
  return withMockDelay(introRequests.filter((intro) => intro.targetProfileId === targetProfileId));
}

export async function updateIntroStatus(introId, status) {
  return withMockDelay({ id: introId, status });
}

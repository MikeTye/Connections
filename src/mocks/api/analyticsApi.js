import { analytics } from '../data/analytics';
import { withMockDelay } from './config';

export async function getProfileAnalytics(profileId) {
  return withMockDelay(analytics[profileId] || { profileId, totals: {}, byIntentState: [] });
}

export async function trackAnalyticsEvent(event) {
  return withMockDelay({ ok: true, event });
}

export const shareSlugScenarios = [
  { id: 'friends-brunch', label: 'Friends Brunch', shareSlug: 'demo-share' },
  { id: 'hike-buddy', label: 'Hike Buddy', shareSlug: 'hike-sunday-crew' },
  { id: 'photo-walk', label: 'Photo Walk', shareSlug: 'city-photo-walk' },
];

export const defaultShareSlug = shareSlugScenarios[0].shareSlug;

export function hasShareSlug(shareSlug) {
  return shareSlugScenarios.some((scenario) => scenario.shareSlug === shareSlug);
}

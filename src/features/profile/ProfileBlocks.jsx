import { Card, TagCluster, Avatar } from '../../components/primitives';

export const DEMO_PROFILE = {
  name: 'Aisha Razali',
  initials: 'AR',
  location: 'Bangsar, KL',
  bio: "Slow mornings, strong coffee, and people who still write things down.",
  interests: ['Analogue photography', 'Cooking for people', 'Jazz', 'Long walks'],
  values: ['Honesty over politeness', 'Curiosity', 'Depth over breadth'],
};

export function ProfileHeader({ profile = DEMO_PROFILE }) {
  return (
    <div className="profile-header">
      <Avatar initials={profile.initials} size="lg" />
      <div>
        <h1 className="profile-header__name">{profile.name}</h1>
        <p className="profile-header__location">📍 {profile.location}</p>
      </div>
    </div>
  );
}

export function ProfileAbout({ profile = DEMO_PROFILE }) {
  return (
    <Card tone="warm" className="card--profile-section">
      <h3>A little about</h3>
      <p>{profile.bio}</p>
      <h3>Interests</h3>
      <TagCluster items={profile.interests} tone="sage" />
      <h3>Values</h3>
      <TagCluster items={profile.values} tone="warm" />
    </Card>
  );
}

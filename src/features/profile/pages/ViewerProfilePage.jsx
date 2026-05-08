import { useNavigate, useParams } from 'react-router-dom';
import { ProfileHeader, ProfileAbout } from '../ProfileBlocks';

export default function ViewerProfilePage() {
  const { shareSlug } = useParams();
  const navigate = useNavigate();

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <ProfileHeader />
      <ProfileAbout />
      <p>Viewing shared profile link: {shareSlug}</p>
      <button type="button" onClick={() => navigate(`/intro/${shareSlug}/collab-intent`)}>
        Continue to intro
      </button>
    </main>
  );
}

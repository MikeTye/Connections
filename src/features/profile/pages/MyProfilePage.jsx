import { useNavigate } from 'react-router-dom';
import { ProfileHeader, ProfileAbout } from '../ProfileBlocks';

export default function MyProfilePage() {
  const navigate = useNavigate();
  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <ProfileHeader />
      <ProfileAbout />
      <div style={{ marginTop: 16 }}>
        <button type="button" onClick={() => navigate('/profile/edit')}>Edit profile</button>
      </div>
    </main>
  );
}

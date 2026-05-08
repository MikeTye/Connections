import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_PROFILE, ProfileHeader, ProfileAbout } from '../ProfileBlocks';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [bio, setBio] = useState(DEMO_PROFILE.bio);

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <ProfileHeader profile={{ ...DEMO_PROFILE, bio }} />
      <div style={{ margin: '12px 0' }}>
        <label>Bio</label>
        <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <ProfileAbout profile={{ ...DEMO_PROFILE, bio }} />
      <button type="button" onClick={() => navigate('/profile/me')}>Save</button>
    </main>
  );
}

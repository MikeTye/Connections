import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canContinue = email.trim() && password.trim();

  return (
    <main className="container" style={{ maxWidth: 520, padding: '3rem 1rem' }}>
      <h1>Sign up</h1>
      <p>Demo mode: any non-empty email and password works.</p>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <label>Password</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
      <button type="button" disabled={!canContinue} onClick={() => navigate('/onboarding')}>
        Continue
      </button>
    </main>
  );
}

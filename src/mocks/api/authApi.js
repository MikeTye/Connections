import { users } from '../data/users';
import { withMockDelay } from './config';

export async function signIn({ email, password }) {
  const user = users.find((entry) => entry.email === email && entry.password === password);
  if (!user) return withMockDelay({ ok: false, error: 'Invalid credentials' });
  return withMockDelay({ ok: true, token: `mock-token-${user.id}`, userId: user.id });
}

export async function signUp({ email, password }) {
  return withMockDelay({ ok: true, userId: `user_${users.length + 1}`, email, password });
}

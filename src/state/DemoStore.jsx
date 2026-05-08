import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'connections_demo_store_v1';

const defaultState = {
  currentUser: {
    id: 'user_demo_1',
    name: 'Demo User',
    email: 'demo@connections.app',
  },
  onboardingCompleted: false,
  createdShareLinks: [
    { id: 1, label: 'Product hunt follow-up', expiry: '24 hours', maxViews: '10', scope: 'Anyone with link', status: 'active' },
    { id: 2, label: 'Community volunteers', expiry: 'Expired', maxViews: 'Unlimited', scope: 'Mentors only', status: 'expired' },
    { id: 3, label: 'Angel intro packet', expiry: '3 days', maxViews: '5', scope: 'Investors only', status: 'revoked' },
  ],
  introRequests: [
    {
      id: 'req-1',
      from: 'Jordan Lee',
      intent: 'Collaboration',
      message: 'Loved your profile. Would love to chat about community-led product launches.',
      status: 'pending',
      createdAt: '2026-05-06',
    },
    {
      id: 'req-2',
      from: 'Nia Patel',
      intent: 'Friendship',
      message: 'You seem thoughtful and grounded. Open to a low-key coffee chat?',
      status: 'pending',
      createdAt: '2026-05-05',
    },
  ],
  analytics: {
    open: 380,
    view: 265,
    intro: 92,
    decision: 34,
    accepted: 0,
    declined: 0,
  },
};

function loadState() {
  if (typeof window === 'undefined') return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

const DemoStoreContext = createContext(null);

export function DemoStoreProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => ({
    state,
    completeOnboarding() {
      setState((prev) => ({ ...prev, onboardingCompleted: true }));
    },
    createShareLink(link) {
      setState((prev) => ({ ...prev, createdShareLinks: [{ id: Date.now(), ...link, status: 'active' }, ...prev.createdShareLinks] }));
    },
    revokeShareLink(id) {
      setState((prev) => ({
        ...prev,
        createdShareLinks: prev.createdShareLinks.map((link) => (link.id === id ? { ...link, status: 'revoked' } : link)),
      }));
    },
    submitIntro(request) {
      setState((prev) => ({
        ...prev,
        introRequests: [request, ...prev.introRequests],
        analytics: { ...prev.analytics, intro: prev.analytics.intro + 1 },
      }));
    },
    updateIntroStatus(id, status) {
      setState((prev) => {
        const nextAnalytics = { ...prev.analytics };
        if (status === 'accept') {
          nextAnalytics.accepted += 1;
          nextAnalytics.decision += 1;
        }
        if (status === 'decline') {
          nextAnalytics.declined += 1;
          nextAnalytics.decision += 1;
        }
        return {
          ...prev,
          introRequests: prev.introRequests.map((item) => (item.id === id ? { ...item, status } : item)),
          analytics: nextAnalytics,
        };
      });
    },
  }), [state]);

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error('useDemoStore must be used within DemoStoreProvider');
  return ctx;
}

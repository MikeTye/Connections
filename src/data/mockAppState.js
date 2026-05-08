const INBOX_KEY = 'connections_demo_inbox';

const defaultInbox = [
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
];

function readInbox() {
  if (typeof window === 'undefined') return defaultInbox;
  const raw = window.localStorage.getItem(INBOX_KEY);
  if (!raw) return defaultInbox;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultInbox;
  } catch {
    return defaultInbox;
  }
}

function writeInbox(next) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(INBOX_KEY, JSON.stringify(next));
  }
}

export function getInboxItems() {
  return readInbox();
}

export function addInboxItem(item) {
  const next = [item, ...readInbox()];
  writeInbox(next);
  return next;
}

export function updateInboxItemStatus(id, status) {
  const next = readInbox().map((item) => (item.id === id ? { ...item, status } : item));
  writeInbox(next);
  return next;
}

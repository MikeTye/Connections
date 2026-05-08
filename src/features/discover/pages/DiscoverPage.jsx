import { useMemo, useState } from 'react';
import { AppShell, Card, SectionHeader, TagCluster } from '../../../components/primitives';

const people = [
  { id: 1, name: 'Ari M.', city: 'San Francisco', interests: ['Design systems', 'AI tools'], intent: 'Mentorship', email: 'hidden', phone: 'hidden' },
  { id: 2, name: 'Jordan R.', city: 'Austin', interests: ['Climate', 'Community events'], intent: 'Friendship', email: 'hidden', phone: 'hidden' },
  { id: 3, name: 'Nina K.', city: 'New York', interests: ['Fintech', 'Running'], intent: 'Dating', email: 'hidden', phone: 'hidden' },
];

export default function DiscoverPage() {
  const [filters, setFilters] = useState({ city: '', interests: '', intent: '' });

  const filtered = useMemo(
    () => people.filter((p) =>
      (!filters.city || p.city === filters.city)
      && (!filters.intent || p.intent === filters.intent)
      && (!filters.interests || p.interests.join(' ').toLowerCase().includes(filters.interests.toLowerCase()))),
    [filters],
  );

  return (
    <AppShell>
      <section className="section section--sm">
        <div className="container">
          <SectionHeader title="Discover" subtitle="Minimal cards protect sensitive data until both sides opt in." />
          <Card tone="canvas-mid" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <select className="input" value={filters.city} onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}><option value="">All cities</option><option>San Francisco</option><option>Austin</option><option>New York</option></select>
              <input className="input" value={filters.interests} onChange={(e) => setFilters((f) => ({ ...f, interests: e.target.value }))} placeholder="Interests keyword" />
              <select className="input" value={filters.intent} onChange={(e) => setFilters((f) => ({ ...f, intent: e.target.value }))}><option value="">All intents</option><option>Mentorship</option><option>Friendship</option><option>Dating</option></select>
            </div>
          </Card>
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.map((person) => (
              <Card key={person.id} tone="tinted" style={{ padding: 16 }}>
                <h3 className="display display--h4" style={{ marginTop: 0 }}>{person.name}</h3>
                <p className="body-sm">{person.city} · Intent: {person.intent}</p>
                <TagCluster items={person.interests} />
                <p className="body-xs" style={{ marginTop: 8 }}>Email: {person.email} · Phone: {person.phone}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

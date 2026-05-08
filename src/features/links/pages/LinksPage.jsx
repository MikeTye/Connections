import { useMemo, useState } from 'react';
import { AppShell, Card, Pill, SectionHeader } from '../../../components/primitives';
import { useDemoStore } from '../../../state/DemoStore';

const defaultDraft = {
  label: 'Conference profile',
  expiry: '7 days',
  maxViews: '25',
  scope: 'Recruiters only',
};

export default function LinksPage() {
  const [draft, setDraft] = useState(defaultDraft);
  const { state, createShareLink, revokeShareLink } = useDemoStore();
  const links = state.createdShareLinks;
  const statusVariant = useMemo(() => ({ active: 'live', expired: 'muted', revoked: 'warm' }), []);

  const createLink = () => {
    createShareLink(draft);
    setDraft(defaultDraft);
  };

  return (
    <AppShell>
      <section className="section section--sm">
        <div className="container">
          <SectionHeader title="Share Links" subtitle="Create single-use profile link cards with UI-only controls for expiry, max views, and audience scope." />
          <Card tone="canvas-mid" className="stack-lg" style={{ padding: 20, marginBottom: 20 }}>
            <label className="label">Link label<input className="input" value={draft.label} onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))} /></label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <label className="label">Expiry<select className="input" value={draft.expiry} onChange={(e) => setDraft((d) => ({ ...d, expiry: e.target.value }))}><option>24 hours</option><option>3 days</option><option>7 days</option><option>Never</option></select></label>
              <label className="label">Max views<select className="input" value={draft.maxViews} onChange={(e) => setDraft((d) => ({ ...d, maxViews: e.target.value }))}><option>5</option><option>10</option><option>25</option><option>Unlimited</option></select></label>
              <label className="label">Scope<select className="input" value={draft.scope} onChange={(e) => setDraft((d) => ({ ...d, scope: e.target.value }))}><option>Anyone with link</option><option>Recruiters only</option><option>Investors only</option><option>Mentors only</option></select></label>
            </div>
            <button type="button" className="btn btn--accent-sm" onClick={createLink}>Create link card</button>
          </Card>

          <div style={{ display: 'grid', gap: 12 }}>
            {links.map((link) => (
              <Card key={link.id} tone="warm" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 className="display display--h4" style={{ margin: 0 }}>{link.label}</h3>
                  <Pill variant={statusVariant[link.status]}>{link.status}</Pill>
                </div>
                <p className="body-sm" style={{ marginBottom: 10 }}>Expiry: {link.expiry} · Max views: {link.maxViews} · Scope: {link.scope}</p>
                <button type="button" className="btn btn--ghost" onClick={() => revokeShareLink(link.id)} disabled={link.status === 'revoked'}>Revoke link</button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

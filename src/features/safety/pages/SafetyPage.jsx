import { useState } from 'react';
import { AppShell, Card, Pill, SectionHeader } from '../../../components/primitives';

export default function SafetyPage() {
  const [form, setForm] = useState({ target: '', reason: 'Harassment', notes: '' });
  const [reports, setReports] = useState([
    { id: 1, target: 'user_9183', reason: 'Spam', status: 'reviewing', timeline: ['Submitted', 'Auto-triaged', 'Under review'] },
  ]);

  const submitReport = (e) => {
    e.preventDefault();
    setReports((current) => [{ id: Date.now(), target: form.target, reason: form.reason, status: 'submitted', timeline: ['Submitted'] }, ...current]);
    setForm({ target: '', reason: 'Harassment', notes: '' });
  };

  return (
    <AppShell>
      <section className="section section--sm">
        <div className="container">
          <SectionHeader title="Safety" subtitle="Report behavior, track status updates, and monitor blocked user notices." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card tone="canvas-mid" style={{ padding: 16 }}>
              <h3 className="display display--h4">Submit report</h3>
              <form onSubmit={submitReport} className="stack-md">
                <input className="input" placeholder="User ID or link" value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))} required />
                <select className="input" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}><option>Harassment</option><option>Spam</option><option>Impersonation</option></select>
                <textarea className="textarea" rows={3} placeholder="Optional details" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                <button className="btn btn--accent-sm" type="submit">Send report</button>
              </form>
            </Card>

            <Card tone="tinted" style={{ padding: 16 }}>
              <h3 className="display display--h4">Blocked user notice</h3>
              <p className="body-sm">You blocked <strong>@noisy_dm_bot</strong>. This user can no longer view your profile, send intros, or appear in Discover.</p>
              <p className="body-xs">To restore contact, remove them from your blocked list in Settings.</p>
            </Card>
          </div>

          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            {reports.map((report) => (
              <Card key={report.id} tone="warm" style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p className="body-md" style={{ margin: 0 }}>Report on {report.target} · {report.reason}</p>
                  <Pill variant={report.status === 'reviewing' ? 'live' : 'muted'}>{report.status}</Pill>
                </div>
                <ol>
                  {report.timeline.map((item) => <li key={item} className="body-sm">{item}</li>)}
                </ol>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

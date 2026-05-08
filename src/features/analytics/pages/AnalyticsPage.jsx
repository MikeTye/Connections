import { AppShell, Card, SectionHeader } from '../../../components/primitives';

const funnel = [
  { label: 'Open', value: 380 },
  { label: 'View', value: 265 },
  { label: 'Intro', value: 92 },
  { label: 'Decision', value: 34 },
];

const intentRows = [
  { intent: 'Mentorship', opens: 102, intros: 37, decisions: 15 },
  { intent: 'Friendship', opens: 156, intros: 31, decisions: 11 },
  { intent: 'Dating', opens: 122, intros: 24, decisions: 8 },
];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <section className="section section--sm">
        <div className="container">
          <SectionHeader title="Analytics" subtitle="Mock aggregate performance for the intro funnel and intent-level outcomes." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 16 }}>
            {funnel.map((step) => (
              <Card key={step.label} tone="canvas-mid" style={{ padding: 16 }}>
                <p className="body-sm" style={{ marginTop: 0 }}>{step.label}</p>
                <p className="display display--h2" style={{ marginBottom: 0 }}>{step.value}</p>
              </Card>
            ))}
          </div>

          <Card tone="tinted" style={{ padding: 16 }}>
            <h3 className="display display--h4">Intent performance</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th align="left">Intent</th><th align="right">Open</th><th align="right">Intro</th><th align="right">Decision</th></tr>
              </thead>
              <tbody>
                {intentRows.map((row) => (
                  <tr key={row.intent}>
                    <td>{row.intent}</td><td align="right">{row.opens}</td><td align="right">{row.intros}</td><td align="right">{row.decisions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

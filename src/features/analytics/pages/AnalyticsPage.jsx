import { AppShell, Card, SectionHeader } from '../../../components/primitives';
import { useDemoStore } from '../../../state/DemoStore';

export default function AnalyticsPage() {
  const { state } = useDemoStore();
  const funnel = [
    { label: 'Open', value: state.analytics.open },
    { label: 'View', value: state.analytics.view },
    { label: 'Intro', value: state.analytics.intro },
    { label: 'Decision', value: state.analytics.decision },
  ];

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
            <h3 className="display display--h4">Decision outcomes</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr><th align="left">Status</th><th align="right">Count</th></tr>
              </thead>
              <tbody>
                <tr><td>Accepted</td><td align="right">{state.analytics.accepted}</td></tr>
                <tr><td>Declined</td><td align="right">{state.analytics.declined}</td></tr>
              </tbody>
            </table>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

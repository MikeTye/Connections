import { useDemoStore } from '../../../state/DemoStore';

const actions = ['accept', 'decline', 'ignore', 'block', 'report'];

export default function InboxPage() {
  const { state, updateIntroStatus } = useDemoStore();

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Inbox queue</h1>
      {state.introRequests.map((item) => (
        <article key={item.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <strong>{item.from}</strong> · <span>{item.intent}</span>
          <p>{item.message}</p>
          <small>Status: {item.status}</small>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {actions.map((a) => (
              <button key={a} type="button" onClick={() => updateIntroStatus(item.id, a)}>{a}</button>
            ))}
          </div>
        </article>
      ))}
    </main>
  );
}

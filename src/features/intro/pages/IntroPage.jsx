import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDemoStore } from '../../../state/DemoStore';

const fields = [
  { id: 'who', label: 'Who are you?', placeholder: 'Your name + context' },
  { id: 'why', label: 'Why do you want to connect?', placeholder: 'Share intent clearly' },
  { id: 'next', label: 'Best next step', placeholder: 'How should they respond?' },
];

export default function IntroPage() {
  const { shareSlug, intentId } = useParams();
  const navigate = useNavigate();
  const { submitIntro } = useDemoStore();
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const isValid = useMemo(() => fields.every((f) => (form[f.id] || '').trim()), [form]);

  const onSubmit = () => {
    if (!isValid) return;
    submitIntro({
      id: `req-${Date.now()}`,
      from: form.who,
      intent: intentId,
      message: form.why,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="container" style={{ maxWidth: 640, padding: '2rem 1rem' }}>
        <h1>Intro sent</h1>
        <p>Your message was sent successfully for {shareSlug}.</p>
        <button type="button" onClick={() => navigate('/inbox')}>Go to inbox demo</button>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 640, padding: '2rem 1rem' }}>
      <h1>Structured intro</h1>
      <p>Intent: {intentId}</p>
      {fields.map((f) => (
        <div key={f.id} style={{ marginBottom: 12 }}>
          <label>{f.label}</label>
          <textarea
            rows={3}
            value={form[f.id] || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, [f.id]: e.target.value }))}
            placeholder={f.placeholder}
          />
        </div>
      ))}
      <button type="button" disabled={!isValid} onClick={onSubmit}>Submit intro</button>
    </main>
  );
}

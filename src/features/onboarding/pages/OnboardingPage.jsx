import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../../state/DemoStore';

const sections = [
  { id: 'identity', title: 'Identity', fields: ['Name', 'Location', 'Current role'] },
  { id: 'intent', title: 'Intent', fields: ['What are you here for?', 'Who do you want to meet?'] },
  { id: 'boundaries', title: 'Boundaries', fields: ['Hard no items', 'Preferred response time'] },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState({});
  const { completeOnboarding } = useDemoStore();

  return (
    <main className="container" style={{ maxWidth: 760, padding: '2rem 1rem' }}>
      <h1>Onboarding wireframe</h1>
      <p>Fill in what you want now, edit later anytime.</p>
      {sections.map((section) => (
        <section key={section.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>{section.title}</h2>
          {section.fields.map((field) => {
            const key = `${section.id}-${field}`;
            return (
              <div key={key} style={{ marginBottom: 12 }}>
                <label>{field}</label>
                <input
                  value={draft[key] || ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Enter ${field.toLowerCase()}`}
                />
              </div>
            );
          })}
        </section>
      ))}
      <button type="button" onClick={() => { completeOnboarding(); navigate('/profile/me'); }}>Save & Continue</button>
    </main>
  );
}

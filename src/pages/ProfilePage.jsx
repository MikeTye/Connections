import { useState } from 'react';
import DemoNav from '../components/DemoNav';
import { AppShell, Topbar, Card, TagCluster, Avatar, EmptyState } from '../components/primitives';

const PROFILE = {
  name: 'Aisha Razali',
  initials: 'AR',
  location: 'Bangsar, KL',
  bio: "Slow mornings, strong coffee, and people who still write things down. I moved back to KL two years ago and I'm still figuring out what home means here.",
  interests: ['Analogue photography', 'Cooking for people', 'Jazz', 'Long walks', 'Bookshops', 'Night markets'],
  values: ['Honesty over politeness', 'Curiosity', 'Depth over breadth'],
  endorsements: [
    { name: 'Farah M.',  context: 'Friend since 2018',              text: 'Aisha will make you feel heard before you finish your sentence.' },
    { name: 'Dev K.',    context: 'Met at a photography workshop',   text: 'Genuinely curious about people. Rare quality.' },
  ],
  capsule: {
    type: 'friendship',
    label: 'Friendship',
    title: 'Looking for people to explore Bangsar with',
    description: "Food-first. No agenda. I want to find the spots that aren't on any list yet. If you know a good char kway teow place that only locals know about, we should talk.",
    prompts: [
      'What does a perfect low-key evening look like for you?',
      "What's a place in KL you think is underrated?",
    ],
  },
  stats: { connections: 12, responseTime: '~4 hrs' },
};

function PromptStep({ prompts, onSubmit }) {
  const [answers, setAnswers] = useState(prompts.map(() => ''));
  const allFilled = answers.every(a => a.trim().length > 0);

  const setAnswer = (i, val) => {
    const next = [...answers];
    next[i] = val;
    setAnswers(next);
  };

  return (
    <div className="form-group">
      {prompts.map((q, i) => (
        <div key={i}>
          <label className="prompt-label">{q}</label>
          <textarea
            className="form-textarea"
            value={answers[i]}
            onChange={e => setAnswer(i, e.target.value)}
            rows={3}
            placeholder="Your answer..."
          />
        </div>
      ))}
      <button
        className="btn btn--submit"
        onClick={() => allFilled && onSubmit(answers)}
        disabled={!allFilled}
      >
        Submit request to connect
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [step, setStep] = useState('partial'); // partial | prompts | submitted
  const p = PROFILE;

  return (
    <AppShell>
      <DemoNav />

      {/* Topbar */}
      <Topbar left={<div className="nav__brand">
          <div className="nav__dot" style={{ width: 7, height: 7 }} />
          <span className="nav__wordmark" style={{ fontSize: 'var(--text-md)' }}>SIGNAL</span>
        </div>} right={<span className="topbar__timer">
          <span className="topbar__timer-dot" />
          Link expires in 2h 41m
        </span>} />

      {/* Main content */}
      <div className="container container--profile" style={{ padding: 'var(--space-10) var(--space-6) var(--space-20)' }}>

        {/* Profile header */}
        <div className="profile-header">
          <Avatar initials={p.initials} size="lg" />
          <div>
            <h1 className="profile-header__name">{p.name}</h1>
            <p className="profile-header__location">📍 {p.location}</p>
          </div>
        </div>

        {/* Active capsule */}
        <div className={`active-capsule active-capsule--${p.capsule.type}`}>
          <div className="active-capsule__badge">
            ◎ Active capsule · {p.capsule.label}
          </div>
          <h2 className="active-capsule__title">{p.capsule.title}</h2>
          <p className="active-capsule__body">{p.capsule.description}</p>
        </div>

        {/* Partial profile — always shown */}
        <Card tone="warm" className="card--profile-section" >

          <h3 className="card__section-label card__section-label--accent" style={{ marginBottom: 'var(--space-3)' }}>
            A little about
          </h3>
          <p className="body-lg body-on-warm" style={{ marginBottom: 'var(--space-5)' }}>{p.bio}</p>

          <h3 className="card__section-label card__section-label--muted" style={{ marginBottom: 'var(--space-2) + 2px', marginBottom: 10 }}>
            Interests
          </h3>
          <TagCluster items={p.interests} tone="sage" className="cluster--mb-lg" />

          <h3 className="card__section-label card__section-label--muted" style={{ marginBottom: 10 }}>
            Values
          </h3>
          <TagCluster items={p.values} tone="warm" />
        </Card>

        {/* Endorsements */}
        <div className="card--lavender" style={{ marginBottom: 'var(--space-8)' }}>
          <h3 className="card__section-label card__section-label--lavender" style={{ marginBottom: 'var(--space-3) + 2px', marginBottom: 14 }}>
            {step === 'partial'
              ? `${p.endorsements.length} endorsements`
              : 'What people say'}
          </h3>

          {step !== 'partial' ? (
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {p.endorsements.map((e, i) => (
                <div key={i} className="endorsement">
                  <p className="endorsement__quote">"{e.text}"</p>
                  <span className="endorsement__attr">{e.name} · {e.context}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="body-md" style={{ color: 'var(--color-lavender)' }}>
              Connect to read what people say about {p.name.split(' ')[0]}.
            </p>
          )}
        </div>

        {/* ── Interaction zone ──────────────────── */}

        {step === 'partial' && (
          <div className="card--dark">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2 className="display display--h4" style={{ color: 'var(--color-on-dark)', marginBottom: 'var(--space-2) + 2px', marginBottom: 10 }}>
                Want to connect?
              </h2>
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)', color: 'var(--color-on-dark-muted)' }}>
                {p.name.split(' ')[0]} has {p.capsule.prompts.length} questions for you first. Answer them honestly — she reads every response.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <button className="btn btn--accent-sm" onClick={() => setStep('prompts')}>
                Answer her prompts →
              </button>
              <button className="btn btn--ghost">
                Not for me
              </button>
            </div>
          </div>
        )}

        {step === 'prompts' && (
          <div className="card card--warm" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-3xl)' }}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2) + 2px', gap: 10, marginBottom: 'var(--space-2) + 2px', marginBottom: 10 }}>
                <Avatar initials={p.initials} size="sm" />
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-medium)', color: 'var(--color-ink-900)' }}>
                  {p.name.split(' ')[0]}'s prompts
                </span>
              </div>
              <p className="meta">
                She'll read your answers before deciding. Be yourself — that's the whole point.
              </p>
            </div>
            <PromptStep
              prompts={p.capsule.prompts}
              onSubmit={() => setStep('submitted')}
            />
          </div>
        )}

        {step === 'submitted' && (
          <Card tone="confirm">
            <EmptyState
              title="Request sent."
              description={`${p.name.split(' ')[0]} typically responds in ${p.stats.responseTime}. If she accepts, you'll get her contact details and her full profile.`}
            />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-confirm-quiet)', margin: 0 }}>
              No app to install. We'll reach you by email.
            </p>
          </Card>
        )}

      </div>

    </AppShell>
  );
}

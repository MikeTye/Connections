import { useState, useEffect, useRef } from 'react';
import DemoNav from '../components/DemoNav';
import { AppShell, Pill, Avatar } from '../components/primitives';
import DemoQRScanner from '../components/DemoQRScanner';

const STATS = [
    { value: '6 in 10', label: 'people say they struggle to make meaningful new connections after 30' },
    { value: '73%', label: 'say most social apps make them feel worse about themselves, not better' },
    { value: '3 hrs', label: 'how long a Signal link stays open — then it expires, permanently' },
    { value: '0', label: 'ads, algorithms, or suggested friends. Ever.' },
    { value: '8 min', label: 'average time people spend writing a single capsule — because it matters' },
];

const HOW_IT_WORKS = [
    {
        number: '01', icon: '✦', title: 'Build your identity',
        body: 'Your profile is a microsite — rich, layered, and entirely yours. It is never visible by default. You decide what exists, and who deserves to see it.'
    },
    {
        number: '02', icon: '◎', title: 'Define your capsule',
        body: '"Looking for someone who loves slow mornings and Thai food." "Want a hiking partner who won\'t cancel." A capsule is what you\'re open to right now. Activate it. Deactivate it. It moves with you.'
    },
    {
        number: '03', icon: '⟡', title: 'Share a link — once',
        body: 'Generate a link tied to your capsule. It opens a 3-hour window, then it\'s gone. You share it with purpose — at a dinner, in a group chat, on a card — because that\'s the whole point.'
    },
    {
        number: '04', icon: '◈', title: 'They answer before they see',
        body: 'The viewer answers your capsule prompts before seeing anything. No browsing. No lurking. They declare their intent, you read it, then you decide.'
    },
    {
        number: '05', icon: '❋', title: 'You accept — or you don\'t',
        body: 'A notification arrives with their answers and what you have in common. You accept: they see your full profile and your chosen contact. You decline: that\'s it. Clean.'
    },
];

const PRINCIPLES = [
    { icon: '⊘', title: 'No discovery', body: 'There is no directory. No search. You cannot browse other people. You only arrive here if someone chose to bring you.' },
    { icon: '◎', title: 'No messaging', body: 'Once a connection is made, it lives off-platform. Signal does not want to be your inbox.' },
    { icon: '⟳', title: 'Ephemeral by design', body: 'Links expire. Capsules activate and deactivate. Nothing here is passive or permanent.' },
    { icon: '◈', title: 'Intent-gated', body: 'Every viewer must declare intent before they see anything. The prompt is the gate.' },
];

const CAPSULE_EXAMPLES = [
    { type: 'friendship', label: 'Friendship', text: 'Looking for someone to explore the night markets with. Good conversation required. Tourist traps optional.' },
    { type: 'dating', label: 'Dating', text: 'Chronically early, can\'t parallel park, will always share my dessert. Looking for someone who gets it.' },
    { type: 'interests', label: 'Interests', text: 'Amateur film photographer. Looking for people to do weekend photo walks around the old city.' },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setInView(true); obs.disconnect(); }
        }, { threshold: 0.12, ...options });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

// ── Components ────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

function StatTicker() {
    const [active, setActive] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setActive(i => (i + 1) % STATS.length), 4200);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="ticker">
            <div className="ticker__row">
                <span className="display display--stat">{STATS[active].value}</span>
                <p className="body-lg">{STATS[active].label}</p>
            </div>
            <div className="ticker__dots">
                {STATS.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`ticker__dot ${i === active ? 'ticker__dot--active' : ''}`}
                        style={{ width: i === active ? 28 : 7 }}
                        aria-label={`Stat ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

function SignupForm() {
    const [email, setEmail] = useState('');
    const [intent, setIntent] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const canSubmit = email && intent;

    if (submitted) {
        return (
            <div className="signup-confirmed">
                <div className="signup-confirmed__icon">✦</div>
                <div className="signup-confirmed__heading">You're on the list.</div>
                <p className="signup-confirmed__sub">
                    We'll reach out when your city opens.<br />Good things take a moment.
                </p>
            </div>
        );
    }

    return (
        <div className="form-group">
            <div>
                <label className="form-label">Your email</label>
                <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                />
            </div>
            <div>
                <label className="form-label">What are you hoping to find?</label>
                <select
                    className={`form-select ${!intent ? 'placeholder' : ''}`}
                    value={intent}
                    onChange={e => setIntent(e.target.value)}
                >
                    <option value="" disabled>Choose one</option>
                    <option value="friendship">Genuine friendships</option>
                    <option value="dating">Romantic connection</option>
                    <option value="interests">People who share my interests</option>
                    <option value="community">A community I actually belong to</option>
                </select>
            </div>
            <button
                className="btn btn--submit"
                onClick={() => canSubmit && setSubmitted(true)}
                disabled={!canSubmit}
            >
                Request early access
            </button>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
    return (
        <AppShell blobs>
            <DemoNav />

            {/* Ambient blobs */}

            {/* Nav */}
            <nav className="nav content-layer">
                <div className="nav__brand">
                    <div className="nav__dot" />
                    <span className="nav__wordmark">SIGNAL</span>
                </div>
                <a href="#signup" className="btn btn--dark">Get early access</a>
            </nav>

            {/* ── Hero ─────────────────────────────────── */}
            <section className="section content-layer" style={{ paddingBottom: 'var(--space-20)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-8)', alignItems: 'start' }}>

                    <div>
                        <Pill variant="live" dot className="pill--hero">Now open in Kuala Lumpur</Pill>

                        <h1 className="display display--hero" style={{ marginBottom: 'var(--space-7)' }}>
                            Meet people<br />
                            <em>on purpose.</em>
                        </h1>

                        <p className="body-lg" style={{ maxWidth: 520, marginBottom: 'var(--space-10)' }}>
                            Signal is a new kind of introduction layer. You share who you are and what you're open to. The other person answers before they see anything. You decide if they get in.
                        </p>

                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                            <a href="#signup" className="btn btn--primary">Join the waitlist</a>
                            <a href="#how" className="btn--quiet">How it works <span>↓</span></a>
                        </div>
                    </div>

                    {/* Floating teaser card */}
                    <div style={{ position: 'relative', paddingTop: 8 }}>
                        <div className="teaser-card">
                            <div className="teaser-card__header">
                                <Avatar initials="A" />
                                <div>
                                    <div className="teaser-card__name">Aisha</div>
                                    <div className="teaser-card__sub">Shared 3 interests with you</div>
                                </div>
                            </div>
                            <div className="teaser-card__capsule">
                                <span className="teaser-card__capsule-label">Open capsule</span>
                                <p className="teaser-card__capsule-text">Looking for people to explore Bangsar with. Food-first. No agenda.</p>
                            </div>
                            <div className="teaser-card__tags">
                                {['Cooking', 'Film', 'Jazz'].map(t => (
                                    <span key={t} className="tag tag--sage">{t}</span>
                                ))}
                            </div>
                        </div>
                        {/* Ghost card */}
                        <div className="teaser-card--ghost">
                            <div className="teaser-card--ghost__label">New request</div>
                            <p className="teaser-card--ghost__text">Someone wants to connect...</p>
                        </div>
                    </div>

                </div>
            </section>

            <section className="content-layer" style={{ padding: '0 var(--section-px)' }}>
                <div className="container" style={{ maxWidth: 560 }}>
                    <DemoQRScanner />
                </div>
            </section>

            {/* ── Stats Ticker ─────────────────────────── */}
            <section className="content-layer" style={{ padding: '0 var(--section-px)' }}>
                <StatTicker />
            </section>

            {/* ── How It Works ─────────────────────────── */}
            <section id="how" className="section content-layer">
                <div className="container container--prose">
                    <FadeIn>
                        <p className="label label--muted" style={{ marginBottom: 'var(--space-3)' }}>The flow</p>
                        <h2 className="display display--h2" style={{ marginBottom: 'var(--space-16)' }}>
                            Five steps between a link<br />and a real connection.
                        </h2>
                    </FadeIn>

                    {HOW_IT_WORKS.map((step, i) => (
                        <FadeIn key={step.number} delay={i * 0.08}>
                            <div className="step-row">
                                <div className="step-row__number">{step.number}</div>
                                <div>
                                    <div className="step-row__header">
                                        <span className="step-row__icon">{step.icon}</span>
                                        <h3 className="step-row__title">{step.title}</h3>
                                    </div>
                                    <p className="body-lg">{step.body}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ── Capsule Explainer ─────────────────────── */}
            <section className="section section--flush-top content-layer" style={{ paddingBottom: 'var(--space-24)' }}>
                <div className="container" style={{ maxWidth: 1000 }}>
                    <FadeIn>
                        <div className="card card--warm" style={{ padding: 'var(--space-14) var(--space-14)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
                                <div>
                                    <p className="label label--accent" style={{ marginBottom: 'var(--space-4)' }}>Capsules</p>
                                    <h2 className="display display--h2sm" style={{ marginBottom: 'var(--space-5)' }}>
                                        Not who you are.<br />
                                        <em>What you're open to, right now.</em>
                                    </h2>
                                    <p className="body-lg body-on-warm">
                                        A capsule is a moment of intent. You activate it when you're ready, and deactivate it when you're not. It changes. You change. Signal is built for that.
                                    </p>
                                </div>
                                <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                                    {CAPSULE_EXAMPLES.map(c => (
                                        <div key={c.type} className={`capsule-card capsule-card--${c.type}`}>
                                            <span className={`capsule-card__label capsule-card__label--${c.type}`}>{c.label}</span>
                                            <p className="capsule-card__text">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Principles ───────────────────────────── */}
            <section className="section section--tinted content-layer">
                <div className="container" style={{ maxWidth: 1000 }}>
                    <FadeIn>
                        <p className="label label--warm" style={{ marginBottom: 'var(--space-3)' }}>What we don't do</p>
                        <h2 className="display display--h2sm" style={{ marginBottom: 'var(--space-12)' }}>
                            The things we refused to build.
                        </h2>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 'var(--space-8)' }}>
                        {PRINCIPLES.map((p, i) => (
                            <FadeIn key={p.title} delay={i * 0.08}>
                                <div className="card--principle">
                                    <div className="principle-icon">{p.icon}</div>
                                    <h3 className="principle-title">{p.title}</h3>
                                    <p className="body-md">{p.body}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Signup ───────────────────────────────── */}
            <section id="signup" className="section section--lg content-layer">
                <div className="container container--form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'start' }}>
                        <FadeIn>
                            <p className="label label--muted" style={{ marginBottom: 'var(--space-4)' }}>Early access</p>
                            <h2 className="display display--h2" style={{ marginBottom: 'var(--space-6)' }}>
                                You'll only hear from us<br />when we're ready for you.
                            </h2>
                            <p className="body-lg">
                                Signal opens city by city. No announcements. No waitlist numbers. Just a warm message when it's your turn.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.15}>
                            <SignupForm />
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="nav__brand">
                    <div className="nav__dot" style={{ width: 7, height: 7 }} />
                    <span className="nav__wordmark" style={{ fontSize: 'var(--text-md)' }}>SIGNAL</span>
                </div>
                <p className="footer__tagline">No discovery. No messaging. No noise.</p>
            </footer>

            {/* Responsive grid overrides */}
            <style>{`
        @media (max-width: 768px) {
          .hero-grid   { grid-template-columns: 1fr !important; }
          .capsule-grid{ grid-template-columns: 1fr !important; }
          .signup-grid { grid-template-columns: 1fr !important; }
          .teaser-card { display: none; }
        }
      `}</style>
        </AppShell>
    );
}

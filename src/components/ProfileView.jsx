import React from 'react';
import SectionRenderer from './SectionRenderer';

export default function ProfileView({ profile, viewerRelationship }) {
  return (
    <main className="profile-view">
      <header className="identity-header">
        <div>
          <p className="eyebrow">Portable identity profile</p>
          <h1>{profile.name}</h1>
          <p className="muted">{profile.title}</p>
        </div>
        <div className="identity-meta">
          <span>{profile.location}</span>
          <span>Updated {profile.lastUpdated}</span>
        </div>
      </header>

      <section className="intent-row" aria-label="Connection intents">
        {profile.intents.map((intent) => (
          <span key={intent} className="chip chip--intent">{intent}</span>
        ))}
      </section>

      <section className="about-card">
        <h2>About</h2>
        <p>{profile.about}</p>
      </section>

      <section className="section-grid">
        {profile.sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            viewerRelationship={viewerRelationship}
          />
        ))}
      </section>
    </main>
  );
}

import React from 'react';
import VisibilityControl from './VisibilityControl';

export default function ProfileEditor({ draft, onSectionVisibilityChange }) {
  return (
    <aside className="profile-editor">
      <header>
        <p className="eyebrow">Editor</p>
        <h2>Design your profile with intent</h2>
        <p className="muted">Each section can be tuned by audience and context.</p>
      </header>

      <div className="editor-list">
        {draft.sections.map((section) => (
          <article key={section.id} className="editor-section">
            <div className="editor-row">
              <h3>{section.title}</h3>
              <span className="muted small">{section.type}</span>
            </div>
            <VisibilityControl
              value={section.visibility}
              onChange={(next) => onSectionVisibilityChange(section.id, next)}
            />
          </article>
        ))}
      </div>

      <footer className="share-module">
        <h3>Safe sharing</h3>
        <p>Create a scoped link with expiry and optional max views.</p>
        <button type="button" className="primary-btn">Generate share link</button>
      </footer>
    </aside>
  );
}

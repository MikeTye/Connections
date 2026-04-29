import React from 'react';

const visibilityRank = { private: 0, discovery: 1, shared: 2, public: 3 };
const viewerRank = { discovery: 1, shared_link: 2, owner: 4 };

export function canViewSection(sectionVisibility, viewerRelationship) {
  if (viewerRelationship === 'owner') return true;
  return viewerRank[viewerRelationship] >= visibilityRank[sectionVisibility];
}

export default function SectionRenderer({ section, viewerRelationship }) {
  const canView = canViewSection(section.visibility, viewerRelationship);

  if (!canView) {
    return (
      <div className="section-card section-card--locked" aria-label="Private section">
        <div className="section-head">
          <h3>{section.title}</h3>
          <span className="chip chip--private">Private</span>
        </div>
        <p>This section is shared selectively by the profile owner.</p>
      </div>
    );
  }

  return (
    <article className="section-card">
      <div className="section-head">
        <h3>{section.title}</h3>
        <span className={`chip chip--${section.visibility}`}>{section.visibility}</span>
      </div>
      {Array.isArray(section.content) ? (
        <ul>
          {section.content.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{section.content}</p>
      )}
    </article>
  );
}

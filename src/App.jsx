import React, { useMemo, useState } from 'react';
import ProfileEditor from './components/ProfileEditor';
import ProfileView from './components/ProfileView';
import { profileData, viewerContexts } from './data/mockProfileData';
import './styles.css';

export default function App() {
  const [draft, setDraft] = useState(profileData);
  const [viewerRelationship, setViewerRelationship] = useState('shared_link');

  const contexts = useMemo(() => Object.keys(viewerContexts), []);

  const onSectionVisibilityChange = (sectionId, visibility) => {
    setDraft((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, visibility } : section,
      ),
    }));
  };

  return (
    <div className="app-shell">
      <div className="topbar">
        <h1>Connections Prototype</h1>
        <label>
          Preview as:
          <select
            value={viewerRelationship}
            onChange={(e) => setViewerRelationship(e.target.value)}
          >
            {contexts.map((context) => (
              <option key={context} value={viewerContexts[context].relationship}>
                {context}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="workspace">
        <ProfileView profile={draft} viewerRelationship={viewerRelationship} />
        <ProfileEditor draft={draft} onSectionVisibilityChange={onSectionVisibilityChange} />
      </div>
    </div>
  );
}

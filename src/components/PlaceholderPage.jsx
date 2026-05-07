import React from 'react';
import { Link } from 'react-router-dom';
import DemoNav from './DemoNav';

export default function PlaceholderPage({ title, description }) {
  return (
    <div>
      <DemoNav />
      <main style={{ maxWidth: 760, margin: '40px auto', padding: '0 20px' }}>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>
          Demo quick jump: <Link to="/profile/me">My profile</Link> · <Link to="/p/demo-share">Viewer profile</Link>
        </p>
      </main>
    </div>
  );
}

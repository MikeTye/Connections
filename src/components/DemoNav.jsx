import React from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  ['/', 'Landing'],
  ['/signup', 'Signup'],
  ['/signin', 'Signin'],
  ['/onboarding', 'Onboarding'],
  ['/profile/edit', 'Edit Profile'],
  ['/profile/me', 'My Profile'],
  ['/p/demo-share', 'Viewer Profile'],
  ['/intro/demo-share/demo-intent', 'Intro'],
  ['/inbox', 'Inbox'],
  ['/links', 'Links'],
  ['/discover', 'Discover'],
  ['/safety', 'Safety'],
  ['/analytics', 'Analytics'],
];

export default function DemoNav() {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '12px 20px', borderBottom: '1px solid #ececec', background: '#fff' }}>
      {NAV_LINKS.map(([to, label]) => (
        <Link key={to} to={to} style={{ fontSize: 13, color: '#0f4c81', textDecoration: 'none' }}>
          {label}
        </Link>
      ))}
    </div>
  );
}

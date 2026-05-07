import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import SignupPage from './features/auth/pages/SignupPage';
import SigninPage from './features/auth/pages/SigninPage';
import OnboardingPage from './features/onboarding/pages/OnboardingPage';
import EditProfilePage from './features/profile/pages/EditProfilePage';
import MyProfilePage from './features/profile/pages/MyProfilePage';
import ViewerProfilePage from './features/profile/pages/ViewerProfilePage';
import IntroPage from './features/intro/pages/IntroPage';
import InboxPage from './features/inbox/pages/InboxPage';
import LinksPage from './features/links/pages/LinksPage';
import DiscoverPage from './features/discover/pages/DiscoverPage';
import SafetyPage from './features/safety/pages/SafetyPage';
import AnalyticsPage from './features/analytics/pages/AnalyticsPage';

function DemoFallbackRedirect() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/profile')) {
    return <Navigate to="/profile/me" replace />;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/me" element={<MyProfilePage />} />
        <Route path="/p/:shareSlug" element={<ViewerProfilePage />} />
        <Route path="/intro/:shareSlug/:intentId" element={<IntroPage />} />

        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />

        <Route path="*" element={<DemoFallbackRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

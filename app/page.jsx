'use client';

import React from 'react';
import LandingPage from '@/components/ports/LandingPage';
import AuthPage from '@/components/ports/AuthPage';

export default function MainPage() {
  const [currentScreen, setCurrentScreen] = React.useState('landing');

  if (currentScreen === 'auth') {
    return (
      <AuthPage 
        onAuthSuccess={() => setCurrentScreen('landing')}
        onBackToLanding={() => setCurrentScreen('landing')}
      />
    );
  }

  return (
    <LandingPage 
      onGetStarted={() => {
        const el = document.getElementById('import-wizard');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }}
      onSignUp={() => setCurrentScreen('auth')}
      onLogin={() => setCurrentScreen('auth')}
    />
  );
}

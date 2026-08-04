'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/ports/LandingPage';
import { useAuth } from '@/lib/auth-context';

export default function MainPage() {
  const router = useRouter();
  const { user } = useAuth();

  // "Analyze My Product" goes straight to the form when already signed in,
  // and via signup when not.
  const startAnalysis = () => router.push(user ? '/analyze' : '/signup');

  return (
    <LandingPage
      onGetStarted={startAnalysis}
      onSignUp={startAnalysis}
      onLogin={() => router.push('/login')}
    />
  );
}

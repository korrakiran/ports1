'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, useAuth } from '@/lib/auth-context';
import { Alert, Button, Field } from '@/components/ui/primitives';

/**
 * One form for both login and signup — the two screens differ only by the name
 * field and their copy, which is not enough to justify duplicating the whole
 * submit/validation/error path.
 */
export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const { login, signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    try {
      if (isSignup) await signup(name, email, password);
      else await login(email, password);
      router.push('/analyze');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.details ?? {});
      } else {
        setError('Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stack stack-md" noValidate>
      <div className="stack stack-xs">
        <h1 className="page-title">{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="page-subtitle">
          {isSignup
            ? 'Analyze a product and keep your results in one place.'
            : 'Log in to run an analysis and see your previous ones.'}
        </p>
      </div>

      {error && <Alert>{error}</Alert>}

      {isSignup && (
        <Field label="Full name" htmlFor="name" error={fieldErrors.name?.[0]}>
          <input
            id="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
          />
        </Field>
      )}

      <Field label="Email" htmlFor="email" error={fieldErrors.email?.[0]}>
        <input
          id="email"
          type="email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          aria-invalid={Boolean(fieldErrors.email)}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        hint={isSignup ? 'At least 8 characters.' : undefined}
        error={fieldErrors.password?.[0]}
      >
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          required
          aria-invalid={Boolean(fieldErrors.password)}
        />
      </Field>

      <Button type="submit" size="lg" block loading={submitting}>
        {isSignup ? 'Create account' : 'Log in'}
      </Button>

      <p className="muted" style={{ textAlign: 'center' }}>
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isSignup ? '/login' : '/signup'}
          style={{ color: '#0066ff', fontWeight: 600, textDecoration: 'none' }}
        >
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </form>
  );
}

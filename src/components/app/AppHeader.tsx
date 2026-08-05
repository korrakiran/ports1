'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/primitives';

/** Shared header for the signed-in screens. */
export default function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <Link
        href="/"
        style={{
          fontSize: '21px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: '#090d16',
          textDecoration: 'none'
        }}
      >
        Ports<span style={{ color: '#0066ff' }}>AI</span>
      </Link>

      <nav className="row row-md">
        {user ? (
          <>
            <Link
              href="/analyze"
              style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}
            >
              Analyze
            </Link>
            <Link
              href="/account"
              style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}
            >
              {user.name.split(' ')[0]}
            </Link>
            <Button variant="secondary" onClick={logout}>
              <LogOut size={15} /> Log out
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{ fontSize: '14px', fontWeight: 600, color: '#475569', textDecoration: 'none' }}
            >
              Log in
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

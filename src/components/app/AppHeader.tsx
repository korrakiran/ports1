'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/primitives';

/** Shared header for the signed-in screens. */
export default function AppHeader() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="app-header" style={{ position: 'relative' }}>
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

      <nav className="row row-md ld-desktop-only">
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

      {/* 3-LINE HAMBURGER TOGGLE (MOBILE ONLY) */}
      <button
        className="ld-mobile-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle Menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div
          className="ld-mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 999
          }}
        >
          {user ? (
            <>
              <Link
                href="/analyze"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', fontWeight: 600, color: '#090d16', textDecoration: 'none', padding: '10px 0' }}
              >
                Analyze Product
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', fontWeight: 600, color: '#090d16', textDecoration: 'none', padding: '10px 0' }}
              >
                My Account ({user.name})
              </Link>
              <div className="ld-mobile-menu-divider" />
              <Button
                variant="secondary"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={16} /> Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', fontWeight: 600, color: '#090d16', textDecoration: 'none', padding: '10px 0' }}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', fontWeight: 600, color: '#090d16', textDecoration: 'none', padding: '10px 0' }}
              >
                Sign up
              </Link>
              <div className="ld-mobile-menu-divider" />
              <Link href="/signup" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <Button style={{ width: '100%', justifyContent: 'center' }}>Get started</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}

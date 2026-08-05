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
        className="ld-mobile-toggle-box"
        onClick={() => setMobileOpen(true)}
        aria-label="Open Navigation Menu"
      >
        <Menu size={22} color="#090d16" />
      </button>

      {/* FULL SCREEN MOBILE OVERLAY MENU (per reference screenshots) */}
      {mobileOpen && (
        <div
          className="mobile-fullscreen-menu"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#fbfaf8',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px 40px',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}
        >
          {/* Header with Logo and Close Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
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

            <button
              className="ld-mobile-toggle-box"
              onClick={() => setMobileOpen(false)}
              aria-label="Close Menu"
            >
              <X size={22} color="#090d16" />
            </button>
          </div>

          {/* Centered Large Bold Links per Screenshot 2 */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '30px',
              padding: '20px 0'
            }}
          >
            <Link
              href="/"
              className="mobile-full-link"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/analyze"
                  className="mobile-full-link"
                  onClick={() => setMobileOpen(false)}
                >
                  Analyze Product
                </Link>
                <Link
                  href="/account"
                  className="mobile-full-link"
                  onClick={() => setMobileOpen(false)}
                >
                  My Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="mobile-full-link"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="mobile-full-link"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Bottom Action CTA */}
          <div style={{ width: '100%', maxWidth: '340px', margin: '0 auto' }}>
            {user ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                style={{ width: '100%', height: '48px', fontSize: '15px', borderRadius: '10px', justifyContent: 'center' }}
              >
                <LogOut size={16} /> Log out
              </Button>
            ) : (
              <Link href="/signup" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                <Button style={{ width: '100%', height: '48px', fontSize: '15px', borderRadius: '10px', justifyContent: 'center' }}>
                  Get started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

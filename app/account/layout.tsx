import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'My Account | PortsAI',
  description: 'Access your account profile and view your past product export readiness reports.'
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

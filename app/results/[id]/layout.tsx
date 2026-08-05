import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Analysis Results | PortsAI',
  description: 'View the global export market recommendations, matching scores, and trade statistics for your product.'
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

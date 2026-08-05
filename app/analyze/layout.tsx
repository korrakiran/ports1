import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Analyze Product | PortsAI',
  description: 'Describe your product and upload images to analyze global trade demand, import tariffs, and export readiness.'
};

export default function AnalyzeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

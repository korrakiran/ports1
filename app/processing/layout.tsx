import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Analyzing Product... | PortsAI',
  description: 'Processing your product details against international trade datasets and AI models.'
};

export default function ProcessingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

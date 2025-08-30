

import React from 'react';
import path from 'path';
import { promises as fs } from 'fs';
import ClientPolls from '@/components/ClientPolls';

// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600;

export default async function PollsPage() {
  // Read the pre-generated polls registry JSON at build time
  const registryPath = path.join(process.cwd(), 'data', 'pollsRegistry.json');
  const raw = await fs.readFile(registryPath, 'utf8');
  const polls = JSON.parse(raw);

  // Delegate to a lightweight client component for interactive polls
  return <ClientPolls polls={polls} />;
}

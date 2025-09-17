import React from 'react';

export default function NotFound() {
  return (
    <main className="max-w-4xl mx-auto py-20 text-center">
      <h1 className="text-4xl font-extrabold">Page not found</h1>
  <p className="mt-4 text-muted">We couldn&apos;t find the page you&apos;re looking for.</p>
      <a href="/" className="mt-6 inline-block text-blue-600 underline">Return home</a>
    </main>
  );
}

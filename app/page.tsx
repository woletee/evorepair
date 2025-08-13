'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SolutionsIndex() {
  const [ids, setIds] = useState<string[]>([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/concept_pred/_index.json')
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); })
      .then(setIds)
      .catch(e => setErr(String(e)));
  }, []);

  if (err) return <main className="p-6 text-red-600">Failed to load index: {err}</main>;
  if (!ids.length) return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Concept Solutions</h1>
      <ul className="grid gap-2">
        {ids.map(id => (
          <li key={id}>
            <Link className="text-blue-600 hover:underline" href={`/solutions/${encodeURIComponent(id)}`}>
              {id.replace(/[-_]/g, ' ')}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

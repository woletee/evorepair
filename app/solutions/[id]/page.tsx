'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Grid from '@/app/Components/Grids';

type Pair = { input: number[][]; output: number[][]; predicted?: number[][]; correct?: boolean };
type TaskFile = {
  train: Pair[];
  test: Pair[];
  train_pred?: number[][][];
  test_pred?: number[][][];
  _program?: string;
  program?: string;
};

function eq2D(a?: number[][], b?: number[][]) {
  if (!a || !b || a.length !== b.length) return false;
  for (let r = 0; r < a.length; r++) {
    if (a[r].length !== b[r].length) return false;
    for (let c = 0; c < a[r].length; c++) if (a[r][c] !== b[r][c]) return false;
  }
  return true;
}

export default function TaskPage() {
  const params = useParams();
  const raw = params?.id as string | string[] | undefined;
  const id = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : '';

  const [task, setTask] = useState<TaskFile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setTask(null);
    setError('');
    fetch(`/concept_pred/${encodeURIComponent(id)}.json`)
      .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json(); })
      .then(setTask)
      .catch(e => setError(String(e)));
  }, [id]);

  const title = useMemo(() => (id ? id.replace(/[-_]/g, ' ') : 'Task'), [id]);

  if (!id) return <main className="p-6">Loading…</main>;
  if (error) return <main className="p-6"><h1 className="text-xl font-semibold">{title}</h1><p className="text-red-600 mt-2">Failed to load: {error}</p></main>;
  if (!task) return <main className="p-6"><h1 className="text-xl font-semibold">{title}</h1><p className="opacity-70">Loading…</p></main>;

  const programText = task._program ?? task.program;

  const renderSection = (label: string, pairs: Pair[] = [], altPred?: number[][][]) => (
    <section>
      <h2 className="text-lg font-semibold mb-3">{label} ({pairs.length} pairs)</h2>
      <div className="space-y-6">
        {pairs.map((ex, i) => {
          const pred = ex.predicted ?? altPred?.[i];
          const ok = typeof ex.correct === 'boolean' ? ex.correct : eq2D(pred, ex.output);
          return (
            <div key={`${label}-${i}`} className="rounded border p-3">
              <div className="mb-2 text-sm">
                <span className={`inline-block px-2 py-0.5 rounded ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {ok ? 'OK' : 'Mismatch'}
                </span>
                <span className="ml-2 opacity-70">{label.toLowerCase()}[{i}]</span>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-medium mb-1">Input</div>
                  <Grid data={ex.input} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Expected</div>
                  <Grid data={ex.output} />
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Predicted</div>
                  <Grid data={pred ?? ex.output.map(row => row.map(() => 0))} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <main className="p-6 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>

        {programText && (
          <div className="rounded border bg-gray-50 p-3">
            <div className="font-medium mb-1">Program</div>
            <pre className="overflow-auto text-xs whitespace-pre-wrap break-words">
              {programText}
            </pre>
          </div>
        )}

        <p className="text-sm opacity-70">
          Data file: <code>/public/arc/concept_pred/{id}.json</code>
        </p>
      </header>

      {renderSection('Train', task.train, task.train_pred)}
      {renderSection('Test', task.test, task.test_pred)}
    </main>
  );
}

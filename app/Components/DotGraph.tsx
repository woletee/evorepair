'use client';

import { useEffect, useState } from 'react';
import { Graphviz } from '@hpcc-js/wasm-graphviz';

export default function DotGraph({ dot }: { dot: string }) {
  const [svg, setSvg] = useState<string>('Rendering…');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const gv = await Graphviz.load();
        const out = gv.layout(dot, 'svg', 'dot'); // or: gv.dot(dot)
        if (!cancelled) setSvg(out);
      } catch (err: any) {
        if (!cancelled) setSvg(`<pre style="color:#b91c1c">DOT render error: ${String(err)}</pre>`);
      }
    })();
    return () => { cancelled = true; };
  }, [dot]);

  return (
    <div
      className="overflow-auto border rounded p-2 bg-white"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

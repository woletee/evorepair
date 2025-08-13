'use client';

import React from 'react';

const COLORS: Record<number, string> = {
  0: '#000000',
  1: '#0074D9',
  2: '#FF4136',
  3: '#2ECC40',
  4: '#FFDC00',
  5: '#AAAAAA',
  6: '#F012BE',
  7: '#FF851B',
  8: '#7FDBFF',
  9: '#870C25',
};

export default function Grid({
  matrix,
  cellSize = 16,
}: {
  matrix: number[][];
  cellSize?: number;
}) {
  if (!matrix?.length) return null;

  const rows = matrix.length;
  const cols = matrix[0].length;

  return (
    <div
      className="inline-grid"
      style={{
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      }}
    >
      {matrix.flatMap((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: cellSize,
              height: cellSize,
              background: COLORS[v] ?? '#000',
            }}
          />
        ))
      )}
    </div>
  );
}

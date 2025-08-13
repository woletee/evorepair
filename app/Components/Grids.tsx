// app/Components/Grid.tsx
'use client';

type Props = {
  data: number[][];
  cell?: number;           // px
  showBorder?: boolean;
};

export const PALETTE = [
  '#000000', '#0074D9', '#FF4136', '#2ECC40', '#FFDC00',
  '#AAAAAA', '#F012BE', '#FF851B', '#7FDBFF', '#870C25'
] as const;

export default function Grid({ data, cell = 18, showBorder = true }: Props) {
  if (!data || !data.length || !data[0]?.length) return <div>∅</div>;
  const rows = data.length;
  const cols = data[0].length;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
        gap: 1,
      }}
    >
      {data.flatMap((row, r) =>
        row.map((v, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              width: cell,
              height: cell,
              background: PALETTE[v] ?? '#000000',
              border: showBorder ? '1px solid rgba(0,0,0,.06)' : 'none',
            }}
            title={`${r},${c}:${v}`}
          />
        ))
      )}
    </div>
  );
}

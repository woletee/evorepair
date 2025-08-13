'use client';

import { useRouter } from 'next/navigation';

export default function TaskSwitcher({
  ids,
  currentId,
}: {
  ids: string[];
  currentId: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-gray-600">Task</label>
      <select
        value={currentId}
        onChange={(e) => router.push(`/solutions/${e.target.value}`)}
        className="border rounded px-2 py-1 bg-white text-sm"
      >
        {ids.map((id) => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
    </div>
  );
}

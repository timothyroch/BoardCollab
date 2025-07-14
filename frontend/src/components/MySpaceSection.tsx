'use client';

import { useCallback } from 'react';

interface Task {
  id: string;
  title: string;
  tenantId: string;
  creator?: { email: string };
  assignees?: { email: string }[];
  dueDate?: string;
}

interface MySpaceSectionProps {
  tasks: Task[];
  userEmail?: string;
  tenantId: string;
}

export default function MySpaceSection({ tasks, userEmail, tenantId }: MySpaceSectionProps) {
  if (!userEmail) {
    return <p className="text-gray-600">You must be logged in to view your tasks.</p>;
  }

  const assignedTasks = tasks.filter(
    (task) => task.assignees?.some(a => a.email === userEmail)
  );
const handleSync = useCallback(async (task: Task) => {
  const res = await fetch('/api/check-calendar-scope');

  if (res.status === 403) {
    window.location.href = `/api/calendar-consent?tenantId=${tenantId}`;

    return;
  }

  const syncRes = await fetch('/api/sync-to-calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: task.title,
      dueDate: task.dueDate,
    }),
  });

  if (!syncRes.ok) {
    alert('Failed to sync task');
  } else {
    alert('Task synced to Google Calendar');
  }
}, []);


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Assigned Tasks</h2>
      <p className="text-gray-600 mb-4">
        You have {assignedTasks.length} task{assignedTasks.length !== 1 ? 's' : ''} assigned to you.
      </p>

      {assignedTasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you.</p>
      ) : (
        <ul className="space-y-2">
          {assignedTasks.map((task) => (
            <li key={task.id} className="p-3 border rounded shadow-sm">
              <p className="font-medium">{task.title}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-400">
                Created by: {task.creator?.email || 'Unknown'}
              </p>
               <button
                className="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded"
                onClick={() => handleSync(task)}
              >
                Sync to Google Calendar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

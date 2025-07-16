'use client';

import { useCallback } from 'react';
import Button from './ui/Button';
import TaskList from './TaskList';

interface Task {
  id?: string;
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
}, [tenantId]);


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Assigned Tasks</h2>
      <p className="text-gray-600 mb-4">
        You have {assignedTasks.length} task{assignedTasks.length !== 1 ? 's' : ''} assigned to you.
      </p>

  
      <TaskList
        tasks={assignedTasks}
        renderTaskExtras={(task) => (
          <Button onClick={() => handleSync(task)}>
            Sync to Google Calendar
          </Button>
        )}
      />
    </div>
  );
}

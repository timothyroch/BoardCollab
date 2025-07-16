'use client';

import { useCallback, useState, useEffect } from 'react';
import Button from './ui/Button';
import TaskList from './TaskList';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Task } from '../../types/task';



interface MySpaceSectionProps {
  tasks: Task[];
  userEmail?: string;
  tenantId: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function MySpaceSection({ tasks, setTasks, userEmail, tenantId }: MySpaceSectionProps) {

const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
  setTasks(prev =>
    prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
  );

  const res = await fetch('/api/update-task-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, status: newStatus }),
  });

  if (!res.ok) {
    alert('Failed to update task status');
  }
};
  if (!userEmail) {
    return <p className="text-gray-600">You must be logged in to view your tasks.</p>;
  }

  const assignedTasks = tasks.filter(
    (task) => task.assignees?.some(a => a.email === userEmail)
  );

  const getStatusColor = (status?: Task['status']): string => {
  switch (status) {
    case 'done':
      return '#34D399'; 
    case 'in_progress':
      return '#FACC15'; 
    case 'to_do':
    default:
      return '#9CA3AF'; 
  }
};



const calendarEvents = assignedTasks
  .filter(task => task.dueDate)
  .map(task => {

    return {
      title: task.title,
      date: task.dueDate!,
      color: getStatusColor(task.status),
        };
  });    
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
  <div className="fc-wrapper text-white rounded shadow p-4 mb-8">
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      height="auto"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      }}
    />
  </div>
  
      <TaskList
        tasks={assignedTasks}
        userEmail={userEmail}
        onStatusChange={handleStatusChange}
        renderTaskExtras={(task) => (
          
          <Button onClick={() => handleSync(task as Task)}>
            Sync to Google Calendar
          </Button>
        )}
      />
    </div>
  );
}

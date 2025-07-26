'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import TaskList from './TaskList';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Task } from '../../types/task';
import { Calendar as CalendarIcon } from 'lucide-react';



interface MySpaceSectionProps {
  tasks: Task[];
  userEmail?: string;
  tenantId: string;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function MySpaceSection({ tasks, setTasks, userEmail, tenantId }: MySpaceSectionProps) {
const calendarRef = useRef<any>(null);
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
      return '#FFFFFF'; 
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



  const handleDelete = async (taskId: string) => {
  const confirmed = confirm('Are you sure you want to delete this task?');
  if (!confirmed) return;

  const res = await fetch('/api/delete-task', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId }),
  });

  if (res.ok) {
    // Remove task from state
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    // Remove corresponding event from FullCalendar
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const eventToRemove = calendarApi.getEvents().find((event: any) => event.id === taskId);
      if (eventToRemove) {
        eventToRemove.remove();  // Remove the event from FullCalendar
      }
    }

    alert('Task deleted');
  } else {
    const data = await res.json();
    alert(data.message || 'Failed to delete task');
  }
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(255,255,255,0.3)]">My Assigned Tasks</h2>
      </div>
      <p className="text-white/60 mb-8 text-sm">
        You have {assignedTasks.length} task{assignedTasks.length !== 1 ? 's' : ''} assigned to you.
      </p>
  <div className="bg-neutral-900 border border-white/20 rounded-2xl shadow-xl p-6 mb-8">
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      height="auto"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      }}
    eventContent={eventInfo => (
            <div className="flex items-center gap-2 text-sm text-gray-900 font-medium p-1 rounded">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: eventInfo.event.backgroundColor }}
              />
              {eventInfo.event.title}
            </div>
          )}
          dayCellClassNames="bg-neutral-900 text-white/80"
          eventClassNames="border-0"
          titleFormat={{ year: 'numeric', month: 'long' }}
          customButtons={{
            prev: {
              text: '←',
              click: () => calendarRef.current.getApi().prev(),
            },
            next: {
              text: '→',
              click: () => calendarRef.current.getApi().next(),
            },
            today: {
              text: 'Today',
              click: () => calendarRef.current.getApi().today(),
            },
          }}
        />
        <style jsx global>{`
          .fc {
            --fc-bg-color: #171717;
            --fc-text-color: #ffffff;
            --fc-border-color: #ffffff33;
            --fc-button-bg-color: #1f2937;
            --fc-button-border-color: #ffffff4d;
            --fc-button-hover-bg-color: #ffffff1a;
            --fc-button-hover-border-color: #ffffff80;
            --fc-button-active-bg-color: #ffffff33;
            --fc-button-active-border-color: #ffffff80;
            --fc-button-text-color: #ffffff;
          }
          .fc .fc-toolbar {
            background: transparent;
            color: var(--fc-button-text-color);
            margin-bottom: 1rem;
          }
          .fc .fc-toolbar-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
          }
          .fc .fc-button {
            background: var(--fc-button-bg-color);
            border: 1px solid var(--fc-button-border-color);
            color: var(--fc-button-text-color);
            padding: 0.5rem 1rem;
            border-radius: 0.75rem;
            transition: all 0.3s ease-in-out;
          }
          .fc .fc-button:hover {
            background: var(--fc-button-hover-bg-color);
            border-color: var(--fc-button-hover-border-color);
            transform: scale(1.05);
          }
          .fc .fc-button:active {
            background: var(--fc-button-active-bg-color);
            border-color: var(--fc-button-active-border-color);
          }
          .fc .fc-daygrid-day {
            background: var(--fc-bg-color);
            border-color: var(--fc-border-color);
          }
          .fc .fc-daygrid-day-number {
            color: var(--fc-text-color);
          }
          .fc .fc-col-header-cell {
            background: var(--fc-bg-color);
            color: #ffffff;
            font-weight: 600;
          }
        `}</style>
  </div>
  
      <TaskList
        tasks={assignedTasks}
        userEmail={userEmail}
        onStatusChange={handleStatusChange}
        renderTaskExtras={(task) => (
          
          <button onClick={() => handleSync(task)}
          className="
              inline-flex items-center justify-center px-4 py-2 text-sm font-semibold
              text-white bg-gray-800/50 border border-white/30 rounded-xl
              hover:bg-white/10 hover:text-white hover:border-white/50 hover:shadow-lg
              transition-all duration-300 ease-in-out transform hover:scale-105 mt-4
            ">
              <CalendarIcon className="mr-2 h-4 w-4" />
            Sync to Google Calendar
          </button>
        )}
        onDeleteTask={handleDelete}
      />
    </div>
  );
}

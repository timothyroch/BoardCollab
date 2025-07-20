'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import TaskCreator from './TaskCreator';
import TaskList from './TaskList';
import { Task } from '../../types/task';



interface GroupSectionProps {
  tenantId: string;
  userId?: string;
  tasks: Task[];
  userEmail?: string;
  onTaskCreated: (task: Task) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function GroupSection({ tenantId, userEmail, tasks, setTasks }: GroupSectionProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false); 
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
    alert('Failed to update status');
  }
};



  const handleDelete = async (taskId: string) => {
  const confirmed = confirm('Are you sure you want to delete this task?');
  if (!confirmed) return;

  const res = await fetch('/api/delete-task', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId }),
  });

  if (res.ok) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const eventToRemove = calendarApi.getEvents().find((event: any) => event.id === taskId);
      if (eventToRemove) {
        eventToRemove.remove();  
      }
    }

    alert('Task deleted');
  } else {
    const data = await res.json();
    alert(data.message || 'Failed to delete task');
  }
};
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Group Tasks</h2>
      <TaskCreator
        tenantId={tenantId}
        userId={session?.user?.userId}
      />
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList
         tasks={tasks}
         userEmail={userEmail} 
         onStatusChange={handleStatusChange}
         onDeleteTask={handleDelete}
         />
      )}
    </div>
  );
}

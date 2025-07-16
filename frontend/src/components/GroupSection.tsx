'use client';

import { useEffect, useState } from 'react';
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



  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Group Tasks</h2>
      <TaskCreator
        tenantId={tenantId}
        userId={session?.user?.userId}
        onTaskCreated={() => {}}
      />
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList tasks={tasks} userEmail={userEmail} onStatusChange={handleStatusChange}/>
      )}
    </div>
  );
}

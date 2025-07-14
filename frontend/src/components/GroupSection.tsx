'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import TaskCreator from './TaskCreator';
import TaskList from './TaskList';
import socket from '../../utils/socket';

interface Task {
  id: string;
  title: string;
  tenantId: string;
  creatorId: string;
  creator?: { email: string };
  assignee?: { email: string };
  dueDate?: string;
}


interface GroupSectionProps {
  tenantId: string;
  userId?: string;
  tasks: Task[];
  onTaskCreated: (task: Task) => void;
}

export default function GroupSection({ tenantId, userId }: GroupSectionProps) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tenantId) return;

    socket.emit('joinTenant', tenantId);

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/get-tasks?tenantId=${tenantId}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error('Unexpected task data:', data);
          setTasks([]);
          return;
        }

        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    const handleTaskCreated = (task: Task) => {
      if (task.tenantId === tenantId) {
        setTasks((prev) => [...prev, task]);
      }
    };

    const handleTaskUpdated = (updatedTask: Task) => {
      if (updatedTask.tenantId === tenantId) {
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      }
    };

    const handleTaskDeleted = (deletedTaskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== deletedTaskId));
    };

    socket.on('taskCreated', handleTaskCreated);
    socket.on('taskUpdated', handleTaskUpdated);
    socket.on('taskDeleted', handleTaskDeleted);

    return () => {
      socket.off('taskCreated', handleTaskCreated);
      socket.off('taskUpdated', handleTaskUpdated);
      socket.off('taskDeleted', handleTaskDeleted);
    };
  }, [tenantId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Group Tasks</h2>
      <TaskCreator
        tenantId={tenantId}
        userId={session?.user?.userId}
        onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
      />
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
}

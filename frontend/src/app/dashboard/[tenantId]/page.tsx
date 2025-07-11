'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket from '../../../../utils/socket';

interface Task {
  id: string;
  title: string;
  tenantId: string;
}

export default function TenantDashboard() {
  const params = useParams();
  const tenantId = params && typeof params['tenantId'] === 'string'
    ? params['tenantId']
    : Array.isArray(params?.['tenantId'])
      ? params['tenantId'][0]
      : undefined;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    if (!tenantId) return;

    socket.emit('joinTenant', tenantId);

    const fetchTasks = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks?tenantId=${tenantId}`);
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();

    socket.on('taskCreated', (task: Task) => {
      if (task.tenantId === tenantId) {
        setTasks((prev) => [...prev, task]);
      }
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      if (updatedTask.tenantId === tenantId) {
        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      }
    });

    socket.on('taskDeleted', (deletedTaskId: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== deletedTaskId));
    });

    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [tenantId]);

  const createTask = () => {
    if (!newTaskTitle) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      tenantId: tenantId as string,
    };

    socket.emit('createTask', { tenantId, task });
    setNewTaskTitle('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Workspace: {tenantId}</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={createTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 border rounded">
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

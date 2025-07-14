'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket from '../../../../utils/socket';
import { useSession } from 'next-auth/react';
import TaskCreator from '@/components/TaskCreator';
import TaskList from '@/components/TaskList';

interface Task {
  id?: string;
  title: string;
  tenantId: string;
  creatorId: string;
}

export default function TenantDashboard() {
  const params = useParams();
  const tenantId = params && typeof params['tenantId'] === 'string'
    ? params['tenantId']
    : Array.isArray(params?.['tenantId'])
      ? params['tenantId'][0]
      : undefined;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const { data: session } = useSession();

    const sendInvite = async () => {
  setInviteError('');
  setInviteSuccess('');

  if (!inviteEmail.trim()) {
    setInviteError('Please enter a valid email');
    return;
  }

  try {
    const res = await fetch('/api/send-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inviteEmail,
        tenantId,
        inviterId: session?.user?.userId, 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setInviteError(data.message || 'Failed to send invite');
    } else {
      setInviteSuccess('Invite sent');
      setInviteEmail('');
    }
  } catch (err) {
    setInviteError('Network error');
  }
};

useEffect(() => {
  if (!tenantId) return;

  socket.emit('joinTenant', tenantId);

  const fetchTasks = async () => {
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Workspace: {tenantId}</h1>
        <TaskCreator
          tenantId={tenantId ?? ''}
          userId={session?.user?.userId}
          onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
        />
      <TaskList tasks={tasks} />

      <div className="mt-8 border p-4 rounded max-w-md">
  <h3 className="text-lg font-semibold mb-2">Invite User to Workspace</h3>
  <input
    type="email"
    placeholder="Enter user's email"
    className="border p-2 rounded w-full mb-2"
    value={inviteEmail}
    onChange={(e) => setInviteEmail(e.target.value)}
  />
  <button
    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
    onClick={sendInvite}
  >
    Send Invite
  </button>
  {inviteError && <p className="text-red-600 text-sm mt-2">{inviteError}</p>}
  {inviteSuccess && <p className="text-green-600 text-sm mt-2">{inviteSuccess}</p>}
</div>

    </div>
  );
}

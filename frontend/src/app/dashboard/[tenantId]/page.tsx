'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket, { joinTenantRoom } from '../../../../utils/socket';
import { useSession } from 'next-auth/react';
import HeaderSelector from '@/components/HeaderSelector';
import GeneralSection from '@/components/GeneralSection';
import MySpaceSection from '@/components/MySpaceSection';
import GroupSection from '@/components/GroupSection';
import { Task } from '../../../../types/task';



export default function TenantDashboard() {
  const params = useParams();
  const tenantId = params && typeof params['tenantId'] === 'string'
    ? params['tenantId']
    : Array.isArray(params?.['tenantId'])
      ? params['tenantId'][0]
      : undefined;
  const [activeTab, setActiveTab] = useState<'general' | 'my-space' | 'group'>('group');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();
  const [tenantName, setTenantName] = useState<string | null>(null);

const userId = session?.user?.userId;
const userEmail = session?.user?.email;

useEffect(() => {
  const fetchTenantName = async () => {
    if (!tenantId) return;
    try {
      const res = await fetch(`/api/get-tenant?tenantId=${tenantId}`);
      const data = await res.json();
      if (res.ok && data.name) {
        setTenantName(data.name);
      }
    } catch (err) {
      console.error('Failed to fetch tenant name:', err);
    }
  };

  fetchTenantName();
}, [tenantId]);
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

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/get-tasks?tenantId=${tenantId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('Unexpected tasks response:', data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  fetchTasks();
}, [tenantId]);

useEffect(() => {
  if (!tenantId) return;

  joinTenantRoom(tenantId);

  socket.on('taskCreated', (task: Task) => {
    if (task.tenantId === tenantId) {
      setTasks((prev) => [task, ...prev]);
    }
  });

  socket.on('taskUpdated', (updatedTask: Task) => {
    if (updatedTask.tenantId === tenantId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
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


  return (
    <div className="p-8">
      <HeaderSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'general' && tenantId && (
        <GeneralSection
          tenantId={tenantId}
          inviteEmail={inviteEmail}
          onInviteEmailChange={setInviteEmail}
          onSendInvite={sendInvite}
          inviteError={inviteError}
          inviteSuccess={inviteSuccess}
          tenantName={tenantName ?? ''}
        />
      )}

      {activeTab === 'my-space' && (
        <MySpaceSection tasks={tasks} userEmail={userEmail ?? undefined} setTasks={setTasks} tenantId={tenantId!}/>
      )}

      {activeTab === 'group' && tenantId && (
        <GroupSection
          tenantId={tenantId}
          userId={userId}
          userEmail={userEmail ?? undefined}
          tasks={tasks}
          onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
          setTasks={setTasks}
        />
      )}


    </div>
  );
}

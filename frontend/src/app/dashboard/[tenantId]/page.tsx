'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import socket from '../../../../utils/socket';
import { useSession } from 'next-auth/react';
import HeaderSelector from '@/components/HeaderSelector';
import GeneralSection from '@/components/GeneralSection';
import MySpaceSection from '@/components/MySpaceSection';
import GroupSection from '@/components/GroupSection';

interface Task {
  id: string;
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
  const [activeTab, setActiveTab] = useState<'general' | 'my-space' | 'group'>('general');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();

const userId = session?.user?.userId;
const userEmail = session?.user?.email;


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
        />
      )}

      {activeTab === 'my-space' && (
        <MySpaceSection tasks={tasks} userEmail={userEmail} />
      )}

      {activeTab === 'group' && tenantId && (
        <GroupSection
          tenantId={tenantId}
          userId={userId}
          tasks={tasks}
          onTaskCreated={(task) => setTasks((prev) => [...prev, task])}
        />
      )}


    </div>
  );
}

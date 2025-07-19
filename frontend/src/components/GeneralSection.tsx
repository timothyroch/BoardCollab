'use client';

import { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/input';
import { useSession } from 'next-auth/react';


interface GeneralSectionProps {
  tenantId: string;
  inviteEmail: string;
  onInviteEmailChange: (val: string) => void;
  onSendInvite: () => Promise<void>;
  inviteError: string;
  inviteSuccess: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function GeneralSection({
  tenantId,
  inviteEmail,
  onInviteEmailChange,
  onSendInvite,
  inviteError,
  inviteSuccess,
}: GeneralSectionProps) {
      const { data: session } = useSession();
      const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch(`/api/get-users?tenantId=${tenantId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Unexpected user data:', data);
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [tenantId]);
  return (
    <div className="border p-4 rounded max-w-md">
      <h3 className="text-lg font-semibold mb-2">Invite User to Workspace</h3>
      <Input
        type="email"
        placeholder="Enter user's email"
        value={inviteEmail}
        onChange={(e) => onInviteEmailChange(e.target.value)}
      />
      <Button
        onClick={onSendInvite}
      >
        Send Invite
      </Button>
      {inviteError && <p className="text-red-600 text-sm mt-2">{inviteError}</p>}
      {inviteSuccess && <p className="text-green-600 text-sm mt-2">{inviteSuccess}</p>}
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2">Current Members</h4>
        {loadingUsers ? (
          <p className="text-sm text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-500">No members yet.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {users.map((user) => (
              <li key={user.id}>
                {user.name || user.email} ({user.email})
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button
  onClick={async () => {
    const confirmed = confirm('Are you sure you want to leave this workspace?');
    if (!confirmed) return;

    const res = await fetch('/api/leave-group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        userId: session?.user?.userId, // or however you retrieve userId
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('You have left the group.');
      window.location.href = '/dashboard'; // or home
    } else {
      alert(data.message || 'Failed to leave the group.');
    }
  }}
>
  Leave Group
</Button>

    </div>
  );
}

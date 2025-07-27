'use client';

import { useEffect, useState } from 'react';
import Button from './ui/Button';
import Input from './ui/input';
import { useSession } from 'next-auth/react';


interface GeneralSectionProps {
  tenantId: string;
  tenantName: string;
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
  tenantName,
  inviteEmail,
  onInviteEmailChange,
  onSendInvite,
  inviteError,
  inviteSuccess,
}: GeneralSectionProps) {
      const { data: session } = useSession();
      const [users, setUsers] = useState<User[]>([]);
      const [loadingUsers, setLoadingUsers] = useState(false);
      const [showInvitePopup, setShowInvitePopup] = useState(false);

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
    <div className="p-6 max-w-2xl mx-auto relative min-h-screen">
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-4xl font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]">{tenantName}{' '} <span className="text-white/80 text-2xl">Members</span></h2>
        <button
          onClick={() => setShowInvitePopup(true)}
          className="text-white/70 text-sm font-medium px-4 py-1.5 rounded-lg border border-white/50
            hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          Add User
        </button>
      </div>
        {showInvitePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-950 p-6 rounded-lg shadow-xl max-w-md w-full">
      <h3 className="text-lg font-semibold mb-4 text-white">Invite User</h3>
      <Input
        type="email"
        placeholder="Enter user's email"
        value={inviteEmail}
        onChange={(e) => onInviteEmailChange(e.target.value)}
      />
        <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowInvitePopup(false)}
                className="text-white/70 text-sm font-medium px-4 py-2 rounded-lg border border-white/50
                  hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                Cancel
              </button>
      <button
        onClick={async () => {await onSendInvite();
                if (!inviteError) setShowInvitePopup(false);}}
                className="bg-white text-black px-5 py-2 rounded-lg font-semibold
                  hover:bg-gray-100 hover:shadow-md transition-all duration-300">
        Send Invite
      </button>
      </div>
      {inviteError && <p className="text-red-600 text-sm mt-2">{inviteError}</p>}
      {inviteSuccess && <p className="text-green-600 text-sm mt-2">{inviteSuccess}</p>}
      </div>
      </div>
      )}
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4 text-white/80">Current Members</h4>
        {loadingUsers ? (
          <p className="text-sm text-white/60">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-white/60">No members yet.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user.id}
              className="text-lg font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,4)]
                  border-l-4 border-white pl-4 py-2 hover:bg-white/10 transition-all duration-300"
              >
                {user.name || user.email} <span className="text-white/80">- {user.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
  onClick={async () => {
    const confirmed = confirm(`Are you sure you want to leave ${tenantName}?`);
    if (!confirmed) return;

    const res = await fetch('/api/leave-group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId,
        userId: session?.user?.userId, 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('You have left the group.');
      window.location.href = '/dashboard'; 
    } else {
      alert(data.message || 'Failed to leave the group.');
    }
  }}
  className="mt-6 text-white/60 text-sm font-medium hover:text-white/80
          transition-all duration-300"
>
  Leave Group
</button>

    </div>
  );
}

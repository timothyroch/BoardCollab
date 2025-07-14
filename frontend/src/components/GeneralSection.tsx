'use client';

import { useEffect, useState } from 'react';

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
      <input
        type="email"
        placeholder="Enter user's email"
        className="border p-2 rounded w-full mb-2"
        value={inviteEmail}
        onChange={(e) => onInviteEmailChange(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={onSendInvite}
      >
        Send Invite
      </button>
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
    </div>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tenantName, setTenantName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdTenant, setCreatedTenant] = useState<any>(null);
  const [userTenants, setUserTenants] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);


  const handleTenantClick = (tenantId: string) => {
    router.push(`/dashboard/${tenantId}`);
  };

useEffect(() => {
  if (status !== 'authenticated') return;

  const fetchTenants = async () => {
    const userId = session?.user?.userId;
    if (!userId) return;

    try {
      const res = await fetch(`/api/get-tenants?userId=${userId}`);
      const data = await res.json();
      setUserTenants(data);
    } catch (err) {
      console.error('Failed to fetch tenants', err);
    }
  };

  fetchTenants(); 
}, [status, session]);

const fetchInvites = async () => {
  try {
    const res = await fetch(`/api/get-invites?email=${session?.user?.email}`);
    const data = await res.json();
    if (Array.isArray(data)) setInvites(data);
  } catch (err) {
    console.error('Failed to fetch invites', err);
  }
};

fetchInvites();


const handleCreateTenant = async () => {
  if (!tenantName.trim()) {
    setError('Group name is required');
    return;
  }

  const userId = session?.user?.userId;
  if (!userId) {
    setError('User ID not available in session');
    return;
  }

  setIsCreating(true);
  setError('');

  try {
    const res = await fetch('/api/create-tenant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: tenantName,
        userId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || 'Failed to create tenant');
    } else {
      setCreatedTenant(data);
      setTenantName('');
    }
  } catch (err) {
    setError('Network error');
  }

  setIsCreating(false);
};

const handleAccept = async (inviteId: string) => {
  try {
    await fetch('/api/invite-accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId, userId: session?.user?.userId }),
    });
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  } catch (err) {
    console.error('Failed to accept invite', err);
  }
};

const handleReject = async (inviteId: string) => {
  try {
    await fetch('/api/invite-reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId }),
    });
    setInvites((prev) => prev.filter((i) => i.id !== inviteId));
  } catch (err) {
    console.error('Failed to reject invite', err);
  }
};


  const existingTenants = session?.user?.tenantId
    ? [{ id: session.user.tenantId, name: 'Your Workspace' }]
    : [];

const tenants = createdTenant
  ? [...userTenants, createdTenant]
  : userTenants;


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session?.user?.userId}</h1>

      <h2 className="text-xl mb-2">Your Workspaces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100 transition"
            onClick={() => handleTenantClick(tenant.id)}
          >
            <h3 className="text-lg font-semibold">{tenant.name}</h3>
            <p className="text-sm text-gray-600">Click to manage tasks</p>
          </div>
        ))}
      </div>

<div className="border rounded p-6 max-w-md bg-white shadow text-gray-900">
  <h3 className="text-xl font-bold mb-4">Create New Group</h3>
  <input
    type="text"
    placeholder="Group name"
    className="w-full border border-gray-300 px-4 py-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={tenantName}
    onChange={(e) => setTenantName(e.target.value)}
  />
  <button
    className={`px-4 py-2 rounded w-full font-medium transition ${
      isCreating
        ? 'bg-blue-400 text-white cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`}
    onClick={handleCreateTenant}
    disabled={isCreating}
  >
    {isCreating ? 'Creating...' : 'Create Group'}
  </button>
  {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
</div>
{invites.length > 0 && (
  <div className="mt-8">
    <h2 className="text-xl mb-2">Pending Invites</h2>
    <ul className="space-y-2">
      {invites.map((invite) => (
        <li key={invite.id} className="border p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>{invite.tenant?.name}</strong> invited you</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(invite.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(invite.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
}

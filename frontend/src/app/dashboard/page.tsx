'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tenantName, setTenantName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdTenant, setCreatedTenant] = useState<any>(null);
  const [userTenants, setUserTenants] = useState<any[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);


  const handleTenantClick = (tenantId: string) => {
    router.push(`/dashboard/${tenantId}`);
  };

useEffect(() => {
  if (status !== 'authenticated') return;
    fetchTenants(); 
}, [status, session]);

  const fetchTenants = async () => {
    const userId = session?.user?.userId;
    if (!userId) return;

    try {
      const res = await fetch(`/api/get-tenants?userId=${userId}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : Array.isArray(data?.tenants) ? data.tenants : [];
      setUserTenants(list);
    } catch (err) {
      console.error('Failed to fetch tenants', err);
      setUserTenants([]);
    }
  };



useEffect(() => {
  if (!session?.user?.email) return;

  const fetchInvites = async () => {
    try {
      const res = await fetch(`/api/get-invites?email=${session.user.email}`);
      const data = await res.json();
      if (Array.isArray(data)) setInvites(data);
    } catch (err) {
      console.error('Failed to fetch invites', err);
    }
  };

  fetchInvites();
}, [session?.user?.email]);



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
      await fetchTenants();
      setTenantName('');
      setShowCreateModal(false);
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
    await fetchTenants();
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
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Welcome, {session?.user?.name}</h1>
      <section className="mb-12">
      <h2 className="text-2xl mb-4 font-semibold text-white/80">Your Workspaces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="relative border bg-neutral-900 p-6 rounded-2xl border-white/20 shadow cursor-pointer hover:bg-neutral-800 transition"
            onClick={() => handleTenantClick(tenant.id)}
          >
              {tenant.taskCount > 0 && (
    <div className="absolute top-3 right-3 bg-white text-black text-xs font-semibold px-2 py-1 rounded-full shadow">
      {tenant.taskCount}
    </div>
  )}
            
            <h3 className="text-lg font-semibold text-white mb-1">{tenant.name}</h3>
<div className="flex justify-between text-white/70 text-sm mt-2">
  <span>{tenant.memberCount} member{tenant.memberCount !== 1 ? 's' : ''}</span>
</div>


          </div>
        ))}
      
      <div
            onClick={() => setShowCreateModal(true)}
            className="
              p-6 bg-neutral-900 border border-white/20 rounded-2xl shadow
              hover:bg-neutral-800 hover:shadow-xl transition cursor-pointer
              flex flex-col items-center justify-center
            "
          >
            <Plus className="h-8 w-8 text-white/60 mb-2" />
            <span className="text-lg font-semibold text-white">
              Create New Group
            </span>
          </div>
        </div>
</section>

{invites.length > 0 && (
  <section className="mb-12">
    <h2 className="text-2xl mb-4 font-semibold text-white/80">Pending Invites</h2>
    <ul className="space-y-4">
      {invites.map((invite) => (
        <li key={invite.id} className="border p-6 rounded-2xl shadow border-white/20 bg-neutral-900">

              <p className="text-white"><strong>{invite.tenant?.name}</strong> invited you</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(invite.id)}
                className="bg-green-400 text-gray-900 px-4 py-1 font-medium rounded-lg hover:bg-green-300 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(invite.id)}
                className="bg-red-500 font-medium text-white px-4 py-1 rounded-lg hover:bg-red-400"
              >
                Reject
              </button>
            </div>

        </li>
      ))}
    </ul>
  </section>
)}
{showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-semibold text-white mb-4">
              Create New Group
            </h3>
            <input
              type="text"
              placeholder="Group name"
              className="
                w-full px-4 py-2 bg-neutral-800 text-white border border-white/30
                rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-white/30
                focus:border-white transition
              "
              value={tenantName}
              onChange={e => setTenantName(e.target.value)}
            />
            <button
              onClick={handleCreateTenant}
              disabled={isCreating}
              className={`
                w-full px-5 py-2 rounded-xl font-semibold transition
                ${isCreating
                  ? 'bg-white/50 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-100'}
              `}
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </button>
            {error && (
              <p className="text-red-400 text-sm mt-3">{error}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

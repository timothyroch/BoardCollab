'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleTenantClick = (tenantId: string) => {
    router.push(`/dashboard/${tenantId}`);
  };

  const tenants = session?.user?.tenantId
    ? [{ id: session.user.tenantId, name: 'Your Workspace' }] // fallback in case user.tenants isn't ready
    : [];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session?.user?.name}</h1>
      <h2 className="text-xl mb-2">Your Workspaces</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function PostSigninPage() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finalizeInvite = async () => {
      const token = localStorage.getItem('pendingInviteToken');
      if (!token) {
        router.replace('/dashboard');
        return;
      }

      const session = await getSession();
      if (!session?.user) return;

      try {
        const res = await fetch('/api/accept-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok && data.tenantId) {
          localStorage.removeItem('pendingInviteToken');
          router.replace(`/dashboard/${data.tenantId}`);
        } else {
          router.replace('/dashboard');
        }
      } catch {
        router.replace('/dashboard');
      }

      setDone(true);
    };

    if (!done) finalizeInvite();
  }, [done]);

  return <p>Finalizing your invite...</p>;
}

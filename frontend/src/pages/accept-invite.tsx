'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function AcceptInvitePage() {
  const router = useRouter();
  const token = router.query.token as string | undefined;

  useEffect(() => {
    if (token) {
      localStorage.setItem('pendingInviteToken', token);
      signIn('google', { callbackUrl: '/post-signin' });
    }
  }, [token]);

  return <p>Redirecting you to sign in...</p>;
}

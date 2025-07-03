'use client';

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Sign In to BoardCollab</h1>
            <button
                onClick={() => signIn('google')}>
                    Sign in
                </button>
        </div>
    );
}
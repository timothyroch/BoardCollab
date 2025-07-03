'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
}, [status, router])
if (status === 'loading') {
    return <div>Loading...</div>;
}
return (
    <div>
        <h1>Dashboard</h1>
        <p>Welcome, {session?.user?.name}!</p>  
    </div>
)
}
'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    
    return (
        <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-bold">BoardCollab</div>
            <div>
            {session ? (
                <>
                <span className="text-white mr-4">Welcome, {session.user?.name}</span>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Sign Out
                </button>
                </>
            ) : (
                <button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                Sign In
                </button>
            )}
            </div>
        </div>
        </nav>
    );
    }
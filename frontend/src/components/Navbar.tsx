'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
        const logoText = "GitSync".split("").map((letter, index) => (
        <span 
            key={index} 
            className="relative text-amber-400 text-4xl font-bold tracking-tight
                transition-all duration-300 
                [text-shadow:0_2px_4px_rgba(251,191,36,0.4),1px_1px_0_#000,-1px_-1px_0_#000]
                hover:[text-shadow:0_0_12px_rgba(251,191,36,0.7),2px_2px_0_#000]
                before:absolute before:inset-0 before:-z-10
                before:border before:border-amber-400 before:rounded-md
                before:transform before:-skew-x-12 before:opacity-70
                hover:before:opacity-100 hover:before:scale-105"
        >
            {letter}
        </span>
    ));
    
    return (
        <nav className="p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-1">{logoText}</div>
            <div className="flex items-center space-x-8">
            {session ? (
                <>
                <span className="text-amber-200 text-base font-semibold tracking-wide">{session.user?.name}</span>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-amber-300 text-base px-4 py-2 border border-amber-400 rounded-lg 
                                    hover:bg-amber-400 hover:text-black 
                                    transition-all duration-300 ease-in-out
                                    shadow-sm hover:shadow-md"
                >
                    Sign Out
                </button>
                </>
            ) : (
                <button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="bg-amber-400 text-black px-4 py-2.5 rounded-lg font-semibold text-base
                                hover:bg-amber-500 hover:shadow-xl
                                transition-all duration-300 shadow-md"
                >
                Sign In
                </button>
            )}
            </div>
        </div>
        </nav>
    );
    }
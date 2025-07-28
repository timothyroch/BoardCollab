'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
    const { data: session } = useSession();
        const logoText = (
              <Link href="/dashboard" className="flex items-center space-x-1 cursor-pointer">

          {"GitSync".split("").map((letter, index) => (
        <span 
            key={index} 
            className="relative text-white text-4xl font-bold tracking-tight
                transition-all duration-300 
                [text-shadow:0_2px_4px_rgba(255,255,255,0.7),1px_1px_0_#000,-1px_-1px_0_#000]
                hover:[text-shadow:0_2_4px_rgba(255,255,255,0.7),2px_2px_0_#000]
                before:absolute before:inset-0 before:-z-10
                before:border before:border-white before:rounded-md
                before:transform before:-skew-x-12 before:opacity-70
                hover:before:opacity-100 hover:before:scale-105"
        >
            {letter}
        </span>
    ))}
    </Link>
);    
    return (
        <nav className="p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-1">{logoText}</div>
            <div className="flex items-center space-x-8">
            {session ? (
                <>
                <span className="text-white text-base font-semibold tracking-wide">{session.user?.name}</span>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-white text-base px-4 py-2 border border-white rounded-lg 
                                    hover:bg-white hover:text-black 
                                    transition-all duration-300 ease-in-out
                                    shadow-sm hover:shadow-md"
                >
                    Sign Out
                </button>
                </>
            ) : (
                <button
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="bg-white text-black px-4 py-2.5 rounded-lg font-semibold text-base
                                hover:bg-gray-100 hover:shadow-xl
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
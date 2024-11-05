'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { Mail, Github } from 'lucide-react';

function Navbar() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className='flex items-center space-x-2'>
                    <Mail className="h-8 w-8 text-blue-400" />
                    <a href="#" className="text-2xl font-bold mb-4 md:mb-0">Feedify</a>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* GitHub Link */}
                    <a
                        href="https://github.com/imdinnesh/Feedify"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <Github className="h-6 w-6" />
                    </a>

                    {session ? (
                        <>
                            <span className="mr-4">
                            Welcome, {user.username || user.email}
                            </span>
                            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
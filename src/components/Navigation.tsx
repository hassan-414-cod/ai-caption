"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-[1920px] transition-all duration-400 ease-out rounded-2xl border border-white/20 shadow-lg overflow-hidden ${scrolled ? 'bg-white/40 backdrop-blur-md py-1' : 'bg-white/20 backdrop-blur-sm py-2'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none"></div>
      {!scrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none"></div>
      )}
      <div className="container mx-auto px-6 h-16 grid grid-cols-3 items-center max-w-full relative z-10">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">CaptionAI</span>
          </Link>
        </div>

        {/* Center: Main Nav Links */}
        <div className="flex justify-center">
          {user && (
            <div className="hidden sm:flex items-center gap-8">
              <Link href="/dashboard" className="text-lg font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/generator" className="text-lg font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                Generator
              </Link>
              <Link href="/library" className="text-lg font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                Library
              </Link>
              <Link href="/settings" className="text-lg font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                Settings
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Auth Actions */}
        <div className="flex justify-end items-center gap-4">
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-l-full border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => logOut().then(() => router.push('/'))}>
                <img src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'U'}`} alt="Avatar" className="w-6 h-6 rounded-full" />
                <span className="text-xs font-medium text-slate-600">Sign Out</span>
              </div>
              <button 
                onClick={() => logOut().then(() => signInWithGoogle())}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-r-full border border-l-0 border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                Switch
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <button onClick={signInWithGoogle} className="hover:text-indigo-600">Log in</button>
              <button onClick={signInWithGoogle} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">Get Started</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

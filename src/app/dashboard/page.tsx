"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { getUserDashboardStats } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PenLine, Sparkles, Hash, Library as LibraryIcon } from 'lucide-react';


export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [generationsToday, setGenerationsToday] = useState(0);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [agencyStats, setAgencyStats] = useState({ platform: '', tone: '' });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadStats() {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const stats = await getUserDashboardStats(idToken);
        
        setTotalGenerations(stats.totalGenerations);
        setGenerationsToday(stats.generationsToday);

        // Agency stats are still derived from library if needed, but let's keep it simple for now
        // or we could add agency stats to the server action later if requested.
        setDataLoading(false);
      } catch (e) {
        console.error(e);
      } finally {
        setDataLoading(false);
      }
    }
    if (user && profile) {
      loadStats();
    }
  }, [user, profile]);

  if (loading || dataLoading) {
    return <div className="flex-1 flex items-center justify-center p-8">Loading dashboard...</div>;
  }

  const isFree = profile?.plan === 'free';
  const dailyLimit = 5;
  const creditsRemaining = isFree ? Math.max(0, dailyLimit - generationsToday) : 'Unlimited';

  return (
    <div className="w-[96%] mx-auto p-4 pt-32 pb-12 flex flex-col gap-8 animate-bg-gradient min-h-[90vh] relative overflow-hidden rounded-[2.5rem] mt-4 mb-4 border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-texture pointer-events-none opacity-[0.05]"></div>
      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Welcome back, {user?.displayName || 'Creator'}</h1>
            <p className="text-sm text-slate-500 mt-1">Ready to create some thumb-stopping copy?</p>
          </div>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 active:scale-95 transition-all shrink-0 flex items-center" onClick={() => router.push('/generator')}>
            <PenLine className="w-4 h-4 mr-2" /> New Caption
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] border border-white/20 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/50">
            {/* Credits Stat */}
            <div className="flex flex-col items-center text-center px-4">
              <div className="flex items-center gap-3 mb-4 text-slate-500">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Credits</h3>
              </div>
              <div className="text-4xl font-black tracking-tight text-slate-800 mb-2">
                {creditsRemaining}
              </div>
              {isFree && (
                <p className="text-sm text-slate-500">Resets tonight. <button onClick={() => router.push('/settings')} className="text-indigo-600 font-bold hover:underline">Upgrade</button></p>
              )}
              {!isFree && (
                <p className="text-sm text-slate-500">Plan: {profile?.plan}</p>
              )}
            </div>

            {/* Captions Stat */}
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <div className="flex items-center gap-3 mb-4 text-slate-500">
                <LibraryIcon className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Captions</h3>
              </div>
              <div className="text-4xl font-black tracking-tight text-slate-800 mb-2">
                {totalGenerations * 3}
              </div>
              <p className="text-sm text-slate-500">Generated variations</p>
            </div>

            {/* Hashtags Stat */}
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0">
              <div className="flex items-center gap-3 mb-4 text-slate-500">
                <Hash className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Hashtags</h3>
              </div>
              <div className="text-4xl font-black tracking-tight text-slate-800 mb-2">
                {totalGenerations * 15}
              </div>
              <p className="text-sm text-slate-500">Optimized tags</p>
            </div>
          </div>
        </div>
      </div>

      {profile?.plan === 'agency' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50/50 p-6 border-b border-slate-100 mb-6">
            <h2 className="text-lg font-bold text-slate-800">Agency Analytics</h2>
          </div>
          <div className="p-6 pt-0">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Generations</p>
                <div className="text-2xl font-bold mt-2 text-slate-800">{totalGenerations}</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Favorite Platform</p>
                <div className="text-2xl font-bold mt-2 text-slate-800">{agencyStats.platform || 'N/A'}</div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Top Tone</p>
                <div className="text-2xl font-bold mt-2 text-slate-800 truncate">{agencyStats.tone || 'N/A'}</div>
              </div>
            </div>
            
            <div className="h-40 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-sm text-slate-400">
              <Sparkles className="w-6 h-6 mb-2 text-indigo-300" />
              <p className="font-medium text-slate-500">Additional Pro/Agency insights will appear here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

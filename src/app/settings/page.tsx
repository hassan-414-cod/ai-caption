"use client";
import { useAuth } from '../../lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CreditCard, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, profile } = useAuth();

  const handleUpgrade = (targetPlan: string) => {
    // In a real app, this would redirect to a Stripe checkout session.
    // For this prototype, we'll just show a toast message.
    toast.info(`Redirecting to Stripe checkout for ${targetPlan} plan...`);
  };

  const handlePortal = () => {
    toast.info(`Opening Stripe customer portal...`);
  };

  if (!profile) return null;

  return (
    <div className="w-[96%] mx-auto min-h-[90vh] flex flex-col items-center animate-bg-gradient relative overflow-hidden rounded-[2.5rem] mt-4 mb-4 border border-white/20 shadow-2xl">
      <div className="absolute inset-0 bg-texture pointer-events-none opacity-[0.05]"></div>
      <div className="w-[80%] mx-auto p-4 pt-32 pb-16 relative z-10 flex-1">
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <div className="md:col-span-1">
            <div className="h-full bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
              
              <div className="mb-12">
                <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2">Account & Billing</h1>
                <p className="text-sm text-slate-500 leading-relaxed">Manage your plan, subscription details, and profile settings in one place.</p>
              </div>

              <div className="space-y-12 flex-1">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">User Profile</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-2xl border border-indigo-100">
                      {user?.displayName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-xl leading-tight">{user?.displayName}</p>
                      <p className="text-sm text-slate-500 truncate max-w-[200px]">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Current Plan</p>
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      profile.plan === 'free' ? 'bg-white text-slate-600 border border-slate-200' :
                      profile.plan === 'pro' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                      'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    }`}>
                      {profile.plan}
                    </span>
                    {profile.plan === 'free' && (
                      <Badge variant="outline" className="text-[9px] border-amber-200 text-amber-600 bg-amber-50 font-black uppercase tracking-tighter px-3">Free Tier</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-8">
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest text-center">© 2026 CaptionAI Secure Billing</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8 flex flex-col justify-between">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1">
              <h2 className="text-lg font-bold text-slate-800 mb-1">Subscription Status</h2>
              <p className="text-sm text-slate-500 mb-6">
                You are currently on the {profile.plan} plan.
              </p>
              {profile.plan === 'free' && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-1">Upgrade to Pro</h4>
                    <p className="text-sm text-indigo-700">Unlock unlimited generations, image inputs, and Brand Voice.</p>
                  </div>
                  <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm shadow-indigo-200 transition-all shrink-0 w-full sm:w-auto" onClick={() => handleUpgrade('pro')}>
                    Upgrade Now
                  </button>
                </div>
              )}
              {profile.plan !== 'free' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-emerald-600 mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Active Subscription</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-5">Your next billing date is scheduled for {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}.</p>
                  <button className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center" onClick={handlePortal}>
                    <CreditCard className="w-4 h-4 mr-2 text-slate-400" /> Manage Billing Options
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Available Plans</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`flex flex-col bg-white/90 backdrop-blur-sm p-6 rounded-2xl border transition-all ${profile.plan === 'pro' ? 'border-indigo-600 shadow-md shadow-indigo-100 ring-1 ring-indigo-600' : 'border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">Pro Space</h4>
                    {profile.plan === 'pro' && <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Current</span>}
                  </div>
                  <p className="text-indigo-600 font-bold mb-6">$5 <span className="text-sm text-slate-400 font-medium font-normal">/ month</span></p>
                  
                  <div className="text-sm text-slate-600 space-y-3 flex-1 mb-8">
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"/> Unlimited generations</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"/> Up to 30 hashtags</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"/> Image Upload capability</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"/> Custom Brand Voice</p>
                  </div>
                  
                  <button 
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-all ${profile.plan === 'pro' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm'}`} 
                    disabled={profile.plan === 'pro'} 
                    onClick={() => handleUpgrade('pro')}
                  >
                    {profile.plan === 'pro' ? 'Active' : 'Upgrade to Pro'}
                  </button>
                </div>

                <div className={`flex flex-col bg-white/90 backdrop-blur-sm p-6 rounded-2xl border transition-all ${profile.plan === 'agency' ? 'border-indigo-600 shadow-md shadow-indigo-100 ring-1 ring-indigo-600' : 'border-slate-200 shadow-sm'}`}>
                   <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800">Agency Space</h4>
                    {profile.plan === 'agency' && <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">Current</span>}
                  </div>
                  <p className="text-indigo-600 font-bold mb-6">$20 <span className="text-sm text-slate-400 font-medium font-normal">/ month</span></p>
                  
                  <div className="text-sm text-slate-600 space-y-3 flex-1 mb-8">
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-slate-400 shrink-0"/> Everything in Pro</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-slate-400 shrink-0"/> Analytics dashboard</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-slate-400 shrink-0"/> Bulk generation</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-slate-400 shrink-0"/> Team seats</p>
                  </div>
                  
                  <button 
                    className={`w-full py-3 rounded-lg text-sm font-bold transition-all ${profile.plan === 'agency' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm'}`} 
                    disabled={profile.plan === 'agency'} 
                    onClick={() => handleUpgrade('agency')}
                  >
                    {profile.plan === 'agency' ? 'Active' : 'Upgrade to Agency'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

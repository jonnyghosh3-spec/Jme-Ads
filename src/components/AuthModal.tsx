import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GoogleLogo } from './Icons';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  Gift, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check URL query param (?ref=CODE) or pathname (/ref/CODE) for dynamic referral code
  useEffect(() => {
    // 1. Check search params e.g. https://domain.com/?ref=JME8X7K2
    const searchParams = new URLSearchParams(window.location.search);
    const queryRef = searchParams.get('ref');
    if (queryRef && queryRef.trim() !== '') {
      const cleanCode = queryRef.trim().toUpperCase();
      setReferralCode(cleanCode);
      setMode('register');
      localStorage.setItem('jmeads_saved_ref', cleanCode);
      return;
    }

    // 2. Check path e.g. /ref/JME8X7K2
    const path = window.location.pathname;
    if (path.includes('/ref/')) {
      const code = path.split('/ref/')[1]?.split('/')[0];
      if (code && code.trim() !== '') {
        const cleanCode = code.trim().toUpperCase();
        setReferralCode(cleanCode);
        setMode('register');
        localStorage.setItem('jmeads_saved_ref', cleanCode);
        return;
      }
    }

    // 3. Check previously saved ref in localStorage
    const savedRef = localStorage.getItem('jmeads_saved_ref');
    if (savedRef) {
      setReferralCode(savedRef);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim() || !password) {
        showToast('সবগুলো ফিল্ড সঠিকভাবে পূরণ করুন।', 'error');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        showToast('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।', 'error');
        setIsLoading(false);
        return;
      }

      const success = await registerWithEmail(
        name.trim(), 
        email.trim(), 
        password, 
        phone.trim(), 
        referralCode.trim() || undefined
      );

      if (success) {
        showToast('রেজিস্ট্রেশন সফল হয়েছে! স্বাগতম।', 'success');
      }
    } else {
      if (!email.trim() || !password) {
        showToast('ইমেইল ও পাসওয়ার্ড প্রদান করুন।', 'error');
        setIsLoading(false);
        return;
      }
      const success = await loginWithEmail(email.trim(), password);
      if (success) {
        showToast('সফলভাবে লগইন হয়েছে!', 'success');
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await loginWithGoogle(referralCode.trim() || undefined);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-4">
        
        {/* Brand Header - Text Only, No separate logo icon as requested */}
        <div className="text-center space-y-2">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-english">
                JME<span className="text-emerald-400">Ads</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-emerald-300 border border-emerald-500/30">
                BD
              </span>
            </div>
            <p className="text-xs text-emerald-200 font-medium">
              বাংলাদেশের বিশ্বস্ত ও নির্ভরযোগ্য আর্নিং প্ল্যাটফর্ম
            </p>
          </div>

          {/* Social Proof badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>৫০,০০০+ সক্রিয় ইউজার • বিকাশ ও নগদে পেমেন্ট</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-100 p-6 shadow-2xl space-y-4">
          
          {/* Mode Tabs */}
          <div className="flex bg-emerald-50/80 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                mode === 'login' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-950 hover:text-emerald-700'
              }`}
            >
              লগইন করুন
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                mode === 'register' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-950 hover:text-emerald-700'
              }`}
            >
              নতুন একাউন্ট খুলুন
            </button>
          </div>

          {referralCode && mode === 'register' && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  রেফারেল কোড: <strong className="font-english font-bold text-emerald-800">{referralCode}</strong> সক্রিয়!
                </span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                বোনাস নিশ্চিত
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">আপনার পূর্ণ নাম</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ সাকিব আহমেদ"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">মোবাইল নম্বর (বিকাশ/নগদ)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল ঠিকানা (যেমন: yourname@gmail.com)</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">রেফারেল কোড (ঐচ্ছিক)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="JME8X7K2"
                    value={referralCode}
                    onChange={e => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                  />
                  <Gift className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'অনুগ্রহ করে অপেক্ষা করুন...' : mode === 'login' ? 'লগইন করুন' : 'নিবন্ধন সম্পন্ন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 uppercase font-bold absolute">অথবা</span>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all"
          >
            <GoogleLogo className="w-4 h-4" />
            <span>Google দিয়ে সাইন ইন করুন</span>
          </button>

        </div>

      </div>
    </div>
  );
};
